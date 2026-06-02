# Slide 9 — Business Model

## 🎯 Ассеты для прикрепления в Claude Design

Из папки `lastQuiz/`:
- `images/profiles/PHOTO1.png` — Base тариф (мини-портрет)
- `images/profiles/PHOTO2.png` — Pro тариф
- `images/profiles/PHOTO3.png` — Premium тариф

Эталоны:
- `ref-slide-01-welcome.png`, `ref-slide-02-profile.png`, `ref-slide-03-leads.png`
- + готовые слайды 2/3/6/7/8 если есть

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

Build slide 9 of an investor pitch deck titled
"Business Model — 4 stacked revenue streams per lawyer."

Subtitle (16px Inter muted):
"Blended ARPU target $2,400/year. Subscription is the floor; lead
overflow is the upside."

Layout: 3 zones — top tier row (4 pricing cards), bottom stacked
revenue bar, right side stats strip (full height).

TOP TIER ROW — 4 cards side-by-side, equal width, 16px gap:

Card 1 — BASE:
- Circular crop of attached PHOTO1.png at top, 64px diameter
- Tier name "BASE" in 14px Outfit 700 muted grey, letter-spacing 1.5px
- Price "$49" in 56px Outfit 800
- "/month" in 14px muted next to price
- Divider line cyan light 0.3 opacity
- Features list 13px Inter, 4 lines:
  • 10 AI posts / videos
  • 6 lead purchases
  • Public AI profile
  • CRM + secure chat
- Border 1px grey #94a3b8 at 0.3 opacity

Card 2 — PRO (HIGHLIGHTED, slightly larger and elevated):
- Top-right corner badge: "MOST PICKED" in 10px Outfit 700, cyan deep
  on cyan light pill 4×8px padding
- Circular crop of PHOTO2.png at top, 72px diameter
- Tier name "PRO" in 14px cyan deep
- Price "$199" in 64px Outfit 800 cyan deep
- "/month" in 14px muted
- Divider line cyan deep
- Features list:
  • 40 AI posts / videos (4× Base)
  • 30 lead purchases (5× Base)
  • AI PRO Avatar — speaks 24/7
  • Boost rating from past cases
  • Custom service pricing
- Border 2px cyan deep #1397D6, soft cyan shadow
- translateY -8px to elevate visually

Card 3 — PREMIUM:
- Circular crop of PHOTO3.png at top, 64px
- Tier name "PREMIUM" in 14px Outfit 700 deep navy
- Price "$499" in 56px Outfit 800
- "/month" in 14px muted
- Divider line amber 0.4 opacity
- Features list:
  • 100 AI posts / videos
  • Unlimited lead purchases
  • AI PREMIUM Avatar (real-time)
  • Top in Google by your name
  • 24/7 personal manager
- Border 1px deep navy at 0.4, with 1px amber accent inset

Card 4 — ENTERPRISE:
- Top icon: handshake line-icon 56×56 muted grey
- Tier name "ENTERPRISE" 14px Outfit 700
- Price "Custom" in 40px Outfit 800
- Caption "for 10+ lawyer firms"
- Features list:
  • Sales contract
  • Volume pricing
  • Dedicated CSM
  • White-label option
  • iManage / Clio integrations
- Border 1px dashed muted grey (different texture intentionally)

BOTTOM STACKED BAR — Per-lawyer monthly revenue mix:
Title above (16px Outfit 700):
"Per-lawyer monthly economics (Pro tier blended)"

Single horizontal bar, full available width, 64px tall, segmented left
to right with hard divider lines:

Segment 1 (45% width): deep navy #0A1118
  Label inside: "$179 — Subscription"
Segment 2 (35% width): cyan deep #1397D6
  Label inside: "$220 — Lead buying"
Segment 3 (12% width): green #10b981
  Label inside: "Enterprise share"
Segment 4 (8% width): amber #f59e0b
  Label inside: "$XX — Referrals"

Below bar (12px Inter muted):
"Annual prepay (−10%) drives 38% of users to lock in 12 months →
strong working capital and lower churn."

RIGHT SIDE PANEL — Vertical, 280px wide, full height beside layout:
Title (14px Outfit 700 muted): "Year 1 unit economics"
3 large stat blocks, 32px gap:

Stat 1:
"$179" — Outfit 800, 48px cyan deep
Caption: "Blended MRR per user"

Stat 2:
"−10%" — Outfit 800, 48px amber
Caption: "Annual prepay discount"

Stat 3:
"$2.4K" — Outfit 800, 48px green
Caption: "Year-1 ARPU target"

ANIMATION:
- Tier cards fade in left-to-right with 120ms stagger
- Pro card lifts to its elevated position last (240ms ease-out)
- Stacked bar segments grow from left to right (300ms each)
- Right stats count-up on entry
```

---

## 🗣 По-простому (для вашей проверки)

**Что я попросил:**

- **Сверху** — 4 тарифные карточки: Base $49 / **Pro $199 (выделен, с пометкой "MOST PICKED", чуть приподнят)** / Premium $499 / Enterprise (custom). У первых трёх — ваши фото юристов в кружках сверху. У Enterprise — иконка рукопожатия.
- **Снизу** — одна большая горизонтальная полоса-стэк. Внутри 4 цветных сегмента: subscription / lead buying / enterprise / referrals. Каждый подписан суммой. Это показывает, что один юрист = 4 потока выручки.
- **Справа** — узкая колонка с 3 главными цифрами: $179 MRR / −10% annual / $2.4K ARPU.

**Чего инвестор должен «считать»:**
1. У нас не «одна цена» — 4 источника выручки с одного клиента
2. Pro — наш magnet (выделен)
3. Annual prepay 10% — улучшает cash flow и снижает churn
4. ARPU $2.4K — это уже не SaaS-копейки, это серьёзный per-customer revenue

**Ваш чек после генерации:**
- [ ] Pro-карточка реально приподнята и выделена cyan-обводкой
- [ ] Все 4 тарифа одинаковой ширины (кроме Pro чуть больше)
- [ ] Фото в кружках сверху — те, что вы приложили (а не сгенерированные)
- [ ] Стэк-бар имеет 4 цветовых сегмента в правильных пропорциях (45/35/12/8)
- [ ] Подпись «Annual prepay drives 38%» под баром читается
- [ ] Цифры справа крупные и в правильных цветах (cyan / amber / green)
