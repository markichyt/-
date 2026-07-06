import Vue from 'vue'
import { TOTAL_STEPS } from '../data/quizSlides.js'

// Drives which step is visible and the deck animation direction. Forward is the
// only path wired to the UI (radio auto-advance + Continue buttons); back exists
// for completeness — the top-bar "STEP n / N" label is a counter, not a button.
export const quizProgress = Vue.observable({
  currentStep: 1,
  lastDirection: 'right'
})

export const totalSteps = TOTAL_STEPS

const stepHistory = []

// Блокування навігації під час анімації переходу, щоб швидкі/повторні кліки
// не накладались і не «застрягали» (card-stack знімає блок після свайпу).
let navLocked = false
export function lockNavigation() {
  navLocked = true
}
export function unlockNavigation() {
  navLocked = false
}

export function goToNextStep() {
  if (navLocked) return
  if (quizProgress.currentStep >= TOTAL_STEPS) return
  stepHistory.push(quizProgress.currentStep)
  quizProgress.lastDirection = 'right'
  quizProgress.currentStep += 1
}

export function goToPreviousStep() {
  if (navLocked) return
  if (stepHistory.length === 0) return
  quizProgress.lastDirection = 'left'
  quizProgress.currentStep = stepHistory.pop()
}

export function isLastStep() {
  return quizProgress.currentStep >= TOTAL_STEPS
}
