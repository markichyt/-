// Повне визначення квіза (структура однакова для всіх ринків).
//
// Тексти — через i18n-ключі (q/sub — це КЛЮЧІ, не текст; резолвляться у SlideRenderer).
// Набори послуг/професій — з marketConfig (набір різний по ринках), беруться за marketKey.
// Стабільні ключі (НЕ перекладаються, йдуть у payload/скоринг): type, id, field, option.v.
//
// Поля:
//   type      — компонент кроку ('formWithFiles' | 'radio' | 'checkbox' | 'city' | 'card')
//   id        — для 'card' обирає конкретну картку
//   field     — ключ у quizData, куди пишеться відповідь
//   marketKey — брати options з marketConfig[locale][marketKey] (services/professions)
//   q / sub   — i18n-ключі заголовка/підзаголовка (можуть містити <span class="accent">)
//   options   — { v: значення, icon, color }; підпис = i18n slides.<field>.opt.<v>
//   skip      — true → показати необовʼязкове посилання «пропустити» (для checkbox)
export const quizSlides = [
  // 1. Контактна форма (раннє захоплення ліда)
  {
    type: 'formWithFiles',
    id: 'quickContact',
    q: 'slides.quickContact.q',
    sub: 'slides.quickContact.sub',
    fields: [
      { field: 'first_name', type: 'text' },
      { field: 'last_name', type: 'text' },
      { field: 'email', type: 'email' },
      { field: 'phone', type: 'tel' },
      { field: 'password', type: 'password' },
      { field: 'password_confirm', type: 'password', match: 'password' }
    ]
  },
  // 2. Завантаження фото для відео-аватара
  { type: 'card', id: 'photoUpload', q: 'slides.photoUpload.q', sub: 'slides.photoUpload.sub' },
  // 3. Професія (набір — з marketConfig)
  {
    type: 'checkbox',
    field: 'profession',
    requireSelection: true,
    marketKey: 'professions',
    q: 'slides.profession.q',
    sub: 'slides.profession.sub'
  },
  // Сцена соціального доказу
  { type: 'card', id: 'videoProof', q: '', sub: '' },
  // 4. Місто роботи
  { type: 'city', field: 'city', q: 'slides.city.q', sub: 'slides.city.sub' },
  // 5. Роль
  {
    type: 'radio',
    field: 'role',
    q: 'slides.role.q',
    sub: 'slides.role.sub',
    options: [
      { v: 'self_employed', icon: 'user', color: '#3b82f6' },
      { v: 'employee', icon: 'building', color: '#8b5cf6' },
      { v: 'executive', icon: 'crown', color: '#f59e0b' },
      { v: 'founder', icon: 'rocket', color: '#10b981' }
    ]
  },
  // 6. Послуги (набір — з marketConfig)
  {
    type: 'checkbox',
    field: 'services',
    marketKey: 'services',
    q: 'slides.services.q',
    sub: 'slides.services.sub'
  },
  // 7. AI-потенціал
  { type: 'card', id: 'aiCalc', q: 'slides.aiCalc.q', sub: 'slides.aiCalc.sub' },
  // 8. Де представлений бізнес
  {
    type: 'checkbox',
    field: 'channels',
    skip: true,
    q: 'slides.channels.q',
    sub: 'slides.channels.sub',
    options: [
      { v: 'telegram', icon: 'send', color: '#0088cc' },
      { v: 'instagram', icon: 'instagram', color: '#e1306c' },
      { v: 'tiktok', icon: 'tiktok', color: '#000000' },
      { v: 'youtube', icon: 'play', color: '#ff0000' },
      { v: 'linkedin', icon: 'linkedin', color: '#0a66c2' },
      { v: 'twitter', icon: 'x-twitter', color: '#000000' },
      { v: 'website', icon: 'globe', color: '#64748b' },
      { v: 'other_channel', icon: 'plus', color: '#94a3b8' }
    ]
  },
  // 9. Бажаний спосіб залучення клієнтів
  {
    type: 'radio',
    field: 'preferred_way',
    q: 'slides.preferred_way.q',
    sub: 'slides.preferred_way.sub',
    options: [
      { v: 'social_media', icon: 'share', color: '#8b5cf6' },
      { v: 'paid_ads', icon: 'megaphone', color: '#f59e0b' },
      { v: 'both', icon: 'layers', color: '#3b82f6' },
      { v: 'ai_decide', icon: 'sparkle', color: '#10b981' }
    ]
  },
  // 10. Час на маркетинг
  {
    type: 'radio',
    field: 'marketing_time',
    q: 'slides.marketing_time.q',
    sub: 'slides.marketing_time.sub',
    options: [
      { v: 'none', icon: 'x-circle', color: '#94a3b8' },
      { v: 'less_1', icon: 'clock', color: '#3b82f6' },
      { v: '1_5', icon: 'clock', color: '#f59e0b' },
      { v: '5_plus', icon: 'clock', color: '#ef4444' }
    ]
  },
  // 11. Місячний бюджет на рекламу
  {
    type: 'radio',
    field: 'ad_budget',
    q: 'slides.ad_budget.q',
    sub: 'slides.ad_budget.sub',
    options: [
      { v: 'none', icon: 'x-circle', color: '#94a3b8' },
      { v: 'to_40k', icon: 'dollar', color: '#10b981' },
      { v: 'to_400k', icon: 'dollar', color: '#3b82f6' },
      { v: 'over_400k', icon: 'diamond', color: '#f59e0b' }
    ]
  },
  // 12. Маркетингова команда
  {
    type: 'checkbox',
    field: 'team',
    requireSelection: true,
    q: 'slides.team.q',
    sub: 'slides.team.sub',
    options: [
      { v: 'seo', icon: 'search', color: '#3b82f6' },
      { v: 'scriptwriter', icon: 'pen', color: '#8b5cf6' },
      { v: 'videographer', icon: 'camera', color: '#ef4444' },
      { v: 'video_editor', icon: 'film', color: '#f97316' },
      { v: 'smm', icon: 'megaphone', color: '#10b981' },
      { v: 'crm_manager', icon: 'users', color: '#0ea5e9' },
      { v: 'no_team', icon: 'x-circle', color: '#94a3b8', exclusive: true }
    ]
  },
  // Анімаційні сцени
  { type: 'card', id: 'video1', q: '', sub: '' },
  { type: 'card', id: 'video2', q: '', sub: '' },
  { type: 'card', id: 'videoAds', q: '', sub: '' },
  // Оцінка готовності профілю
  { type: 'card', id: 'assessment', q: 'slides.assessment.q', sub: 'slides.assessment.sub' },
  // Повний профіль (біо АБО резюме)
  { type: 'card', id: 'fullProfile', q: 'slides.fullProfile.q', sub: 'slides.fullProfile.sub' },
  // Плани і ціни
  { type: 'card', id: 'profilesPricing', q: 'slides.profilesPricing.q', sub: 'slides.profilesPricing.sub' },
  // Оплата (фінальне надсилання)
  { type: 'card', id: 'payment', q: 'slides.payment.q', sub: 'slides.payment.sub' }
]

export const TOTAL_STEPS = quizSlides.length
