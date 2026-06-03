<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuizData } from '../../../composables/useQuizData.js'
import { useProfileScore } from '../../../composables/useProfileScore.js'

// "Your estimated pipeline value" — turns the profile-completeness score into a
// Low/Normal/Moderate/High level, with the scale marker easing to the score.
const { quizData } = useQuizData()
const { profileScore } = useProfileScore()

const PROFESSION_LABELS = { attorney: 'Attorney', lawyer: 'Lawyer', patent_attorney: 'Patent Attorney', cpa: 'CPA', notary: 'Notary', tax_specialist: 'Tax Specialist', other: 'Specialist' }

const score = profileScore.value

const level = computed(() => (score >= 75 ? 'High' : score >= 50 ? 'Moderate' : score >= 30 ? 'Normal' : 'Low'))
const levelColor = computed(() => (score >= 75 ? '#10b981' : score >= 50 ? '#3b82f6' : score >= 30 ? '#f59e0b' : '#ef4444'))

const professionLabel = computed(() => PROFESSION_LABELS[quizData.profession || 'other'] || quizData.profession)
const location = computed(() => quizData.city || quizData.zip || '')
const serviceText = computed(() => {
  const names = (quizData.services || []).slice(0, 3).map((service) => service.replace(/_/g, ' '))
  return names.length > 0 ? names.join(', ') : 'General'
})
const adBudgetText = computed(() => (quizData.ad_budget ? ' (' + quizData.ad_budget.replace(/_/g, ' ') + ')' : ''))
const periodText = computed(() => (quizData.period ? ' (' + quizData.period.replace(/_/g, ' ') + ')' : ''))

const markerLeft = ref('10%')
onMounted(() => {
  setTimeout(() => { markerLeft.value = score + '%' }, 600)
})
</script>

<template>
  <div>
    <div class="potential-scale">
      <div class="scale-bar">
        <div class="scale-marker" :style="{ left: markerLeft }" />
      </div>
      <div class="scale-labels">
        <span>Low</span><span>Normal</span><span>Moderate</span><span>High</span>
      </div>
    </div>

    <div class="highlight-card" style="margin-top:16px">
      <span class="badge" :style="{ fontSize: '14px', padding: '6px 16px', background: levelColor + '22', color: levelColor }">
        Your level: <strong>{{ level }}</strong> ({{ score }}%)
      </span>
    </div>

    <div class="fine-print" style="margin-top:12px">
      <strong>Calculated for:</strong> {{ professionLabel }}<template v-if="location">, {{ location }}</template>, {{ serviceText }}.<br>
      Factors: ad budget{{ adBudgetText }}, cooperation period{{ periodText }}, desired goals.<br>
      <em>Estimates only — actual results may vary. Not a guarantee of income.</em>
    </div>
  </div>
</template>
