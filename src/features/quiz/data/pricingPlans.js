// Plan/feature data for the ProfilesPricing card.

// Feature comparison rows.
//   graduated: true → the category has one tier-specific row per tier; only the
//   row whose flag matches the current tier is shown (others are hidden, not ✗).
export const pricingFeatures = [
  { label: 'AI PRO avatar', graduated: true, base: false, pro: true, premium: false },
  { label: 'AI PREMIUM avatar', graduated: true, base: false, pro: false, premium: true },
  { label: '10 AI posts/videos', graduated: true, base: true, pro: false, premium: false },
  { label: '40 AI posts/videos', graduated: true, base: false, pro: true, premium: false },
  { label: '100 AI posts/videos', graduated: true, base: false, pro: false, premium: true },
  { label: '6 lead buying', graduated: true, base: true, pro: false, premium: false },
  { label: '30 lead buying', graduated: true, base: false, pro: true, premium: false },
  { label: 'Unlimited lead buying', graduated: true, base: false, pro: false, premium: true },
  { label: 'Up to 10 reputation checks', graduated: true, base: false, pro: true, premium: false },
  { label: 'Unlimited reputation checks', graduated: true, base: false, pro: false, premium: true },
  { label: 'Top in Google by your name', base: false, pro: false, premium: true },
  { label: '24/7 personal manager', base: false, pro: false, premium: true },
  { label: 'Exclusive social promotion', base: false, pro: false, premium: true },
  { label: 'Boost rating from past experience', base: false, pro: true, premium: true },
  { label: 'Set custom prices for your services', base: false, pro: true, premium: true },
  { label: 'AI module for Google & Meta', base: true, pro: true, premium: true },
  { label: 'AI competitor monitoring', base: true, pro: true, premium: true },
  { label: 'AI client assistant', base: true, pro: true, premium: true },
  { label: 'Referral earnings', base: true, pro: true, premium: true },
  { label: 'Private specialist chat', base: true, pro: true, premium: true },
  { label: 'CRM system', base: true, pro: true, premium: true },
  { label: 'Secure messenger', base: true, pro: true, premium: true }
]

// Generic ✗ placeholders for graduated categories where a tier has no own row
// (e.g. Base lacks any avatar / reputation row).
export const pricingGenericPlaceholders = [
  { categoryRows: ['AI PRO avatar', 'AI PREMIUM avatar'], label: 'AI avatar' },
  { categoryRows: ['Up to 10 reputation checks', 'Unlimited reputation checks'], label: 'Reputation checks' }
]

export const pricingProBadges = {
  '40 AI posts/videos': { text: '4x more', type: 'green' },
  '30 lead buying': { text: '5x more', type: 'green' },
  'Up to 10 reputation checks': { text: 'NEW', type: 'cyan' },
  'Boost rating from past experience': { text: 'NEW', type: 'cyan' },
  'Set custom prices for your services': { text: 'NEW', type: 'cyan' },
  'AI PRO avatar': { text: 'NEW', type: 'cyan' }
}

export const pricingPremiumBadges = {
  '100 AI posts/videos': { text: '2.5x more', type: 'green' },
  'Unlimited lead buying': { text: '∞', type: 'green' },
  'Top in Google by your name': { text: 'NEW', type: 'cyan' },
  '24/7 personal manager': { text: 'NEW', type: 'cyan' },
  'Exclusive social promotion': { text: 'NEW', type: 'cyan' },
  'Unlimited reputation checks': { text: '∞', type: 'green' },
  'AI PREMIUM avatar': { text: 'UPGRADE', type: 'cyan' }
}

// Monthly base prices; annual mode applies -10% (precomputed strings).
export const pricingByBilling = {
  monthly: {
    base: { price: '$49', note: 'per month, billed monthly' },
    pro: { price: '$199', note: 'per month, billed monthly' },
    premium: { price: '$499', note: 'per month, billed monthly' }
  },
  annual: {
    base: { price: '$44', note: 'per month, billed annually (–10%)' },
    pro: { price: '$179', note: 'per month, billed annually (–10%)' },
    premium: { price: '$449', note: 'per month, billed annually (–10%)' }
  }
}

// Resolve the visible feature list for one tier, applying graduated-row and
// generic-placeholder rules, then sorting enabled features to the top.
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
