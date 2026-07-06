<script>
import { quizSlides } from '../../data/quizSlides.js'
import { videoSceneSources } from '../../data/videoScenes.js'
import { goToNextStep } from '../../store/quizProgressStore.js'

import QuizActionBar from '../QuizActionBar.vue'
import QuizContinueButton from '../QuizContinueButton.vue'
import RadioSlide from './RadioSlide.vue'
import CheckboxSlide from './CheckboxSlide.vue'
import CitySlide from './CitySlide.vue'
import FormWithFilesSlide from './FormWithFilesSlide.vue'
import VideoSceneCard from './cards/VideoSceneCard.vue'
import PhotoUploadCard from './cards/PhotoUploadCard.vue'
import AiPotentialCard from './cards/AiPotentialCard.vue'
import AssessmentCard from './cards/AssessmentCard.vue'
import WowRoiCard from './cards/WowRoiCard.vue'
import FullProfileCard from './cards/FullProfileCard.vue'
import ProfilesPricingCard from './cards/ProfilesPricingCard.vue'
import PaymentCard from './cards/PaymentCard.vue'

const INPUT_COMPONENTS = {
  radio: RadioSlide,
  checkbox: CheckboxSlide,
  city: CitySlide,
  formWithFiles: FormWithFilesSlide
}
const CARD_COMPONENTS = {
  photoUpload: PhotoUploadCard,
  aiCalc: AiPotentialCard,
  assessment: AssessmentCard,
  wowRoi: WowRoiCard,
  fullProfile: FullProfileCard
}
// Card steps that show only static/computed content + a generic Continue button.
const SIMPLE_CARD_IDS = ['videoProof', 'aiCalc', 'video1', 'video2', 'videoAds', 'videoSocials', 'assessment']

// Resolves the slide at `stepIndex` and renders the matching component. The
// `active` flag is true only for the visible card in the deck and gates media
// playback (iframe scenes, avatar video).
export default {
  name: 'SlideRenderer',
  components: { QuizActionBar, QuizContinueButton, ProfilesPricingCard, PaymentCard, VideoSceneCard },
  props: {
    stepIndex: { type: Number, required: true },
    active: { type: Boolean, default: false }
  },
  computed: {
    slide() {
      return quizSlides[this.stepIndex - 1]
    },
    isCard() {
      return this.slide.type === 'card'
    },
    isVideoScene() {
      return this.isCard && this.slide.id in videoSceneSources
    },
    isProfilesPricing() {
      return this.slide.id === 'profilesPricing'
    },
    isPayment() {
      return this.slide.id === 'payment'
    },
    cardComponent() {
      return CARD_COMPONENTS[this.slide.id]
    },
    inputComponent() {
      return INPUT_COMPONENTS[this.slide.type]
    },
    needsGenericContinue() {
      return SIMPLE_CARD_IDS.includes(this.slide.id)
    }
  },
  methods: {
    goToNextStep
  }
}
</script>

<template>
  <!-- Card steps scroll inside a .card-scroll wrapper; input steps use a plain
       wrapper so every component still has a single Vue 2 root. -->
  <div class="slide-frame" :class="{ 'card-scroll': isCard }">
    <div class="card-question" v-html="slide.q" />
    <div class="card-sub" v-html="slide.sub" />

    <template v-if="isCard">
      <VideoSceneCard v-if="isVideoScene" :scene-id="slide.id" :active="active" />
      <ProfilesPricingCard v-else-if="isProfilesPricing" :active="active" />
      <PaymentCard v-else-if="isPayment" />
      <component :is="cardComponent" v-else />

      <QuizActionBar v-if="needsGenericContinue">
        <QuizContinueButton @continue="goToNextStep" />
      </QuizActionBar>
    </template>

    <component v-else :is="inputComponent" :slide="slide" />
  </div>
</template>
