<script setup>
import { ref, computed } from 'vue'
import { useQuizData } from '../../../composables/useQuizData.js'
import { useCountdownTimer } from '../../../composables/useCountdownTimer.js'
import { publicAsset } from '../../../data/publicAsset.js'

const paypalIcon = publicAsset('icon/paypal.svg')
const cardIcon = publicAsset('icon/card-credit.svg')

// "Complete your purchase" — period selector, live discount breakdown, payment
// buttons (which fire the single final submit) and an FAQ accordion.
const { quizData, submitQuizData, clearStoredAnswers } = useQuizData()
const { hours, minutes, seconds } = useCountdownTimer()

const PLAN_NAMES = { base: 'Base', pro: 'Pro', premium: 'Premium' }
const FULL_MONTHLY = { base: 79, pro: 329, premium: 799 }
const PERIODS = {
  '1_month': { label: '1 Month', discount: 0, months: 1 },
  '1_year': { label: '1 Year', discount: 10, months: 12 },
  '3_years': { label: '3 Years', discount: 20, months: 36 }
}
const FAQ_ITEMS = [
  { q: 'How many clients can I expect per month?', a: 'Depending on your specialization, city, and profile optimization -- many lawyers receive 5-15 clients already in the first month, scaling to 20-30+ over time thanks to AI-generated content and SEO promotion.' },
  { q: 'Is this a guaranteed number of clients?', a: 'We provide you with Leads that you work with yourself. You can also work under exclusive conditions with platform clients, in which case these are already paid clients.' },
  { q: 'How does the pricing work?', a: 'We have a three-tier subscription: Basic, Pro, and Premium. The cost is significantly lower than traditional marketing agencies. Many lawyers cover the subscription cost with just 1-2 clients.' },
  { q: 'What if there are no clients?', a: 'The presence of Leads depends on your activity on the platform. We guarantee uninterrupted access to the platform and its resources. Payment is non-refundable once access has been provided.' },
  { q: 'Is my data safe?', a: 'Yes, we use a secure messenger, data encryption, and do not transfer information to third parties. The platform complies with GDPR and data protection regulations.' }
]

const currentPeriod = ref(quizData.period || '1_year')
const openFaq = ref(new Set())

const summary = computed(() => {
  const period = PERIODS[currentPeriod.value]
  const planKey = quizData.plan || 'pro'
  const fullPrice = FULL_MONTHLY[planKey] * period.months

  const urgencyAmount = Math.round(fullPrice * 0.2)
  const referralAmount = quizData.referral_code ? Math.round(fullPrice * 0.1) : 0
  const periodAmount = period.discount > 0 ? Math.round((fullPrice * period.discount) / 100) : 0
  const totalDiscount = urgencyAmount + referralAmount + periodAmount
  const total = Math.max(0, fullPrice - totalDiscount)
  const saved = fullPrice - total

  return {
    planName: PLAN_NAMES[planKey],
    periodLabel: period.label,
    periodDiscount: period.discount,
    fullPrice,
    urgencyAmount,
    referralAmount,
    periodAmount,
    total,
    saved
  }
})

function selectPeriod(periodKey) {
  currentPeriod.value = periodKey
  quizData.payment_period = periodKey
}

function toggleFaq(index) {
  if (openFaq.value.has(index)) openFaq.value.delete(index)
  else openFaq.value.add(index)
  openFaq.value = new Set(openFaq.value)
}

const isSubmitting = ref(false)
function pay(method) {
  quizData.payment_method = method
  quizData.submitted_at = new Date().toISOString()
  quizData.payment_period = currentPeriod.value
  isSubmitting.value = true
  submitQuizData((ok, status) => {
    isSubmitting.value = false
    if (ok) {
      clearStoredAnswers()
      window.alert('Thank you! Your submission has been received.')
    } else {
      window.alert('Submission failed (status ' + status + '). Please try again.')
    }
  })
}
</script>

