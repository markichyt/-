<script setup>
import { ref, computed, onMounted } from 'vue'
import QuizIcon from '../QuizIcon.vue'
import QuizActionBar from '../QuizActionBar.vue'
import QuizContinueButton from '../QuizContinueButton.vue'
import { usCities } from '../../data/usCities.js'
import { useQuizData } from '../../composables/useQuizData.js'
import { useQuizProgress } from '../../composables/useQuizProgress.js'

const props = defineProps({
  slide: { type: Object, required: true }
})

const { quizData } = useQuizData()
const { goToNextStep } = useQuizProgress()

const searchInput = ref(null)
const cityQuery = ref(quizData[props.slide.field] || '')

const matchedCities = computed(() => {
  const query = cityQuery.value.toLowerCase().trim()
  if (!query) return usCities
  return usCities.filter((city) => city.toLowerCase().indexOf(query) > -1)
})

function pickCity(city) {
  cityQuery.value = city
  quizData[props.slide.field] = city
  setTimeout(goToNextStep, 200)
}

function confirmTypedCity() {
  quizData[props.slide.field] = cityQuery.value.trim()
  goToNextStep()
}

onMounted(() => {
  setTimeout(() => searchInput.value?.focus(), 500)
})
</script>

<template>
  <div class="svc-search-wrap">
    <span class="svc-search-icon"><QuizIcon name="search" /></span>
    <input
      ref="searchInput"
      v-model="cityQuery"
      type="text"
      class="card-input search-input svc-search-input"
      placeholder="Start typing city name"
      autocomplete="off"
      autocapitalize="off"
      autocorrect="off"
      spellcheck="false"
      name="city-search"
      @keydown.enter="confirmTypedCity"
    >
  </div>

  <div class="city-dropdown" style="max-height:280px;overflow-y:auto;border:1px solid var(--border);border-radius:12px;margin-top:8px">
    <div
      v-if="matchedCities.length === 0"
      style="padding:14px;color:var(--text-light);text-align:center;font-size:14px"
    >
      No match — press Continue to use your input.
    </div>
    <div
      v-for="city in matchedCities"
      :key="city"
      class="city-option"
      style="padding:12px 16px;cursor:pointer;border-bottom:1px solid var(--border);font-size:15px;transition:background 0.15s"
      @click="pickCity(city)"
    >
      {{ city }}
    </div>
  </div>

  <QuizActionBar>
    <QuizContinueButton @continue="confirmTypedCity" />
  </QuizActionBar>
</template>

<style scoped>
.city-option:hover {
  background: var(--input-bg);
}
</style>
