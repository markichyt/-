import { i18n } from './index.js'

// Ринкові ЧИСЛА і набори (не тексти). Значення затверджені замовником (форма локалізації).
// На бою категорії/пакети/валюта приходять з window.* (див. план); тут — джерело для прототипу.
const MARKETS = {
  uk: {
    // Ціни (₴), слайд 19 → оплата 20. Річна = місячна −10%.
    pricing: {
      monthly: { base: 399, pro: 1599, premium: 3999 },
      annual: { base: 359, pro: 1439, premium: 3599 }
    },
    // Слайд 4: доходи юристів на плашках (120–400 тис ₴/міс).
    incomes: {
      top: [180000, 320000, 250000, 145000, 380000, 210000, 400000, 160000, 290000, 235000, 340000, 125000, 370000, 200000, 310000, 265000, 395000, 155000, 285000, 220000],
      bot: [300000, 175000, 350000, 195000, 120000, 275000, 390000, 245000, 330000, 150000, 360000, 205000, 385000, 140000, 295000, 240000, 375000, 165000, 315000, 255000]
    },
    // Слайд 8: константи AI-потенціалу. Зарплати команди (червоні) — у ₴ на місяць.
    aiPotential: {
      caseValueLow: 1800,
      caseValueHigh: 5500,
      ourPlan: 1599,
      teamRoles: [
        { key: 'seo', low: 25000, high: 50000 },
        { key: 'targeting', low: 25000, high: 45000 },
        { key: 'content', low: 25000, high: 45000 },
        { key: 'video', low: 20000, high: 40000 },
        { key: 'smm', low: 20000, high: 45000 }
      ]
    },
    scenes: { googleRevenue: 200000, aiAdsRevenue: 350000, contentTotalReach: 100000 },
    professions: [
      { v: 'lawyer', icon: 'scales', color: '#3b82f6' },
      { v: 'attorney', icon: 'gavel', color: '#7c3aed' },
      { v: 'accountant', icon: 'bar-chart', color: '#10b981' },
      { v: 'notary', icon: 'stamp', color: '#8b5cf6' },
      { v: 'enforcement', icon: 'shield-check', color: '#0891b2' },
      { v: 'patent', icon: 'file-text', color: '#0ea5e9' },
      { v: 'customs', icon: 'globe', color: '#14b8a6' },
      { v: 'other', icon: 'plus', color: '#94a3b8' }
    ],
    services: [
      { v: 'auto', icon: 'car', color: '#ec4899' },
      { v: 'corporate', icon: 'bar-chart', color: '#3b82f6' },
      { v: 'debt_collection', icon: 'banknote', color: '#14b8a6' },
      { v: 'migration', icon: 'globe', color: '#0284c7' },
      { v: 'real_estate', icon: 'home', color: '#f59e0b' },
      { v: 'labour', icon: 'briefcase', color: '#6366f1' },
      { v: 'family', icon: 'family', color: '#db2777' },
      { v: 'inheritance', icon: 'scroll', color: '#10b981' },
      { v: 'social', icon: 'users', color: '#8b5cf6' },
      { v: 'debtor_protection', icon: 'shield-check', color: '#0891b2' },
      { v: 'military', icon: 'military', color: '#64748b' },
      { v: 'criminal', icon: 'gavel', color: '#b91c1c' },
      { v: 'documents', icon: 'file-text', color: '#7c3aed' },
      { v: 'other', icon: 'plus', color: '#94a3b8' }
    ]
  },
  // 🇺🇸 США ($).
  en: {
    pricing: {
      monthly: { base: 49, pro: 199, premium: 499 },
      annual: { base: 44, pro: 179, premium: 449 }
    },
    incomes: {
      top: [12000, 28000, 47000, 8000, 35000, 19000, 52000, 15000, 41000, 23000, 31000, 9000, 44000, 17000, 38000, 26000, 50000, 11000, 33000, 21000],
      bot: [22000, 39000, 16000, 45000, 7000, 29000, 53000, 18000, 36000, 24000, 42000, 13000, 48000, 20000, 34000, 27000, 51000, 10000, 30000, 25000]
    },
    aiPotential: {
      caseValueLow: 500,
      caseValueHigh: 2000,
      ourPlan: 199,
      teamRoles: [
        { key: 'seo', low: 1000, high: 8000 },
        { key: 'targeting', low: 1000, high: 7000 },
        { key: 'content', low: 1000, high: 6000 },
        { key: 'video', low: 1000, high: 5000 },
        { key: 'smm', low: 1000, high: 4000 }
      ]
    },
    scenes: { googleRevenue: 175000, aiAdsRevenue: 122000, contentTotalReach: 100000 },
    professions: [
      { v: 'attorney', icon: 'scales', color: '#6366f1' },
      { v: 'lawyer', icon: 'briefcase', color: '#3b82f6' },
      { v: 'notary', icon: 'stamp', color: '#8b5cf6' },
      { v: 'patent_attorney', icon: 'file-text', color: '#0ea5e9' },
      { v: 'cpa', icon: 'bar-chart', color: '#10b981' },
      { v: 'tax_specialist', icon: 'dollar', color: '#14b8a6' },
      { v: 'other', icon: 'briefcase', color: '#64748b' }
    ],
    services: [
      { v: 'banking_finance', icon: 'dollar', color: '#3b82f6' },
      { v: 'real_estate', icon: 'home', color: '#f59e0b' },
      { v: 'labour_law', icon: 'briefcase', color: '#8b5cf6' },
      { v: 'intellectual_property', icon: 'file-text', color: '#7c3aed' },
      { v: 'general', icon: 'scales', color: '#6366f1' },
      { v: 'family_law', icon: 'users', color: '#ef4444' },
      { v: 'business', icon: 'bar-chart', color: '#0ea5e9' },
      { v: 'taxes', icon: 'dollar', color: '#10b981' },
      { v: 'cars', icon: 'car', color: '#ec4899' },
      { v: 'employment', icon: 'user', color: '#14b8a6' },
      { v: 'immigration_law', icon: 'globe', color: '#0284c7' }
    ]
  },
  // 🇵🇱 Польща (zł). Набір категорій — 23 (розширений замовником).
  pl: {
    pricing: {
      monthly: { base: 149, pro: 599, premium: 1499 },
      annual: { base: 134, pro: 539, premium: 1349 }
    },
    incomes: {
      top: [32000, 58000, 74000, 24000, 68000, 42000, 80000, 28000, 62000, 46000, 54000, 20000, 70000, 36000, 64000, 48000, 78000, 22000, 56000, 40000],
      bot: [66000, 38000, 72000, 44000, 18000, 52000, 79000, 30000, 60000, 47000, 71000, 26000, 76000, 34000, 57000, 45000, 77000, 21000, 50000, 42000]
    },
    aiPotential: {
      caseValueLow: 800,
      caseValueHigh: 2500,
      ourPlan: 599,
      teamRoles: [
        { key: 'seo', low: 3000, high: 12000 },
        { key: 'targeting', low: 2000, high: 10000 },
        { key: 'content', low: 2000, high: 8000 },
        { key: 'video', low: 2000, high: 7000 },
        { key: 'smm', low: 1000, high: 6000 }
      ]
    },
    scenes: { googleRevenue: 41000, aiAdsRevenue: 52000, contentTotalReach: 100000 },
    professions: [
      { v: 'advocate', icon: 'scales', color: '#3b82f6' },
      { v: 'legal_counsel', icon: 'gavel', color: '#7c3aed' },
      { v: 'notary', icon: 'stamp', color: '#8b5cf6' },
      { v: 'patent_agent', icon: 'file-text', color: '#0ea5e9' },
      { v: 'tax_advisor', icon: 'dollar', color: '#14b8a6' },
      { v: 'accountant', icon: 'bar-chart', color: '#10b981' },
      { v: 'other', icon: 'plus', color: '#94a3b8' }
    ],
    services: [
      { v: 'social_integration', icon: 'users', color: '#8b5cf6' },
      { v: 'digital_id', icon: 'globe', color: '#0284c7' },
      { v: 'tax_zus', icon: 'dollar', color: '#10b981' },
      { v: 'ip', icon: 'file-text', color: '#7c3aed' },
      { v: 'notarial', icon: 'stamp', color: '#8b5cf6' },
      { v: 'accounting', icon: 'bar-chart', color: '#3b82f6' },
      { v: 'sworn_translation', icon: 'scroll', color: '#14b8a6' },
      { v: 'social_benefits', icon: 'users', color: '#ec4899' },
      { v: 'education', icon: 'scroll', color: '#f59e0b' },
      { v: 'social_insurance', icon: 'shield-check', color: '#0891b2' },
      { v: 'residence', icon: 'globe', color: '#0ea5e9' },
      { v: 'compensation', icon: 'banknote', color: '#db2777' },
      { v: 'real_estate', icon: 'home', color: '#f59e0b' },
      { v: 'inheritance', icon: 'scroll', color: '#10b981' },
      { v: 'criminal', icon: 'gavel', color: '#b91c1c' },
      { v: 'tax_advisory', icon: 'dollar', color: '#14b8a6' },
      { v: 'transport', icon: 'car', color: '#ec4899' },
      { v: 'labour', icon: 'briefcase', color: '#6366f1' },
      { v: 'investment', icon: 'bar-chart', color: '#0ea5e9' },
      { v: 'family', icon: 'family', color: '#db2777' },
      { v: 'corporate', icon: 'briefcase', color: '#3b82f6' },
      { v: 'migration', icon: 'globe', color: '#0284c7' },
      { v: 'other', icon: 'plus', color: '#94a3b8' }
    ]
  }
}

