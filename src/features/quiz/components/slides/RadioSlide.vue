<script setup>
import { ref } from 'vue'
import QuizIcon from '../QuizIcon.vue'
import { useQuizData } from '../../composables/useQuizData.js'
import { useQuizProgress } from '../../composables/useQuizProgress.js'

const props = defineProps({
  slide: { type: Object, required: true }
})

const { quizData } = useQuizData()
const { goToNextStep } = useQuizProgress()

const selectedValue = ref(quizData[props.slide.field])

// Short explanatory note shown under the "preferred way" question.
const PREFERRED_WAY_DISCLAIMERS = {
  social_media: 'Automation: We help you create/manage social media automatically, content that builds trust and attracts customers.',
  paid_ads: 'Our AI ads should be an enhancer — we improve what you do.',
  both: 'Great choice! We’ll combine both paid and organic approaches for maximum results.',
  ai_decide: 'You said trust? Great. AI will pick the best strategy for your business context and bring results.'
}

const disclaimer = ref(
  props.slide.field === 'preferred_way' ? (PREFERRED_WAY_DISCLAIMERS[selectedValue.value] || '') : ''
)

function selectOption(option) {
  selectedValue.value = option.v
  quizData[props.slide.field] = option.v
  if (props.slide.field === 'preferred_way') {
    disclaimer.value = PREFERRED_WAY_DISCLAIMERS[option.v] || ''
  }
  // Brief pause lets the selection animation play before swiping forward.
  setTimeout(goToNextStep, 500)
}
</script>

<template>
  <div class="option-list">
    <div
      v-for="option in slide.options"
      :key="option.v"
      class="option-item"
      :class="{ selected: selectedValue === option.v }"
      role="button"
      tabindex="0"
      :aria-pressed="selectedValue === option.v"
      @click="selectOption(option)"
      @keydown.enter.prevent="selectOption(option)"
      @keydown.space.prevent="selectOption(option)"
    >
      <span v-if="option.icon" class="opt-icon" :style="{ background: option.color || '#64748b' }">
        <QuizIcon :name="option.icon" />
      </span>
      <span class="option-text">{{ option.t }}</span>
      <span class="option-radio" />
    </div>
  </div>

  <div v-if="slide.field === 'preferred_way'" class="pref-disclaimer">{{ disclaimer }}</div>
</template>
