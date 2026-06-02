# Slide 8 — Market Opportunity

## 🎯 Ассеты для прикрепления в Claude Design

Из папки `lastQuiz/`:
- `images/ATTORNEYnyc.png` — карта Нью-Йорка (как референс для NYC-пина)

Эталоны:
- `ref-slide-01-welcome.png`, `ref-slide-02-profile.png`, `ref-slide-03-leads.png`
- + готовые слайды 2/3/6/7 если есть

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

Build slide 8 of an investor pitch deck titled
"Market — a $14B addressable wedge inside $394B legal services."

Subtitle (16px Inter muted):
"US-only, Year 3 SOM = $1.5B. We need 3% to be a $45M ARR business."

Layout: 50/50 horizontal split + bottom geo strip.

LEFT HALF — Concentric circle diagram (TAM / SAM / SOM):
Three nested circles, centered, largest outermost.

Outermost (TAM):
- 480px diameter
- Fill grey #94a3b8 at 0.12 opacity
- 1px solid grey border
- Label outside top: "$394B" in 56px Outfit 800
- Sub-label: "TAM — US legal services revenue (2024)"

Middle (SAM):
- 320px diameter
- Fill cyan light #56C2F0 at 0.18 opacity
- 1.5px cyan border
- Label inside top: "$24B" in 44px Outfit 800 cyan deep
- Sub-label: "SAM — US lawyer marketing & client acquisition spend"

Innermost (SOM):
- 160px diameter
- Fill deep navy #0A1118 solid
- 2px cyan light outline glowing
- White text inside center:
  "$1.5B" in 32px Outfit 800 cyan light
  "SOM (3 years)" 11px caption
  "600K solo × $2.5K ARPU" 10px caption

Innermost SOM circle pulses softly (scale 1.0 → 1.04 → 1.0, 1.5s loop)
with a cyan glow halo to draw the eye.

RIGHT HALF — Three vertical "Why now" cards stacked, equal height:

Card 1:
- Icon: rising line chart in cyan deep #1397D6 (40×40 top-left)
- Title 18px Outfit 700: "AI generation hit zero marginal cost"
- Body 13px Inter:
  "GPT-class models drove per-customer content production cost from
  ~$200/month (agency) to under $4. Margins flip from impossible to
  85%+."

Card 2:
- Icon: exit door / arrow leaving box, green
- Title: "Avvo proved the model — exited for $650M (2018)"
- Body:
  "But Avvo was directory-era. No one has rebuilt this AI-native, with
  exclusive leads and content production."

Card 3:
- Icon: calendar with upward arrow, amber
- Title: "Lawyer digital spend growing +17% YoY"
- Body:
  "ABA TechReport 2024 — fastest-growing category of legal-tech
  spending. Still <8% of total marketing budgets."

BOTTOM GEO STRIP (full width, 120px tall):
- Faint outline map of the contiguous United States, light grey #94a3b8
  at 0.3 opacity, centered horizontally
- Three pulsing cyan pin markers placed approximately:
  Pin 1: New York (NY) — top-right of map
  Pin 2: Florida (FL) — bottom-right
  Pin 3: Texas (TX) — center-south
  Use the visual style of the attached ATTORNEYnyc.png as reference for
  pin treatment.
- Each pin has a small connecting line to a label:
  "NY · Q1 launch"
  "FL · Q2 launch"
  "TX · Q3 launch"
- Caption centered above map (12px Inter italic muted):
  "Year-1 paid acquisition rollout"

ANIMATION:
- TAM circle fades in first (240ms)
- SAM scales in from inside TAM (320ms)
- SOM appears with glow burst, then starts pulsing
- Number labels count-up on entry
- Pins on map drop in one-by-one ("falling pin" animation, 80ms stagger)
```

---

## 🗣 По-простому (для вашей проверки)

**Что я попросил:**

- **Слева** — три вложенных круга TAM/SAM/SOM. Самый внутренний (SOM = наша 3-летняя цель $1.5B) светится cyan и пульсирует, чтобы инвестор сразу его выцепил.
- **Справа** — три карточки «Why now»: (1) AI обнулил себестоимость, (2) Avvo продали за $650M, (3) рынок растёт +17% в год.
- **Снизу** — узкая полоса с контурной картой США и тремя cyan-пинами в NY, FL, TX — план запуска платного привлечения.

**Чего инвестор должен «считать»:**
1. Рынок гигантский ($394B), но мы не претендуем на весь — только на $14B нишу маркетинговых трат
2. 3-летняя цель ($1.5B SOM) — реалистично большая
3. Тайминг идеальный — AI только что обнулил юнит-экономику + есть свежий аналог (Avvo) с известным exit-капом
4. Есть конкретный geo-rollout план (3 штата за 3 квартала) — не «весь рынок сразу»

**Ваш чек после генерации:**
- [ ] Три круга вложены друг в друга, не разнесены
- [ ] Самый маленький круг (SOM) реально пульсирует и светится
- [ ] Цифры $394B / $24B / $1.5B заметно крупнее всего остального
- [ ] Карта США внизу узнаваема (не Россия и не Европа)
- [ ] Три пина точно в NY / FL / TX (а не где попало)
- [ ] Каждая Why-now-карточка имеет свою иконку нужного цвета (cyan/green/amber)
