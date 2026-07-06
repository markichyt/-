<script>
import QuizIcon from '../QuizIcon.vue'
import QuizActionBar from '../QuizActionBar.vue'
import QuizContinueButton from '../QuizContinueButton.vue'
import { quizData } from '../../store/quizDataStore.js'
import { goToNextStep } from '../../store/quizProgressStore.js'

export default {
  name: 'CheckboxSlide',
  components: { QuizIcon, QuizActionBar, QuizContinueButton },
  props: {
    slide: { type: Object, required: true }
  },
  data() {
    // Поле може прийти масивом (checkbox) або рядком (старе значення зі storage).
    const stored = quizData[this.slide.field]
    return {
      selectedValues: Array.isArray(stored) ? [...stored] : (stored ? [stored] : [])
    }
  },
  computed: {
    selectedCount() {
      return this.selectedValues.length
    }
  },
  methods: {
    goToNextStep,
    toggleOption(option) {
      const isSelected = this.selectedValues.indexOf(option.v) > -1
      if (option.exclusive) {
        // Ексклюзивний варіант (напр. «У мене немає команди») — або лише він, або нічого.
        this.selectedValues = isSelected ? [] : [option.v]
      } else {
        // Звичайний варіант: спершу знімаємо будь-які ексклюзивні, потім перемикаємо.
        const exclusiveValues = (this.slide.options || []).filter((o) => o.exclusive).map((o) => o.v)
        const next = this.selectedValues.filter((v) => exclusiveValues.indexOf(v) === -1)
        const index = next.indexOf(option.v)
        if (index > -1) next.splice(index, 1)
        else next.push(option.v)
        this.selectedValues = next
      }
      quizData[this.slide.field] = [...this.selectedValues]
    }
  }
}
</script>

<template>
  <div class="checkbox-slide">
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
        <template v-if="selectedCount > 0"><span class="count">{{ selectedCount }}</span> обрано</template>
        <template v-else>Оберіть один або більше</template>
      </div>
      <QuizContinueButton :disabled="(slide.skip || slide.requireSelection) && selectedCount === 0" @continue="goToNextStep" />
    </QuizActionBar>
  </div>
</template>
