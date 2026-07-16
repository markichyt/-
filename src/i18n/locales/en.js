// English (US) catalog. UI copy mirrors the current UA design; feature/plan labels,
// service & profession sets and market figures harvested from web-quiz/Vue2ENG.
export default {
  meta: {
    title: 'ConsultantLM — Is Your Firm Ready?'
  },
  common: {
    next: 'Next →',
    skip: 'Skip for now',
    selectOneOrMore: 'Select one or more',
    chosen: 'selected',
    discountBanner: '20% DISCOUNT — JUST FOR YOU!',
    timer: { hours: 'hrs', minutes: 'min', seconds: 'sec' }
  },
  topbar: {
    step: 'STEP {n} / {total}'
  },
  validation: {
    required: 'Please fill this field',
    file: 'Add a file',
    emailInvalid: 'Invalid email format',
    phoneInvalid: 'Invalid phone number',
    passwordRepeat: 'Repeat password',
    passwordMismatch: "Passwords don't match",
    passwordWeak: 'Min 5 chars, uppercase & number'
  },
  slides: {
    quickContact: {
      q: "Let's get to <span class=\"accent\">know you</span>",
      sub: 'Quick intro before we build your personalized profile',
      fields: {
        first_name: { label: 'First Name', ph: 'John' },
        last_name: { label: 'Last Name', ph: 'Davis' },
        email: { label: 'Email', ph: 'john@example.com' },
        phone: { label: 'Phone', ph: '+1 555 123 4567' },
        password: { label: 'Password', ph: 'Min 5 chars, uppercase + number' },
        password_confirm: { label: 'Confirm password', ph: 'Repeat password' }
      }
    },
    photoUpload: {
      q: 'Upload <span class="accent">your photo!</span>',
      sub: 'Upload your photo to generate a video avatar for your profile'
    },
    profession: {
      q: 'Which best describes your <span class="accent">profession?</span>',
      sub: 'Select your area of expertise',
      opt: {
        attorney: 'Attorney',
        lawyer: 'Lawyer',
        notary: 'Notary',
        patent_attorney: 'Patent Attorney',
        cpa: 'CPA',
        tax_specialist: 'Tax Specialist',
        other: 'Other'
      }
    },
    city: {
      q: 'Your <span class="accent">work city?</span>',
      sub: 'Pick from the list or type your city',
      placeholder: 'Start typing your city',
      noMatch: 'No matches — click "Next" to use what you typed.'
    },
    role: {
      q: 'Which best describes your <span class="accent">role?</span>',
      sub: 'Help us personalize your experience',
      opt: {
        self_employed: 'Self-employed / Working independently',
        employee: 'Employee (in a company)',
        executive: 'Company executive / Manager',
        founder: 'Founder / Business owner'
      }
    },
    services: {
      q: 'What services do you <span class="accent">provide?</span>',
      sub: 'Select all that apply',
      opt: {
        banking_finance: 'Banking & Financial Law',
        real_estate: 'Real Estate Law',
        labour_law: 'Labor Law',
        intellectual_property: 'Intellectual Property Law',
        general: 'General Legal Services',
        family_law: 'Family Law',
        business: 'Business & Corporate Law',
        taxes: 'Tax Law',
        cars: 'Motor Vehicle Law',
        employment: 'Employment Law',
        immigration_law: 'Immigration Law'
      }
    },
    channels: {
      q: 'Where is your business <span class="accent">listed?</span>',
      sub: 'Choose all that apply',
      opt: {
        telegram: 'Telegram',
        instagram: 'Instagram or Facebook',
        tiktok: 'TikTok',
        youtube: 'YouTube',
        linkedin: 'LinkedIn',
        twitter: 'X (Twitter)',
        website: 'My own website',
        other_channel: 'Other'
      }
    },
    preferred_way: {
      q: "What's your preferred way to get <span class=\"accent\">more customers?</span>",
      sub: 'How would you like to grow',
      opt: {
        social_media: 'Social media',
        paid_ads: 'Paid ads',
        both: 'Both',
        ai_decide: 'No plan yet — AI can decide'
      },
      disclaimer: {
        social_media: 'Automation: we help you create and run social media automatically — content that builds trust and attracts clients.',
        paid_ads: 'Our AI ads are an amplifier: we improve what you already do.',
        both: 'Great choice! We combine paid and organic approaches for maximum results.',
        ai_decide: 'Trust us? Great. AI picks the best strategy for your business and delivers results.'
      }
    },
    marketing_time: {
      q: 'How many hours a day do you spend on <span class="accent">marketing?</span>',
      sub: 'Including social media, content creation, and blogging',
      opt: {
        none: "I don't spend time on marketing",
        less_1: 'Less than 1 hour',
        '1_5': '1-5 hours',
        '5_plus': '5+ hours'
      }
    },
    ad_budget: {
      q: "What's your monthly <span class=\"accent\">ad budget?</span>",
      sub: 'Approximate',
      opt: {
        none: "I don't spend",
        to_40k: 'Up to $1,000',
        to_400k: '$1,000 – $10,000',
        over_400k: 'More than $10,000'
      }
    },
    team: {
      q: "Who's on your <span class=\"accent\">marketing team?</span>",
      sub: 'Select all roles you currently hire',
      opt: {
        seo: 'Content Researcher / SEO Specialist',
        scriptwriter: 'Scriptwriter',
        videographer: 'Videographer',
        video_editor: 'Video Editor',
        smm: 'Digital Advertiser / SMM',
        crm_manager: 'CRM / Inquiry Manager',
        no_team: "I don't have a team"
      }
    },
    aiCalc: {
      q: 'Your <span class="accent">AI-powered</span> potential',
      sub: 'Based on your practice areas and market, our AI calculated how many new clients and how much revenue you could get each month — and what it would cost without us.'
    },
    assessment: {
      q: 'How ready is your <span class="accent">profile</span>',
      sub: 'We assessed your answers — the fuller your profile, the higher your rating and the more client trust on ConsultantLM.'
    },
    fullProfile: {
      q: 'Complete your <span class="accent">profile</span>',
      sub: 'Choose one — write a detailed bio (3,000+ characters) or upload your CV. Our AI will generate the rest.'
    },
    profilesPricing: { q: 'Choose your <span class="accent">plan</span>', sub: '' },
    payment: { q: 'Complete your <span class="accent">purchase</span>', sub: '' }
  },
  pricing: {
    perMonthShort: '/mo',
    note: {
      monthly: 'per month, billed monthly',
      annual: 'per month, billed annually (–10%)'
    },
    features: {
      ai_pro_avatar: 'AI PRO avatar',
      ai_premium_avatar: 'AI PREMIUM avatar',
      posts_10: '10 AI posts/videos',
      posts_40: '40 AI posts/videos',
      posts_100: '100 AI posts/videos',
      leads_6: '6 lead buying',
      leads_30: '30 lead buying',
      leads_unlim: 'Unlimited lead buying',
      reputation_10: 'Up to 10 reputation checks',
      reputation_unlim: 'Unlimited reputation checks',
      google_top: 'Top in Google by your name',
      manager_24_7: '24/7 personal manager',
      exclusive_smm: 'Exclusive social promotion',
      rating_boost: 'Boost rating from past experience',
      own_prices: 'Set custom prices for your services',
      ai_module: 'AI module for Google & Meta',
      ai_monitoring: 'AI competitor monitoring',
      ai_assistant: 'AI client assistant',
      referral: 'Referral earnings',
      private_chat: 'Private specialist chat',
      crm: 'CRM system',
      messenger: 'Secure messenger',
      ai_avatar: 'AI avatar',
      reputation: 'Reputation checks'
    },
    badges: {
      new: 'NEW',
      more_4x: '4x more',
      more_5x: '5x more',
      more_2_5x: '2.5x more',
      infinity: '∞',
      upgrade: 'UPGRADE'
    }
  },
  cards: {
    photo: {
      dropHint: 'Click to upload your photo',
      error: {
        badType: 'Invalid format — JPEG / PNG only',
        tooBig: 'File too large — 5 MB max'
      },
      dropSub: 'JPEG or PNG · up to 5 MB · horizontal 16:9',
      previewAlt: 'Photo preview',
      warnRatio: '⚠ Photo is not horizontal 16:9 — the video may look incorrect',
      uploadOwn: 'Upload your photo',
      samplesTitle: 'No photo handy? Pick a sample 👇',
      sampleLabel: 'Sample',
      modalUploadOther: 'Upload another photo',
      modalProceed: 'Continue',
      errors: {
        WRONG_RATIO: {
          title: 'Wrong photo format',
          body: 'You attached a non-horizontal photo (not 16:9). Because of this <strong class="pu-modal-danger">the video may look incorrect</strong>.'
        },
        NO_PERSON: {
          title: 'No person found',
          body: 'No person was found in the photo. Upload your <strong class="pu-modal-danger">portrait photo</strong>.'
        },
        MULTIPLE_PEOPLE: {
          title: 'More than one person',
          body: 'The photo has more than one person. We need a photo <strong class="pu-modal-danger">with only you</strong>.'
        },
        FACE_NOT_VISIBLE: {
          title: 'Face not visible',
          body: 'Your face is not visible. We need a photo where <strong class="pu-modal-danger">your face is clearly visible</strong>.'
        }
      }
    },
    aiPotential: {
      heroEyebrow: 'With us you get',
      heroCapHtml: 'potential clients<br>per month',
      revenue: '≈ ${low} – ${high}',
      revenueCaption: 'revenue / mo',
      channels: {
        seo: 'SEO {min}–{max}',
        ads: 'Ads {min}–{max}',
        social: 'Social {min}–{max}'
      },
      compareQ: 'To get this flow on your own — you need a <b>whole team:</b>',
      teamRoleCost: '${low}K–${high}K',
      teamRoles: {
        seo: 'SEO specialist',
        targeting: 'Ads specialist',
        content: 'Content creator',
        video: 'Video editor',
        smm: 'SMM manager'
      },
      teamTotalLabel: 'Your own team total',
      teamTotal: '${low} – ${high}/mo',
      usLabel: 'ConsultantLM — all in one',
      ourPlan: '${amount}/mo',
      punchHtml: "That's <b>{times}×</b> cheaper — save up to <b>${save}/mo</b>",
      howTitle: "What's included in the subscription",
      how: {
        marketing: { t: 'Turnkey marketing', d: 'We promote you in Google, ads and social media' },
        content: { t: 'Content factory', d: 'Regular content for your site, ads and brand' },
        leads: { t: 'Ready leads', d: 'Quality client inquiries in your practice areas' },
        clients: { t: 'Platform clients', d: 'People already looking for a lawyer on ConsultantLM' }
      },
      finePrintLabel: 'Calculated for:',
      finePrintDisclaimer: 'Estimate only — actual results depend on the market, profile optimization and your own effort. Not a guarantee of income.',
      professionFallback: 'Specialist',
      serviceFallback: 'General',
      roleShort: {
        self_employed: 'Self-employed',
        employee: 'Employee',
        executive: 'Executive',
        founder: 'Founder'
      }
    },
    assessment: {
      levels: { low: 'Low', normal: 'Normal', mid: 'Moderate', high: 'High' },
      yourLevel: 'Your level:',
      calculatedFor: 'Calculated for:',
      factors: 'Factors: ad budget{adBudget}, collaboration period{period}, desired goals.',
      disclaimer: 'Estimate only — actual results may vary. Not a guarantee of income.',
      professionFallback: 'Specialist',
      serviceFallback: 'General',
      adBudget: {
        none: "don't spend",
        to_40k: 'up to $1,000',
        to_400k: '$1,000–$10,000',
        over_400k: 'over $10,000'
      },
      period: { '1_month': '1 month', '1_year': '1 year', '3_years': '3 years' }
    },
    fullProfile: {
      finish: 'Finish →',
      strengthLabel: 'Profile strength',
      strengthHint: {
        high: '✓ Strong profile — AI will deliver great results',
        mid: 'Good start — add more detail for better AI quality',
        low: 'Add details below — the more info, the stronger your AI profile'
      },
      aboutLabel: 'About you',
      aboutHint: 'recommended 3,000+ characters',
      aboutPh: 'Tell us about your experience, education, achievements, notable cases, certifications, awards…',
      cvCtaTitle: '📄 Have a CV? Upload it — it boosts profile strength by 30%',
      cvCtaBody: 'Our AI will generate your public profile <strong>straight from your CV</strong>. Experience, education, certifications, notable cases and achievements are extracted automatically. <em>Optional, but highly recommended.</em>',
      cvLabel: 'Upload CV',
      cvHint: 'optional · .pdf / .doc / .docx',
      cvPlaceholder: 'Click to choose .pdf / .doc / .docx',
      logoLabel: 'Company logo',
      logoHint: 'optional · PNG / JPG / SVG',
      logoPlaceholder: 'Click to choose an image',
      referralLabel: 'Referral code',
      optional: 'optional',
      referralPh: 'Enter referral code',
      skipModal: {
        title: 'Wait — your profile will be too weak',
        body: 'Without a <strong>bio</strong> or <strong>CV</strong>, our AI cannot build a competitive profile. Lawyers who skip this step get <strong>far fewer client inquiries</strong> on ConsultantLM.<br><br>It takes 2 minutes and significantly improves your results.',
        back: '← Go back and fill it in',
        confirm: 'Skip anyway'
      }
    },
    profilesPricing: {
      prevPlan: 'Previous plan',
      nextPlan: 'Next plan',
      plans: { base: 'BASE', pro: 'PRO', premium: 'PREMIUM' },
      cta: { base: 'Choose Base', pro: 'Choose Pro', premium: 'Choose Premium' },
      demo: { name: 'John Davis', role: 'Attorney', location: 'USA, New York' },
      demoPremium: { name: 'Alexander König', role: 'Attorney', location: 'USA, New York' },
      avatarAlt: 'Attorney',
      avatarLabel: 'AI avatar preview',
      avatarTagline: 'Your AI avatar runs Your profile and social media for You',
      monthly: 'Monthly',
      annual: 'Yearly',
      saveBadge: '−10%',
      trustTitle: 'Built for US attorneys',
      trustEthicsHtml: 'Complies with <strong>attorney ethics rules</strong>',
      trustDataHtml: '<strong>Data protection</strong> · SOC 2',
      customQuote: 'Large firm? Get a custom quote',
      close: 'Close',
      lead: {
        title: 'Team registration',
        sub: 'Tell us about your firm — a manager will reach out within 24 hours with a custom plan.',
        note: 'This plan is for teams of 10+ specialists. For smaller ones — choose Base, Pro or Premium.',
        firmName: 'Firm name',
        companyName: 'Company name',
        teamSize: 'Team size',
        teamSizeHint: '(minimum 10)',
        teamSizePh: 'e.g. 12',
        location: 'City',
        email: 'Contact email',
        phone: 'Phone',
        message: 'What do you need?',
        messagePh: 'Volume, integrations, white-label, timelines…',
        submit: 'Request a call',
        sending: 'Sending…',
        foot: 'By submitting, you agree that our team may contact you.',
        thanksTitle: 'Thank you!',
        thanksSub: 'A manager will reach out within 24 hours with a custom plan for your team.'
      }
    },
    payment: {
      periods: { '1_month': '1 month', '1_year': '1 year' },
      saveBadge: '-10%',
      savedHero: 'YOU JUST SAVED',
      rows: {
        plan: '{plan} plan — {period}',
        urgency: 'Urgency discount (20%)',
        referral: 'Referral code (10%)',
        periodDiscount: '{period} discount ({pct}%)',
        total: 'Total'
      },
      paypal: 'Pay with PayPal',
      card: 'Pay by card',
      sending: 'Sending…',
      faqHeading: 'Frequently asked questions',
      faq: {
        clients: {
          q: 'How many clients can I get per month?',
          a: 'Depending on your specialization, city and profile optimization — many lawyers get 5–15 clients in the first month, scaling over time to 20–30+ thanks to AI content and SEO promotion.'
        },
        guarantee: {
          q: 'Is that a guaranteed number of clients?',
          a: 'We provide you with leads that you work with yourself. You can also work on exclusive terms with platform clients — in which case they are already paid clients.'
        },
        payment: {
          q: 'How does payment work?',
          a: 'We have three plans: Base, Pro and Premium. The cost is far below traditional marketing agencies. Many lawyers pay off the subscription with just 1–2 clients.'
        },
        noClients: {
          q: 'What if there are no clients?',
          a: 'Lead availability depends on your activity on the platform. We guarantee uninterrupted access to the platform and its resources. Payment is non-refundable once access is granted.'
        },
        data: {
          q: 'Is my data safe?',
          a: 'Yes, we use a secure messenger, data encryption and never share information with third parties. The platform complies with data-protection requirements (GDPR and US law).'
        }
      },
      alertSuccess: 'Thank you! Your request has been received.',
      alertError: 'Submission error (status {status}). Please try again.'
    }
  },
  scenes: {
    social: {
      count: '2,500+',
      countLabel: 'attorneys',
      headline: 'grew their income with us',
      sub: 'Verified monthly income · 2024–2026',
      stats: {
        growthNum: '+183%', growthCap: 'avg. income growth',
        renewNum: '94%', renewCap: 'renew subscription',
        countriesNum: '5', countriesCap: 'countries'
      }
    },
    google: {
      query: 'Divorce attorney New York',
      headlineHtml: 'This is how <span class="accent">Your profile</span> will look',
      sub: '#1 in Google — above LinkedIn and your own site',
      result1Title: 'John Davis, Attorney — New York',
      result2Title: 'John Davis — LinkedIn Profile',
      result3Title: 'Davis Law — Home',
      views: 'Views', leads: 'Leads', revenue: 'Revenue',
      chartTitle: 'Profile views — last 6 months',
      chartBadge: '↗ Record',
      months: { m0: 'Nov', m1: 'Dec', m2: 'Jan', m3: 'Feb', m4: 'Mar', m5: 'Apr' }
    },
    ads: {
      headlineHtml: 'Turn your practice into a <span class="accent">client stream</span> with AI ads',
      sub: 'Generate videos and publish — they bring you new clients on their own.',
      demoName: 'John Davis',
      demoRole: 'ATTORNEY · NEW YORK',
      resultsTitle: 'Last 30 days',
      roi: '+340% ROI',
      newClients: 'New clients',
      revenue: 'Revenue',
      liveNow: 'AI campaign live',
      volume: '14 ads · 6 channels'
    },
    content: {
      headlineHtml: 'Watch competitors <span class="accent">24/7</span>',
      sub: 'and create better content in minutes with ConsultantLM.',
      steps: { scan: 'Scan', generate: 'Generate', publish: 'Publish', analyze: 'Analyze', scale: 'Scale' },
      before: 'Before', after: 'After',
      competitor: 'Competitor', yours: 'Your content',
      views: 'Views', engagement: 'Engagement',
      badge: '+1,458%',
      totalLabel: 'Total reach',
      totalFoot: 'across 5 platforms · per campaign'
    }
  }
}
