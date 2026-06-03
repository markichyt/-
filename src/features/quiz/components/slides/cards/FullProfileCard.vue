<script setup>
import { ref, computed } from 'vue'
import QuizActionBar from '../../QuizActionBar.vue'
import QuizContinueButton from '../../QuizContinueButton.vue'
import { useQuizData } from '../../../composables/useQuizData.js'
import { useQuizProgress } from '../../../composables/useQuizProgress.js'

// "Complete your profile" — the user writes a long bio and/or uploads a CV so
// the AI can build their public profile. A strength meter rewards detail, and a
// warning modal intercepts attempts to skip with neither bio nor CV.
const MIN_CHARS = 3000

const { quizData } = useQuizData()
const { goToNextStep } = useQuizProgress()

const aboutText = ref(quizData.about || '')
const showSkipModal = ref(false)

const aboutCount = computed(() => aboutText.value.length)

const strength = computed(() => {
  const aboutScore = Math.min(aboutText.value.trim().length / MIN_CHARS, 1) * 50
  const cvScore = quizData.cv_name ? 30 : 0
  const logoScore = quizData.company_logo_name ? 10 : 0
  const referralScore = quizData.referral_code && quizData.referral_code.length > 0 ? 10 : 0
  return Math.round(aboutScore + cvScore + logoScore + referralScore)
})

const strengthLevel = computed(() => (strength.value >= 70 ? 'high' : strength.value >= 40 ? 'mid' : 'low'))
const strengthHint = computed(() => {
  if (strengthLevel.value === 'high') return '✓ Strong profile — AI will produce excellent results'
  if (strengthLevel.value === 'mid') return 'Good start — add more details to maximize AI quality'
  return 'Add details below — the more you share, the stronger your AI profile'
})

function onAboutInput() {
  quizData.about = aboutText.value
}

function onCvPicked(event) {
  const file = event.target.files[0]
  if (file) quizData.cv_name = file.name
}

function onLogoPicked(event) {
  const file = event.target.files[0]
  if (file) quizData.company_logo_name = file.name
}

function proceed() {
  const hasAbout = aboutText.value.trim().length >= MIN_CHARS
  const hasCV = !!quizData.cv_name
  quizData.profile_method = hasAbout && hasCV ? 'about_and_cv'
    : hasAbout ? 'about'
      : hasCV ? 'cv_only'
        : 'skipped'
  goToNextStep()
}

function onContinue() {
  const hasAbout = aboutText.value.trim().length >= MIN_CHARS
  const hasCV = !!quizData.cv_name
  if (!hasAbout && !hasCV) {
    showSkipModal.value = true
    return
  }
  proceed()
}

function confirmSkip() {
  showSkipModal.value = false
  proceed()
}
</script>

<template>
  <div class="fp-card">
    <div class="fp-progress">
      <div class="fp-progress-row">
        <span class="fp-progress-label">Profile strength</span>
        <span class="fp-progress-pct">{{ strength }}%</span>
      </div>
      <div class="fp-progress-bar">
        <div class="fp-progress-fill" :class="strengthLevel" :style="{ width: strength + '%' }" />
      </div>
      <div class="fp-progress-hint" :class="strengthLevel">{{ strengthHint }}</div>
    </div>

    <div class="fp-pane">
      <label class="form-label">About yourself <span class="fp-min-hint">3000+ characters recommended</span></label>
      <textarea
        v-model="aboutText"
        class="card-input"
        rows="10"
        placeholder="Tell us about your experience, education, achievements, notable cases, certifications, awards…"
        @input="onAboutInput"
      />
      <div class="fp-counter"><span>{{ aboutCount }}</span> / {{ MIN_CHARS }}</div>
    </div>

    <div class="fp-cv-cta">
      <div class="fp-cv-cta-title">📄 Got a CV? Upload it — boosts your profile strength by 30%</div>
      <div class="fp-cv-cta-body">Our AI generates your public profile <strong>directly from your CV in English</strong>. Full experience, education, certifications, notable cases and achievements are extracted automatically. <em>Optional, but strongly recommended.</em></div>
    </div>

    <div class="fp-pane">
      <label class="form-label">Upload your CV <span class="fp-min-hint">optional · .pdf / .doc / .docx</span></label>
      <div class="upload-area" :class="{ uploaded: !!quizData.cv_name }" @click="$event.currentTarget.querySelector('input').click()">
        <div class="upload-text">{{ quizData.cv_name || 'Click to choose .pdf / .doc / .docx' }}</div>
        <input type="file" accept=".pdf,.doc,.docx" style="display:none" @click.stop @change="onCvPicked">
      </div>
    </div>

    <div class="fp-pane">
      <label class="form-label">Company logo <span class="fp-min-hint">optional · PNG / JPG / SVG</span></label>
      <div class="upload-area" :class="{ uploaded: !!quizData.company_logo_name }" @click="$event.currentTarget.querySelector('input').click()">
        <div class="upload-text">{{ quizData.company_logo_name || 'Click to choose an image' }}</div>
        <input type="file" accept="image/*" style="display:none" @click.stop @change="onLogoPicked">
      </div>
    </div>

    <div class="fp-pane">
      <label class="form-label">Referral code <span class="fp-min-hint">optional</span></label>
      <input v-model="quizData.referral_code" type="text" class="card-input" placeholder="Enter your referral code">
    </div>
  </div>

  <div class="fp-skip-modal" :class="{ open: showSkipModal }" :hidden="!showSkipModal">
    <div class="fp-skip-modal-overlay" @click="showSkipModal = false" />
    <div class="fp-skip-modal-card">
      <div class="fp-skip-modal-icon">⚠️</div>
      <div class="fp-skip-modal-title">Hold on — your profile will be too weak</div>
      <div class="fp-skip-modal-body">Without a <strong>bio</strong> or a <strong>CV</strong>, our AI cannot build a competitive profile for you. Lawyers who skip this step receive <strong>significantly fewer client inquiries</strong> on ConsultantLM.<br><br>This takes 2 minutes and dramatically improves your results.</div>
      <div class="fp-skip-modal-actions">
        <button type="button" class="fp-skip-back" @click="showSkipModal = false">← Go back and fill it in</button>
        <button type="button" class="fp-skip-confirm" @click="confirmSkip">Skip anyway</button>
      </div>
    </div>
  </div>

  <QuizActionBar>
    <QuizContinueButton @continue="onContinue" />
  </QuizActionBar>
</template>