// 🇬🇧 Велика Британія (£) — наслідує US, свої ціни/сцени та СВІЙ набір категорій (14).
MARKETS['en-GB'] = {
  ...MARKETS.en,
  pricing: {
    monthly: { base: 39, pro: 159, premium: 399 },
    annual: { base: 35, pro: 143, premium: 359 }
  },
  aiPotential: { ...MARKETS.en.aiPotential, ourPlan: 159 },
  scenes: { googleRevenue: 135000, aiAdsRevenue: 110000, contentTotalReach: 100000 },
  services: [
    { v: 'corporate_commercial', icon: 'bar-chart', color: '#3b82f6' },
    { v: 'motoring', icon: 'car', color: '#ec4899' },
    { v: 'general', icon: 'scales', color: '#6366f1' },
    { v: 'criminal', icon: 'gavel', color: '#b91c1c' },
    { v: 'notarial', icon: 'stamp', color: '#8b5cf6' },
    { v: 'banking_finance', icon: 'dollar', color: '#10b981' },
    { v: 'property', icon: 'home', color: '#f59e0b' },
    { v: 'employment', icon: 'user', color: '#14b8a6' },
    { v: 'consular', icon: 'globe', color: '#0284c7' },
    { v: 'family_law', icon: 'family', color: '#db2777' },
    { v: 'business', icon: 'briefcase', color: '#0ea5e9' },
    { v: 'taxes', icon: 'dollar', color: '#7c3aed' },
    { v: 'labour_law', icon: 'briefcase', color: '#6366f1' },
    { v: 'immigration', icon: 'globe', color: '#0891b2' }
  ]
}

