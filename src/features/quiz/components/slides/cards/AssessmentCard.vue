<script>
import { quizData } from '../../../store/quizDataStore.js'
import { calculateProfileScore } from '../../../utils/profileScore.js'

// «Ваша орієнтовна цінність воронки» — перетворює бал повноти профілю на рівень
// Низький/Нормальний/Помірний/Високий; маркер плавно їде до значення.
const PROFESSION_LABELS = {
  lawyer: 'Юрист', attorney: 'Адвокат', accountant: 'Бухгалтер/Аудитор', notary: 'Нотаріус',
  enforcement: 'Приватний виконавець', liquidator: 'Ліквідатор', patent: 'Патентні повірені',
  customs: 'Митний брокер', engineer: 'Інженер', collector: 'Колектор', other: 'Інше'
}
const SERVICE_LABELS = {
  auto: 'Автомобільні спори', corporate: 'Господарське та корпоративне право',
  debt_collection: 'Стягнення заборгованості', migration: 'Міграційне право',
  real_estate: 'Нерухомість та земельне право', labour: 'Трудове право',
  family: 'Сімейне право', inheritance: 'Спадкове право', divorce: 'Розірвання шлюбу',
  social: 'Соціальні виплати та спори', debtor_protection: 'Захист боржника',
  military: 'Військове право', criminal: 'Кримінальне право',
  documents: 'Підготовка та правовий аналіз документів', other: 'Інші юридичні послуги'
}
const AD_BUDGET_LABELS = { none: 'не витрачаю', to_40k: 'до 40 000 ₴', to_400k: '40 000–400 000 ₴', over_400k: 'понад 400 000 ₴' }
const PERIOD_LABELS = { '1_month': '1 місяць', '1_year': '1 рік', '3_years': '3 роки' }

export default {
  name: 'AssessmentCard',
  data() {
    return {
      markerLeft: '10%'
    }
  },
  computed: {
    score() {
      return calculateProfileScore(quizData)
    },
    level() {
      const score = this.score
      return score >= 75 ? 'Високий' : score >= 50 ? 'Помірний' : score >= 30 ? 'Нормальний' : 'Низький'
    },
    levelColor() {
      const score = this.score
      return score >= 75 ? '#10b981' : score >= 50 ? '#3b82f6' : score >= 30 ? '#f59e0b' : '#ef4444'
    },
    professionLabel() {
      const list = Array.isArray(quizData.profession)
        ? quizData.profession
        : (quizData.profession ? [quizData.profession] : [])
      return list.length ? list.map((p) => PROFESSION_LABELS[p] || p).join(', ') : 'Спеціаліст'
    },
    location() {
      return quizData.city || quizData.zip || ''
    },
    serviceText() {
      const names = (quizData.services || []).slice(0, 3).map((service) => SERVICE_LABELS[service] || service.replace(/_/g, ' '))
      return names.length > 0 ? names.join(', ') : 'Загальне'
    },
    adBudgetText() {
      return quizData.ad_budget ? ' (' + (AD_BUDGET_LABELS[quizData.ad_budget] || quizData.ad_budget) + ')' : ''
    },
    periodText() {
      return quizData.period ? ' (' + (PERIOD_LABELS[quizData.period] || quizData.period) + ')' : ''
    }
  },
  mounted() {
    setTimeout(() => { this.markerLeft = this.score + '%' }, 600)
  }
}
</script>

<template>
  <div>
    <div class="potential-scale">
      <div class="scale-bar">
        <div class="scale-marker" :style="{ left: markerLeft }" />
      </div>
      <div class="scale-labels">
        <span>Низький</span><span>Нормальний</span><span>Помірний</span><span>Високий</span>
      </div>
    </div>

    <div class="highlight-card" style="margin-top:16px">
      <span class="badge" :style="{ fontSize: '14px', padding: '6px 16px', background: levelColor + '22', color: levelColor }">
        Ваш рівень: <strong>{{ level }}</strong> ({{ score }}%)
      </span>
    </div>

    <div class="fine-print" style="margin-top:12px">
      <strong>Розраховано для:</strong> {{ professionLabel }}<template v-if="location">, {{ location }}</template>, {{ serviceText }}.<br>
      Фактори: бюджет на рекламу{{ adBudgetText }}, період співпраці{{ periodText }}, бажані цілі.<br>
      <em>Лише оцінка — фактичний результат може відрізнятися. Не є гарантією доходу.</em>
    </div>
  </div>
</template>