<template>
  <div>
    <div class="pay-timer-top">
      <div class="pay-timer-label">20% DISCOUNT JUST FOR YOU!</div>
      <div class="pay-timer-digits">
        <span class="pay-t-block"><span class="pay-t-num">{{ hours }}</span><span class="pay-t-lbl">hrs</span></span>
        <span class="pay-t-sep">:</span>
        <span class="pay-t-block"><span class="pay-t-num">{{ minutes }}</span><span class="pay-t-lbl">min</span></span>
        <span class="pay-t-sep">:</span>
        <span class="pay-t-block"><span class="pay-t-num">{{ seconds }}</span><span class="pay-t-lbl">sec</span></span>
      </div>
    </div>

    <div class="pay-period-toggle">
      <button class="pay-period-btn" :class="{ active: currentPeriod === '1_month' }" @click="selectPeriod('1_month')">1 Month</button>
      <button class="pay-period-btn" :class="{ active: currentPeriod === '1_year' }" @click="selectPeriod('1_year')">1 Year <span class="pay-period-save">-10%</span></button>
      <button class="pay-period-btn" :class="{ active: currentPeriod === '3_years' }" @click="selectPeriod('3_years')">3 Years <span class="pay-period-save">-20%</span></button>
    </div>

    <div v-show="summary.saved > 0" class="pay-savings-hero">
      <div class="pay-savings-amount">${{ summary.saved.toLocaleString() }}</div>
      <div class="pay-savings-text">YOU JUST SAVED</div>
    </div>

    <div class="discount-summary">
      <div class="discount-row"><span>{{ summary.planName }} plan — {{ summary.periodLabel }}</span><span>${{ summary.fullPrice.toLocaleString() }}</span></div>
      <div class="discount-row"><span>Urgency discount (20%)</span><span class="saved">-${{ summary.urgencyAmount.toLocaleString() }}</span></div>
      <div v-if="summary.referralAmount > 0" class="discount-row"><span>Referral code (10%)</span><span class="saved">-${{ summary.referralAmount.toLocaleString() }}</span></div>
      <div v-if="summary.periodAmount > 0" class="discount-row"><span>{{ summary.periodLabel }} discount ({{ summary.periodDiscount }}%)</span><span class="saved">-${{ summary.periodAmount.toLocaleString() }}</span></div>
      <div class="discount-row total"><span>Total</span><span>${{ summary.total.toLocaleString() }}</span></div>
    </div>

    <div class="payment-icons">
      <svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#1434CB" /><text x="19" y="15" font-size="9" fill="#fff" text-anchor="middle" font-weight="bold" font-family="Arial">VISA</text></svg>
      <svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#252525" /><circle cx="15" cy="12" r="7" fill="#EB001B" /><circle cx="23" cy="12" r="7" fill="#F79E1B" /><path d="M19 6.5a7 7 0 010 11 7 7 0 010-11z" fill="#FF5F00" /></svg>
      <svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#003087" /><text x="19" y="15" font-size="7" fill="#fff" text-anchor="middle" font-weight="bold" font-family="Arial">PayPal</text></svg>
    </div>

    <div class="payment-buttons">
      <button class="btn btn-paypal" :disabled="isSubmitting" @click="pay('paypal')">
        <img class="btn-icon-paypal" :src="paypalIcon" alt="" width="24" height="24"> {{ isSubmitting ? 'Submitting…' : 'Pay with PayPal' }}
      </button>
      <button class="btn btn-primary" :disabled="isSubmitting" @click="pay('card')">
        <img class="btn-icon-card" :src="cardIcon" alt="" width="24" height="24"> {{ isSubmitting ? 'Submitting…' : 'Pay with Card' }}
      </button>
    </div>

    <h3 class="faq-heading">Frequently Asked Questions</h3>
    <div class="faq-list">
      <div v-for="(item, index) in FAQ_ITEMS" :key="index" class="faq-item" :class="{ open: openFaq.has(index) }">
        <div class="faq-question" @click="toggleFaq(index)">{{ item.q }}</div>
        <div class="faq-answer"><div class="faq-answer-inner">{{ item.a }}</div></div>
      </div>
    </div>
  </div>
</template>
