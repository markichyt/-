<script setup>
import { ref, computed, reactive, watch, onMounted, onUnmounted } from 'vue'
import { useQuizData } from '../../../composables/useQuizData.js'
import { useQuizProgress } from '../../../composables/useQuizProgress.js'
import { useCountdownTimer } from '../../../composables/useCountdownTimer.js'
import { buildTierFeatures, pricingByBilling } from '../../../data/pricingPlans.js'
import { publicAsset } from '../../../data/publicAsset.js'

const avatarVideoSrc = publicAsset('videos/i_avatar.mp4')

// "Choose your plan" — profile + pricing carousel (Base / Pro / Premium) with a
// billing toggle, AI-avatar preview, trust block and an enterprise lead form.
const props = defineProps({
  active: { type: Boolean, default: false }
})

const { quizData, submitQuizData } = useQuizData()
const { goToNextStep } = useQuizProgress()
const { hours, minutes, seconds } = useCountdownTimer()

const PROFILE_IMAGE = publicAsset('images/profiles/PHOTO3.png')

const PLAN_SLIDES = [
  { tier: 'base', label: 'BASE (Basic)', rating: '54.42', plan: 'base' },
  { tier: 'pro', label: 'PRO', rating: '67.59', plan: 'pro' },
  { tier: 'premium', label: 'PREMIUM', rating: '76.02', plan: 'premium' }
]
const CTA_CONFIG = [
  { text: 'Get Base', cls: 'pp-cta-btn pp-cta-base', plan: 'base' },
  { text: 'Get Pro', cls: 'pp-cta-btn pp-cta-pro', plan: 'pro' },
  { text: 'Get Premium', cls: 'pp-cta-btn pp-cta-premium', plan: 'premium' }
]

const currentIndex = ref(1) // default to Pro
const isAnnual = ref(false)
const avatarVideo = ref(null)
const isAvatarMuted = ref(false)

const trackStyle = computed(() => ({ transform: `translateX(${-currentIndex.value * 100}%)` }))
const avatarVisible = computed(() => currentIndex.value !== 0)

const featuresByTier = {
  base: buildTierFeatures('base'),
  pro: buildTierFeatures('pro'),
  premium: buildTierFeatures('premium')
}
const priceFor = computed(() => pricingByBilling[isAnnual.value ? 'annual' : 'monthly'])

watch(currentIndex, (idx) => {
  quizData.plan = CTA_CONFIG[idx].plan
  updateAvatarPlayback()
}, { immediate: true })

watch(isAnnual, (annual) => { quizData.billing = annual ? 'annual' : 'monthly' }, { immediate: true })

function goTo(idx) {
  if (idx < 0) idx = PLAN_SLIDES.length - 1
  if (idx >= PLAN_SLIDES.length) idx = 0
  currentIndex.value = idx
}

function updateAvatarPlayback() {
  const video = avatarVideo.value
  if (!video) return
  // Pause whenever the avatar is hidden (Base tab) or this card is no longer the
  // active slide — e.g. the user advanced to the payment step (slide 24).
  if (!avatarVisible.value || !props.active) {
    video.pause()
    return
  }
  video.muted = isAvatarMuted.value
  video.play().catch(() => {
    video.muted = true
    isAvatarMuted.value = true
    video.play().catch(() => {})
  })
}

function toggleAvatarSound() {
  const video = avatarVideo.value
  if (!video) return
  isAvatarMuted.value = !isAvatarMuted.value
  video.muted = isAvatarMuted.value
}

function selectPlanAndContinue() {
  quizData.plan = CTA_CONFIG[currentIndex.value].plan
  goToNextStep()
}

