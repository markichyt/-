<script>
import { SUPPORTED_LOCALES, setLocale } from '../../../i18n/index.js'

// Демо-перемикач локалі. На бою локаль приходить із window.QUIZ_LANG,
// тож перемикач потрібен лише для прототипу/демо на GitHub Pages.
const LABELS = { uk: '🇺🇦 UA', en: '🇺🇸 US', 'en-GB': '🇬🇧 UK', 'en-AE': '🇦🇪 AE', pl: '🇵🇱 PL' }

export default {
  name: 'LanguageSwitcher',
  data() {
    return { locales: SUPPORTED_LOCALES, labels: LABELS }
  },
  computed: {
    current() {
      return this.$i18n.locale
    }
  },
  methods: {
    pick(loc) {
      setLocale(loc)
    }
  }
}
</script>

<template>
  <div class="lang-switcher">
    <button
      v-for="loc in locales"
      :key="loc"
      type="button"
      class="lang-btn"
      :class="{ active: current === loc }"
      @click="pick(loc)"
    >{{ labels[loc] }}</button>
  </div>
</template>

<style scoped>
.lang-switcher {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin: 2px 0 6px;
  flex-wrap: wrap;
}
.lang-btn {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--border, #e5e7eb);
  background: transparent;
  color: var(--text-muted, #64748b);
  cursor: pointer;
  transition: background .15s, color .15s, border-color .15s;
}
.lang-btn:hover { border-color: var(--accent, #00b4d8); }
.lang-btn.active {
  background: var(--accent, #00b4d8);
  color: #fff;
  border-color: var(--accent, #00b4d8);
}
</style>
