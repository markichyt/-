<script>
import { quizData, submitQuizData } from '../../../store/quizDataStore.js'
import { goToNextStep } from '../../../store/quizProgressStore.js'
import { countdownTimerMixin } from '../../../mixins/countdownTimerMixin.js'
import { buildTierFeatures, pricingByBilling } from '../../../data/pricingPlans.js'
import { publicAsset } from '../../../data/publicAsset.js'

const PROFILE_IMAGE = publicAsset('images/profiles/PHOTO3.png')

const PLAN_SLIDES = [
  { tier: 'base', label: 'BASE (Базовий)', rating: '54.42', plan: 'base' },
  { tier: 'pro', label: 'PRO', rating: '67.59', plan: 'pro' },
  { tier: 'premium', label: 'PREMIUM', rating: '76.02', plan: 'premium' }
]
const CTA_CONFIG = [
  { text: 'Обрати Base', cls: 'pp-cta-btn pp-cta-base', plan: 'base' },
  { text: 'Обрати Pro', cls: 'pp-cta-btn pp-cta-pro', plan: 'pro' },
  { text: 'Обрати Premium', cls: 'pp-cta-btn pp-cta-premium', plan: 'premium' }
]
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// "Choose your plan" — profile + pricing carousel (Base / Pro / Premium) with a
// billing toggle, AI-avatar preview, trust block and an enterprise lead form.
export default {
  name: 'ProfilesPricingCard',
  mixins: [countdownTimerMixin],
  props: {
    active: { type: Boolean, default: false }
  },
  data() {
    return {
      quizData,
      PROFILE_IMAGE,
      PLAN_SLIDES,
      CTA_CONFIG,
      avatarVideoSrc: publicAsset('videos/i_avatar.mp4'),
      featuresByTier: {
        base: buildTierFeatures('base'),
        pro: buildTierFeatures('pro'),
        premium: buildTierFeatures('premium')
      },
      currentIndex: 1, // default to Pro
      isAnnual: false,
      isAvatarMuted: false,
      showLeadOverlay: false,
      leadSubmitted: false,
      leadInvalid: false,
      leadSending: false,
      lead: { firm_name: '', company_name: '', team_size: '', firm_location: '', contact_email: '', contact_phone: '', message: '' }
    }
  },
  computed: {
    trackStyle() {
      return { transform: `translateX(${-this.currentIndex * 100}%)` }
    },
    avatarVisible() {
      return this.currentIndex !== 0
    },
    priceFor() {
      return pricingByBilling[this.isAnnual ? 'annual' : 'monthly']
    }
  },
  watch: {
    currentIndex: {
      handler(idx) {
        this.quizData.plan = CTA_CONFIG[idx].plan
        this.updateAvatarPlayback()
      },
      immediate: true
    },
    isAnnual: {
      handler(annual) {
        this.quizData.billing = annual ? 'annual' : 'monthly'
      },
      immediate: true
    },
    active() {
      this.updateAvatarPlayback()
    }
  },
  mounted() {
    this.isAvatarMuted = false
    this.updateAvatarPlayback()
  },
  // Stop the avatar audio when this card goes away (navigation or hot-reload), so
  // a replaced instance can never keep playing in the background.
  beforeDestroy() {
    if (this.$refs.avatarVideo) this.$refs.avatarVideo.pause()
  },
  methods: {
    goTo(idx) {
      if (idx < 0) idx = PLAN_SLIDES.length - 1
      if (idx >= PLAN_SLIDES.length) idx = 0
      this.currentIndex = idx
    },
    updateAvatarPlayback() {
      const video = this.$refs.avatarVideo
      if (!video) return
      // Pause whenever the avatar is hidden (Base tab) or this card is no longer the
      // active slide — e.g. the user advanced to the payment step (slide 24).
      if (!this.avatarVisible || !this.active) {
        video.pause()
        return
      }
      video.muted = this.isAvatarMuted
      video.play().catch(() => {
        video.muted = true
        this.isAvatarMuted = true
        video.play().catch(() => {})
      })
    },
    toggleAvatarSound() {
      const video = this.$refs.avatarVideo
      if (!video) return
      this.isAvatarMuted = !this.isAvatarMuted
      video.muted = this.isAvatarMuted
    },
    selectPlanAndContinue() {
      this.quizData.plan = CTA_CONFIG[this.currentIndex].plan
      goToNextStep()
    },
    openLead() {
      if (!this.lead.contact_email && this.quizData.email) this.lead.contact_email = this.quizData.email
      if (!this.lead.contact_phone && this.quizData.phone) this.lead.contact_phone = this.quizData.phone
      this.showLeadOverlay = true
    },
    closeLead() {
      this.showLeadOverlay = false
    },
    submitLead() {
      const size = parseInt(this.lead.team_size, 10) || 0
      if (!this.lead.firm_name.trim() || !this.lead.company_name.trim() || size < 10 || !EMAIL_PATTERN.test(this.lead.contact_email)) {
        this.leadInvalid = true
        return
      }
      this.leadInvalid = false
      this.quizData.plan = 'enterprise'
      this.quizData.tier = 'enterprise'
      this.quizData.lead_type = 'team_registration'
      this.quizData.firm = {
        name: this.lead.firm_name.trim(),
        company: this.lead.company_name.trim(),
        team_size: size,
        location: this.lead.firm_location.trim(),
        message: this.lead.message.trim()
      }
      if (this.lead.contact_email) this.quizData.email = this.lead.contact_email.trim()
      if (this.lead.contact_phone) this.quizData.phone = this.lead.contact_phone.trim()
      try { localStorage.setItem('clm_enterprise_intent', '1') } catch (e) { /* ignore */ }

      this.leadSending = true
      submitQuizData(() => {
        this.leadSending = false
        this.leadSubmitted = true
      })
    }
  }
}
</script>

