<script>
import { quizData, submitQuizData, clearStoredAnswers } from '../../../store/quizDataStore.js'
import { countdownTimerMixin } from '../../../mixins/countdownTimerMixin.js'
import { publicAsset } from '../../../data/publicAsset.js'

const PLAN_NAMES = { base: 'Base', pro: 'Pro', premium: 'Premium' }
// Якірні (до знижки) місячні ціни, ₴.
const FULL_MONTHLY = { base: 599, pro: 2299, premium: 5999 }
const PERIODS = {
  '1_month': { label: '1 місяць', discount: 0, months: 1 },
  '1_year': { label: '1 рік', discount: 10, months: 12 }
}
const FAQ_ITEMS = [
  { q: 'Скільки клієнтів я можу отримувати на місяць?', a: 'Залежно від спеціалізації, міста й оптимізації профілю — багато юристів отримують 5–15 клієнтів вже в перший місяць, з часом масштабуючись до 20–30+ завдяки AI-контенту та SEO-просуванню.' },
  { q: 'Це гарантована кількість клієнтів?', a: 'Ми надаємо вам ліди, з якими ви працюєте самостійно. Також можна працювати на ексклюзивних умовах із клієнтами платформи — у такому разі це вже оплачені клієнти.' },
  { q: 'Як працює оплата?', a: 'У нас три тарифи: Base, Pro і Premium. Вартість значно нижча за традиційні маркетингові агенції. Багато юристів окуповують підписку вже 1–2 клієнтами.' },
  { q: 'А якщо клієнтів не буде?', a: 'Наявність лідів залежить від вашої активності на платформі. Ми гарантуємо безперебійний доступ до платформи та її ресурсів. Оплата не повертається після надання доступу.' },
  { q: 'Чи безпечні мої дані?', a: 'Так, ми використовуємо захищений месенджер, шифрування даних і не передаємо інформацію третім сторонам. Платформа відповідає вимогам захисту персональних даних (GDPR і законодавство України).' }
]
const fmt = (n) => n.toLocaleString('uk-UA')

