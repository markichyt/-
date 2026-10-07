// Відеотуторіал для фінального екрана S16: сторінка в App Store → встановлення → перший екран застосунку →
// авторизація за номером (клавіатура) → код із SMS → «Мої замовлення» → своє питання з відповідями (цикл). uk і en.
// Екрани 1, 2, 3, 9, 10 — з демо реального інтерфейсу; App Store, авторизація і код — накладки за реальними скринами застосунку (29.09.2026).
// Логотип скрізь латиницею: consultant-lm_logo_en_on-dark_R.svg (uk) / _TM (en). Запуск: node tools/render-install-video.mjs → assets/app/install-<loc>.mp4|webm|jpg
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');  // npm i -D playwright && npx playwright install chromium (у корені проєкту)
import fs from 'node:fs'; import path from 'node:path'; import { execSync } from 'node:child_process';
const DEMO = process.argv[2] || '/Users/mac/VOPROS/consultant-demo/ask-question-demo.html';
const HERE = path.dirname(new URL(import.meta.url).pathname), ROOT = path.dirname(HERE), OUT = path.join(ROOT, 'assets/app');
const RP = (n) => 'file://' + path.join(ROOT, 'assets/people', n + '.jpg');
const AI = 'file:///Users/mac/VOPROS/consultant-demo/assets/andrey.jpg', AI_US = 'file:///Users/mac/VOPROS/consultant-demo/assets/emily.jpg';
const USP = (slug) => 'file://' + path.join(ROOT, 'assets/people/us/av', slug + '.jpg');  // реальні фахівці consultantlm.com
const LOGO = (f) => 'file://' + path.join(ROOT, 'design-system/assets/logo', f);
const TEXT = {
  uk: {
    lockup: LOGO('consultant-lm_logo_en_on-dark_R.svg'), sign: LOGO('consultant-lm_logo_sign_on-dark_clean.svg'),
    yourQ: 'Ваше питання', orders: 'Мої замовлення', chips: ['Консультації', 'Документи', 'Послуги', 'Кейси'], status: 'Статус:', order: 'Замовити послугу', best: 'Найкраща відповідь', fresh: 'Нове',
    store: { back: 'Пошук', title: 'ConsultantLM', sub: 'Юридичний маркетплейс', get: 'ОТРИМАТИ', open: 'ВІДКРИТИ', meta: [['4,8', '592 оцінки'], ['4+', 'Вік'], ['Юридичні', 'Категорія']],
      preview: 'Попередній перегляд', desc: 'Безкоштовний AI-аналіз ситуації, відповіді кількох юристів, послуги з етапами та точною ціною.', tabs: ['Сьогодні', 'Ігри', 'Застосунки', 'Arcade', 'Пошук'] },
    hero: { tag: 'Юрист завжди поруч!', pills: ['Індивідуальні консультації', 'Завантажити документ', 'Замовити послугу', 'Обрати фахівця'] },
    auth: { h: 'Авторизація', p: 'клієнта за номером телефону', pre: '+380', ph: '0000 00000', digits: '671234567', groups: [2, 3, 2, 2], hint: 'На цей номер буде відправлений код авторизації', btn: 'Отримати код',
      legal: 'Продовжуючи, Ви приймаєте ', legalLink: 'Угоду користувача', done: 'Готово', codeH: 'Введіть код з SMS', codeP: 'Код надіслано на ', codeNum: '+380 67 123 45 67', code: '4812', resend: 'Надіслати код повторно через 0:59', authBtn: 'Авторизуватися' },
    list: [
      { date: '01.07.2026 18:04', q: 'Ми вирішили розлучитися, є двоє дітей, не можемо домовитися про опіку та поділ майна', st: 'Відкрито', avatars: [RP('st'), RP('mo'), RP('po')], fresh: true },
      { date: '28.06.2026 11:20', q: 'Як оскаржити штраф за паркування, виписаний помилково?', st: 'Є відповіді', avatars: [RP('hr')] },
      { date: '19.06.2026 09:45', q: 'Чи можна повернути передоплату за неякісний ремонт квартири?', st: 'Закрито', closed: true, avatars: [RP('od'), RP('bo')] },
      { date: '03.06.2026 16:10', q: 'Що робити, якщо орендодавець не повертає депозит?', st: 'Закрито', closed: true, avatars: [RP('st')] } ],
    qnum: 'Питання №14238', qdate: '01 липня 2026, 18:04', qtitle: 'Розлучення, двоє дітей: опіка та поділ майна',
    qbody: 'Ми вирішили розлучитися, є двоє дітей, не можемо домовитися про опіку та поділ майна.',
    answers: [
      { band: 'BASE (Base)', score: '35.68', name: 'Асистент Андрій', role: 'Штучний інтелект', loc: 'Україна', ts: '01.07.2026, 18:05', photo: AI, text: 'Місце проживання дітей визначають за згодою батьків або через суд. Майно, набуте у шлюбі, ділиться порівну, якщо не доведено інше.' },
      { band: 'PREMIUM', score: '76.37', name: 'Студенцов Олександр', role: 'Юрист', loc: 'Київ, Україна', ts: '01.07.2026, 18:32', photo: RP('st'), text: 'Пропоную позасудовий шлях: нотаріальний договір про поділ майна і графік спілкування з дітьми. Це швидше й дешевше за суд.' },
      { band: 'PREMIUM', score: '42.28', name: 'Молчанов Олег', role: 'Адвокат', loc: 'Київ, Україна', ts: '01.07.2026, 19:10', photo: RP('mo'), text: 'Радив би одразу готувати позов: зафіксуйте доходи та майно, зберіть докази участі у вихованні — це посилить позицію.' } ] },
  en: {
    lockup: LOGO('consultant-lm_logo_en_on-dark_TM.svg'), sign: LOGO('consultant-lm_logo_sign_on-dark_clean.svg'),
    yourQ: 'Your question', orders: 'My orders', chips: ['Consultations', 'Documents', 'Services', 'Cases'], status: 'Status:', order: 'Order the service', best: 'Best answer', fresh: 'New',
    store: { back: 'Search', title: 'ConsultantLM', sub: 'Legal marketplace', get: 'GET', open: 'OPEN', meta: [['4.8', '592 ratings'], ['4+', 'Age'], ['Legal', 'Category']],
      preview: 'Preview', desc: 'Free AI analysis of your situation, answers from several lawyers, services with stages and exact prices.', tabs: ['Today', 'Games', 'Apps', 'Arcade', 'Search'] },
    hero: { tag: 'A lawyer is always there for you!', pills: ['Individual consultations', 'Download document', 'Order the service', 'Select specialist'] },
    auth: { h: 'Authorization', p: 'of the client by phone number', pre: '+1', ph: '000 000 0000', digits: '2125550123', groups: [3, 3, 4], hint: 'We will send an authorization code to this number', btn: 'Get the code',
      legal: 'By continuing you accept the ', legalLink: 'User Agreement', done: 'Done', codeH: 'Enter the code from SMS', codeP: 'Code sent to ', codeNum: '+1 212 555 0123', code: '4812', resend: 'Resend the code in 0:59', authBtn: 'Authorize' },
    list: [
      { date: '07/01/2026 18:04', q: 'We decided to divorce, we have two children and cannot agree on custody and the division of property', st: 'Opened', avatars: [USP('chochla-basil'), USP('mizrahi-karen'), USP('phylypchyk-svitlana')], fresh: true },
      { date: '06/28/2026 11:20', q: 'How do I appeal a parking fine that was issued by mistake?', st: 'Answered', avatars: [USP('khidoyatov-miraziz')] },
      { date: '06/19/2026 09:45', q: 'Can I get a prepayment back for poor-quality apartment repairs?', st: 'Closed', closed: true, avatars: [USP('bukovskaya-yulianna'), USP('artemieva-nataliia')] },
      { date: '06/03/2026 16:10', q: 'What can I do if my landlord will not return the deposit?', st: 'Closed', closed: true, avatars: [USP('chochla-basil')] } ],
    qnum: 'Question #14238', qdate: '01 July, 2026 18:04', qtitle: 'Divorce with two children: custody and division of property',
    qbody: 'We decided to divorce, we have two children and cannot agree on custody and the division of property.',
    answers: [
      { band: 'BASE (Base)', score: '35.68', name: 'Assistant Emily', role: 'Artificial Intelligence', loc: 'USA', ts: '07/01/2026, 18:05', photo: AI_US, text: 'Custody is set by agreement of the parents or by the court. Property acquired during the marriage is divided equally unless proven otherwise.' },
      { band: 'PREMIUM', score: '22.38', name: 'Basil Chochla', role: 'Lawyer', loc: 'New York, USA', ts: '07/01/2026, 18:32', photo: USP('chochla-basil'), text: 'I suggest an out-of-court route: a notarised property agreement and a visitation schedule. It is faster and cheaper than court.' },
      { band: 'PRO', score: '33.23', name: 'Oleksii Tarasenko', role: 'Consultant', loc: 'Henderson, USA', ts: '07/01/2026, 19:10', photo: USP('consultant-1160'), text: 'I would prepare a claim right away: document income and assets and collect proof of your role in raising the children.' } ] }
};
const FPS = 30;
const PLAN = [['store', 36], ['tapget', 12], ['progress', 42], ['open', 15], ['tapopen', 12], ['splash', 15], ['heroin', 12], ['hero', 33], ['taptab', 15],
  ['authin', 12], ['typing', 42], ['tapcode', 12], ['codein', 12], ['code', 36], ['tapauth', 12], ['listin', 15], ['list', 48], ['tap', 15], ['in', 15], ['hold', 24], ['scroll', 84], ['hold2', 30], ['fadeout', 15]];
