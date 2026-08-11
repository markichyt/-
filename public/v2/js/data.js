// ─────────────────────────────────────────────────────────────────────────────
// CONSULTANT Quiz v2 — дані воронки.
//
// Стабільні ключі (id / field / v / tier) НЕ перекладаються — вони йдуть у
// payload на бекенд і в логіку гілок. Усі підписи — в i18n.js.
// ─────────────────────────────────────────────────────────────────────────────

// ── Іконки (той самий набір, що й у квізі 1) ─────────────────────────────────
export const ICONS = {
  medical: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  leaf: '<path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>',
  military: '<path d="M4 16a8 8 0 0116 0"/><path d="M2.5 16h19"/>',
  gavel: '<path d="M13 11l5.5-5.5a2.1 2.1 0 113 3L16 14"/><path d="M9 7l4 4"/><path d="M5 21l7-7"/><path d="M3 21h6"/>',
  family: '<circle cx="6.5" cy="6" r="2.4"/><path d="M2 19.5V18a4.5 4.5 0 016-4.24"/><circle cx="17.5" cy="6" r="2.4"/><path d="M22 19.5V18a4.5 4.5 0 00-6-4.24"/><circle cx="12" cy="12.5" r="1.9"/><path d="M8.9 20v-.8a3.1 3.1 0 016.2 0v.8"/>',
  banknote: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v6M18 9v6"/>',
  'shield-check': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
  scroll: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><line x1="8" y1="7.5" x2="16" y2="7.5"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="14.5" x2="12.5" y2="14.5"/><circle cx="15" cy="17" r="2.2"/>',
  'file-text': '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  'bar-chart': '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>',
  users: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>',
  car: '<path d="M5 17h14M3 17v-4l2-5h14l2 5v4M7 13h10"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  'x-circle': '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  megaphone: '<path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 11-5.8-1.6"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  sparkle: '<path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/>',
  'trending-down': '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>',
  handshake: '<path d="M11 17l2 2a1.5 1.5 0 002-2"/><path d="M13 19l2 2a1.5 1.5 0 002-2"/><path d="M2 12l4-4 5 5"/><path d="M22 12l-4-4-6 6"/>',
  shuffle: '<polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  user: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  camera: '<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  phone: '<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.7 2.6a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.5-1.2a2 2 0 012.1-.5c.8.4 1.7.6 2.6.7a2 2 0 011.7 2z"/>',
  'chevron-right': '<polyline points="9 18 15 12 9 6"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>',
  upload: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/>',
  'volume-off': '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  play: '<polygon points="6 4 20 12 6 20"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>'
}

export function iconPath (name) {
  return ICONS[name] || ICONS.briefcase
}

// ── Сфери права: рівно 16 пунктів, продиктовані замовником ───────────────────
export const PRACTICE_AREAS = [
  { v: 'medical', icon: 'medical', color: '#ef4444' },
  { v: 'ecology', icon: 'leaf', color: '#22c55e' },
  { v: 'doc_analysis', icon: 'scroll', color: '#0ea5e9' },
  { v: 'auto', icon: 'car', color: '#ec4899' },
  { v: 'corporate', icon: 'bar-chart', color: '#3b82f6' },
  { v: 'military', icon: 'military', color: '#64748b' },
  { v: 'documents', icon: 'file-text', color: '#7c3aed' },
  { v: 'debt_collection', icon: 'banknote', color: '#14b8a6' },
  { v: 'criminal', icon: 'gavel', color: '#b91c1c' },
  { v: 'migration', icon: 'globe', color: '#0284c7' },
  { v: 'real_estate', icon: 'home', color: '#f59e0b' },
  { v: 'labour', icon: 'briefcase', color: '#6366f1' },
  { v: 'social', icon: 'users', color: '#8b5cf6' },
  { v: 'family', icon: 'family', color: '#db2777' },
  { v: 'debtor_protection', icon: 'shield-check', color: '#0891b2' },
  { v: 'other', icon: 'plus', color: '#94a3b8' }
]

// ── Ціни (₴). Річна = місячна −10%, як у квізі 1. ────────────────────────────
export const PRICING = {
  // Канон від 04.08.2026 (ПАКЕТЫ-И-ЦЕНЫ-CONSULTANT.md). Річна = місячна −10%.
  monthly: { base: 399, pro: 1599, premium: 3999 },
  annual: { base: 359, pro: 1439, premium: 3599 }
}

