// Прохід воронки зі скриншотом кожного екрана (перевірка після правок).
// node tools/walk.mjs <quiz.html> <W> <H> <outdir> [--alt] [--en]
//   --alt — на екрані подяки натиснути «Продовжити без VIP» (одразу до застосунку)
// Потрібен Playwright (шлях до node_modules нижче).
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('/Users/mac/cabinetUR/video/node_modules/playwright');

const [file, W, H, out, ...flags] = process.argv.slice(2);
const alt = flags.includes('--alt'), en = flags.includes('--en');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +W, height: +H }, deviceScaleFactor: 2, colorScheme: 'dark' });
page.on('pageerror', e => console.log('PAGE ERROR', e.message));
await page.goto('file://' + path.resolve(file));
await page.waitForSelector('#funnel');
const cur = () => page.evaluate(() => { const el = document.querySelector('.funnel__screen:not([hidden])'); return el ? el.id : ''; });
const shot = async (tag) => { const id = await cur(); await page.screenshot({ path: path.join(out, `${W}x${H}-${id}${tag || ''}.png`) }); return id; };
const settle = async (prev) => {
  await page.waitForFunction(p => { const el = document.querySelector('.funnel__screen:not([hidden])'); return el && el.id !== p; }, prev, { timeout: 20000 });
  await page.waitForTimeout(500);
};
const next = async () => {
  const prev = await cur();
  await page.waitForFunction(() => { const b = document.getElementById('funnel-next'); return b && !b.hidden && !b.disabled && b.getAttribute('aria-disabled') !== 'true'; }, null, { timeout: 20000 });
  await page.waitForTimeout(250);
  await page.click('#funnel-next');
  await settle(prev);
};
const clickAlt = async () => { const prev = await cur(); await page.click('#funnel-alt'); await settle(prev); };
const visited = [];
for (let guard = 0; guard < 24; guard++) {
  const id = await cur(); visited.push(id);
  if (id === 's1' || id === 's3' || id === 's7') { await page.waitForFunction(() => { const b = document.getElementById('funnel-next'); return b && !b.disabled; }, null, { timeout: 20000 }); await page.waitForTimeout(900); }
  if (id === 's16') { await shot(); break; }
  if (id === 's2') {
    await page.fill('#settlement', en ? 'New' : 'Дубно');
    await page.waitForSelector('#settlement-list [role="option"]', { timeout: 5000 });
    await page.click('#settlement-list [role="option"]');
    await page.waitForTimeout(300);
  }
  if (id === 's4') { const tiles = await page.$$('#s4 .q-option'); await tiles[0].click(); await tiles[6].click(); await page.waitForTimeout(200); }
  if (id === 's6') { await page.fill('#story', en ? 'We decided to divorce, we have two children and cannot agree on custody and the division of property.' : 'Ми вирішили розлучитися, є двоє дітей, не можемо домовитися про опіку та поділ майна.'); }
  if (id === 's9') { await page.click('#s9 .q-option'); }
  if (id === 's12') {
    await page.click('#phone'); await page.keyboard.type(en ? '2125550123' : '671234567');
    await page.$eval('#consent', el => { if (!el.checked) el.click(); });
    await page.waitForTimeout(200);
  }
  if (id === 's11') { await page.$eval('input[name="membership_plan"][value="pro"]', el => { if (!el.checked) el.click(); }); await page.waitForTimeout(400); }
  await shot();
  if (id === 's15' && alt) { await clickAlt(); continue; }
  await next();
}
console.log(`${W}x${H}${alt ? ' alt' : ''}: ${visited.join(' → ')}`);
await browser.close();
