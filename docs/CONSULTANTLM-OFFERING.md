# ConsultantLM — что мы предлагаем на основе квиза

**Источник:** [main.js](../main.js) + [docs/LASTQUIZ-DATA-API-v2.md](./LASTQUIZ-DATA-API-v2.md)
**Дата:** 2026-05-27
**Цель документа:** показать, что́ именно квиз продаёт юристу и какая ценность за каждым шагом — для маркетинга, продаж и продукта.

---

## 1. Кому это для

| Сегмент | Профессии | Гео |
|---|---|---|
| Основной | Attorney, Lawyer, Notary, Patent Attorney, CPA, Tax Specialist | США (квиз на английском, тарифы в USD) |
| Расширение | Other (free text) | По мере открытия рынков (UA-версия в `serUA/`) |

Квиз — это **лид-фильтр + персонализированный pitch**. На входе — холодный трафик (Google / Meta / LinkedIn). На выходе — оплативший подписчик ConsultantLM **или** Enterprise-лид в sales-очередь.

---

## 2. 24-шаговая воронка — что мы спрашиваем

| # | Слайд | Зачем спрашиваем | Что юзер «инвестирует» |
|---|---|---|---|
| 1 | **quickContact** | Лид-захват в самом начале (имя, email, phone, photo) | 5 полей, 30 сек |
| 2 | profession | Какой контент/прайс показывать | 1 клик |
| 3 | videoProof | Социальное доказательство | пассивно |
| 4 | city | Локальный ROI, городские бенчмарки | dropdown |
| 5 | role | Self-employed / employee / executive / founder — тон оффера | 1 клик |
| 6 | services | Family law, Banking, Immigration… — какие AI-шаблоны показать | мультивыбор |
| 7 | aiCalc | Демо ИИ-возможностей | интерактив |
| 8 | channels | Где юзер уже продвигается (Instagram, LinkedIn, Reddit…) | мультивыбор |
| 9 | preferred_way | Social / paid ads / both / let AI decide | 1 клик |
| 10 | marketing_time | Сколько времени тратит на маркетинг | 1 клик |
| 11 | ad_budget | Текущий рекламный бюджет (none → $10k+) | 1 клик |
| 12 | team | Кто есть в команде (SEO, smm, видеограф…) | мультивыбор |
| 13 | tenx | 10× обещание | пассивно |
| 14–17 | video1, video2, videoAds, videoSocials | Кейсы / фичи в видеоформате | пассивно |
| 18 | **wowRoi** | Интерактивный ROI-калькулятор → `desired_clients` + `desired_revenue` | слайдер |
| 19 | period | 1 месяц / 1 год / 3 года — горизонт цели | 1 клик |
| 20 | time_on_platform | 15 мин / 30 мин / 1 час+ — сколько готов уделять платформе | 1 клик |
| 21 | **assessment** | Показываем итоговый «Your AI-powered potential level» (Low/Normal/Moderate/High) | пассивно |
| 22 | **fullProfile** | About yourself + опц. CV / Logo / Referral — топливо для AI-генерации профайла | до 3000 chars + файлы |
| 23 | profilesPricing | Карусель Base/Pro/Premium + Enterprise-link | выбор тарифа |
| 24 | **payment** | Card / PayPal — единственный финальный submit | оплата |

**Drop-off защита:**
- email/телефон собираются на **шаге 1**, а не в конце — если юзер уходит, лид уже есть.
- Step counter «STEP N / 24» вместо Back-кнопки — нельзя вернуться, но виден прогресс.

---

## 3. Что мы показываем юзеру по ходу квиза (output-сторона)

