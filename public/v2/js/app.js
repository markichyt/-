// ─────────────────────────────────────────────────────────────────────────────
// CONSULTANT Quiz v2 — рушій воронки.
//
// Колода з трьох фізичних карток (active / behind-1 / behind-2) — та сама
// механіка, що й у квізі 1: наступний крок рендериться заздалегідь у behind-1,
// тому свайп уперед показує його миттєво.
// ─────────────────────────────────────────────────────────────────────────────
import { t, state as i18nState, setLocale, applyDocumentLocale, SUPPORTED_LOCALES } from './i18n.js'
import {
  SLIDES, TOTAL_STEPS, PRICING, PRACTICE_AREAS, AI_POTENTIAL, DIAGNOSIS,
  PAIN_BRANCHES, buildTierFeatures, computeDiagnosis, iconPath, formatMoney, formatNumber
} from './data.js'

// ── Сховище відповідей ───────────────────────────────────────────────────────
const STORAGE_KEY = 'clm_quiz2_data'
const SUBMIT_URL = window.QUIZ_SUBMIT_URL || ''

function defaultAnswers () {
  return {
    first_name: '', last_name: '', email: '', phone: '',
    search_time: '', growth_blocker: '', services: [], desired_clients: '',
    plan: 'pro', billing: 'monthly', tier: '',
    lead_type: '', firm: null,
    call_day: '', call_time: '', call_topic: '', call_note: '',
    photo_name: '', photo_data: '', about: '', cv_name: '',
    payment_method: '', payment_period: '', submitted_at: '',
    utm_source: '', utm_medium: '', utm_campaign: '', utm_term: '', utm_content: ''
  }
}

export const answers = (function load () {
  const data = defaultAnswers()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) Object.assign(data, JSON.parse(raw))
  } catch (e) { /* пошкоджене сховище — беремо дефолти */ }
  return data
})()

;(function captureUtm () {
  const params = new URLSearchParams(window.location.search)
  ;['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
    const value = params.get(key)
    if (value) answers[key] = value
  })
})()

export function saveAnswers () {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(answers)) } catch (e) { /* ignore */ }
}

// Надсилання на бекенд. URL задає бекенд через window.QUIZ_SUBMIT_URL;
// поки його немає — просто зберігаємо локально й повідомляємо про успіх.
export function submitAnswers (callback) {
  answers.submitted_at = new Date().toISOString()
  saveAnswers()
  if (!SUBMIT_URL) {
    console.info('[quiz2] payload (QUIZ_SUBMIT_URL не задано):', JSON.parse(JSON.stringify(answers)))
    if (callback) setTimeout(() => callback(true, 0, 'no-endpoint'), 300)
    return
  }
  try {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', SUBMIT_URL, true)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhr.onload = () => { if (callback) callback(xhr.status >= 200 && xhr.status < 300, xhr.status, xhr.responseText) }
    xhr.onerror = () => { if (callback) callback(false, 0, '') }
    xhr.send(JSON.stringify(answers))
  } catch (e) {
    if (callback) callback(false, 0, String(e))
  }
}

// ── Прогрес ──────────────────────────────────────────────────────────────────
const SWIPE_SETTLE_MS = 420
const progress = { currentStep: 1 }
const history = []
let navLocked = false

function goNext () {
  if (navLocked || progress.currentStep >= TOTAL_STEPS) return
  history.push(progress.currentStep)
  setStep(progress.currentStep + 1, 'right')
}

function goBack () {
  if (navLocked || history.length === 0) return
  setStep(history.pop(), 'left')
}

// ── Утиліти ──────────────────────────────────────────────────────────────────
function el (html) {
  const tpl = document.createElement('template')
  tpl.innerHTML = html.trim()
  return tpl.content.firstElementChild
}

