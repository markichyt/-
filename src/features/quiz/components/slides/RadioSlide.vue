<script>
import QuizIcon from '../QuizIcon.vue'
import QuizActionBar from '../QuizActionBar.vue'
import QuizContinueButton from '../QuizContinueButton.vue'
import { quizData } from '../../store/quizDataStore.js'
import { goToNextStep } from '../../store/quizProgressStore.js'

// Short explanatory note shown under the "preferred way" question.
const PREFERRED_WAY_DISCLAIMERS = {
  social_media: 'Автоматизація: ми допомагаємо створювати й вести соцмережі автоматично — контент, що формує довіру й залучає клієнтів.',
  paid_ads: 'Наша AI-реклама — це підсилювач: ми покращуємо те, що ви вже робите.',
  both: 'Чудовий вибір! Поєднаємо платний та органічний підходи для максимального результату.',
  ai_decide: 'Довіряєте? Чудово. AI обере найкращу стратегію під ваш бізнес і принесе результат.'
}

export default {
  name: 'RadioSlide',
  components: { QuizIcon, QuizActionBar, QuizContinueButton },
  props: {
    slide: { type: Object, required: true }
  },
  data() {
    const selectedValue = quizData[this.slide.field]
    return {
      quizData,
      selectedValue,
      disclaimer: this.slide.field === 'preferred_way' ? (PREFERRED_WAY_DISCLAIMERS[selectedValue] || '') : ''
    }
  },
  methods: {
    goToNextStep,
    selectOption(option) {
      this.selectedValue = option.v
      quizData[this.slide.field] = option.v
      if (this.slide.field === 'preferred_way') {
        this.disclaimer = PREFERRED_WAY_DISCLAIMERS[option.v] || ''
      }
      // Перехід відбувається лише після натискання «Далі» (без авто-переходу).
    }
  }
}
</script>

<template>
  <div class="radio-slide">
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
        <span class="option-check" />
      </div>
    </div>

    <div v-if="slide.field === 'preferred_way'" class="pref-disclaimer">{{ disclaimer }}</div>

    <QuizActionBar>
      <QuizContinueButton :disabled="!selectedValue" @continue="goToNextStep" />
    </QuizActionBar>
  </div>
</template>
