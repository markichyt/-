<script>
import QuizTopBar from '../components/QuizTopBar.vue'
import QuizCardStack from '../components/QuizCardStack.vue'
import QuizScenePrewarmer from '../components/QuizScenePrewarmer.vue'
import { publicAsset } from '../data/publicAsset.js'
import { quizData, saveQuizData } from '../store/quizDataStore.js'

// Top-level container for the Консультант quiz funnel. Composes the top bar,
// brand logo, the animated card deck and the hidden scene pre-warmer, and
// persists answers to localStorage whenever they change.
export default {
  name: 'QuizPage',
  components: { QuizTopBar, QuizCardStack, QuizScenePrewarmer },
  data() {
    return { logoSrc: publicAsset('images/logo/logo_en.svg') }
  },
  mounted() {
    this._unwatchAnswers = this.$watch(() => quizData, saveQuizData, { deep: true })
  },
  beforeDestroy() {
    if (this._unwatchAnswers) this._unwatchAnswers()
  }
}
</script>

<template>
  <div class="quiz-wrapper">
    <QuizTopBar />

    <div class="logo-area">
      <img :src="logoSrc" alt="Консультант" class="logo">
    </div>

    <QuizCardStack />
    <QuizScenePrewarmer />
  </div>
</template>
