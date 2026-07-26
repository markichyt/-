<script>
import QuizIcon from '../../QuizIcon.vue'
import { quizData } from '../../../store/quizDataStore.js'
import { market } from '../../../../../i18n/marketConfig.js'
import { formatNumber, formatMoney } from '../../../../../i18n/format.js'

// «Ваш потенціал з CONSULTANT» — прогноз нових клієнтів/доходу за напрямами
// користувача. Числа-константи — з marketConfig (aiPotential); підписи та валюта — з i18n.
const PROFESSION_MULTIPLIER = {
  medicine: 1.1, ecology: 0.9, scanner: 0.7, auto: 0.8, business: 1.2, war: 1.0,
  documents: 0.7, debt_collect: 1.1, criminal: 1.15, migration: 1.0, real_estate: 1.2,
  work: 0.85, social: 0.7, family: 0.9, debtor_protection: 1.0, general: 0.8
}
const ROLE_MULTIPLIER = { founder: 1.2, executive: 1.15, self_employed: 1.0, employee: 0.85 }

export default {
  name: 'AiPotentialCard',
  components: { QuizIcon },
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

      // Ліди по каналах → загальна вилка потенційних клієнтів/міс.
      const totalMin = Math.round(15 * multiplier) + Math.round(20 * multiplier) + Math.round(10 * multiplier)
      const totalMax = Math.round(30 * multiplier) + Math.round(40 * multiplier) + Math.round(20 * multiplier)

      // Дохід: вилка + «середнє» (округлене) для великого числа.
      const round1k = (n) => Math.round(n / 1000) * 1000
      const revLow = round1k(totalMin * ap.caseValueLow)
      const revHigh = round1k(totalMax * ap.caseValueHigh)
      const avg = Math.round(((totalMin + totalMax) / 2) * ((ap.caseValueLow + ap.caseValueHigh) / 2) / 10000) * 10000
      // Ціна підписки на слайді (якірна «до знижки» = реальна ÷ 0,8): UA → 1999.
      const subscription = Math.round(ap.ourPlan / 0.8)

      // Підпис із i18n з фолбеком на сирий ключ, якщо перекладу немає.
      const label = (key, fallback) => (this.$te(key) ? this.$t(key) : fallback)
      const serviceNames = services.map((s) => label('slides.services.opt.' + s, String(s).replace(/_/g, ' ')))
      const serviceText = serviceNames.length > 0
        ? serviceNames.slice(0, 3).join(', ') + (serviceNames.length > 3 ? '…' : '')
        : this.$t('cards.aiPotential.serviceFallback')
      const location = quizData.city || quizData.zip || ''

      // Власна команда: підсумок «вилки» зарплат по ролях (значення — з marketConfig).
      const teamLow = ap.teamRoles.reduce((s, r) => s + r.low, 0)
      const teamHigh = ap.teamRoles.reduce((s, r) => s + r.high, 0)

      return {
        totalMin, totalMax,
        avgMoney: formatMoney(avg),
        revenueMin: formatMoney(revLow),
        revenueMax: formatMoney(revHigh),
        subscription: formatMoney(subscription),
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
        teamTotalHigh: formatNumber(teamHigh)
      }
    }
  }
}
</script>

<template>
  <div class="ai-potential">
    <!-- З НАМИ: потенційний заробіток + ліди + підписка -->
    <div class="ap-withus">
      <div class="ap-eyebrow">{{ $t('cards.aiPotential.heroEyebrow') }}</div>
      <div class="ap-hero">≈ {{ model.avgMoney }}</div>
      <div class="ap-avg">{{ $t('cards.aiPotential.avgLabel') }}</div>
      <div class="ap-range">{{ $t('cards.aiPotential.rangeLabel', { low: model.revenueMin, high: model.revenueMax }) }}</div>
      <div class="ap-clients">
        <span class="ap-clients-n">{{ model.totalMin }}–{{ model.totalMax }}</span>
        <span class="ap-clients-t">{{ $t('cards.aiPotential.clientsLabel') }}</span>
      </div>
      <div class="ap-price">{{ $t('cards.aiPotential.priceLabel', { amount: model.subscription }) }}</div>
    </div>

    <!-- БЕЗ НАС: скільки коштувала б власна команда -->
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
    </div>

    <p class="fine-print">
      <strong>{{ $t('cards.aiPotential.finePrintLabel') }}</strong> {{ model.professionLabel }}<template v-if="model.location">, {{ model.location }}</template>, {{ model.roleLabel }}, {{ model.serviceText }}.<br>
      <em>{{ $t('cards.aiPotential.finePrintDisclaimer') }}</em>
    </p>
  </div>
</template>

<style scoped>
.ai-potential { display: flex; flex-direction: column; gap: 12px; }

/* З НАМИ — зелений блок */
.ap-withus {
  background: linear-gradient(135deg, #ecfdf5 0%, #eff6ff 100%);
  border: 1px solid #a7f3d0;
  border-radius: 16px;
  padding: 16px 18px;
  text-align: center;
}
.ap-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: .5px; text-transform: uppercase; color: var(--accent); }
.ap-hero { font-size: 44px; font-weight: 900; line-height: 1; color: #16a34a; letter-spacing: -1px; white-space: nowrap; margin: 8px 0 3px; }
.ap-avg { font-size: 11px; font-weight: 600; color: var(--text-light); }
.ap-range { font-size: 12px; font-weight: 600; color: var(--text-muted); margin-top: 1px; }
.ap-clients {
  margin-top: 12px; background: #fff; border: 1px solid #a7f3d0; border-radius: 12px;
  padding: 10px 12px; display: flex; flex-direction: column; align-items: center; gap: 2px;
}
.ap-clients-n { font-size: 24px; font-weight: 900; color: var(--text-dark); line-height: 1.05; white-space: nowrap; }
.ap-clients-t { font-size: 12px; font-weight: 700; color: var(--text-muted); }
.ap-price {
  margin-top: 12px; display: inline-block; background: #16a34a; color: #fff;
  border-radius: 999px; padding: 8px 16px; font-size: 13px; font-weight: 800;
}

/* БЕЗ НАС — темно-синій блок */
.ap-compare {
  background: linear-gradient(135deg, #0a2540, #143a5e);
  border-radius: 16px; padding: 16px 18px; color: #fff;
}
.ap-compare-q { font-size: 13.5px; color: #cbd5e1; margin-bottom: 10px; }
.ap-compare-q b { color: #fff; }
.ap-team { list-style: none; margin: 0; padding: 0; }
.ap-team li {
  display: flex; justify-content: space-between; align-items: baseline; gap: 8px;
  font-size: 13px; color: #e2e8f0; padding: 5px 0; border-bottom: 1px dashed rgba(255,255,255,.1);
}
.ap-team-cost { color: #fca5a5; font-weight: 600; white-space: nowrap; }
.ap-team-total {
  display: flex; justify-content: space-between; align-items: baseline; gap: 8px;
  font-size: 14px; font-weight: 700; padding: 10px 0 2px;
}
.ap-red { color: #ef4444; white-space: nowrap; }
</style>
