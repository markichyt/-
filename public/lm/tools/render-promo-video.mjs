// Промо-ролик: вопрос клиента → ответы юристов с реальными кейсами. Озвучка + звуки интерфейса.
// Сцена — tools/promo/promo.html (?lang=uk|ru|en&fmt=v|sq), кадр задаётся window.seek(t) → покадровая точная съёмка.
// Озвучка: edge-tts (tools/.venv), голос и тексты — в tools/promo/i18n.js. Если фраза длиннее блока,
// сцена «замирает» в спокойной точке блока (HOLD_AT) ровно на нужное время — речь никогда не обрезается.
// Запуск: node tools/render-promo-video.mjs [uk,ru,en] [v,sq]   → export/promo/consultant-promo-<lang>-<9x16|1x1>.mp4
//         STILLS=1,15 node tools/render-promo-video.mjs ru sq     → только кадры (секунды сцены без пауз)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'node:fs'; import path from 'node:path'; import { execSync } from 'node:child_process';
const HERE = path.dirname(new URL(import.meta.url).pathname), ROOT = path.dirname(HERE), PROMO = path.join(HERE, 'promo');
const OUT = process.env.OUT_DIR || path.join(ROOT, 'export/promo'); fs.mkdirSync(OUT, { recursive: true });
const LANGS = (process.argv[2] || 'uk,ru,en').split(','), FMTS = (process.argv[3] || 'v,sq').split(',');
const FPS = 30, STILLS = process.env.STILLS, FF = '/opt/homebrew/bin/ffmpeg -y -loglevel error';
const CAP_T = [[0.5, 3.4], [3.8, 9.5], [9.9, 13.4], [13.8, 19.9], [20.3, 25.3], [26.0, 31.5]];  // как в promo.html
const HOLD_AT = [2.0, 8.85, 11.35, 17.4, 23.0, 29.0];     // спокойные точки каждого блока
const VO_LEAD = 0.15, VO_TAIL = 0.2, END_TAIL = 0.9;
// звуки интерфейса (секунды сцены)
const SFX = [['tap', 2.35], ['tap', 9.0], ['ding', 10.0], ['pop', 14.55], ['whoosh', 15.85], ['whoosh2', 18.65], ['ding', 19.75], ['pop', 21.75], ['tap', 24.35], ['pop', 27.0]];
const I18N = (() => { const w = {}; new Function('window', fs.readFileSync(path.join(PROMO, 'i18n.js'), 'utf8'))(w); return w.I18N; })();
const dur = f => parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${f}"`).toString());

function sfxFiles() {
  const d = path.join(PROMO, 'sfx'); fs.mkdirSync(d, { recursive: true });
  const defs = {
    tap: `aevalsrc='0.5*sin(2*PI*1500*t)*exp(-70*t)+0.25*sin(2*PI*3000*t)*exp(-90*t)':d=0.12`,
    pop: `aevalsrc='0.45*sin(2*PI*(520+900*exp(-30*t))*t)*exp(-22*t)':d=0.25`,
    ding: `aevalsrc='0.28*(sin(2*PI*1318.5*t)+0.5*sin(2*PI*1975.5*t))*exp(-5*t)+0.22*gte(t\\,0.11)*sin(2*PI*1760*(t-0.11))*exp(-5*(t-0.11))':d=1.0`,
    whoosh: `anoisesrc=d=0.75:c=pink:a=0.6,bandpass=f=900:w=1.2,afade=t=in:d=0.38:curve=qsin,afade=t=out:st=0.38:d=0.37:curve=qsin`,
    whoosh2: `anoisesrc=d=0.6:c=pink:a=0.4,bandpass=f=600:w=1.2,afade=t=in:d=0.3:curve=qsin,afade=t=out:st=0.3:d=0.3:curve=qsin`,
  };
  for (const [k, src] of Object.entries(defs)) { const f = path.join(d, k + '.wav'); if (!fs.existsSync(f)) execSync(`${FF} -f lavfi -i "${src}" -ar 48000 -ac 1 "${f}"`); }
  return d;
}

function voiceover(lang) {
  const L = I18N[lang], d = path.join(PROMO, 'vo'); fs.mkdirSync(d, { recursive: true });
  return L.vo.map((line, i) => {
    const raw = path.join(d, `${lang}-${i + 1}.mp3`), f = raw.replace('.mp3', '.wav'), meta = raw + '.txt';
    const key = L.voice + '|' + line;
    if (!fs.existsSync(f) || !fs.existsSync(meta) || fs.readFileSync(meta, 'utf8') !== key) {
      fs.writeFileSync(path.join(d, 'line.txt'), line);
      for (let k = 1; ; k++) {  // сервис иногда сбрасывает соединение — повторяем
        try { execSync(`"${HERE}/.venv/bin/edge-tts" --voice ${L.voice} --rate=+4% -f "${d}/line.txt" --write-media "${raw}"`, { stdio: 'pipe' }); break; }
        catch (e) { if (k >= 6) throw e; execSync('sleep ' + 2 * k); }
      }
      // тишину по краям — прочь, длинные паузы внутри фразы — до 0,3 с
      execSync(`${FF} -i "${raw}" -af "silenceremove=start_periods=1:start_threshold=-45dB,silenceremove=stop_periods=-1:stop_duration=0.3:stop_threshold=-45dB:stop_silence=0.28,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse" -ar 48000 "${f}"`);
      fs.writeFileSync(meta, key);
    }
    return { f, d: dur(f) };
  });
}

