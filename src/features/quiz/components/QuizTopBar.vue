<script>
import { quizProgress, totalSteps } from '../store/quizProgressStore.js'

// Верхня панель: лічильник «КРОК n / N» + смуга прогресу за номером кроку
// (рівномірно на кожному слайді, збігається з лічильником).
export default {
  name: 'QuizTopBar',
  data() {
    return { totalSteps }
  },
  computed: {
    displayStep() {
      return Math.max(1, quizProgress.currentStep)
    },
    progressPercent() {
      return Math.round((this.displayStep / totalSteps) * 100)
    }
  }
}
</script>

<template>
  <div class="top-bar">
    <span class="back-link visible" style="cursor:default;pointer-events:none">{{ $t('topbar.step', { n: displayStep, total: totalSteps }) }}</span>
    <div class="global-scale">
      <div class="global-scale-bar">
        <div class="global-scale-fill" :style="{ width: progressPercent + '%' }" />
      </div>
    </div>
    <span class="global-scale-pct">{{ progressPercent }}%</span>
  </div>
</template>
