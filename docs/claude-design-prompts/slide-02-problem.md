# Slide 2 — The Problem

## 🎯 Ассеты для прикрепления в Claude Design

Из папки `lastQuiz/`:
- `images/1x1/avatar1.png` … `avatar28.png` — все 28 файлов перетащить разом (28 аватарок юристов)

Плюс ваши эталонные скрины:
- `ref-slide-01-welcome.png`
- `ref-slide-02-profile.png`
- `ref-slide-03-leads.png`

---

## 📋 Промпт (Cmd+A, Cmd+C весь блок ниже)

```
=== DESIGN SYSTEM — keep identical across every slide ===

PALETTE (use EXACTLY these hex, never substitute):
- Background:        #faf9f5  (warm off-white, same as existing deck)
- Primary text:      #0A1118  (near-black navy — from existing logo SVG)
- Cyan deep:         #1397D6  (primary accent — from existing logo)
- Cyan light:        #56C2F0  (highlight — from existing logo)
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

Build slide 2 of an investor pitch deck titled
"The Problem — US lawyers can't grow online."

Style: minimal editorial infographic. Red accents are RESERVED for the
problem numbers only; do not overuse red elsewhere.

Layout (3 vertical zones, top to bottom):

TOP ZONE — Big headline (50% width left-aligned, 36–44px Outfit 800):
"US lawyers spend $24B/year on marketing —
and most can't measure a single client back."
Subtitle below in muted grey 14px Inter:
"Solo and small-firm attorneys, 79% of the US bar, have no marketing
team and no measurable lead pipeline."

MIDDLE ZONE — A 7-column × 4-row grid of small circular lawyer avatars
(28 total — use the 28 attached avatar files avatar1.png to avatar28.png,
one per cell). Each circle: 64px diameter, 4px gap between circles.
22 random avatars must be desaturated (greyscale, opacity 0.45) with a
faded "?" mark above each.
6 random avatars stay full color, fully opaque.
Caption beneath the grid, centered, 13px Inter italic muted grey:
"1.3M US attorneys. 79% in solo or sub-10-person firms. No marketing team."

BOTTOM ZONE — Three horizontal "pain pillar" cards side-by-side,
equal width, glassmorphic with card shadow:

Card 1:
- Icon top-left: stylized broken funnel in red #ef4444 (32×32)
- Big number: "$8K–$24K" in red Outfit 700, 56px
- Body 13px Inter:
  "spent per year by the average solo lawyer on Google Ads, agencies,
  SEO — without measurable ROI."

Card 2:
- Icon: chain link split in red #ef4444
- Big number: "1 → 5"
- Body:
  "Avvo, FindLaw, Lawyer.com sell the same lead to 3–5 attorneys at once."

Card 3:
- Icon: down-arrow in red
- Big number: "4–8%"
- Body:
  "average lead-to-client conversion on legacy directory platforms."

FOOTER (bottom-right, 9px grey #94a3b8):
"Source: ABA TechReport 2024"

ANIMATION:
- Avatars: fade in from grey → 22 stay grey, 6 transition to full color
  over 800ms, staggered by row.
- Three pain cards: slide up 16px and fade in, staggered 120ms.
- Numbers count-up animation on entry.
```

---

## 🗣 По-простому (для вашей проверки)

**Что я попросил:**

- **Сверху слева** — заголовок про $24 млрд/год без клиентов + подзаголовок про 79% solo-юристов.
- **В середине** — сетка 7×4 из 28 кружков-аватарок (ваши `images/1x1/avatar1-28.png`). 22 серые с «?», 6 цветные. Под сеткой подпись «1.3M US attorneys».
- **Снизу** — три красные карточки болей: «$8K–$24K в никуда» / «1 лид → 5 юристам» / «4–8% конверсия». Каждая с иконкой, большой красной цифрой и пояснением.
- **Низ справа** — мелкая сноска про источник ABA TechReport.
- **Анимация:** аватарки появляются волной (часть остаётся серой), карточки выезжают снизу.

**Чего инвестор должен «считать» с этого слайда:**
1. Рынок огромный — 1.3 млн юристов
2. У них реальная боль — деньги тратят, результата нет
3. Конкуренты (Avvo, FindLaw) — мусорные

**Ваш чек после генерации:**
- [ ] 28 кружков на месте, 22 серые / 6 цветные
- [ ] Заголовок не вылезает за половину ширины
- [ ] Все три карточки одинаковой высоты
- [ ] Красный используется только на цифрах боли, нигде больше
