<script>
import QuizIcon from '../../QuizIcon.vue'
import { quizData } from '../../../store/quizDataStore.js'

// «Ваш потенціал з Консультант» — прогноз нових клієнтів/доходу за напрямами
// користувача, поданий як зрозуміла історія: що ви отримуєте → скільки це
// коштувало б власною командою → скільки коштує з нами.
const PROFESSION_MULTIPLIER = {
  medicine: 1.1, ecology: 0.9, scanner: 0.7, auto: 0.8, business: 1.2, war: 1.0,
  documents: 0.7, debt_collect: 1.1, criminal: 1.15, migration: 1.0, real_estate: 1.2,
  work: 0.85, social: 0.7, family: 0.9, debtor_protection: 1.0, general: 0.8
}
const ROLE_MULTIPLIER = { founder: 1.2, executive: 1.15, self_employed: 1.0, employee: 0.85 }
const PROFESSION_LABELS = {
  lawyer: 'Юрист', attorney: 'Адвокат', accountant: 'Бухгалтер/Аудитор', notary: 'Нотаріус',
  enforcement: 'Приватний виконавець', liquidator: 'Ліквідатор', patent: 'Патентні повірені',
  customs: 'Митний брокер', engineer: 'Інженер', collector: 'Колектор', other: 'Інше'
}
const ROLE_LABELS = { self_employed: 'Самозайнятий', employee: 'Працівник', executive: 'Керівник', founder: 'Засновник' }
const SERVICE_LABELS = {
  auto: 'Автомобільні спори', corporate: 'Господарське та корпоративне право',
  debt_collection: 'Стягнення заборгованості', migration: 'Міграційне право',
  real_estate: 'Нерухомість та земельне право', labour: 'Трудове право',
  family: 'Сімейне право', inheritance: 'Спадкове право', divorce: 'Розірвання шлюбу',
  social: 'Соціальні виплати та спори', debtor_protection: 'Захист боржника',
  military: 'Військове право', criminal: 'Кримінальне право',
  documents: 'Підготовка та правовий аналіз документів', other: 'Інші юридичні послуги'
}

// Що робить власна маркетингова команда (ринок України, ₴/міс) — той самий
// результат, який Консультант дає в одній підписці.
const TEAM_ROLES = [
  { t: 'SEO-фахівець', low: 15000, high: 35000 },
  { t: 'Таргетолог (реклама)', low: 12000, high: 30000 },
  { t: 'Контент-мейкер', low: 12000, high: 25000 },
  { t: 'Відеомонтажер', low: 12000, high: 25000 },
  { t: 'SMM-менеджер', low: 10000, high: 25000 }
]
const OUR_PLAN = 1599
const CASE_VALUE_LOW = 8000 // ₴ за клієнта (нижня межа)
const CASE_VALUE_HIGH = 30000 // ₴ за клієнта (верхня межа)

const HOW_ITEMS = [
  { icon: 'megaphone', t: 'Маркетинг «під ключ»', d: 'Просуваємо вас у Google, рекламі та соцмережах' },
  { icon: 'film', t: 'Контент-завод', d: 'Регулярний контент для сайту, реклами й бренду' },
  { icon: 'search', t: 'Готові ліди', d: 'Якісні заявки від клієнтів у ваших напрямах' },
  { icon: 'users', t: 'Клієнти сервісу', d: 'Люди, що вже шукають юриста на Консультант' }
]

