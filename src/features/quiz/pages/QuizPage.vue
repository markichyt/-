<script>
import QuizTopBar from '../components/QuizTopBar.vue'
import QuizCardStack from '../components/QuizCardStack.vue'
import QuizScenePrewarmer from '../components/QuizScenePrewarmer.vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import { publicAsset } from '../data/publicAsset.js'
import { quizData, saveQuizData } from '../store/quizDataStore.js'

// Top-level container for the Консультант quiz funnel. Composes the top bar,
// brand logo, the animated card deck and the hidden scene pre-warmer, and
// persists answers to localStorage whenever they change.
export default {
  name: 'QuizPage',
  components: { QuizTopBar, QuizCardStack, QuizScenePrewarmer, LanguageSwitcher },
  computed: {
    // Українська версія — свій логотип; решта локалей — англійський бренд.
    logoSrc() {
      const file = this.$i18n.locale === 'uk' ? 'logo_uk.svg' : 'logo_en.svg'
      return publicAsset('images/logo/' + file)
    }
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

    <LanguageSwitcher />

    <QuizCardStack />
    <QuizScenePrewarmer />
  </div>
</template>
