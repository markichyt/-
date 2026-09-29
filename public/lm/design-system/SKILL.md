---
name: consultant-design-system
description: Дизайн-система CONSULTANT Legal Marketplace (consultantlm.com). Use whenever the user wants anything "в стиле CONSULTANT" / for consultantlm — pages, landing pages, app screens, emails, banners, presentations, documents — or works inside this folder. Loads the approved tokens (black, white, gray, one #0095D4 accent ≤ 5%), fonts (Manrope + Onest, optional Consultant Display), radii (sharp images, rounded cards, pill buttons), spacing, component markup and copy rules.
---

# CONSULTANT design system — how to apply it

Everything lives next to this file (the folder is the skill). Paths below are relative to this SKILL.md.

1. Read `DESIGN-SYSTEM.md` in full before designing anything. It is the source of truth; `tokens.json` is the same data for code.
2. For web output: link Google Fonts (Manrope 600/700/800, Onest 400/500/600), then `tokens.css`, then `styles.css`; build with the classes documented in `components.md`. Copy the three files into the project if it lives elsewhere. Do not restyle them — extend with new classes that reuse the tokens.
3. For non-web output (slides, documents, images, Figma): use the same colours, type scale and radii from `tokens.json`; keep the accent to one element per screen; images sharp, cards 24 px, buttons pills.
4. Assets: logo in `assets/logo/` (light, dark, icon), brand fonts in `assets/fonts/`, photos in `assets/images/`. The logo is never redrawn or recoloured; on dark surfaces use `logo-on-dark.svg`.
5. Reference of the approved home page: `templates/home.html` (inline-styled, exact values) and `examples/home-approved-A-images-sharp.png`. Match its rhythm: 120 px sections, 1200 px container, centred section heads.
6. Copy: real facts and names from consultantlm.com only, English by default, one primary button per screen labelled with a verb. Never lorem ipsum, never invented numbers.
7. Before finishing, run the checklist in `DESIGN-SYSTEM.md` §11: accent ≤ 5% and only in allowed places, sharp images, correct fonts and scale, contrast pairs, spacing, one primary action, labels on inputs, mobile layout.

Hard rules: no tints of #0095D4, no gradients, no card shadows, no rounded photos, no caps headlines, no Inter/Roboto/Arial, no emoji.
