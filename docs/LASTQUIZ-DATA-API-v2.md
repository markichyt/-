# lastQuiz — Сбор данных и отправка на бэкенд (v2.2)

**Версия документа:** 2.2 — отражает текущее состояние кода после редизайна fullProfile-слайда (убраны табы, About обязателен, CV / Company logo / Referral code опциональны и видны одновременно).
**Источник:** [main.js](../main.js)
**Дата:** 2026-05-27
**Предыдущая версия:** [LASTQUIZ-DATA-API.md](./LASTQUIZ-DATA-API.md) — устарела.

---

## 1. Архитектура (без изменений)

Один глобальный JS-объект `quizData`. После каждого `advance()` он сохраняется в `localStorage` (`clm_quiz_data`). Финальный submit отправляется POST-ом на бэкенд.

```
[User input] → quizData[field] = value → localStorage.setItem('clm_quiz_data', JSON)
                                              ↓ (на trigger)
                                      POST → SUBMIT_URL (JSON body)
```

---

## 2. Endpoint

```js
var SUBMIT_URL = 'https://your-api.example.com/quiz-submit';  // ⚠️ ЗАГЛУШКА
```

**Файл:** [main.js:40](../main.js#L40)
**Метод:** `POST`
**Content-Type:** `application/json;charset=UTF-8`
**Body:** `JSON.stringify(quizData)`

### 🚨 Что бэкенду нужно сделать первым

Заменить URL заглушки на реальный. После этого фронт сразу начнёт отправлять.

---

## 3. Две точки отправки (было три)

### 3.1 Финальная оплата — единственный submit основной воронки

**Файл:** [main.js:2330-2350](../main.js#L2330)
**Когда:** клик «Pay» (card или PayPal) на payment-слайде (24-й, последний).
**Что добавляется в payload перед отправкой:**
```js
quizData.payment_method = 'card' | 'paypal';
quizData.submitted_at = new Date().toISOString();
```

⚠️ К этому моменту в `quizData` уже лежит **всё**: контакты (slide 1), профессия/город/услуги, ROI-цели, выбор профайла (about/cv), выбранный план. Один POST = весь payload.

### 3.2 Enterprise lead (Large firm? Get a custom quote)

**Файл:** [main.js:2030-2050](../main.js#L2030)
**Когда:** «Request a call» в модалке Team registration (открывается по серой ссылке на pricing-слайде).
**Что добавляется:**
```js
quizData.plan = 'enterprise';
quizData.tier = 'enterprise';
quizData.lead_type = 'team_registration';
quizData.firm = {
  name: '...',         // юр. название
  company: '...',      // бренд
  team_size: 10,       // ≥10
  location: '...',
  message: '...'
};
```

Бэкенд по `lead_type === 'team_registration'` ИЛИ `tier === 'enterprise'` маршрутизирует на sales-очередь.

### ❌ ~~3.3 fullProfile post-payment~~ — УБРАНО

Раньше был **второй submit** после оплаты (с `profile_method` и т.д.). Сейчас этот слайд **переехал ДО pricing** (позиция 22 из 24), и его данные пишутся в `quizData` — отправляются единственным submit'ом из шага 3.1.

Бэкенду больше **не нужно** ждать второй POST или различать «оплата» vs «финализация» — приходит один payload со всем.

---

## 4. Полная схема payload (v2)

Все поля опциональные. Бэкенд должен принимать частичный JSON.

### 4.1 UTM-метки (автоматически из URL)

```json
{
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "lawyers-ny",
  "utm_term": "divorce attorney",
  "utm_content": "ad-variant-a"
}
```

[main.js:100-106](../main.js#L100)

### 4.2 Квалификация

| Поле | Тип | Значения | Слайд |
|---|---|---|---|
| `profession` | string | `attorney` \| `lawyer` \| `notary` \| `patent_attorney` \| `cpa` \| `tax_specialist` \| `other` | 1 |
| `city` | string | `"New York, NY"` | 3 |
| `role` | string | `self_employed` \| `employee` \| `executive` \| `founder` | 4 |
| `services` | string[] | `["banking_finance","family_law"]` | 5 |
| `custom_services` | string | free text | 5 |

### 4.3 🆕 Контакты — собираются раньше (на quickContact)

**Изменение vs v1:** `email` был на `fullProfile` (слайд 21). Теперь он на `quickContact` (слайд 6) — захват email **до** AI-калькулятора.

| Поле | Тип | Required | Слайд |
|---|---|---|---|
| `first_name` | string | ✅ | 6 (quickContact) |
| `last_name` | string | ✅ | 6 |
| `email` | string | ✅ **(перенесён сюда)** | 6 |
| `phone` | string | ✅ | 6 |
| `photo_name` | string | ✅ | 6 (имя файла) |

> ⚠️ `photo_name`, `cv_name`, `company_logo_name` — это **имена файлов**, не сам контент. Бинарные файлы фронтом не отправляются. См. раздел 8 ниже.

### 4.4 Маркетинг-аудит

| Поле | Тип | Значения |
|---|---|---|
| `channels` | string[] | `["instagram","linkedin","website"]` |
| `preferred_way` | string | `social_media` \| `paid_ads` \| `both` \| `ai_decide` |
| `marketing_time` | string | `none` \| `less_1` \| `1_5` \| `5_plus` |
| `ad_budget` | string | `none` \| `under_1k` \| `1k_10k` \| `over_10k` |
| `team` | string[] | `["seo","videographer","smm"]` |

### 4.5 🆕 Цели — теперь из wowRoi-калькулятора

**Изменение vs v1:** раньше эти поля писались из `dualSlider` слайда. **Сейчас** они пишутся из интерактивного ROI-калькулятора на слайде «Meet your future on ConsultantLM» — при движении ползунка inquiries.

| Поле | Тип | Источник | Что значит |
|---|---|---|---|
| `desired_clients` | number | wowRoi слайдер | количество **реалистичных платящих клиентов** (clientsLow = N × ~0.17) |
| `desired_revenue` | number | wowRoi слайдер | **realistic-low** revenue в USD (clients × per_client_low) |
| `period` | string | radio-слайд | `1_month` \| `1_year` \| `3_years` |
| `time_on_platform` | string | radio-слайд | `15min` \| `30min` \| `1hr` \| `more` |

⚠️ `desired_clients` и `desired_revenue` теперь хранят **realistic-low** значения (не «теоретический максимум»). Это нужно учитывать в аналитике.

### 4.6 ❌ ZIP Code — удалён

**Изменение vs v1:** поле `zip` больше не запрашивается у пользователя. Удалено вместе с реорганизацией fullProfile.

### 4.7 Выбор тарифа и оплата

| Поле | Тип | Значения |
|---|---|---|
| `plan` | string | `base` \| `pro` \| `premium` \| `enterprise` (для team-lead'а) |
| `billing` | string | `monthly` (default) \| `annual` |
| `payment_period` | string | `1_month` \| `1_year` \| `3_years` |
| `payment_method` | string | `card` \| `paypal` |
| `submitted_at` | string (ISO) | `"2026-05-25T14:32:45.123Z"` |

⚠️ `billing = 'monthly'` по умолчанию (изменено). Если `annual` — фронт показывает −10% от monthly-цены, бэкенду нужно применить ту же скидку при инвойсинге.

### 4.8 Профайл-bio (на слайде 22 — ДО оплаты)

Слайд `fullProfile` идёт **перед выбором тарифа**. Табов больше нет — **все поля видны одновременно**. About yourself **обязателен** (мин. 3000 символов); CV / Company logo / Referral code — **опциональны**. Все эти поля включаются в общий `quizData` и уходят с финальным submit на оплате.

> 💡 В CTA-блоке между About и CV-загрузкой объясняется, что AI-профайл генерируется напрямую из CV на английском — поэтому CV сильно повышает качество профайла, хоть и не обязателен.

| Поле | Тип | Required | Значения |
|---|---|---|---|
| `profile_method` | string | ✅ авто | `about` (только About) \| `about_and_cv` (About + CV загружен) |
| `about` | string | ✅ | bio юриста, **минимум 3000 символов** |
| `cv_name` | string | — | имя файла (.pdf/.doc/.docx) |
| `company_logo_name` | string | — | имя файла логотипа (PNG/JPG/SVG) |
| `referral_code` | string | — | промокод/реферальный код |

⚠️ `profile_method` выставляется фронтом автоматически на основе того, загрузил юзер CV или нет. Это не пользовательский выбор, а сигнал бэку: «у нас есть только текст» vs «у нас текст + CV-файл».

### 4.9 Enterprise lead (если открыли «Large firm?»)

| Поле | Тип | Значения |
|---|---|---|
| `tier` | string | `enterprise` |
| `lead_type` | string | `team_registration` |
| `firm.name` | string | юр. название |
| `firm.company` | string | **🆕 бренд/торговое название** (раньше было одно firm.name) |
| `firm.team_size` | number | ≥ 10 |
| `firm.location` | string | страна/город |
| `firm.message` | string | optional |

---

## 5. Пример полного payload (USA, Pro tier) — ОДИН submit на payment

```json
{
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "ny-attorney-divorce",

  "first_name": "John",
  "last_name": "Davis",
  "email": "john.davis@example.com",
  "phone": "+1 (212) 555-0142",
  "phone_country": "US",
  "photo_name": "headshot.jpg",

  "profession": "attorney",
  "city": "New York, NY",
  "role": "self_employed",
  "services": ["family_law","immigration_law"],
  "custom_services": "",

  "channels": ["linkedin","website"],
  "preferred_way": "both",
  "marketing_time": "less_1",
  "ad_budget": "1k_10k",
  "team": ["smm"],

  "desired_clients": 5,
  "desired_revenue": 10000,
  "period": "1_year",
  "time_on_platform": "30min",

  "profile_method": "about_and_cv",
  "about": "Family law attorney with 12 years of experience in NY courts. Specializing in high-net-worth divorces and child custody...",
  "cv_name": "john_davis_resume.pdf",
  "company_logo_name": "davis_law_logo.png",
  "referral_code": "PARTNER10",

  "plan": "pro",
  "billing": "monthly",
  "payment_period": "1_year",
  "payment_method": "card",
  "submitted_at": "2026-05-27T14:32:45.123Z"
}
```

Один POST со всем содержимым `quizData` — никакой второй submit для финализации профайла больше не нужен.

---

## 6. Пример Enterprise lead

```json
{
  "utm_source": "linkedin",
  "utm_campaign": "law-firms-50plus",

  "profession": "attorney",
  "city": "Chicago, IL",
  "role": "founder",
  "services": ["business","real_estate"],

  "first_name": "Sarah",
  "last_name": "Cohen",
  "email": "sarah@bigfirm.com",
  "phone": "+1 (312) 555-0199",

  "tier": "enterprise",
  "plan": "enterprise",
  "lead_type": "team_registration",
  "firm": {
    "name": "Cohen & Partners LLP",
    "company": "Cohen Legal Group",
    "team_size": 25,
    "location": "Chicago, IL",
    "message": "Need 25 seats + white-label + integration with iManage"
  }
}
```

---

## 7. Что нужно от бэкенда

### 7.1 Endpoint

`POST /quiz-submit` на JSON.

### 7.2 Маршрутизация по типу payload

```
1. payload.lead_type === 'team_registration' OR payload.tier === 'enterprise'
   → enterprise sales queue (lead для отдела продаж)

2. payload.payment_method exists
   → payment processing + создание подписки
   → запуск onboarding-пайплайна (AI-профайл из payload.about / payload.cv_name)
     — данные профайла уже внутри этого же payload (profile_method/about/cv_name)

3. ничего из вышеперечисленного
   → отбрасывать или quarantine (вероятно ошибка)
```

⚠️ Раньше был отдельный post-payment submit с `profile_method` — его больше нет. Всё приходит одним payload-ом на оплате.

### 7.3 CORS

После деплоя на `markichyt.github.io`:
```
Access-Control-Allow-Origin: https://markichyt.github.io
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### 7.4 Идемпотентность

Фронт **не делает retry**, но возможны двойные submit-ы (refresh, click-double). Дедуплицировать по:
- `email + submitted_at` для payment-сценария
- `email + lead_type` для Enterprise

### 7.5 Применение скидки `billing: 'annual'`

Фронт показывает прайс без скидки (`$49/$199/$499` для USA), а на annual автоматически применяет −10%. Бэкенд при `billing === 'annual'` должен:
- Брать base monthly price тарифа
- Применить ×0.9 = annual rate
- Помножить на 12 = годовой инвойс

(Или сохранить как `displayed_price` и `actual_price` отдельно в БД — на ваш выбор.)

---

## 8. ⚠️ Файлы (photo, CV, company_logo) — всё ещё имена, не контент

Фронт по-прежнему **не отправляет бинарные файлы** в payload. Приходят только имена:

| Поле | Шаг | Что приходит |
|---|---|---|
| `photo_name` | quickContact (1) | `"headshot.jpg"` |
| `cv_name` | fullProfile (22, ДО оплаты) | `"john_davis_cv.pdf"` |
| `company_logo_name` | fullProfile (опц) | `"logo.png"` |

**Чтобы реально загружать файлы** — два варианта:
- **A: multipart/form-data** — переписать `submitQuizData` на `FormData` + `fetch`. Меняется протокол.
- **B: Pre-signed S3 URLs** — фронт получает signed URL от бэка, загружает напрямую в S3/B2, в payload идёт публичный URL.

**Рекомендуется B**: не блокирует main submit, поддерживает крупные файлы (CV до 10 МБ), скейлится.

---

## 9. localStorage

Ключ: `clm_quiz_data`
- Сохраняется после каждого `advance()`
- Используется для восстановления при перезагрузке
- Удаляется после успешного payment-submit (`localStorage.removeItem`)

После оплаты, на onboarding-слайде, localStorage уже пустой, но `quizData` в памяти всё ещё содержит всю историю (нужно для `submitQuizData` на финальном шаге).

---

## 10. Внутренние/локальные поля (НЕ отправляются на бэк)

- **`score`** — числовой результат из `computeScore()` ([main.js:280-320](../main.js#L280)). Считается для отображения «Your AI-powered potential level». В payload не пишется. Если нужен на бэке — добавим.
- **`profile_method`** — записывается, но используется и фронтом тоже (для UI tab-switch)

---

## 11. Текущее состояние slide-order (после реорганизации)

```
1.  quickContact (first_name, last_name, email, phone, photo) ← перенесён в начало
2.  profession
3.  videoProof
4.  city
5.  role
6.  services
7.  aiCalc
8.  channels
9.  preferred_way
10. marketing_time
11. ad_budget
12. team
13. tenx
14-17. video1, video2, videoAds, videoSocials
18. wowRoi (ROI-калькулятор с интерактивным слайдером → desired_clients/revenue)
19. period
20. time_on_platform
21. assessment
22. fullProfile (About 3000+ OR CV) ← данные пишутся в quizData, НО НЕ отправляются здесь
─────────── pricing & payment block ───────────
23. profilesPricing
24. payment ← submitQuizData() ОДИН РАЗ, со всем содержимым quizData
```

Ключевое: fullProfile теперь **ДО** pricing → юзер сначала рассказывает о себе/CV, потом выбирает план, потом платит. На оплате уходит ВСЁ одним POST'ом.

---

## Резюме изменений с v1

| Что | Было (v1) | Стало (v2) |
|---|---|---|
| `email` | На `fullProfile` (поздно) | На `quickContact` (рано) ✅ |
| `zip` | Поле есть | **Удалено** ❌ |
| `desired_clients/revenue` | Из `dualSlider` (абстрактные goals) | Из `wowRoi` (realistic-low значения) |
| Слайд fullProfile | До оплаты | **Снова ДО оплаты** (v2.1 — было «после», в v2.1 вернули вперёд, перед pricing) |
| `profile_method` | Не было | Новое поле (`about`/`cv`) |
| `firm.company` | Не было | Новое поле в Enterprise lead |
| Количество submit-ов | 1 | **1** на основной воронке (payment) + Enterprise lead отдельно |
| `billing` default | `annual` | `monthly` (с тогглом на −10%) |
| Plan values на UI | Starter/Growth/Scale (откатили) | Base/Pro/Premium (внутренние ключи не менялись) |

---

## Что бэкенду нужно сделать

1. **Заменить SUBMIT_URL** на реальный endpoint
2. **Принимать 2 типа payload**: payment (со всеми quiz-данными, в т.ч. `profile_method`/`about`/`cv_name`) и enterprise lead
3. **Поддержать CORS** для `markichyt.github.io`
4. **Дедуплицировать** двойные submit-ы
5. **При billing=annual** — применить −10% от monthly price тарифа
6. **(Опционально)** — переход на pre-signed S3 URL для реальной загрузки файлов
7. **(Опционально)** — `score` в payload, если нужен для сегментации
