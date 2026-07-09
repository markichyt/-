import Vue from 'vue'
import VueI18n from 'vue-i18n'
import uk from './locales/uk.js'
import en from './locales/en.js'
import enGB from './locales/en-GB.js'
import enAE from './locales/en-AE.js'
import pl from './locales/pl.js'
import ru from './locales/ru.js'

Vue.use(VueI18n)

// Локали, які підтримуємо. uk — еталон і дефолт. ru — російський переклад
// для українського ринку (код як на бекенді; валюта ₴ і ринкові дані ті самі, що й uk).
export const SUPPORTED_LOCALES = ['uk', 'ru', 'en', 'en-GB', 'en-AE', 'pl']
export const DEFAULT_LOCALE = 'uk'

// BCP-47 теги для атрибута <html lang> та форматування.
export const BCP47 = { uk: 'uk-UA', ru: 'ru-UA', en: 'en-US', 'en-GB': 'en-GB', 'en-AE': 'en-AE', pl: 'pl-PL' }

// Зводить довільний код мови ('en_US', 'uk-UA', 'PL', …) до нашої локалі.
export function normalizeLocale(raw) {
  if (!raw) return null
  const s = String(raw).trim().replace('_', '-')
  const exact = SUPPORTED_LOCALES.find((l) => l.toLowerCase() === s.toLowerCase())
  if (exact) return exact
  const [lang, region] = s.toLowerCase().split('-')
  if (lang === 'en') return region === 'gb' || region === 'uk' ? 'en-GB' : region === 'ae' ? 'en-AE' : 'en'
  const byLang = SUPPORTED_LOCALES.find((l) => l.split('-')[0] === lang)
  return byLang || null
}

// Порядок вибору локалі (за контрактом бекенда, див. план):
// window.QUIZ_LANG → ?lang= → localStorage → мова браузера → дефолт.
export function resolveLocale() {
  if (typeof window !== 'undefined') {
    const fromBackend = normalizeLocale(window.QUIZ_LANG)
    if (fromBackend) return fromBackend
    try {
      const fromUrl = normalizeLocale(new URLSearchParams(window.location.search).get('lang'))
      if (fromUrl) return fromUrl
      const fromSaved = normalizeLocale(window.localStorage.getItem('clm_quiz_lang'))
      if (fromSaved) return fromSaved
    } catch (e) {
      /* URL/localStorage недоступні — ігноруємо */
    }
    const fromNav = normalizeLocale(window.navigator && window.navigator.language)
    if (fromNav) return fromNav
  }
  return DEFAULT_LOCALE
}

export const i18n = new VueI18n({
  locale: resolveLocale(),
  fallbackLocale: { 'en-GB': ['en'], 'en-AE': ['en'], ru: ['uk'], default: ['uk'] },
  messages: { uk, ru, en, 'en-GB': enGB, 'en-AE': enAE, pl },
  silentFallbackWarn: true
})

// Проставляє <html lang> та <title> під поточну локаль.
export function applyDocumentLocale(locale = i18n.locale) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('lang', BCP47[locale] || 'uk-UA')
  const title = i18n.t('meta.title')
  if (title && title !== 'meta.title') document.title = title
}

// Перемикання локалі у рантаймі (демо-перемикач, Фаза 5).
export function setLocale(locale) {
  const norm = normalizeLocale(locale) || DEFAULT_LOCALE
  i18n.locale = norm
  try {
    window.localStorage.setItem('clm_quiz_lang', norm)
  } catch (e) {
    /* localStorage недоступний */
  }
  applyDocumentLocale(norm)
}
