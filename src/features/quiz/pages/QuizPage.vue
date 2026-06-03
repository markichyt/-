<script setup>
import QuizTopBar from '../components/QuizTopBar.vue'
import QuizCardStack from '../components/QuizCardStack.vue'
import QuizScenePrewarmer from '../components/QuizScenePrewarmer.vue'
import { publicAsset } from '../data/publicAsset.js'

// Top-level container for the ConsultantLM quiz funnel. Composes the top bar,
// brand logo, the animated card deck and the hidden scene pre-warmer.
const LOGO_SRC = publicAsset('images/logo/logo_en.svg')
</script>

<template>
  <div class="quiz-wrapper">
    <QuizTopBar />

    <div class="logo-area">
      <img :src="LOGO_SRC" alt="ConsultantLM" class="logo">
    </div>

    <QuizCardStack />
    <QuizScenePrewarmer />
  </div>
</template>
