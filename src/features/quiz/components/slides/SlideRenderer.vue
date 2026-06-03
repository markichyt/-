<script setup>
import { computed } from 'vue'
import { quizSlides } from '../../data/quizSlides.js'
import { videoSceneSources } from '../../data/videoScenes.js'
import { useQuizProgress } from '../../composables/useQuizProgress.js'

import QuizActionBar from '../QuizActionBar.vue'
import QuizContinueButton from '../QuizContinueButton.vue'
import RadioSlide from './RadioSlide.vue'
import CheckboxSlide from './CheckboxSlide.vue'
import CitySlide from './CitySlide.vue'
import FormWithFilesSlide from './FormWithFilesSlide.vue'
import VideoSceneCard from './cards/VideoSceneCard.vue'
import AiPotentialCard from './cards/AiPotentialCard.vue'
import TenxCard from './cards/TenxCard.vue'
import AssessmentCard from './cards/AssessmentCard.vue'
import WowRoiCard from './cards/WowRoiCard.vue'
import FullProfileCard from './cards/FullProfileCard.vue'
import ProfilesPricingCard from './cards/ProfilesPricingCard.vue'
import PaymentCard from './cards/PaymentCard.vue'

// Resolves the slide at `stepIndex` and renders the matching component. The
// `active` flag is true only for the visible card in the deck and gates media
// playback (iframe scenes, avatar video).
const props = defineProps({
  stepIndex: { type: Number, required: true },
  active: { type: Boolean, default: false }
})

const { goToNextStep } = useQuizProgress()

const slide = computed(() => quizSlides[props.stepIndex - 1])

const INPUT_COMPONENTS = {
  radio: RadioSlide,
  checkbox: CheckboxSlide,
  city: CitySlide,
  formWithFiles: FormWithFilesSlide
}
const CARD_COMPONENTS = {
  aiCalc: AiPotentialCard,
  tenx: TenxCard,
  assessment: AssessmentCard,
  wowRoi: WowRoiCard,
  fullProfile: FullProfileCard
}
// Card steps that show only static/computed content + a generic Continue button.
const SIMPLE_CARD_IDS = ['videoProof', 'aiCalc', 'tenx', 'video1', 'video2', 'videoAds', 'videoSocials', 'assessment']

const isVideoScene = computed(() => slide.value.type === 'card' && slide.value.id in videoSceneSources)
const cardComponent = computed(() => CARD_COMPONENTS[slide.value.id])
const inputComponent = computed(() => INPUT_COMPONENTS[slide.value.type])
const needsGenericContinue = computed(() => SIMPLE_CARD_IDS.includes(slide.value.id))
</script>

<template>
  <!-- Card steps scroll inside a dedicated wrapper, matching the original layout. -->
  <div v-if="slide.type === 'card'" class="card-scroll">
    <div class="card-question" v-html="slide.q" />
    <div class="card-sub" v-html="slide.sub" />

    <VideoSceneCard v-if="isVideoScene" :scene-id="slide.id" :active="active" />
    <ProfilesPricingCard v-else-if="slide.id === 'profilesPricing'" :active="active" />
    <PaymentCard v-else-if="slide.id === 'payment'" />
    <component :is="cardComponent" v-else />

    <QuizActionBar v-if="needsGenericContinue">
      <QuizContinueButton @continue="goToNextStep" />
    </QuizActionBar>
  </div>

  <!-- Input steps (radio / checkbox / city / intro form). -->
  <template v-else>
    <div class="card-question" v-html="slide.q" />
    <div class="card-sub" v-html="slide.sub" />
    <component :is="inputComponent" :slide="slide" />
  </template>
</template>