// «Завершіть покупку» — вибір періоду, живий розрахунок знижок, кнопки оплати
// (фінальне надсилання) та FAQ-акордеон.
export default {
  name: 'PaymentCard',
  mixins: [countdownTimerMixin],
  data() {
    return {
      quizData,
      FAQ_ITEMS,
      paypalIcon: publicAsset('icon/paypal.svg'),
      cardIcon: publicAsset('icon/card-credit.svg'),
      currentPeriod: quizData.period || '1_year',
      openFaq: new Set(),
      isSubmitting: false
    }
  },
  computed: {
    summary() {
      const period = PERIODS[this.currentPeriod]
      const planKey = this.quizData.plan || 'pro'
      const fullPrice = FULL_MONTHLY[planKey] * period.months

      const urgencyAmount = Math.round(fullPrice * 0.2)
      const referralAmount = this.quizData.referral_code ? Math.round(fullPrice * 0.1) : 0
      const periodAmount = period.discount > 0 ? Math.round((fullPrice * period.discount) / 100) : 0
      const totalDiscount = urgencyAmount + referralAmount + periodAmount
      const total = Math.max(0, fullPrice - totalDiscount)
      const saved = fullPrice - total

      return {
        planName: PLAN_NAMES[planKey],
        periodLabel: period.label,
        periodDiscount: period.discount,
        fullPrice: fmt(fullPrice),
        urgencyAmount: fmt(urgencyAmount),
        referralAmount,
        referralAmountText: fmt(referralAmount),
        periodAmount,
        periodAmountText: fmt(periodAmount),
        total: fmt(total),
        saved,
        savedText: fmt(saved)
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
      this.quizData.submitted_at = new Date().toISOString()
      this.quizData.payment_period = this.currentPeriod
      this.isSubmitting = true
      submitQuizData((ok, status) => {
        this.isSubmitting = false
        if (ok) {
          clearStoredAnswers()
          window.alert('Дякуємо! Вашу заявку отримано.')
        } else {
          window.alert('Помилка надсилання (статус ' + status + '). Спробуйте ще раз.')
        }
      })
    }
  }
}
</script>

<template>
  <div>
    <div class="pay-timer-top">
      <div class="pay-timer-label">ЗНИЖКА 20% ТІЛЬКИ ДЛЯ ВАС!</div>
      <div class="pay-timer-digits">
        <span class="pay-t-block"><span class="pay-t-num">{{ countdownHours }}</span><span class="pay-t-lbl">год</span></span>
        <span class="pay-t-sep">:</span>
        <span class="pay-t-block"><span class="pay-t-num">{{ countdownMinutes }}</span><span class="pay-t-lbl">хв</span></span>
        <span class="pay-t-sep">:</span>
        <span class="pay-t-block"><span class="pay-t-num">{{ countdownSeconds }}</span><span class="pay-t-lbl">сек</span></span>
      </div>
    </div>

    <div class="pay-period-toggle">
      <button class="pay-period-btn" :class="{ active: currentPeriod === '1_month' }" @click="selectPeriod('1_month')">1 місяць</button>
      <button class="pay-period-btn" :class="{ active: currentPeriod === '1_year' }" @click="selectPeriod('1_year')">1 рік <span class="pay-period-save">-10%</span></button>
    </div>

    <div v-show="summary.saved > 0" class="pay-savings-hero">
      <div class="pay-savings-amount">{{ summary.savedText }} ₴</div>
      <div class="pay-savings-text">ВИ ЩОЙНО ЗЕКОНОМИЛИ</div>
    </div>

    <div class="discount-summary">
      <div class="discount-row"><span>Тариф {{ summary.planName }} — {{ summary.periodLabel }}</span><span>{{ summary.fullPrice }} ₴</span></div>
      <div class="discount-row"><span>Знижка за терміновість (20%)</span><span class="saved">-{{ summary.urgencyAmount }} ₴</span></div>
      <div v-if="summary.referralAmount > 0" class="discount-row"><span>Реферальний код (10%)</span><span class="saved">-{{ summary.referralAmountText }} ₴</span></div>
      <div v-if="summary.periodAmount > 0" class="discount-row"><span>Знижка {{ summary.periodLabel }} ({{ summary.periodDiscount }}%)</span><span class="saved">-{{ summary.periodAmountText }} ₴</span></div>
      <div class="discount-row total"><span>Разом</span><span>{{ summary.total }} ₴</span></div>
    </div>

    <div class="payment-icons">
      <svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#1434CB" /><text x="19" y="15" font-size="9" fill="#fff" text-anchor="middle" font-weight="bold" font-family="Arial">VISA</text></svg>
      <svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#252525" /><circle cx="15" cy="12" r="7" fill="#EB001B" /><circle cx="23" cy="12" r="7" fill="#F79E1B" /><path d="M19 6.5a7 7 0 010 11 7 7 0 010-11z" fill="#FF5F00" /></svg>
      <svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#003087" /><text x="19" y="15" font-size="7" fill="#fff" text-anchor="middle" font-weight="bold" font-family="Arial">PayPal</text></svg>
    </div>

    <div class="payment-buttons">
      <button class="btn btn-paypal" :disabled="isSubmitting" @click="pay('paypal')">
        <span v-if="isSubmitting" class="btn-spinner" />
        <img v-else class="btn-icon-paypal" :src="paypalIcon" alt="" width="24" height="24"> {{ isSubmitting ? 'Надсилання…' : 'Оплатити через PayPal' }}
      </button>
      <button class="btn btn-primary" :disabled="isSubmitting" @click="pay('card')">
        <span v-if="isSubmitting" class="btn-spinner" />
        <img v-else class="btn-icon-card" :src="cardIcon" alt="" width="24" height="24"> {{ isSubmitting ? 'Надсилання…' : 'Оплатити карткою' }}
      </button>
    </div>

    <h3 class="faq-heading">Часті запитання</h3>
    <div class="faq-list">
      <div v-for="(item, index) in FAQ_ITEMS" :key="index" class="faq-item" :class="{ open: openFaq.has(index) }">
        <div class="faq-question" @click="toggleFaq(index)">{{ item.q }}</div>
        <div class="faq-answer"><div class="faq-answer-inner">{{ item.a }}</div></div>
      </div>
    </div>
  </div>
</template>
