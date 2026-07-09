<script>
import { quizData } from '../../../store/quizDataStore.js'
import { calculateProfileScore } from '../../../utils/profileScore.js'

// «Наскільки готовий ваш профіль» — бал повноти профілю → рівень
// Низький/Нормальний/Помірний/Високий; маркер плавно їде до значення.
// Підписи професій/послуг беруться зі спільних i18n-ключів слайдів.
export default {
  name: 'AssessmentCard',
  data() {
    return { markerLeft: '10%' }
  },
  computed: {
    score() {
      return calculateProfileScore(quizData)
    },
    level() {
      const s = this.score
      return s >= 75 ? 'high' : s >= 50 ? 'mid' : s >= 30 ? 'normal' : 'low'
    },
    levelColor() {
      const s = this.score
      return s >= 75 ? '#10b981' : s >= 50 ? '#3b82f6' : s >= 30 ? '#f59e0b' : '#ef4444'
    },
    professionLabel() {
      const list = Array.isArray(quizData.profession)
        ? quizData.profession
        : (quizData.profession ? [quizData.profession] : [])
      return list.length
        ? list.map((p) => this.label('slides.profession.opt.' + p, p)).join(', ')
        : this.$t('cards.assessment.professionFallback')
    },
    location() {
      return quizData.city || quizData.zip || ''
    },
    serviceText() {
      const names = (quizData.services || []).slice(0, 3).map((s) => this.label('slides.services.opt.' + s, String(s).replace(/_/g, ' ')))
      return names.length > 0 ? names.join(', ') : this.$t('cards.assessment.serviceFallback')
    },
    adBudgetText() {
      return quizData.ad_budget ? ' (' + this.$t('cards.assessment.adBudget.' + quizData.ad_budget) + ')' : ''
    },
    periodText() {
      return quizData.period ? ' (' + this.$t('cards.assessment.period.' + quizData.period) + ')' : ''
    }
  },
  mounted() {
    setTimeout(() => { this.markerLeft = this.score + '%' }, 600)
  },
  methods: {
    label(key, fallback) {
      return this.$te(key) ? this.$t(key) : fallback
    }
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
        <span>{{ $t('cards.assessment.levels.low') }}</span><span>{{ $t('cards.assessment.levels.normal') }}</span><span>{{ $t('cards.assessment.levels.mid') }}</span><span>{{ $t('cards.assessment.levels.high') }}</span>
      </div>
    </div>

    <div class="highlight-card" style="margin-top:16px">
      <span class="badge" :style="{ fontSize: '14px', padding: '6px 16px', background: levelColor + '22', color: levelColor }">
        {{ $t('cards.assessment.yourLevel') }} <strong>{{ $t('cards.assessment.levels.' + level) }}</strong> ({{ score }}%)
      </span>
    </div>

    <div class="fine-print" style="margin-top:12px">
      <strong>{{ $t('cards.assessment.calculatedFor') }}</strong> {{ professionLabel }}<template v-if="location">, {{ location }}</template>, {{ serviceText }}.<br>
      {{ $t('cards.assessment.factors', { adBudget: adBudgetText, period: periodText }) }}<br>
      <em>{{ $t('cards.assessment.disclaimer') }}</em>
    </div>
  </div>
</template>
