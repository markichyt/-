# Slide 6 — AI Content Engine + AI Avatar (тёмный вариант)

## 🎯 Ассеты для прикрепления в Claude Design

Из папки `lastQuiz/`:
- `videos/i_avatar.mp4` — главное демо AI Avatar (большое видео слева)
- `videos/screenshots/111 gif.jpg` или любой из `videos/screenshots/*.jpg` — статичный fallback на случай если Claude Design не вставит видео

Эталоны:
- `ref-slide-01-welcome.png`, `ref-slide-02-profile.png`, `ref-slide-03-leads.png`
- + готовые слайды 2 и 3 если есть

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

Build slide 6 of an investor pitch deck.

DARK VARIANT — this slide inverts the palette for cinematic contrast:
- Background: #0A1118 (deep navy, NOT off-white)
- Primary text: #faf9f5 (light)
- Accents stay the same: cyan #1397D6, cyan light #56C2F0
- Muted text: rgba(255,255,255,0.55)
- Card surfaces: rgba(255,255,255,0.04) with 1px rgba(86,194,240,0.18) border

Title (centered top, 36px Outfit 800 cyan #56C2F0):
"Every paid lawyer gets a 24/7 marketing team — fully automated."
Subtitle below (16px Inter rgba light 0.7):
"Three AI systems, one subscription. Marginal cost per lawyer: under $4/month."

Layout: 60/40 horizontal split.

LEFT 60% — AI Avatar video player
- Embed the attached `i_avatar.mp4` as a tall portrait video
  (aspect 9:16) inside a 16px rounded frame
- Soft cyan glow border using shadow:
  0 0 60px rgba(86,194,240,0.35), 0 0 0 1px rgba(86,194,240,0.4)
- Below the video, small caption in 12px Inter rgba light 0.6:
  "AI Avatar — Pro & Premium plans. Speaks for the lawyer in social
  videos and on-page chat, 24/7."
- Top-right corner of the video: floating label
  "LIVE DEMO" in 10px Outfit 700 with a pulsing red dot

RIGHT 40% — Vertical stack of 4 feature cards, 12px gap

Card 1:
- Big cyan number "10 / 40 / 100" (Outfit 700, 44px)
- Caption (12px muted): "AI posts & videos per month
  (Base / Pro / Premium)"
- Embedded micro bar chart 3 vertical bars visualizing 1× / 4× / 10×
  growth, cyan gradient

Card 2:
- Icon top-left: target / bullseye line-icon, cyan #56C2F0, 28×28
- Title 16px Outfit 700 "AI Module for Google & Meta Ads"
- Body 13px Inter light 0.7:
  "Generates ad copy, picks audiences, runs A/B tests, auto-optimizes
  spend against ROAS goals."

Card 3:
- Icon: radar / scanning circle line-icon
- Title: "Competitor Monitoring AI"
- Body:
  "Daily scan of local competitor SEO rankings, ad creatives, content
  velocity. Auto-suggests counter-moves."

Card 4:
- Icon: chat bubble with sparkle
- Title: "AI Client Assistant"
- Body:
  "Pre-qualifies inbound leads, books consultations, handles FAQ.
  Filters 3-in-5 noisy inquiries before they reach the lawyer."

BOTTOM FOOTER (full width, centered, 14px Inter italic rgba light 0.55):
"Marginal cost of content production per lawyer: under $4/month."

ANIMATION:
- Video starts muted with a "click for sound" hint overlay.
- Cards slide in from the right with 100ms stagger.
- Numbers count-up on entry.
- LIVE DEMO badge dot pulses 1.2s loop.
```

---

## 🗣 По-простому (для вашей проверки)

**Что я попросил:**

- **Это тёмный слайд** (фон #0A1118 — почти чёрный навy) для кинематографичного контраста с остальными off-white слайдами. Cyan-акценты светятся.
- **Слева 60%** — большое вертикальное видео вашего AI Avatar (`i_avatar.mp4`). Обведено светящимся cyan-border. Сверху бейдж «LIVE DEMO» с пульсирующей красной точкой.
- **Справа 40%** — стек из 4 карточек:
  1. **«10 / 40 / 100»** с микро-гистограммой (контент в месяц по тарифам)
  2. **AI Module for Google & Meta Ads** — иконка-мишень
  3. **Competitor Monitoring AI** — иконка-радар
  4. **AI Client Assistant** — иконка-чат
- **Снизу** — мелкая курсивная строка «себестоимость <$4/мес на юриста».
- **Анимация:** карточки выезжают справа по очереди, цифры считаются.

**Чего инвестор должен «считать»:**
1. У нас не просто «контент-генератор» — это полноценная маркетинговая система из 4 AI-модулей
2. Масштабирование почти бесплатное (<$4/юрист/мес) = огромная маржа
3. Pro/Premium даёт 4× и 10× больше контента → понятная upsell-лестница

**Ваш чек после генерации:**
- [ ] Фон реально тёмный (#0A1118), не серый и не синий
- [ ] Видео аватара видно и оно крупное (~60% ширины)
- [ ] Cyan-свечение вокруг видео заметно но не агрессивно
- [ ] 4 карточки справа равной высоты
- [ ] Микро-гистограмма в первой карточке читается
- [ ] LIVE DEMO бейдж пульсирует
