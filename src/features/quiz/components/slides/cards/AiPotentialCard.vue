<script>
import QuizIcon from '../../QuizIcon.vue'
import { quizData } from '../../../store/quizDataStore.js'
import { market } from '../../../../../i18n/marketConfig.js'
import { formatNumber } from '../../../../../i18n/format.js'

// «Ваш потенціал з Консультант» — прогноз нових клієнтів/доходу за напрямами
// користувача. Числа-константи — з marketConfig (aiPotential); підписи та валюта — з i18n.
const PROFESSION_MULTIPLIER = {
  medicine: 1.1, ecology: 0.9, scanner: 0.7, auto: 0.8, business: 1.2, war: 1.0,
  documents: 0.7, debt_collect: 1.1, criminal: 1.15, migration: 1.0, real_estate: 1.2,
  work: 0.85, social: 0.7, family: 0.9, debtor_protection: 1.0, general: 0.8
}
const ROLE_MULTIPLIER = { founder: 1.2, executive: 1.15, self_employed: 1.0, employee: 0.85 }

// Іконки блоку «що входить у підписку» (підписи — в i18n cards.aiPotential.how).
const HOW_ITEMS = [
  { key: 'marketing', icon: 'megaphone' },
  { key: 'content', icon: 'film' },
  { key: 'leads', icon: 'search' },
  { key: 'clients', icon: 'users' }
]

export default {
  name: 'AiPotentialCard',
  components: { QuizIcon },
  data() {
    return { howItems: HOW_ITEMS }
  },
  computed: {
    model() {
      const ap = market(this.$i18n.locale).aiPotential
      const professions = Array.isArray(quizData.profession)
        ? quizData.profession
        : (quizData.profession ? [quizData.profession] : [])
      const role = quizData.role || 'self_employed'
      const services = quizData.services || []

      const serviceMultiplier = 1 + Math.min(services.length, 8) * 0.05
      const professionMultiplier = professions.length
        ? Math.max(...professions.map((p) => PROFESSION_MULTIPLIER[p] || 0.9))
        : 0.9
      const multiplier = professionMultiplier * (ROLE_MULTIPLIER[role] || 1.0) * serviceMultiplier

      const seoMin = Math.round(15 * multiplier)
      const seoMax = Math.round(30 * multiplier)
      const adsMin = Math.round(20 * multiplier)
      const adsMax = Math.round(40 * multiplier)
      const socMin = Math.round(10 * multiplier)
      const socMax = Math.round(20 * multiplier)
      const totalMin = seoMin + adsMin + socMin
      const totalMax = seoMax + adsMax + socMax

      // Підпис із i18n з фолбеком на сирий ключ, якщо перекладу немає.
      const label = (key, fallback) => (this.$te(key) ? this.$t(key) : fallback)
      const serviceNames = services.map((s) => label('slides.services.opt.' + s, s.replace(/_/g, ' ')))
      const serviceText = serviceNames.length > 0
        ? serviceNames.slice(0, 3).join(', ') + (serviceNames.length > 3 ? '…' : '')
        : this.$t('cards.aiPotential.serviceFallback')
      const location = quizData.city || quizData.zip || ''

      // Власна команда: підсумок «вилки» зарплат по ролях (значення — з marketConfig).
      const teamLow = ap.teamRoles.reduce((s, r) => s + r.low, 0)
      const teamHigh = ap.teamRoles.reduce((s, r) => s + r.high, 0)

      return {
        seoMin, seoMax, adsMin, adsMax, socMin, socMax, totalMin, totalMax,
        revenueMin: formatNumber(totalMin * ap.caseValueLow),
        revenueMax: formatNumber(totalMax * ap.caseValueHigh),
        professionLabel: professions.length
          ? professions.map((p) => label('slides.profession.opt.' + p, p)).join(', ')
          : this.$t('cards.aiPotential.professionFallback'),
        roleLabel: label('cards.aiPotential.roleShort.' + role, role),
        location,
        serviceText,
        teamRoles: ap.teamRoles.map((r) => ({
          key: r.key,
          cost: this.$t('cards.aiPotential.teamRoleCost', { low: r.low / 1000, high: r.high / 1000 })
        })),
        teamTotalLow: formatNumber(teamLow),
        teamTotalHigh: formatNumber(teamHigh),
        ourPlan: formatNumber(ap.ourPlan),
        saveHigh: formatNumber(teamHigh - ap.ourPlan),
        cheaperHigh: Math.round(teamHigh / ap.ourPlan)
      }
    }
  }
}
</script>

