# 00 — Design System Header

**Назначение:** этот блок **вставляется в начало каждого** промпта для Claude Design. Он жёстко фиксирует визуальный язык, чтобы все 8 новых слайдов выглядели как одна колода.

**Источник палитры:** реальные hex из вашего существующего деки `markichyt.github.io/consultantUA/` (взяты из SVG-логотипа в исходнике страницы — это ваши настоящие бренд-цвета, не догадки).

---

## Что копировать (один блок текста)

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
language of the reference screenshots attached in this session
(slides 1, 2, 3 of the existing deck). Background, fonts and
accent colors must be identical to the reference.

=== SLIDE-SPECIFIC CONTENT BELOW ===
```

---

## По-простому

Этот блок говорит Claude Design:
- **Палитра:** 8 точных HEX-кодов. Запрет подставлять «свои».
- **Шрифты:** Outfit для заголовков и цифр, Inter для текста. Конкретные размеры в px.
- **Сетка:** канвас 1920×1080, отступы 80px, радиус карточек 16px, тени с тонким cyan-намёком.
- **Лого:** 40×40 в верхнем-левом — точно такой же, как у вас уже есть.
- **Анимация:** одинаковая скорость и стиль везде — 240мс ease-out, 120мс задержка между элементами.
- **Самое важное:** требует сопоставлять с приложенными скринами референса.
