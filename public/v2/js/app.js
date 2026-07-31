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
  PAIN_BRANCHES, buildTierFeatures, computeDiagnosis, metaPainOf, iconPath, formatMoney, formatNumber
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

// Зациклене відео, що грає одразу. Автоплей дозволений браузерами лише без
// звуку, тож стартуємо muted; за натиском (кнопка або саме відео) вмикаємо
// звук і перезапускаємо з початку — щоб глядач почув від першого слова.
function wireLoopingVideo (root) {
  const video = root.querySelector('video')
  const btn = root.querySelector('[data-sound]')

  // Якщо вкладка була у фоні, браузер відкладає автоплей — повторюємо запуск,
  // щойно відео готове і щойно вкладка стає видимою.
  const tryPlay = () => { video.play().catch(() => {}) }
  const onVisible = () => { if (!document.hidden) tryPlay() }
  tryPlay()
  video.addEventListener('canplay', tryPlay)
  document.addEventListener('visibilitychange', onVisible)

  function setSound (on) {
    video.muted = !on
    btn.textContent = t(on ? 'common.videoSound.off' : 'common.videoSound.on')
    btn.classList.toggle('on', on)
    if (on) {
      video.currentTime = 0
      tryPlay()
    }
  }
  btn.addEventListener('click', () => setSound(video.muted))
  video.addEventListener('click', () => setSound(video.muted))

  return () => {
    document.removeEventListener('visibilitychange', onVisible)
    video.pause()
  }
}

