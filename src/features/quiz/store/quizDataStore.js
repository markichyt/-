import Vue from 'vue'

// Shared answer store for the whole quiz. Built with Vue.observable so every
// component reacts to the same object.
//
// Vue 2 reactivity caveat: properties added AFTER an object becomes reactive
// are not tracked. So every field the quiz can write is pre-declared here; new
// keys are never introduced at runtime.
const STORAGE_KEY = 'clm_quiz_data'

// ⚠ Replace with the real endpoint when wiring the backend.
const SUBMIT_URL = 'https://your-api.example.com/quiz-submit'

function createDefaultAnswers() {
  return {
    first_name: '', last_name: '', email: '', phone: '', phone_country: 'UA', password: '', password_confirm: '', photo_name: '', photo_data: '',
    profession: [], city: '', zip: '', role: '',
    services: [], custom_services: '',
    channels: [], preferred_way: '', marketing_time: '', ad_budget: '', team: [],
    period: '', time_on_platform: '',
    plan: '', billing: '', tier: '', lead_type: '', firm: null,
    desired_clients: undefined, desired_revenue: undefined,
    about: '', cv_name: '', company_logo_name: '', referral_code: '', profile_method: '',
    payment_method: '', payment_period: '', submitted_at: '',
    utm_source: '', utm_medium: '', utm_campaign: '', utm_term: '', utm_content: ''
  }
}

function loadStoredAnswers() {
  const answers = createDefaultAnswers()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) Object.assign(answers, JSON.parse(raw))
  } catch (error) {
    /* corrupt storage — fall back to defaults */
  }
  return answers
}

export const quizData = Vue.observable(loadStoredAnswers())

// Capture UTM parameters from the landing URL exactly once.
;(function captureUtmParams() {
  const params = new URLSearchParams(window.location.search)
  ;['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
    const value = params.get(key)
    if (value) quizData[key] = value
  })
})()

export function saveQuizData() {
  try {
    // Паролі не зберігаємо у localStorage — лише в памʼяті та у payload на бекенд.
    const { password, password_confirm, ...safe } = quizData
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe))
  } catch (error) {
    /* storage unavailable — answers stay in memory only */
  }
}

// POST the collected answers. The callback receives (ok, status, responseText).
export function submitQuizData(callback) {
  saveQuizData()
  const payload = JSON.stringify(quizData)
  try {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', SUBMIT_URL, true)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhr.onload = function () {
      const ok = xhr.status >= 200 && xhr.status < 300
      if (callback) callback(ok, xhr.status, xhr.responseText)
    }
    xhr.onerror = function () {
      if (callback) callback(false, 0, '')
    }
    xhr.send(payload)
  } catch (error) {
    if (callback) callback(false, 0, String(error))
  }
}

export function clearStoredAnswers() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    /* ignore */
  }
}

export { STORAGE_KEY }
