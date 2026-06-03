<script setup>
import { computed } from 'vue'
import { useQuizData } from '../../../composables/useQuizData.js'

// "Your AI-powered potential" — projects lead/revenue ranges from the user's
// profession, role and selected services, then compares against an in-house team.
const { quizData } = useQuizData()

const PROFESSION_MULTIPLIER = { attorney: 1, lawyer: 0.95, patent_attorney: 1.2, cpa: 0.8, notary: 0.6, tax_specialist: 0.75, other: 0.6 }
const ROLE_MULTIPLIER = { founder: 1.2, executive: 1.15, self_employed: 1.0, employee: 0.85 }
const PROFESSION_LABELS = { attorney: 'Attorney', lawyer: 'Lawyer', patent_attorney: 'Patent Attorney', cpa: 'CPA', notary: 'Notary', tax_specialist: 'Tax Specialist', other: 'Specialist' }
const ROLE_LABELS = { self_employed: 'Self-employed', employee: 'Employee', executive: 'Executive', founder: 'Founder' }

const TEAM_COST_LOW = 5000
const TEAM_COST_HIGH = 30000
const OUR_PLAN = 199

const model = computed(() => {
  const profession = quizData.profession || 'attorney'
  const role = quizData.role || 'self_employed'
  const services = quizData.services || []

  const serviceMultiplier = 1 + Math.min(services.length, 8) * 0.05
  const multiplier = (PROFESSION_MULTIPLIER[profession] || 0.7) * (ROLE_MULTIPLIER[role] || 1.0) * serviceMultiplier

  const seoMin = Math.round(15 * multiplier)
  const seoMax = Math.round(30 * multiplier)
  const adsMin = Math.round(20 * multiplier)
  const adsMax = Math.round(40 * multiplier)
  const socMin = Math.round(10 * multiplier)
  const socMax = Math.round(20 * multiplier)
  const totalMin = seoMin + adsMin + socMin
  const totalMax = seoMax + adsMax + socMax

  const serviceNames = services.map((service) => service.replace(/_/g, ' '))
  const serviceText = serviceNames.length > 0
    ? serviceNames.slice(0, 3).join(', ') + (serviceNames.length > 3 ? '...' : '')
    : 'General'

  const location = quizData.city || quizData.zip || ''

  return {
    seoMin, seoMax, adsMin, adsMax, socMin, socMax, totalMin, totalMax,
    revenueMin: (totalMin * 3000).toLocaleString('en-US'),
    revenueMax: (totalMax * 8000).toLocaleString('en-US'),
    professionLabel: PROFESSION_LABELS[profession] || profession,
    roleLabel: ROLE_LABELS[role] || role,
    location,
    serviceText,
    saveHigh: (TEAM_COST_HIGH - OUR_PLAN).toLocaleString()
  }
})
</script>

<template>
  <div>
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">SEO (Google)</div>
        <div class="stat-value">{{ model.seoMin }}–{{ model.seoMax }}</div>
        <div class="stat-trend">Leads/mo</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Paid Ads</div>
        <div class="stat-value">{{ model.adsMin }}–{{ model.adsMax }}</div>
        <div class="stat-trend">Leads/mo</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Social</div>
        <div class="stat-value">{{ model.socMin }}–{{ model.socMax }}</div>
        <div class="stat-trend">Leads/mo</div>
      </div>
    </div>

    <div class="highlight-card">
      <div class="stat-label">Total Potential Leads</div>
      <div class="big-number">{{ model.totalMin }}–{{ model.totalMax }}</div>
      <div class="stat-label">per month</div>
    </div>

    <div class="highlight-card" style="margin-top:10px">
      <div class="stat-label">Estimated Pipeline Value</div>
      <div class="big-number green">${{ model.revenueMin }} – ${{ model.revenueMax }}</div>
      <div class="stat-label">per month</div>
    </div>

    <div class="roi-card" style="margin-top:14px;background:linear-gradient(135deg,#0a2540,#1a5276);color:#fff;padding:16px 18px;border-radius:14px">
      <div style="font-size:11px;letter-spacing:1px;color:#7eb8d8;text-transform:uppercase;margin-bottom:8px">vs Hiring a Marketing Team</div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">
        <span style="font-size:13px;color:#cbd5e1">In-house team</span>
        <span style="font-size:18px;font-weight:700;color:#fca5a5">$5,000–$30,000/mo</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px">
        <span style="font-size:13px;color:#cbd5e1">Pro plan on ConsultantLM</span>
        <span style="font-size:18px;font-weight:700;color:#86efac">$199/mo</span>
      </div>
      <div style="border-top:1px solid rgba(255,255,255,0.12);padding-top:10px;display:flex;justify-content:space-between;align-items:baseline">
        <span style="font-size:14px;font-weight:600">You save up to</span>
        <span style="font-size:22px;font-weight:800;color:#86efac">${{ model.saveHigh }}/mo</span>
      </div>
    </div>

    <p class="fine-print">
      <strong>Calculated for:</strong> {{ model.professionLabel }}<template v-if="model.location">, {{ model.location }}</template>, {{ model.roleLabel }}, {{ model.serviceText }}.<br>
      Includes: Google SEO + Meta/Google Ads + organic traffic + social media. <em>Estimates only — actual results may vary based on market conditions, profile optimization and individual effort. Not a guarantee of income.</em>
    </p>
  </div>
</template>
