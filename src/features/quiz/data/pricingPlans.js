// Дані планів/функцій для картки тарифів (українська версія, ціни у ₴).

// Рядки порівняння функцій.
//   graduated: true → у категорії свій рядок під кожен тариф; показується лише той,
//   чий прапорець збігається з тарифом (інші приховані, а не ✗).
export const pricingFeatures = [
  { label: 'AI PRO аватар', graduated: true, base: false, pro: true, premium: false },
  { label: 'AI PREMIUM аватар', graduated: true, base: false, pro: false, premium: true },
  { label: '10 AI-постів/відео', graduated: true, base: true, pro: false, premium: false },
  { label: '40 AI-постів/відео', graduated: true, base: false, pro: true, premium: false },
  { label: '100 AI-постів/відео', graduated: true, base: false, pro: false, premium: true },
  { label: '6 купівель лідів', graduated: true, base: true, pro: false, premium: false },
  { label: '30 купівель лідів', graduated: true, base: false, pro: true, premium: false },
  { label: 'Безлімітна купівля лідів', graduated: true, base: false, pro: false, premium: true },
  { label: 'До 10 перевірок репутації', graduated: true, base: false, pro: true, premium: false },
  { label: 'Безлімітні перевірки репутації', graduated: true, base: false, pro: false, premium: true },
  { label: 'Топ у Google за вашим іменем', base: false, pro: false, premium: true },
  { label: 'Персональний менеджер 24/7', base: false, pro: false, premium: true },
  { label: 'Ексклюзивне просування в соцмережах', base: false, pro: false, premium: true },
  { label: 'Підвищення рейтингу за минулим досвідом', base: false, pro: true, premium: true },
  { label: 'Власні ціни на ваші послуги', base: false, pro: true, premium: true },
  { label: 'AI-модуль для Google і Meta', base: true, pro: true, premium: true },
  { label: 'AI-моніторинг конкурентів', base: true, pro: true, premium: true },
  { label: 'AI-асистент для клієнтів', base: true, pro: true, premium: true },
  { label: 'Реферальний заробіток', base: true, pro: true, premium: true },
  { label: 'Приватний чат для спеціалістів', base: true, pro: true, premium: true },
  { label: 'CRM-система', base: true, pro: true, premium: true },
  { label: 'Захищений месенджер', base: true, pro: true, premium: true }
]

// Узагальнені ✗-заглушки для градуйованих категорій, де в тарифу немає свого рядка.
export const pricingGenericPlaceholders = [
  { categoryRows: ['AI PRO аватар', 'AI PREMIUM аватар'], label: 'AI-аватар' },
  { categoryRows: ['До 10 перевірок репутації', 'Безлімітні перевірки репутації'], label: 'Перевірки репутації' }
]

export const pricingProBadges = {
  '40 AI-постів/відео': { text: '4x більше', type: 'green' },
  '30 купівель лідів': { text: '5x більше', type: 'green' },
  'До 10 перевірок репутації': { text: 'НОВЕ', type: 'cyan' },
  'Підвищення рейтингу за минулим досвідом': { text: 'НОВЕ', type: 'cyan' },
  'Власні ціни на ваші послуги': { text: 'НОВЕ', type: 'cyan' },
  'AI PRO аватар': { text: 'НОВЕ', type: 'cyan' }
}

export const pricingPremiumBadges = {
  '100 AI-постів/відео': { text: '2.5x більше', type: 'green' },
  'Безлімітна купівля лідів': { text: '∞', type: 'green' },
  'Топ у Google за вашим іменем': { text: 'НОВЕ', type: 'cyan' },
  'Персональний менеджер 24/7': { text: 'НОВЕ', type: 'cyan' },
  'Ексклюзивне просування в соцмережах': { text: 'НОВЕ', type: 'cyan' },
  'Безлімітні перевірки репутації': { text: '∞', type: 'green' },
  'AI PREMIUM аватар': { text: 'АПГРЕЙД', type: 'cyan' }
}

// Місячні ціни (₴); річний режим застосовує −10% (заздалегідь пораховані рядки).
export const pricingByBilling = {
  monthly: {
    base: { price: '399 ₴', note: 'на місяць, щомісячна оплата' },
    pro: { price: '1 599 ₴', note: 'на місяць, щомісячна оплата' },
    premium: { price: '3 999 ₴', note: 'на місяць, щомісячна оплата' }
  },
  annual: {
    base: { price: '359 ₴', note: 'на місяць, річна оплата (−10%)' },
    pro: { price: '1 439 ₴', note: 'на місяць, річна оплата (−10%)' },
    premium: { price: '3 599 ₴', note: 'на місяць, річна оплата (−10%)' }
  }
}

// Формує видимий список функцій для тарифу.
export function buildTierFeatures(tier) {
  const badgeMap = tier === 'pro' ? pricingProBadges : tier === 'premium' ? pricingPremiumBadges : null
  const relevant = []

  pricingFeatures.forEach((feature) => {
    if (feature.graduated && !feature[tier]) return
    const item = { label: feature.label, on: !!feature[tier] }
    if (badgeMap && badgeMap[feature.label]) item.badge = badgeMap[feature.label]
    relevant.push(item)
  })

  pricingGenericPlaceholders.forEach((placeholder) => {
    const hasOwnEntry = pricingFeatures.some(
      (feature) => placeholder.categoryRows.indexOf(feature.label) >= 0 && feature[tier]
    )
    if (!hasOwnEntry) relevant.push({ label: placeholder.label, on: false })
  })

  relevant.sort((a, b) => (b.on ? 1 : 0) - (a.on ? 1 : 0))
  return relevant
}
