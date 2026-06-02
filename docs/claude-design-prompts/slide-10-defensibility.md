# Slide 10 — Defensibility: 3-sided flywheel (тёмный вариант)

## 🎯 Ассеты для прикрепления в Claude Design

Из папки `lastQuiz/`:
- `videos/video-2-google-ranking.mp4` — для SEO-замка (зацикленное видео)
- `videos/video-6-cracked-algorithm.mp4` — fallback на случай если первое не вставится

Эталоны:
- `ref-slide-01-welcome.png`, `ref-slide-02-profile.png`, `ref-slide-03-leads.png`
- + готовые слайды 2/3/6/7/8/9 если есть

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

Build slide 10 of an investor pitch deck.

DARK VARIANT — invert palette like slide 6 for systems-diagram feel:
- Background: #0A1118 (deep navy)
- Primary text: #faf9f5
- Accents: cyan #1397D6, cyan light #56C2F0, green #10b981
- Muted text: rgba(255,255,255,0.55)
- Card surfaces: rgba(255,255,255,0.04) with 1px rgba(86,194,240,0.18)

Title (centered top, 36px Outfit 800 light):
"Defensibility — a flywheel that compounds with scale."
Subtitle (16px Inter rgba 0.7):
"Every lawyer onboarded accelerates all four moats simultaneously."

Layout: large central flywheel + 4 moat callouts at the corners.

CENTRAL FLYWHEEL (centered, 480×480px):
5 nodes arranged in a circle, connected by clockwise cyan arrows that
animate continuously (slow rotation, 12s loop, never stops).
Use cyan light #56C2F0 for arrows, with subtle pulse along the path.

Node positions (12 o'clock as top):
Node 1 (top, 12 o'clock):
  "More lawyers publish profiles"
  In a 140×80 rounded glass card
Node 2 (2 o'clock):
  "More long-tail pages in Google"
Node 3 (5 o'clock):
  "More inbound client searches"
Node 4 (7 o'clock):
  "More qualified exclusive leads"
Node 5 (10 o'clock):
  "Lawyers want in → they publish"

Center of the flywheel:
- 120×120 circle with deep navy fill and cyan light glow
- Label inside (centered):
  "ConsultantLM" 14px Outfit 700 cyan light
  "Flywheel" 11px caption rgba 0.6

Each node card has a small cyan dot connector to the next node forming
the circular flow. Arrows rotate continuously to indicate
self-reinforcement.

FOUR MOAT CALLOUTS at corners (each ~ 280×180):

TOP-LEFT — DATA MOAT
- Icon: brain / neural network in cyan, 32×32
- Title 18px Outfit 700 cyan light: "Data moat"
- Body 12px Inter rgba 0.7:
  "Every quiz fills our training set (profession × city × services ×
  ROI). After 10K completions, our AI generates content competitors
  can't reproduce."

TOP-RIGHT — SEO MOAT
- Icon: search magnifier with rising arrow, cyan
- Title: "SEO moat"
- Body:
  "1K profiles = 1K unique long-tail pages indexed under local
  attorney queries. Compounding Google authority."
- Below body: embedded micro video player 200×120 looping
  `video-2-google-ranking.mp4` muted with subtle cyan glow border

BOTTOM-LEFT — MARKETPLACE MOAT
- Icon: linked chains / one-to-one connector, green
- Title 18px Outfit 700 green: "Marketplace moat"
- Body:
  "Exclusive leads — 1 → 1, not 1 → 5 like Avvo. Switching cost grows
  with purchase history; lawyers can't take their lead pipeline
  elsewhere."

BOTTOM-RIGHT — COMPLIANCE MOAT
- Icon: shield with checkmark, amber
- Title 18px Outfit 700 amber: "Compliance moat"
- Body:
  "ABA Model Rules + SOC 2 ready out of the box. Non-negotiable for US
  attorneys. Agencies, freelancers and offshore alternatives cannot
  match this."

BOTTOM CAPTION (centered below flywheel):
"Every paid lawyer accelerates all four moats simultaneously."
14px Inter italic cyan light #56C2F0

ANIMATION:
- Flywheel nodes appear clockwise one-by-one, 200ms stagger
- Arrows start rotating immediately after the last node appears
- Four moat callouts fade in from corners with 120ms stagger
- SEO video loop starts automatically muted
- Numbers count-up on entry
```

---

## 🗣 По-простому (для вашей проверки)

**Что я попросил:**

- **Тёмный слайд** (как Слайд 6) — для серьёзного «системного» ощущения. Cyan светится на тёмном фоне.
- **В центре** — большой циклический flywheel из 5 узлов (каждый = шаг в самоусиливающейся петле). Стрелки между узлами **постоянно вращаются** (12 сек цикл) — визуальная метафора «маховик не останавливается».
- **По 4 углам** — 4 «замка»-моата:
  1. **Data moat** (cyan, мозг) — данные квиза тренируют AI
  2. **SEO moat** (cyan, лупа) — 1K профайлов = 1K страниц, **+ зацикленное видео `video-2-google-ranking.mp4`** показывает рост позиций
  3. **Marketplace moat** (green, цепи) — exclusive leads vs Avvo 1-to-5
  4. **Compliance moat** (amber, щит) — ABA + SOC 2
- **Снизу** — фраза «каждый новый юрист ускоряет все 4 моата одновременно».

**Чего инвестор должен «считать»:**
1. У нас не один моат — **четыре, и они компаундятся**
2. Маховик не остановить — чем больше юристов, тем сильнее всё
3. **Exclusive leads** — главный отличительный момент от Avvo (которая 1-to-5)
4. Compliance — невозможно повторить для не-софтверной альтернативы

**Ваш чек после генерации:**
- [ ] Фон реально тёмный (#0A1118)
- [ ] 5 узлов flywheel расположены по кругу (12 / 2 / 5 / 7 / 10 часов)
- [ ] Стрелки между узлами **видимо вращаются** (не статика)
- [ ] Центр круга — лого «ConsultantLM Flywheel» виден
- [ ] В правом-верхнем моате (SEO) реально проигрывается видео
- [ ] 4 моата каждый своего цвета (cyan / cyan / green / amber)
- [ ] Фраза «каждый юрист ускоряет всё» внизу читается
