<script>
import { quizData } from '../../../store/quizDataStore.js'
import { goToNextStep } from '../../../store/quizProgressStore.js'
import { countdownTimerMixin } from '../../../mixins/countdownTimerMixin.js'
import { publicAsset } from '../../../data/publicAsset.js'
import { market } from '../../../../../i18n/marketConfig.js'
import { formatMoney } from '../../../../../i18n/format.js'

const PLAN_NAMES = { base: 'Base', pro: 'Pro', premium: 'Premium' }
const PERIODS = {
  '1_month': { months: 1 },
  '1_year': { months: 12 }
}
// Семантичні ключі FAQ (тексти — в i18n cards.payment.faq.<key>).
const FAQ_KEYS = ['clients', 'guarantee', 'payment', 'noClients', 'data']

// «Завершіть покупку» — вибір періоду, живий розрахунок знижок, кнопки оплати
// (фінальне надсилання) та FAQ-акордеон. Ціни — з marketConfig (як на картці тарифів).
export default {
  name: 'PaymentCard',
  mixins: [countdownTimerMixin],
  data() {
    return {
      quizData,
      FAQ_KEYS,
      paypalIcon: publicAsset('icon/paypal.svg'),
      cardIcon: publicAsset('icon/card-credit.svg'),
      currentPeriod: PERIODS[quizData.period] ? quizData.period : '1_year',
      openFaq: new Set(),
      isSubmitting: false
    }
  },
  computed: {
    summary() {
      const periodDef = PERIODS[this.currentPeriod] || PERIODS['1_year']
      const isAnnual = this.currentPeriod === '1_year'
      const prices = market(this.$i18n.locale).pricing[isAnnual ? 'annual' : 'monthly']
      const planKey = prices[this.quizData.plan] != null ? this.quizData.plan : 'pro'

      // Реальна сума = ціна обраного плану (як на картці тарифів) × кількість місяців.
      const realTotal = prices[planKey] * periodDef.months
      // «Якірна» ціна: −20% терміновості повертає рівно до реальної суми плану.
      const fullPrice = Math.round(realTotal / 0.8)
      const urgencyAmount = fullPrice - realTotal
      const referralAmount = this.quizData.referral_code ? Math.round(realTotal * 0.1) : 0
      const total = Math.max(0, realTotal - referralAmount)
      const saved = fullPrice - total

      return {
        planName: PLAN_NAMES[planKey],
        periodLabel: this.$t('cards.payment.periods.' + this.currentPeriod),
        fullPrice: formatMoney(fullPrice),
        urgencyAmount: formatMoney(urgencyAmount),
        referralAmount,
        referralAmountText: formatMoney(referralAmount),
        total: formatMoney(total),
        saved,
        savedText: formatMoney(saved)
      }
    }
  },
  methods: {
    selectPeriod(periodKey) {
      this.currentPeriod = periodKey
      this.quizData.payment_period = periodKey
    },
    toggleFaq(index) {
      if (this.openFaq.has(index)) this.openFaq.delete(index)
      else this.openFaq.add(index)
      this.openFaq = new Set(this.openFaq)
    },
    pay(method) {
      this.quizData.payment_method = method
      this.quizData.payment_period = this.currentPeriod
      // Оплата пройшла → фінальний крок воронки: заповнення профілю (там надсилання).
      goToNextStep()
    }
  }
}
</script>

<template>
  <div>
    <div class="pay-timer-top">
      <div class="pay-timer-label">{{ $t('common.discountBanner') }}</div>
      <div class="pay-timer-digits">
        <span class="pay-t-block"><span class="pay-t-num">{{ countdownHours }}</span><span class="pay-t-lbl">{{ $t('common.timer.hours') }}</span></span>
        <span class="pay-t-sep">:</span>
        <span class="pay-t-block"><span class="pay-t-num">{{ countdownMinutes }}</span><span class="pay-t-lbl">{{ $t('common.timer.minutes') }}</span></span>
        <span class="pay-t-sep">:</span>
        <span class="pay-t-block"><span class="pay-t-num">{{ countdownSeconds }}</span><span class="pay-t-lbl">{{ $t('common.timer.seconds') }}</span></span>
      </div>
    </div>

    <div class="pay-period-toggle">
      <button class="pay-period-btn" :class="{ active: currentPeriod === '1_month' }" @click="selectPeriod('1_month')">{{ $t('cards.payment.periods.1_month') }}</button>
      <button class="pay-period-btn" :class="{ active: currentPeriod === '1_year' }" @click="selectPeriod('1_year')">{{ $t('cards.payment.periods.1_year') }} <span class="pay-period-save">{{ $t('cards.payment.saveBadge') }}</span></button>
    </div>

    <div v-show="summary.saved > 0" class="pay-savings-hero">
      <div class="pay-savings-amount">{{ summary.savedText }}</div>
      <div class="pay-savings-text">{{ $t('cards.payment.savedHero') }}</div>
    </div>

    <div class="discount-summary">
      <div class="discount-row"><span>{{ $t('cards.payment.rows.plan', { plan: summary.planName, period: summary.periodLabel }) }}</span><span>{{ summary.fullPrice }}</span></div>
      <div class="discount-row"><span>{{ $t('cards.payment.rows.urgency') }}</span><span class="saved">-{{ summary.urgencyAmount }}</span></div>
      <div v-if="summary.referralAmount > 0" class="discount-row"><span>{{ $t('cards.payment.rows.referral') }}</span><span class="saved">-{{ summary.referralAmountText }}</span></div>
      <div class="discount-row total"><span>{{ $t('cards.payment.rows.total') }}</span><span>{{ summary.total }}</span></div>
    </div>

    <div class="payment-icons">
      <svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#1434CB" /><text x="19" y="15" font-size="9" fill="#fff" text-anchor="middle" font-weight="bold" font-family="Arial">VISA</text></svg>
      <svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#252525" /><circle cx="15" cy="12" r="7" fill="#EB001B" /><circle cx="23" cy="12" r="7" fill="#F79E1B" /><path d="M19 6.5a7 7 0 010 11 7 7 0 010-11z" fill="#FF5F00" /></svg>
      <svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#003087" /><text x="19" y="15" font-size="7" fill="#fff" text-anchor="middle" font-weight="bold" font-family="Arial">PayPal</text></svg>
    </div>

    <div class="payment-buttons">
      <button class="btn btn-paypal" :disabled="isSubmitting" @click="pay('paypal')">
        <span v-if="isSubmitting" class="btn-spinner" />
        <img v-else class="btn-icon-paypal" :src="paypalIcon" alt="" width="24" height="24"> {{ isSubmitting ? $t('cards.payment.sending') : $t('cards.payment.paypal') }}
      </button>
      <button class="btn btn-primary" :disabled="isSubmitting" @click="pay('card')">
        <span v-if="isSubmitting" class="btn-spinner" />
        <img v-else class="btn-icon-card" :src="cardIcon" alt="" width="24" height="24"> {{ isSubmitting ? $t('cards.payment.sending') : $t('cards.payment.card') }}
      </button>
    </div>

    <h3 class="faq-heading">{{ $t('cards.payment.faqHeading') }}</h3>
    <div class="faq-list">
      <div v-for="(key, index) in FAQ_KEYS" :key="key" class="faq-item" :class="{ open: openFaq.has(index) }">
        <div class="faq-question" @click="toggleFaq(index)">{{ $t('cards.payment.faq.' + key + '.q') }}</div>
        <div class="faq-answer"><div class="faq-answer-inner">{{ $t('cards.payment.faq.' + key + '.a') }}</div></div>
      </div>
    </div>
  </div>
</template>
