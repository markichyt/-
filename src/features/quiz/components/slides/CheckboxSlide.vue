<script setup>
import { ref, computed } from 'vue'
import QuizIcon from '../QuizIcon.vue'
import QuizActionBar from '../QuizActionBar.vue'
import QuizContinueButton from '../QuizContinueButton.vue'
import { useQuizData } from '../../composables/useQuizData.js'
import { useQuizProgress } from '../../composables/useQuizProgress.js'

const props = defineProps({
  slide: { type: Object, required: true }
})

const { quizData } = useQuizData()
const { goToNextStep } = useQuizProgress()

const selectedValues = ref([...(quizData[props.slide.field] || [])])

const selectedCount = computed(() => selectedValues.value.length)

function toggleOption(option) {
  const index = selectedValues.value.indexOf(option.v)
  if (index > -1) selectedValues.value.splice(index, 1)
  else selectedValues.value.push(option.v)
  quizData[props.slide.field] = [...selectedValues.value]
}
</script>

<template>
  <div class="option-list">
    <div
      v-for="option in slide.options"
      :key="option.v"
      class="option-item"
      :class="{ selected: selectedValues.includes(option.v) }"
      role="button"
      tabindex="0"
      :aria-pressed="selectedValues.includes(option.v)"
      @click="toggleOption(option)"
      @keydown.enter.prevent="toggleOption(option)"
      @keydown.space.prevent="toggleOption(option)"
    >
      <span v-if="option.icon" class="opt-icon" :style="{ background: option.color || '#64748b' }">
        <QuizIcon :name="option.icon" />
      </span>
      <span class="option-text">{{ option.t }}</span>
      <span class="option-check" />
    </div>
  </div>

  <QuizActionBar>
    <div v-if="slide.skip" class="skip-link" role="button" tabindex="0" @click="goToNextStep" @keydown.enter="goToNextStep">
      {{ slide.skip }}
    </div>
    <div class="card-action-info">
      <template v-if="selectedCount > 0"><span class="count">{{ selectedCount }}</span> selected</template>
      <template v-else>Select one or more</template>
    </div>
    <QuizContinueButton @continue="goToNextStep" />
  </QuizActionBar>
</template>