function plan(vo) {  // паузы, чтобы каждая фраза уложилась в свой блок
  const holds = vo.map((v, i) => {
    const [a, b] = CAP_T[i], need = a + VO_LEAD + v.d + (i === 5 ? END_TAIL : VO_TAIL) - b;
    return [HOLD_AT[i], Math.max(0, Math.ceil(need * 30) / 30)];
  });
  const real = s => s + holds.filter(([at]) => at < s).reduce((x, h) => x + h[1], 0);
  return { holds, real, total: 31.5 + holds.reduce((x, h) => x + h[1], 0) };
}

const browser = await chromium.launch();
for (const lang of LANGS) for (const fmt of FMTS) {
  const sq = fmt === 'sq', tag = `${lang}-${sq ? '1x1' : '9x16'}`;
  const vo = voiceover(lang), P = plan(vo);
  console.log(tag, 'VO', vo.map(v => v.d.toFixed(2)).join(' '), '| паузы', P.holds.filter(h => h[1]).map(h => `${h[0]}:+${h[1].toFixed(2)}`).join(' ') || '—', '| длительность', P.total.toFixed(1) + 's');
  const holdsQ = P.holds.filter(h => h[1] > 0).map(h => h.join(':')).join(',');
  const p = await browser.newPage({ viewport: { width: 540, height: sq ? 540 : 960 }, deviceScaleFactor: 2 });
  await p.goto(`file://${PROMO}/promo.html?render&lang=${lang}&fmt=${fmt}&holds=${holdsQ}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => window.ready);
  if (STILLS) {
    for (const s of STILLS.split(',').map(Number)) { await p.evaluate(t => window.seek(t), P.real(s)); await p.screenshot({ path: path.join(OUT, `still-${tag}-${String(s).padStart(5, '0')}.png`) }); }
    await p.close(); continue;
  }
  const dir = path.join(HERE, '_frames', 'promo-' + tag); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const N = Math.round(P.total * FPS);
  for (let i = 0; i < N; i++) {
    await p.evaluate(t => window.seek(t), i / FPS);
    await p.screenshot({ path: path.join(dir, `f${String(i + 1).padStart(4, '0')}.png`) });
  }
  await p.close();
  // звук: озвучка + тихие звуки интерфейса → громкость под соцсети (-16 LUFS)
  const sd = sfxFiles(), inputs = [], chains = [];
  vo.forEach((v, i) => { inputs.push(`-i "${v.f}"`); chains.push(`[${inputs.length - 1}:a]aresample=48000,adelay=${Math.round((P.real(CAP_T[i][0]) + VO_LEAD) * 1000)}:all=1,volume=1.0[s${inputs.length - 1}]`); });
  SFX.forEach(([k, s]) => { inputs.push(`-i "${sd}/${k}.wav"`); chains.push(`[${inputs.length - 1}:a]adelay=${Math.round(P.real(s) * 1000)}:all=1,volume=${k.startsWith('whoosh') ? 0.35 : 0.22}[s${inputs.length - 1}]`); });
  const mix = `${chains.join(';')};${inputs.map((_, i) => `[s${i}]`).join('')}amix=inputs=${inputs.length}:normalize=0,apad,atrim=0:${P.total.toFixed(3)},loudnorm=I=-16:TP=-1.5:LRA=11[a]`;
  const wav = path.join(dir, 'audio.wav');
  execSync(`${FF} ${inputs.join(' ')} -filter_complex "${mix}" -map "[a]" -ar 48000 -ac 2 "${wav}"`);
  const base = path.join(OUT, `consultant-promo-${tag}`);
  execSync(`${FF} -framerate ${FPS} -i "${dir}/f%04d.png" -i "${wav}" -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 17 -preset slow -c:a aac -b:a 192k -shortest -movflags +faststart "${base}.mp4"`);
  execSync(`${FF} -i "${dir}/f${String(Math.round(P.real(16.8) * FPS)).padStart(4, '0')}.png" -q:v 3 "${base}.jpg"`);
  console.log(tag, '→', path.basename(base) + '.mp4', Math.round(fs.statSync(base + '.mp4').size / 1024) + ' KB');
  fs.rmSync(dir, { recursive: true, force: true });
}
await browser.close();
