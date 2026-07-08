// Дані планів/функцій для картки тарифів.
//   key      — стабільний ключ функції; підпис береться з i18n (pricing.features.<key>).
//   graduated: true → у категорії свій рядок під кожен тариф; показується лише той,
//     чий прапорець збігається з тарифом (інші приховані, а не ✗).
// Ціни — з marketConfig (pricing), форматуються через formatMoney у компонентах.
export const pricingFeatures = [
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

// Узагальнені ✗-заглушки для градуйованих категорій, де в тарифу немає свого рядка.
export const pricingGenericPlaceholders = [
  { categoryRows: ['ai_pro_avatar', 'ai_premium_avatar'], key: 'ai_avatar' },
  { categoryRows: ['reputation_10', 'reputation_unlim'], key: 'reputation' }
]

// badge.text — i18n-ключ (pricing.badges.<...>).
export const pricingProBadges = {
  posts_40: { text: 'pricing.badges.more_4x', type: 'green' },
  leads_30: { text: 'pricing.badges.more_5x', type: 'green' },
  reputation_10: { text: 'pricing.badges.new', type: 'cyan' },
  rating_boost: { text: 'pricing.badges.new', type: 'cyan' },
  own_prices: { text: 'pricing.badges.new', type: 'cyan' },
  ai_pro_avatar: { text: 'pricing.badges.new', type: 'cyan' }
}

export const pricingPremiumBadges = {
  posts_100: { text: 'pricing.badges.more_2_5x', type: 'green' },
  leads_unlim: { text: 'pricing.badges.infinity', type: 'green' },
  google_top: { text: 'pricing.badges.new', type: 'cyan' },
  manager_24_7: { text: 'pricing.badges.new', type: 'cyan' },
  exclusive_smm: { text: 'pricing.badges.new', type: 'cyan' },
  reputation_unlim: { text: 'pricing.badges.infinity', type: 'green' },
  ai_premium_avatar: { text: 'pricing.badges.upgrade', type: 'cyan' }
}

// Формує видимий список функцій для тарифу (ключі + прапорці + бейджі).
export function buildTierFeatures(tier) {
  const badgeMap = tier === 'pro' ? pricingProBadges : tier === 'premium' ? pricingPremiumBadges : null
  const relevant = []

  pricingFeatures.forEach((feature) => {
    if (feature.graduated && !feature[tier]) return
    const item = { key: feature.key, on: !!feature[tier] }
    if (badgeMap && badgeMap[feature.key]) item.badge = badgeMap[feature.key]
    relevant.push(item)
  })

  pricingGenericPlaceholders.forEach((placeholder) => {
    const hasOwnEntry = pricingFeatures.some(
      (feature) => placeholder.categoryRows.indexOf(feature.key) >= 0 && feature[tier]
    )
    if (!hasOwnEntry) relevant.push({ key: placeholder.key, on: false })
  })

  relevant.sort((a, b) => (b.on ? 1 : 0) - (a.on ? 1 : 0))
  return relevant
}
