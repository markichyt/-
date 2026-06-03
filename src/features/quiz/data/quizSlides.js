// The full 24-step quiz definition, ported verbatim from the original build.
//
// Field reference:
//   type    — which slide component renders this step
//             ('formWithFiles' | 'radio' | 'checkbox' | 'city' | 'card')
//   id      — for 'card' steps, selects the specific card component
//   field   — the quizData key this step writes to
//   q / sub — question heading / subtitle (may contain inline <span class="accent"> markup)
//   options — answer options: { v: value, t: label, icon, color }
//   skip    — label for an optional "skip" link (checkbox steps only)
export const quizSlides = [
  // 1. Intro contact form (early lead capture: name + email + phone + photo)
  {
    type: 'formWithFiles',
    id: 'quickContact',
    q: 'Let\'s get to <span class="accent">know you</span>',
    sub: 'Quick intro before we build your personalized plan',
    fields: [
      { label: 'First Name', field: 'first_name', type: 'text', ph: 'John' },
      { label: 'Last Name', field: 'last_name', type: 'text', ph: 'Davis' },
      { label: 'Email', field: 'email', type: 'email', ph: 'john@example.com' },
      { label: 'Phone', field: 'phone', type: 'tel', ph: '+380 67 123 45 67' },
      { label: 'Your photo', field: 'photo_name', type: 'file', accept: 'image/*' }
    ]
  },
  // 2. Profession
  {
    type: 'radio',
    field: 'profession',
    q: 'Which best describes your <span class="accent">profession?</span>',
    sub: 'Select your area of expertise',
    options: [
      { v: 'attorney', t: 'Attorney', icon: 'scales', color: '#6366f1' },
      { v: 'lawyer', t: 'Lawyer', icon: 'briefcase', color: '#3b82f6' },
      { v: 'notary', t: 'Notary', icon: 'stamp', color: '#8b5cf6' },
      { v: 'patent_attorney', t: 'Patent Attorney', icon: 'file-text', color: '#0ea5e9' },
      { v: 'cpa', t: 'CPA', icon: 'bar-chart', color: '#10b981' },
      { v: 'tax_specialist', t: 'Tax Specialist', icon: 'dollar', color: '#14b8a6' },
      { v: 'other', t: 'Other', icon: 'briefcase', color: '#64748b' }
    ]
  },
  // 3. Social-proof video scene
  { type: 'card', id: 'videoProof', q: '', sub: '' },
  // 4. Work city
  { type: 'city', field: 'city', q: 'Your <span class="accent">work city?</span>', sub: 'Pick from the list or type any US city' },
  // 5. Role
  {
    type: 'radio',
    field: 'role',
    q: 'Which best describes your <span class="accent">role?</span>',
    sub: 'Help us personalize your experience',
    options: [
      { v: 'self_employed', t: 'Self-employed / Working independently', icon: 'user', color: '#3b82f6' },
      { v: 'employee', t: 'Employee (in a company)', icon: 'building', color: '#8b5cf6' },
      { v: 'executive', t: 'Company executive / Manager', icon: 'crown', color: '#f59e0b' },
      { v: 'founder', t: 'Founder / Business owner', icon: 'rocket', color: '#10b981' }
    ]
  },
  // 6. Services provided
  {
    type: 'checkbox',
    field: 'services',
    q: 'What services do you <span class="accent">provide?</span>',
    sub: 'Select all that apply',
    options: [
      { v: 'banking_finance', t: 'Banking and Finance', icon: 'dollar', color: '#3b82f6' },
      { v: 'real_estate', t: 'Real Estate', icon: 'home', color: '#f59e0b' },
      { v: 'labour_law', t: 'Labour Law', icon: 'briefcase', color: '#8b5cf6' },
      { v: 'intellectual_property', t: 'Intellectual Property', icon: 'file-text', color: '#7c3aed' },
      { v: 'general', t: 'General', icon: 'scales', color: '#6366f1' },
      { v: 'family_law', t: 'Family Law', icon: 'users', color: '#ef4444' },
      { v: 'business', t: 'Business', icon: 'bar-chart', color: '#0ea5e9' },
      { v: 'taxes', t: 'Taxes', icon: 'dollar', color: '#10b981' },
      { v: 'cars', t: 'Cars', icon: 'car', color: '#ec4899' },
      { v: 'employment', t: 'Employment', icon: 'user', color: '#14b8a6' },
      { v: 'immigration_law', t: 'Immigration Law', icon: 'globe', color: '#0284c7' }
    ]
  },
  // 7. AI-powered potential card
  { type: 'card', id: 'aiCalc', q: 'Your <span class="accent">AI-powered</span> potential', sub: 'Based on your data, our AI calculated your potential on ConsultantLM' },
  // 8. Where the business is listed
  {
    type: 'checkbox',
    field: 'channels',
    q: 'Where is your business <span class="accent">listed?</span>',
    sub: 'Choose all that apply',
    skip: 'Skip for now',
    options: [
      { v: 'instagram', t: 'Instagram or Facebook', icon: 'instagram', color: '#e1306c' },
      { v: 'website', t: 'My own website', icon: 'globe', color: '#64748b' },
      { v: 'tiktok', t: 'TikTok', icon: 'tiktok', color: '#000000' },
      { v: 'youtube', t: 'YouTube', icon: 'play', color: '#ff0000' },
      { v: 'linkedin', t: 'LinkedIn', icon: 'linkedin', color: '#0a66c2' },
      { v: 'twitter', t: 'X (Twitter)', icon: 'x-twitter', color: '#000000' },
      { v: 'telegram', t: 'Telegram', icon: 'send', color: '#0088cc' },
      { v: 'reddit', t: 'Reddit', icon: 'share', color: '#ff4500' },
      { v: 'other_channel', t: 'Other', icon: 'plus', color: '#94a3b8' }
    ]
  },
  // 9. Preferred way to get customers
  {
    type: 'radio',
    field: 'preferred_way',
    q: 'What\'s your preferred way to get <span class="accent">more customers?</span>',
    sub: 'How would you like to grow',
    options: [
      { v: 'social_media', t: 'Social media', icon: 'share', color: '#8b5cf6' },
      { v: 'paid_ads', t: 'Paid ads', icon: 'megaphone', color: '#f59e0b' },
      { v: 'both', t: 'Both', icon: 'layers', color: '#3b82f6' },
      { v: 'ai_decide', t: 'No plan yet — AI can decide', icon: 'sparkle', color: '#10b981' }
    ]
  },
  // 10. Marketing time per day
  {
    type: 'radio',
    field: 'marketing_time',
    q: 'How many hours a day do you spend on <span class="accent">marketing?</span>',
    sub: 'Including social media, content creation, and blogging',
    options: [
      { v: 'none', t: "I don't spend time on marketing", icon: 'x-circle', color: '#94a3b8' },
      { v: 'less_1', t: 'Less than 1 hour', icon: 'clock', color: '#3b82f6' },
      { v: '1_5', t: '1-5 hours', icon: 'clock', color: '#f59e0b' },
      { v: '5_plus', t: '5+ hours', icon: 'clock', color: '#ef4444' }
    ]
  },
  // 11. Monthly ad budget
  {
    type: 'radio',
    field: 'ad_budget',
    q: 'What\'s your monthly <span class="accent">ad budget?</span>',
    sub: 'Approximate',
    options: [
      { v: 'none', t: "I don't spend", icon: 'x-circle', color: '#94a3b8' },
      { v: 'under_1k', t: 'Up to $1,000', icon: 'dollar', color: '#10b981' },
      { v: '1k_10k', t: '$1,000 – $10,000', icon: 'dollar', color: '#3b82f6' },
      { v: 'over_10k', t: 'More than $10,000', icon: 'diamond', color: '#f59e0b' }
    ]
  },
  // 12. Marketing team
  {
    type: 'checkbox',
    field: 'team',
    q: 'Who\'s on your <span class="accent">marketing team?</span>',
    sub: 'Select all roles you currently hire',
    skip: "I don't have a team",
    options: [
      { v: 'seo', t: 'Content Researcher / SEO Specialist', icon: 'search', color: '#3b82f6' },
      { v: 'scriptwriter', t: 'Scriptwriter', icon: 'pen', color: '#8b5cf6' },
      { v: 'videographer', t: 'Videographer', icon: 'camera', color: '#ef4444' },
      { v: 'video_editor', t: 'Video Editor', icon: 'film', color: '#f97316' },
      { v: 'smm', t: 'Digital Advertiser / SMM', icon: 'megaphone', color: '#10b981' },
      { v: 'crm_manager', t: 'CRM / Inquiry Manager', icon: 'users', color: '#0ea5e9' }
    ]
  },
  // 13. 10x results card
  { type: 'card', id: 'tenx', q: 'We cracked the code to deliver <span class="accent">10x better results</span>', sub: 'Replace a $5K–$30K marketing team — just 15 minutes a day' },
  // 14-17. Animation video scenes
  { type: 'card', id: 'video1', q: '', sub: '' },
  { type: 'card', id: 'video2', q: '', sub: '' },
  { type: 'card', id: 'videoAds', q: '', sub: '' },
  { type: 'card', id: 'videoSocials', q: '', sub: '' },
  // 18. Interactive ROI calculator
  {
    type: 'card',
    id: 'wowRoi',
    q: 'Meet your <span class="accent">future</span> on ConsultantLM',
    sub: "Here's your personalized profile + Estimated Pipeline Value"
  },
  // 19. Collaboration period
  {
    type: 'radio',
    field: 'period',
    q: 'How long do you want to <span class="accent">collaborate?</span>',
    sub: 'Longer periods get better pricing',
    options: [
      { v: '1_month', t: '1 month', icon: 'calendar', color: '#64748b' },
      { v: '1_year', t: '1 year (Save 10%)', icon: 'calendar', color: '#3b82f6' },
      { v: '3_years', t: '3 years (Save 20%)', icon: 'calendar', color: '#10b981' }
    ]
  },
  // 20. Time on platform
  {
    type: 'radio',
    field: 'time_on_platform',
    q: 'How much time can you spend on <span class="accent">ConsultantLM</span> each week?',
    sub: 'This helps us tailor your plan',
    options: [
      { v: '15min', t: '15 minutes a day', icon: 'clock', color: '#10b981' },
      { v: '30min', t: '30 minutes a day', icon: 'clock', color: '#3b82f6' },
      { v: '1hr', t: '1 hour a day', icon: 'clock', color: '#8b5cf6' },
      { v: 'more', t: 'More than 1 hour', icon: 'clock', color: '#f59e0b' }
    ]
  },
  // 21. Pipeline-value assessment
  { type: 'card', id: 'assessment', q: 'Your estimated <span class="accent">pipeline value</span>', sub: 'Based on your profession, location, services, and goals. Estimates only — not a guarantee.' },
  // 22. Full profile (bio OR CV upload)
  {
    type: 'card',
    id: 'fullProfile',
    q: 'Complete your <span class="accent">profile</span>',
    sub: 'Choose one — write a detailed bio (3 000+ characters) or upload your CV. Our AI will generate the rest.'
  },
  // 23. Plans & pricing
  { type: 'card', id: 'profilesPricing', q: 'Choose your <span class="accent">plan</span>', sub: '' },
  // 24. Payment (final submit)
  { type: 'card', id: 'payment', q: 'Complete your <span class="accent">purchase</span>', sub: '' }
]

export const TOTAL_STEPS = quizSlides.length
