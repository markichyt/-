<script>
import { quizData, submitQuizData } from '../../../store/quizDataStore.js'
import { goToNextStep } from '../../../store/quizProgressStore.js'
import { countdownTimerMixin } from '../../../mixins/countdownTimerMixin.js'
import { buildTierFeatures } from '../../../data/pricingPlans.js'
import { publicAsset } from '../../../data/publicAsset.js'
import { market } from '../../../../../i18n/marketConfig.js'
import { formatMoney } from '../../../../../i18n/format.js'

const PROFILE_IMAGE = publicAsset('images/profiles/PHOTO3.png')

// tier/rating/plan — стабільні; підписи планів, CTA та тексти — з i18n.
const PLAN_SLIDES = [
  { tier: 'base', rating: '54.42', plan: 'base' },
  { tier: 'pro', rating: '67.59', plan: 'pro' },
  { tier: 'premium', rating: '76.02', plan: 'premium' }
]
const CTA_CONFIG = [
  { cls: 'pp-cta-btn pp-cta-base', plan: 'base' },
  { cls: 'pp-cta-btn pp-cta-pro', plan: 'pro' },
  { cls: 'pp-cta-btn pp-cta-premium', plan: 'premium' }
]
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// «Оберіть свій план» — профіль + карусель тарифів (Base / Pro / Premium) з
// тумблером оплати, прев'ю AI-аватара, блоком довіри та лід-формою для команд.
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
      const p = market(this.$i18n.locale).pricing[this.isAnnual ? 'annual' : 'monthly']
      return { base: formatMoney(p.base), pro: formatMoney(p.pro), premium: formatMoney(p.premium) }
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
    // Переносимо лід-модалку в <body>, щоб position:fixed рахувався від реального
    // вьюпорта. У .card-stack є perspective (+ transform у активної картки) — це
    // containing block для fixed, через який на iOS Safari оверлей прив'язувався до
    // колоди й обрізався (× у формі команди був недоступний). У <body> — на весь екран.
    const ov = this.$refs.leadOverlay
    if (ov && ov.parentNode !== document.body) {
      document.body.appendChild(ov)
      this._leadMoved = true
    }
    // Стрілки каруселі — теж у <body>, щоб position:fixed рахувався від екрана
    // (зафіксовані до вікна, видимі попри скрол, не обрізаються на iOS).
    const rail = this.$refs.arrowRail
    if (rail && rail.parentNode !== document.body) {
      document.body.appendChild(rail)
      this._railMoved = true
    }
  },
  // Stop the avatar audio when this card goes away (navigation or hot-reload), so
  // a replaced instance can never keep playing in the background.
  beforeDestroy() {
    if (this.$refs.avatarVideo) this.$refs.avatarVideo.pause()
    // Прибираємо перенесену в <body> модалку разом із карткою.
    if (this._leadMoved && this.$refs.leadOverlay && this.$refs.leadOverlay.parentNode) {
      this.$refs.leadOverlay.parentNode.removeChild(this.$refs.leadOverlay)
    }
    if (this._railMoved && this.$refs.arrowRail && this.$refs.arrowRail.parentNode) {
      this.$refs.arrowRail.parentNode.removeChild(this.$refs.arrowRail)
    }
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
      // active slide — e.g. the user advanced to the payment step.
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
      <div class="pp-timer-label">{{ $t('common.discountBanner') }}</div>
      <div class="pp-timer-digits">
        <div class="t-block"><span class="num">{{ countdownHours }}</span><span class="lbl">{{ $t('common.timer.hours') }}</span></div>
        <span class="t-sep">:</span>
        <div class="t-block"><span class="num">{{ countdownMinutes }}</span><span class="lbl">{{ $t('common.timer.minutes') }}</span></div>
        <span class="t-sep">:</span>
        <div class="t-block"><span class="num">{{ countdownSeconds }}</span><span class="lbl">{{ $t('common.timer.seconds') }}</span></div>
      </div>
    </div>

    <div ref="arrowRail" class="pp-arrow-rail" :class="{ 'pp-arrows-on': active }" aria-hidden="true">
      <button class="pp-arrow pp-arrow--left" :aria-label="$t('cards.profilesPricing.prevPlan')" @click.stop="goTo(currentIndex - 1)">
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <button class="pp-arrow pp-arrow--right" :aria-label="$t('cards.profilesPricing.nextPlan')" @click.stop="goTo(currentIndex + 1)">
        <svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18" /></svg>
      </button>
    </div>

    <div class="pp-viewport">
      <div class="pp-track" :style="trackStyle">
        <div v-for="slide in PLAN_SLIDES" :key="slide.tier" class="pp-slide">
          <div class="prof-card" :class="'prof-' + slide.tier">
            <div class="prof-topbar">
              <span class="tier-label">{{ $t('cards.profilesPricing.plans.' + slide.tier) }}</span>
              <span class="separator" />
              <span class="rating-area">
                <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>
                <span class="rating-num">{{ slide.rating }}</span>
              </span>
            </div>
            <div class="prof-body">
              <template v-if="slide.tier !== 'premium'">
                <div class="prof-avatar-wrap"><img :src="PROFILE_IMAGE" :alt="$t('cards.profilesPricing.avatarAlt')"></div>
                <div class="prof-info">
                  <div class="name">{{ $t('cards.profilesPricing.demo.name') }}</div>
                  <div class="role">{{ $t('cards.profilesPricing.demo.role') }}</div>
                  <div class="location">
                    <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
                    {{ $t('cards.profilesPricing.demo.location') }}
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="prof-info-area">
                  <div class="prof-info">
                    <div class="name">{{ $t('cards.profilesPricing.demoPremium.name') }}</div>
                    <div class="role">{{ $t('cards.profilesPricing.demoPremium.role') }}</div>
                    <div class="location">
                      <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
                      {{ $t('cards.profilesPricing.demoPremium.location') }}
                    </div>
                  </div>
                </div>
                <div class="prof-photo-right"><img :src="PROFILE_IMAGE" :alt="$t('cards.profilesPricing.avatarAlt')"></div>
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
        <span class="pp-avatar-label">{{ $t('cards.profilesPricing.avatarLabel') }}</span>
        <div class="pp-avatar-video-wrap">
          <video ref="avatarVideo" loop playsinline preload="metadata">
            <source :src="avatarVideoSrc" type="video/mp4">
          </video>
          <button class="pp-avatar-sound-btn" :class="{ muted: isAvatarMuted }" title="Toggle sound" @click.stop="toggleAvatarSound">
            {{ isAvatarMuted ? '♪︎' : '♪' }}
          </button>
        </div>
        <div class="pp-avatar-tagline">{{ $t('cards.profilesPricing.avatarTagline') }}</div>
      </div>
    </div>

    <div class="pp-billing-toggle">
      <span class="toggle-label" :class="{ active: !isAnnual }" @click.stop="isAnnual = false">{{ $t('cards.profilesPricing.monthly') }}</span>
      <div class="pp-toggle-track" :class="{ annual: isAnnual }" @click.stop="isAnnual = !isAnnual"><div class="pp-toggle-thumb" /></div>
      <span class="toggle-label" :class="{ active: isAnnual }" @click.stop="isAnnual = true">{{ $t('cards.profilesPricing.annual') }}</span>
      <span class="pp-save-badge">{{ $t('cards.profilesPricing.saveBadge') }}</span>
    </div>

    <div class="pp-pricing-section">
      <div class="pp-pricing-content" :style="trackStyle">
        <div v-for="slide in PLAN_SLIDES" :key="slide.tier" class="pp-pricing-panel">
          <div class="pp-plan-name" :class="'pp-' + slide.tier + '-name'">{{ slide.plan === 'base' ? 'Base' : slide.plan === 'pro' ? 'Pro' : 'Premium' }}</div>
          <div class="pp-price-row">
            <span class="pp-new-price">{{ priceFor[slide.tier] }}<span class="period">{{ $t('pricing.perMonthShort') }}</span></span>
          </div>
          <div class="pp-billing-note">{{ $t('pricing.note.' + (isAnnual ? 'annual' : 'monthly')) }}</div>
          <div class="pp-features">
            <div v-for="feature in featuresByTier[slide.tier]" :key="feature.key" class="pp-feat" :class="feature.on ? 'yes' : 'no'">
              <span class="feat-left">
                <span class="icon">{{ feature.on ? '✓' : '✗' }}</span>
                <span>{{ $t('pricing.features.' + feature.key) }}</span>
              </span>
              <span v-if="feature.badge" class="comp-badge" :class="feature.badge.type === 'green' ? 'comp-badge--green' : 'comp-badge--cyan'">{{ $t(feature.badge.text) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pp-trust-block">
      <div class="pp-trust-title">{{ $t('cards.profilesPricing.trustTitle') }}</div>
      <div class="pp-trust-grid">
        <div class="pp-trust-item">
          <span class="pp-trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18" /><path d="M5 7h14" /><path d="M8 7l-3 7a4 4 0 0 0 6 0z" /><path d="M16 7l-3 7a4 4 0 0 0 6 0z" /><path d="M8 21h8" /></svg></span>
          <span class="pp-trust-text" v-html="$t('cards.profilesPricing.trustEthicsHtml')" />
        </div>
        <div class="pp-trust-item">
          <span class="pp-trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg></span>
          <span class="pp-trust-text" v-html="$t('cards.profilesPricing.trustDataHtml')" />
        </div>
      </div>
    </div>

    <div class="pp-custom-quote-link">
      <a href="#" role="button" @click.prevent.stop="openLead">{{ $t('cards.profilesPricing.customQuote') }} <span class="arrow">→</span></a>
    </div>

    <div class="pp-cta-area">
      <button :class="CTA_CONFIG[currentIndex].cls" @click="selectPlanAndContinue">{{ $t('cards.profilesPricing.cta.' + CTA_CONFIG[currentIndex].plan) }}</button>
    </div>

    <div ref="leadOverlay" class="pp-lead-overlay" :class="{ open: showLeadOverlay }" :aria-hidden="!showLeadOverlay" @click.self="closeLead">
      <div class="pp-lead-modal" role="dialog" aria-labelledby="ppLeadTitle">
        <button class="pp-lead-close" :aria-label="$t('cards.profilesPricing.close')" @click.stop="closeLead">×</button>
        <div class="pp-lead-header">
          <div class="pp-lead-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
          <div class="pp-lead-title" id="ppLeadTitle">{{ $t('cards.profilesPricing.lead.title') }}</div>
          <div class="pp-lead-sub">{{ $t('cards.profilesPricing.lead.sub') }}</div>
        </div>
        <form v-if="!leadSubmitted" class="pp-lead-form" :class="{ 'pp-lead-invalid': leadInvalid }" novalidate @submit.prevent="submitLead">
          <div class="pp-lead-note">{{ $t('cards.profilesPricing.lead.note') }}</div>
          <label class="pp-lead-field"><span class="pp-lead-label">{{ $t('cards.profilesPricing.lead.firmName') }} <em>*</em></span><input v-model="lead.firm_name" type="text" autocomplete="organization" required></label>
          <label class="pp-lead-field"><span class="pp-lead-label">{{ $t('cards.profilesPricing.lead.companyName') }} <em>*</em></span><input v-model="lead.company_name" type="text" autocomplete="organization" required></label>
          <label class="pp-lead-field"><span class="pp-lead-label">{{ $t('cards.profilesPricing.lead.teamSize') }} <em>*</em> <span class="pp-lead-hint">{{ $t('cards.profilesPricing.lead.teamSizeHint') }}</span></span><input v-model="lead.team_size" type="number" min="10" :placeholder="$t('cards.profilesPricing.lead.teamSizePh')" required></label>
          <label class="pp-lead-field"><span class="pp-lead-label">{{ $t('cards.profilesPricing.lead.location') }}</span><input v-model="lead.firm_location" type="text" autocomplete="address-level2"></label>
          <label class="pp-lead-field"><span class="pp-lead-label">{{ $t('cards.profilesPricing.lead.email') }} <em>*</em></span><input v-model="lead.contact_email" type="email" autocomplete="email" required></label>
          <label class="pp-lead-field"><span class="pp-lead-label">{{ $t('cards.profilesPricing.lead.phone') }}</span><input v-model="lead.contact_phone" type="tel" autocomplete="tel"></label>
          <label class="pp-lead-field"><span class="pp-lead-label">{{ $t('cards.profilesPricing.lead.message') }}</span><textarea v-model="lead.message" rows="3" :placeholder="$t('cards.profilesPricing.lead.messagePh')" /></label>
          <button type="submit" class="pp-lead-submit" :disabled="leadSending">{{ leadSending ? $t('cards.profilesPricing.lead.sending') : $t('cards.profilesPricing.lead.submit') }}</button>
          <div class="pp-lead-foot">{{ $t('cards.profilesPricing.lead.foot') }}</div>
        </form>
        <div v-else class="pp-lead-thanks">
          <div class="pp-lead-thanks-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
          <div class="pp-lead-thanks-title">{{ $t('cards.profilesPricing.lead.thanksTitle') }}</div>
          <div class="pp-lead-thanks-sub">{{ $t('cards.profilesPricing.lead.thanksSub') }}</div>
          <button type="button" class="pp-lead-thanks-close" @click="closeLead">{{ $t('cards.profilesPricing.close') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