// 🇦🇪 ОАЕ (AED) — англійська мова, місцева валюта. Наслідує US, свої ціни/зарплати/сцени/категорії (12).
MARKETS['en-AE'] = {
  ...MARKETS.en,
  pricing: {
    monthly: { base: 179, pro: 729, premium: 1829 },
    annual: { base: 161, pro: 656, premium: 1646 }
  },
  aiPotential: {
    ...MARKETS.en.aiPotential,
    ourPlan: 729,
    caseValueLow: 500,
    caseValueHigh: 2500,
    teamRoles: [
      { key: 'seo', low: 7000, high: 15000 },
      { key: 'targeting', low: 8000, high: 18000 },
      { key: 'content', low: 5000, high: 12000 },
      { key: 'video', low: 6000, high: 15000 },
      { key: 'smm', low: 5000, high: 12000 }
    ]
  },
  incomes: {
    top: [38000, 70000, 90000, 28000, 82000, 50000, 95000, 34000, 74000, 55000, 65000, 24000, 85000, 44000, 78000, 58000, 92000, 26000, 68000, 48000],
    bot: [80000, 46000, 86000, 52000, 21000, 62000, 94000, 36000, 72000, 56000, 84000, 30000, 88000, 40000, 69000, 54000, 91000, 25000, 60000, 50000]
  },
  scenes: { googleRevenue: 86000, aiAdsRevenue: 78000, contentTotalReach: 100000 },
  services: [
    { v: 'consular', icon: 'globe', color: '#0284c7' },
    { v: 'business', icon: 'bar-chart', color: '#3b82f6' },
    { v: 'motor', icon: 'car', color: '#ec4899' },
    { v: 'general', icon: 'scales', color: '#6366f1' },
    { v: 'criminal', icon: 'gavel', color: '#b91c1c' },
    { v: 'notarial', icon: 'stamp', color: '#8b5cf6' },
    { v: 'banking_finance', icon: 'dollar', color: '#10b981' },
    { v: 'real_estate', icon: 'home', color: '#f59e0b' },
    { v: 'labour', icon: 'briefcase', color: '#14b8a6' },
    { v: 'family_law', icon: 'family', color: '#db2777' },
    { v: 'taxes', icon: 'dollar', color: '#7c3aed' },
    { v: 'immigration', icon: 'globe', color: '#0891b2' }
  ]
}

// 🇺🇦 Російська мова для українського ринку — ті самі числа й набори, що й uk (валюта ₴).
MARKETS.ru = MARKETS.uk

export function market(locale = i18n.locale) {
  return MARKETS[locale] || MARKETS.uk
}

export default MARKETS