// ── Enterprise lead form ─────────────────────────────────────────────
const showLeadOverlay = ref(false)
const leadSubmitted = ref(false)
const leadInvalid = ref(false)
const leadSending = ref(false)
const lead = reactive({ firm_name: '', company_name: '', team_size: '', firm_location: '', contact_email: '', contact_phone: '', message: '' })
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function openLead() {
  if (!lead.contact_email && quizData.email) lead.contact_email = quizData.email
  if (!lead.contact_phone && quizData.phone) lead.contact_phone = quizData.phone
  showLeadOverlay.value = true
}
function closeLead() {
  showLeadOverlay.value = false
}
function submitLead() {
  const size = parseInt(lead.team_size, 10) || 0
  if (!lead.firm_name.trim() || !lead.company_name.trim() || size < 10 || !EMAIL_PATTERN.test(lead.contact_email)) {
    leadInvalid.value = true
    return
  }
  leadInvalid.value = false
  quizData.plan = 'enterprise'
  quizData.tier = 'enterprise'
  quizData.lead_type = 'team_registration'
  quizData.firm = {
    name: lead.firm_name.trim(),
    company: lead.company_name.trim(),
    team_size: size,
    location: lead.firm_location.trim(),
    message: lead.message.trim()
  }
  if (lead.contact_email) quizData.email = lead.contact_email.trim()
  if (lead.contact_phone) quizData.phone = lead.contact_phone.trim()
  try { localStorage.setItem('clm_enterprise_intent', '1') } catch { /* ignore */ }

  leadSending.value = true
  submitQuizData(() => {
    leadSending.value = false
    leadSubmitted.value = true
  })
}

onMounted(() => {
  isAvatarMuted.value = false
  updateAvatarPlayback()
})
watch(() => props.active, updateAvatarPlayback)

// Stop the avatar audio when this card goes away (navigation or hot-reload), so
// a replaced instance can never keep playing in the background.
onUnmounted(() => {
  if (avatarVideo.value) avatarVideo.value.pause()
})
</script>

