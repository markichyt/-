// English (UK) — overrides on top of `en` (fallbackLocale: en-GB → en → uk).
// Per-key fallback: only keys listed here override; everything else comes from en.
// Changes: currency £, a few GB terms. Prices/thresholds are DRAFTS — confirm before launch.
export default {
  slides: {
    profession: {
      opt: {
        attorney: 'Solicitor',
        lawyer: 'Barrister',
        cpa: 'Accountant',
        tax_specialist: 'Tax Adviser'
      }
    },
    services: {
      opt: {
        corporate_commercial: 'Corporate & Commercial Law',
        motoring: 'Motoring & Road Traffic Law',
        general: 'General Legal Services',
        criminal: 'Criminal Law',
        notarial: 'Notarial Services',
        banking_finance: 'Banking & Financial Law',
        property: 'Property Law',
        employment: 'Employment Law',
        consular: 'Consular & Embassy Services',
        family_law: 'Family Law',
        business: 'Business Law',
        taxes: 'Tax Law',
        labour_law: 'Labour Law',
        immigration: 'Immigration & Nationality Law'
      }
    },
    ad_budget: {
      opt: {
        to_40k: 'Up to £1,000',
        to_400k: '£1,000 – £10,000',
        over_400k: 'More than £10,000'
      }
    }
  },
  cards: {
    aiPotential: {
      revenue: '≈ £{low} – £{high}',
      teamRoleCost: '£{low}K–£{high}K',
      teamTotal: '£{low} – £{high}/mo',
      ourPlan: '£{amount}/mo',
      punchHtml: "That's <b>{times}×</b> cheaper — save up to <b>£{save}/mo</b>"
    },
    assessment: {
      adBudget: {
        none: "don't spend",
        to_40k: 'up to £1,000',
        to_400k: '£1,000–£10,000',
        over_400k: 'over £10,000'
      }
    },
    profilesPricing: {
      trustTitle: 'Built for UK solicitors',
      demo: { name: 'James Wilson', role: 'Solicitor', location: 'UK, London' },
      demoPremium: { name: 'Alexander König', role: 'Solicitor', location: 'UK, London' }
    }
  },
  scenes: {
    social: { countLabel: 'solicitors' },
    google: {
      query: 'Divorce solicitor London',
      sub: 'Above LinkedIn, ReviewSolicitors and your own site',
      result1Title: 'James Wilson, Solicitor — London',
      result2Title: 'James Wilson — LinkedIn Profile',
      result3Title: 'Wilson Law — Home'
    },
    ads: { demoName: 'James Wilson', demoRole: 'SOLICITOR · LONDON' }
  }
}
