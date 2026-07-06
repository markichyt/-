<script>
import SlideRenderer from './slides/SlideRenderer.vue'
import { quizProgress, totalSteps, lockNavigation, unlockNavigation } from '../store/quizProgressStore.js'

// Recreates the original stacked-card deck: three physical cards are recycled
// between the active / behind-1 / behind-2 positions. The next step is rendered
// into the behind-1 card ahead of time so the forward swipe reveals it instantly.
//
// Vue 2 cannot detect writes to an array by index, so slotStep/slotClass are
// always updated through this.$set.
const SWIPE_SETTLE_MS = 420

export default {
  name: 'QuizCardStack',
  components: { SlideRenderer },
  data() {
    return {
      // Which step (1-based) each of the three card slots currently holds.
      slotStep: [quizProgress.currentStep, null, null],
      // The stack class driving each slot's transform/opacity.
      slotClass: ['active', 'behind-1', 'behind-2'],
      activeSlot: 0
    }
  },
  computed: {
    currentStep() {
      return quizProgress.currentStep
    }
  },
  watch: {
    currentStep(newStep, oldStep) {
      const direction = newStep > oldStep ? 'right' : 'left'
      // Going back is not pre-rendered, so place the target into the incoming card first.
      if (direction === 'left') {
        const behind1 = (this.activeSlot + 1) % 3
        this.$set(this.slotStep, behind1, newStep)
      }
      this.swipeAndRender(direction)
    }
  },
  mounted() {
    this.preRenderNextStep()
  },
  methods: {
    preRenderNextStep() {
      const behind1 = (this.activeSlot + 1) % 3
      this.$set(this.slotStep, behind1, this.currentStep < totalSteps ? this.currentStep + 1 : null)
    },
    swipeAndRender(direction) {
      const exitClass = direction === 'right' ? 'exit-right' : 'exit-left'
      const exitingSlot = this.activeSlot
      const behind1 = (this.activeSlot + 1) % 3
      const behind2 = (this.activeSlot + 2) % 3

      // Заблокувати навігацію, поки картка не доїде — інакше швидкі кліки
      // накладають свайпи й деку «заклинює».
      lockNavigation()

      this.$set(this.slotClass, exitingSlot, exitClass)
      this.$set(this.slotClass, behind1, 'active')
      this.$set(this.slotClass, behind2, 'behind-1')

      setTimeout(() => {
        this.$set(this.slotClass, exitingSlot, 'behind-2')
        this.activeSlot = behind1
        this.preRenderNextStep()
        unlockNavigation()
      }, SWIPE_SETTLE_MS)
    }
  }
}
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
