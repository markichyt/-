<script>
import QuizActionBar from '../../QuizActionBar.vue'
import QuizContinueButton from '../../QuizContinueButton.vue'
import { quizData, submitQuizData, clearStoredAnswers } from '../../../store/quizDataStore.js'

// «Заповніть свій профіль» — довге біо та/або резюме для AI. Лічильник сили
// винагороджує деталізацію, а модалка попереджає про спробу пропустити крок.
const MIN_CHARS = 3000

export default {
  name: 'FullProfileCard',
  components: { QuizActionBar, QuizContinueButton },
  data() {
    return { quizData, MIN_CHARS, aboutText: quizData.about || '', showSkipModal: false, isSubmitting: false }
  },
  computed: {
    aboutCount() {
      return this.aboutText.length
    },
    strength() {
      const aboutScore = Math.min(this.aboutText.trim().length / MIN_CHARS, 1) * 50
      const cvScore = quizData.cv_name ? 30 : 0
      const logoScore = quizData.company_logo_name ? 10 : 0
      const referralScore = quizData.referral_code && quizData.referral_code.length > 0 ? 10 : 0
      return Math.round(aboutScore + cvScore + logoScore + referralScore)
    },
    strengthLevel() {
      return this.strength >= 70 ? 'high' : this.strength >= 40 ? 'mid' : 'low'
    },
    strengthHint() {
      return this.$t('cards.fullProfile.strengthHint.' + this.strengthLevel)
    }
  },
  methods: {
    onAboutInput() {
      quizData.about = this.aboutText
    },
    onCvPicked(event) {
      const file = event.target.files[0]
      if (file) quizData.cv_name = file.name
    },
    onLogoPicked(event) {
      const file = event.target.files[0]
      if (file) quizData.company_logo_name = file.name
    },
    proceed() {
      const hasAbout = this.aboutText.trim().length >= MIN_CHARS
      const hasCV = !!quizData.cv_name
      quizData.profile_method = hasAbout && hasCV ? 'about_and_cv'
        : hasAbout ? 'about'
          : hasCV ? 'cv_only'
            : 'skipped'
      // Фінальний крок воронки (після оплати) — надсилаємо все й показуємо подяку.
      quizData.submitted_at = new Date().toISOString()
      this.isSubmitting = true
      submitQuizData((ok, status) => {
        this.isSubmitting = false
        if (ok) {
          clearStoredAnswers()
          window.alert(this.$t('cards.payment.alertSuccess'))
        } else {
          window.alert(this.$t('cards.payment.alertError', { status }))
        }
      })
    },
    onContinue() {
      const hasAbout = this.aboutText.trim().length >= MIN_CHARS
      const hasCV = !!quizData.cv_name
      if (!hasAbout && !hasCV) {
        this.showSkipModal = true
        return
      }
      this.proceed()
    },
    confirmSkip() {
      this.showSkipModal = false
      this.proceed()
    }
  }
}
</script>

<template>
  <div class="full-profile-card">
  <div class="fp-card">
    <div class="fp-progress">
      <div class="fp-progress-row">
        <span class="fp-progress-label">{{ $t('cards.fullProfile.strengthLabel') }}</span>
        <span class="fp-progress-pct">{{ strength }}%</span>
      </div>
      <div class="fp-progress-bar">
        <div class="fp-progress-fill" :class="strengthLevel" :style="{ width: strength + '%' }" />
      </div>
      <div class="fp-progress-hint" :class="strengthLevel">{{ strengthHint }}</div>
    </div>

    <div class="fp-pane">
      <label class="form-label">{{ $t('cards.fullProfile.aboutLabel') }} <span class="fp-min-hint">{{ $t('cards.fullProfile.aboutHint') }}</span></label>
      <textarea
        v-model="aboutText"
        class="card-input"
        rows="10"
        :placeholder="$t('cards.fullProfile.aboutPh')"
        @input="onAboutInput"
      />
      <div class="fp-counter"><span>{{ aboutCount }}</span> / {{ MIN_CHARS }}</div>
    </div>

    <div class="fp-cv-cta">
      <div class="fp-cv-cta-title">{{ $t('cards.fullProfile.cvCtaTitle') }}</div>
      <div class="fp-cv-cta-body" v-html="$t('cards.fullProfile.cvCtaBody')" />
    </div>

    <div class="fp-pane">
      <label class="form-label">{{ $t('cards.fullProfile.cvLabel') }} <span class="fp-min-hint">{{ $t('cards.fullProfile.cvHint') }}</span></label>
      <div class="upload-area" :class="{ uploaded: !!quizData.cv_name }" @click="$event.currentTarget.querySelector('input').click()">
        <div class="upload-text">{{ quizData.cv_name || $t('cards.fullProfile.cvPlaceholder') }}</div>
        <input type="file" accept=".pdf,.doc,.docx" style="display:none" @click.stop @change="onCvPicked">
      </div>
    </div>

    <div class="fp-pane">
      <label class="form-label">{{ $t('cards.fullProfile.logoLabel') }} <span class="fp-min-hint">{{ $t('cards.fullProfile.logoHint') }}</span></label>
      <div class="upload-area" :class="{ uploaded: !!quizData.company_logo_name }" @click="$event.currentTarget.querySelector('input').click()">
        <div class="upload-text">{{ quizData.company_logo_name || $t('cards.fullProfile.logoPlaceholder') }}</div>
        <input type="file" accept="image/*" style="display:none" @click.stop @change="onLogoPicked">
      </div>
    </div>

    <div class="fp-pane">
      <label class="form-label">{{ $t('cards.fullProfile.referralLabel') }} <span class="fp-min-hint">{{ $t('cards.fullProfile.optional') }}</span></label>
      <input v-model="quizData.referral_code" type="text" class="card-input" :placeholder="$t('cards.fullProfile.referralPh')">
    </div>
  </div>

  <div class="fp-skip-modal" :class="{ open: showSkipModal }" :hidden="!showSkipModal">
    <div class="fp-skip-modal-overlay" @click="showSkipModal = false" />
    <div class="fp-skip-modal-card">
      <div class="fp-skip-modal-icon">⚠️</div>
      <div class="fp-skip-modal-title">{{ $t('cards.fullProfile.skipModal.title') }}</div>
      <div class="fp-skip-modal-body" v-html="$t('cards.fullProfile.skipModal.body')" />
      <div class="fp-skip-modal-actions">
        <button type="button" class="fp-skip-back" @click="showSkipModal = false">{{ $t('cards.fullProfile.skipModal.back') }}</button>
        <button type="button" class="fp-skip-confirm" @click="confirmSkip">{{ $t('cards.fullProfile.skipModal.confirm') }}</button>
      </div>
    </div>
  </div>

  <QuizActionBar>
    <QuizContinueButton :label="$t('cards.fullProfile.finish')" :disabled="isSubmitting" @continue="onContinue" />
  </QuizActionBar>
  </div>
</template>
