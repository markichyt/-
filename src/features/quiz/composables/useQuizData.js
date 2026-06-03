import { reactive, watch } from 'vue'

// Single shared answer store for the whole quiz (mirrors the original `quizData`
// closure variable). Every slide reads and writes the same reactive object.
const STORAGE_KEY = 'clm_quiz_data'

// ⚠ Replace with the real endpoint when wiring the backend.
const SUBMIT_URL = 'https://your-api.example.com/quiz-submit'

function loadStoredAnswers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const quizData = reactive(loadStoredAnswers())

// Capture UTM parameters from the landing URL exactly once.
;(function captureUtmParams() {
  const params = new URLSearchParams(window.location.search)
  ;['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
    const value = params.get(key)
    if (value) quizData[key] = value
  })
})()

function saveQuizData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizData))
  } catch {
    /* storage unavailable — answers stay in memory only */
  }
}

// Persist on any answer change so a refresh resumes where the user left off.
watch(quizData, saveQuizData, { deep: true })

// POST the collected answers. The callback receives (ok, status, responseText).
function submitQuizData(callback) {
  saveQuizData()
  const payload = JSON.stringify(quizData)
  try {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', SUBMIT_URL, true)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhr.onload = () => {
      const ok = xhr.status >= 200 && xhr.status < 300
      if (callback) callback(ok, xhr.status, xhr.responseText)
    }
    xhr.onerror = () => callback && callback(false, 0, '')
    xhr.send(payload)
  } catch (error) {
    if (callback) callback(false, 0, String(error))
  }
}

function clearStoredAnswers() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function useQuizData() {
  return { quizData, saveQuizData, submitQuizData, clearStoredAnswers, STORAGE_KEY }
}