### 3.1 Глобальный progress-индикатор (top-bar)
Полоса заполнения «Profile completeness» сверху каждого слайда. Растёт по мере ответов, веса распределены неравномерно (см. `calcProfileScore` в [main.js:286](../main.js#L286)):

| Категория | Вес |
|---|---|
| Профессия | 15 |
| Контакты (имя/фамилия/email/phone) | 14 |
| Локация | 10 |
| Роль | 10 |
| Услуги | 10 |
| Маркетинг (channels/way/time/budget) | 20 |
| Цели (clients/revenue/period) | 9 |
| Платформа (time_on_platform) | 3 |
| Команда | 3 |

→ Гейм-эффект: юзер хочет «закрыть» бар.

### 3.2 wowRoi — персонализированный ROI-калькулятор (слайд 18)
Интерактивный слайдер «inquiries → платящие клиенты → revenue». Считает на лету и пишет в `quizData`:
- `desired_clients` — **realistic-low** число платящих клиентов
- `desired_revenue` — **realistic-low** USD revenue

Это не «теоретический максимум», а консервативная цифра — даёт правдоподобие, юзер верит.

### 3.3 assessment — итоговый «Your AI-powered potential level» (слайд 21)
Финальная оценка перед апсейлом, считается из ответов:

| Score | Уровень | Цвет |
|---|---|---|
| 0–29 | **Low** | красный |
| 30–49 | **Normal** | жёлтый |
| 50–74 | **Moderate** | синий |
| 75–100 | **High** | зелёный |

Юзер видит «Your level: High (84%)» + бенчмарк «Calculated for: Attorney, New York, NY, family law, immigration law». Это якорь под оплату.

### 3.4 Profile strength — bar на слайде 22 (fullProfile)
Отдельный мини-индикатор внутри слайда: насколько хорошо AI сможет сгенерировать публичный профайл из загруженных данных.

| Источник | Вклад |
|---|---|
| About yourself (3000+ chars) | до 50% |
| CV загружен | 30% |
| Company logo | 10% |
| Referral code | 10% |

Если юзер пытается пропустить с пустыми About + CV — открывается оранжево-красная модалка с предупреждением «your profile will be too weak».

### 3.5 Превью трёх профайлов (слайд 23)
Карусель с тремя моками профайла под именем Alexander König:

| Тариф | Что видит юзер |
|---|---|
| **Base** | Простая карточка, рейтинг 54.42, без AI-аватара |
| **Pro** | Усиленная карточка, рейтинг 67.59, **AI PRO Avatar video** |
| **Premium** | Премиум-карточка с фото справа, рейтинг 76.02, **AI PREMIUM Avatar video** + speaks 24/7 |

→ Юзер видит, как **будет выглядеть он сам** в каждом тарифе. Это и есть главный sale.

### 3.6 24-часовой таймер «20% DISCOUNT» (слайд 23, сверху)
LocalStorage-таймер на 24 часа от первого открытия pricing. Перезапись блокируется — даже если юзер вернётся, таймер продолжает тикать с того момента. Анкеринг скидки.

### 3.7 Trust block (слайд 23, внизу)
«Built for US attorneys» с двумя бейджами:
- ⚖️ **ABA Model Rules** compliant
- 🔒 **SOC 2 ready**

Минимально, но снимает основное возражение по compliance.

---

## 4. Тарифы — что юзер реально покупает

Базовые цены (monthly billing). Toggle Annual даёт −10%:

| Тариф | Monthly | Annual (−10%) | Кому |
|---|---|---|---|
| **Base** | **$49/mo** | $44/mo | Соло-юристы, тест-драйв |
| **Pro** | **$199/mo** | $179/mo | Активно растущая практика |
| **Premium** | **$499/mo** | $449/mo | Топ-юристы, premium-позиционирование |
| **Enterprise** | custom quote | — | Фирмы 10+ юристов, sales-разговор |

### 4.1 Матрица возможностей

#### Универсально (Base + Pro + Premium)
- ✓ AI module for Google & Meta
- ✓ AI competitor monitoring
- ✓ AI client assistant
- ✓ Referral earnings
- ✓ Private specialist chat
- ✓ CRM system
- ✓ Secure messenger

#### По уровням — AI production (граненая категория)
| Тариф | AI posts/videos в месяц | Lead buying |
|---|---|---|
| Base | 10 | 6 |
| Pro | **40** (4× more) | **30** (5× more) |
| Premium | **100** (2.5× больше Pro) | **Unlimited** |

#### Только Pro + Premium
- ✓ Boost rating from past experience **NEW**
- ✓ Set custom prices for your services **NEW**
- ✓ Reputation checks (Pro: до 10 / Premium: Unlimited)

#### AI Avatar — только Pro и Premium
- Pro: **AI PRO Avatar** **NEW** — статичный говорящий аватар
- Premium: **AI PREMIUM Avatar** **UPGRADE** — расширенный, «speaks for you 24/7»

#### Только Premium
- ✓ Top in Google by your name **NEW**
- ✓ 24/7 personal manager **NEW**
- ✓ Exclusive social promotion **NEW**

### 4.2 Enterprise (отдельная воронка)
Открывается через ссылку «Large firm? Get a custom quote →» под pricing-картой. Модалка собирает:
- Юр. название (`firm.name`)
- Бренд (`firm.company`)
- Team size (≥ 10)
- Локация
- Email / phone (предзаполняются из quickContact)
- Сообщение (optional)

→ Отправляется **немедленно** как отдельный submit с `lead_type: 'team_registration'` и `tier: 'enterprise'`. Идёт в sales-очередь, не в подписочный pipeline.

---

## 5. Что юзер получает после оплаты (value delivery)

### 5.1 AI-сгенерированный публичный профайл
Главный артефакт. AI берёт:
- `about` (текст 3000+ chars) — основная био
- `cv_name` (загруженный CV, .pdf/.doc/.docx) — извлекаются experience, education, certifications, notable cases
- `photo_name` (хедшот с quickContact)
- `company_logo_name` (если есть)
- `profession`, `city`, `services` — для категоризации

→ Генерирует профайл-страницу на английском. Рейтинг (из примеров: Base 54, Pro 68, Premium 76) — composite score алгоритма ConsultantLM.

### 5.2 AI-производство контента
- **Base:** 10 AI постов/видео в месяц
- **Pro:** 40 AI постов/видео + AI PRO Avatar
- **Premium:** 100 AI постов/видео + AI PREMIUM Avatar (24/7)

Контент готовится «AI-модулем для Google & Meta» — то есть оптимизирован под рекламные кампании.

### 5.3 Покупка лидов (lead buying)
Главный коммерческий argument. Платформа продаёт юристам клиентские запросы:
- Base: **6 лидов/мес** — попробовать качество
- Pro: **30 лидов/мес** — стабильный поток
- Premium: **Unlimited** — масштаб без потолка

### 5.4 Мониторинг и репутация
- AI competitor monitoring (все тарифы)
- Reputation checks: Pro до 10 / Premium unlimited
- Premium: «Top in Google by your name» — SEO под имя

### 5.5 Поддержка
- Base / Pro: private specialist chat + secure messenger
- Premium: **24/7 personal manager** — выделенный менеджер

### 5.6 Дополнительные источники дохода
- **Referral earnings** (все тарифы) — реферальная программа
- **Set custom prices** (Pro/Premium) — кастомные ставки на услуги

---

## 6. Как мы используем собранные данные (data → value)

| Что собрали | Как используем |
|---|---|
| `profession`, `city`, `services` | Категоризация в маркетплейсе, локальные бенчмарки |
| `role` | Тон коммуникации (solo vs partner vs firm owner) |
| `about` + `cv_name` | **AI генерирует публичный профайл** на английском |
| `photo_name`, `company_logo_name` | Визуал карточки профайла |
| `channels`, `preferred_way`, `marketing_time`, `ad_budget`, `team` | Настройка маркетинг-модуля + рекомендации по каналам |
| `desired_clients`, `desired_revenue`, `period` | KPI-цели в личном дашборде |
| `time_on_platform` | Onboarding cadence (нотификации, дайджесты) |
| UTM-метки | Атрибуция / cohort-аналитика |
| `payment_method`, `billing`, `plan` | Подписочный pipeline |
| `referral_code` | Применение реферального бонуса |

---

## 7. Финансовая воронка

```
[Холодный трафик / Ads]
        ↓
[24-step quiz, ~5 мин]
        ↓
   ┌────┴─────┐
   │          │
[Pay]    [Enterprise lead]
   │          │
   ↓          ↓
Subscriber  Sales queue
$49/$199/$499  custom contract
   ↓
AI profile + content + leads
   ↓
   ├─ Upgrade (annual → 10% off)
   ├─ Lead buying (топлат через usage)
   └─ Referral program (виральность)
```

**Метрики, на которые проектировался квиз:**
- **Лид-захват на шаге 1** — даже при drop-off получаем email/phone для retargeting.
- **Single submit** — все данные уходят одним POST-ом на оплате. Бэкенду проще, аналитике чище.
- **wowRoi + assessment** — два якоря под оплату (personalized ROI + score).
- **24h timer + −20%** — urgency, давит на «купить сейчас».
- **Profile strength** + warning modal — пушит на качественные данные для AI-профайла.

---

## 8. Что НЕ продаётся в квизе (но дальше можно)

- **Реальная загрузка файлов** — сейчас фронт шлёт только имена (`photo_name`, `cv_name`, `company_logo_name`). Бэку понадобятся pre-signed S3 URL или multipart — см. раздел 8 в [LASTQUIZ-DATA-API-v2.md](./LASTQUIZ-DATA-API-v2.md).
- **Upsell после оплаты** — если `profile_method === 'skipped'`, надо подтолкнуть юзера дозаполнить профайл (email-кампания, in-app prompt).
- **Annual prepay discount** — toggle в pricing показывает −10%, но реальная скидка применяется бэком при инвойсинге (бэк должен учитывать `billing: 'annual'`).

---

## 9. Резюме одной строкой

> **Юрист отвечает 24 раза за 5 минут — мы получаем лид, профессиональный профайл, заказ AI-контента и подписку $49–$499/мес. Главный артефакт — AI-сгенерированная страница юриста, на которую льётся трафик и которая покупает лиды.**