<template>
  <div class="profiles-pricing-wrap">
    <div class="pp-timer-bar pp-timer-top">
      <div class="pp-timer-label">20% DISCOUNT JUST FOR YOU!</div>
      <div class="pp-timer-digits">
        <div class="t-block"><span class="num">{{ hours }}</span><span class="lbl">hrs</span></div>
        <span class="t-sep">:</span>
        <div class="t-block"><span class="num">{{ minutes }}</span><span class="lbl">min</span></div>
        <span class="t-sep">:</span>
        <div class="t-block"><span class="num">{{ seconds }}</span><span class="lbl">sec</span></div>
      </div>
    </div>

    <div class="pp-arrow-rail" aria-hidden="true">
      <button class="pp-arrow pp-arrow--left" aria-label="Previous plan" @click.stop="goTo(currentIndex - 1)">
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <button class="pp-arrow pp-arrow--right" aria-label="Next plan" @click.stop="goTo(currentIndex + 1)">
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
                <div class="prof-avatar-wrap"><img :src="PROFILE_IMAGE" alt="Attorney"></div>
                <div class="prof-info">
                  <div class="name">Alexander König</div>
                  <div class="role">Attorney</div>
                  <div class="location">
                    <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
                    USA, New York
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
                      USA, New York
                    </div>
                  </div>
                </div>
                <div class="prof-photo-right"><img :src="PROFILE_IMAGE" alt="Attorney"></div>
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
        <span class="pp-avatar-label">AI Avatar Preview</span>
        <div class="pp-avatar-video-wrap">
          <video ref="avatarVideo" loop playsinline preload="metadata">
            <source :src="avatarVideoSrc" type="video/mp4">
          </video>
          <button class="pp-avatar-sound-btn" :class="{ muted: isAvatarMuted }" title="Toggle sound" @click.stop="toggleAvatarSound">
            {{ isAvatarMuted ? '♪︎' : '♪' }}
          </button>
        </div>
        <div class="pp-avatar-tagline">Your AI avatar speaks for you 24/7</div>
      </div>
    </div>

    <div class="pp-billing-toggle">
      <span class="toggle-label" :class="{ active: !isAnnual }" @click.stop="isAnnual = false">Monthly</span>
      <div class="pp-toggle-track" :class="{ annual: isAnnual }" @click.stop="isAnnual = !isAnnual"><div class="pp-toggle-thumb" /></div>
      <span class="toggle-label" :class="{ active: isAnnual }" @click.stop="isAnnual = true">Annual</span>
      <span class="pp-save-badge">Save 10%</span>
    </div>

    <div class="pp-pricing-section">
      <div class="pp-pricing-content" :style="trackStyle">
        <div v-for="slide in PLAN_SLIDES" :key="slide.tier" class="pp-pricing-panel">
          <div class="pp-plan-name" :class="'pp-' + slide.tier + '-name'">{{ slide.plan === 'base' ? 'Base' : slide.plan === 'pro' ? 'Pro' : 'Premium' }}</div>
          <div class="pp-price-row">
            <span class="pp-new-price">{{ priceFor[slide.tier].price }}<span class="period">/mo</span></span>
          </div>
          <div class="pp-billing-note">{{ priceFor[slide.tier].note }}</div>
          <div class="pp-features">
            <div v-for="feature in featuresByTier[slide.tier]" :key="feature.label" class="pp-feat" :class="feature.on ? 'yes' : 'no'">
              <span class="feat-left">
                <span class="icon">{{ feature.on ? '✓' : '✕' }}</span>
                <span>{{ feature.label }}</span>
              </span>
              <span v-if="feature.badge" class="comp-badge" :class="feature.badge.type === 'green' ? 'comp-badge--green' : 'comp-badge--cyan'">{{ feature.badge.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pp-trust-block">
      <div class="pp-trust-title">Built for US attorneys</div>
      <div class="pp-trust-grid">
        <div class="pp-trust-item">
          <span class="pp-trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18" /><path d="M5 7h14" /><path d="M8 7l-3 7a4 4 0 0 0 6 0z" /><path d="M16 7l-3 7a4 4 0 0 0 6 0z" /><path d="M8 21h8" /></svg></span>
          <span class="pp-trust-text"><strong>ABA Model Rules</strong> compliant</span>
        </div>
        <div class="pp-trust-item">
          <span class="pp-trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg></span>
          <span class="pp-trust-text"><strong>SOC 2 ready</strong></span>
        </div>
      </div>
    </div>

    <div class="pp-custom-quote-link">
      <a href="#" role="button" @click.prevent.stop="openLead">Large firm? Get a custom quote <span class="arrow">→</span></a>
    </div>

    <div class="pp-cta-area">
      <button :class="CTA_CONFIG[currentIndex].cls" @click="selectPlanAndContinue">{{ CTA_CONFIG[currentIndex].text }}</button>
    </div>

    <div class="pp-lead-overlay" :class="{ open: showLeadOverlay }" :aria-hidden="!showLeadOverlay" @click.self="closeLead">
      <div class="pp-lead-modal" role="dialog" aria-labelledby="ppLeadTitle">
        <button class="pp-lead-close" aria-label="Close" @click.stop="closeLead">×</button>
        <div class="pp-lead-header">
          <div class="pp-lead-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
          <div class="pp-lead-title" id="ppLeadTitle">Team registration</div>
          <div class="pp-lead-sub">Tell us about your firm — your manager will reach out within 24h with a tailored plan.</div>
        </div>
        <form v-if="!leadSubmitted" class="pp-lead-form" :class="{ 'pp-lead-invalid': leadInvalid }" novalidate @submit.prevent="submitLead">
          <div class="pp-lead-note">This plan is for teams of 10+ specialists. For smaller teams, please choose Base, Pro or Premium.</div>
          <label class="pp-lead-field"><span class="pp-lead-label">Firm name <em>*</em></span><input v-model="lead.firm_name" type="text" autocomplete="organization" required></label>
          <label class="pp-lead-field"><span class="pp-lead-label">Company name <em>*</em></span><input v-model="lead.company_name" type="text" autocomplete="organization" required></label>
          <label class="pp-lead-field"><span class="pp-lead-label">Team size <em>*</em> <span class="pp-lead-hint">(minimum 10)</span></span><input v-model="lead.team_size" type="number" min="10" placeholder="e.g. 12" required></label>
          <label class="pp-lead-field"><span class="pp-lead-label">Country / city</span><input v-model="lead.firm_location" type="text" autocomplete="address-level2"></label>
          <label class="pp-lead-field"><span class="pp-lead-label">Contact email <em>*</em></span><input v-model="lead.contact_email" type="email" autocomplete="email" required></label>
          <label class="pp-lead-field"><span class="pp-lead-label">Phone</span><input v-model="lead.contact_phone" type="tel" autocomplete="tel"></label>
          <label class="pp-lead-field"><span class="pp-lead-label">What do you need?</span><textarea v-model="lead.message" rows="3" placeholder="Volume, integrations, white-label, deadlines…" /></label>
          <button type="submit" class="pp-lead-submit" :disabled="leadSending">{{ leadSending ? 'Sending…' : 'Request a call' }}</button>
          <div class="pp-lead-foot">By submitting you agree to be contacted by our team.</div>
        </form>
        <div v-else class="pp-lead-thanks">
          <div class="pp-lead-thanks-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
          <div class="pp-lead-thanks-title">Got it — thanks!</div>
          <div class="pp-lead-thanks-sub">Your manager will reach out within 24 hours with a tailored plan for your team.</div>
          <button type="button" class="pp-lead-thanks-close" @click="closeLead">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