export default {
  name: 'AiPotentialCard',
  components: { QuizIcon },
  data() {
    return { howItems: HOW_ITEMS }
  },
  computed: {
    model() {
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

      const serviceNames = services.map((service) => SERVICE_LABELS[service] || service.replace(/_/g, ' '))
      const serviceText = serviceNames.length > 0
        ? serviceNames.slice(0, 3).join(', ') + (serviceNames.length > 3 ? '…' : '')
        : 'Загальне'
      const location = quizData.city || quizData.zip || ''

      // Власна команда: підсумок «вилки» зарплат по ролях.
      const teamLow = TEAM_ROLES.reduce((s, r) => s + r.low, 0)
      const teamHigh = TEAM_ROLES.reduce((s, r) => s + r.high, 0)
      const fmt = (n) => n.toLocaleString('uk-UA')

      return {
        seoMin, seoMax, adsMin, adsMax, socMin, socMax, totalMin, totalMax,
        revenueMin: (totalMin * CASE_VALUE_LOW).toLocaleString('uk-UA'),
        revenueMax: (totalMax * CASE_VALUE_HIGH).toLocaleString('uk-UA'),
        professionLabel: professions.length
          ? professions.map((p) => PROFESSION_LABELS[p] || p).join(', ')
          : 'Спеціаліст',
        roleLabel: ROLE_LABELS[role] || role,
        location,
        serviceText,
        teamRoles: TEAM_ROLES.map((r) => ({ t: r.t, range: (r.low / 1000) + '–' + (r.high / 1000) + ' тис' })),
        teamTotalLow: fmt(teamLow),
        teamTotalHigh: fmt(teamHigh),
        ourPlan: fmt(OUR_PLAN),
        saveHigh: fmt(teamHigh - OUR_PLAN),
        cheaperHigh: Math.round(teamHigh / OUR_PLAN)
      }
    }
  }
}
</script>

<template>
  <div class="ai-potential">
    <!-- УДАР 1: що ви отримуєте -->
    <div class="ap-hero">
      <div class="ap-hero-eyebrow">З нами ви отримуєте</div>
      <div class="ap-hero-main">
        <span class="ap-hero-num">{{ model.totalMin }}–{{ model.totalMax }}</span>
        <span class="ap-hero-cap">потенційних клієнтів<br>щомісяця</span>
      </div>
      <div class="ap-hero-money">≈ {{ model.revenueMin }} – {{ model.revenueMax }} ₴ <span>доходу / міс</span></div>
      <div class="ap-channels">
        <span>SEO {{ model.seoMin }}–{{ model.seoMax }}</span>
        <span>Реклама {{ model.adsMin }}–{{ model.adsMax }}</span>
        <span>Соцмережі {{ model.socMin }}–{{ model.socMax }}</span>
      </div>
    </div>

    <!-- УДАР 2+3: скільки це коштувало б самому vs з нами -->
    <div class="ap-compare">
      <div class="ap-compare-q">Щоб отримати такий потік самостійно — потрібна <b>ціла команда:</b></div>
      <ul class="ap-team">
        <li v-for="r in model.teamRoles" :key="r.t">
          <span>{{ r.t }}</span><span class="ap-team-cost">{{ r.range }} ₴</span>
        </li>
      </ul>
      <div class="ap-team-total">
        <span>Разом власна команда</span>
        <span class="ap-red">{{ model.teamTotalLow }}–{{ model.teamTotalHigh }} ₴/міс</span>
      </div>
      <div class="ap-us">
        <span>Консультант — усе в одному</span>
        <span class="ap-green">{{ model.ourPlan }} ₴/міс</span>
      </div>
      <div class="ap-punch">
        У <b>{{ model.cheaperHigh }}×</b> дешевше — економія до <b>{{ model.saveHigh }} ₴/міс</b>
      </div>
    </div>

    <!-- УДАР 4: як це працює (щоб абстракція стала конкретною) -->
    <div class="ap-how">
      <div class="ap-how-title">Що входить у підписку</div>
      <div class="ap-how-item" v-for="item in howItems" :key="item.t">
        <span class="ap-how-ic"><QuizIcon :name="item.icon" /></span>
        <span class="ap-how-txt"><b>{{ item.t }}</b> — {{ item.d }}</span>
      </div>
    </div>

    <p class="fine-print">
      <strong>Розраховано для:</strong> {{ model.professionLabel }}<template v-if="model.location">, {{ model.location }}</template>, {{ model.roleLabel }}, {{ model.serviceText }}.<br>
      <em>Лише оцінка — фактичний результат залежить від ринку, оптимізації профілю та власних зусиль. Не є гарантією доходу.</em>
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
.ap-hero-num { font-size: 46px; font-weight: 800; line-height: 1; color: var(--text-dark); }
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
