// Shared 24-hour "limited discount" countdown for the pricing and payment steps.
// The deadline is persisted so it stays consistent across steps and reloads.
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

export const countdownTimerMixin = {
  data() {
    return {
      countdownHours: '23',
      countdownMinutes: '59',
      countdownSeconds: '59'
    }
  },
  created() {
    this._countdownInterval = null
  },
  mounted() {
    this.tickCountdown()
    this._countdownInterval = setInterval(this.tickCountdown, 1000)
  },
  beforeDestroy() {
    if (this._countdownInterval) clearInterval(this._countdownInterval)
  },
  methods: {
    tickCountdown() {
      const diff = Math.max(0, resolveDeadline() - Date.now())
      this.countdownHours = pad(Math.floor(diff / 3600000))
      this.countdownMinutes = pad(Math.floor((diff % 3600000) / 60000))
      this.countdownSeconds = pad(Math.floor((diff % 60000) / 1000))
    }
  }
}
