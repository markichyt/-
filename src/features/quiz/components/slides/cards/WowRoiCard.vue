<script>
import QuizActionBar from '../../QuizActionBar.vue'
import QuizContinueButton from '../../QuizContinueButton.vue'
import { quizData } from '../../../store/quizDataStore.js'
import { goToNextStep } from '../../../store/quizProgressStore.js'

// «Познайомтесь зі своїм майбутнім на Консультант» — персональний профіль +
// інтерактивний калькулятор ліди → клієнти → дохід (оновлюється під час руху повзунка).
// Числа адаптовані під ринок України, ₴.
const INQUIRY_COST_AVG = 400 // ₴ за лід
const CONVERSION = 1 / 6 // ~17% — 1 платний клієнт на 6 лідів
// Дохід з одного клієнта (єдиний для всіх тарифів), ₴.
const CLIENT_VALUE_LOW = 5000
const CLIENT_VALUE_HIGH = 100000

const PLANS = {
  base: { name: 'Base', sub: 399, maxInq: 6, defaultInq: 3, unlimited: false, clientLow: CLIENT_VALUE_LOW, clientHigh: CLIENT_VALUE_HIGH },
  pro: { name: 'Pro', sub: 1599, maxInq: 30, defaultInq: 15, unlimited: false, clientLow: CLIENT_VALUE_LOW, clientHigh: CLIENT_VALUE_HIGH },
  premium: { name: 'Premium', sub: 3999, maxInq: 100, defaultInq: 50, unlimited: true, clientLow: CLIENT_VALUE_LOW, clientHigh: CLIENT_VALUE_HIGH }
}
const RATINGS = { base: '52.18', pro: '67.59', premium: '88.42' }
const PROFESSION_LABELS = {
  medicine: 'Медицина', ecology: 'Екологічний консалтинг', scanner: 'Сканер', auto: 'Авто',
  business: 'Бізнес', war: 'Військове право', documents: 'Документи', debt_collect: 'Стягнення боргів',
  criminal: 'Кримінальне право', migration: 'Міграція', real_estate: 'Нерухомість', work: 'Трудове право',
  social: 'Соціальні питання', family: 'Сімейне право', debtor_protection: 'Захист боржника', general: 'Загальна практика'
}
const fmt = (n) => n.toLocaleString('uk-UA')

export default {
  name: 'WowRoiCard',
  components: { QuizActionBar, QuizContinueButton },
  data() {
    const currentPlan = quizData.plan || 'pro'
    quizData.plan = currentPlan
    return {
      quizData,
      PLANS,
      RATINGS,
      currentPlan,
      inquiries: PLANS[currentPlan].defaultInq
    }
  },
  computed: {
    plan() {
      return PLANS[this.currentPlan]
    },
    displayName() {
      return (quizData.first_name || 'Ви') + (quizData.last_name ? ' ' + quizData.last_name : '')
    },
    displayProfession() {
      // profession може бути масивом (checkbox) або рядком (старе значення).
      const list = Array.isArray(quizData.profession)
        ? quizData.profession
        : (quizData.profession ? [quizData.profession] : [])
      return list.length ? list.map((p) => PROFESSION_LABELS[p] || p).join(', ') : 'Спеціаліст'
    },
    displayCity() {
      return quizData.city || 'Україна'
    },
    roi() {
      const p = this.plan
      const n = this.inquiries

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
        ? '0 ₴'
        : fmt(revLow) + ' – ' + fmt(revHigh) + ' ₴'
      const netText = clientsAvg === 0
        ? '−' + fmt(inqCost + subCost) + ' ₴/міс'
        : fmt(netLow) + ' – ' + fmt(netHigh) + ' ₴/міс'

      return {
        inquiryLabel,
        clientsLabel,
        revenueText,
        inquiryCostText: '−' + fmt(inqCost) + ' ₴',
        subText: '−' + fmt(subCost) + ' ₴/міс',
        netText,
        showPayback: revLow > 0,
        maxHint: p.unlimited ? '(безліміт)' : '(з ' + p.maxInq + ' включених)',
        costPerLeadText: fmt(INQUIRY_COST_AVG),
        clientsLow: clientsLow,
        revLow: revLow
      }
    }
  },
  watch: {
    // Дзеркалимо реалістичні (не «теоретичний максимум») числа у сховище відповідей.
    roi: {
      handler(value) {
        quizData.desired_clients = value.clientsLow
        quizData.desired_revenue = value.revLow
      },
      immediate: true
    }
  },
  methods: {
    goToNextStep,
    switchPlan(planId) {
      this.currentPlan = planId
      quizData.plan = planId
      this.inquiries = PLANS[planId].defaultInq
    }
  }
}
</script>

<template>
  <div class="wow-roi-card">
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
          <img v-if="quizData.photo_data" :src="quizData.photo_data" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block">
          <div v-else class="wow-profile-photo-placeholder">📷</div>
        </div>
        <div class="wow-profile-info">
          <div class="wow-profile-name">{{ displayName }}</div>
          <div class="wow-profile-role">{{ displayProfession }}</div>
          <div class="wow-profile-city"><span class="loc-pin">📍</span> {{ displayCity }}</div>
        </div>
      </div>
    </div>

    <div class="roi-calc">
      <div class="roi-calc-label">📈 Ваша орієнтовна цінність воронки</div>
      <div class="roi-slider-row">
        <span class="roi-slider-label">Доступно лідів на місяць: <strong>{{ roi.inquiryLabel }}</strong> <span class="roi-max-hint">{{ roi.maxHint }}</span></span>
        <input v-model.number="inquiries" type="range" min="0" :max="plan.maxInq" step="1" class="roi-slider">
      </div>
      <div class="roi-table">
        <div class="roi-row roi-highlight"><span>Очікувана кількість клієнтів:</span><span>{{ roi.clientsLabel }}</span></div>
        <div class="roi-row"><span>Потенційний дохід від нових клієнтів:</span><span>{{ roi.revenueText }}</span></div>
        <div class="roi-expenses-label">Ваші витрати</div>
        <div class="roi-row roi-minus"><span>Купівля лідів (<span style="color:#1a1a2e">{{ roi.inquiryLabel }}</span> × {{ roi.costPerLeadText }} ₴):</span><span>{{ roi.inquiryCostText }}</span></div>
        <div class="roi-row roi-minus"><span>Підписка</span><span>{{ roi.subText }}</span></div>
        <div class="roi-row roi-total"><span style="white-space:nowrap">Орієнтовний чистий прибуток:</span><span style="text-align:right">{{ roi.netText }}</span></div>
      </div>
      <div v-show="roi.showPayback" class="roi-payback">Період окупності: <strong>~ 1 день</strong></div>
      <div class="roi-disclaimer"><strong>Ліди — це ще не клієнти і не оплачені справи.</strong> Реалістична конверсія: ~1 з 6 лідів стає платною справою. Результат залежить від швидкості відповіді, роботи з запитами, цін і відповідності спеціалізації. Лише оцінка — минулі результати не гарантують майбутніх.</div>
    </div>
  </div>

  <QuizActionBar>
    <QuizContinueButton @continue="goToNextStep" />
  </QuizActionBar>
  </div>
</template>
