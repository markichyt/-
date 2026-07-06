<script>
import QuizActionBar from '../../QuizActionBar.vue'
import QuizContinueButton from '../../QuizContinueButton.vue'
import { quizData } from '../../../store/quizDataStore.js'
import { goToNextStep } from '../../../store/quizProgressStore.js'

// "Complete your profile" — the user writes a long bio and/or uploads a CV so
// the AI can build their public profile. A strength meter rewards detail, and a
// warning modal intercepts attempts to skip with neither bio nor CV.
const MIN_CHARS = 3000

export default {
  name: 'FullProfileCard',
  components: { QuizActionBar, QuizContinueButton },
  data() {
    return {
      quizData,
      MIN_CHARS,
      aboutText: quizData.about || '',
      showSkipModal: false
    }
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
      if (this.strengthLevel === 'high') return '✓ Сильний профіль — AI дасть чудовий результат'
      if (this.strengthLevel === 'mid') return 'Гарний початок — додайте більше деталей для кращої якості AI'
      return 'Додайте деталі нижче — що більше інформації, то сильніший ваш AI-профіль'
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
      goToNextStep()
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
        <span class="fp-progress-label">Сила профілю</span>
        <span class="fp-progress-pct">{{ strength }}%</span>
      </div>
      <div class="fp-progress-bar">
        <div class="fp-progress-fill" :class="strengthLevel" :style="{ width: strength + '%' }" />
      </div>
      <div class="fp-progress-hint" :class="strengthLevel">{{ strengthHint }}</div>
    </div>

    <div class="fp-pane">
      <label class="form-label">Про себе <span class="fp-min-hint">рекомендовано 3000+ символів</span></label>
      <textarea
        v-model="aboutText"
        class="card-input"
        rows="10"
        placeholder="Розкажіть про свій досвід, освіту, досягнення, відомі справи, сертифікати, нагороди…"
        @input="onAboutInput"
      />
      <div class="fp-counter"><span>{{ aboutCount }}</span> / {{ MIN_CHARS }}</div>
    </div>

    <div class="fp-cv-cta">
      <div class="fp-cv-cta-title">📄 Маєте резюме? Завантажте — це підвищує силу профілю на 30%</div>
      <div class="fp-cv-cta-body">Наш AI згенерує ваш публічний профіль <strong>прямо з вашого резюме</strong>. Досвід, освіта, сертифікати, відомі справи й досягнення витягуються автоматично. <em>Необов'язково, але дуже рекомендовано.</em></div>
    </div>

    <div class="fp-pane">
      <label class="form-label">Завантажте резюме <span class="fp-min-hint">необов'язково · .pdf / .doc / .docx</span></label>
      <div class="upload-area" :class="{ uploaded: !!quizData.cv_name }" @click="$event.currentTarget.querySelector('input').click()">
        <div class="upload-text">{{ quizData.cv_name || 'Натисніть, щоб обрати .pdf / .doc / .docx' }}</div>
        <input type="file" accept=".pdf,.doc,.docx" style="display:none" @click.stop @change="onCvPicked">
      </div>
    </div>

    <div class="fp-pane">
      <label class="form-label">Логотип компанії <span class="fp-min-hint">необов'язково · PNG / JPG / SVG</span></label>
      <div class="upload-area" :class="{ uploaded: !!quizData.company_logo_name }" @click="$event.currentTarget.querySelector('input').click()">
        <div class="upload-text">{{ quizData.company_logo_name || 'Натисніть, щоб обрати зображення' }}</div>
        <input type="file" accept="image/*" style="display:none" @click.stop @change="onLogoPicked">
      </div>
    </div>

    <div class="fp-pane">
      <label class="form-label">Реферальний код <span class="fp-min-hint">необов'язково</span></label>
      <input v-model="quizData.referral_code" type="text" class="card-input" placeholder="Введіть реферальний код">
    </div>
  </div>

  <div class="fp-skip-modal" :class="{ open: showSkipModal }" :hidden="!showSkipModal">
    <div class="fp-skip-modal-overlay" @click="showSkipModal = false" />
    <div class="fp-skip-modal-card">
      <div class="fp-skip-modal-icon">⚠️</div>
      <div class="fp-skip-modal-title">Зачекайте — ваш профіль буде надто слабким</div>
      <div class="fp-skip-modal-body">Без <strong>біо</strong> чи <strong>резюме</strong> наш AI не зможе скласти конкурентний профіль. Юристи, які пропускають цей крок, отримують <strong>значно менше запитів від клієнтів</strong> на Консультант.<br><br>Це займе 2 хвилини й суттєво покращить ваш результат.</div>
      <div class="fp-skip-modal-actions">
        <button type="button" class="fp-skip-back" @click="showSkipModal = false">← Повернутися і заповнити</button>
        <button type="button" class="fp-skip-confirm" @click="confirmSkip">Все одно пропустити</button>
      </div>
    </div>
  </div>

  <QuizActionBar>
    <QuizContinueButton @continue="onContinue" />
  </QuizActionBar>
  </div>
</template>
