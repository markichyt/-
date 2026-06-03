<script setup>
import { ref, computed, watch } from 'vue'
import QuizActionBar from '../../QuizActionBar.vue'
import QuizContinueButton from '../../QuizContinueButton.vue'
import { useQuizData } from '../../../composables/useQuizData.js'
import { useQuizProgress } from '../../../composables/useQuizProgress.js'

// "Meet your future on ConsultantLM" — a personalized profile card plus an
// interactive lead → client → revenue calculator that updates as the user drags.
const { quizData } = useQuizData()
const { goToNextStep } = useQuizProgress()

const INQUIRY_COST_AVG = 95
const CONVERSION = 1 / 6 // ~17% — 1 paying client per 6 leads

const PLANS = {
  base: { name: 'Base', sub: 49, maxInq: 6, defaultInq: 3, unlimited: false, clientLow: 10000, clientHigh: 20000 },
  pro: { name: 'Pro', sub: 199, maxInq: 30, defaultInq: 15, unlimited: false, clientLow: 2000, clientHigh: 6000 },
  premium: { name: 'Premium', sub: 499, maxInq: 100, defaultInq: 50, unlimited: true, clientLow: 2000, clientHigh: 5000 }
}
const RATINGS = { base: '52.18', pro: '67.59', premium: '88.42' }
const PROFESSION_LABELS = { attorney: 'Attorney', lawyer: 'Lawyer', notary: 'Notary', patent_attorney: 'Patent Attorney', cpa: 'CPA', tax_specialist: 'Tax Specialist' }

const currentPlan = ref(quizData.plan || 'pro')
quizData.plan = currentPlan.value

const plan = computed(() => PLANS[currentPlan.value])
const inquiries = ref(plan.value.defaultInq)

const displayName = computed(() => (quizData.first_name || 'You') + (quizData.last_name ? ' ' + quizData.last_name : ''))
const displayProfession = computed(() => PROFESSION_LABELS[quizData.profession] || 'Attorney')
const displayCity = computed(() => quizData.city || 'United States')

const roi = computed(() => {
  const p = plan.value
  const n = inquiries.value

  const inquiryLabel = p.unlimited && n >= p.maxInq ? n + '+' : String(n)

  const clientsAvg = n * CONVERSION
  const clientsLow = Math.max(0, Math.floor(clientsAvg))
  const clientsHigh = Math.max(0, Math.ceil(clientsAvg + 0.5))

  let clientsLabel
  if (clientsAvg === 0) clientsLabel = '0'
  else if (clientsLow === clientsHigh) clientsLabel = '~' + clientsLow
  else clientsLabel = '~' + clientsLow + '–' + clientsHigh

  const revLow = clientsLow * p.clientLow
  const revHigh = clientsHigh * p.clientHigh
  const inqCost = n * INQUIRY_COST_AVG
  const subCost = p.sub
  const netLow = Math.max(0, revLow - inqCost - subCost)
  const netHigh = Math.max(0, revHigh - inqCost - subCost)

  const revenueText = clientsAvg === 0
    ? '$0'
    : '$' + revLow.toLocaleString('en-US') + ' – $' + revHigh.toLocaleString('en-US')
  const netText = clientsAvg === 0
    ? '−$' + (inqCost + subCost).toLocaleString('en-US') + ' /mo'
    : '$' + netLow.toLocaleString('en-US') + ' – $' + netHigh.toLocaleString('en-US') + ' /mo'

  return {
    inquiryLabel,
    clientsLabel,
    revenueText,
    inquiryCostText: '−$' + inqCost.toLocaleString('en-US'),
    subText: '−$' + subCost + ' /mo',
    netText,
    showPayback: revLow > 0,
    maxHint: p.unlimited ? '(unlimited)' : '(of ' + p.maxInq + ' included)',
    clientsLow: clientsLow,
    revLow: revLow
  }
})

// Mirror the realistic (not theoretical-max) numbers into the answer store.
watch(roi, (value) => {
  quizData.desired_clients = value.clientsLow
  quizData.desired_revenue = value.revLow
}, { immediate: true })

function switchPlan(planId) {
  currentPlan.value = planId
  quizData.plan = planId
  inquiries.value = PLANS[planId].defaultInq
}
</script>

<template>
  <div class="wow-card-v2">
    <div class="plan-tabs">
      <button
        v-for="planId in ['base', 'pro', 'premium']"
        :key="planId"
        class="plan-tab"
        :class="{ active: currentPlan === planId }"
        :data-plan="planId"
        @click="switchPlan(planId)"
      >
        {{ PLANS[planId].name }}
      </button>
    </div>

    <div class="wow-profile">
      <div class="wow-profile-header">
        <span class="wow-profile-plan-badge" :class="'wow-profile-plan-badge--' + currentPlan">{{ plan.name.toUpperCase() }}</span>
        <span class="wow-profile-rating">★ <span>{{ RATINGS[currentPlan] }}</span></span>
      </div>
      <div class="wow-profile-body">
        <div class="wow-profile-photo">
          <div class="wow-profile-photo-placeholder">📷</div>
        </div>
        <div class="wow-profile-info">
          <div class="wow-profile-name">{{ displayName }}</div>
          <div class="wow-profile-role">{{ displayProfession }}</div>
          <div class="wow-profile-city"><span class="loc-pin">📍</span> {{ displayCity }}</div>
        </div>
      </div>
    </div>

    <div class="roi-calc">
      <div class="roi-calc-label">📈 Your Estimated Pipeline Value</div>
      <div class="roi-slider-row">
        <span class="roi-slider-label">Leads / month: <strong>{{ roi.inquiryLabel }}</strong> <span class="roi-max-hint">{{ roi.maxHint }}</span></span>
        <input v-model.number="inquiries" type="range" min="0" :max="plan.maxInq" step="1" class="roi-slider">
      </div>
      <div class="roi-table">
        <div class="roi-row roi-highlight"><span>Paying clients (1 in 6):</span><span>{{ roi.clientsLabel }}</span></div>
        <div class="roi-row"><span>Expected revenue:</span><span>{{ roi.revenueText }}</span></div>
        <div class="roi-row roi-minus"><span>Lead cost ({{ roi.inquiryLabel }} × $95):</span><span>{{ roi.inquiryCostText }}</span></div>
        <div class="roi-row roi-minus"><span>ConsultantLM subscription:</span><span>{{ roi.subText }}</span></div>
        <div class="roi-row roi-total"><span>Net potential:</span><span>{{ roi.netText }}</span></div>
      </div>
      <div v-show="roi.showPayback" class="roi-payback">Payback period: <strong>~ 1 day</strong></div>
      <div class="roi-disclaimer"><strong>Leads are not yet clients, not paid clients.</strong> Realistic conversion: ~1 in 6 Leads becomes a paying case. Actual results depend on your response speed, follow-up workflow, pricing and specialty match. Estimates only — past performance does not guarantee future results.</div>
    </div>
  </div>

  <QuizActionBar>
    <QuizContinueButton @continue="goToNextStep" />
  </QuizActionBar>
</template>
