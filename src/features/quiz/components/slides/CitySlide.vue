<script>
import QuizIcon from '../QuizIcon.vue'
import QuizActionBar from '../QuizActionBar.vue'
import QuizContinueButton from '../QuizContinueButton.vue'
import { ukraineCities } from '../../data/ukraineCities.js'
import { quizData } from '../../store/quizDataStore.js'
import { goToNextStep } from '../../store/quizProgressStore.js'

export default {
  name: 'CitySlide',
  components: { QuizIcon, QuizActionBar, QuizContinueButton },
  props: {
    slide: { type: Object, required: true }
  },
  data() {
    return {
      cityQuery: quizData[this.slide.field] || ''
    }
  },
  computed: {
    matchedCities() {
      const query = this.cityQuery.toLowerCase().trim()
      if (!query) return ukraineCities
      return ukraineCities.filter((city) => city.toLowerCase().indexOf(query) > -1)
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.$refs.searchInput) this.$refs.searchInput.focus()
    }, 500)
  },
  methods: {
    pickCity(city) {
      // Обираємо місто без авто-переходу — далі лише після натискання «Далі».
      this.cityQuery = city
      quizData[this.slide.field] = city
    },
    confirmTypedCity() {
      quizData[this.slide.field] = this.cityQuery.trim()
      goToNextStep()
    }
  }
}
</script>

<template>
  <div class="city-slide">
    <div class="svc-search-wrap">
      <span class="svc-search-icon"><QuizIcon name="search" /></span>
      <input
        ref="searchInput"
        v-model="cityQuery"
        type="text"
        class="card-input search-input svc-search-input"
        placeholder="Почніть вводити назву міста"
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
        Немає збігів — натисніть «Далі», щоб використати введене.
      </div>
      <div
        v-for="city in matchedCities"
        :key="city"
        class="city-option"
        :class="{ 'city-selected': cityQuery === city }"
        style="padding:12px 16px;cursor:pointer;border-bottom:1px solid var(--border);font-size:15px;transition:background 0.15s"
        @click="pickCity(city)"
      >
        {{ city }}
      </div>
    </div>

    <QuizActionBar>
      <QuizContinueButton @continue="confirmTypedCity" />
    </QuizActionBar>
  </div>
</template>

<style scoped>
.city-option:hover {
  background: var(--input-bg);
}
.city-option.city-selected {
  background: rgba(0, 180, 216, 0.1);
  color: var(--accent);
  font-weight: 600;
}
</style>