// ── Склад пакетів (канон). Ключ → підпис у pricing.features.<key>.
//    Кожен тариф показує свій точний список (усе ✓), у порядку, як затверджено.
export const PLAN_FEATURES = {
  base: [
    'profile_basic', 'leads_3', 'google', 'exclusive_smm', 'own_services',
    'ai_google', 'ai_meta', 'ai_monitoring', 'crm', 'referral', 'messenger'
  ],
  pro: [
    'profile_pro', 'video_avatar', 'leads_6', 'google', 'manager_ext',
    'exclusive_smm', 'own_services', 'ai_google', 'ai_meta', 'ai_monitoring',
    'crm', 'referral', 'messenger'
  ],
  premium: [
    'profile_pro', 'video_avatar', 'leads_unlim', 'google', 'manager_ext',
    'exclusive_smm', 'own_services', 'ai_google', 'ai_meta', 'ai_monitoring',
    'crm', 'referral', 'messenger', 'private_chat', 'manager_247', 'rating_boost'
  ]
}

// Список функцій тарифу для картки — усі увімкнені (✓), у канонічному порядку.
export function buildTierFeatures (tier) {
  return (PLAN_FEATURES[tier] || []).map((key) => ({ key, on: true }))
}

// ── Гілки болю ───────────────────────────────────────────────────────────────
// Ключ гілки = відповідь на «Що зараз найбільше заважає рости?».
// focus — які пункти підписки підсвічуємо в «Рішенні» під цю біль.
export const PAIN_BRANCHES = {
  few_leads: {
    icon: 'trending-down',
    color: '#ef4444',
    focus: ['leads_30', 'ai_module', 'google_top', 'ai_monitoring']
  },
  no_deals: {
    icon: 'handshake',
    color: '#f59e0b',
    focus: ['rating_boost', 'reputation_10', 'google_top', 'ai_assistant']
  },
  routine: {
    icon: 'clock',
    color: '#8b5cf6',
    focus: ['ai_pro_avatar', 'posts_40', 'ai_assistant', 'crm']
  },
  no_system: {
    icon: 'shuffle',
    color: '#0891b2',
    focus: ['crm', 'messenger', 'ai_monitoring', 'own_prices']
  }
}

// ── Розрахунок «Діагнозу» ────────────────────────────────────────────────────
// Усі константи взяті з уже узгоджених чисел квіза 1 (marketConfig.uk):
// середній чек однієї справи 1 800 – 5 500 ₴. Нових обіцянок не вводимо.
export const DIAGNOSIS = {
  caseValueLow: 1800,
  caseValueHigh: 5500,
  weeksPerMonth: 4.3,
  // Годин на тиждень на пошук клієнтів → середина діапазону.
  hoursPerWeek: { lt_2: 1.5, h_2_5: 3.5, h_5_10: 7.5, no_time: 0 },
  // Скільки клієнтів на місяць юрист недоотримує — таблицею під кожен рівень
  // амбіцій (формула на чотирьох рівнях упиралась у стелю й повторювалась).
  //
  // Орієнтир — власна обіцянка сервісу з FAQ квіза 1: «багато юристів
  // отримують 5–15 клієнтів вже в перший місяць, з часом 20–30+». Тобто
  // недоотриманий потік має бути в тому ж порядку, інакше діагноз занижує
  // те, що сервіс сам обіцяє на кроці оплати.
  missedByDesired: {
    c_to_10: { low: 4, high: 8 },
    c_10_30: { low: 8, high: 15 },
    c_30_50: { low: 14, high: 25 },
    c_50_plus: { low: 20, high: 35 }
  },
  // Бажана кількість клієнтів → рекомендований тариф. Прив'язано до ліміту
  // лідів у планах: Base — 6 купівель, Pro — 30, Premium — безліміт.
  tierByDesired: { c_to_10: 'base', c_10_30: 'pro', c_30_50: 'premium', c_50_plus: 'premium' }
}

// Мета-біль: платформа розвʼязує одну проблему двома формулюваннями.
// few_leads / no_deals — юристу бракує КЛІЄНТІВ;
// routine / no_system — юристу бракує ЧАСУ, щоб їх залучати.
export function metaPainOf (answers) {
  const b = answers.growth_blocker
  if (b === 'routine' || b === 'no_system') return 'time'
  if (b === 'few_leads' || b === 'no_deals') return 'clients'
  return answers.search_time === 'no_time' ? 'time' : 'clients'
}

