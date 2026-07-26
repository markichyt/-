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
  check: '<polyline points="20 6 9 17 4 12"/>'
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
  monthly: { base: 499, pro: 1999, premium: 3999 },
  annual: { base: 449, pro: 1799, premium: 3599 }
}

// ── Підписки: повна копія набору функцій із квіза 1 (pricingPlans.js) ────────
export const PRICING_FEATURES = [
  { key: 'ai_pro_avatar', graduated: true, base: false, pro: true, premium: false },
  { key: 'ai_premium_avatar', graduated: true, base: false, pro: false, premium: true },
  { key: 'posts_10', graduated: true, base: true, pro: false, premium: false },
  { key: 'posts_40', graduated: true, base: false, pro: true, premium: false },
  { key: 'posts_100', graduated: true, base: false, pro: false, premium: true },
  { key: 'leads_6', graduated: true, base: true, pro: false, premium: false },
  { key: 'leads_30', graduated: true, base: false, pro: true, premium: false },
  { key: 'leads_unlim', graduated: true, base: false, pro: false, premium: true },
  { key: 'reputation_10', graduated: true, base: false, pro: true, premium: false },
  { key: 'reputation_unlim', graduated: true, base: false, pro: false, premium: true },
  { key: 'google_top', base: false, pro: false, premium: true },
  { key: 'manager_24_7', base: false, pro: false, premium: true },
  { key: 'exclusive_smm', base: false, pro: false, premium: true },
  { key: 'rating_boost', base: false, pro: true, premium: true },
  { key: 'own_prices', base: false, pro: true, premium: true },
  { key: 'ai_module', base: true, pro: true, premium: true },
  { key: 'ai_monitoring', base: true, pro: true, premium: true },
  { key: 'ai_assistant', base: true, pro: true, premium: true },
  { key: 'referral', base: true, pro: true, premium: true },
  { key: 'private_chat', base: true, pro: true, premium: true },
  { key: 'crm', base: true, pro: true, premium: true },
  { key: 'messenger', base: true, pro: true, premium: true }
]

export const PRICING_PLACEHOLDERS = [
  { categoryRows: ['ai_pro_avatar', 'ai_premium_avatar'], key: 'ai_avatar' },
  { categoryRows: ['reputation_10', 'reputation_unlim'], key: 'reputation' }
]

export const PRO_BADGES = {
  posts_40: { text: 'pricing.badges.more_4x', type: 'green' },
  leads_30: { text: 'pricing.badges.more_5x', type: 'green' },
  reputation_10: { text: 'pricing.badges.new', type: 'cyan' },
  rating_boost: { text: 'pricing.badges.new', type: 'cyan' },
  own_prices: { text: 'pricing.badges.new', type: 'cyan' },
  ai_pro_avatar: { text: 'pricing.badges.new', type: 'cyan' }
}

export const PREMIUM_BADGES = {
  posts_100: { text: 'pricing.badges.more_2_5x', type: 'green' },
  leads_unlim: { text: 'pricing.badges.infinity', type: 'green' },
  google_top: { text: 'pricing.badges.new', type: 'cyan' },
  manager_24_7: { text: 'pricing.badges.new', type: 'cyan' },
  exclusive_smm: { text: 'pricing.badges.new', type: 'cyan' },
  reputation_unlim: { text: 'pricing.badges.infinity', type: 'green' },
  ai_premium_avatar: { text: 'pricing.badges.upgrade', type: 'cyan' }
}

// Формує видимий список функцій тарифу (та сама логіка, що й у квізі 1).
export function buildTierFeatures (tier) {
  const badgeMap = tier === 'pro' ? PRO_BADGES : tier === 'premium' ? PREMIUM_BADGES : null
  const relevant = []

  PRICING_FEATURES.forEach((feature) => {
    if (feature.graduated && !feature[tier]) return
    const item = { key: feature.key, on: !!feature[tier] }
    if (badgeMap && badgeMap[feature.key]) item.badge = badgeMap[feature.key]
    relevant.push(item)
  })

  PRICING_PLACEHOLDERS.forEach((placeholder) => {
    const hasOwnEntry = PRICING_FEATURES.some(
      (feature) => placeholder.categoryRows.indexOf(feature.key) >= 0 && feature[tier]
    )
    if (!hasOwnEntry) relevant.push({ key: placeholder.key, on: false })
  })

  relevant.sort((a, b) => (b.on ? 1 : 0) - (a.on ? 1 : 0))
  return relevant
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
  // Скільки клієнтів хоче на місяць → середина діапазону.
  desiredMid: { c_1_3: 2, c_4_10: 7, c_10_plus: 12 },
  // Бажана кількість клієнтів → рекомендований тариф.
  tierByDesired: { c_1_3: 'base', c_4_10: 'pro', c_10_plus: 'premium' }
}

function clamp (n, min, max) {
  return Math.min(max, Math.max(min, n))
}

// Рахує «діагноз» із відповідей. Свідомо консервативно: нижня межа беремо
// 40% від бажаного, верхня — 70%, і затискаємо, щоб цифри лишались реальними.
export function computeDiagnosis (answers) {
  const hoursWeek = DIAGNOSIS.hoursPerWeek[answers.search_time] ?? 0
  const hoursMonth = Math.round(hoursWeek * DIAGNOSIS.weeksPerMonth)

  const mid = DIAGNOSIS.desiredMid[answers.desired_clients] ?? 7
  const missedLow = clamp(Math.round(mid * 0.4), 2, 8)
  const missedHigh = clamp(Math.round(mid * 0.7), missedLow + 1, 12)

  return {
    hoursMonth,
    noTime: answers.search_time === 'no_time',
    missedLow,
    missedHigh,
    revenueLow: missedLow * DIAGNOSIS.caseValueLow,
    revenueHigh: missedHigh * DIAGNOSIS.caseValueHigh,
    branch: answers.growth_blocker || 'few_leads',
    tier: DIAGNOSIS.tierByDesired[answers.desired_clients] || 'pro'
  }
}

// ── Структура воронки ────────────────────────────────────────────────────────
// type: video | form | radio | checkbox | card
export const SLIDES = [
  { type: 'card', id: 'intro', q: 'slides.intro.q', sub: 'slides.intro.sub' },
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
      { v: 'c_1_3', icon: 'user', color: '#3b82f6' },
      { v: 'c_4_10', icon: 'users', color: '#10b981' },
      { v: 'c_10_plus', icon: 'sparkle', color: '#f59e0b' }
    ]
  },
  { type: 'card', dynamic: true, id: 'diagnosis', q: 'slides.diagnosis.q', sub: 'slides.diagnosis.sub' },
  { type: 'card', dynamic: true, id: 'pricing', q: 'slides.pricing.q', sub: '' },
  { type: 'card', dynamic: true, id: 'cta', q: 'slides.cta.q', sub: 'slides.cta.sub' },
  // ── Після оплати ───────────────────────────────────────────────────────────
  { type: 'card', id: 'photoUpload', q: 'slides.photoUpload.q', sub: 'slides.photoUpload.sub' },
  { type: 'card', dynamic: true, id: 'aiPotential', q: 'slides.aiPotential.q', sub: 'slides.aiPotential.sub' },
  { type: 'card', dynamic: true, id: 'assessment', q: 'slides.assessment.q', sub: 'slides.assessment.sub' },
  { type: 'card', id: 'fullProfile', q: 'slides.fullProfile.q', sub: 'slides.fullProfile.sub' }
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