<template>
  <div class="profiles-pricing-wrap">
    <div class="pp-timer-bar pp-timer-top">
      <div class="pp-timer-label">ЗНИЖКА 20% ТІЛЬКИ ДЛЯ ВАС!</div>
      <div class="pp-timer-digits">
        <div class="t-block"><span class="num">{{ countdownHours }}</span><span class="lbl">год</span></div>
        <span class="t-sep">:</span>
        <div class="t-block"><span class="num">{{ countdownMinutes }}</span><span class="lbl">хв</span></div>
        <span class="t-sep">:</span>
        <div class="t-block"><span class="num">{{ countdownSeconds }}</span><span class="lbl">сек</span></div>
      </div>
    </div>

    <div class="pp-arrow-rail" aria-hidden="true">
      <button class="pp-arrow pp-arrow--left" aria-label="Попередній план" @click.stop="goTo(currentIndex - 1)">
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <button class="pp-arrow pp-arrow--right" aria-label="Наступний план" @click.stop="goTo(currentIndex + 1)">
        <svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18" /></svg>
      </button>
    </div>

    <div class="pp-viewport">
      <div class="pp-track" :style="trackStyle">
        <div v-for="slide in PLAN_SLIDES" :key="slide.tier" class="pp-slide">
          <div class="prof-card" :class="'prof-' + slide.tier">
            <div class="prof-topbar">
              <span class="tier-label">{{ slide.label }}</span>
              <span class="separator" />
              <span class="rating-area">
                <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>
                <span class="rating-num">{{ slide.rating }}</span>
              </span>
            </div>
            <div class="prof-body">
              <template v-if="slide.tier !== 'premium'">
                <div class="prof-avatar-wrap"><img :src="PROFILE_IMAGE" alt="Адвокат"></div>
                <div class="prof-info">
                  <div class="name">Олександр Коваленко</div>
                  <div class="role">Адвокат</div>
                  <div class="location">
                    <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
                    Україна, Київ
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="prof-info-area">
                  <div class="prof-info">
                    <div class="name">Alexander König</div>
                    <div class="role">Attorney</div>
                    <div class="location">
                      <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
                      Україна, Київ
                    </div>
                  </div>
                </div>
                <div class="prof-photo-right"><img :src="PROFILE_IMAGE" alt="Адвокат"></div>
              </template>
            </div>
            <div class="prof-info-btn">i</div>
          </div>
        </div>
      </div>
    </div>

    <div class="pp-dots">
      <button
        v-for="(slide, idx) in PLAN_SLIDES"
        :key="slide.tier"
        class="pp-dot"
        :class="{ active: currentIndex === idx }"
        :aria-label="slide.plan + ' plan'"
        @click.stop="goTo(idx)"
      />
    </div>

    <div class="pp-avatar-section" :class="{ visible: avatarVisible }">
      <div class="pp-avatar-inner">
        <span class="pp-avatar-label">Перегляд AI-аватара</span>
        <div class="pp-avatar-video-wrap">
          <video ref="avatarVideo" loop playsinline preload="metadata">
            <source :src="avatarVideoSrc" type="video/mp4">
          </video>
          <button class="pp-avatar-sound-btn" :class="{ muted: isAvatarMuted }" title="Toggle sound" @click.stop="toggleAvatarSound">
            {{ isAvatarMuted ? '♪︎' : '♪' }}
          </button>
        </div>
        <div class="pp-avatar-tagline">Ваш AI-аватар говорить за вас 24/7</div>
      </div>
    </div>

    <div class="pp-billing-toggle">
      <span class="toggle-label" :class="{ active: !isAnnual }" @click.stop="isAnnual = false">Щомісяця</span>
      <div class="pp-toggle-track" :class="{ annual: isAnnual }" @click.stop="isAnnual = !isAnnual"><div class="pp-toggle-thumb" /></div>
      <span class="toggle-label" :class="{ active: isAnnual }" @click.stop="isAnnual = true">Щороку</span>
      <span class="pp-save-badge">−10%</span>
    </div>

    <div class="pp-pricing-section">
      <div class="pp-pricing-content" :style="trackStyle">
        <div v-for="slide in PLAN_SLIDES" :key="slide.tier" class="pp-pricing-panel">
          <div class="pp-plan-name" :class="'pp-' + slide.tier + '-name'">{{ slide.plan === 'base' ? 'Base' : slide.plan === 'pro' ? 'Pro' : 'Premium' }}</div>
          <div class="pp-price-row">
            <span class="pp-new-price">{{ priceFor[slide.tier].price }}<span class="period">/міс</span></span>
          </div>
          <div class="pp-billing-note">{{ priceFor[slide.tier].note }}</div>
          <div class="pp-features">
            <div v-for="feature in featuresByTier[slide.tier]" :key="feature.label" class="pp-feat" :class="feature.on ? 'yes' : 'no'">
              <span class="feat-left">
                <span class="icon">{{ feature.on ? '✓' : '✗' }}</span>
                <span>{{ feature.label }}</span>
              </span>
              <span v-if="feature.badge" class="comp-badge" :class="feature.badge.type === 'green' ? 'comp-badge--green' : 'comp-badge--cyan'">{{ feature.badge.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pp-trust-block">
      <div class="pp-trust-title">Створено для українських юристів</div>
      <div class="pp-trust-grid">
        <div class="pp-trust-item">
          <span class="pp-trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18" /><path d="M5 7h14" /><path d="M8 7l-3 7a4 4 0 0 0 6 0z" /><path d="M16 7l-3 7a4 4 0 0 0 6 0z" /><path d="M8 21h8" /></svg></span>
          <span class="pp-trust-text">Відповідає <strong>правилам адвокатської етики</strong></span>
        </div>
        <div class="pp-trust-item">
          <span class="pp-trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg></span>
          <span class="pp-trust-text"><strong>Захист даних</strong> · SOC 2</span>
        </div>
      </div>
    </div>

    <div class="pp-custom-quote-link">
      <a href="#" role="button" @click.prevent.stop="openLead">Велика фірма? Індивідуальна пропозиція <span class="arrow">→</span></a>
    </div>

    <div class="pp-cta-area">
      <button :class="CTA_CONFIG[currentIndex].cls" @click="selectPlanAndContinue">{{ CTA_CONFIG[currentIndex].text }}</button>
    </div>

    <div class="pp-lead-overlay" :class="{ open: showLeadOverlay }" :aria-hidden="!showLeadOverlay" @click.self="closeLead">
      <div class="pp-lead-modal" role="dialog" aria-labelledby="ppLeadTitle">
        <button class="pp-lead-close" aria-label="Закрити" @click.stop="closeLead">×</button>
        <div class="pp-lead-header">
          <div class="pp-lead-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
          <div class="pp-lead-title" id="ppLeadTitle">Реєстрація команди</div>
          <div class="pp-lead-sub">Розкажіть про вашу фірму — менеджер зв'яжеться протягом 24 годин з індивідуальним планом.</div>
        </div>
        <form v-if="!leadSubmitted" class="pp-lead-form" :class="{ 'pp-lead-invalid': leadInvalid }" novalidate @submit.prevent="submitLead">
          <div class="pp-lead-note">Цей план для команд від 10 спеціалістів. Для менших — оберіть Base, Pro або Premium.</div>
          <label class="pp-lead-field"><span class="pp-lead-label">Назва фірми <em>*</em></span><input v-model="lead.firm_name" type="text" autocomplete="organization" required></label>
          <label class="pp-lead-field"><span class="pp-lead-label">Назва компанії <em>*</em></span><input v-model="lead.company_name" type="text" autocomplete="organization" required></label>
          <label class="pp-lead-field"><span class="pp-lead-label">Розмір команди <em>*</em> <span class="pp-lead-hint">(мінімум 10)</span></span><input v-model="lead.team_size" type="number" min="10" placeholder="напр. 12" required></label>
          <label class="pp-lead-field"><span class="pp-lead-label">Місто</span><input v-model="lead.firm_location" type="text" autocomplete="address-level2"></label>
          <label class="pp-lead-field"><span class="pp-lead-label">Email для зв'язку <em>*</em></span><input v-model="lead.contact_email" type="email" autocomplete="email" required></label>
          <label class="pp-lead-field"><span class="pp-lead-label">Телефон</span><input v-model="lead.contact_phone" type="tel" autocomplete="tel"></label>
          <label class="pp-lead-field"><span class="pp-lead-label">Що вам потрібно?</span><textarea v-model="lead.message" rows="3" placeholder="Обсяг, інтеграції, white-label, терміни…" /></label>
          <button type="submit" class="pp-lead-submit" :disabled="leadSending">{{ leadSending ? 'Надсилання…' : 'Замовити дзвінок' }}</button>
          <div class="pp-lead-foot">Надсилаючи, ви погоджуєтесь, що з вами зв'яжеться наша команда.</div>
        </form>
        <div v-else class="pp-lead-thanks">
          <div class="pp-lead-thanks-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
          <div class="pp-lead-thanks-title">Дякуємо!</div>
          <div class="pp-lead-thanks-sub">Менеджер зв'яжеться протягом 24 годин з індивідуальним планом для вашої команди.</div>
          <button type="button" class="pp-lead-thanks-close" @click="closeLead">Закрити</button>
        </div>
      </div>
    </div>
  </div>
</template>
