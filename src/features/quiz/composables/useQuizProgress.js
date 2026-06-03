import { ref, computed } from 'vue'
import { TOTAL_STEPS } from '../data/quizSlides.js'

// Drives which step is visible and in which direction the deck animates.
// Forward navigation is the only path wired to the UI (radio auto-advance and
// the Continue buttons); back navigation exists for completeness — the top-bar
// "STEP n / N" counter is intentionally not a back button.
const currentStep = ref(1)
const stepHistory = ref([])
const lastDirection = ref('right')

const isLastStep = computed(() => currentStep.value >= TOTAL_STEPS)

function goToNextStep() {
  if (currentStep.value >= TOTAL_STEPS) return
  stepHistory.value.push(currentStep.value)
  lastDirection.value = 'right'
  currentStep.value += 1
}

function goToPreviousStep() {
  if (stepHistory.value.length === 0) return
  lastDirection.value = 'left'
  currentStep.value = stepHistory.value.pop()
}

export function useQuizProgress() {
  return {
    currentStep,
    lastDirection,
    totalSteps: TOTAL_STEPS,
    isLastStep,
    goToNextStep,
    goToPreviousStep
  }
}