const STAGE = { store: 1, tapget: 1, progress: 1, open: 1, tapopen: 1, splash: 2, heroin: 3, hero: 3, taptab: 3, authin: 4, typing: 4, tapcode: 4, codein: 5, code: 5, tapauth: 5, listin: 6, list: 6, tap: 6, in: 7, hold: 7, scroll: 7, hold2: 7, fadeout: 7 };
const CSS = `*, *::before, *::after { transition: none !important; animation: none !important; }
.s9__list { position:absolute; top:128px; left:20px; right:20px; bottom:112px; display:grid; gap:12px; align-content:start; }
.s9__list .s9__card { position:relative; top:auto; left:auto; right:auto; bottom:auto; }
.s9__spot { position:absolute; border-radius:16px; box-shadow: 0 0 0 9999px rgba(0,0,0,.6); z-index:50; opacity:0; pointer-events:none; }
.s9__label { position:absolute; left:0; right:0; z-index:51; display:grid; justify-items:center; gap:6px; color:#fff; font-size:30px; font-weight:800; letter-spacing:-.3px; text-align:center; opacity:0; pointer-events:none; } .s9__label svg { width:34px; height:34px; }
.s9__fresh { position:absolute; right:14px; bottom:14px; padding:3px 9px; border-radius:999px; background:#1097D8; color:#fff; font-size:11px; font-weight:700; letter-spacing:.3px; }
.tabbar { height: 108.6px !important; background: #fff url(file:///Users/mac/consultantlm-quiz/assets/app/tabbar@2x.png) top center / 100% auto no-repeat !important; }
.tabbar .badge, .tabbar__home, .ua-flag { display: none !important; }
.s10__scroll { bottom: 108px !important; }
.premium { display:none !important; }
.hero__logo img { display:block; margin:0 auto; width:250px; height:auto; }
.s2 .mark img { width:230px; height:auto; display:block; }
.ov { position:absolute; inset:0; background:#fff; opacity:0; visibility:hidden; z-index:40; color:#111; font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Segoe UI",Roboto,Helvetica,Arial,sans-serif; -webkit-font-smoothing:antialiased; overflow:hidden; }
.homebar2 { position:absolute; left:50%; bottom:9px; width:140px; height:5px; margin-left:-70px; border-radius:3px; background:#111; z-index:3; }
.ov--dark { background:#0B0B0D; color:#fff; } .ov--dark .homebar2 { background:#fff; }
.st__nav { position:absolute; top:64px; left:14px; display:flex; align-items:center; gap:2px; color:#007AFF; font-size:17px; } .st__nav svg { width:22px; height:22px; }
.st__hd { position:absolute; top:106px; left:20px; right:20px; display:flex; gap:16px; height:118px; }
.st__icon { flex:0 0 118px; width:118px; height:118px; border-radius:27px; background:#0A0A0A; display:grid; place-items:center; box-shadow: inset 0 0 0 1px rgba(0,0,0,.06); } .st__icon img { width:72px; height:auto; }
.st__txt { display:flex; flex-direction:column; min-width:0; flex:1; }
.st__title { font-size:22px; font-weight:700; letter-spacing:-.3px; line-height:1.15; } .st__sub { font-size:15px; color:#8A8A8E; margin-top:3px; }
.st__row { display:flex; align-items:center; justify-content:space-between; margin-top:auto; }
.st__get { min-width:84px; height:32px; padding:0 18px; border-radius:16px; background:#007AFF; color:#fff; font-size:15px; font-weight:700; display:grid; place-items:center; letter-spacing:.3px; }
.st__ring { width:32px; height:32px; display:none; } .st__ring svg { width:32px; height:32px; transform:rotate(-90deg); }
.st__share { width:30px; height:30px; border-radius:50%; background:#EFEFF4; display:grid; place-items:center; color:#007AFF; } .st__share svg { width:16px; height:16px; }
.st__meta { position:absolute; top:250px; left:20px; right:20px; display:flex; padding:12px 0; border-top:1px solid #E5E5EA; border-bottom:1px solid #E5E5EA; }
.st__meta div { flex:1; text-align:center; border-right:1px solid #E5E5EA; } .st__meta div:last-child { border-right:0; }
.st__meta small { display:block; font-size:11px; letter-spacing:.5px; text-transform:uppercase; color:#8A8A8E; font-weight:600; }
.st__meta b { display:block; margin-top:4px; font-size:20px; color:#8A8A8E; font-weight:700; } .st__meta .stars { display:block; margin-top:2px; font-size:11px; color:#8A8A8E; letter-spacing:1px; }
.st__sec { position:absolute; top:340px; left:20px; font-size:20px; font-weight:700; letter-spacing:-.2px; }
.st__shots { position:absolute; top:380px; left:20px; right:0; display:flex; gap:12px; overflow:hidden; }
.st__shot { position:relative; flex:0 0 190px; width:190px; height:412px; border-radius:20px; overflow:hidden; border:1px solid #E5E5EA; background:#F2F2F7; }
.st__shot .screen { opacity:1 !important; visibility:visible !important; transform: scale(0.4524) !important; transform-origin:0 0; width:420px; height:955px; inset:auto; left:0; top:0; z-index:1; }
.st__desc { position:absolute; top:812px; left:20px; right:20px; font-size:14px; line-height:1.4; color:#3A3A3C; }
.st__tab { position:absolute; left:0; right:0; bottom:0; height:84px; border-top:1px solid #E5E5EA; background:#F9F9F9; display:flex; justify-content:space-around; padding:8px 8px 0; }
.st__tab span { display:grid; justify-items:center; gap:4px; font-size:10px; color:#8A8A8E; } .st__tab i { width:26px; height:26px; border-radius:7px; background:#C7C7CC; } .st__tab .on { color:#007AFF; } .st__tab .on i { background:#007AFF; }
.au__back { position:absolute; top:66px; left:18px; width:32px; height:32px; color:#fff; } .au__back svg { width:32px; height:32px; }
.au__logo { position:absolute; top:104px; left:0; right:0; display:grid; justify-items:center; } .au__logo img { width:230px; height:auto; }
.au__h { position:absolute; top:236px; left:0; right:0; text-align:center; font-size:26px; font-weight:700; letter-spacing:-.3px; }
.au__p { position:absolute; top:274px; left:0; right:0; text-align:center; font-size:16px; color:#A1A1A6; } .au__p b { color:#fff; font-weight:600; }
.au__field { position:absolute; top:330px; left:22px; right:22px; height:58px; border-radius:12px; background:#2C2C2E; display:flex; align-items:center; gap:10px; padding:0 16px; font-size:20px; font-weight:600; }
.au__flag { position:relative; overflow:hidden; width:26px; height:18px; border-radius:3px; background:linear-gradient(#005BBB 0 50%, #FFD500 50% 100%); flex-shrink:0; }
.au__flag--us { background:repeating-linear-gradient(#B22234 0 1.4px, #fff 1.4px 2.8px); } .au__flag--us::after { content:""; position:absolute; left:0; top:0; width:11px; height:9.5px; background:#3C3B6E; }
.au__pre i { font-style:normal; font-size:12px; color:#A1A1A6; margin-left:3px; } .au__sep { width:1px; height:26px; background:#48484A; }
.au__val { letter-spacing:.3px; } .au__val:empty::before { content: attr(data-ph); color:#6E6E73; font-weight:400; } .au__caret { width:2px; height:26px; background:#0A84FF; }
.au__hint { position:absolute; top:400px; left:22px; right:22px; font-size:13px; color:#8E8E93; text-align:center; }
.au__btn { position:absolute; top:540px; left:22px; right:22px; height:56px; border-radius:14px; background:#1097D8; color:#fff; font-size:17px; font-weight:700; display:grid; place-items:center; }
.au__legal { position:absolute; top:612px; left:22px; right:22px; text-align:center; font-size:12px; color:#8E8E93; } .au__legal b { color:#0A84FF; font-weight:400; }
.cd__cells { position:absolute; top:326px; left:0; right:0; display:flex; justify-content:center; gap:12px; }
.cd__cell { position:relative; width:64px; height:66px; border-radius:12px; background:#2C2C2E; border:2px solid transparent; display:grid; place-items:center; font-size:30px; font-weight:700; color:#fff; }
.cd__cell.on { border-color:#0A84FF; } .cd__cell.on:empty::after { content:""; width:2px; height:28px; background:#0A84FF; }
.cd__resend { position:absolute; top:410px; left:22px; right:22px; text-align:center; font-size:13px; color:#8E8E93; }
.kb { position:absolute; left:0; right:0; bottom:0; height:330px; background:#2A2A2C; transform:translateY(330px); z-index:2; }
.kb__bar { height:44px; display:flex; justify-content:flex-end; align-items:center; padding:0 18px; color:#0A84FF; font-size:17px; font-weight:600; }
.kb__grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; padding:0 8px; }
.kb__k { height:50px; border-radius:6px; background:#5C5C60; display:grid; place-items:center; font-size:26px; color:#fff; } .kb__k--none { background:transparent; }
.kb__k svg { width:28px; height:28px; }
.dim { position:absolute; inset:0; background:#000; opacity:0; z-index:60; pointer-events:none; }
.dim2 { position:absolute; inset:0; background:#000; opacity:0; z-index:90; pointer-events:none; }
.tapdot { position:absolute; z-index:80; width:54px; height:54px; margin:-27px 0 0 -27px; border-radius:50%; background:radial-gradient(circle, rgba(41,163,224,.6) 0%, rgba(41,163,224,0) 70%); opacity:0; pointer-events:none; }`;
const browser = await chromium.launch();
for (const loc of (process.env.ONLY ? [process.env.ONLY] : Object.keys(TEXT))) {
  const T = TEXT[loc];
  const dir = path.join(HERE, '_frames', 'install-' + loc); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const p = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  await p.goto('file://' + DEMO, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
  await p.addStyleTag({ content: CSS });
  const geo = await p.evaluate((T) => {
    const vp = document.querySelector('.viewport'), scr = document.querySelector('.phone__screen'), q = (r, s) => r.querySelector(s);
    const S = n => q(vp, '.screen[data-screen="' + n + '"]');
    const s1 = S(1), s2 = S(2), s3 = S(3), s9 = S(9), s10 = S(10);
    vp.querySelectorAll('.screen').forEach(e => { e.classList.remove('is-on', 'is-leaving'); });
    const off = el => { el.style.opacity = '0'; el.style.visibility = 'hidden'; }, on = el => { el.style.opacity = '1'; el.style.visibility = 'visible'; };
    [s1, s2, s3, s9, s10].forEach(off); [s1, s2, s3].forEach(e => { e.style.transform = 'none'; });
    const pre = [...s1.querySelectorAll('.grid > *')].find(e => /Consultant/.test(e.textContent) && !/App Store/.test(e.textContent)); if (pre) pre.style.visibility = 'hidden';
    q(s2, '.mark').innerHTML = '<img src="' + T.lockup + '" alt="">'; q(s2, '.mark').style.opacity = '1';
    q(s3, '.hero__logo').innerHTML = '<img src="' + T.lockup + '" alt=""><div class="hero__tag">' + T.hero.tag + '</div>';
    [...s3.querySelectorAll('.pill')].forEach((el, i) => { el.lastChild.textContent = T.hero.pills[i]; });
    q(s9, '.s9__hd b').textContent = T.orders; [...s9.querySelectorAll('.s9__chip')].forEach((c, i) => c.textContent = T.chips[i]);
    const tpl = q(s9, '.s9__card'), list = document.createElement('div'); list.className = 's9__list';
    T.list.forEach(it => { const c = tpl.cloneNode(true); q(c, '.s9__date span').textContent = it.date; q(c, '.s9__qt').textContent = it.q;
      q(c, '.s9__st').innerHTML = T.status + ' <b' + (it.closed ? ' style="color:#9aa3ad"' : '') + '>' + it.st + '</b>';
      q(c, '.s9__av').innerHTML = it.avatars.map(s => '<span><img src="' + s + '" alt="" style="width:100%;height:100%;object-fit:cover"></span>').join('');
      if (it.fresh) { const f = document.createElement('span'); f.className = 's9__fresh'; f.textContent = T.fresh; c.appendChild(f); }
      list.appendChild(c); });
    tpl.replaceWith(list);
    const dim = document.createElement('div'); dim.className = 'dim'; s9.appendChild(dim);
    q(s10, '.s10__bar b').textContent = T.qnum; q(s10, '.card__date span').textContent = T.qdate; q(s10, '.card__qt').textContent = T.qtitle; q(s10, '.card__body').textContent = T.qbody;
    const inner = q(s10, '#threadInner'), all = [...inner.querySelectorAll('.ans')], proto = all[0]; all.slice(1).forEach(a => a.remove());
    T.answers.forEach(a => { const el = proto.cloneNode(true); q(el, '.base').textContent = a.band; const sc = q(el, '.score'); sc.lastChild.textContent = a.score;
      q(el, '.ans__name b').textContent = a.name; q(el, '.ans__name i').textContent = a.role; q(el, '.ans__loc').lastChild.textContent = a.loc; q(el, '.ans__ts').textContent = a.ts; q(el, '.ans__txt').textContent = a.text;
      q(el, '.ans__av').innerHTML = '<img src="' + a.photo + '" alt="" style="width:100%;height:100%;object-fit:cover">';
      const b = el.querySelectorAll('.ans__btn'); b[0].lastChild.textContent = T.order; b[1].lastChild.textContent = T.best; inner.appendChild(el); });
    proto.remove(); inner.style.transform = 'translateY(0)';
    const sbD = q(s9, '.sb').outerHTML, sbL = q(s2, '.sb').outerHTML;
    const chev = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
    const kb = '<div class="kb" data-kb><div class="kb__bar">' + T.auth.done + '</div><div class="kb__grid">' + ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(k => '<div class="kb__k">' + k + '</div>').join('') +
      '<div class="kb__k kb__k--none"></div><div class="kb__k">0</div><div class="kb__k kb__k--none"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"><path d="M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6-7 6-7z"/><path d="M12 10l5 5M17 10l-5 5" stroke-linecap="round"/></svg></div></div><div class="homebar2"></div></div>';
    const st = document.createElement('div'); st.className = 'ov ov--store'; st.innerHTML = sbD +
      '<div class="st__nav">' + chev + T.store.back + '</div>' +
      '<div class="st__hd"><div class="st__icon"><img src="' + T.sign + '" alt=""></div><div class="st__txt"><div class="st__title">' + T.store.title + '</div><div class="st__sub">' + T.store.sub + '</div>' +
      '<div class="st__row"><div class="st__get" data-get>' + T.store.get + '</div><div class="st__ring" data-ring><svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="13.5" fill="none" stroke="#E5E5EA" stroke-width="3"/><circle data-arc cx="16" cy="16" r="13.5" fill="none" stroke="#007AFF" stroke-width="3" stroke-linecap="round" stroke-dasharray="84.8" stroke-dashoffset="84.8"/><rect x="12.5" y="12.5" width="7" height="7" rx="1.5" fill="#007AFF"/></svg></div>' +
      '<div class="st__share"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4M7 9l5-5 5 5M5 13v6h14v-6"/></svg></div></div></div></div>' +
      '<div class="st__meta">' + T.store.meta.map((m, i) => '<div><small>' + m[1] + '</small><b>' + m[0] + '</b>' + (i === 0 ? '<span class="stars">★★★★★</span>' : '') + '</div>').join('') + '</div>' +
      '<div class="st__sec">' + T.store.preview + '</div><div class="st__shots"><div class="st__shot" data-shot="9"></div><div class="st__shot" data-shot="10"></div></div>' +
      '<div class="st__desc">' + T.store.desc + '</div>' +
      '<div class="st__tab">' + T.store.tabs.map((t, i) => '<span class="' + (i === 4 ? 'on' : '') + '"><i></i>' + t + '</span>').join('') + '</div><div class="homebar2"></div>';
    scr.appendChild(st);
    /* прев’ю без екрана з логотипом: там він був би вужчий за 160 px */ [[9, s9], [10, s10]].forEach(([n, el]) => { const c = el.cloneNode(true); c.querySelectorAll('.dim, .tapdot').forEach(x => x.remove()); c.style.opacity = '1'; c.style.visibility = 'visible'; c.style.transform = 'scale(0.4524)'; q(st, '[data-shot="' + n + '"]').appendChild(c); });
    const au = document.createElement('div'); au.className = 'ov ov--dark ov--auth'; au.innerHTML = sbL + '<div class="au__back">' + chev + '</div><div class="au__logo"><img src="' + T.lockup + '" alt=""></div>' +
      '<div class="au__h">' + T.auth.h + '</div><div class="au__p">' + T.auth.p + '</div>' +
      '<div class="au__field"><span class="au__flag' + (T.auth.pre === '+1' ? ' au__flag--us' : '') + '"></span><span class="au__pre">' + T.auth.pre + '<i>&#8964;</i></span><span class="au__sep"></span><span class="au__val" data-val data-ph="' + T.auth.ph + '"></span><span class="au__caret" data-caret></span></div>' +
      '<div class="au__hint">' + T.auth.hint + '</div><div class="au__btn" data-btn>' + T.auth.btn + '</div><div class="au__legal">' + T.auth.legal + '<b>' + T.auth.legalLink + '</b></div>' + kb + '<div class="homebar2"></div>';
    scr.appendChild(au);
    const cd = document.createElement('div'); cd.className = 'ov ov--dark ov--code'; cd.innerHTML = sbL + '<div class="au__back">' + chev + '</div><div class="au__logo"><img src="' + T.lockup + '" alt=""></div>' +
      '<div class="au__h">' + T.auth.codeH + '</div><div class="au__p">' + T.auth.codeP + '<b>' + T.auth.codeNum + '</b></div>' +
      '<div class="cd__cells">' + [0, 1, 2, 3].map(() => '<div class="cd__cell" data-cell></div>').join('') + '</div><div class="cd__resend">' + T.auth.resend + '</div>' +
      '<div class="au__btn" data-btn>' + T.auth.authBtn + '</div>' + kb + '<div class="homebar2"></div>';
    scr.appendChild(cd);
    const tap = document.createElement('div'); tap.className = 'tapdot'; scr.appendChild(tap);
    const dim2 = document.createElement('div'); dim2.className = 'dim2'; scr.appendChild(dim2);
    const R = scr.getBoundingClientRect(), rel = r => [r.left + r.width / 2 - R.left, r.top + r.height / 2 - R.top];
    on(s1); const storeIcon = [...s1.querySelectorAll('.grid > *')].find(e => /App Store/.test(e.textContent)) || s1; const iconBox = storeIcon.querySelector('img, svg, div, span') || storeIcon; const storeXY = rel(iconBox.getBoundingClientRect());
    on(st); const getXY = rel(q(st, '[data-get]').getBoundingClientRect()); off(st);
    on(au); const codeXY = rel(q(au, '[data-btn]').getBoundingClientRect()); off(au);
    on(cd); const authXY = rel(q(cd, '[data-btn]').getBoundingClientRect()); off(cd);
    on(s9); const cr = list.firstElementChild.getBoundingClientRect(), cardXY = rel(cr);
    const spot = document.createElement('div'); spot.className = 's9__spot'; Object.assign(spot.style, { left: (cr.left - R.left) + 'px', top: (cr.top - R.top) + 'px', width: cr.width + 'px', height: cr.height + 'px' }); s9.appendChild(spot);
    const lab = document.createElement('div'); lab.className = 's9__label'; lab.style.top = (cr.bottom - R.top + 22) + 'px';
    lab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V5M5 12l7-7 7 7"/></svg><span>' + T.yourQ + '</span>'; s9.appendChild(lab);
    off(s9);
    on(s10); const maxY = inner.scrollHeight - q(s10, '.s10__scroll').clientHeight; off(s10);
    return { storeXY, getXY, codeXY, authXY, cardXY, tabXY: [R.width * 0.14, R.height - 108.6 * 0.62], maxY, W: R.width };
  }, T);
  console.log(loc, 'geometry', JSON.stringify(geo));
  await p.waitForTimeout(700);
  const screen = p.locator('.phone__screen'); let n = 0;
  for (const [ph, count] of PLAN) for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 1;
    await p.evaluate(({ ph, t, g, T, stage }) => {
      const vp = document.querySelector('.viewport'), scr = document.querySelector('.phone__screen'), q = (r, s) => r.querySelector(s);
      const S = n => q(vp, '.screen[data-screen="' + n + '"]'); const s1 = S(1), s2 = S(2), s3 = S(3), s9 = S(9), s10 = S(10);
      const st = q(scr, '.ov--store'), au = q(scr, '.ov--auth'), cd = q(scr, '.ov--code'), tap = q(scr, '.tapdot'), dim = q(s9, '.dim'), dim2 = q(scr, '.dim2'), inner = q(s10, '#threadInner');
      const show = (el, on, z) => { el.style.opacity = on ? '1' : '0'; el.style.visibility = on ? 'visible' : 'hidden'; if (z != null) el.style.zIndex = String(z); };
      const eo = p => 1 - Math.pow(1 - p, 3), ei = p => p * p * p, eio = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      const W = g.W, tx = (el, x) => { el.style.transform = 'translateX(' + x + 'px)'; };
      const push = k => { tx(s10, W * (1 - k)); tx(s9, -0.28 * W * k); dim.style.opacity = String(0.18 * k); };
      const tapAt = (xy, k) => { tap.style.left = xy[0] + 'px'; tap.style.top = xy[1] + 'px'; tap.style.opacity = String(0.9 * (1 - k)); tap.style.transform = 'scale(' + (0.5 + 1.3 * k) + ')'; };
      const fmt = (d) => { const out = []; let i = 0; for (const gs of T.auth.groups) { if (i >= d.length) break; out.push(d.slice(i, i + gs)); i += gs; } return out.join(' '); };
      const getBtn = q(st, '[data-get]'), ring = q(st, '[data-ring]'), arc = q(st, '[data-arc]');
      tap.style.opacity = '0'; dim2.style.opacity = '0';
      show(s1, false); show(st, stage >= 1 && stage <= 2, 40); show(s2, stage === 2, 45); show(s3, stage >= 3 && stage <= 4, 46); show(au, stage >= 4 && stage <= 5, 47); show(cd, stage >= 5 && stage <= 6, 48); show(s9, stage >= 6, 50); show(s10, stage >= 7, 55);
      // скидання трансформацій
      st.style.transform = 'none'; st.style.borderRadius = '0'; tx(s3, 0); tx(au, 0); tx(cd, 0); if (stage < 7) { push(0); inner.style.transform = 'translateY(0)'; } if (stage < 6) tx(s9, 0);
      const installed = ['open', 'tapopen', 'splash'].includes(ph); getBtn.textContent = installed ? T.store.open : T.store.get;
      if (ph === 'progress') { getBtn.style.display = 'none'; ring.style.display = 'block'; arc.setAttribute('stroke-dashoffset', String(84.8 * (1 - eio(t)))); } else { getBtn.style.display = 'grid'; ring.style.display = 'none'; }
      if (ph === 'tapget' || ph === 'tapopen') tapAt(g.getXY, t);
      if (ph === 'splash') { s2.style.opacity = String(Math.min(1, t * 3)); const m = q(s2, '.mark'); m.style.transform = 'translate(-50%,-50%) scale(' + (0.92 + 0.08 * eo(t)) + ')'; }
      const mark = q(s2, '.mark'); mark.style.opacity = '1';
      if (ph === 'heroin') { show(s2, true, 45); mark.style.opacity = String(1 - Math.min(1, t * 2)); s3.style.opacity = String(eo(t)); }  /* заставка гасне раніше, ніж проявиться перший екран */
      if (ph === 'taptab') tapAt(g.tabXY, t);
      const kbA = q(au, '[data-kb]'), kbC = q(cd, '[data-kb]');
      if (ph === 'authin') { const k = eo(t); tx(au, W * (1 - k)); tx(s3, -0.28 * W * k); kbA.style.transform = 'translateY(330px)'; }
      if (stage === 4 && ph !== 'authin') { kbA.style.transform = 'translateY(' + (ph === 'typing' ? 330 * (1 - eo(Math.min(1, t * 4))) : 0) + 'px)'; }
      if (stage === 4) { const k = ph === 'typing' ? Math.max(0, (t - 0.2) / 0.8) : (ph === 'authin' ? 0 : 1); const nDig = Math.round(T.auth.digits.length * k); q(au, '[data-val]').textContent = fmt(T.auth.digits.slice(0, nDig)); q(au, '[data-caret]').style.opacity = (ph === 'typing' && Math.floor(t * 10) % 2 === 1) ? '0' : '1'; }
      if (ph === 'tapcode') tapAt(g.codeXY, t);
      if (ph === 'codein') { const k = eo(t); tx(cd, W * (1 - k)); tx(au, -0.28 * W * k); kbA.style.transform = 'translateY(0)'; }
      if (stage === 5) { kbC.style.transform = 'translateY(0)'; const cells = cd.querySelectorAll('[data-cell]'); const nC = ph === 'code' ? Math.min(4, Math.floor(t * 5)) : (ph === 'codein' ? 0 : 4); cells.forEach((c, i) => { c.textContent = i < nC ? T.auth.code[i] : ''; c.classList.toggle('on', i === nC); }); }
      if (ph === 'tapauth') tapAt(g.authXY, t);
      if (ph === 'listin') { const k = eo(t); tx(s9, W * (1 - k)); tx(cd, -0.28 * W * k); }
      const spot = q(s9, '.s9__spot'), lab = q(s9, '.s9__label'); let sp = 0; if (ph === 'list') sp = eo(Math.min(1, t * 2.2)); else if (ph === 'tap') sp = 1;
      spot.style.opacity = String(sp); lab.style.opacity = String(sp); lab.style.transform = 'translateY(' + (12 * (1 - sp)) + 'px)';
      if (ph === 'tap') tapAt(g.cardXY, t);
      if (ph === 'in') push(eo(t));
      if (ph === 'hold') push(1);
      if (ph === 'scroll') { push(1); inner.style.transform = 'translateY(' + (-Math.max(0, g.maxY) * eio(t)) + 'px)'; }
      if (ph === 'hold2' || ph === 'fadeout') { push(1); inner.style.transform = 'translateY(' + (-Math.max(0, g.maxY)) + 'px)'; }
      if (ph === 'fadeout') dim2.style.opacity = String(ei(t));
    }, { ph, t, g: geo, T, stage: STAGE[ph] });
    await screen.screenshot({ path: path.join(dir, `f${String(++n).padStart(4, '0')}.png`) });
  }
  await p.close();
  const ff = '/opt/homebrew/bin/ffmpeg -y -loglevel error';
  execSync(`${ff} -framerate ${FPS} -i "${dir}/f%04d.png" -vf "scale=720:-2,format=yuv420p" -c:v libx264 -profile:v main -crf 23 -movflags +faststart "${OUT}/install-${loc}.mp4"`);
  execSync(`${ff} -framerate ${FPS} -i "${dir}/f%04d.png" -vf "scale=720:-2" -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -pix_fmt yuv420p "${OUT}/install-${loc}.webm"`);
  execSync(`${ff} -i "${dir}/f0001.png" -vf "scale=720:-2" -q:v 4 "${OUT}/install-${loc}.jpg"`);
  for (const ext of ['mp4', 'webm', 'jpg']) console.log(loc, ext, Math.round(fs.statSync(`${OUT}/install-${loc}.${ext}`).size / 1024) + ' KB');
  console.log(loc, 'frames', n, 'duration', (n / FPS).toFixed(1) + 's');
  fs.rmSync(dir, { recursive: true, force: true });
}
await browser.close();
