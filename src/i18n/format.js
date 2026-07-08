import { i18n } from './index.js'

// Валютні правила по локалі: символ, позиція, роздільники, суфікси тисяч/млн.
const CURRENCY = {
  uk: { symbol: '₴', pos: 'after', group: ' ', decimal: '.', k: 'К', m: 'М' },
  en: { symbol: '$', pos: 'before', group: ',', decimal: '.', k: 'K', m: 'M' },
  'en-GB': { symbol: '£', pos: 'before', group: ',', decimal: '.', k: 'K', m: 'M' },
  'en-AE': { symbol: 'AED', pos: 'before', space: ' ', group: ',', decimal: '.', k: 'K', m: 'M' },
  pl: { symbol: 'zł', pos: 'after', group: ' ', decimal: ',', k: ' tys.', m: ' mln' }
}

// Дозволяємо бекенду перевизначити символ валюти через window.QUIZ_CURRENCY.
const SYMBOL_BY_CODE = { UAH: '₴', USD: '$', GBP: '£', PLN: 'zł', AED: 'AED', EUR: '€' }

function rules(locale) {
  const base = CURRENCY[locale] || CURRENCY.uk
  if (typeof window !== 'undefined' && window.QUIZ_CURRENCY) {
    const c = String(window.QUIZ_CURRENCY)
    const symbol = SYMBOL_BY_CODE[c.toUpperCase()] || c
    return { ...base, symbol }
  }
  return base
}

function withSymbol(str, r) {
  return r.pos === 'before' ? r.symbol + (r.space || '') + str : str + ' ' + r.symbol
}

function group(n, sep) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep)
}

function trimDecimal(num, sep) {
  // 1.90 → '1.9', 12.0 → '12'; підставляє локальний десятковий роздільник
  return String(num).replace(/\.0+$/, '').replace('.', sep)
}

// Повна сума з валютою: 1599 → '1 599 ₴' / '$199' / '1 599 zł'.
export function formatMoney(value, locale = i18n.locale) {
  const r = rules(locale)
  return withSymbol(group(Number(value) || 0, r.group), r)
}

// Компактна сума: 490000 → '490К ₴' / '$490K'; 1150000 → '1.15М ₴'.
export function formatMoneyCompact(value, locale = i18n.locale) {
  const r = rules(locale)
  const n = Number(value) || 0
  if (n >= 1e6) return withSymbol(trimDecimal(Math.round((n / 1e6) * 100) / 100, r.decimal) + r.m, r)
  if (n >= 1e3) return withSymbol(trimDecimal(Math.round((n / 1e3) * 10) / 10, r.decimal) + r.k, r)
  return withSymbol(group(n, r.group), r)
}

// Число без валюти, з локальною групуванням: 100000 → '100 000' / '100,000'.
export function formatNumber(value, locale = i18n.locale) {
  return group(Number(value) || 0, rules(locale).group)
}

// Лише символ валюти поточної локалі.
export function currencySymbol(locale = i18n.locale) {
  return rules(locale).symbol
}

// Афікс валюти для лічильників сцен: {prefix, suffix} під позицію символу.
export function currencyAffix(locale = i18n.locale) {
  const r = rules(locale)
  return r.pos === 'before' ? { prefix: r.symbol, suffix: '' } : { prefix: '', suffix: ' ' + r.symbol }
}

// Мета валюти: символ + чи стоїть перед числом.
export function currencyMeta(locale = i18n.locale) {
  const r = rules(locale)
  return { symbol: r.symbol, before: r.pos === 'before' }
}
