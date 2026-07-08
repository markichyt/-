<script>
import QuizIcon from '../QuizIcon.vue'
import QuizActionBar from '../QuizActionBar.vue'
import QuizContinueButton from '../QuizContinueButton.vue'
import { quizData } from '../../store/quizDataStore.js'
import { goToNextStep } from '../../store/quizProgressStore.js'
import { slideOptionsMixin } from './slideOptionsMixin.js'

export default {
  name: 'RadioSlide',
  mixins: [slideOptionsMixin],
  components: { QuizIcon, QuizActionBar, QuizContinueButton },
  props: {
    slide: { type: Object, required: true }
  },
  data() {
    return {
      quizData,
      selectedValue: quizData[this.slide.field]
    }
  },
  computed: {
    // Пояснення під питанням «бажаний спосіб» — залежить від обраного варіанта.
    disclaimer() {
      if (this.slide.field !== 'preferred_way' || !this.selectedValue) return ''
      return this.$t('slides.preferred_way.disclaimer.' + this.selectedValue)
    }
  },
  methods: {
    goToNextStep,
    selectOption(option) {
      this.selectedValue = option.v
      quizData[this.slide.field] = option.v
      // Перехід відбувається лише після натискання «Далі» (без авто-переходу).
    }
  }
}
</script>

<template>
  <div class="radio-slide">
    <div class="option-list">
      <div
        v-for="option in resolvedOptions"
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
        <span class="option-text">{{ optLabel(option) }}</span>
        <span class="option-check" />
      </div>
    </div>

    <div v-if="slide.field === 'preferred_way'" class="pref-disclaimer">{{ disclaimer }}</div>

    <QuizActionBar>
      <QuizContinueButton :disabled="!selectedValue" @continue="goToNextStep" />
    </QuizActionBar>
  </div>
</template>
