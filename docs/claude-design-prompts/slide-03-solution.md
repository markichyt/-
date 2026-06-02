# Slide 3 — The Solution: 3 пиллара ConsultantLM

## 🎯 Ассеты для прикрепления в Claude Design

Из папки `lastQuiz/`:
- `images/profiles/PHOTO1.png` — фото для пиллара Base
- `images/profiles/PHOTO2.png` — фото для пиллара Pro
- `images/profiles/PHOTO3.png` — фото для пиллара Premium

Плюс эталонные скрины:
- `ref-slide-01-welcome.png`
- `ref-slide-02-profile.png`
- `ref-slide-03-leads.png`

И уже готовые слайды (если есть): `ref-slide-02-done.png`, и т.д.

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

Build slide 3 of an investor pitch deck titled
"The Solution: One subscription. Three workflows."

Subtitle (16px Inter muted):
"The marketing team a solo lawyer can never afford — running 24/7."

Layout: 3 tall vertical pillar cards side-by-side, equal width,
glassmorphic with subtle cyan-tinted shadow, 16px gap between.

Each pillar has 5 zones, top to bottom:

PILLAR 1 — AI PROFILE
- Top: circular icon area 80×80 with cyan #1397D6 tinted background,
  emoji 🪪 centered (or use a clean line-icon: ID card)
- Title 24px Outfit 800: "AI Profile"
- Subtitle 12px muted grey:
  "Replaces website + copywriter (~$5K/year)"
- Bullet list 4 lines, 14px Inter, with cyan #56C2F0 check marks:
  ✓ Upload CV → AI generates SEO-optimized public page in English
  ✓ Compliant with ABA Model Rules
  ✓ Indexed in Google within 24h
  ✓ One-click branding (logo, colors, photo)
- Bottom: mini mockup of a published profile card using attached
  PHOTO1.png — 240×120 rounded card with photo, name "Alexander König",
  role "Attorney", location pin "USA, New York", small star rating.

PILLAR 2 — AI CONTENT ENGINE (highlighted as central, slightly elevated)
- Top: circular icon area 80×80 with cyan tinted bg, emoji 🤖 or robot
  line-icon
- Title: "AI Content Engine"
- Subtitle: "Replaces marketing agency (~$2K/month)"
- Bullets:
  ✓ 10 / 40 / 100 posts and videos per month (by tier)
  ✓ AI Avatar speaks for the lawyer 24/7
  ✓ Auto-published to Google Ads + Meta Ads
  ✓ AI competitor monitoring with auto-adaptation
- Bottom: row of 3 mini content thumbnails (placeholder cyan rectangles
  120×80 each with content-type icons: post, video, ad)

PILLAR 3 — LEAD MARKETPLACE
- Top: circular icon area with emoji 💬 or chat-bubble line-icon
- Title: "Exclusive Lead Marketplace"
- Subtitle: "Replaces Avvo / FindLaw"
- Bullets:
  ✓ One lead → one lawyer (NOT 1-to-5 like Avvo)
  ✓ Pre-qualified by intake AI
  ✓ Geographic exclusivity per practice area
  ✓ Pay-as-you-go above subscription quota
- Bottom: mini mockup of an incoming lead card — 240×120 rounded card
  with title "New Lead — Family Law, NYC", caption "Sarah M., budget
  $5K–10K", green "NEW" badge top-right.

UNDER ALL 3 PILLARS — Centered tagline, 18px Outfit 600 italic cyan
#1397D6:
"What Avvo did in 2007 for directories, we're doing for AI-native solo
practice in 2026."

Center pillar (Pro / Content Engine) should appear slightly elevated
(translateY -8px) and have a subtle cyan glow border to signal it as
the central workflow.

ANIMATION:
- Pillars fade in and slide up 16px, staggered 120ms left-to-right.
- Mini-mockups inside each pillar fade in 200ms after the parent pillar.
- Tagline fades in last.

INTERACTION:
- Hover on a pillar: lift 4px, shadow deepens.
```

---

## 🗣 По-простому (для вашей проверки)

**Что я попросил:**

- **Три высокие колонки** — по одной на каждый продукт ConsultantLM.
- Каждая колонка имеет одинаковую структуру: иконка-кружок сверху → название → «что заменяет и сколько стоит сэкономить» → 4 чек-листа с фичами → мини-скрин внизу.
- **Центральная колонка (AI Content Engine)** чуть приподнята и обведена cyan — намёк инвестору «вот наш главный продукт».
- В мини-скринах используются ваши готовые фотки `PHOTO1-3.png`.
- **Снизу — слоган** про Avvo (намёк на возможный exit).

**Чего инвестор должен «считать»:**
1. У нас не один продукт, а три (= защищённый rev mix)
2. Каждый заменяет конкретную статью расходов юриста (= понятный value prop)
3. Мы — AI-version Avvo, у которой был exit $650M (= аналогия для возврата)

**Ваш чек после генерации:**
- [ ] Три колонки равной ширины
- [ ] Центральная колонка визуально выделена
- [ ] В мини-скринах внизу действительно ваши фото юристов
- [ ] Тэглайн про Avvo внизу не обрезан
- [ ] Cyan-glow только на центральной колонке
