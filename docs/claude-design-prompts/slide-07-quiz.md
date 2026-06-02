# Slide 7 — The Quiz: 5-минутная conversion machine

## 🎯 Ассеты для прикрепления в Claude Design

**⚠️ Нужна предварительная подготовка:** снимите 4 скриншота квиза в портретном режиме.

1. Откройте `markichyt.github.io/-/` в Chrome → DevTools → Toggle Device Toolbar → iPhone 14 Pro
2. Снимите экран в 4 точках квиза и сохраните рядом с другими ассетами:
   - `screenshot-01-contact.png` — слайд 1: форма с именем, email, телефоном, фото
   - `screenshot-02-wowroi.png` — wowRoi-калькулятор с ROI-слайдером
   - `screenshot-03-assessment.png` — assessment-уровень (Low / Normal / Moderate / High)
   - `screenshot-04-pricing.png` — карусель тарифов Base / Pro / Premium

Эталоны:
- `ref-slide-01-welcome.png`, `ref-slide-02-profile.png`, `ref-slide-03-leads.png`
- + готовые слайды 2/3/6 если есть

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

Build slide 7 of an investor pitch deck titled
"Our acquisition flow IS the demo: 5 min, 24 steps, single payload."

Layout: 3 zones — top hero (40% height) + bottom funnel (45% height)
+ right metrics column (20% width, full height aside).

TOP HERO:
LEFT 60%:
- Big headline 44px Outfit 800:
  "5 minutes from cold click to paying subscriber."
- Subtitle 18px Inter rgba 0.7:
  "The 24-step quiz captures email and phone on slide 1 — even drop-offs
  become retargeting leads."
- 3 mini-stat chips below subtitle, horizontal:
  Chip 1: cyan "5 min" + caption "avg completion"
  Chip 2: cyan "24 steps" + caption "qualification depth"
  Chip 3: green "1 POST" + caption "atomic submit on payment"

RIGHT 40%:
- Phone mockup in portrait orientation, iPhone-style frame 280×580
- Inside the phone: 4 screenshots in a card-stack effect:
  Top card: `screenshot-04-pricing.png` — fully visible
  Behind: `screenshot-03-assessment.png` — offset 12px right, 8px down,
          rotated 3°, opacity 0.85
  Behind: `screenshot-02-wowroi.png` — offset 24px right, 16px down,
          rotated 5°, opacity 0.65
  Behind: `screenshot-01-contact.png` — offset 36px right, 24px down,
          rotated 7°, opacity 0.45
- Subtle parallax: cards drift apart slightly on slide hover.

BOTTOM ZONE — Horizontal conversion funnel, 5 stages left to right:

Stage 1: "Cold click"
- Width: 100%, fill grey #94a3b8 with 0.2 opacity
- Label below: "100%"
- Caption: "Inbound from Google / Meta / direct"

Stage 2: "Quiz started"
- Width: 78%, fill cyan light #56C2F0 with 0.3 opacity
- Label below: "78%"
- Caption: "Lawyer clicks 'Start'"

Stage 3: "Email captured" (HIGHLIGHT THIS STEP)
- Width: 71%, fill cyan deep #1397D6
- Label below: "71%"
- Caption: "Slide 1 form completed"
- Big cyan badge floating above: "LEAD CAPTURED — even if they drop now"
  in 13px Outfit 700, with a small arrow connector to the bar

Stage 4: "Quiz completed"
- Width: 38%, fill deep navy #0A1118 with 0.8 opacity
- Label below: "38%"
- Caption: "All 24 steps, profile built"

Stage 5: "Paid subscriber"
- Width: 18%, fill deep navy #0A1118 solid with 2px green outline
- Label below: "18%"
- Caption: "Subscription activated"

The funnel bars should narrow visibly stage-to-stage, creating a clear
inverted-pyramid silhouette. Each bar 80px tall, 16px gap between bars.

RIGHT METRICS COLUMN (sticky right, 320px wide, full slide height):
- Glassmorphic vertical panel with title 14px Outfit 700:
  "Why this beats traditional forms"
- 3 metric blocks stacked, 32px gap:
  Block 1: cyan "−68%" + caption "drop-off vs static contact form"
  Block 2: green "3.2×" + caption "lead-quality score"
  Block 3: amber "+44%" + caption "completion after Profile Strength
           UX update"

BOTTOM-LEFT CTA STRIP (bottom of slide, full width):
- Small text 14px Inter: "Live demo →"
- URL in 16px cyan #1397D6: "markichyt.github.io/-/"
- To the right, QR code 80×80 generated from that URL with cyan accent
- Tagline below: "Try the quiz yourself in 5 minutes."

ANIMATION:
- Phone cards slide into stack with 80ms stagger.
- Funnel bars draw width left-to-right, 300ms each, staggered 80ms.
- LEAD CAPTURED badge fades in last with a soft pulse.
- Metric numbers count-up on entry.
```

---

## 🗣 По-простому (для вашей проверки)

**Что я попросил:**

- **Сверху** — заголовок «5 минут от клика до подписчика» + 3 чипа-метрики + iPhone-мокап с 4 скринами квиза «стопкой» (верхний полностью виден, остальные торчат сзади под углом).
- **В середине-снизу** — горизонтальная воронка из 5 ступеней (100% → 78% → 71% → 38% → 18%). Третья ступень («email captured») подсвечена и над ней висит бейдж «LEAD CAPTURED — даже если drop now».
- **Справа** — узкая колонка с 3 метриками: «−68% drop-off», «3.2× lead quality», «+44% completion».
- **Внизу** — ссылка на живой квиз + QR-код.

**Чего инвестор должен «считать»:**
1. Воронка реальная — мы знаем где люди отваливаются
2. Гениальный приём: email на слайде 1 → даже drop-off = лид
3. Sub-20% paid conversion при 78% старта — это **в разы лучше** indсtri standard contact-form (~3%)
4. Есть живая демо-ссылка — инвестор может прокликать сам

**Ваш чек после генерации:**
- [ ] 4 скриншота квиза вставлены в правильном порядке в стопке
- [ ] Воронка действительно сужается слева-направо (видно глазом)
- [ ] Бейдж «LEAD CAPTURED» виден и не перекрывает цифры
- [ ] QR-код реально генерирован из URL
- [ ] Все 4 проценты в воронке: 100, 78, 71, 38, 18
