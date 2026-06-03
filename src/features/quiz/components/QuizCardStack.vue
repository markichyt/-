<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import SlideRenderer from './slides/SlideRenderer.vue'
import { useQuizProgress } from '../composables/useQuizProgress.js'

// Recreates the original stacked-card deck: three physical cards are recycled
// between the active / behind-1 / behind-2 positions. The next step is rendered
// into the behind-1 card ahead of time so the forward swipe reveals it instantly.
const { currentStep, totalSteps } = useQuizProgress()

const SWIPE_SETTLE_MS = 420

// Which step (1-based) each of the three card slots currently holds.
const slotStep = reactive([currentStep.value, null, null])
// The stack class driving each slot's transform/opacity.
const slotClass = reactive(['active', 'behind-1', 'behind-2'])
const activeSlot = ref(0)

function preRenderNextStep() {
  const behind1 = (activeSlot.value + 1) % 3
  slotStep[behind1] = currentStep.value < totalSteps ? currentStep.value + 1 : null
}

function swipeAndRender(direction) {
  const exitClass = direction === 'right' ? 'exit-right' : 'exit-left'
  const exitingSlot = activeSlot.value
  const behind1 = (activeSlot.value + 1) % 3
  const behind2 = (activeSlot.value + 2) % 3

  slotClass[exitingSlot] = exitClass
  slotClass[behind1] = 'active'
  slotClass[behind2] = 'behind-1'

  setTimeout(() => {
    slotClass[exitingSlot] = 'behind-2'
    activeSlot.value = behind1
    preRenderNextStep()
  }, SWIPE_SETTLE_MS)
}

watch(currentStep, (newStep, oldStep) => {
  const direction = newStep > oldStep ? 'right' : 'left'
  // Going back is not pre-rendered, so place the target into the incoming card first.
  if (direction === 'left') {
    const behind1 = (activeSlot.value + 1) % 3
    slotStep[behind1] = newStep
  }
  swipeAndRender(direction)
})

onMounted(preRenderNextStep)
</script>

<template>
  <div class="card-stack">
    <div v-for="slotIndex in 3" :key="slotIndex" class="stack-card" :class="slotClass[slotIndex - 1]">
      <div class="card-content">
        <SlideRenderer
          v-if="slotStep[slotIndex - 1]"
          :key="slotStep[slotIndex - 1]"
          :step-index="slotStep[slotIndex - 1]"
          :active="slotClass[slotIndex - 1] === 'active'"
        />
      </div>
    </div>
  </div>
</template>
