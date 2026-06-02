# Slide 11 — Team, Traction & Ask (закрывающий слайд)

## 🎯 Ассеты для прикрепления в Claude Design

Из папки `lastQuiz/`:
- `images/photo/PHOTO1.png`, `PHOTO2.png`, `PHOTO3.png` — плейсхолдеры для фото фаундеров (замените на реальные перед финальным экспортом)

Дополнительно (если есть):
- Реальные фото фаундеров и эдвайзеров — прикрепить вместо PHOTO1-3

Эталоны:
- `ref-slide-01-welcome.png`, `ref-slide-02-profile.png`, `ref-slide-03-leads.png`
- + готовые слайды 2/3/6/7/8/9/10

---

## ⚠️ Перед генерацией заполните эти числа:

В тексте промпта ниже найдите `[XX]` и замените на свои реальные цифры:

| Маркер | Что подставить |
|---|---|
| `[XX] lawyers in private beta` | Сколько юристов реально в бете |
| `[XX]% quiz completion rate` | Реальная конверсия квиза |
| `$[XX]K committed MRR / waitlist` | Подтверждённый MRR + waitlist |
| `$[X.X]M seed` | Размер раунда (например $2.0M) |
| `$[XX]M post-money` | Post-money оценка (например $12M) |
| `[Founder]` имена и роли | Реальные имена и бэкграунды команды |

Если ещё не определились — оставьте `[XX]`, Claude Design отобразит как placeholder, замените позже в финальной правке.

---

## 📋 Промпт (Cmd+A, Cmd+C весь блок ниже)

```
=== DESIGN SYSTEM — keep identical across every slide ===

PALETTE (use EXACTLY these hex, never substitute):
- Background:        #faf9f5
- Primary text:      #0A1118
- Cyan deep:         #1397D6
- Cyan light:        #56C2F0
- Positive green:    #10b981
- Warning red:       #ef4444
- Amber:             #f59e0b
- Muted grey:        #94a3b8

TYPOGRAPHY:
- Headings: Outfit, weight 800, letter-spacing -0.5px
- Body:     Inter, weight 400–500
- Numbers:  Outfit weight 700, tabular-nums
Sizes: hero number 64–72px · slide title 36–44px · body 14–16px · caption 11–12px

LAYOUT TOKENS:
- Slide canvas: 1920×1080 (16:9)
- Outer padding: 80px
- Card radius: 16px
- Card padding: 24px
- Inter-zone gap: 32px
- Card shadow: 0 24px 48px rgba(10,17,24,0.06), 0 0 0 1px rgba(19,151,214,0.08)

LOGO MARK (top-left, 40×40, every slide):
Navy #0A1118 square with 28×28 rounded inner square outlined #1397D6,
letter "C" in #56C2F0 center, Outfit 800. Match existing deck exactly.

ANIMATION:
- Entry: 240ms ease-out
- Stagger: 120ms between elements
- Numbers: count-up over 800ms

IMPORTANT: match the typography, spacing, card style, and visual
language of the reference screenshots attached in this session.
Background, fonts and accent colors must be identical to the reference.

=== SLIDE-SPECIFIC CONTENT BELOW ===

Build slide 11 of an investor pitch deck — the closing slide.

Title (centered top, 36px Outfit 800):
"Built. Validated. Ready to scale."
Subtitle (16px Inter muted):
"The conversion engine is live. Funding scales paid acquisition."

Layout: 2 zones — top 3-column row (traction / team / roadmap),
bottom full-width ASK hero card.

TOP-LEFT COLUMN — TRACTION (glassmorphic vertical card):
Title 16px Outfit 700: "Traction (last 60 days)"
Stat block 1:
  "[XX]" — Outfit 800, 56px cyan deep
  Caption: "lawyers in private beta"
  Animated counter on load
Stat block 2:
  "[XX]%" — Outfit 800, 56px green
  Caption: "quiz completion rate"
Stat block 3:
  "$[XX]K" — Outfit 800, 56px cyan deep
  Caption: "committed MRR / waitlist"
Stat block 4 — geo row:
  "Live" — 12px Outfit 700
  Flag row: 🇺🇸 EN: live · 🇺🇦 UA: in QA
Bottom: tiny sparkline chart (cyan line) showing weekly signups
growth over last 8 weeks, "Weekly signups →" caption.

TOP-MIDDLE COLUMN — TEAM (glassmorphic vertical card):
Title 16px Outfit 700: "Team"
3 founder rows stacked, each 80px tall, 12px gap:

Row 1:
- Circular photo 64px (use attached PHOTO1.png as placeholder)
- Right of photo:
  Name 16px Outfit 700: "[Founder Name]"
  Role 12px cyan deep: "CEO"
  Credibility 11px muted Inter:
  "Prior exit at [Company]. 10 years in [legal-tech / AI / SaaS]."

Row 2:
- Circular photo (PHOTO2.png placeholder)
- Name: "[Co-Founder Name]"
- Role: "CTO"
- Credibility: "Ex-[Company]. ML systems at scale."

Row 3:
- Circular photo (PHOTO3.png placeholder)
- Name: "[Co-Founder Name]"
- Role: "Head of Growth"
- Credibility: "Built [previous marketplace]. $XXM ARR."

Below founders — Advisors row:
Mini-grid of 4 small circular avatars 32px with names underneath in 10px
muted: "Advisors: [Name] (legal), [Name] (AI/ML), [Name] (marketplace),
[Name] (US legal-tech)."

TOP-RIGHT COLUMN — ROADMAP (glassmorphic vertical card):
Title 16px Outfit 700: "Next 12 months"
Vertical timeline, 4 milestones, each with a cyan dot connector forming
a continuous left-edge line:

Q1:
  Dot icon
  "Paid acquisition launch"
  Caption: "NY → FL → TX rollout"
Q2:
  "AI Avatar v2"
  Caption: "Multilingual, real-time"
Q3:
  "Mobile app + integrations"
  Caption: "Clio, MyCase, iManage"
Q4:
  "Geo expansion"
  Caption: "UK + Canada launch"

BOTTOM ZONE — THE ASK (full-width hero card, glassmorphic with strong
cyan glow):

Left side (60%):
- Big headline 56px Outfit 800:
  "Raising $[X.X]M seed at $[XX]M post-money"
- Below in 16px Inter:
  "Open to lead investors with US legal-tech network."
  "First close target: 60 days."

Right side (40%) — Use of funds segmented bar:
Horizontal bar 64px tall, segmented:
- 40% cyan deep — "Paid acquisition (NY/FL/TX)"
- 30% deep navy — "Engineering & product"
- 20% green — "GTM hires (2 sales + 1 partner mgr)"
- 10% amber — "Compliance & legal"
Each segment labeled with % above and category below.

CLOSING TAGLINE (centered at very bottom of slide, full width):
"You're not betting on AI. You're betting on the marketplace AI unlocks."
14px Inter italic cyan deep #1397D6.

ANIMATION:
- Traction numbers count up over 800ms
- Roadmap milestones reveal sequentially top-to-bottom, 200ms stagger
- ASK card grows in last (scale 0.96 → 1.0, 320ms)
- Use-of-funds segments grow left-to-right with 100ms stagger
- Closing tagline fades in finally
```