<template>
  <div class="ai-potential">
    <!-- УДАР 1: що ви отримуєте -->
    <div class="ap-hero">
      <div class="ap-hero-eyebrow">{{ $t('cards.aiPotential.heroEyebrow') }}</div>
      <div class="ap-hero-main">
        <span class="ap-hero-num">{{ model.totalMin }}–{{ model.totalMax }}</span>
        <span class="ap-hero-cap" v-html="$t('cards.aiPotential.heroCapHtml')" />
      </div>
      <div class="ap-hero-money">{{ $t('cards.aiPotential.revenue', { low: model.revenueMin, high: model.revenueMax }) }} <span>{{ $t('cards.aiPotential.revenueCaption') }}</span></div>
      <div class="ap-channels">
        <span>{{ $t('cards.aiPotential.channels.seo', { min: model.seoMin, max: model.seoMax }) }}</span>
        <span>{{ $t('cards.aiPotential.channels.ads', { min: model.adsMin, max: model.adsMax }) }}</span>
        <span>{{ $t('cards.aiPotential.channels.social', { min: model.socMin, max: model.socMax }) }}</span>
      </div>
    </div>

    <!-- УДАР 2+3: скільки це коштувало б самому vs з нами -->
    <div class="ap-compare">
      <div class="ap-compare-q" v-html="$t('cards.aiPotential.compareQ')" />
      <ul class="ap-team">
        <li v-for="r in model.teamRoles" :key="r.key">
          <span>{{ $t('cards.aiPotential.teamRoles.' + r.key) }}</span><span class="ap-team-cost">{{ r.cost }}</span>
        </li>
      </ul>
      <div class="ap-team-total">
        <span>{{ $t('cards.aiPotential.teamTotalLabel') }}</span>
        <span class="ap-red">{{ $t('cards.aiPotential.teamTotal', { low: model.teamTotalLow, high: model.teamTotalHigh }) }}</span>
      </div>
      <div class="ap-us">
        <span>{{ $t('cards.aiPotential.usLabel') }}</span>
        <span class="ap-green">{{ $t('cards.aiPotential.ourPlan', { amount: model.ourPlan }) }}</span>
      </div>
      <div class="ap-punch" v-html="$t('cards.aiPotential.punchHtml', { times: model.cheaperHigh, save: model.saveHigh })" />
    </div>

    <!-- УДАР 4: як це працює -->
    <div class="ap-how">
      <div class="ap-how-title">{{ $t('cards.aiPotential.howTitle') }}</div>
      <div class="ap-how-item" v-for="item in howItems" :key="item.key">
        <span class="ap-how-ic"><QuizIcon :name="item.icon" /></span>
        <span class="ap-how-txt"><b>{{ $t('cards.aiPotential.how.' + item.key + '.t') }}</b> — {{ $t('cards.aiPotential.how.' + item.key + '.d') }}</span>
      </div>
    </div>

    <p class="fine-print">
      <strong>{{ $t('cards.aiPotential.finePrintLabel') }}</strong> {{ model.professionLabel }}<template v-if="model.location">, {{ model.location }}</template>, {{ model.roleLabel }}, {{ model.serviceText }}.<br>
      <em>{{ $t('cards.aiPotential.finePrintDisclaimer') }}</em>
    </p>
  </div>
</template>

<style scoped>
.ai-potential { display: flex; flex-direction: column; gap: 12px; }

/* УДАР 1 — hero */
.ap-hero {
  background: linear-gradient(135deg, #ecfeff 0%, #eff6ff 100%);
  border: 1px solid #cffafe;
  border-radius: 16px;
  padding: 16px 18px;
  text-align: center;
}
.ap-hero-eyebrow { font-size: 12px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; color: var(--accent); }
.ap-hero-main { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 6px 0 4px; }
.ap-hero-num { font-size: 46px; font-weight: 800; line-height: 1; color: var(--text-dark); white-space: nowrap; }
.ap-hero-cap { font-size: 13px; font-weight: 600; color: var(--text-muted); text-align: left; line-height: 1.15; }
.ap-hero-money { font-size: 18px; font-weight: 800; color: #16a34a; }
.ap-hero-money span { font-size: 12px; font-weight: 600; color: var(--text-light); }
.ap-channels { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-top: 10px; }
.ap-channels span {
  font-size: 11px; font-weight: 600; color: var(--text-muted);
  background: rgba(255,255,255,.7); border: 1px solid #d1e9f0; border-radius: 999px; padding: 3px 9px;
}

/* УДАР 2+3 — порівняння */
.ap-compare {
  background: linear-gradient(135deg, #0a2540, #143a5e);
  border-radius: 16px; padding: 16px 18px; color: #fff;
}
.ap-compare-q { font-size: 13.5px; color: #cbd5e1; margin-bottom: 10px; }
.ap-compare-q b { color: #fff; }
.ap-team { list-style: none; margin: 0 0 10px; padding: 0; }
.ap-team li {
  display: flex; justify-content: space-between; align-items: baseline; gap: 8px;
  font-size: 13px; color: #e2e8f0; padding: 4px 0; border-bottom: 1px dashed rgba(255,255,255,.1);
}
.ap-team-cost { color: #fca5a5; font-weight: 600; white-space: nowrap; }
.ap-team-total, .ap-us {
  display: flex; justify-content: space-between; align-items: baseline; gap: 8px;
  font-size: 14px; font-weight: 700; padding: 8px 0;
}
.ap-team-total { border-bottom: 1px solid rgba(255,255,255,.14); }
.ap-red { color: #ef4444; white-space: nowrap; }
.ap-green { color: #22c55e; white-space: nowrap; }
.ap-punch {
  margin-top: 10px; text-align: center; font-size: 12px; color: #e2f7ec;
  background: rgba(34,197,94,.14); border: 1px solid rgba(34,197,94,.35);
  border-radius: 10px; padding: 9px 8px; white-space: nowrap;
}
.ap-punch b { color: #4ade80; font-size: 13px; }

/* УДАР 4 — як це працює */
.ap-how {
  background: #f8fafc; border: 1px solid var(--border); border-radius: 16px; padding: 14px 16px;
}
.ap-how-title { font-size: 13px; font-weight: 800; color: var(--text-dark); margin-bottom: 10px; }
.ap-how-item { display: flex; align-items: flex-start; gap: 10px; padding: 6px 0; }
.ap-how-ic {
  flex-shrink: 0; width: 30px; height: 30px; border-radius: 9px;
  background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center;
}
.ap-how-txt { font-size: 12.5px; color: var(--text-muted); line-height: 1.35; }
.ap-how-txt b { color: var(--text-dark); }
</style>
