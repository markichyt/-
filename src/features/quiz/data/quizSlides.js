// Повне визначення квіза (українська версія для ринку України).
//
// Поля:
//   type    — компонент кроку ('formWithFiles' | 'radio' | 'checkbox' | 'city' | 'card')
//   id      — для 'card' обирає конкретну картку
//   field   — ключ у quizData, куди пишеться відповідь
//   q / sub — заголовок / підзаголовок (можуть містити <span class="accent">…</span>)
//   options — варіанти: { v: значення, t: підпис, icon, color }
//   skip    — підпис необов'язкового посилання «пропустити» (для checkbox)
export const quizSlides = [
  // 1. Контактна форма (раннє захоплення ліда)
  {
    type: 'formWithFiles',
    id: 'quickContact',
    q: 'Давайте <span class="accent">познайомимось</span>',
    sub: 'Коротке знайомство перед тим, як скласти ваш персональний профіль',
    fields: [
      { label: "Ім'я", field: 'first_name', type: 'text', ph: 'Олександр' },
      { label: 'Прізвище', field: 'last_name', type: 'text', ph: 'Коваленко' },
      { label: 'Email', field: 'email', type: 'email', ph: 'oleksandr@example.com' },
      { label: 'Телефон', field: 'phone', type: 'tel', ph: '+380 67 123 45 67' },
      { label: 'Пароль', field: 'password', type: 'password', ph: 'Мін 5 символів, великі літери + цифра' },
      { label: 'Підтвердіть пароль', field: 'password_confirm', type: 'password', ph: 'Повторіть пароль', match: 'password' }
    ]
  },
  // 2. Завантаження фото для відео-аватара
  {
    type: 'card',
    id: 'photoUpload',
    q: 'Завантажте <span class="accent">своє фото!</span>',
    sub: 'Завантажте своє фото для генерації відео-аватара для вашого профілю'
  },
  // 3. Професія
  {
    type: 'checkbox',
    field: 'profession',
    requireSelection: true,
    q: 'Яка з варіантів найкраще описує вашу <span class="accent">професію?</span>',
    sub: 'Оберіть сферу вашої діяльності',
    options: [
      { v: 'lawyer', t: 'Юрист', icon: 'scales', color: '#3b82f6' },
      { v: 'attorney', t: 'Адвокат', icon: 'gavel', color: '#7c3aed' },
      { v: 'accountant', t: 'Бухгалтер/Аудитор', icon: 'bar-chart', color: '#10b981' },
      { v: 'notary', t: 'Нотаріус', icon: 'stamp', color: '#8b5cf6' },
      { v: 'enforcement', t: 'Приватний виконавець', icon: 'shield-check', color: '#0891b2' },
      { v: 'liquidator', t: 'Ліквідатор', icon: 'x-circle', color: '#ef4444' },
      { v: 'patent', t: 'Патентні повірені', icon: 'file-text', color: '#0ea5e9' },
      { v: 'customs', t: 'Митний брокер', icon: 'globe', color: '#14b8a6' },
      { v: 'engineer', t: 'Інженер', icon: 'building', color: '#f59e0b' },
      { v: 'collector', t: 'Колектор', icon: 'banknote', color: '#ec4899' },
      { v: 'other', t: 'Інше', icon: 'plus', color: '#94a3b8' }
    ]
  },
  // 3. Сцена соціального доказу
  { type: 'card', id: 'videoProof', q: '', sub: '' },
  // 4. Місто роботи
  { type: 'city', field: 'city', q: 'Ваше <span class="accent">місто роботи?</span>', sub: 'Оберіть зі списку або введіть будь-яке місто України' },
  // 5. Роль
  {
    type: 'radio',
    field: 'role',
    q: 'Що найкраще описує вашу <span class="accent">роль?</span>',
    sub: 'Допоможіть персоналізувати ваш досвід',
    options: [
      { v: 'self_employed', t: 'Самозайнятий / Працюю самостійно', icon: 'user', color: '#3b82f6' },
      { v: 'employee', t: 'Найманий працівник (у компанії)', icon: 'building', color: '#8b5cf6' },
      { v: 'executive', t: 'Керівник / Менеджер компанії', icon: 'crown', color: '#f59e0b' },
      { v: 'founder', t: 'Засновник / Власник бізнесу', icon: 'rocket', color: '#10b981' }
    ]
  },
  // 6. Послуги
  {
    type: 'checkbox',
    field: 'services',
    q: 'Які послуги ви <span class="accent">надаєте?</span>',
    sub: 'Оберіть усе, що підходить',
    options: [
      { v: 'auto', t: 'Автомобільні спори', icon: 'car', color: '#ec4899' },
      { v: 'corporate', t: 'Господарське та корпоративне право', icon: 'bar-chart', color: '#3b82f6' },
      { v: 'debt_collection', t: 'Стягнення заборгованості', icon: 'banknote', color: '#14b8a6' },
      { v: 'migration', t: 'Міграційне право', icon: 'globe', color: '#0284c7' },
      { v: 'real_estate', t: 'Нерухомість та земельне право', icon: 'home', color: '#f59e0b' },
      { v: 'labour', t: 'Трудове право', icon: 'briefcase', color: '#6366f1' },
      { v: 'family', t: 'Сімейне право', icon: 'family', color: '#db2777' },
      { v: 'inheritance', t: 'Спадкове право', icon: 'scroll', color: '#10b981' },
      { v: 'divorce', t: 'Розірвання шлюбу', icon: 'heart-crack', color: '#ef4444' },
      { v: 'social', t: 'Соціальні виплати та спори', icon: 'users', color: '#8b5cf6' },
      { v: 'debtor_protection', t: 'Захист боржника', icon: 'shield-check', color: '#0891b2' },
      { v: 'military', t: 'Військове право', icon: 'military', color: '#64748b' },
      { v: 'criminal', t: 'Кримінальне право', icon: 'gavel', color: '#b91c1c' },
      { v: 'documents', t: 'Підготовка та правовий аналіз документів', icon: 'file-text', color: '#7c3aed' },
      { v: 'other', t: 'Інші юридичні послуги', icon: 'plus', color: '#94a3b8' }
    ]
  },
  // 7. AI-потенціал
  { type: 'card', id: 'aiCalc', q: 'Ваш потенціал з <span class="accent">Консультант</span>', sub: 'AI порахував за вашими напрямами та ринком: скільки нових клієнтів і доходу ви можете отримувати щомісяця — і скільки це коштувало б без нас.' },
  // 8. Де представлений бізнес (Telegram-first, без Reddit)
  {
    type: 'checkbox',
    field: 'channels',
    q: 'Де представлений ваш <span class="accent">бізнес?</span>',
    sub: 'Оберіть усі варіанти',
    skip: 'Пропустити',
    options: [
      { v: 'telegram', t: 'Telegram', icon: 'send', color: '#0088cc' },
      { v: 'instagram', t: 'Instagram або Facebook', icon: 'instagram', color: '#e1306c' },
      { v: 'tiktok', t: 'TikTok', icon: 'tiktok', color: '#000000' },
      { v: 'youtube', t: 'YouTube', icon: 'play', color: '#ff0000' },
      { v: 'linkedin', t: 'LinkedIn', icon: 'linkedin', color: '#0a66c2' },
      { v: 'twitter', t: 'X (Twitter)', icon: 'x-twitter', color: '#000000' },
      { v: 'website', t: 'Власний сайт', icon: 'globe', color: '#64748b' },
      { v: 'other_channel', t: 'Інше', icon: 'plus', color: '#94a3b8' }
    ]
  },
  // 9. Бажаний спосіб залучення клієнтів
  {
    type: 'radio',
    field: 'preferred_way',
    q: 'Який ваш бажаний спосіб залучати <span class="accent">більше клієнтів?</span>',
    sub: 'Як ви хочете зростати',
    options: [
      { v: 'social_media', t: 'Соцмережі', icon: 'share', color: '#8b5cf6' },
      { v: 'paid_ads', t: 'Платна реклама', icon: 'megaphone', color: '#f59e0b' },
      { v: 'both', t: 'І те, і інше', icon: 'layers', color: '#3b82f6' },
      { v: 'ai_decide', t: 'Ще немає плану — хай вирішить AI', icon: 'sparkle', color: '#10b981' }
    ]
  },
  // 10. Час на маркетинг
  {
    type: 'radio',
    field: 'marketing_time',
    q: 'Скільки годин на день ви витрачаєте на <span class="accent">маркетинг?</span>',
    sub: 'Включно з соцмережами, контентом і блогами',
    options: [
      { v: 'none', t: 'Не витрачаю час на маркетинг', icon: 'x-circle', color: '#94a3b8' },
      { v: 'less_1', t: 'Менше 1 години', icon: 'clock', color: '#3b82f6' },
      { v: '1_5', t: '1–5 годин', icon: 'clock', color: '#f59e0b' },
      { v: '5_plus', t: '5+ годин', icon: 'clock', color: '#ef4444' }
    ]
  },
  // 11. Місячний бюджет на рекламу (₴)
  {
    type: 'radio',
    field: 'ad_budget',
    q: 'Який ваш місячний <span class="accent">бюджет на рекламу?</span>',
    sub: 'Орієнтовно',
    options: [
      { v: 'none', t: 'Не витрачаю', icon: 'x-circle', color: '#94a3b8' },
      { v: 'to_40k', t: 'До 40 000 ₴', icon: 'dollar', color: '#10b981' },
      { v: 'to_400k', t: '40 000 – 400 000 ₴', icon: 'dollar', color: '#3b82f6' },
      { v: 'over_400k', t: 'Більше 400 000 ₴', icon: 'diamond', color: '#f59e0b' }
    ]
  },
  // 12. Маркетингова команда
  {
    type: 'checkbox',
    field: 'team',
    requireSelection: true,
    q: 'Хто у вашій <span class="accent">маркетинговій команді?</span>',
    sub: 'Оберіть усі ролі, які ви наймаєте',
    options: [
      { v: 'seo', t: 'Контент-дослідник / SEO-спеціаліст', icon: 'search', color: '#3b82f6' },
      { v: 'scriptwriter', t: 'Сценарист', icon: 'pen', color: '#8b5cf6' },
      { v: 'videographer', t: 'Відеограф', icon: 'camera', color: '#ef4444' },
      { v: 'video_editor', t: 'Відеомонтажер', icon: 'film', color: '#f97316' },
      { v: 'smm', t: 'Таргетолог / SMM', icon: 'megaphone', color: '#10b981' },
      { v: 'crm_manager', t: 'CRM / Менеджер із запитів', icon: 'users', color: '#0ea5e9' },
      { v: 'no_team', t: 'У мене немає команди', icon: 'x-circle', color: '#94a3b8', exclusive: true }
    ]
  },
  // Анімаційні сцени
  { type: 'card', id: 'video1', q: '', sub: '' },
  { type: 'card', id: 'video2', q: '', sub: '' },
  { type: 'card', id: 'videoAds', q: '', sub: '' },
  // Оцінка цінності воронки
  { type: 'card', id: 'assessment', q: 'Наскільки готовий ваш <span class="accent">профіль</span>', sub: 'Ми оцінили ваші відповіді на попередні запитання — що повніший профіль, то вищий ваш рейтинг і більше довіри від клієнтів на Консультант.' },
  // 22. Повний профіль (біо АБО резюме)
  {
    type: 'card',
    id: 'fullProfile',
    q: 'Заповніть свій <span class="accent">профіль</span>',
    sub: 'Оберіть одне — напишіть детальне біо (3 000+ символів) або завантажте резюме. Решту згенерує наш AI.'
  },
  // 23. Плани і ціни
  { type: 'card', id: 'profilesPricing', q: 'Оберіть свій <span class="accent">план</span>', sub: '' },
  // 24. Оплата (фінальне надсилання)
  { type: 'card', id: 'payment', q: 'Завершіть <span class="accent">покупку</span>', sub: '' }
]

export const TOTAL_STEPS = quizSlides.length
