import { ref, onMounted, onUnmounted } from 'vue'

// Shared 24-hour "limited discount" countdown. The deadline is persisted so it
// stays consistent across the pricing and payment steps and across reloads.
const TIMER_KEY = 'clm_timer_end'

function resolveDeadline() {
  let stored = localStorage.getItem(TIMER_KEY)
  if (!stored) {
    stored = String(Date.now() + 24 * 60 * 60 * 1000)
    localStorage.setItem(TIMER_KEY, stored)
  }
  return parseInt(stored, 10)
}

function pad(value) {
  return value < 10 ? '0' + value : '' + value
}

export function useCountdownTimer() {
  const hours = ref('23')
  const minutes = ref('59')
  const seconds = ref('59')
  let intervalId = null

  function tick() {
    const diff = Math.max(0, resolveDeadline() - Date.now())
    hours.value = pad(Math.floor(diff / 3600000))
    minutes.value = pad(Math.floor((diff % 3600000) / 60000))
    seconds.value = pad(Math.floor((diff % 60000) / 1000))
  }

  onMounted(() => {
    tick()
    intervalId = setInterval(tick, 1000)
  })

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
  })

  return { hours, minutes, seconds }
}
