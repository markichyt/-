// English (UAE) — overrides on top of `en` (fallbackLocale: en-AE → en → uk).
// Per-key fallback: only keys here override; the rest comes from en.
// Changes: currency AED, a few UAE terms. Prices/thresholds are DRAFTS — confirm before launch.
export default {
  slides: {
    services: {
      opt: {
        consular: 'Consular & Embassy Services',
        business: 'Business & Corporate Law',
        motor: 'Motor Vehicle Law',
        general: 'General Legal Services',
        criminal: 'Criminal Law',
        notarial: 'Notarial Services',
        banking_finance: 'Banking & Financial Law',
        real_estate: 'Real Estate Law',
        labour: 'Labor & Employment Law',
        family_law: 'Family Law',
        taxes: 'Tax Law',
        immigration: 'Immigration & Residency Law'
      }
    },
    ad_budget: {
      opt: {
        to_40k: 'Up to AED 5,000',
        to_400k: 'AED 5,000 – AED 20,000',
        over_400k: 'More than AED 20,000'
      }
    }
  },
  cards: {
    aiPotential: {
      revenue: '≈ AED {low} – AED {high}',
      teamRoleCost: 'AED {low}K–{high}K',
      teamTotal: 'AED {low} – {high}/mo',
      ourPlan: 'AED {amount}/mo',
      punchHtml: "That's <b>{times}×</b> cheaper — save up to <b>AED {save}/mo</b>"
    },
    assessment: {
      adBudget: {
        none: "don't spend",
        to_40k: 'up to AED 5,000',
        to_400k: 'AED 5,000–20,000',
        over_400k: 'over AED 20,000'
      }
    },
    profilesPricing: {
      trustTitle: 'Built for UAE lawyers',
      demo: { name: 'Omar Haddad', role: 'Advocate', location: 'UAE, Dubai' },
      demoPremium: { name: 'Alexander König', role: 'Advocate', location: 'UAE, Dubai' }
    }
  },
  scenes: {
    social: { countLabel: 'lawyers' },
    google: {
      query: 'Divorce lawyer Dubai',
      sub: '#1 in Google — above LinkedIn and your own site',
      result1Title: 'Omar Haddad, Advocate — Dubai',
      result2Title: 'Omar Haddad — LinkedIn Profile',
      result3Title: 'Haddad Legal — Home'
    },
    ads: { demoName: 'Omar Haddad', demoRole: 'ADVOCATE · DUBAI' }
  }
}
