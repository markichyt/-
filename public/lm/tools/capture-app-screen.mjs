// Снимок экрана «Питання №14237» из демо реального интерфейса (экран 10): en как есть, uk — с подменой текстов в DOM.
// Запуск: node tools/capture-app-screen.mjs [путь к ask-question-demo.html]  → tools/_capture/app-<loc>.png (844×1912, DPR 2)
// Затем: python3 tools/finish-app-images.py  → assets/app/question-<loc>.jpg|webp (для uk — украинский флаг в таб-баре)
import { chromium } from '/Users/mac/cabinetUR/video/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
const DEMO = process.argv[2] || '/Users/mac/VOPROS/consultant-demo/ask-question-demo.html';
const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), '_capture'); fs.mkdirSync(OUT, { recursive: true });
const UK = {
  'Question #14237': 'Питання №14237',
  '01 July, 2026 18:04': '01 липня 2026, 18:04',
  'Can I claim compensation for being wrongfully arrested and held in custody due to a database error?': 'Чи можу я отримати компенсацію за неправомірне затримання через помилку в базі даних?',
  "I was stopped during a routine police check and arrested because an error in a police database wrongly listed me as a wanted suspect. I spent several hours locked in a holding cell and missed an important work meeting, even though I had committed no crime and the mistake was entirely the authorities' fault. After they confirmed the database error, I was released without any apology. Can I claim compensation for the wrongful arrest, my lost earnings, and the emotional distress this caused me?":
    'Мене зупинили під час планової перевірки й затримали, бо в базі поліції я помилково значився як розшукуваний. Кілька годин провів у камері та пропустив важливу робочу зустріч, хоча не вчиняв жодного злочину, а помилка була повністю на боці органів. Після підтвердження помилки мене відпустили без жодних вибачень. Чи можу я вимагати компенсацію за неправомірне затримання, втрачений заробіток і моральну шкоду?',
  'Assistant Andrey': 'Асистент Андрій', 'Assistant Emily': 'Асистентка Емілі', 'Artificial Intelligence': 'Штучний інтелект', 'USA': 'Україна',
  'Order the service': 'Замовити послугу', 'Best answer': 'Найкраща відповідь',
  'In many jurisdictions, compensation for wrongful arrest and detention due to a database error may be claimable under laws addressing false imprisonment, negligence by authorities, or violations of rights, potentially covering lost earnings and emotional distress. However, outcomes depend heavily on the specific facts, applicable statutes in your location, and whether the error constitutes actionable misconduct. Consult a licensed attorney in your jurisdiction for personalized advice.':
    'У багатьох юрисдикціях компенсацію за неправомірний арешт і затримання через помилку в базі даних можна вимагати за нормами про незаконне позбавлення волі, недбалість органів влади або порушення прав — включно з втраченим заробітком і моральною шкодою. Утім, результат значною мірою залежить від конкретних обставин, чинного законодавства у вашому регіоні й того, чи є помилка підставою для відповідальності. Зверніться до ліцензованого адвоката у вашій юрисдикції за персональною консультацією.',
  'Yes, you may have grounds to claim compensation for wrongful arrest due to a database error. In many jurisdictions, individuals subjected to wrongful arrest can seek damages for losses incurred, including lost earnings, emotional distress, and any other consequences stemming from the unlawful detention. The authorities may be held liable if it can be established that they acted negligently in maintaining the accuracy of their database. It would be advisable to consult with a legal professional to explore your options and gather evidence to support your claim.':
    'Так, підстави для компенсації є: у багатьох юрисдикціях за неправомірний арешт можна стягнути втрачений заробіток, моральну шкоду та інші наслідки незаконного затримання. Органи влади можуть нести відповідальність, якщо буде доведено недбалість у веденні бази даних. Радимо звернутися до юриста, щоб оцінити варіанти та зібрати докази.'
};
const browser = await chromium.launch();
for (const loc of ['en', 'uk']) {
  const p = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  await p.goto('file://' + DEMO, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  const info = await p.evaluate((map) => {
    const scr = [...document.querySelectorAll('.screen')];
    const hit = scr.find(e => e.textContent.includes('14237'));
    scr.forEach(e => { e.style.transition = 'none'; e.classList.remove('is-on', 'is-leaving'); });
    hit.classList.add('is-on');
    document.querySelectorAll('*').forEach(e => { e.style.animationPlayState = 'paused'; });
    let replaced = 0, misses = [];
    if (map) {
      const w = document.createTreeWalker(hit, NodeFilter.SHOW_TEXT); const nodes = [];
      while (w.nextNode()) nodes.push(w.currentNode);
      nodes.forEach(n => { const t = n.nodeValue.trim(); if (!t) return; if (map[t]) { n.nodeValue = n.nodeValue.replace(t, map[t]); replaced++; } else if (t.length > 3 && !/^[\d:.,\s#]+$/.test(t) && t !== 'BASE (Base)' && t !== 'i') misses.push(t.slice(0, 40)); });
    }
    const tb = document.querySelector('.tabbar'), sc = document.querySelector('.phone__screen');
    const r = tb.getBoundingClientRect(), s = sc.getBoundingClientRect();
    return { replaced, misses, tabbarTop: Math.round(r.top - s.top), screen: [Math.round(s.width), Math.round(s.height)] };
  }, loc === 'uk' ? UK : null);
  console.log(loc, JSON.stringify(info));
  await p.waitForTimeout(500);
  await p.locator('.phone__screen').screenshot({ path: `${OUT}/app-${loc}.png` });
  await p.close();
}
await browser.close();