// ── 1. Привітання: Андрій вітається й запрошує пройти опитування ───────────
renderers.greeting = function (slide, root) {
  root.innerHTML = frame(slide, `
    <div class="cv-player" data-player>
      <video class="cv-video" src="assets/greeting.mp4" poster="assets/greeting-poster.jpg"
             autoplay muted loop playsinline preload="auto"></video>
      <button class="vv-sound" data-sound>${t('common.videoSound.on')}</button>
    </div>
    ${actionBar(continueBtn(t('cards.greeting.start')))}
  `, true)

  const dispose = wireLoopingVideo(root)
  root.querySelector('[data-continue]').addEventListener('click', goNext)
  return dispose
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

  // Без відео: привітальний ролик тепер на кроці 1, тут лише форма.
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
// ── 7. Рішення: квадратне відео Андрія + заголовок під мета-біль + інфографіка
renderers.solution = function (slide, root) {
  const d = computeDiagnosis(answers)
  const meta = metaPainOf(answers)

  root.innerHTML = frame(slide, `
    <div class="sol-wrap">
      <div class="sol-meta sol-meta--${meta}">${t('cards.solution.meta.' + meta)}</div>

      <div class="cv-player" data-player>
        <video class="cv-video" src="assets/solution.mp4" poster="assets/solution-poster.jpg"
               autoplay muted loop playsinline preload="auto"></video>
        <button class="vv-sound" data-sound>${t('common.videoSound.on')}</button>
      </div>

      <div class="sol-gain">
        <div class="sol-gain-eyebrow">${t('cards.solution.gainEyebrow')}</div>
        <div class="sol-gain-num">+${d.missedLow}–${d.missedHigh}</div>
        <div class="sol-gain-cap">${t('cards.solution.gainCap')}</div>
        <div class="sol-gain-rev">
          <span>${t('cards.solution.gainRevenueLabel')}</span>
          <b>${formatNumber(d.revenueLow)} – ${formatMoney(d.revenueHigh)}</b>
        </div>
      </div>

      <div class="sol-proof">
        ${['lawyers', 'growth', 'renew'].map((k) => `
          <div class="sol-proof-item">
            <div class="sol-proof-num">${t('cards.solution.proof.' + k)}</div>
            <div class="sol-proof-cap">${t('cards.solution.proof.' + k + 'Cap')}</div>
          </div>`).join('')}
      </div>

      ${actionBar(continueBtn(t('cards.solution.cta')))}
    </div>
  `, true)

  const dispose = wireLoopingVideo(root)
  root.querySelector('[data-continue]').addEventListener('click', goNext)
  return dispose
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

      <!-- Замість блоку довіри — плашка замовлення дзвінка. Номер уже є
           з кроку знайомства, тож лишається підтвердити або виправити його. -->
      <div class="cb-block" data-callback>
        <button class="cb-plaque" data-cb-toggle>
          <span class="cb-icon">${icon('phone', 17)}</span>
          <span class="cb-text">${t('cards.callback.plaque')}<span class="cb-phone">${esc(answers.phone) || t('cards.callback.noPhone')}</span></span>
          <span class="cb-arrow">${icon('chevron-right', 16)}</span>
        </button>
        <div class="cb-edit" data-cb-edit hidden>
          <div class="cb-edit-label">${t('cards.callback.label')}</div>
          <input type="tel" data-cb-input value="${esc(answers.phone)}" placeholder="+380 67 123 45 67" autocomplete="tel">
          <button class="cb-submit" data-cb-submit>${t('cards.callback.submit')}</button>
        </div>
      </div>

    </div>

    <!-- Кнопка вибору плану — у стандартній панелі дій, як на решті кроків.
         Раніше вона стояла останнім блоком усередині .profiles-pricing-wrap,
         і до неї треба було прокрутити всю довгу картку. -->
    <div class="card-action-bar pp-action-bar">
      <button class="pp-cta-btn pp-cta-${PLAN_SLIDES[index].tier}" data-cta>${t('cards.profilesPricing.cta.' + PLAN_SLIDES[index].tier)}</button>
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

  // «Обрати план» → одразу на крок оплати.
  cta.addEventListener('click', () => { answers.plan = PLAN_SLIDES[index].tier; saveAnswers(); goNext() })

  // ── Плашка «Замовити дзвінок» ──────────────────────────────────────────────
  const cbBlock = root.querySelector('[data-callback]')
  const cbEdit = cbBlock.querySelector('[data-cb-edit]')
  const cbInput = cbBlock.querySelector('[data-cb-input]')
  const cbSubmit = cbBlock.querySelector('[data-cb-submit]')

  cbBlock.querySelector('[data-cb-toggle]').addEventListener('click', () => {
    cbEdit.hidden = !cbEdit.hidden
    if (!cbEdit.hidden) cbInput.focus()
  })
  cbInput.addEventListener('input', () => {
    cbSubmit.disabled = cbInput.value.replace(/\D/g, '').length < 9
  })
  cbSubmit.addEventListener('click', () => {
    const phone = cbInput.value.trim()
    if (phone.replace(/\D/g, '').length < 9) return
    answers.phone = phone
    answers.lead_type = 'callback_request'
    saveAnswers()
    cbSubmit.disabled = true
    cbSubmit.textContent = t('cards.callback.sending')
    submitAnswers(() => {
      cbBlock.innerHTML = `<div class="cb-done">${t('cards.callback.done', { phone: esc(phone) })}</div>`
    })
  })

  paint()
  return () => { if (avatarVideo) avatarVideo.pause() }
}

// ── 9. Оплата (порт PaymentCard квіза 1) ─────────────────────────────────────
const PAY_PERIODS = { '1_month': 1, '1_year': 12 }
const FAQ_KEYS = ['clients', 'guarantee', 'payment', 'noClients', 'data']

renderers.payment = function (slide, root) {
  let period = PAY_PERIODS[answers.payment_period] ? answers.payment_period : '1_year'

  function summary () {
    const months = PAY_PERIODS[period]
    const isAnnual = period === '1_year'
    const prices = PRICING[isAnnual ? 'annual' : 'monthly']
    const plan = prices[answers.plan] != null ? answers.plan : 'pro'
    // Реальна сума = ціна плану × місяці. «Якірна» ціна така, що знижка
    // за терміновість (−20%) повертає рівно до реальної суми — як у квізі 1.
    const real = prices[plan] * months
    const full = Math.round(real / 0.8)
    return {
      planName: plan === 'base' ? 'Base' : plan === 'pro' ? 'Pro' : 'Premium',
      periodLabel: t('cards.payment.periods.' + period),
      full: formatMoney(full),
      urgency: formatMoney(full - real),
      total: formatMoney(real),
      saved: full - real,
      savedText: formatMoney(full - real)
    }
  }

  function bodyHtml () {
    const s = summary()
    return `
      <div class="pay-period-toggle">
        <button class="pay-period-btn${period === '1_month' ? ' active' : ''}" data-period="1_month">${t('cards.payment.periods.1_month')}</button>
        <button class="pay-period-btn${period === '1_year' ? ' active' : ''}" data-period="1_year">${t('cards.payment.periods.1_year')} <span class="pay-period-save">${t('cards.payment.saveBadge')}</span></button>
      </div>

      <div class="pay-savings-hero"${s.saved > 0 ? '' : ' hidden'}>
        <div class="pay-savings-amount">${s.savedText}</div>
        <div class="pay-savings-text">${t('cards.payment.savedHero')}</div>
      </div>

      <div class="discount-summary">
        <div class="discount-row"><span>${t('cards.payment.rows.plan', { plan: s.planName, period: s.periodLabel })}</span><span>${s.full}</span></div>
        <div class="discount-row"><span>${t('cards.payment.rows.urgency')}</span><span class="saved">-${s.urgency}</span></div>
        <div class="discount-row total"><span>${t('cards.payment.rows.total')}</span><span>${s.total}</span></div>
      </div>`
  }

  root.innerHTML = frame(slide, `
    <div class="pay-wrap">
      ${timerBarHtml('pay-timer-top')}
      <div data-pay-body>${bodyHtml()}</div>

      <div class="payment-icons">
        <svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#1434CB"/><text x="19" y="15" font-size="9" fill="#fff" text-anchor="middle" font-weight="bold" font-family="Arial">VISA</text></svg>
        <svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#252525"/><circle cx="15" cy="12" r="7" fill="#EB001B"/><circle cx="23" cy="12" r="7" fill="#F79E1B"/><path d="M19 6.5a7 7 0 010 11 7 7 0 010-11z" fill="#FF5F00"/></svg>
        <svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#003087"/><text x="19" y="15" font-size="7" fill="#fff" text-anchor="middle" font-weight="bold" font-family="Arial">PayPal</text></svg>
      </div>

      <div class="payment-buttons">
        <button class="btn btn-paypal" data-pay="paypal"><img class="btn-icon-paypal" src="assets/paypal.svg" alt="" width="24" height="24"> ${t('cards.payment.paypal')}</button>
        <button class="btn btn-primary" data-pay="card"><img class="btn-icon-card" src="assets/card-credit.svg" alt="" width="24" height="24"> ${t('cards.payment.card')}</button>
      </div>

      <h3 class="faq-heading">${t('cards.payment.faqHeading')}</h3>
      <div class="faq-list" data-faq>
        ${FAQ_KEYS.map((k, i) => `
          <div class="faq-item" data-faq-i="${i}">
            <div class="faq-question">${t('cards.payment.faq.' + k + '.q')}</div>
            <div class="faq-answer"><div class="faq-answer-inner">${t('cards.payment.faq.' + k + '.a')}</div></div>
          </div>`).join('')}
      </div>
    </div>
  `, true)

  const payBody = root.querySelector('[data-pay-body]')
  function repaint () {
    payBody.innerHTML = bodyHtml()
    payBody.querySelectorAll('[data-period]').forEach((b) => b.addEventListener('click', () => {
      period = b.dataset.period
      answers.payment_period = period
      saveAnswers()
      repaint()
    }))
  }
  repaint()

  root.querySelector('[data-faq]').addEventListener('click', (e) => {
    const item = e.target.closest('.faq-item')
    if (item) item.classList.toggle('open')
  })

  root.querySelectorAll('[data-pay]').forEach((b) => b.addEventListener('click', () => {
    answers.payment_method = b.dataset.pay
    answers.payment_period = period
    answers.lead_type = 'purchase'
    saveAnswers()
    submitAnswers()
    goNext()
  }))
}

// ── 10. Після оплати: профіль (резюме АБО текст про себе) ───────────────────
// 3 000 символів — це МІНІМУМ, а не ціль: більше тільки краще.
const BIO_MIN = 3000

renderers.assessment = function (slide, root) {
  const hasContent = () => !!answers.cv_name || (answers.about || '').length > 0

  let tab = answers.about && !answers.cv_name ? 'bio' : 'cv'

  root.innerHTML = frame(slide, `
    <div class="as-wrap">
      <div class="as-why">
        <div class="as-why-title">${t('cards.assessment.whyTitle')}</div>
        <div class="as-why-lead">${t('cards.assessment.whyLead')}</div>
        <ul class="as-why-list">
          ${['profile', 'google', 'clients'].map((k) => `
            <li>${icon('check', 13)}<span>${t('cards.assessment.why.' + k)}</span></li>`).join('')}
        </ul>
      </div>

      <div class="as-choose">${t('cards.assessment.chooseLabel')}</div>
      <div class="as-tabs" data-tabs>
        <button class="as-tab${tab === 'cv' ? ' active' : ''}" data-tab="cv">
          <span class="as-tab-ico">${icon('upload', 15)}</span>
          <span class="as-tab-name">${t('cards.assessment.tabCv')}</span>
          <span class="as-tab-note">${t('cards.assessment.tabCvNote')}</span>
        </button>
        <button class="as-tab${tab === 'bio' ? ' active' : ''}" data-tab="bio">
          <span class="as-tab-ico">${icon('pen', 15)}</span>
          <span class="as-tab-name">${t('cards.assessment.tabBio')}</span>
          <span class="as-tab-note">${t('cards.assessment.tabBioNote')}</span>
        </button>
      </div>

      <div class="as-pane" data-pane="cv"${tab === 'cv' ? '' : ' hidden'}>
        <div class="upload-area" data-cv-drop>
          <div class="upload-text" data-cv-text>${answers.cv_name || t('cards.assessment.cvPlaceholder')}</div>
          <div class="pu-drop-sub">${t('cards.assessment.cvHint')}</div>
          <input type="file" accept=".pdf,.doc,.docx" hidden>
        </div>
      </div>

      <div class="as-pane" data-pane="bio"${tab === 'bio' ? '' : ' hidden'}>
        <textarea class="card-input as-bio" rows="8" data-bio placeholder="${esc(t('cards.assessment.bioPh'))}">${esc(answers.about)}</textarea>
        <div class="as-bio-meter">
          <div class="as-bio-bar"><div class="as-bio-fill" data-bio-fill style="width:0%"></div></div>
          <div class="as-bio-count" data-bio-count></div>
        </div>
        <div class="as-bio-hint">${t('cards.assessment.bioMinHint')}</div>
      </div>

      <div class="as-warn" data-warn>${t('cards.assessment.warn')}</div>

      ${actionBar(continueBtn(t('cards.assessment.finish')))}
    </div>
  `, true)

  const warnEl = root.querySelector('[data-warn]')
  const bio = root.querySelector('[data-bio]')
  const bioFill = root.querySelector('[data-bio-fill]')
  const bioCount = root.querySelector('[data-bio-count]')

  function repaint () {
    warnEl.hidden = hasContent()

    const len = (answers.about || '').length
    const enough = len >= BIO_MIN
    bioFill.style.width = Math.min(100, (len / BIO_MIN) * 100) + '%'
    bioFill.classList.toggle('enough', enough)
    // До мінімуму показуємо, скільки ще лишилось; після — просто скільки написано,
    // щоб не створювати враження, ніби 3 000 це стеля.
    bioCount.textContent = enough
      ? t('cards.assessment.charEnough', { n: formatNumber(len) })
      : t('cards.assessment.charLeft', { n: formatNumber(BIO_MIN - len) })
    bioCount.classList.toggle('enough', enough)
  }

  root.querySelector('[data-tabs]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]')
    if (!b) return
    tab = b.dataset.tab
    root.querySelectorAll('.as-tab').forEach((n) => n.classList.toggle('active', n === b))
    root.querySelectorAll('[data-pane]').forEach((n) => { n.hidden = n.dataset.pane !== tab })
    if (tab === 'bio') bio.focus()
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
    repaint()
  })

  bio.addEventListener('input', () => {
    answers.about = bio.value
    saveAnswers()
    repaint()
  })

  repaint()

  root.querySelector('[data-continue]').addEventListener('click', (e) => {
    e.currentTarget.disabled = true
    submitAnswers(() => {
      root.innerHTML = `
        <div class="slide-frame card-scroll">
          <div class="fp-done">
            <div class="cal-thanks-icon">${icon('check', 34)}</div>
            <div class="cal-thanks-title">${t('cards.assessment.doneTitle')}</div>
            <div class="cal-thanks-sub">${t('cards.assessment.doneSub', { email: esc(answers.email) })}</div>
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
        desired_clients: 'c_10_30', plan: 'pro', billing: 'monthly'
      })
    }
    // Точкове перевизначення відповідей — щоб відкрити конкретний варіант
    // слайда «Діагноз» (гілка болю / рівень клієнтів / витрачений час).
    const branch = params.get('branch')
    if (branch && PAIN_BRANCHES[branch]) answers.growth_blocker = branch
    const clients = params.get('clients')
    if (clients && DIAGNOSIS.missedByDesired[clients]) answers.desired_clients = clients
    const time = params.get('time')
    if (time && DIAGNOSIS.hoursPerWeek[time] !== undefined) answers.search_time = time

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
