<script setup>
import { computed } from 'vue'
import { useQuizProgress } from '../composables/useQuizProgress.js'
import { useProfileScore } from '../composables/useProfileScore.js'

// Top bar: a "STEP n / N" counter (intentionally not a back button) plus the
// live profile-completeness scale.
const { currentStep, totalSteps } = useQuizProgress()
const { profileScore } = useProfileScore()

const displayStep = computed(() => Math.max(1, currentStep.value))
</script>

<template>
  <div class="top-bar">
    <span class="back-link visible" style="cursor:default;pointer-events:none">STEP {{ displayStep }} / {{ totalSteps }}</span>
    <div class="global-scale">
      <div class="global-scale-bar">
        <div class="global-scale-fill" :style="{ width: profileScore + '%' }" />
      </div>
    </div>
    <span class="global-scale-pct">{{ profileScore }}%</span>
  </div>
</template>