// Рахує «діагноз» із відповідей.
export function computeDiagnosis (answers) {
  const hoursWeek = DIAGNOSIS.hoursPerWeek[answers.search_time] ?? 0
  const hoursMonth = Math.round(hoursWeek * DIAGNOSIS.weeksPerMonth)
  const missed = DIAGNOSIS.missedByDesired[answers.desired_clients] || DIAGNOSIS.missedByDesired.c_10_30

  const revenueLow = missed.low * DIAGNOSIS.caseValueLow
  const revenueHigh = missed.high * DIAGNOSIS.caseValueHigh
  const branch = answers.growth_blocker || 'few_leads'

  return {
    hoursMonth,
    hoursYear: hoursMonth * 12,
    noTime: answers.search_time === 'no_time',
    missedLow: missed.low,
    missedHigh: missed.high,
    revenueLow,
    revenueHigh,
    // Річна сума — просто ×12, нічого нового не вигадуємо, але масштаб втрати
    // видно значно краще, ніж у місячній цифрі.
    revenueYearLow: revenueLow * 12,
    revenueYearHigh: revenueHigh * 12,
    branch,
    // Пункти підписки, які закривають саме цю біль (з PAIN_BRANCHES.focus).
    fixFeatures: (PAIN_BRANCHES[branch] || PAIN_BRANCHES.few_leads).focus,
    tier: DIAGNOSIS.tierByDesired[answers.desired_clients] || 'pro'
  }
}

// ── Структура воронки ────────────────────────────────────────────────────────
// type: video | form | radio | checkbox | card
export const SLIDES = [
  { type: 'card', id: 'greeting', q: 'slides.greeting.q', sub: 'slides.greeting.sub' },
  {
    type: 'form',
    id: 'contact',
    q: 'slides.contact.q',
    sub: 'slides.contact.sub',
    fields: [
      { field: 'first_name', type: 'text' },
      { field: 'last_name', type: 'text' },
      { field: 'email', type: 'email' },
      { field: 'phone', type: 'tel' }
    ]
  },
  {
    type: 'radio',
    field: 'search_time',
    q: 'slides.search_time.q',
    sub: 'slides.search_time.sub',
    options: [
      { v: 'lt_2', icon: 'clock', color: '#10b981' },
      { v: 'h_2_5', icon: 'clock', color: '#3b82f6' },
      { v: 'h_5_10', icon: 'clock', color: '#f59e0b' },
      { v: 'no_time', icon: 'x-circle', color: '#ef4444' }
    ]
  },
  {
    type: 'radio',
    field: 'growth_blocker',
    q: 'slides.growth_blocker.q',
    sub: 'slides.growth_blocker.sub',
    options: [
      { v: 'few_leads', icon: 'trending-down', color: '#ef4444' },
      { v: 'no_deals', icon: 'handshake', color: '#f59e0b' },
      { v: 'routine', icon: 'clock', color: '#8b5cf6' },
      { v: 'no_system', icon: 'shuffle', color: '#0891b2' }
    ]
  },
  {
    type: 'checkbox',
    field: 'services',
    requireSelection: true,
    q: 'slides.services.q',
    sub: 'slides.services.sub',
    options: PRACTICE_AREAS
  },
  {
    type: 'radio',
    field: 'desired_clients',
    q: 'slides.desired_clients.q',
    sub: 'slides.desired_clients.sub',
    options: [
      { v: 'c_to_10', icon: 'user', color: '#3b82f6' },
      { v: 'c_10_30', icon: 'users', color: '#10b981' },
      { v: 'c_30_50', icon: 'bar-chart', color: '#0ea5e9' },
      { v: 'c_50_plus', icon: 'sparkle', color: '#f59e0b' }
    ]
  },
  // Кульмінація: після всіх питань — рішення. Квадратне відео Андрія +
  // персональний заголовок під мета-біль + інфографіка.
  { type: 'card', dynamic: true, id: 'solution', q: 'slides.solution.q', sub: 'slides.solution.sub' },
  // Тарифи: «Обрати план» веде одразу на оплату; поруч — плашка «Замовити дзвінок».
  { type: 'card', dynamic: true, id: 'pricing', q: 'slides.pricing.q', sub: '' },
  { type: 'card', dynamic: true, id: 'payment', q: 'slides.payment.q', sub: '' },
  // ── Після оплати: єдиний крок — оцінка профілю + завантаження резюме ───────
  { type: 'card', dynamic: true, id: 'assessment', q: 'slides.assessment.q', sub: 'slides.assessment.sub' }
]

export const TOTAL_STEPS = SLIDES.length

// ── Потенціал (крок після оплати) — константи з квіза 1 ──────────────────────
export const AI_POTENTIAL = {
  ourPlan: PRICING.monthly.pro,
  teamRoles: [
    { key: 'seo', low: 25000, high: 50000 },
    { key: 'targeting', low: 25000, high: 45000 },
    { key: 'content', low: 25000, high: 45000 },
    { key: 'video', low: 20000, high: 40000 },
    { key: 'smm', low: 20000, high: 45000 }
  ]
}

// ── Форматування грошей (₴, як у квізі 1) ────────────────────────────────────
export function formatMoney (value) {
  return String(Math.round(Number(value) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₴'
}

export function formatNumber (value) {
  return String(Math.round(Number(value) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
