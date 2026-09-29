# consultant-design-system

Переносимая дизайн-система CONSULTANT Legal Marketplace. Папку можно копировать, архивировать и отдавать любой сессии Claude (или человеку).

## Как отдать Claude

1. **Автоматически на этом Mac.** Папка подключена как skill (`~/.claude/skills/consultant-design-system` → эта папка). Достаточно написать в любой сессии: «сделай … в стиле CONSULTANT» — Claude сам подхватит правила. Если папку переместить, обновите ссылку: `ln -sfn /новый/путь ~/.claude/skills/consultant-design-system`.
2. **Промптом.** Вставьте первой строкой: `Используй дизайн-систему из ~/Desktop/consultant-design-system: прочитай DESIGN-SYSTEM.md и components.md, подключи tokens.css и styles.css, ассеты бери из assets/. Сделай …`
3. **Внутри проекта.** Скопируйте папку в репозиторий (например `design-system/`). Файл `CLAUDE.md` в ней объяснит Claude, как ей пользоваться, когда сессия открыта в проекте.

## Что внутри

- `DESIGN-SYSTEM.md` — спецификация: принципы, цвета, типографика, сетка, форма, компоненты, картинки, текст, запреты, чек-лист.
- `tokens.json` — те же значения для кода и не-веб форматов.
- `tokens.css`, `styles.css` — CSS-переменные и классы компонентов (адаптив включён).
- `components.md` — разметка каждого компонента. `components.html` — живой гайд, открывается в браузере.
- `templates/home.html` — утверждённая главная (эталон). `examples/` — скриншоты эталона, основ и шрифта.
- `assets/logo`, `assets/fonts` (Consultant Display Regular/Bold, Bicubik), `assets/images`.
- `source/` — генераторы фирменного шрифта (Python, fontTools + skia-pathops).
- `SKILL.md`, `CLAUDE.md` — инструкции для Claude.

Версия 1.0 · 23.09.2026 · утверждённая комбинация: раскладка A, острые картинки, Manrope + Onest.
