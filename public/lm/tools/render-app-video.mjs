// Ролик для телефона на S0: список вопросов → тап → вопрос с ответами → пролистывание → назад (цикл), uk и en.
// Снимается покадрово из демо реального интерфейса (экраны 9 и 10), 30 к/с, экран 420×955 CSS при DPR 2.
// Таб-бар — полная картинка владельца assets/app/tabbar@2x.png (без флага), поверх контента, с индикатором «домой».
// Запуск: node tools/render-app-video.mjs [путь к ask-question-demo.html]  → assets/app/flow-<loc>.mp4|webm|jpg
import { chromium } from '/Users/mac/cabinetUR/video/node_modules/playwright/index.mjs';
import fs from 'node:fs'; import path from 'node:path'; import { execSync } from 'node:child_process';
const DEMO = process.argv[2] || '/Users/mac/VOPROS/consultant-demo/ask-question-demo.html';
const HERE = path.dirname(new URL(import.meta.url).pathname), ROOT = path.dirname(HERE), OUT = path.join(ROOT, 'assets/app');
const PH = (n) => 'file://' + path.join(ROOT, 'assets/people/m', n + '.jpg');
const TEXT = {
  uk: { orders: 'Мої замовлення', chips: ['Консультації', 'Документи', 'Послуги', 'Чеки'], status: 'Статус:', order: 'Замовити послугу', best: 'Найкраща відповідь',
    list: [
      { date: '01.07.2026 18:04', q: 'Чи можу я отримати компенсацію за неправомірне затримання через помилку в базі даних?', st: 'Відкрито', avatars: [PH('11'), PH('23'), PH('03')] },
      { date: '28.06.2026 11:20', q: 'Як оскаржити штраф за паркування, виписаний помилково?', st: 'Є відповіді', avatars: [PH('09')] },
      { date: '19.06.2026 09:45', q: 'Чи можна повернути передоплату за неякісний ремонт квартири?', st: 'Закрито', closed: true, avatars: [PH('16'), PH('20')] },
      { date: '03.06.2026 16:10', q: 'Що робити, якщо орендодавець не повертає депозит?', st: 'Закрито', closed: true, avatars: [PH('12')] } ],
    qnum: 'Питання №14237', qdate: '01 липня 2026, 18:04', qtitle: 'Чи можу я отримати компенсацію за неправомірне затримання через помилку в базі даних?',
    qbody: 'Мене зупинили під час планової перевірки й затримали, бо в базі поліції я помилково значився як розшукуваний.',
    answers: [
      { band: 'BASE (Base)', score: '35.68', name: 'Асистент Андрій', role: 'Штучний інтелект', loc: 'Україна', ts: '01.07.2026, 18:05', photo: 'file:///Users/mac/VOPROS/consultant-demo/assets/andrey.jpg', text: 'Компенсацію за незаконне затримання можна вимагати за нормами про відшкодування шкоди, завданої органами влади.' },
      { band: 'PREMIUM', score: '92.4', name: 'Олена Коваль', role: 'Адвокат', loc: 'Київ, Україна', ts: '01.07.2026, 18:32', photo: PH('23'), text: 'Так, підстави є. Готова підготувати позов про відшкодування моральної шкоди та втраченого заробітку.' },
      { band: 'PRO', score: '88.7', name: 'Максим Ткаченко', role: 'Юрист', loc: 'Львів, Україна', ts: '01.07.2026, 19:10', photo: PH('03'), text: 'Спершу зафіксуйте факт помилки в базі: запросіть довідку з поліції та підтвердження звільнення.' } ] },
  en: { orders: 'My orders', chips: ['Consultations', 'Documents', 'Services', 'Checks'], status: 'Status:', order: 'Order the service', best: 'Best answer',
    list: [
      { date: '07/01/2026 18:04', q: 'Can I claim compensation for being wrongfully arrested due to a database error?', st: 'Opened', avatars: [PH('11'), PH('23'), PH('03')] },
      { date: '06/28/2026 11:20', q: 'How do I appeal a parking fine that was issued by mistake?', st: 'Answered', avatars: [PH('09')] },
      { date: '06/19/2026 09:45', q: 'Can I get a prepayment back for poor-quality apartment repairs?', st: 'Closed', closed: true, avatars: [PH('16'), PH('20')] },
      { date: '06/03/2026 16:10', q: 'What can I do if my landlord will not return the deposit?', st: 'Closed', closed: true, avatars: [PH('12')] } ],
    qnum: 'Question #14237', qdate: '01 July, 2026 18:04', qtitle: 'Can I claim compensation for being wrongfully arrested and held in custody due to a database error?',
    qbody: 'I was stopped during a routine police check and arrested because a police database wrongly listed me as wanted.',
    answers: [
      { band: 'BASE (Base)', score: '35.68', name: 'Assistant Andrey', role: 'Artificial Intelligence', loc: 'USA', ts: '07/01/2026, 18:05', photo: 'file:///Users/mac/VOPROS/consultant-demo/assets/andrey.jpg', text: 'Compensation for wrongful detention can be claimed under the rules on damages caused by public authorities.' },
      { band: 'PREMIUM', score: '92.4', name: 'Sarah Mitchell', role: 'Attorney', loc: 'New York, USA', ts: '07/01/2026, 18:32', photo: PH('23'), text: 'Yes, you have grounds. I can prepare a claim for moral damages and lost earnings.' },
      { band: 'PRO', score: '88.7', name: 'James Cooper', role: 'Attorney', loc: 'Chicago, USA', ts: '07/01/2026, 19:10', photo: PH('03'), text: 'First, document the database error: request the police record and confirmation of your release.' } ] }
};
const FPS = 30, PLAN = [['list', 48], ['tap', 15], ['in', 15], ['hold', 30], ['scroll', 150], ['hold', 30], ['out', 15], ['list', 36]];
const ease = { out: p => 1 - Math.pow(1 - p, 3), inout: p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2, in: p => p * p * p };
const browser = await chromium.launch();
for (const loc of Object.keys(TEXT)) {
  const dir = path.join(HERE, '_frames', loc); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const p = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  await p.goto('file://' + DEMO, { waitUntil: 'networkidle' }); await p.waitForTimeout(1000);
  await p.addStyleTag({ content: `*, *::before, *::after { transition: none !important; animation: none !important; }
    .s9__list { position:absolute; top:128px; left:20px; right:20px; bottom:74px; display:grid; gap:12px; align-content:start; }
    .s9__list .s9__card { position:static; }
    .tabbar { height: 108.6px !important; background: #fff url(file:///Users/mac/consultantlm-quiz/assets/app/tabbar@2x.png) top center / 100% auto no-repeat !important; }
    .tabbar .badge, .tabbar__home, .ua-flag { display: none !important; }
    .s10__scroll { bottom: 108px !important; }
    .s9__list { bottom: 112px !important; }
    .ua-flag-unused { position:absolute; left:223.5px; top:27px; width:19.5px; height:14.5px; border-radius:2px; background:linear-gradient(#005bbb 0 50%, #ffd500 50% 100%); box-shadow:0 0 0 1px #fff; }
    .dim { position:absolute; inset:0; background:#000; opacity:0; z-index:60; pointer-events:none; }
    .tapdot { position:absolute; z-index:80; width:54px; height:54px; margin:-27px 0 0 -27px; border-radius:50%; background:radial-gradient(circle, rgba(41,163,224,.55) 0%, rgba(41,163,224,0) 70%); opacity:0; pointer-events:none; }` });
  const geo = await p.evaluate(({ T, loc }) => {
    const vp = document.querySelector('.viewport'); const q = (r, s) => r.querySelector(s);
    const s9 = q(vp, '.screen[data-screen="9"]'), s10 = q(vp, '.screen[data-screen="10"]');
    vp.querySelectorAll('.screen').forEach(e => { e.classList.remove('is-on', 'is-leaving'); });
    s9.classList.add('is-on'); s10.classList.add('is-on'); s10.style.zIndex = '3'; s10.style.opacity = '1'; s10.style.transform = 'translateX(420px)';
    const dim = document.createElement('div'); dim.className = 'dim'; s9.appendChild(dim);
    q(s9, '.s9__hd b').textContent = T.orders; [...s9.querySelectorAll('.s9__chip')].forEach((c, i) => c.textContent = T.chips[i]);
    const tpl = q(s9, '.s9__card'), list = document.createElement('div'); list.className = 's9__list';
    T.list.forEach(it => { const c = tpl.cloneNode(true); q(c, '.s9__date span').textContent = it.date; q(c, '.s9__qt').textContent = it.q;
      q(c, '.s9__st').innerHTML = T.status + ' <b' + (it.closed ? ' style="color:#9aa3ad"' : '') + '>' + it.st + '</b>';
      q(c, '.s9__av').innerHTML = it.avatars.map(s => '<span><img src="' + s + '" alt="" style="width:100%;height:100%;object-fit:cover"></span>').join(''); list.appendChild(c); });
    tpl.replaceWith(list);
    q(s10, '.s10__bar b').textContent = T.qnum; q(s10, '.card__date span').textContent = T.qdate; q(s10, '.card__qt').textContent = T.qtitle; q(s10, '.card__body').textContent = T.qbody;
    const inner = q(s10, '#threadInner'), all = [...inner.querySelectorAll('.ans')], proto = all[0]; all.slice(1).forEach(a => a.remove());
    T.answers.forEach(a => { const el = proto.cloneNode(true); q(el, '.base').textContent = a.band; const sc = q(el, '.score'); sc.lastChild.textContent = a.score;
      q(el, '.ans__name b').textContent = a.name; q(el, '.ans__name i').textContent = a.role; q(el, '.ans__loc').lastChild.textContent = a.loc; q(el, '.ans__ts').textContent = a.ts; q(el, '.ans__txt').textContent = a.text;
      q(el, '.ans__av').innerHTML = '<img src="' + a.photo + '" alt="" style="width:100%;height:100%;object-fit:cover">';
      const b = el.querySelectorAll('.ans__btn'); b[0].lastChild.textContent = T.order; b[1].lastChild.textContent = T.best; inner.appendChild(el); });
    proto.remove(); inner.style.transform = 'translateY(0)';
    const tap = document.createElement('div'); tap.className = 'tapdot'; s9.appendChild(tap);
    const first = list.firstElementChild.getBoundingClientRect(), scr = document.querySelector('.phone__screen').getBoundingClientRect();
    return { tapX: first.left + first.width * .5 - scr.left, tapY: first.top + first.height * .5 - scr.top, maxY: inner.scrollHeight - q(s10, '.s10__scroll').clientHeight, listH: list.scrollHeight };
  }, { T: TEXT[loc], loc });
  console.log(loc, 'geometry', JSON.stringify(geo));
  await p.waitForTimeout(600); // фото
  const screen = p.locator('.phone__screen'); let n = 0;
  for (const [ph, count] of PLAN) for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 1;
    await p.evaluate(({ ph, t, g }) => {
      const vp = document.querySelector('.viewport'), s9 = vp.querySelector('.screen[data-screen="9"]'), s10 = vp.querySelector('.screen[data-screen="10"]');
      const tap = s9.querySelector('.tapdot'), card = s9.querySelector('.s9__list').firstElementChild, inner = s10.querySelector('#threadInner'), dim = s9.querySelector('.dim');
      const W = 420, push = k => { s10.style.transform = 'translateX(' + (W * (1 - k)) + 'px)'; s9.style.transform = 'translateX(' + (-0.28 * W * k) + 'px)'; dim.style.opacity = String(0.18 * k); };
      const eo = p => 1 - Math.pow(1 - p, 3), ei = p => p * p * p, eio = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      if (ph === 'list') { push(0); tap.style.opacity = '0'; card.style.transform = ''; inner.style.transform = 'translateY(0)'; }
      if (ph === 'tap') { tap.style.left = g.tapX + 'px'; tap.style.top = g.tapY + 'px'; tap.style.opacity = String(0.9 * (1 - t)); tap.style.transform = 'scale(' + (0.5 + 1.3 * t) + ')'; card.style.transform = t < 0.5 ? 'scale(.98)' : ''; }
      if (ph === 'in') { push(eo(t)); tap.style.opacity = '0'; card.style.transform = ''; inner.style.transform = 'translateY(0)'; }
      if (ph === 'hold') { push(1); }
      if (ph === 'scroll') { inner.style.transform = 'translateY(' + (-Math.max(0, g.maxY) * eio(t)) + 'px)'; }
      if (ph === 'out') { push(1 - ei(t)); }
    }, { ph, t, g: geo });
    await screen.screenshot({ path: path.join(dir, `f${String(++n).padStart(4, '0')}.png`) });
  }
  await p.close();
  const ff = '/opt/homebrew/bin/ffmpeg -y -loglevel error';
  execSync(`${ff} -framerate ${FPS} -i "${dir}/f%04d.png" -vf "scale=720:-2,format=yuv420p" -c:v libx264 -profile:v main -crf 23 -movflags +faststart "${OUT}/flow-${loc}.mp4"`);
  execSync(`${ff} -framerate ${FPS} -i "${dir}/f%04d.png" -vf "scale=720:-2" -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -pix_fmt yuv420p "${OUT}/flow-${loc}.webm"`);
  execSync(`${ff} -i "${dir}/f0001.png" -vf "scale=720:-2" -q:v 4 "${OUT}/flow-${loc}.jpg"`);
  for (const ext of ['mp4', 'webm', 'jpg']) console.log(loc, ext, Math.round(fs.statSync(`${OUT}/flow-${loc}.${ext}`).size / 1024) + ' KB');
  console.log(loc, 'frames', n, 'duration', (n / FPS).toFixed(1) + 's');
  fs.rmSync(dir, { recursive: true, force: true }); // кадры после кодирования не нужны
}
await browser.close();