function icon (name, size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconPath(name)}</svg>`
}

function esc (s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ))
}

// Підпис сфер практики користувача — для «Розраховано для:».
function servicesLabel () {
  const list = (answers.services || []).map((v) => t('slides.services.opt.' + v)).filter(Boolean)
  if (!list.length) return t('cards.diagnosis.serviceFallback')
  return list.slice(0, 3).join(' · ') + (list.length > 3 ? ' +' + (list.length - 3) : '')
}

function fullName () {
  return [answers.first_name, answers.last_name].filter(Boolean).join(' ').trim()
}

// ── Спільний зворотний відлік (як у квізі 1: 24 години, спільний дедлайн) ────
const TIMER_KEY = 'clm_quiz2_timer_end'
function deadline () {
  let stored = localStorage.getItem(TIMER_KEY)
  if (!stored) {
    stored = String(Date.now() + 24 * 60 * 60 * 1000)
    localStorage.setItem(TIMER_KEY, stored)
  }
  return parseInt(stored, 10)
}
function pad (v) { return v < 10 ? '0' + v : '' + v }

setInterval(() => {
  const diff = Math.max(0, deadline() - Date.now())
  const h = pad(Math.floor(diff / 3600000))
  const m = pad(Math.floor((diff % 3600000) / 60000))
  const s = pad(Math.floor((diff % 60000) / 1000))
  document.querySelectorAll('[data-cd="h"]').forEach((n) => { n.textContent = h })
  document.querySelectorAll('[data-cd="m"]').forEach((n) => { n.textContent = m })
  document.querySelectorAll('[data-cd="s"]').forEach((n) => { n.textContent = s })
}, 1000)

function timerBarHtml (cls) {
  return `
    <div class="${cls}">
      <div class="pay-timer-label">${t('common.discountBanner')}</div>
      <div class="pay-timer-digits">
        <span class="pay-t-block"><span class="pay-t-num" data-cd="h">23</span><span class="pay-t-lbl">${t('common.timer.hours')}</span></span>
        <span class="pay-t-sep">:</span>
        <span class="pay-t-block"><span class="pay-t-num" data-cd="m">59</span><span class="pay-t-lbl">${t('common.timer.minutes')}</span></span>
        <span class="pay-t-sep">:</span>
        <span class="pay-t-block"><span class="pay-t-num" data-cd="s">59</span><span class="pay-t-lbl">${t('common.timer.seconds')}</span></span>
      </div>
    </div>`
}

// Загальна обгортка слайда: заголовок + підзаголовок + тіло.
function frame (slide, bodyHtml, scroll) {
  const q = slide.q ? t(slide.q) : ''
  const sub = slide.sub ? t(slide.sub) : ''
  return `
    <div class="slide-frame${scroll ? ' card-scroll' : ''}">
      <div class="card-question">${q}</div>
      <div class="card-sub">${sub}</div>
      ${bodyHtml}
    </div>`
}

function actionBar (inner) {
  return `<div class="card-action-bar">${inner}</div>`
}

function continueBtn (label, disabled) {
  return `<button class="card-btn" data-continue${disabled ? ' disabled' : ''}>${label || t('common.next')}</button>`
}

// ─────────────────────────────────────────────────────────────────────────────
// Рендерери слайдів. Кожен повертає функцію прибирання (або undefined).
// ─────────────────────────────────────────────────────────────────────────────
const renderers = {}

// ── 1. Відео «Що ми пропонуємо» ──────────────────────────────────────────────
renderers.intro = function (slide, root) {
  root.innerHTML = frame(slide, `
    <div class="intro-video-wrap">
      <video class="intro-video" src="assets/intro.mp4" autoplay muted loop playsinline preload="auto"></video>
    </div>
    <div class="intro-video-note">${t('cards.intro.videoNote')}</div>
    ${actionBar(continueBtn())}
  `, true)

  const video = root.querySelector('video')
  if (video) video.play().catch(() => { /* автоплей заблоковано — не критично */ })
  root.querySelector('[data-continue]').addEventListener('click', goNext)
  return () => { if (video) video.pause() }
}

// ── 2. Контактна форма (ранній перехоплювач ліда) ────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

renderers.form = function (slide, root) {
  const touched = {}

  function valid (field) {
    const value = (answers[field.field] || '').trim()
    if (field.type === 'email') return EMAIL_RE.test(value)
    if (field.type === 'tel') return value.replace(/\D/g, '').length >= 9
    return !!value
  }

  function errorFor (field) {
    if (!touched[field.field] || valid(field)) return ''
    const value = (answers[field.field] || '').trim()
    if (field.type === 'email') return value ? t('validation.emailInvalid') : t('validation.required')
    if (field.type === 'tel') return t('validation.phoneInvalid')
    return t('validation.required')
  }

  function fieldsHtml () {
    return slide.fields.map((field) => {
      const base = 'slides.' + slide.id + '.fields.' + field.field
      const err = errorFor(field)
      return `
        <div class="form-group${err ? ' form-group--invalid' : ''}" data-field="${field.field}">
          <label class="form-label">${t(base + '.label')}<em class="form-req"> *</em></label>
          <input class="card-input" type="${field.type}" name="${field.field}"
                 value="${esc(answers[field.field])}"
                 placeholder="${esc(t(base + '.ph'))}"
                 autocomplete="${field.field === 'first_name' ? 'given-name' : field.field === 'last_name' ? 'family-name' : field.type}">
          ${err ? `<div class="form-error">${err}</div>` : ''}
        </div>`
    }).join('')
  }

  function paint () {
    root.querySelector('[data-fields]').innerHTML = fieldsHtml()
    wire()
  }

  function wire () {
    root.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', () => {
        answers[input.name] = input.value
        saveAnswers()
      })
      input.addEventListener('blur', () => {
        touched[input.name] = true
        paint()
      })
    })
  }

  root.innerHTML = frame(slide, `
    <div class="form-with-files-slide" data-fields>${fieldsHtml()}</div>
    ${actionBar(continueBtn())}
  `, true)
  wire()

  root.querySelector('[data-continue]').addEventListener('click', () => {
    slide.fields.forEach((f) => { touched[f.field] = true })
    if (slide.fields.every(valid)) {
      saveAnswers()
      // Ранній лід: контакти вже є — віддаємо їх бекенду, не чекаючи фіналу.
      submitAnswers()
      goNext()
    } else {
      paint()
    }
  })
}

// ── 3/4/6. Один варіант (radio) ──────────────────────────────────────────────
renderers.radio = function (slide, root) {
  function optionsHtml () {
    return slide.options.map((o) => `
      <div class="option-item${answers[slide.field] === o.v ? ' selected' : ''}" role="button" tabindex="0" data-v="${o.v}">
        <span class="opt-icon" style="background:${o.color}">${icon(o.icon)}</span>
        <span class="option-text">${t('slides.' + slide.field + '.opt.' + o.v)}</span>
        <span class="option-check"></span>
      </div>`).join('')
  }

  root.innerHTML = frame(slide, `
    <div class="radio-slide">
      <div class="option-list" data-options>${optionsHtml()}</div>
      ${actionBar(continueBtn(null, !answers[slide.field]))}
    </div>
  `, true)

  const btn = root.querySelector('[data-continue]')
  root.querySelector('[data-options]').addEventListener('click', (e) => {
    const item = e.target.closest('[data-v]')
    if (!item) return
    answers[slide.field] = item.dataset.v
    saveAnswers()
    root.querySelectorAll('.option-item').forEach((n) => n.classList.toggle('selected', n === item))
    btn.disabled = false
  })
  btn.addEventListener('click', goNext)
}

// ── 5. Кілька варіантів (checkbox) — сфери права ─────────────────────────────
renderers.checkbox = function (slide, root) {
  const selected = Array.isArray(answers[slide.field]) ? answers[slide.field].slice() : []

  function optionsHtml () {
    return slide.options.map((o) => `
      <div class="option-item${selected.indexOf(o.v) >= 0 ? ' selected' : ''}" role="button" tabindex="0" data-v="${o.v}">
        <span class="opt-icon" style="background:${o.color}">${icon(o.icon)}</span>
        <span class="option-text">${t('slides.' + slide.field + '.opt.' + o.v)}</span>
        <span class="option-check"></span>
      </div>`).join('')
  }

  function infoHtml () {
    return selected.length
      ? `<span class="count">${selected.length}</span> ${t('common.chosen')}`
      : t('common.selectOneOrMore')
  }

  root.innerHTML = frame(slide, `
    <div class="checkbox-slide">
      <div class="option-list" data-options>${optionsHtml()}</div>
      ${actionBar(`
        <div class="card-action-info" data-info>${infoHtml()}</div>
        ${continueBtn(null, slide.requireSelection && !selected.length)}
      `)}
    </div>
  `, true)

  const btn = root.querySelector('[data-continue]')
  const info = root.querySelector('[data-info]')

  root.querySelector('[data-options]').addEventListener('click', (e) => {
    const item = e.target.closest('[data-v]')
    if (!item) return
    const v = item.dataset.v
    const idx = selected.indexOf(v)
    if (idx >= 0) selected.splice(idx, 1)
    else selected.push(v)
    item.classList.toggle('selected', idx < 0)
    answers[slide.field] = selected.slice()
    saveAnswers()
    info.innerHTML = infoHtml()
    btn.disabled = slide.requireSelection && !selected.length
  })
  btn.addEventListener('click', goNext)
}

// ── 7. Діагноз ───────────────────────────────────────────────────────────────
renderers.diagnosis = function (slide, root) {
  const d = computeDiagnosis(answers)
  const branch = PAIN_BRANCHES[d.branch] || PAIN_BRANCHES.few_leads
  const bt = 'cards.diagnosis.branch.' + d.branch

  const hoursBlock = d.noTime
    ? `<div class="dg-stat dg-stat--wide">
         <div class="dg-stat-title">${t('cards.diagnosis.noTimeTitle')}</div>
         <div class="dg-stat-cap">${t('cards.diagnosis.noTimeCap')}</div>
       </div>`
    : `<div class="dg-stat">
         <div class="dg-stat-num">${d.hoursMonth}</div>
         <div class="dg-stat-lbl">${t('cards.diagnosis.hoursLabel')}</div>
         <div class="dg-stat-cap">${t('cards.diagnosis.hoursCap')}</div>
       </div>`

  root.innerHTML = frame(slide, `
    <div class="dg-wrap">
      <div class="dg-head" style="--dg-color:${branch.color}">
        <span class="dg-head-icon">${icon(branch.icon, 22)}</span>
        <div class="dg-head-title">${t(bt + '.title')}</div>
      </div>
      <div class="dg-body">${t(bt + '.body')}</div>

      <div class="dg-stats">
        ${hoursBlock}
        <div class="dg-stat">
          <div class="dg-stat-num">${d.missedLow}–${d.missedHigh}</div>
          <div class="dg-stat-lbl">${t('cards.diagnosis.missedLabel')}</div>
          <div class="dg-stat-cap">${t('cards.diagnosis.missedCap')}</div>
        </div>
      </div>

      <div class="dg-revenue">
        <div class="dg-revenue-num">${formatNumber(d.revenueLow)} – ${formatMoney(d.revenueHigh)}</div>
        <div class="dg-revenue-lbl">${t('cards.diagnosis.revenueLabel')}</div>
        <div class="dg-revenue-note">${t('cards.diagnosis.revenueNote', {
          low: formatMoney(DIAGNOSIS.caseValueLow), high: formatMoney(DIAGNOSIS.caseValueHigh)
        })}</div>
      </div>

      <div class="dg-fix">${t(bt + '.fix')}</div>

      <div class="dg-fine">
        <span class="dg-fine-label">${t('cards.diagnosis.forLabel')}</span> ${esc(servicesLabel())}
      </div>
      <div class="dg-disclaimer">${t('cards.diagnosis.disclaimer')}</div>

      ${actionBar(continueBtn())}
    </div>
  `, true)

  root.querySelector('[data-continue]').addEventListener('click', goNext)
}

// ── 8. Тарифи (карусель — порт із квіза 1) ───────────────────────────────────
const PLAN_SLIDES = [
  { tier: 'base', rating: '54.42' },
  { tier: 'pro', rating: '67.59' },
  { tier: 'premium', rating: '76.02' }
]
const PIN_SVG = '<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>'

renderers.pricing = function (slide, root) {
  const d = computeDiagnosis(answers)
  const recommended = d.tier
  let index = PLAN_SLIDES.findIndex((p) => p.tier === recommended)
  if (index < 0) index = 1
  let isAnnual = answers.billing === 'annual'

  const features = {
    base: buildTierFeatures('base'),
    pro: buildTierFeatures('pro'),
    premium: buildTierFeatures('premium')
  }

  function profileCard (p) {
    const isPremium = p.tier === 'premium'
    const nameKey = isPremium ? 'demoPremium' : 'demo'
    const info = `
      <div class="prof-info">
        <div class="name">${t('cards.profilesPricing.' + nameKey + '.name')}</div>
        <div class="role">${t('cards.profilesPricing.' + nameKey + '.role')}</div>
        <div class="location">${PIN_SVG}${t('cards.profilesPricing.' + nameKey + '.location')}</div>
      </div>`
    const photo = `<div class="${isPremium ? 'prof-photo-right' : 'prof-avatar-wrap'}"><img src="assets/profile.png" alt="${t('cards.profilesPricing.avatarAlt')}"></div>`
    return `
      <div class="pp-slide">
        <div class="prof-card prof-${p.tier}">
          <div class="prof-topbar">
            <span class="tier-label">${t('cards.profilesPricing.plans.' + p.tier)}</span>
            <span class="separator"></span>
            <span class="rating-area">
              <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
              <span class="rating-num">${p.rating}</span>
            </span>
          </div>
          <div class="prof-body">
            ${isPremium ? `<div class="prof-info-area">${info}</div>${photo}` : `${photo}${info}`}
          </div>
          <div class="prof-info-btn">i</div>
        </div>
      </div>`
  }

  function pricingPanel (p) {
    const name = p.tier === 'base' ? 'Base' : p.tier === 'pro' ? 'Pro' : 'Premium'
    const rows = features[p.tier].map((f) => `
      <div class="pp-feat ${f.on ? 'yes' : 'no'}">
        <span class="feat-left"><span class="icon">${f.on ? '✓' : '✗'}</span><span>${t('pricing.features.' + f.key)}</span></span>
        ${f.badge ? `<span class="comp-badge ${f.badge.type === 'green' ? 'comp-badge--green' : 'comp-badge--cyan'}">${t(f.badge.text)}</span>` : ''}
      </div>`).join('')
    return `
      <div class="pp-pricing-panel">
        ${p.tier === recommended ? `<div class="pp-reco-badge">${t('cards.profilesPricing.recommended')}</div>` : ''}
        <div class="pp-plan-name pp-${p.tier}-name">${name}</div>
        <div class="pp-price-row">
          <span class="pp-new-price" data-price="${p.tier}">${formatMoney(PRICING[isAnnual ? 'annual' : 'monthly'][p.tier])}<span class="period">${t('pricing.perMonthShort')}</span></span>
        </div>
        <div class="pp-billing-note" data-note>${t('pricing.note.' + (isAnnual ? 'annual' : 'monthly'))}</div>
        <div class="pp-features">${rows}</div>
      </div>`
  }

  root.innerHTML = frame(slide, `
    <div class="profiles-pricing-wrap">
      ${timerBarHtml('pp-timer-bar pp-timer-top')}

      <div class="pp-viewport">
        <div class="pp-track" data-track>${PLAN_SLIDES.map(profileCard).join('')}</div>
      </div>

      <div class="pp-dots" data-dots>
        ${PLAN_SLIDES.map((p, i) => `<button class="pp-dot${i === index ? ' active' : ''}" data-idx="${i}" aria-label="${p.tier}"></button>`).join('')}
      </div>

      <div class="pp-avatar-section${index !== 0 ? ' visible' : ''}" data-avatar-section>
        <div class="pp-avatar-inner">
          <span class="pp-avatar-label">${t('cards.profilesPricing.avatarLabel')}</span>
          <div class="pp-avatar-video-wrap">
            <video data-avatar loop playsinline muted preload="metadata"><source src="assets/avatar.mp4" type="video/mp4"></video>
          </div>
          <div class="pp-avatar-tagline">${t('cards.profilesPricing.avatarTagline')}</div>
        </div>
      </div>

      <div class="pp-billing-toggle">
        <span class="toggle-label${!isAnnual ? ' active' : ''}" data-bill="monthly">${t('cards.profilesPricing.monthly')}</span>
        <div class="pp-toggle-track${isAnnual ? ' annual' : ''}" data-bill-toggle><div class="pp-toggle-thumb"></div></div>
        <span class="toggle-label${isAnnual ? ' active' : ''}" data-bill="annual">${t('cards.profilesPricing.annual')}</span>
        <span class="pp-save-badge">${t('cards.profilesPricing.saveBadge')}</span>
      </div>

      <div class="pp-pricing-section">
        <div class="pp-pricing-content" data-pricing-track>${PLAN_SLIDES.map(pricingPanel).join('')}</div>
      </div>

      <div class="pp-trust-block">
        <div class="pp-trust-title">${t('cards.profilesPricing.trustTitle')}</div>
        <div class="pp-trust-grid">
          <div class="pp-trust-item">
            <span class="pp-trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 7h14"/><path d="M8 7l-3 7a4 4 0 0 0 6 0z"/><path d="M16 7l-3 7a4 4 0 0 0 6 0z"/><path d="M8 21h8"/></svg></span>
            <span class="pp-trust-text">${t('cards.profilesPricing.trustEthicsHtml')}</span>
          </div>
          <div class="pp-trust-item">
            <span class="pp-trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></span>
            <span class="pp-trust-text">${t('cards.profilesPricing.trustDataHtml')}</span>
          </div>
        </div>
      </div>

      <div class="pp-cta-area">
        <button class="pp-cta-btn pp-cta-${PLAN_SLIDES[index].tier}" data-cta>${t('cards.profilesPricing.cta.' + PLAN_SLIDES[index].tier)}</button>
      </div>
    </div>
  `, true)

  const track = root.querySelector('[data-track]')
  const priceTrack = root.querySelector('[data-pricing-track]')
  const avatarSection = root.querySelector('[data-avatar-section]')
  const avatarVideo = root.querySelector('[data-avatar]')
  const cta = root.querySelector('[data-cta]')

  function paint () {
    const shift = `translateX(${-index * 100}%)`
    track.style.transform = shift
    priceTrack.style.transform = shift
    avatarSection.classList.toggle('visible', index !== 0)
    root.querySelectorAll('.pp-dot').forEach((n, i) => n.classList.toggle('active', i === index))
    const tier = PLAN_SLIDES[index].tier
    cta.className = 'pp-cta-btn pp-cta-' + tier
    cta.textContent = t('cards.profilesPricing.cta.' + tier)
    answers.plan = tier
    answers.billing = isAnnual ? 'annual' : 'monthly'
    saveAnswers()
    if (avatarVideo) {
      if (index === 0) avatarVideo.pause()
      else avatarVideo.play().catch(() => {})
    }
  }

  function repaintPrices () {
    const table = PRICING[isAnnual ? 'annual' : 'monthly']
    root.querySelectorAll('[data-price]').forEach((n) => {
      n.innerHTML = formatMoney(table[n.dataset.price]) + `<span class="period">${t('pricing.perMonthShort')}</span>`
    })
    root.querySelectorAll('[data-note]').forEach((n) => { n.textContent = t('pricing.note.' + (isAnnual ? 'annual' : 'monthly')) })
    root.querySelector('[data-bill-toggle]').classList.toggle('annual', isAnnual)
    root.querySelectorAll('[data-bill]').forEach((n) => n.classList.toggle('active', (n.dataset.bill === 'annual') === isAnnual))
  }

  root.querySelector('[data-dots]').addEventListener('click', (e) => {
    const dot = e.target.closest('[data-idx]')
    if (!dot) return
    index = parseInt(dot.dataset.idx, 10)
    paint()
  })

  function setBilling (annual) { isAnnual = annual; repaintPrices(); paint() }
  root.querySelector('[data-bill-toggle]').addEventListener('click', () => setBilling(!isAnnual))
  root.querySelectorAll('[data-bill]').forEach((n) => n.addEventListener('click', () => setBilling(n.dataset.bill === 'annual')))

  cta.addEventListener('click', () => { answers.plan = PLAN_SLIDES[index].tier; saveAnswers(); goNext() })

  paint()
  return () => { if (avatarVideo) avatarVideo.pause() }
}

// ── 9. Подвійний CTA + календар ──────────────────────────────────────────────
const CALL_TOPICS = ['plan', 'leads', 'demo', 'team']
const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00']

renderers.cta = function (slide, root) {
  const plan = answers.plan || 'pro'
  const price = PRICING[answers.billing === 'annual' ? 'annual' : 'monthly'][plan]
  const planName = plan === 'base' ? 'Base' : plan === 'pro' ? 'Pro' : 'Premium'

  // Найближчі 10 днів, без вихідних — менеджер телефонує у робочі дні.
  const days = []
  const cursor = new Date()
  while (days.length < 10) {
    cursor.setDate(cursor.getDate() + (days.length === 0 ? 0 : 1))
    if (days.length === 0 && cursor.getHours() >= 17) continue
    const wd = cursor.getDay()
    if (wd !== 0 && wd !== 6) days.push(new Date(cursor))
    if (days.length === 0) cursor.setDate(cursor.getDate() + 1)
  }

  const weekdays = t('cards.cta.calendar.weekdays')
  const months = t('cards.cta.calendar.months')
  const todayKey = new Date().toDateString()
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowKey = tomorrow.toDateString()

  function dayLabel (date) {
    if (date.toDateString() === todayKey) return t('cards.cta.calendar.today')
    if (date.toDateString() === tomorrowKey) return t('cards.cta.calendar.tomorrow')
    return weekdays[date.getDay()]
  }
  function dayFull (date) {
    return date.getDate() + ' ' + months[date.getMonth()]
  }

  let selDay = 0
  let selTime = ''
  let selTopic = ''

  root.innerHTML = frame(slide, `
    <div class="cta2-wrap">
      <div class="cta2-plan">${t('cards.cta.recommendedNote', { plan: planName, price: formatMoney(price) })}</div>

      <div class="cta2-buttons">
        <button class="cta2-btn cta2-btn--buy" data-buy>
          <span class="cta2-btn-title">${t('cards.cta.buyNow')}</span>
          <span class="cta2-btn-hint">${t('cards.cta.buyNowHint')}</span>
        </button>
        <button class="cta2-btn cta2-btn--call" data-call>
          <span class="cta2-btn-title">${t('cards.cta.scheduleCall')}</span>
          <span class="cta2-btn-hint">${t('cards.cta.scheduleHint')}</span>
        </button>
      </div>
    </div>
  `, true)

  // ── Календар — окремим оверлеєм у <body> (як лід-модалка в квізі 1),
  // бо .card-stack має perspective і ламає position:fixed усередині колоди.
  const overlay = el(`
    <div class="cal-overlay" aria-hidden="true">
      <div class="cal-modal" role="dialog">
        <button class="cal-close" aria-label="${t('cards.cta.calendar.close')}">×</button>
        <div class="cal-header">
          <div class="cal-icon">${icon('calendar', 26)}</div>
          <div class="cal-title">${t('cards.cta.calendar.title')}</div>
          <div class="cal-sub">${t('cards.cta.calendar.sub', { phone: esc(answers.phone) || '—' })}</div>
        </div>

        <div class="cal-section-label">${t('cards.cta.calendar.pickDay')}</div>
        <div class="cal-days" data-days>
          ${days.map((d, i) => `
            <button class="cal-day${i === 0 ? ' active' : ''}" data-day="${i}">
              <span class="cal-day-wd">${dayLabel(d)}</span>
              <span class="cal-day-num">${d.getDate()}</span>
              <span class="cal-day-mo">${months[d.getMonth()].slice(0, 3)}</span>
            </button>`).join('')}
        </div>

        <div class="cal-section-label">${t('cards.cta.calendar.pickTime')}</div>
        <div class="cal-times" data-times>
          ${TIME_SLOTS.map((s) => `<button class="cal-time" data-time="${s}">${s}</button>`).join('')}
        </div>

        <div class="cal-section-label">${t('cards.cta.calendar.topicLabel')}</div>
        <div class="cal-topics" data-topics>
          ${CALL_TOPICS.map((k) => `<button class="cal-topic" data-topic="${k}">${t('cards.cta.calendar.topics.' + k)}</button>`).join('')}
        </div>
        <textarea class="cal-note" rows="2" placeholder="${esc(t('cards.cta.calendar.topicPh'))}"></textarea>

        <button class="cal-submit" data-submit disabled>${t('cards.cta.calendar.submit')}</button>
      </div>
    </div>`)
  document.body.appendChild(overlay)

  const submitBtn = overlay.querySelector('[data-submit]')
  function refreshSubmit () { submitBtn.disabled = !selTime }

  overlay.querySelector('[data-days]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-day]')
    if (!b) return
    selDay = parseInt(b.dataset.day, 10)
    overlay.querySelectorAll('.cal-day').forEach((n) => n.classList.toggle('active', n === b))
  })
  overlay.querySelector('[data-times]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-time]')
    if (!b) return
    selTime = b.dataset.time
    overlay.querySelectorAll('.cal-time').forEach((n) => n.classList.toggle('active', n === b))
    refreshSubmit()
  })
  overlay.querySelector('[data-topics]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-topic]')
    if (!b) return
    selTopic = selTopic === b.dataset.topic ? '' : b.dataset.topic
    overlay.querySelectorAll('.cal-topic').forEach((n) => n.classList.toggle('active', n.dataset.topic === selTopic))
  })

  function closeCal () { overlay.classList.remove('open'); overlay.setAttribute('aria-hidden', 'true') }
  overlay.querySelector('.cal-close').addEventListener('click', closeCal)
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeCal() })

  submitBtn.addEventListener('click', () => {
    const date = days[selDay]
    answers.call_day = date.toISOString().slice(0, 10)
    answers.call_time = selTime
    answers.call_topic = selTopic
    answers.call_note = overlay.querySelector('.cal-note').value.trim()
    answers.lead_type = 'scheduled_call'
    saveAnswers()

    submitBtn.disabled = true
    submitBtn.textContent = t('cards.cta.calendar.sending')
    submitAnswers(() => {
      const when = dayFull(date) + ', ' + selTime
      overlay.querySelector('.cal-modal').innerHTML = `
        <div class="cal-thanks">
          <div class="cal-thanks-icon">${icon('check', 34)}</div>
          <div class="cal-thanks-title">${t('cards.cta.calendar.thanksTitle')}</div>
          <div class="cal-thanks-sub">${t('cards.cta.calendar.thanksSub', { when: when, phone: esc(answers.phone) })}</div>
          <button class="cal-thanks-close">${t('cards.cta.calendar.close')}</button>
        </div>`
      overlay.querySelector('.cal-thanks-close').addEventListener('click', closeCal)
    })
  })

  root.querySelector('[data-call]').addEventListener('click', () => {
    overlay.classList.add('open')
    overlay.setAttribute('aria-hidden', 'false')
  })
  root.querySelector('[data-buy]').addEventListener('click', () => {
    answers.lead_type = 'direct_purchase'
    answers.payment_method = 'card'
    answers.payment_period = answers.billing === 'annual' ? '1_year' : '1_month'
    saveAnswers()
    goNext()
  })

  return () => { if (overlay.parentNode) overlay.parentNode.removeChild(overlay) }
}

// ── Після оплати: фото для AI-аватара ────────────────────────────────────────
const PHOTO_SAMPLES = [
  { file: 'assets/lawyer-man.jpg' },
  { file: 'assets/lawyer-woman.jpg' }
]

renderers.photoUpload = function (slide, root) {
  root.innerHTML = frame(slide, `
    <div class="pu-wrap">
      <div class="upload-area" data-drop>
        <div class="upload-text" data-drop-text>${answers.photo_name || t('cards.photo.dropHint')}</div>
        <div class="pu-drop-sub">${t('cards.photo.dropSub')}</div>
        <input type="file" accept="image/jpeg,image/png" hidden>
      </div>
      <div class="form-error" data-photo-error hidden></div>
      <div class="pu-preview" data-preview${answers.photo_data ? '' : ' hidden'}>
        <img src="${answers.photo_data || ''}" alt="${t('cards.photo.previewAlt')}">
      </div>
      <div class="pu-samples-title">${t('cards.photo.samplesTitle')}</div>
      <div class="pu-samples" data-samples>
        ${PHOTO_SAMPLES.map((s, i) => `
          <button class="pu-sample" data-sample="${s.file}">
            <img src="${s.file}" alt="${t('cards.photo.sampleLabel')} ${i + 1}">
          </button>`).join('')}
      </div>
      ${actionBar(continueBtn())}
    </div>
  `, true)

  const drop = root.querySelector('[data-drop]')
  const input = drop.querySelector('input')
  const dropText = root.querySelector('[data-drop-text]')
  const preview = root.querySelector('[data-preview]')
  const errorBox = root.querySelector('[data-photo-error]')

  function showError (msg) {
    errorBox.textContent = msg
    errorBox.hidden = !msg
  }

  drop.addEventListener('click', () => input.click())
  input.addEventListener('change', () => {
    const file = input.files[0]
    if (!file) return
    if (['image/jpeg', 'image/png'].indexOf(file.type) < 0) return showError(t('cards.photo.error.badType'))
    if (file.size > 5 * 1024 * 1024) return showError(t('cards.photo.error.tooBig'))
    showError('')
    answers.photo_name = file.name
    dropText.textContent = file.name
    drop.classList.add('uploaded')
    const reader = new FileReader()
    reader.onload = () => {
      answers.photo_data = reader.result
      preview.querySelector('img').src = reader.result
      preview.hidden = false
      saveAnswers()
    }
    reader.readAsDataURL(file)
  })

  root.querySelector('[data-samples]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-sample]')
    if (!b) return
    showError('')
    answers.photo_name = b.dataset.sample.split('/').pop()
    answers.photo_data = ''
    dropText.textContent = answers.photo_name
    drop.classList.add('uploaded')
    preview.querySelector('img').src = b.dataset.sample
    preview.hidden = false
    root.querySelectorAll('.pu-sample').forEach((n) => n.classList.toggle('active', n === b))
    saveAnswers()
  })

  root.querySelector('[data-continue]').addEventListener('click', goNext)
}

// ── Після оплати: AI-потенціал ───────────────────────────────────────────────
renderers.aiPotential = function (slide, root) {
  const d = computeDiagnosis(answers)
  const teamLow = AI_POTENTIAL.teamRoles.reduce((s, r) => s + r.low, 0)
  const teamHigh = AI_POTENTIAL.teamRoles.reduce((s, r) => s + r.high, 0)
  const ourPlan = PRICING.monthly[answers.plan || 'pro']
  const times = Math.round(teamLow / ourPlan)

  root.innerHTML = frame(slide, `
    <div class="ai-wrap">
      <div class="ai-hero">
        <div class="ai-hero-eyebrow">${t('cards.aiPotential.heroEyebrow')}</div>
        <div class="ai-hero-num">${d.missedLow}–${d.missedHigh}</div>
        <div class="ai-hero-cap">${t('cards.aiPotential.clientsLabel')}</div>
        <div class="ai-hero-rev">${t('cards.aiPotential.revenue', {
          low: formatNumber(d.revenueLow), high: formatMoney(d.revenueHigh)
        })}</div>
        <div class="ai-hero-rev-cap">${t('cards.aiPotential.revenueCaption')}</div>
        <div class="ai-hero-price">${t('cards.aiPotential.priceLabel', { amount: formatMoney(ourPlan) })}</div>
      </div>

      <div class="ai-compare-q">${t('cards.aiPotential.compareQ')}</div>
      <div class="ai-team">
        ${AI_POTENTIAL.teamRoles.map((r) => `
          <div class="ai-team-row">
            <span class="ai-team-role">${t('cards.aiPotential.teamRoles.' + r.key)}</span>
            <span class="ai-team-cost">${t('cards.aiPotential.teamRoleCost', { low: Math.round(r.low / 1000), high: Math.round(r.high / 1000) })}</span>
          </div>`).join('')}
        <div class="ai-team-row ai-team-total">
          <span class="ai-team-role">${t('cards.aiPotential.teamTotalLabel')}</span>
          <span class="ai-team-cost">${t('cards.aiPotential.teamTotal', { low: formatNumber(teamLow), high: formatNumber(teamHigh) })}</span>
        </div>
      </div>

      <div class="ai-us">
        <span class="ai-us-label">${t('cards.aiPotential.usLabel')}</span>
        <span class="ai-us-price">${t('cards.aiPotential.ourPlan', { amount: formatMoney(ourPlan) })}</span>
      </div>
      <div class="ai-punch">${t('cards.aiPotential.punchHtml', { times: times, save: formatMoney(teamLow - ourPlan) })}</div>

      <div class="dg-fine"><span class="dg-fine-label">${t('cards.aiPotential.finePrintLabel')}</span> ${esc(servicesLabel())}</div>
      <div class="dg-disclaimer">${t('cards.aiPotential.finePrintDisclaimer')}</div>
      ${actionBar(continueBtn())}
    </div>
  `, true)

  root.querySelector('[data-continue]').addEventListener('click', goNext)
}

// ── Після оплати: оцінка профілю ─────────────────────────────────────────────
renderers.assessment = function (slide, root) {
  // Бал складається з того, що вже заповнено: контакти, сфери, ціль, фото.
  let score = 30
  if (answers.first_name && answers.last_name) score += 10
  if (answers.email) score += 10
  if (answers.phone) score += 10
  if ((answers.services || []).length) score += Math.min(20, answers.services.length * 4)
  if (answers.desired_clients) score += 5
  if (answers.photo_name) score += 15
  score = Math.min(100, score)

  const level = score >= 80 ? 'high' : score >= 60 ? 'mid' : score >= 40 ? 'normal' : 'low'

  root.innerHTML = frame(slide, `
    <div class="as-wrap">
      <div class="as-score">
        <div class="as-score-num">${score}<span>/100</span></div>
        <div class="as-bar"><div class="as-bar-fill as-level-${level}" style="width:${score}%"></div></div>
        <div class="as-level">${t('cards.assessment.yourLevel')} <b class="as-level-${level}-text">${t('cards.assessment.levels.' + level)}</b></div>
      </div>
      <div class="as-factors">${t('cards.assessment.factors')}</div>
      <div class="dg-fine"><span class="dg-fine-label">${t('cards.assessment.calculatedFor')}</span> ${esc(servicesLabel())}</div>
      <div class="dg-disclaimer">${t('cards.assessment.disclaimer')}</div>
      ${actionBar(continueBtn())}
    </div>
  `, true)

  root.querySelector('[data-continue]').addEventListener('click', goNext)
}

// ── Після оплати: повний профіль (фінальне надсилання) ───────────────────────
renderers.fullProfile = function (slide, root) {
  root.innerHTML = frame(slide, `
    <div class="fp-wrap">
      <div class="fp-strength">
        <span>${t('cards.fullProfile.strengthLabel')}</span>
        <div class="as-bar"><div class="as-bar-fill" data-strength-bar style="width:0%"></div></div>
      </div>
      <div class="fp-strength-hint" data-strength-hint>${t('cards.fullProfile.strengthHint.low')}</div>

      <div class="form-group">
        <label class="form-label">${t('cards.fullProfile.aboutLabel')}
          <span class="fp-hint">${t('cards.fullProfile.aboutHint')}</span>
        </label>
        <textarea class="card-input fp-about" rows="7" data-about placeholder="${esc(t('cards.fullProfile.aboutPh'))}">${esc(answers.about)}</textarea>
      </div>

      <div class="fp-cv">
        <div class="fp-cv-title">${t('cards.fullProfile.cvCtaTitle')}</div>
        <div class="fp-cv-body">${t('cards.fullProfile.cvCtaBody')}</div>
        <label class="form-label">${t('cards.fullProfile.cvLabel')}
          <span class="fp-hint">${t('cards.fullProfile.cvHint')}</span>
        </label>
        <div class="upload-area" data-cv-drop>
          <div class="upload-text" data-cv-text>${answers.cv_name || t('cards.fullProfile.cvPlaceholder')}</div>
          <input type="file" accept=".pdf,.doc,.docx" hidden>
        </div>
      </div>

      ${actionBar(continueBtn(t('cards.fullProfile.finish')))}
    </div>
  `, true)

  const about = root.querySelector('[data-about]')
  const bar = root.querySelector('[data-strength-bar]')
  const hint = root.querySelector('[data-strength-hint]')

  function refreshStrength () {
    const len = about.value.length
    const pct = Math.min(100, Math.round((len / 3000) * 100) + (answers.cv_name ? 30 : 0))
    bar.style.width = Math.min(100, pct) + '%'
    const key = pct >= 80 ? 'high' : pct >= 40 ? 'mid' : 'low'
    hint.textContent = t('cards.fullProfile.strengthHint.' + key)
  }

  about.addEventListener('input', () => {
    answers.about = about.value
    saveAnswers()
    refreshStrength()
  })

  const cvDrop = root.querySelector('[data-cv-drop]')
  const cvInput = cvDrop.querySelector('input')
  cvDrop.addEventListener('click', () => cvInput.click())
  cvInput.addEventListener('change', () => {
    const file = cvInput.files[0]
    if (!file) return
    answers.cv_name = file.name
    root.querySelector('[data-cv-text]').textContent = file.name
    cvDrop.classList.add('uploaded')
    saveAnswers()
    refreshStrength()
  })

  refreshStrength()

  root.querySelector('[data-continue]').addEventListener('click', (e) => {
    const btn = e.currentTarget
    btn.disabled = true
    submitAnswers(() => {
      root.innerHTML = `
        <div class="slide-frame card-scroll">
          <div class="fp-done">
            <div class="cal-thanks-icon">${icon('check', 34)}</div>
            <div class="cal-thanks-title">${t('cards.fullProfile.doneTitle')}</div>
            <div class="cal-thanks-sub">${t('cards.fullProfile.doneSub', { email: esc(answers.email) })}</div>
          </div>
        </div>`
    })
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Колода карток
// ─────────────────────────────────────────────────────────────────────────────
const slotStep = [1, null, null]
const slotClass = ['active', 'behind-1', 'behind-2']
const slotCleanup = [null, null, null]
let activeSlot = 0
let cards = []

function renderInto (slotIndex, step) {
  if (slotCleanup[slotIndex]) { slotCleanup[slotIndex](); slotCleanup[slotIndex] = null }
  const content = cards[slotIndex].querySelector('.card-content')
  if (!step) { content.innerHTML = ''; return }
  const slide = SLIDES[step - 1]
  const render = renderers[slide.type === 'card' ? slide.id : slide.type]
  if (!render) { content.innerHTML = `<div class="slide-frame"><div class="card-question">${slide.id || slide.type}</div></div>`; return }
  // Помилка в одній картці не повинна морозити всю колоду — ізолюємо рендер.
  try {
    slotCleanup[slotIndex] = render(slide, content) || null
  } catch (err) {
    console.error('[quiz2] не вдалось відрендерити крок', step, slide.id || slide.type, err)
    content.innerHTML = frame(slide, actionBar(continueBtn()), true)
    const btn = content.querySelector('[data-continue]')
    if (btn) btn.addEventListener('click', goNext)
  }
}

function applyClasses () {
  cards.forEach((card, i) => { card.className = 'stack-card ' + slotClass[i] })
}

function preRenderNext () {
  const behind1 = (activeSlot + 1) % 3
  const next = slotStep[activeSlot] < TOTAL_STEPS ? slotStep[activeSlot] + 1 : null
  slotStep[behind1] = next
  renderInto(behind1, next)
}

function setStep (step, direction) {
  progress.currentStep = step
  paintTopBar()

  const behind1 = (activeSlot + 1) % 3
  const behind2 = (activeSlot + 2) % 3

  // Картку, що заїжджає, перерендерюємо, якщо:
  //  • йдемо назад (назад не префрендериться), або
  //  • слайд позначено dynamic — його вміст рахується з відповідей, а пре-рендер
  //    стався ще до того, як користувач відповів на попереднє питання.
  slotStep[behind1] = step
  if (direction === 'left' || SLIDES[step - 1].dynamic) renderInto(behind1, step)

  navLocked = true
  slotClass[activeSlot] = direction === 'right' ? 'exit-right' : 'exit-left'
  slotClass[behind1] = 'active'
  slotClass[behind2] = 'behind-1'
  applyClasses()

  setTimeout(() => {
    slotClass[activeSlot] = 'behind-2'
    activeSlot = behind1
    applyClasses()
    // Замок навігації знімаємо в будь-якому разі, інакше збій пре-рендера
    // назавжди блокує кнопку «Далі».
    try { preRenderNext() } finally { navLocked = false }
    const stack = document.querySelector('.card-stack')
    if (stack) stack.scrollTop = 0
    const active = cards[activeSlot].querySelector('.card-scroll')
    if (active) active.scrollTop = 0
  }, SWIPE_SETTLE_MS)
}

function paintTopBar () {
  const step = Math.max(1, progress.currentStep)
  const pct = Math.round((step / TOTAL_STEPS) * 100)
  document.querySelector('[data-step-label]').textContent = t('topbar.step', { n: step, total: TOTAL_STEPS })
  document.querySelector('[data-progress-fill]').style.width = pct + '%'
  document.querySelector('[data-progress-pct]').textContent = pct + '%'
}

// ─────────────────────────────────────────────────────────────────────────────
// Старт
// ─────────────────────────────────────────────────────────────────────────────
function boot () {
  applyDocumentLocale()
  cards = Array.from(document.querySelectorAll('.stack-card'))
  applyClasses()

  // Прототип: ?step=N відкриває конкретний крок, ?demo=1 підставляє приклад
  // відповідей (щоб показати воронку, нічого не заповнюючи).
  // У продакшені бекенд задає window.QUIZ_LANG — і тоді обидва вимкнені.
  if (!window.QUIZ_LANG) {
    const params = new URLSearchParams(window.location.search)
    if (params.get('demo') === '1') {
      Object.assign(answers, {
        first_name: 'Олександр', last_name: 'Коваленко',
        email: 'oleksandr@example.com', phone: '+380 67 123 45 67',
        search_time: 'h_5_10', growth_blocker: 'no_deals',
        services: ['family', 'criminal', 'real_estate'],
        desired_clients: 'c_4_10', plan: 'pro', billing: 'monthly'
      })
    }
    const jump = parseInt(params.get('step'), 10)
    if (jump >= 1 && jump <= TOTAL_STEPS) progress.currentStep = jump
  }

  slotStep[0] = progress.currentStep
  renderInto(0, progress.currentStep)
  preRenderNext()
  paintTopBar()

  // Перемикач мови — тільки в режимі прототипу (коли бекенд не задав window.QUIZ_LANG).
  const switcher = document.querySelector('[data-lang-switcher]')
  if (switcher && !window.QUIZ_LANG) {
    switcher.hidden = false
    switcher.innerHTML = SUPPORTED_LOCALES.map((l) => `
      <button class="lang-btn${l === i18nState.locale ? ' active' : ''}" data-lang="${l}">${l.toUpperCase()}</button>`).join('')
    switcher.addEventListener('click', (e) => {
      const b = e.target.closest('[data-lang]')
      if (!b || b.dataset.lang === i18nState.locale) return
      setLocale(b.dataset.lang)
      window.location.reload()
    })
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
else boot()

// Навігація назад — доступна ззовні (наприклад, для кнопки браузера).
window.QUIZ2 = { goBack, goNext, answers, progress }