---

## 🗣 По-простому (для вашей проверки)

**Что я попросил:**

- **Сверху три колонки:**
  - **Traction** (слева) — 4 счётчика: [XX] юристов, [XX]% completion, $[XX]K MRR, флажки EN/UA. Снизу мини-график роста.
  - **Team** (центр) — 3 строки с фото-кружком + имя + роль + одна строка credibility. Под ними мини-сетка эдвайзеров.
  - **Roadmap** (справа) — вертикальный timeline на 4 квартала: paid launch / AI Avatar v2 / mobile + интеграции / UK+Canada.
- **Снизу — большая ASK-карточка** со светящимся cyan-glow:
  - Слева: «Raising $[X.X]M at $[XX]M post-money»
  - Справа: сегментированная полоса «куда деньги» (40/30/20/10)
- **В самом низу** — закрывающая фраза: «Вы не делаете ставку на AI — вы делаете ставку на маркетплейс, который AI делает возможным.»

**Чего инвестор должен «считать»:**
1. У нас уже есть traction (юзеры, deal flow, MRR) — это не «идея на салфетке»
2. Команда — серьёзные люди с прошлыми exits
3. Понятный план на 12 месяцев (не «мы что-нибудь придумаем»)
4. Конкретная цифра раунда + конкретная разбивка использования
5. Закрытие — философское, не «дайте денег», а «вы инвестируете в категорию»

**Ваш чек после генерации:**
- [ ] Все [XX] подставлены реальными цифрами (или вы планируете правку в Claude Design)
- [ ] 3 верхних колонки одинаковой высоты
- [ ] Roadmap-линия с точками реально вертикальная и непрерывная
- [ ] ASK-карточка выделена cyan-glow и заметно крупнее всего
- [ ] Use-of-funds сегменты имеют разные цвета (cyan/navy/green/amber) и подписаны
- [ ] Закрывающая фраза не обрезана, читается курсивом

---

## После этого слайда

Поздравляю — у вас 11 слайдов готовы. **Финальная проверка**:
1. Откройте все слайды в одном окне (например, экспортнуть все в PNG и положить в Quick Look или Figma)
2. Проверьте 5 пунктов из `01-WORKFLOW.md` секции «Финальная проверка»
3. Если хоть один пункт нарушен — отправьте проблемный слайд в новую сессию Claude Design с промптом «normalize this slide to match the rest of the deck» и приложите остальные слайды как референс
