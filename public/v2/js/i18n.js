// ─────────────────────────────────────────────────────────────────────────────
// CONSULTANT Quiz v2 — локалізація (uk / ru).
//
// Бренд усюди пишемо капсом латиницею: CONSULTANT.
// Блоки pricing / cards.profilesPricing / cards.payment скопійовані з квіза 1
// без змін по суті — міняються лише ціни та назва бренду.
// ─────────────────────────────────────────────────────────────────────────────

const uk = {
  meta: { title: 'CONSULTANT — більше клієнтів для Вашої практики' },
  common: {
    next: 'Далі →',
    back: 'Назад',
    skip: 'Пропустити',
    selectOneOrMore: 'Оберіть один або більше',
    chosen: 'обрано',
    discountBanner: 'ЗНИЖКА 20% ТІЛЬКИ ДЛЯ ВАС!',
    timer: { hours: 'год', minutes: 'хв', seconds: 'сек' },
    videoSound: { on: 'Увімкнути звук', off: 'Вимкнути звук' },
    videoPause: { pause: 'Пауза', play: 'Відтворити' }
  },
  topbar: { step: 'КРОК {n} / {total}' },
  validation: {
    required: 'Заповніть це поле',
    emailInvalid: 'Невірний формат email',
    phoneInvalid: 'Невірний номер телефону'
  },
  slides: {
    greeting: {
      q: 'Вітаємо у <span class="accent">CONSULTANT</span>',
      sub: 'Подивіться коротке привітання — і пройдіть опитування. Це 2 хвилини, а наприкінці Ви побачите своє рішення.'
    },
    contact: {
      q: 'Давайте <span class="accent">познайомимось</span>',
      sub: 'Щоб надіслати Ваш персональний розрахунок, навіть якщо Ви не завершите опитування.',
      fields: {
        first_name: { label: "Ім'я", ph: 'Олександр' },
        last_name: { label: 'Прізвище', ph: 'Коваленко' },
        email: { label: 'Email', ph: 'oleksandr@example.com' },
        phone: { label: 'Телефон', ph: '+380 67 123 45 67' }
      }
    },
    search_time: {
      q: 'Скільки часу на тиждень Ви витрачаєте на <span class="accent">пошук нових клієнтів?</span>',
      sub: 'Включно з дзвінками, соцмережами та рекомендаціями',
      opt: {
        lt_2: 'Менше 2 годин',
        h_2_5: '2–5 годин',
        h_5_10: '5–10 годин',
        no_time: 'Взагалі не встигаю'
      }
    },
    growth_blocker: {
      q: 'Що зараз найбільше <span class="accent">заважає рости?</span>',
      sub: 'Оберіть те, що болить найсильніше',
      opt: {
        few_leads: 'Мало заявок',
        no_deals: 'Заявки є, але не доходять до угоди',
        routine: 'Губляюсь у рутині (документи, дзвінки)',
        no_system: 'Немає системи, все хаотично'
      }
    },
    services: {
      q: 'У якій сфері права Ви <span class="accent">практикуєте?</span>',
      sub: 'Оберіть усе, що підходить',
      opt: {
        medical: 'Медичне право',
        ecology: 'Екологічне право',
        doc_analysis: 'Юридичний аналіз документів',
        auto: 'Автомобільні спори',
        corporate: 'Господарське та корпоративне право',
        military: 'Військове право',
        documents: 'Підготовка та правовий аналіз документів',
        debt_collection: 'Стягнення заборгованості',
        criminal: 'Кримінальне право',
        migration: 'Міграційне право',
        real_estate: 'Нерухомість та земельне право',
        labour: 'Трудове право',
        social: 'Соціальні виплати та спори',
        family: 'Сімейне право',
        debtor_protection: 'Захист боржника',
        other: 'Інші юридичні послуги'
      }
    },
    desired_clients: {
      q: 'Скільки клієнтів Ви хочете отримувати <span class="accent">щомісяця?</span>',
      sub: 'Це визначить, який план Вам підійде',
      opt: {
        c_to_10: 'До 10 клієнтів',
        c_10_30: '10–30 клієнтів',
        c_30_50: '30–50 клієнтів',
        c_50_plus: '50+ клієнтів'
      }
    },
    solution: {
      q: 'Ось Ваше <span class="accent">рішення</span>',
      sub: 'Розраховано за Вашими відповідями.'
    },
    pricing: { q: 'Ось що <span class="accent">вирішить</span> цю проблему', sub: '' },
    payment: { q: 'Завершіть <span class="accent">покупку</span>', sub: '' },
    photoUpload: {
      q: 'Завантажте <span class="accent">своє фото!</span>',
      sub: 'Завантажте своє фото для генерації відео-аватара для Вашого профілю'
    },
    aiPotential: {
      q: 'Ваш потенціал з <span class="accent">CONSULTANT</span>',
      sub: 'AI порахував за Вашими напрямами та ринком: скільки нових клієнтів і доходу Ви можете отримувати щомісяця — і скільки це коштувало б без нас.'
    },
    assessment: {
      q: 'Останній крок — Ваш <span class="accent">профіль</span>',
      sub: 'Оберіть, як його заповнити. Далі все зробить AI.'
    },
    fullProfile: {
      q: 'Заповніть свій <span class="accent">профіль</span>',
      sub: 'Оберіть одне — напишіть детальне біо (3 000+ символів) або завантажте резюме. Решту згенерує наш AI.'
    }
  },
  cards: {
    greeting: { start: 'Почати →' },
    solution: {
      gainEyebrow: 'З CONSULTANT це',
      gainCap: 'нових клієнтів щомісяця',
      gainRevenueLabel: 'Потенційний дохід',
      proof: {
        lawyers: '2 500+',
        lawyersCap: 'юристів уже з нами',
        growth: '+183%',
        growthCap: 'сер. зростання доходу',
        renew: '94%',
        renewCap: 'продовжують підписку'
      },
      cta: 'Показати тарифи →'
    },
    callback: {
      plaque: 'Не готові платити зараз? Замовте дзвінок менеджера на номер',
      noPhone: 'вкажіть номер',
      label: 'Номер для дзвінка',
      submit: 'Замовити дзвінок',
      sending: 'Надсилання…',
      done: '✓ Готово — менеджер зателефонує на {phone} протягом робочого дня.'
    },
    cta: {
      recommendedNote: 'Ваш план: {plan} — {price}/міс',
      buyNow: 'Купити зараз',
      buyNowHint: 'Одразу до оплати обраного плану',
      scheduleCall: 'Запланувати дзвінок',
      scheduleHint: "Менеджер зателефонує у зручний час",
      calendar: {
        title: 'Оберіть зручний час',
        sub: "Ми зателефонуємо на {phone} — номер уже збережено.",
        today: 'Сьогодні',
        tomorrow: 'Завтра',
        pickDay: 'День',
        pickTime: 'Час',
        topicLabel: 'Про що поговорити?',
        topicPh: 'Коротко: що саме хочете вирішити…',
        topics: {
          plan: 'Який план обрати',
          leads: 'Як працюють заявки',
          demo: 'Показати платформу',
          team: 'Умови для команди'
        },
        submit: 'Підтвердити дзвінок',
        sending: 'Надсилання…',
        thanksTitle: 'Дзвінок заплановано!',
        thanksSub: 'Менеджер зателефонує {when} на номер {phone}.',
        close: 'Закрити',
        weekdays: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        months: ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня']
      }
    },
    photo: {
      dropHint: 'Натисніть, щоб завантажити своє фото',
      dropSub: 'JPEG або PNG · до 5 МБ · горизонтальне 16:9',
      error: {
        badType: 'Невірний формат — лише JPEG / PNG',
        tooBig: 'Файл завеликий — максимум 5 МБ'
      },
      previewAlt: "Прев'ю фото",
      uploadOwn: 'Завантажити своє фото',
      samplesTitle: 'Немає власного фото під рукою? Оберіть зразок 👇',
      sampleLabel: 'Зразок'
    },
    aiPotential: {
      heroEyebrow: 'З нами Ви заробляєте',
      clientsLabel: 'потенційних клієнтів щомісяця',
      revenue: '≈ {low} – {high}',
      revenueCaption: 'доходу / міс',
      priceLabel: 'усе це за підписку {amount}/міс',
      compareQ: 'Щоб отримати такий потік самостійно — потрібна <b>ціла команда:</b>',
      teamRoleCost: '{low}–{high} тис ₴',
      teamRoles: {
        seo: 'SEO-фахівець',
        targeting: 'Таргетолог (реклама)',
        content: 'Контент-мейкер',
        video: 'Відеомонтажер',
        smm: 'SMM-менеджер'
      },
      teamTotalLabel: 'Разом власна команда',
      teamTotal: '{low}–{high} ₴/міс',
      usLabel: 'CONSULTANT — усе в одному',
      ourPlan: '{amount}/міс',
      punchHtml: 'У <b>{times}×</b> дешевше — економія до <b>{save}/міс</b>',
      finePrintLabel: 'Розраховано для:',
      finePrintDisclaimer: 'Лише оцінка — фактичний результат залежить від ринку, оптимізації профілю та власних зусиль. Не є гарантією доходу.',
      serviceFallback: 'Загальне'
    },
    assessment: {
      levels: { low: 'Низький', normal: 'Нормальний', mid: 'Помірний', high: 'Високий' },
      yourLevel: 'Ваш рівень:',
      calculatedFor: 'Розраховано для:',
      factors: 'Фактори: сфера практики, бажана кількість клієнтів, поточне навантаження.',
      disclaimer: 'Лише оцінка — фактичний результат може відрізнятися. Не є гарантією доходу.',
      serviceFallback: 'Загальне',
      whyTitle: 'Навіщо це потрібно',
      whyLead: 'З цього AI збере Ваш публічний профіль на CONSULTANT — сам, за кілька хвилин. Досвід, освіта, сертифікати та відомі справи витягуються автоматично.',
      why: {
        profile: 'Готовий профіль замість порожньої картки',
        google: 'Топ у Google за Вашим іменем',
        clients: 'Клієнти знаходять Вас самі, без реклами'
      },
      warn: 'Поки що AI нема з чого будувати Ваш профіль. Юристи з порожнім профілем стоять у видачі нижче за колег і отримують значно менше запитів.',
      chooseLabel: 'Оберіть, як заповнити профіль',
      tabCv: 'Завантажити резюме',
      tabCvNote: 'найшвидше — 10 секунд',
      tabBio: 'Написати про себе',
      tabBioNote: 'мінімум 3 000 символів',
      cvPlaceholder: 'Натисніть, щоб обрати файл',
      cvHint: '.pdf / .doc / .docx',
      bioPh: 'Розкажіть про свій досвід, освіту, спеціалізацію, відомі справи, сертифікати й нагороди. Пишіть вільно — обмеження зверху немає.',
      charLeft: 'ще {n} символів до мінімуму',
      charEnough: '{n} символів — достатньо ✓',
      bioMinHint: 'Мінімум 3 000 символів. Більше — краще: що детальніше опишете досвід, то сильніший профіль складе AI.',
      finish: 'Завершити →',
      doneTitle: 'Готово!',
      doneSub: 'Ваш профіль створюється. Ми надішлемо підтвердження на {email}.'
    },
    fullProfile: {
      finish: 'Завершити →',
      strengthLabel: 'Сила профілю',
      strengthHint: {
        high: '✓ Сильний профіль — AI дасть чудовий результат',
        mid: 'Гарний початок — додайте більше деталей для кращої якості AI',
        low: 'Додайте деталі нижче — що більше інформації, то сильніший Ваш AI-профіль'
      },
      aboutLabel: 'Про себе',
      aboutHint: 'рекомендовано 3000+ символів',
      aboutPh: 'Розкажіть про свій досвід, освіту, досягнення, відомі справи, сертифікати, нагороди…',
      cvCtaTitle: '📄 Маєте резюме? Завантажте — це підвищує силу профілю на 30%',
      cvCtaBody: "Наш AI згенерує Ваш публічний профіль <strong>прямо з Вашого резюме</strong>. Досвід, освіта, сертифікати, відомі справи й досягнення витягуються автоматично. <em>Необов'язково, але дуже рекомендовано.</em>",
      cvLabel: 'Завантажте резюме',
      cvHint: "необов'язково · .pdf / .doc / .docx",
      cvPlaceholder: 'Натисніть, щоб обрати .pdf / .doc / .docx',
      optional: "необов'язково",
      doneTitle: 'Готово!',
      doneSub: 'Ваш профіль створюється. Ми надішлемо підтвердження на {email}.'
    },
    profilesPricing: {
      previewTitle: 'Ваш профіль на',
      prevPlan: 'Попередній план',
      nextPlan: 'Наступний план',
      recommended: 'РЕКОМЕНДОВАНО ВАМ',
      plans: { base: 'Start', pro: 'Pro', premium: 'Premium' },
      cta: { base: 'Обрати Start', pro: 'Обрати Pro', premium: 'Обрати Premium' },
      demo: { name: 'Олександр Коваленко', role: 'Адвокат', location: 'Україна, Київ' },
      demoPremium: { name: 'Alexander König', role: 'Attorney', location: 'Україна, Київ' },
      avatarAlt: 'Адвокат',
      avatarLabel: 'Перегляд AI-аватара',
      avatarTagline: 'Ваш AI-аватар створює професійні відео від Вашого імені для сайту та соціальних мереж',
      monthly: 'Щомісяця',
      annual: 'Щороку',
      saveBadge: '−10%',
      trustTitle: 'Створено для українських юристів',
      trustEthicsHtml: 'Відповідає <strong>правилам адвокатської етики</strong>',
      trustDataHtml: '<strong>Захист даних</strong> · SOC 2',
      customQuote: 'Велика фірма? Індивідуальна пропозиція',
      close: 'Закрити',
      lead: {
        title: 'Реєстрація команди',
        sub: "Розкажіть про Вашу фірму — менеджер зв'яжеться протягом 24 годин з індивідуальним планом.",
        note: 'Цей план для команд від 10 спеціалістів. Для менших — оберіть Start, Pro або Premium.',
        firmName: 'Назва фірми',
        companyName: 'Назва компанії',
        teamSize: 'Розмір команди',
        teamSizeHint: '(мінімум 10)',
        teamSizePh: 'напр. 12',
        location: 'Місто',
        email: "Email для зв'язку",
        phone: 'Телефон',
        message: 'Що Вам потрібно?',
        messagePh: 'Обсяг, інтеграції, white-label, терміни…',
        submit: 'Замовити дзвінок',
        sending: 'Надсилання…',
        foot: "Надсилаючи, Ви погоджуєтесь, що з Вами зв'яжеться наша команда.",
        thanksTitle: 'Дякуємо!',
        thanksSub: "Менеджер зв'яжеться протягом 24 годин з індивідуальним планом для Вашої команди."
      }
    },
    payment: {
      periods: { '1_month': '1 місяць', '1_year': '1 рік' },
      saveBadge: '-10%',
      savedHero: 'ВИ ЩОЙНО ЗЕКОНОМИЛИ',
      rows: {
        plan: 'Тариф {plan} — {period}',
        urgency: 'Знижка за терміновість (20%)',
        total: 'Разом'
      },
      paypal: 'Оплатити через PayPal',
      card: 'Оплатити карткою',
      sending: 'Надсилання…',
      faqHeading: 'Часті запитання',
      faq: {
        clients: {
          q: 'Скільки клієнтів я можу отримувати на місяць?',
          a: 'Залежно від спеціалізації, міста й оптимізації профілю — багато юристів отримують 5–15 клієнтів вже в перший місяць, з часом масштабуючись до 20–30+ завдяки AI-контенту та SEO-просуванню.'
        },
        guarantee: {
          q: 'Це гарантована кількість клієнтів?',
          a: 'Ми надаємо Вам ліди, з якими Ви працюєте самостійно. Також можна працювати на ексклюзивних умовах із клієнтами платформи — у такому разі це вже оплачені клієнти.'
        },
        payment: {
          q: 'Як працює оплата?',
          a: 'У нас три тарифи: Start, Pro і Premium. Вартість значно нижча за традиційні маркетингові агенції. Багато юристів окуповують підписку вже 1–2 клієнтами.'
        },
        noClients: {
          q: 'А якщо клієнтів не буде?',
          a: 'Наявність лідів залежить від Вашої активності на платформі. Ми гарантуємо безперебійний доступ до платформи та її ресурсів. Оплата не повертається після надання доступу.'
        },
        data: {
          q: 'Чи безпечні мої дані?',
          a: 'Так, ми використовуємо захищений месенджер, шифрування даних і не передаємо інформацію третім сторонам. Платформа відповідає вимогам захисту персональних даних (GDPR і законодавство України).'
        }
      }
    }
  },
  pricing: {
    perMonthShort: '/міс',
    note: {
      monthly: 'на місяць, щомісячна оплата',
      annual: 'на місяць, річна оплата (−10%)'
    },
    features: {
      profile_basic: 'Базовий рівень персонального профілю',
      profile_pro: 'Професійний рівень персонального профілю',
      video_avatar: 'Відеоаватар для просування ваших послуг',
      leads_3: 'Придбання до 3 лідів/міс',
      leads_6: 'Придбання до 6 лідів/міс',
      leads_unlim: 'Необмежене придбання лідів',
      google: 'Просування вашого імені та професійного профілю в Google',
      manager_ext: 'Персональний менеджер із розширеною підтримкою',
      manager_247: '24/7 персональний менеджер, який забезпечить швидкий заробіток',
      exclusive_smm: 'Ексклюзивне просування в соціальних мережах',
      own_services: 'Просування власних послуг',
      ai_google: 'AI-модуль для запуску реклами в Google',
      ai_meta: 'AI-модуль для запуску реклами в Meta',
      ai_monitoring: 'AI-моніторинг активності та пропозицій конкурентів',
      crm: 'Вбудована система для роботи з клієнтами та заявками',
      referral: 'Можливість заробляти, поділившись реферальним кодом із колегами',
      messenger: 'Захищений зв\'язок через спеціальний месенджер у додатку з можливістю запису розмов та контролю співробітників',
      private_chat: 'Закритий чат для спеціалістів',
      rating_boost: 'Можливість збільшити рейтинг за рахунок попереднього досвіду'
    },
    badges: {
      new: 'НОВЕ',
      more_4x: '4x більше',
      more_5x: '5x більше',
      more_2_5x: '2.5x більше',
      infinity: '∞',
      upgrade: 'АПГРЕЙД'
    }
  }
}

const ru = {
  meta: { title: 'CONSULTANT — больше клиентов для Вашей практики' },
  common: {
    next: 'Далее →',
    back: 'Назад',
    skip: 'Пропустить',
    selectOneOrMore: 'Выберите один или более',
    chosen: 'выбрано',
    discountBanner: 'СКИДКА 20% ТОЛЬКО ДЛЯ ВАС!',
    timer: { hours: 'ч', minutes: 'мин', seconds: 'сек' },
    videoSound: { on: 'Включить звук', off: 'Выключить звук' },
    videoPause: { pause: 'Пауза', play: 'Воспроизвести' }
  },
  topbar: { step: 'ШАГ {n} / {total}' },
  validation: {
    required: 'Заполните это поле',
    emailInvalid: 'Неверный формат email',
    phoneInvalid: 'Неверный номер телефона'
  },
  slides: {
    greeting: {
      q: 'Приветствуем в <span class="accent">CONSULTANT</span>',
      sub: 'Посмотрите короткое приветствие — и пройдите опрос. Это 2 минуты, а в конце Вы увидите своё решение.'
    },
    contact: {
      q: 'Давайте <span class="accent">познакомимся</span>',
      sub: 'Чтобы отправить Ваш персональный расчёт, даже если Вы не завершите опрос.',
      fields: {
        first_name: { label: 'Имя', ph: 'Александр' },
        last_name: { label: 'Фамилия', ph: 'Коваленко' },
        email: { label: 'Email', ph: 'oleksandr@example.com' },
        phone: { label: 'Телефон', ph: '+380 67 123 45 67' }
      }
    },
    search_time: {
      q: 'Сколько времени в неделю Вы тратите на <span class="accent">поиск новых клиентов?</span>',
      sub: 'Включая звонки, соцсети и рекомендации',
      opt: {
        lt_2: 'Меньше 2 часов',
        h_2_5: '2–5 часов',
        h_5_10: '5–10 часов',
        no_time: 'Вообще не успеваю'
      }
    },
    growth_blocker: {
      q: 'Что сейчас больше всего <span class="accent">мешает расти?</span>',
      sub: 'Выберите то, что болит сильнее всего',
      opt: {
        few_leads: 'Мало заявок',
        no_deals: 'Заявки есть, но не доходят до сделки',
        routine: 'Теряюсь в рутине (документы, звонки)',
        no_system: 'Нет системы, всё хаотично'
      }
    },
    services: {
      q: 'В какой сфере права Вы <span class="accent">практикуете?</span>',
      sub: 'Выберите всё, что подходит',
      opt: {
        medical: 'Медицинское право',
        ecology: 'Экологическое право',
        doc_analysis: 'Юридический анализ документов',
        auto: 'Автомобильные споры',
        corporate: 'Хозяйственное и корпоративное право',
        military: 'Военное право',
        documents: 'Подготовка и правовой анализ документов',
        debt_collection: 'Взыскание задолженности',
        criminal: 'Уголовное право',
        migration: 'Миграционное право',
        real_estate: 'Недвижимость и земельное право',
        labour: 'Трудовое право',
        social: 'Социальные выплаты и споры',
        family: 'Семейное право',
        debtor_protection: 'Защита должника',
        other: 'Другие юридические услуги'
      }
    },
    desired_clients: {
      q: 'Сколько клиентов Вы хотите получать <span class="accent">ежемесячно?</span>',
      sub: 'Это определит, какой план Вам подойдёт',
      opt: {
        c_to_10: 'До 10 клиентов',
        c_10_30: '10–30 клиентов',
        c_30_50: '30–50 клиентов',
        c_50_plus: '50+ клиентов'
      }
    },
    solution: {
      q: 'Вот Ваше <span class="accent">решение</span>',
      sub: 'Рассчитано по Вашим ответам.'
    },
    pricing: { q: 'Вот что <span class="accent">решит</span> эту проблему', sub: '' },
    payment: { q: 'Завершите <span class="accent">покупку</span>', sub: '' },
    photoUpload: {
      q: 'Загрузите <span class="accent">своё фото!</span>',
      sub: 'Загрузите своё фото для генерации видео-аватара для Вашего профиля'
    },
    aiPotential: {
      q: 'Ваш потенциал с <span class="accent">CONSULTANT</span>',
      sub: 'AI рассчитал по Вашим направлениям и рынку: сколько новых клиентов и дохода Вы можете получать ежемесячно — и сколько это стоило бы без нас.'
    },
    assessment: {
      q: 'Последний шаг — Ваш <span class="accent">профиль</span>',
      sub: 'Выберите, как его заполнить. Дальше всё сделает AI.'
    },
    fullProfile: {
      q: 'Заполните свой <span class="accent">профиль</span>',
      sub: 'Выберите одно — напишите подробное био (3 000+ символов) или загрузите резюме. Остальное сгенерирует наш AI.'
    }
  },
  cards: {
    greeting: { start: 'Начать →' },
    solution: {
      gainEyebrow: 'С CONSULTANT это',
      gainCap: 'новых клиентов ежемесячно',
      gainRevenueLabel: 'Потенциальный доход',
      proof: {
        lawyers: '2 500+',
        lawyersCap: 'юристов уже с нами',
        growth: '+183%',
        growthCap: 'ср. рост дохода',
        renew: '94%',
        renewCap: 'продлевают подписку'
      },
      cta: 'Показать тарифы →'
    },
    callback: {
      plaque: 'Не готовы платить сейчас? Закажите звонок менеджера на номер',
      noPhone: 'укажите номер',
      label: 'Номер для звонка',
      submit: 'Заказать звонок',
      sending: 'Отправка…',
      done: '✓ Готово — менеджер позвонит на {phone} в течение рабочего дня.'
    },
    cta: {
      recommendedNote: 'Ваш план: {plan} — {price}/мес',
      buyNow: 'Купить сейчас',
      buyNowHint: 'Сразу к оплате выбранного плана',
      scheduleCall: 'Запланировать звонок',
      scheduleHint: 'Менеджер позвонит в удобное время',
      calendar: {
        title: 'Выберите удобное время',
        sub: 'Мы позвоним на {phone} — номер уже сохранён.',
        today: 'Сегодня',
        tomorrow: 'Завтра',
        pickDay: 'День',
        pickTime: 'Время',
        topicLabel: 'О чём поговорить?',
        topicPh: 'Коротко: что именно хотите решить…',
        topics: {
          plan: 'Какой план выбрать',
          leads: 'Как работают заявки',
          demo: 'Показать платформу',
          team: 'Условия для команды'
        },
        submit: 'Подтвердить звонок',
        sending: 'Отправка…',
        thanksTitle: 'Звонок запланирован!',
        thanksSub: 'Менеджер позвонит {when} на номер {phone}.',
        close: 'Закрыть',
        weekdays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
      }
    },
    photo: {
      dropHint: 'Нажмите, чтобы загрузить своё фото',
      dropSub: 'JPEG или PNG · до 5 МБ · горизонтальное 16:9',
      error: {
        badType: 'Неверный формат — только JPEG / PNG',
        tooBig: 'Файл слишком большой — максимум 5 МБ'
      },
      previewAlt: 'Превью фото',
      uploadOwn: 'Загрузить своё фото',
      samplesTitle: 'Нет своего фото под рукой? Выберите образец 👇',
      sampleLabel: 'Образец'
    },
    aiPotential: {
      heroEyebrow: 'С нами Вы зарабатываете',
      clientsLabel: 'потенциальных клиентов ежемесячно',
      revenue: '≈ {low} – {high}',
      revenueCaption: 'дохода / мес',
      priceLabel: 'всё это за подписку {amount}/мес',
      compareQ: 'Чтобы получить такой поток самостоятельно — нужна <b>целая команда:</b>',
      teamRoleCost: '{low}–{high} тыс ₴',
      teamRoles: {
        seo: 'SEO-специалист',
        targeting: 'Таргетолог (реклама)',
        content: 'Контент-мейкер',
        video: 'Видеомонтажёр',
        smm: 'SMM-менеджер'
      },
      teamTotalLabel: 'Вместе своя команда',
      teamTotal: '{low}–{high} ₴/мес',
      usLabel: 'CONSULTANT — всё в одном',
      ourPlan: '{amount}/мес',
      punchHtml: 'В <b>{times}×</b> дешевле — экономия до <b>{save}/мес</b>',
      finePrintLabel: 'Рассчитано для:',
      finePrintDisclaimer: 'Только оценка — фактический результат зависит от рынка, оптимизации профиля и собственных усилий. Не является гарантией дохода.',
      serviceFallback: 'Общее'
    },
    assessment: {
      levels: { low: 'Низкий', normal: 'Нормальный', mid: 'Умеренный', high: 'Высокий' },
      yourLevel: 'Ваш уровень:',
      calculatedFor: 'Рассчитано для:',
      factors: 'Факторы: сфера практики, желаемое количество клиентов, текущая загрузка.',
      disclaimer: 'Только оценка — фактический результат может отличаться. Не является гарантией дохода.',
      serviceFallback: 'Общее',
      whyTitle: 'Зачем это нужно',
      whyLead: 'Из этого AI соберёт Ваш публичный профиль на CONSULTANT — сам, за несколько минут. Опыт, образование, сертификаты и известные дела извлекаются автоматически.',
      why: {
        profile: 'Готовый профиль вместо пустой карточки',
        google: 'Топ в Google по Вашему имени',
        clients: 'Клиенты находят Вас сами, без рекламы'
      },
      warn: 'Пока что AI не из чего строить Ваш профиль. Юристы с пустым профилем стоят в выдаче ниже коллег и получают значительно меньше заявок.',
      chooseLabel: 'Выберите, как заполнить профиль',
      tabCv: 'Загрузить резюме',
      tabCvNote: 'быстрее всего — 10 секунд',
      tabBio: 'Написать о себе',
      tabBioNote: 'минимум 3 000 символов',
      cvPlaceholder: 'Нажмите, чтобы выбрать файл',
      cvHint: '.pdf / .doc / .docx',
      bioPh: 'Расскажите о своём опыте, образовании, специализации, известных делах, сертификатах и наградах. Пишите свободно — ограничения сверху нет.',
      charLeft: 'ещё {n} символов до минимума',
      charEnough: '{n} символов — достаточно ✓',
      bioMinHint: 'Минимум 3 000 символов. Больше — лучше: чем подробнее опишете опыт, тем сильнее профиль составит AI.',
      finish: 'Завершить →',
      doneTitle: 'Готово!',
      doneSub: 'Ваш профиль создаётся. Мы отправим подтверждение на {email}.'
    },
    fullProfile: {
      finish: 'Завершить →',
      strengthLabel: 'Сила профиля',
      strengthHint: {
        high: '✓ Сильный профиль — AI даст отличный результат',
        mid: 'Хорошее начало — добавьте больше деталей для лучшего качества AI',
        low: 'Добавьте детали ниже — чем больше информации, тем сильнее Ваш AI-профиль'
      },
      aboutLabel: 'О себе',
      aboutHint: 'рекомендовано 3000+ символов',
      aboutPh: 'Расскажите о своём опыте, образовании, достижениях, известных делах, сертификатах, наградах…',
      cvCtaTitle: '📄 Есть резюме? Загрузите — это повышает силу профиля на 30%',
      cvCtaBody: 'Наш AI сгенерирует Ваш публичный профиль <strong>прямо из Вашего резюме</strong>. Опыт, образование, сертификаты, известные дела и достижения извлекаются автоматически. <em>Необязательно, но очень рекомендуется.</em>',
      cvLabel: 'Загрузите резюме',
      cvHint: 'необязательно · .pdf / .doc / .docx',
      cvPlaceholder: 'Нажмите, чтобы выбрать .pdf / .doc / .docx',
      optional: 'необязательно',
      doneTitle: 'Готово!',
      doneSub: 'Ваш профиль создаётся. Мы отправим подтверждение на {email}.'
    },
    profilesPricing: {
      previewTitle: 'Ваш профиль на',
      prevPlan: 'Предыдущий план',
      nextPlan: 'Следующий план',
      recommended: 'РЕКОМЕНДОВАНО ВАМ',
      plans: { base: 'Start', pro: 'Pro', premium: 'Premium' },
      cta: { base: 'Выбрать Start', pro: 'Выбрать Pro', premium: 'Выбрать Premium' },
      demo: { name: 'Александр Коваленко', role: 'Адвокат', location: 'Украина, Киев' },
      demoPremium: { name: 'Alexander König', role: 'Attorney', location: 'Украина, Киев' },
      avatarAlt: 'Адвокат',
      avatarLabel: 'Просмотр AI-аватара',
      avatarTagline: 'Ваш AI-аватар создаёт профессиональные видео от Вашего имени для сайта и соцсетей',
      monthly: 'Ежемесячно',
      annual: 'Ежегодно',
      saveBadge: '−10%',
      trustTitle: 'Создано для украинских юристов',
      trustEthicsHtml: 'Соответствует <strong>правилам адвокатской этики</strong>',
      trustDataHtml: '<strong>Защита данных</strong> · SOC 2',
      customQuote: 'Большая фирма? Индивидуальное предложение',
      close: 'Закрыть',
      lead: {
        title: 'Регистрация команды',
        sub: 'Расскажите о Вашей фирме — менеджер свяжется в течение 24 часов с индивидуальным планом.',
        note: 'Этот план для команд от 10 специалистов. Для меньших — выберите Start, Pro или Premium.',
        firmName: 'Название фирмы',
        companyName: 'Название компании',
        teamSize: 'Размер команды',
        teamSizeHint: '(минимум 10)',
        teamSizePh: 'напр. 12',
        location: 'Город',
        email: 'Email для связи',
        phone: 'Телефон',
        message: 'Что Вам нужно?',
        messagePh: 'Объём, интеграции, white-label, сроки…',
        submit: 'Заказать звонок',
        sending: 'Отправка…',
        foot: 'Отправляя, Вы соглашаетесь, что с Вами свяжется наша команда.',
        thanksTitle: 'Спасибо!',
        thanksSub: 'Менеджер свяжется в течение 24 часов с индивидуальным планом для Вашей команды.'
      }
    },
    payment: {
      periods: { '1_month': '1 месяц', '1_year': '1 год' },
      saveBadge: '-10%',
      savedHero: 'ВЫ ТОЛЬКО ЧТО СЭКОНОМИЛИ',
      rows: {
        plan: 'Тариф {plan} — {period}',
        urgency: 'Скидка за срочность (20%)',
        total: 'Итого'
      },
      paypal: 'Оплатить через PayPal',
      card: 'Оплатить картой',
      sending: 'Отправка…',
      faqHeading: 'Частые вопросы',
      faq: {
        clients: {
          q: 'Сколько клиентов я могу получать в месяц?',
          a: 'В зависимости от специализации, города и оптимизации профиля — многие юристы получают 5–15 клиентов уже в первый месяц, со временем масштабируясь до 20–30+ благодаря AI-контенту и SEO-продвижению.'
        },
        guarantee: {
          q: 'Это гарантированное количество клиентов?',
          a: 'Мы предоставляем Вам лиды, с которыми Вы работаете самостоятельно. Также можно работать на эксклюзивных условиях с клиентами платформы — в этом случае это уже оплаченные клиенты.'
        },
        payment: {
          q: 'Как работает оплата?',
          a: 'У нас три тарифа: Start, Pro и Premium. Стоимость значительно ниже, чем у традиционных маркетинговых агентств. Многие юристы окупают подписку уже 1–2 клиентами.'
        },
        noClients: {
          q: 'А если клиентов не будет?',
          a: 'Наличие лидов зависит от Вашей активности на платформе. Мы гарантируем бесперебойный доступ к платформе и её ресурсам. Оплата не возвращается после предоставления доступа.'
        },
        data: {
          q: 'Безопасны ли мои данные?',
          a: 'Да, мы используем защищённый мессенджер, шифрование данных и не передаём информацию третьим сторонам. Платформа соответствует требованиям защиты персональных данных (GDPR и законодательство Украины).'
        }
      }
    }
  },
  pricing: {
    perMonthShort: '/мес',
    note: {
      monthly: 'в месяц, ежемесячная оплата',
      annual: 'в месяц, годовая оплата (−10%)'
    },
    features: {
      profile_basic: 'Базовый уровень персонального профиля',
      profile_pro: 'Профессиональный уровень профиля',
      video_avatar: 'Видеоаватар для продвижения ваших услуг',
      leads_3: 'Покупка до 3 лидов/мес',
      leads_6: 'Покупка до 6 лидов/мес',
      leads_unlim: 'Безлимитная покупка лидов',
      google: 'Продвижение вашего имени и профессионального профиля в Google',
      manager_ext: 'Персональный менеджер с расширенной поддержкой',
      manager_247: '24/7 персональный менеджер, который обеспечит быстрый заработок',
      exclusive_smm: 'Эксклюзивное продвижение в социальных сетях',
      own_services: 'Продвижение собственных услуг',
      ai_google: 'AI-модуль для запуска рекламы в Google',
      ai_meta: 'AI-модуль для запуска рекламы в Meta',
      ai_monitoring: 'AI-мониторинг активности и предложений конкурентов',
      crm: 'Встроенная система для работы с клиентами и заявками',
      referral: 'Возможность зарабатывать, поделившись реферальным кодом с коллегами',
      messenger: 'Защищённая связь через специальный мессенджер в приложении с возможностью записи разговоров и контроля сотрудников',
      private_chat: 'Закрытый чат для специалистов',
      rating_boost: 'Возможность повысить рейтинг за счёт предыдущего опыта'
    },
    badges: {
      new: 'НОВОЕ',
      more_4x: '4x больше',
      more_5x: '5x больше',
      more_2_5x: '2.5x больше',
      infinity: '∞',
      upgrade: 'АПГРЕЙД'
    }
  }
}

// ── Рушій локалізації ────────────────────────────────────────────────────────

const en = {
  "meta": {
    "title": "CONSULTANT — more clients for your practice"
  },
  "common": {
    "next": "Next →",
    "back": "Back",
    "skip": "Skip",
    "selectOneOrMore": "Select one or more",
    "chosen": "selected",
    "discountBanner": "20% OFF — JUST FOR YOU!",
    "timer": {
      "hours": "h",
      "minutes": "min",
      "seconds": "sec"
    },
    "videoSound": {
      "on": "Turn on sound",
      "off": "Turn off sound"
    },
    "videoPause": {
      "pause": "Pause",
      "play": "Play"
    }
  },
  "topbar": {
    "step": "STEP {n} / {total}"
  },
  "validation": {
    "required": "Please fill in this field",
    "emailInvalid": "Invalid email format",
    "phoneInvalid": "Invalid phone number"
  },
  "slides": {
    "greeting": {
      "q": "Welcome to <span class=\"accent\">CONSULTANT</span>",
      "sub": "Watch a short intro and take the quiz. It's 2 minutes, and at the end you'll see your solution."
    },
    "contact": {
      "q": "Let's <span class=\"accent\">get to know you</span>",
      "sub": "So we can send your personal estimate — even if you don't finish the quiz.",
      "fields": {
        "first_name": {
          "label": "First name",
          "ph": "Alexander"
        },
        "last_name": {
          "label": "Last name",
          "ph": "Miller"
        },
        "email": {
          "label": "Email",
          "ph": "alexander@example.com"
        },
        "phone": {
          "label": "Phone",
          "ph": "+1 202 555 0147"
        }
      }
    },
    "search_time": {
      "q": "How much time a week do you spend on <span class=\"accent\">finding new clients?</span>",
      "sub": "Including calls, social media and referrals",
      "opt": {
        "lt_2": "Less than 2 hours",
        "h_2_5": "2–5 hours",
        "h_5_10": "5–10 hours",
        "no_time": "I never have time"
      }
    },
    "growth_blocker": {
      "q": "What's holding you back <span class=\"accent\">from growing?</span>",
      "sub": "Pick what hurts the most",
      "opt": {
        "few_leads": "Too few inquiries",
        "no_deals": "Inquiries come, but don't convert",
        "routine": "Lost in the routine (documents, calls)",
        "no_system": "No system, everything is chaotic"
      }
    },
    "services": {
      "q": "What area of law do you <span class=\"accent\">practice in?</span>",
      "sub": "Select all that apply",
      "opt": {
        "banking_finance": "Banking & Financial Law",
        "real_estate": "Real Estate Law",
        "labour_law": "Labor Law",
        "intellectual_property": "Intellectual Property Law",
        "general": "General Legal Services",
        "family_law": "Family Law",
        "business": "Business & Corporate Law",
        "taxes": "Tax Law",
        "cars": "Motor Vehicle Law",
        "employment": "Employment Law",
        "immigration_law": "Immigration Law"
      }
    },
    "desired_clients": {
      "q": "How many clients do you want to get <span class=\"accent\">per month?</span>",
      "sub": "This will determine which plan fits you",
      "opt": {
        "c_to_10": "Up to 10 clients",
        "c_10_30": "10–30 clients",
        "c_30_50": "30–50 clients",
        "c_50_plus": "50+ clients"
      }
    },
    "solution": {
      "q": "Here's your <span class=\"accent\">solution</span>",
      "sub": "Calculated from your answers."
    },
    "pricing": {
      "q": "Here's what will <span class=\"accent\">solve</span> this",
      "sub": ""
    },
    "payment": {
      "q": "Complete your <span class=\"accent\">purchase</span>",
      "sub": ""
    },
    "photoUpload": {
      "q": "Upload <span class=\"accent\">your photo!</span>",
      "sub": "Upload your photo to generate a video avatar for your profile"
    },
    "aiPotential": {
      "q": "Your potential with <span class=\"accent\">CONSULTANT</span>",
      "sub": "AI calculated for your areas and market: how many new clients and income you can get per month — and what it would cost without us."
    },
    "assessment": {
      "q": "Last step — your <span class=\"accent\">profile</span>",
      "sub": "Choose how to fill it in. AI does the rest."
    },
    "fullProfile": {
      "q": "Complete your <span class=\"accent\">profile</span>",
      "sub": "Choose one — write a detailed bio (3,000+ characters) or upload a CV. AI generates the rest."
    }
  },
  "cards": {
    "greeting": {
      "start": "Start →"
    },
    "solution": {
      "gainEyebrow": "With CONSULTANT that's",
      "gainCap": "new clients per month",
      "gainRevenueLabel": "Potential income",
      "proof": {
        "lawyers": "2,500+",
        "lawyersCap": "lawyers already with us",
        "growth": "+183%",
        "growthCap": "avg. income growth",
        "renew": "94%",
        "renewCap": "renew their subscription"
      },
      "cta": "Show plans →"
    },
    "callback": {
      "plaque": "Not ready to pay now? Request a manager call to",
      "noPhone": "enter number",
      "label": "Number to call",
      "submit": "Request a call",
      "sending": "Sending…",
      "done": "✓ Done — a manager will call {phone} during the business day."
    },
    "cta": {
      "recommendedNote": "Your plan: {plan} — {price}/mo",
      "buyNow": "Buy now",
      "buyNowHint": "Straight to checkout for the selected plan",
      "scheduleCall": "Schedule a call",
      "scheduleHint": "A manager will call at a convenient time",
      "calendar": {
        "title": "Pick a convenient time",
        "sub": "We'll call {phone} — the number is already saved.",
        "today": "Today",
        "tomorrow": "Tomorrow",
        "pickDay": "Day",
        "pickTime": "Time",
        "topicLabel": "What to talk about?",
        "topicPh": "Briefly: what exactly you want to solve…",
        "topics": {
          "plan": "Which plan to choose",
          "leads": "How inquiries work",
          "demo": "Show the platform",
          "team": "Terms for a team"
        },
        "submit": "Confirm the call",
        "sending": "Sending…",
        "thanksTitle": "Call scheduled!",
        "thanksSub": "A manager will call {when} at {phone}.",
        "close": "Close",
        "weekdays": [
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat"
        ],
        "months": [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ]
      }
    },
    "photo": {
      "dropHint": "Tap to upload your photo",
      "dropSub": "JPEG or PNG · up to 5 MB · landscape 16:9",
      "error": {
        "badType": "Wrong format — JPEG / PNG only",
        "tooBig": "File too large — 5 MB max"
      },
      "previewAlt": "Photo preview",
      "uploadOwn": "Upload your photo",
      "samplesTitle": "No photo handy? Pick a sample 👇",
      "sampleLabel": "Sample"
    },
    "aiPotential": {
      "heroEyebrow": "With us you earn",
      "clientsLabel": "potential clients per month",
      "revenue": "≈ {low} – {high}",
      "revenueCaption": "income / mo",
      "priceLabel": "all this for a {amount}/mo subscription",
      "compareQ": "To get this flow on your own you'd need <b>a whole team:</b>",
      "teamRoleCost": "{low}–{high}k",
      "teamRoles": {
        "seo": "SEO specialist",
        "targeting": "Ad specialist",
        "content": "Content creator",
        "video": "Video editor",
        "smm": "SMM manager"
      },
      "teamTotalLabel": "Your own team total",
      "teamTotal": "{low}–{high}/mo",
      "usLabel": "CONSULTANT — all in one",
      "ourPlan": "{amount}/mo",
      "punchHtml": "<b>{times}×</b> cheaper — save up to <b>{save}/mo</b>",
      "finePrintLabel": "Calculated for:",
      "finePrintDisclaimer": "Estimate only — actual results depend on the market, profile optimization and your own effort. Not a guarantee of income.",
      "serviceFallback": "General"
    },
    "assessment": {
      "levels": {
        "low": "Low",
        "normal": "Normal",
        "mid": "Moderate",
        "high": "High"
      },
      "yourLevel": "Your level:",
      "calculatedFor": "Calculated for:",
      "factors": "Factors: practice area, desired number of clients, current workload.",
      "disclaimer": "Estimate only — actual results may differ. Not a guarantee of income.",
      "serviceFallback": "General",
      "whyTitle": "Why this matters",
      "whyLead": "From this, AI builds your public CONSULTANT profile — on its own, in a few minutes. Experience, education, certifications and notable cases are extracted automatically.",
      "why": {
        "profile": "A ready profile instead of an empty card",
        "google": "Top of Google for your name",
        "clients": "Clients find you themselves, without ads"
      },
      "warn": "AI has nothing to build your profile from yet. Lawyers with an empty profile rank below peers and get far fewer inquiries.",
      "chooseLabel": "Choose how to fill in the profile",
      "tabCv": "Upload a CV",
      "tabCvNote": "fastest — 10 seconds",
      "tabBio": "Write about yourself",
      "tabBioNote": "at least 3,000 characters",
      "cvPlaceholder": "Tap to choose a file",
      "cvHint": ".pdf / .doc / .docx",
      "bioPh": "Tell us about your experience, education, specialization, notable cases, certifications and awards. Write freely — there's no upper limit.",
      "charLeft": "{n} more characters to the minimum",
      "charEnough": "{n} characters — enough ✓",
      "bioMinHint": "Minimum 3,000 characters. More is better: the more detail, the stronger the profile AI builds.",
      "finish": "Finish →",
      "doneTitle": "Done!",
      "doneSub": "Your profile is being created. We'll send confirmation to {email}."
    },
    "fullProfile": {
      "finish": "Finish →",
      "strengthLabel": "Profile strength",
      "strengthHint": {
        "high": "✓ Strong profile — AI will do great",
        "mid": "Good start — add more detail for better AI quality",
        "low": "Add details below — the more info, the stronger your AI profile"
      },
      "aboutLabel": "About you",
      "aboutHint": "recommended 3000+ characters",
      "aboutPh": "Tell us about your experience, education, achievements, notable cases, certifications, awards…",
      "cvCtaTitle": "📄 Have a CV? Upload it — it boosts profile strength by 30%",
      "cvCtaBody": "Our AI generates your public profile <strong>right from your CV</strong>. Experience, education, certifications, notable cases and achievements are extracted automatically. <em>Optional, but highly recommended.</em>",
      "cvLabel": "Upload a CV",
      "cvHint": "optional · .pdf / .doc / .docx",
      "cvPlaceholder": "Tap to choose .pdf / .doc / .docx",
      "optional": "optional",
      "doneTitle": "Done!",
      "doneSub": "Your profile is being created. We'll send confirmation to {email}."
    },
    "profilesPricing": {
      "previewTitle": "Your profile on",
      "prevPlan": "Previous plan",
      "nextPlan": "Next plan",
      "recommended": "RECOMMENDED FOR YOU",
      "plans": {
        "base": "Start",
        "pro": "Pro",
        "premium": "Premium"
      },
      "cta": {
        "base": "Choose Start",
        "pro": "Choose Pro",
        "premium": "Choose Premium"
      },
      "demo": {
        "name": "Alexander Miller",
        "role": "Attorney",
        "location": "New York, USA"
      },
      "demoPremium": {
        "name": "Alexander König",
        "role": "Attorney",
        "location": "New York, USA"
      },
      "avatarAlt": "Attorney",
      "avatarLabel": "AI avatar preview",
      "avatarTagline": "Your AI avatar creates professional videos in your name for your website and social media",
      "monthly": "Monthly",
      "annual": "Yearly",
      "saveBadge": "−10%",
      "trustTitle": "Built for lawyers",
      "trustEthicsHtml": "Complies with <strong>legal ethics rules</strong>",
      "trustDataHtml": "<strong>Data protection</strong> · SOC 2",
      "customQuote": "Large firm? Custom offer",
      "close": "Close",
      "lead": {
        "title": "Team registration",
        "sub": "Tell us about your firm — a manager will reach out within 24 hours with a custom plan.",
        "note": "This plan is for teams of 10+ specialists. For smaller ones — choose Start, Pro or Premium.",
        "firmName": "Firm name",
        "companyName": "Company name",
        "teamSize": "Team size",
        "teamSizeHint": "(minimum 10)",
        "teamSizePh": "e.g. 12",
        "location": "City",
        "email": "Contact email",
        "phone": "Phone",
        "message": "What do you need?",
        "messagePh": "Volume, integrations, white-label, timeline…",
        "submit": "Request a call",
        "sending": "Sending…",
        "foot": "By submitting, you agree that our team will contact you.",
        "thanksTitle": "Thank you!",
        "thanksSub": "A manager will reach out within 24 hours with a custom plan for your team."
      }
    },
    "payment": {
      "periods": {
        "1_month": "1 month",
        "1_year": "1 year"
      },
      "saveBadge": "-10%",
      "savedHero": "YOU JUST SAVED",
      "rows": {
        "plan": "{plan} plan — {period}",
        "urgency": "Urgency discount (20%)",
        "total": "Total"
      },
      "paypal": "Pay with PayPal",
      "card": "Pay by card",
      "sending": "Sending…",
      "faqHeading": "Frequently asked questions",
      "faq": {
        "clients": {
          "q": "How many clients can I get per month?",
          "a": "Depending on specialization, city and profile optimization — many lawyers get 5–15 clients in the first month, scaling to 20–30+ over time thanks to AI content and SEO."
        },
        "guarantee": {
          "q": "Is that a guaranteed number of clients?",
          "a": "We provide you with leads you work with yourself. You can also work on exclusive terms with platform clients — in that case they're already-paid clients."
        },
        "payment": {
          "q": "How does payment work?",
          "a": "We have three plans: Start, Pro and Premium. The cost is far lower than traditional marketing agencies. Many lawyers cover the subscription with just 1–2 clients."
        },
        "noClients": {
          "q": "What if there are no clients?",
          "a": "Lead availability depends on your activity on the platform. We guarantee uninterrupted access to the platform and its resources. Payment is non-refundable once access is granted."
        },
        "data": {
          "q": "Is my data safe?",
          "a": "Yes, we use a secure messenger, data encryption and don't share information with third parties. The platform complies with data protection requirements (GDPR)."
        }
      }
    }
  },
  "pricing": {
    "perMonthShort": "/mo",
    "note": {
      "monthly": "per month, billed monthly",
      "annual": "per month, billed yearly (−10%)"
    },
    "features": {
      "profile_basic": "Basic personal profile level",
      "profile_pro": "Professional personal profile level",
      "video_avatar": "Video avatar to promote your services",
      "leads_3": "Up to 3 leads/mo",
      "leads_6": "Up to 6 leads/mo",
      "leads_unlim": "Unlimited leads",
      "google": "Promotion of your name and professional profile on Google",
      "manager_ext": "Personal manager with extended support",
      "manager_247": "24/7 personal manager to ensure fast earnings",
      "exclusive_smm": "Exclusive promotion on social media",
      "own_services": "Promotion of your own services",
      "ai_google": "AI module to launch ads on Google",
      "ai_meta": "AI module to launch ads on Meta",
      "ai_monitoring": "AI monitoring of competitors' activity and offers",
      "crm": "Built-in system for clients and inquiries",
      "referral": "Earn by sharing your referral code with colleagues",
      "messenger": "Secure connection via a dedicated in-app messenger with call recording and staff control",
      "private_chat": "Private chat for specialists",
      "rating_boost": "Boost your rating based on prior experience"
    },
    "badges": {
      "new": "NEW",
      "more_4x": "4x more",
      "more_5x": "5x more",
      "more_2_5x": "2.5x more",
      "infinity": "∞",
      "upgrade": "UPGRADE"
    }
  }
}

const pl = {
  "meta": {
    "title": "CONSULTANT — więcej klientów dla Twojej praktyki"
  },
  "common": {
    "next": "Dalej →",
    "back": "Wstecz",
    "skip": "Pomiń",
    "selectOneOrMore": "Wybierz jeden lub więcej",
    "chosen": "wybrano",
    "discountBanner": "ZNIŻKA 20% TYLKO DLA CIEBIE!",
    "timer": {
      "hours": "godz",
      "minutes": "min",
      "seconds": "sek"
    },
    "videoSound": {
      "on": "Włącz dźwięk",
      "off": "Wyłącz dźwięk"
    },
    "videoPause": {
      "pause": "Pauza",
      "play": "Odtwórz"
    }
  },
  "topbar": {
    "step": "KROK {n} / {total}"
  },
  "validation": {
    "required": "Wypełnij to pole",
    "emailInvalid": "Nieprawidłowy format email",
    "phoneInvalid": "Nieprawidłowy numer telefonu"
  },
  "slides": {
    "greeting": {
      "q": "Witamy w <span class=\"accent\">CONSULTANT</span>",
      "sub": "Obejrzyj krótkie powitanie i wypełnij ankietę. To 2 minuty, a na końcu zobaczysz swoje rozwiązanie."
    },
    "contact": {
      "q": "<span class=\"accent\">Poznajmy się</span>",
      "sub": "Abyśmy mogli wysłać Twoją indywidualną kalkulację — nawet jeśli nie dokończysz ankiety.",
      "fields": {
        "first_name": {
          "label": "Imię",
          "ph": "Aleksander"
        },
        "last_name": {
          "label": "Nazwisko",
          "ph": "Kowalski"
        },
        "email": {
          "label": "Email",
          "ph": "aleksander@example.com"
        },
        "phone": {
          "label": "Telefon",
          "ph": "+48 601 234 567"
        }
      }
    },
    "search_time": {
      "q": "Ile czasu tygodniowo poświęcasz na <span class=\"accent\">pozyskiwanie nowych klientów?</span>",
      "sub": "Łącznie z telefonami, mediami społecznościowymi i poleceniami",
      "opt": {
        "lt_2": "Mniej niż 2 godziny",
        "h_2_5": "2–5 godzin",
        "h_5_10": "5–10 godzin",
        "no_time": "W ogóle nie nadążam"
      }
    },
    "growth_blocker": {
      "q": "Co najbardziej <span class=\"accent\">przeszkadza Ci rosnąć?</span>",
      "sub": "Wybierz to, co boli najbardziej",
      "opt": {
        "few_leads": "Mało zapytań",
        "no_deals": "Zapytania są, ale nie kończą się umową",
        "routine": "Gubię się w rutynie (dokumenty, telefony)",
        "no_system": "Brak systemu, wszystko chaotycznie"
      }
    },
    "services": {
      "q": "W jakiej dziedzinie prawa <span class=\"accent\">praktykujesz?</span>",
      "sub": "Wybierz wszystkie pasujące",
      "opt": {
        "social_integration": "Prawo świadczeń społecznych i integracji",
        "digital_id": "Identyfikacja cyfrowa i e-administracja",
        "tax_zus": "Prawo podatkowe, ZUS i finanse",
        "ip": "Prawo własności intelektualnej",
        "notarial": "Usługi notarialne",
        "accounting": "Doradztwo księgowe i podatkowe",
        "sworn_translation": "Tłumaczenia przysięgłe i prawne",
        "social_benefits": "Prawo świadczeń socjalnych",
        "education": "Prawo edukacyjne i studenckie",
        "social_insurance": "Prawo ubezpieczeń społecznych",
        "residence": "Legalizacja pobytu i prawo pobytowe",
        "compensation": "Odszkodowania i dochodzenie roszczeń",
        "real_estate": "Prawo nieruchomości",
        "inheritance": "Prawo spadkowe",
        "criminal": "Prawo karne",
        "tax_advisory": "Doradztwo podatkowe",
        "transport": "Prawo transportowe i drogowe",
        "labour": "Prawo pracy",
        "investment": "Prawo inwestycyjne i dotacje",
        "family": "Prawo rodzinne i opiekuńcze",
        "corporate": "Prawo gospodarcze i handlowe",
        "migration": "Prawo migracyjne",
        "other": "Pozostałe usługi prawne"
      }
    },
    "desired_clients": {
      "q": "Ilu klientów chcesz pozyskiwać <span class=\"accent\">miesięcznie?</span>",
      "sub": "To określi, który plan będzie dla Ciebie odpowiedni",
      "opt": {
        "c_to_10": "Do 10 klientów",
        "c_10_30": "10–30 klientów",
        "c_30_50": "30–50 klientów",
        "c_50_plus": "50+ klientów"
      }
    },
    "solution": {
      "q": "Oto Twoje <span class=\"accent\">rozwiązanie</span>",
      "sub": "Obliczono na podstawie Twoich odpowiedzi."
    },
    "pricing": {
      "q": "Oto co <span class=\"accent\">rozwiąże</span> ten problem",
      "sub": ""
    },
    "payment": {
      "q": "Dokończ <span class=\"accent\">zakup</span>",
      "sub": ""
    },
    "photoUpload": {
      "q": "Prześlij <span class=\"accent\">swoje zdjęcie!</span>",
      "sub": "Prześlij swoje zdjęcie, aby wygenerować awatar wideo dla Twojego profilu"
    },
    "aiPotential": {
      "q": "Twój potencjał z <span class=\"accent\">CONSULTANT</span>",
      "sub": "AI obliczyło dla Twoich obszarów i rynku: ilu nowych klientów i przychodu możesz uzyskać miesięcznie — i ile kosztowałoby to bez nas."
    },
    "assessment": {
      "q": "Ostatni krok — Twój <span class=\"accent\">profil</span>",
      "sub": "Wybierz, jak go wypełnić. Resztę zrobi AI."
    },
    "fullProfile": {
      "q": "Uzupełnij swój <span class=\"accent\">profil</span>",
      "sub": "Wybierz jedno — napisz szczegółowe bio (3 000+ znaków) lub prześlij CV. Resztę wygeneruje nasze AI."
    }
  },
  "cards": {
    "greeting": {
      "start": "Zacznij →"
    },
    "solution": {
      "gainEyebrow": "Z CONSULTANT to",
      "gainCap": "nowych klientów miesięcznie",
      "gainRevenueLabel": "Potencjalny przychód",
      "proof": {
        "lawyers": "2 500+",
        "lawyersCap": "prawników już z nami",
        "growth": "+183%",
        "growthCap": "śr. wzrost przychodu",
        "renew": "94%",
        "renewCap": "przedłuża subskrypcję"
      },
      "cta": "Pokaż plany →"
    },
    "callback": {
      "plaque": "Nie jesteś gotów zapłacić teraz? Zamów rozmowę z managerem na numer",
      "noPhone": "podaj numer",
      "label": "Numer do rozmowy",
      "submit": "Zamów rozmowę",
      "sending": "Wysyłanie…",
      "done": "✓ Gotowe — manager zadzwoni na {phone} w ciągu dnia roboczego."
    },
    "cta": {
      "recommendedNote": "Twój plan: {plan} — {price}/mies",
      "buyNow": "Kup teraz",
      "buyNowHint": "Od razu do płatności za wybrany plan",
      "scheduleCall": "Zaplanuj rozmowę",
      "scheduleHint": "Manager zadzwoni w dogodnym czasie",
      "calendar": {
        "title": "Wybierz dogodny czas",
        "sub": "Zadzwonimy na {phone} — numer jest już zapisany.",
        "today": "Dziś",
        "tomorrow": "Jutro",
        "pickDay": "Dzień",
        "pickTime": "Godzina",
        "topicLabel": "O czym porozmawiać?",
        "topicPh": "Krótko: co dokładnie chcesz rozwiązać…",
        "topics": {
          "plan": "Który plan wybrać",
          "leads": "Jak działają zapytania",
          "demo": "Pokaż platformę",
          "team": "Warunki dla zespołu"
        },
        "submit": "Potwierdź rozmowę",
        "sending": "Wysyłanie…",
        "thanksTitle": "Rozmowa zaplanowana!",
        "thanksSub": "Manager zadzwoni {when} na numer {phone}.",
        "close": "Zamknij",
        "weekdays": [
          "Nd",
          "Pn",
          "Wt",
          "Śr",
          "Cz",
          "Pt",
          "Sb"
        ],
        "months": [
          "stycznia",
          "lutego",
          "marca",
          "kwietnia",
          "maja",
          "czerwca",
          "lipca",
          "sierpnia",
          "września",
          "października",
          "listopada",
          "grudnia"
        ]
      }
    },
    "photo": {
      "dropHint": "Kliknij, aby przesłać swoje zdjęcie",
      "dropSub": "JPEG lub PNG · do 5 MB · poziome 16:9",
      "error": {
        "badType": "Zły format — tylko JPEG / PNG",
        "tooBig": "Plik za duży — maksymalnie 5 MB"
      },
      "previewAlt": "Podgląd zdjęcia",
      "uploadOwn": "Prześlij swoje zdjęcie",
      "samplesTitle": "Nie masz zdjęcia pod ręką? Wybierz przykład 👇",
      "sampleLabel": "Przykład"
    },
    "aiPotential": {
      "heroEyebrow": "Z nami zarabiasz",
      "clientsLabel": "potencjalnych klientów miesięcznie",
      "revenue": "≈ {low} – {high}",
      "revenueCaption": "przychodu / mies",
      "priceLabel": "to wszystko za subskrypcję {amount}/mies",
      "compareQ": "Aby uzyskać taki przepływ samodzielnie, potrzebujesz <b>całego zespołu:</b>",
      "teamRoleCost": "{low}–{high} tys",
      "teamRoles": {
        "seo": "Specjalista SEO",
        "targeting": "Specjalista ds. reklam",
        "content": "Twórca treści",
        "video": "Montażysta wideo",
        "smm": "Manager SMM"
      },
      "teamTotalLabel": "Razem własny zespół",
      "teamTotal": "{low}–{high}/mies",
      "usLabel": "CONSULTANT — wszystko w jednym",
      "ourPlan": "{amount}/mies",
      "punchHtml": "<b>{times}×</b> taniej — oszczędność do <b>{save}/mies</b>",
      "finePrintLabel": "Obliczono dla:",
      "finePrintDisclaimer": "Tylko szacunek — rzeczywisty wynik zależy od rynku, optymalizacji profilu i własnych starań. Nie jest gwarancją dochodu.",
      "serviceFallback": "Ogólne"
    },
    "assessment": {
      "levels": {
        "low": "Niski",
        "normal": "Normalny",
        "mid": "Umiarkowany",
        "high": "Wysoki"
      },
      "yourLevel": "Twój poziom:",
      "calculatedFor": "Obliczono dla:",
      "factors": "Czynniki: dziedzina praktyki, pożądana liczba klientów, obecne obciążenie.",
      "disclaimer": "Tylko szacunek — rzeczywisty wynik może się różnić. Nie jest gwarancją dochodu.",
      "serviceFallback": "Ogólne",
      "whyTitle": "Po co to potrzebne",
      "whyLead": "Z tego AI zbuduje Twój publiczny profil na CONSULTANT — samodzielnie, w kilka minut. Doświadczenie, wykształcenie, certyfikaty i znane sprawy są pobierane automatycznie.",
      "why": {
        "profile": "Gotowy profil zamiast pustej karty",
        "google": "Top w Google na Twoje nazwisko",
        "clients": "Klienci sami Cię znajdują, bez reklam"
      },
      "warn": "AI nie ma jeszcze z czego zbudować Twojego profilu. Prawnicy z pustym profilem są niżej w wynikach i dostają znacznie mniej zapytań.",
      "chooseLabel": "Wybierz, jak wypełnić profil",
      "tabCv": "Prześlij CV",
      "tabCvNote": "najszybciej — 10 sekund",
      "tabBio": "Napisz o sobie",
      "tabBioNote": "minimum 3 000 znaków",
      "cvPlaceholder": "Kliknij, aby wybrać plik",
      "cvHint": ".pdf / .doc / .docx",
      "bioPh": "Opowiedz o swoim doświadczeniu, wykształceniu, specjalizacji, znanych sprawach, certyfikatach i nagrodach. Pisz swobodnie — nie ma górnego limitu.",
      "charLeft": "jeszcze {n} znaków do minimum",
      "charEnough": "{n} znaków — wystarczy ✓",
      "bioMinHint": "Minimum 3 000 znaków. Więcej — lepiej: im więcej szczegółów, tym silniejszy profil zbuduje AI.",
      "finish": "Zakończ →",
      "doneTitle": "Gotowe!",
      "doneSub": "Twój profil jest tworzony. Wyślemy potwierdzenie na {email}."
    },
    "fullProfile": {
      "finish": "Zakończ →",
      "strengthLabel": "Siła profilu",
      "strengthHint": {
        "high": "✓ Silny profil — AI da świetny wynik",
        "mid": "Dobry początek — dodaj więcej szczegółów dla lepszej jakości AI",
        "low": "Dodaj szczegóły poniżej — im więcej informacji, tym silniejszy Twój profil AI"
      },
      "aboutLabel": "O sobie",
      "aboutHint": "zalecane 3000+ znaków",
      "aboutPh": "Opowiedz o swoim doświadczeniu, wykształceniu, osiągnięciach, znanych sprawach, certyfikatach, nagrodach…",
      "cvCtaTitle": "📄 Masz CV? Prześlij — zwiększa siłę profilu o 30%",
      "cvCtaBody": "Nasze AI wygeneruje Twój publiczny profil <strong>bezpośrednio z Twojego CV</strong>. Doświadczenie, wykształcenie, certyfikaty, znane sprawy i osiągnięcia są pobierane automatycznie. <em>Opcjonalnie, ale bardzo zalecane.</em>",
      "cvLabel": "Prześlij CV",
      "cvHint": "opcjonalnie · .pdf / .doc / .docx",
      "cvPlaceholder": "Kliknij, aby wybrać .pdf / .doc / .docx",
      "optional": "opcjonalnie",
      "doneTitle": "Gotowe!",
      "doneSub": "Twój profil jest tworzony. Wyślemy potwierdzenie na {email}."
    },
    "profilesPricing": {
      "previewTitle": "Twój profil na",
      "prevPlan": "Poprzedni plan",
      "nextPlan": "Następny plan",
      "recommended": "REKOMENDOWANE DLA CIEBIE",
      "plans": {
        "base": "Start",
        "pro": "Pro",
        "premium": "Premium"
      },
      "cta": {
        "base": "Wybierz Start",
        "pro": "Wybierz Pro",
        "premium": "Wybierz Premium"
      },
      "demo": {
        "name": "Aleksander Kowalski",
        "role": "Adwokat",
        "location": "Warszawa, Polska"
      },
      "demoPremium": {
        "name": "Alexander König",
        "role": "Adwokat",
        "location": "Warszawa, Polska"
      },
      "avatarAlt": "Adwokat",
      "avatarLabel": "Podgląd awatara AI",
      "avatarTagline": "Twój awatar AI tworzy profesjonalne wideo w Twoim imieniu na stronę i media społecznościowe",
      "monthly": "Miesięcznie",
      "annual": "Rocznie",
      "saveBadge": "−10%",
      "trustTitle": "Stworzone dla polskich prawników",
      "trustEthicsHtml": "Zgodne z <strong>zasadami etyki zawodowej</strong>",
      "trustDataHtml": "<strong>Ochrona danych</strong> · SOC 2",
      "customQuote": "Duża kancelaria? Indywidualna oferta",
      "close": "Zamknij",
      "lead": {
        "title": "Rejestracja zespołu",
        "sub": "Opowiedz o swojej kancelarii — manager skontaktuje się w ciągu 24 godzin z indywidualnym planem.",
        "note": "Ten plan jest dla zespołów od 10 specjalistów. Dla mniejszych — wybierz Start, Pro lub Premium.",
        "firmName": "Nazwa kancelarii",
        "companyName": "Nazwa firmy",
        "teamSize": "Wielkość zespołu",
        "teamSizeHint": "(minimum 10)",
        "teamSizePh": "np. 12",
        "location": "Miasto",
        "email": "Email kontaktowy",
        "phone": "Telefon",
        "message": "Czego potrzebujesz?",
        "messagePh": "Zakres, integracje, white-label, terminy…",
        "submit": "Zamów rozmowę",
        "sending": "Wysyłanie…",
        "foot": "Wysyłając, zgadzasz się, że nasz zespół się z Tobą skontaktuje.",
        "thanksTitle": "Dziękujemy!",
        "thanksSub": "Manager skontaktuje się w ciągu 24 godzin z indywidualnym planem dla Twojego zespołu."
      }
    },
    "payment": {
      "periods": {
        "1_month": "1 miesiąc",
        "1_year": "1 rok"
      },
      "saveBadge": "-10%",
      "savedHero": "WŁAŚNIE ZAOSZCZĘDZIŁEŚ",
      "rows": {
        "plan": "Plan {plan} — {period}",
        "urgency": "Zniżka za pilność (20%)",
        "total": "Razem"
      },
      "paypal": "Zapłać przez PayPal",
      "card": "Zapłać kartą",
      "sending": "Wysyłanie…",
      "faqHeading": "Częste pytania",
      "faq": {
        "clients": {
          "q": "Ilu klientów mogę pozyskiwać miesięcznie?",
          "a": "W zależności od specjalizacji, miasta i optymalizacji profilu — wielu prawników pozyskuje 5–15 klientów już w pierwszym miesiącu, z czasem skalując do 20–30+ dzięki treściom AI i SEO."
        },
        "guarantee": {
          "q": "Czy to gwarantowana liczba klientów?",
          "a": "Dostarczamy Ci leady, z którymi pracujesz samodzielnie. Można też pracować na zasadach wyłączności z klientami platformy — wtedy są to już opłaceni klienci."
        },
        "payment": {
          "q": "Jak działa płatność?",
          "a": "Mamy trzy plany: Start, Pro i Premium. Koszt jest znacznie niższy niż tradycyjne agencje marketingowe. Wielu prawników zwraca subskrypcję już przy 1–2 klientach."
        },
        "noClients": {
          "q": "A jeśli klientów nie będzie?",
          "a": "Dostępność leadów zależy od Twojej aktywności na platformie. Gwarantujemy nieprzerwany dostęp do platformy i jej zasobów. Płatność nie podlega zwrotowi po udzieleniu dostępu."
        },
        "data": {
          "q": "Czy moje dane są bezpieczne?",
          "a": "Tak, używamy bezpiecznego komunikatora, szyfrowania danych i nie przekazujemy informacji stronom trzecim. Platforma spełnia wymogi ochrony danych osobowych (RODO)."
        }
      }
    }
  },
  "pricing": {
    "perMonthShort": "/mies",
    "note": {
      "monthly": "miesięcznie, płatność co miesiąc",
      "annual": "miesięcznie, płatność roczna (−10%)"
    },
    "features": {
      "profile_basic": "Podstawowy poziom profilu osobistego",
      "profile_pro": "Profesjonalny poziom profilu osobistego",
      "video_avatar": "Awatar wideo do promocji Twoich usług",
      "leads_3": "Zakup do 3 leadów/mies",
      "leads_6": "Zakup do 6 leadów/mies",
      "leads_unlim": "Nieograniczony zakup leadów",
      "google": "Promocja Twojego nazwiska i profilu zawodowego w Google",
      "manager_ext": "Osobisty manager z rozszerzonym wsparciem",
      "manager_247": "Osobisty manager 24/7, który zapewni szybki zarobek",
      "exclusive_smm": "Ekskluzywna promocja w mediach społecznościowych",
      "own_services": "Promocja własnych usług",
      "ai_google": "Moduł AI do uruchamiania reklam w Google",
      "ai_meta": "Moduł AI do uruchamiania reklam w Meta",
      "ai_monitoring": "Monitoring AI aktywności i ofert konkurencji",
      "crm": "Wbudowany system do obsługi klientów i zapytań",
      "referral": "Możliwość zarobku przez udostępnienie kodu polecającego kolegom",
      "messenger": "Bezpieczna komunikacja przez dedykowany komunikator w aplikacji z nagrywaniem rozmów i kontrolą pracowników",
      "private_chat": "Zamknięty czat dla specjalistów",
      "rating_boost": "Możliwość podniesienia oceny na podstawie wcześniejszego doświadczenia"
    },
    "badges": {
      "new": "NOWE",
      "more_4x": "4x więcej",
      "more_5x": "5x więcej",
      "more_2_5x": "2.5x więcej",
      "infinity": "∞",
      "upgrade": "UPGRADE"
    }
  }
}

const enGB = {
  "meta": {
    "title": "CONSULTANT — more clients for your practice"
  },
  "common": {
    "next": "Next →",
    "back": "Back",
    "skip": "Skip",
    "selectOneOrMore": "Select one or more",
    "chosen": "selected",
    "discountBanner": "20% OFF — JUST FOR YOU!",
    "timer": {
      "hours": "h",
      "minutes": "min",
      "seconds": "sec"
    },
    "videoSound": {
      "on": "Turn on sound",
      "off": "Turn off sound"
    },
    "videoPause": {
      "pause": "Pause",
      "play": "Play"
    }
  },
  "topbar": {
    "step": "STEP {n} / {total}"
  },
  "validation": {
    "required": "Please fill in this field",
    "emailInvalid": "Invalid email format",
    "phoneInvalid": "Invalid phone number"
  },
  "slides": {
    "greeting": {
      "q": "Welcome to <span class=\"accent\">CONSULTANT</span>",
      "sub": "Watch a short intro and take the quiz. It's 2 minutes, and at the end you'll see your solution."
    },
    "contact": {
      "q": "Let's <span class=\"accent\">get to know you</span>",
      "sub": "So we can send your personal estimate — even if you don't finish the quiz.",
      "fields": {
        "first_name": {
          "label": "First name",
          "ph": "Alexander"
        },
        "last_name": {
          "label": "Last name",
          "ph": "Miller"
        },
        "email": {
          "label": "Email",
          "ph": "alexander@example.com"
        },
        "phone": {
          "label": "Phone",
          "ph": "+1 202 555 0147"
        }
      }
    },
    "search_time": {
      "q": "How much time a week do you spend on <span class=\"accent\">finding new clients?</span>",
      "sub": "Including calls, social media and referrals",
      "opt": {
        "lt_2": "Less than 2 hours",
        "h_2_5": "2–5 hours",
        "h_5_10": "5–10 hours",
        "no_time": "I never have time"
      }
    },
    "growth_blocker": {
      "q": "What's holding you back <span class=\"accent\">from growing?</span>",
      "sub": "Pick what hurts the most",
      "opt": {
        "few_leads": "Too few inquiries",
        "no_deals": "Inquiries come, but don't convert",
        "routine": "Lost in the routine (documents, calls)",
        "no_system": "No system, everything is chaotic"
      }
    },
    "services": {
      "q": "What area of law do you <span class=\"accent\">practice in?</span>",
      "sub": "Select all that apply",
      "opt": {
        "corporate_commercial": "Corporate & Commercial Law",
        "motoring": "Motoring & Road Traffic Law",
        "general": "General Legal Services",
        "criminal": "Criminal Law",
        "notarial": "Notarial Services",
        "banking_finance": "Banking & Financial Law",
        "property": "Property Law",
        "employment": "Employment Law",
        "consular": "Consular & Embassy Services",
        "family_law": "Family Law",
        "business": "Business Law",
        "taxes": "Tax Law",
        "labour_law": "Labour Law",
        "immigration": "Immigration & Nationality Law"
      }
    },
    "desired_clients": {
      "q": "How many clients do you want to get <span class=\"accent\">per month?</span>",
      "sub": "This will determine which plan fits you",
      "opt": {
        "c_to_10": "Up to 10 clients",
        "c_10_30": "10–30 clients",
        "c_30_50": "30–50 clients",
        "c_50_plus": "50+ clients"
      }
    },
    "solution": {
      "q": "Here's your <span class=\"accent\">solution</span>",
      "sub": "Calculated from your answers."
    },
    "pricing": {
      "q": "Here's what will <span class=\"accent\">solve</span> this",
      "sub": ""
    },
    "payment": {
      "q": "Complete your <span class=\"accent\">purchase</span>",
      "sub": ""
    },
    "photoUpload": {
      "q": "Upload <span class=\"accent\">your photo!</span>",
      "sub": "Upload your photo to generate a video avatar for your profile"
    },
    "aiPotential": {
      "q": "Your potential with <span class=\"accent\">CONSULTANT</span>",
      "sub": "AI calculated for your areas and market: how many new clients and income you can get per month — and what it would cost without us."
    },
    "assessment": {
      "q": "Last step — your <span class=\"accent\">profile</span>",
      "sub": "Choose how to fill it in. AI does the rest."
    },
    "fullProfile": {
      "q": "Complete your <span class=\"accent\">profile</span>",
      "sub": "Choose one — write a detailed bio (3,000+ characters) or upload a CV. AI generates the rest."
    }
  },
  "cards": {
    "greeting": {
      "start": "Start →"
    },
    "solution": {
      "gainEyebrow": "With CONSULTANT that's",
      "gainCap": "new clients per month",
      "gainRevenueLabel": "Potential income",
      "proof": {
        "lawyers": "2,500+",
        "lawyersCap": "lawyers already with us",
        "growth": "+183%",
        "growthCap": "avg. income growth",
        "renew": "94%",
        "renewCap": "renew their subscription"
      },
      "cta": "Show plans →"
    },
    "callback": {
      "plaque": "Not ready to pay now? Request a manager call to",
      "noPhone": "enter number",
      "label": "Number to call",
      "submit": "Request a call",
      "sending": "Sending…",
      "done": "✓ Done — a manager will call {phone} during the business day."
    },
    "cta": {
      "recommendedNote": "Your plan: {plan} — {price}/mo",
      "buyNow": "Buy now",
      "buyNowHint": "Straight to checkout for the selected plan",
      "scheduleCall": "Schedule a call",
      "scheduleHint": "A manager will call at a convenient time",
      "calendar": {
        "title": "Pick a convenient time",
        "sub": "We'll call {phone} — the number is already saved.",
        "today": "Today",
        "tomorrow": "Tomorrow",
        "pickDay": "Day",
        "pickTime": "Time",
        "topicLabel": "What to talk about?",
        "topicPh": "Briefly: what exactly you want to solve…",
        "topics": {
          "plan": "Which plan to choose",
          "leads": "How inquiries work",
          "demo": "Show the platform",
          "team": "Terms for a team"
        },
        "submit": "Confirm the call",
        "sending": "Sending…",
        "thanksTitle": "Call scheduled!",
        "thanksSub": "A manager will call {when} at {phone}.",
        "close": "Close",
        "weekdays": [
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat"
        ],
        "months": [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ]
      }
    },
    "photo": {
      "dropHint": "Tap to upload your photo",
      "dropSub": "JPEG or PNG · up to 5 MB · landscape 16:9",
      "error": {
        "badType": "Wrong format — JPEG / PNG only",
        "tooBig": "File too large — 5 MB max"
      },
      "previewAlt": "Photo preview",
      "uploadOwn": "Upload your photo",
      "samplesTitle": "No photo handy? Pick a sample 👇",
      "sampleLabel": "Sample"
    },
    "aiPotential": {
      "heroEyebrow": "With us you earn",
      "clientsLabel": "potential clients per month",
      "revenue": "≈ {low} – {high}",
      "revenueCaption": "income / mo",
      "priceLabel": "all this for a {amount}/mo subscription",
      "compareQ": "To get this flow on your own you'd need <b>a whole team:</b>",
      "teamRoleCost": "{low}–{high}k",
      "teamRoles": {
        "seo": "SEO specialist",
        "targeting": "Ad specialist",
        "content": "Content creator",
        "video": "Video editor",
        "smm": "SMM manager"
      },
      "teamTotalLabel": "Your own team total",
      "teamTotal": "{low}–{high}/mo",
      "usLabel": "CONSULTANT — all in one",
      "ourPlan": "{amount}/mo",
      "punchHtml": "<b>{times}×</b> cheaper — save up to <b>{save}/mo</b>",
      "finePrintLabel": "Calculated for:",
      "finePrintDisclaimer": "Estimate only — actual results depend on the market, profile optimization and your own effort. Not a guarantee of income.",
      "serviceFallback": "General"
    },
    "assessment": {
      "levels": {
        "low": "Low",
        "normal": "Normal",
        "mid": "Moderate",
        "high": "High"
      },
      "yourLevel": "Your level:",
      "calculatedFor": "Calculated for:",
      "factors": "Factors: practice area, desired number of clients, current workload.",
      "disclaimer": "Estimate only — actual results may differ. Not a guarantee of income.",
      "serviceFallback": "General",
      "whyTitle": "Why this matters",
      "whyLead": "From this, AI builds your public CONSULTANT profile — on its own, in a few minutes. Experience, education, certifications and notable cases are extracted automatically.",
      "why": {
        "profile": "A ready profile instead of an empty card",
        "google": "Top of Google for your name",
        "clients": "Clients find you themselves, without ads"
      },
      "warn": "AI has nothing to build your profile from yet. Lawyers with an empty profile rank below peers and get far fewer inquiries.",
      "chooseLabel": "Choose how to fill in the profile",
      "tabCv": "Upload a CV",
      "tabCvNote": "fastest — 10 seconds",
      "tabBio": "Write about yourself",
      "tabBioNote": "at least 3,000 characters",
      "cvPlaceholder": "Tap to choose a file",
      "cvHint": ".pdf / .doc / .docx",
      "bioPh": "Tell us about your experience, education, specialization, notable cases, certifications and awards. Write freely — there's no upper limit.",
      "charLeft": "{n} more characters to the minimum",
      "charEnough": "{n} characters — enough ✓",
      "bioMinHint": "Minimum 3,000 characters. More is better: the more detail, the stronger the profile AI builds.",
      "finish": "Finish →",
      "doneTitle": "Done!",
      "doneSub": "Your profile is being created. We'll send confirmation to {email}."
    },
    "fullProfile": {
      "finish": "Finish →",
      "strengthLabel": "Profile strength",
      "strengthHint": {
        "high": "✓ Strong profile — AI will do great",
        "mid": "Good start — add more detail for better AI quality",
        "low": "Add details below — the more info, the stronger your AI profile"
      },
      "aboutLabel": "About you",
      "aboutHint": "recommended 3000+ characters",
      "aboutPh": "Tell us about your experience, education, achievements, notable cases, certifications, awards…",
      "cvCtaTitle": "📄 Have a CV? Upload it — it boosts profile strength by 30%",
      "cvCtaBody": "Our AI generates your public profile <strong>right from your CV</strong>. Experience, education, certifications, notable cases and achievements are extracted automatically. <em>Optional, but highly recommended.</em>",
      "cvLabel": "Upload a CV",
      "cvHint": "optional · .pdf / .doc / .docx",
      "cvPlaceholder": "Tap to choose .pdf / .doc / .docx",
      "optional": "optional",
      "doneTitle": "Done!",
      "doneSub": "Your profile is being created. We'll send confirmation to {email}."
    },
    "profilesPricing": {
      "previewTitle": "Your profile on",
      "prevPlan": "Previous plan",
      "nextPlan": "Next plan",
      "recommended": "RECOMMENDED FOR YOU",
      "plans": {
        "base": "Start",
        "pro": "Pro",
        "premium": "Premium"
      },
      "cta": {
        "base": "Choose Start",
        "pro": "Choose Pro",
        "premium": "Choose Premium"
      },
      "demo": {
        "name": "Alexander Miller",
        "role": "Attorney",
        "location": "London, UK"
      },
      "demoPremium": {
        "name": "Alexander König",
        "role": "Attorney",
        "location": "London, UK"
      },
      "avatarAlt": "Attorney",
      "avatarLabel": "AI avatar preview",
      "avatarTagline": "Your AI avatar creates professional videos in your name for your website and social media",
      "monthly": "Monthly",
      "annual": "Yearly",
      "saveBadge": "−10%",
      "trustTitle": "Built for UK solicitors",
      "trustEthicsHtml": "Complies with <strong>legal ethics rules</strong>",
      "trustDataHtml": "<strong>Data protection</strong> · SOC 2",
      "customQuote": "Large firm? Custom offer",
      "close": "Close",
      "lead": {
        "title": "Team registration",
        "sub": "Tell us about your firm — a manager will reach out within 24 hours with a custom plan.",
        "note": "This plan is for teams of 10+ specialists. For smaller ones — choose Start, Pro or Premium.",
        "firmName": "Firm name",
        "companyName": "Company name",
        "teamSize": "Team size",
        "teamSizeHint": "(minimum 10)",
        "teamSizePh": "e.g. 12",
        "location": "City",
        "email": "Contact email",
        "phone": "Phone",
        "message": "What do you need?",
        "messagePh": "Volume, integrations, white-label, timeline…",
        "submit": "Request a call",
        "sending": "Sending…",
        "foot": "By submitting, you agree that our team will contact you.",
        "thanksTitle": "Thank you!",
        "thanksSub": "A manager will reach out within 24 hours with a custom plan for your team."
      }
    },
    "payment": {
      "periods": {
        "1_month": "1 month",
        "1_year": "1 year"
      },
      "saveBadge": "-10%",
      "savedHero": "YOU JUST SAVED",
      "rows": {
        "plan": "{plan} plan — {period}",
        "urgency": "Urgency discount (20%)",
        "total": "Total"
      },
      "paypal": "Pay with PayPal",
      "card": "Pay by card",
      "sending": "Sending…",
      "faqHeading": "Frequently asked questions",
      "faq": {
        "clients": {
          "q": "How many clients can I get per month?",
          "a": "Depending on specialization, city and profile optimization — many lawyers get 5–15 clients in the first month, scaling to 20–30+ over time thanks to AI content and SEO."
        },
        "guarantee": {
          "q": "Is that a guaranteed number of clients?",
          "a": "We provide you with leads you work with yourself. You can also work on exclusive terms with platform clients — in that case they're already-paid clients."
        },
        "payment": {
          "q": "How does payment work?",
          "a": "We have three plans: Start, Pro and Premium. The cost is far lower than traditional marketing agencies. Many lawyers cover the subscription with just 1–2 clients."
        },
        "noClients": {
          "q": "What if there are no clients?",
          "a": "Lead availability depends on your activity on the platform. We guarantee uninterrupted access to the platform and its resources. Payment is non-refundable once access is granted."
        },
        "data": {
          "q": "Is my data safe?",
          "a": "Yes, we use a secure messenger, data encryption and don't share information with third parties. The platform complies with data protection requirements (GDPR)."
        }
      }
    }
  },
  "pricing": {
    "perMonthShort": "/mo",
    "note": {
      "monthly": "per month, billed monthly",
      "annual": "per month, billed yearly (−10%)"
    },
    "features": {
      "profile_basic": "Basic personal profile level",
      "profile_pro": "Professional personal profile level",
      "video_avatar": "Video avatar to promote your services",
      "leads_3": "Up to 3 leads/mo",
      "leads_6": "Up to 6 leads/mo",
      "leads_unlim": "Unlimited leads",
      "google": "Promotion of your name and professional profile on Google",
      "manager_ext": "Personal manager with extended support",
      "manager_247": "24/7 personal manager to ensure fast earnings",
      "exclusive_smm": "Exclusive promotion on social media",
      "own_services": "Promotion of your own services",
      "ai_google": "AI module to launch ads on Google",
      "ai_meta": "AI module to launch ads on Meta",
      "ai_monitoring": "AI monitoring of competitors' activity and offers",
      "crm": "Built-in system for clients and inquiries",
      "referral": "Earn by sharing your referral code with colleagues",
      "messenger": "Secure connection via a dedicated in-app messenger with call recording and staff control",
      "private_chat": "Private chat for specialists",
      "rating_boost": "Boost your rating based on prior experience"
    },
    "badges": {
      "new": "NEW",
      "more_4x": "4x more",
      "more_5x": "5x more",
      "more_2_5x": "2.5x more",
      "infinity": "∞",
      "upgrade": "UPGRADE"
    }
  }
}

const enAE = {
  "meta": {
    "title": "CONSULTANT — more clients for your practice"
  },
  "common": {
    "next": "Next →",
    "back": "Back",
    "skip": "Skip",
    "selectOneOrMore": "Select one or more",
    "chosen": "selected",
    "discountBanner": "20% OFF — JUST FOR YOU!",
    "timer": {
      "hours": "h",
      "minutes": "min",
      "seconds": "sec"
    },
    "videoSound": {
      "on": "Turn on sound",
      "off": "Turn off sound"
    },
    "videoPause": {
      "pause": "Pause",
      "play": "Play"
    }
  },
  "topbar": {
    "step": "STEP {n} / {total}"
  },
  "validation": {
    "required": "Please fill in this field",
    "emailInvalid": "Invalid email format",
    "phoneInvalid": "Invalid phone number"
  },
  "slides": {
    "greeting": {
      "q": "Welcome to <span class=\"accent\">CONSULTANT</span>",
      "sub": "Watch a short intro and take the quiz. It's 2 minutes, and at the end you'll see your solution."
    },
    "contact": {
      "q": "Let's <span class=\"accent\">get to know you</span>",
      "sub": "So we can send your personal estimate — even if you don't finish the quiz.",
      "fields": {
        "first_name": {
          "label": "First name",
          "ph": "Alexander"
        },
        "last_name": {
          "label": "Last name",
          "ph": "Miller"
        },
        "email": {
          "label": "Email",
          "ph": "alexander@example.com"
        },
        "phone": {
          "label": "Phone",
          "ph": "+1 202 555 0147"
        }
      }
    },
    "search_time": {
      "q": "How much time a week do you spend on <span class=\"accent\">finding new clients?</span>",
      "sub": "Including calls, social media and referrals",
      "opt": {
        "lt_2": "Less than 2 hours",
        "h_2_5": "2–5 hours",
        "h_5_10": "5–10 hours",
        "no_time": "I never have time"
      }
    },
    "growth_blocker": {
      "q": "What's holding you back <span class=\"accent\">from growing?</span>",
      "sub": "Pick what hurts the most",
      "opt": {
        "few_leads": "Too few inquiries",
        "no_deals": "Inquiries come, but don't convert",
        "routine": "Lost in the routine (documents, calls)",
        "no_system": "No system, everything is chaotic"
      }
    },
    "services": {
      "q": "What area of law do you <span class=\"accent\">practice in?</span>",
      "sub": "Select all that apply",
      "opt": {
        "consular": "Consular & Embassy Services",
        "business": "Business & Corporate Law",
        "motor": "Motor Vehicle Law",
        "general": "General Legal Services",
        "criminal": "Criminal Law",
        "notarial": "Notarial Services",
        "banking_finance": "Banking & Financial Law",
        "real_estate": "Real Estate Law",
        "labour": "Labour & Employment Law",
        "family_law": "Family Law",
        "taxes": "Tax Law",
        "immigration": "Immigration & Residency Law"
      }
    },
    "desired_clients": {
      "q": "How many clients do you want to get <span class=\"accent\">per month?</span>",
      "sub": "This will determine which plan fits you",
      "opt": {
        "c_to_10": "Up to 10 clients",
        "c_10_30": "10–30 clients",
        "c_30_50": "30–50 clients",
        "c_50_plus": "50+ clients"
      }
    },
    "solution": {
      "q": "Here's your <span class=\"accent\">solution</span>",
      "sub": "Calculated from your answers."
    },
    "pricing": {
      "q": "Here's what will <span class=\"accent\">solve</span> this",
      "sub": ""
    },
    "payment": {
      "q": "Complete your <span class=\"accent\">purchase</span>",
      "sub": ""
    },
    "photoUpload": {
      "q": "Upload <span class=\"accent\">your photo!</span>",
      "sub": "Upload your photo to generate a video avatar for your profile"
    },
    "aiPotential": {
      "q": "Your potential with <span class=\"accent\">CONSULTANT</span>",
      "sub": "AI calculated for your areas and market: how many new clients and income you can get per month — and what it would cost without us."
    },
    "assessment": {
      "q": "Last step — your <span class=\"accent\">profile</span>",
      "sub": "Choose how to fill it in. AI does the rest."
    },
    "fullProfile": {
      "q": "Complete your <span class=\"accent\">profile</span>",
      "sub": "Choose one — write a detailed bio (3,000+ characters) or upload a CV. AI generates the rest."
    }
  },
  "cards": {
    "greeting": {
      "start": "Start →"
    },
    "solution": {
      "gainEyebrow": "With CONSULTANT that's",
      "gainCap": "new clients per month",
      "gainRevenueLabel": "Potential income",
      "proof": {
        "lawyers": "2,500+",
        "lawyersCap": "lawyers already with us",
        "growth": "+183%",
        "growthCap": "avg. income growth",
        "renew": "94%",
        "renewCap": "renew their subscription"
      },
      "cta": "Show plans →"
    },
    "callback": {
      "plaque": "Not ready to pay now? Request a manager call to",
      "noPhone": "enter number",
      "label": "Number to call",
      "submit": "Request a call",
      "sending": "Sending…",
      "done": "✓ Done — a manager will call {phone} during the business day."
    },
    "cta": {
      "recommendedNote": "Your plan: {plan} — {price}/mo",
      "buyNow": "Buy now",
      "buyNowHint": "Straight to checkout for the selected plan",
      "scheduleCall": "Schedule a call",
      "scheduleHint": "A manager will call at a convenient time",
      "calendar": {
        "title": "Pick a convenient time",
        "sub": "We'll call {phone} — the number is already saved.",
        "today": "Today",
        "tomorrow": "Tomorrow",
        "pickDay": "Day",
        "pickTime": "Time",
        "topicLabel": "What to talk about?",
        "topicPh": "Briefly: what exactly you want to solve…",
        "topics": {
          "plan": "Which plan to choose",
          "leads": "How inquiries work",
          "demo": "Show the platform",
          "team": "Terms for a team"
        },
        "submit": "Confirm the call",
        "sending": "Sending…",
        "thanksTitle": "Call scheduled!",
        "thanksSub": "A manager will call {when} at {phone}.",
        "close": "Close",
        "weekdays": [
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat"
        ],
        "months": [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ]
      }
    },
    "photo": {
      "dropHint": "Tap to upload your photo",
      "dropSub": "JPEG or PNG · up to 5 MB · landscape 16:9",
      "error": {
        "badType": "Wrong format — JPEG / PNG only",
        "tooBig": "File too large — 5 MB max"
      },
      "previewAlt": "Photo preview",
      "uploadOwn": "Upload your photo",
      "samplesTitle": "No photo handy? Pick a sample 👇",
      "sampleLabel": "Sample"
    },
    "aiPotential": {
      "heroEyebrow": "With us you earn",
      "clientsLabel": "potential clients per month",
      "revenue": "≈ {low} – {high}",
      "revenueCaption": "income / mo",
      "priceLabel": "all this for a {amount}/mo subscription",
      "compareQ": "To get this flow on your own you'd need <b>a whole team:</b>",
      "teamRoleCost": "{low}–{high}k",
      "teamRoles": {
        "seo": "SEO specialist",
        "targeting": "Ad specialist",
        "content": "Content creator",
        "video": "Video editor",
        "smm": "SMM manager"
      },
      "teamTotalLabel": "Your own team total",
      "teamTotal": "{low}–{high}/mo",
      "usLabel": "CONSULTANT — all in one",
      "ourPlan": "{amount}/mo",
      "punchHtml": "<b>{times}×</b> cheaper — save up to <b>{save}/mo</b>",
      "finePrintLabel": "Calculated for:",
      "finePrintDisclaimer": "Estimate only — actual results depend on the market, profile optimization and your own effort. Not a guarantee of income.",
      "serviceFallback": "General"
    },
    "assessment": {
      "levels": {
        "low": "Low",
        "normal": "Normal",
        "mid": "Moderate",
        "high": "High"
      },
      "yourLevel": "Your level:",
      "calculatedFor": "Calculated for:",
      "factors": "Factors: practice area, desired number of clients, current workload.",
      "disclaimer": "Estimate only — actual results may differ. Not a guarantee of income.",
      "serviceFallback": "General",
      "whyTitle": "Why this matters",
      "whyLead": "From this, AI builds your public CONSULTANT profile — on its own, in a few minutes. Experience, education, certifications and notable cases are extracted automatically.",
      "why": {
        "profile": "A ready profile instead of an empty card",
        "google": "Top of Google for your name",
        "clients": "Clients find you themselves, without ads"
      },
      "warn": "AI has nothing to build your profile from yet. Lawyers with an empty profile rank below peers and get far fewer inquiries.",
      "chooseLabel": "Choose how to fill in the profile",
      "tabCv": "Upload a CV",
      "tabCvNote": "fastest — 10 seconds",
      "tabBio": "Write about yourself",
      "tabBioNote": "at least 3,000 characters",
      "cvPlaceholder": "Tap to choose a file",
      "cvHint": ".pdf / .doc / .docx",
      "bioPh": "Tell us about your experience, education, specialization, notable cases, certifications and awards. Write freely — there's no upper limit.",
      "charLeft": "{n} more characters to the minimum",
      "charEnough": "{n} characters — enough ✓",
      "bioMinHint": "Minimum 3,000 characters. More is better: the more detail, the stronger the profile AI builds.",
      "finish": "Finish →",
      "doneTitle": "Done!",
      "doneSub": "Your profile is being created. We'll send confirmation to {email}."
    },
    "fullProfile": {
      "finish": "Finish →",
      "strengthLabel": "Profile strength",
      "strengthHint": {
        "high": "✓ Strong profile — AI will do great",
        "mid": "Good start — add more detail for better AI quality",
        "low": "Add details below — the more info, the stronger your AI profile"
      },
      "aboutLabel": "About you",
      "aboutHint": "recommended 3000+ characters",
      "aboutPh": "Tell us about your experience, education, achievements, notable cases, certifications, awards…",
      "cvCtaTitle": "📄 Have a CV? Upload it — it boosts profile strength by 30%",
      "cvCtaBody": "Our AI generates your public profile <strong>right from your CV</strong>. Experience, education, certifications, notable cases and achievements are extracted automatically. <em>Optional, but highly recommended.</em>",
      "cvLabel": "Upload a CV",
      "cvHint": "optional · .pdf / .doc / .docx",
      "cvPlaceholder": "Tap to choose .pdf / .doc / .docx",
      "optional": "optional",
      "doneTitle": "Done!",
      "doneSub": "Your profile is being created. We'll send confirmation to {email}."
    },
    "profilesPricing": {
      "previewTitle": "Your profile on",
      "prevPlan": "Previous plan",
      "nextPlan": "Next plan",
      "recommended": "RECOMMENDED FOR YOU",
      "plans": {
        "base": "Start",
        "pro": "Pro",
        "premium": "Premium"
      },
      "cta": {
        "base": "Choose Start",
        "pro": "Choose Pro",
        "premium": "Choose Premium"
      },
      "demo": {
        "name": "Ahmed Al Mansoori",
        "role": "Legal Consultant",
        "location": "Dubai, UAE"
      },
      "demoPremium": {
        "name": "Alexander König",
        "role": "Attorney",
        "location": "Dubai, UAE"
      },
      "avatarAlt": "Attorney",
      "avatarLabel": "AI avatar preview",
      "avatarTagline": "Your AI avatar creates professional videos in your name for your website and social media",
      "monthly": "Monthly",
      "annual": "Yearly",
      "saveBadge": "−10%",
      "trustTitle": "Built for UAE lawyers",
      "trustEthicsHtml": "Complies with <strong>legal ethics rules</strong>",
      "trustDataHtml": "<strong>Data protection</strong> · SOC 2",
      "customQuote": "Large firm? Custom offer",
      "close": "Close",
      "lead": {
        "title": "Team registration",
        "sub": "Tell us about your firm — a manager will reach out within 24 hours with a custom plan.",
        "note": "This plan is for teams of 10+ specialists. For smaller ones — choose Start, Pro or Premium.",
        "firmName": "Firm name",
        "companyName": "Company name",
        "teamSize": "Team size",
        "teamSizeHint": "(minimum 10)",
        "teamSizePh": "e.g. 12",
        "location": "City",
        "email": "Contact email",
        "phone": "Phone",
        "message": "What do you need?",
        "messagePh": "Volume, integrations, white-label, timeline…",
        "submit": "Request a call",
        "sending": "Sending…",
        "foot": "By submitting, you agree that our team will contact you.",
        "thanksTitle": "Thank you!",
        "thanksSub": "A manager will reach out within 24 hours with a custom plan for your team."
      }
    },
    "payment": {
      "periods": {
        "1_month": "1 month",
        "1_year": "1 year"
      },
      "saveBadge": "-10%",
      "savedHero": "YOU JUST SAVED",
      "rows": {
        "plan": "{plan} plan — {period}",
        "urgency": "Urgency discount (20%)",
        "total": "Total"
      },
      "paypal": "Pay with PayPal",
      "card": "Pay by card",
      "sending": "Sending…",
      "faqHeading": "Frequently asked questions",
      "faq": {
        "clients": {
          "q": "How many clients can I get per month?",
          "a": "Depending on specialization, city and profile optimization — many lawyers get 5–15 clients in the first month, scaling to 20–30+ over time thanks to AI content and SEO."
        },
        "guarantee": {
          "q": "Is that a guaranteed number of clients?",
          "a": "We provide you with leads you work with yourself. You can also work on exclusive terms with platform clients — in that case they're already-paid clients."
        },
        "payment": {
          "q": "How does payment work?",
          "a": "We have three plans: Start, Pro and Premium. The cost is far lower than traditional marketing agencies. Many lawyers cover the subscription with just 1–2 clients."
        },
        "noClients": {
          "q": "What if there are no clients?",
          "a": "Lead availability depends on your activity on the platform. We guarantee uninterrupted access to the platform and its resources. Payment is non-refundable once access is granted."
        },
        "data": {
          "q": "Is my data safe?",
          "a": "Yes, we use a secure messenger, data encryption and don't share information with third parties. The platform complies with data protection requirements (GDPR)."
        }
      }
    }
  },
  "pricing": {
    "perMonthShort": "/mo",
    "note": {
      "monthly": "per month, billed monthly",
      "annual": "per month, billed yearly (−10%)"
    },
    "features": {
      "profile_basic": "Basic personal profile level",
      "profile_pro": "Professional personal profile level",
      "video_avatar": "Video avatar to promote your services",
      "leads_3": "Up to 3 leads/mo",
      "leads_6": "Up to 6 leads/mo",
      "leads_unlim": "Unlimited leads",
      "google": "Promotion of your name and professional profile on Google",
      "manager_ext": "Personal manager with extended support",
      "manager_247": "24/7 personal manager to ensure fast earnings",
      "exclusive_smm": "Exclusive promotion on social media",
      "own_services": "Promotion of your own services",
      "ai_google": "AI module to launch ads on Google",
      "ai_meta": "AI module to launch ads on Meta",
      "ai_monitoring": "AI monitoring of competitors' activity and offers",
      "crm": "Built-in system for clients and inquiries",
      "referral": "Earn by sharing your referral code with colleagues",
      "messenger": "Secure connection via a dedicated in-app messenger with call recording and staff control",
      "private_chat": "Private chat for specialists",
      "rating_boost": "Boost your rating based on prior experience"
    },
    "badges": {
      "new": "NEW",
      "more_4x": "4x more",
      "more_5x": "5x more",
      "more_2_5x": "2.5x more",
      "infinity": "∞",
      "upgrade": "UPGRADE"
    }
  }
}

export const MESSAGES = { uk, ru, en, pl, 'en-GB': enGB, 'en-AE': enAE }
export const SUPPORTED_LOCALES = ['uk', 'ru', 'en', 'en-GB', 'en-AE', 'pl']
export const DEFAULT_LOCALE = 'uk'
export const BCP47 = { uk: 'uk-UA', ru: 'ru-UA', en: 'en-US', 'en-GB': 'en-GB', 'en-AE': 'en-AE', pl: 'pl-PL' }

function normalizeLocale (raw) {
  if (!raw) return null
  const s = String(raw).trim().toLowerCase().replace('_', '-')
  // Точний збіг (uk, en-gb, en-ae…) з урахуванням регістру списку.
  const exact = SUPPORTED_LOCALES.find((l) => l.toLowerCase() === s)
  if (exact) return exact
  const [lang, region] = s.split('-')
  if (lang === 'en') {
    if (region === 'gb' || region === 'uk') return 'en-GB'
    if (region === 'ae') return 'en-AE'
    return 'en'
  }
  const byLang = SUPPORTED_LOCALES.find((l) => l.split('-')[0] === lang)
  return byLang || null
}

// Порядок вибору локалі: window.QUIZ_LANG → ?lang= → localStorage → браузер → дефолт.
export function resolveLocale () {
  const fromBackend = normalizeLocale(window.QUIZ_LANG)
  if (fromBackend) return fromBackend
  try {
    const fromUrl = normalizeLocale(new URLSearchParams(window.location.search).get('lang'))
    if (fromUrl) return fromUrl
    const fromSaved = normalizeLocale(window.localStorage.getItem('clm_quiz2_lang'))
    if (fromSaved) return fromSaved
  } catch (e) { /* URL/localStorage недоступні */ }
  return normalizeLocale(navigator.language) || DEFAULT_LOCALE
}

export const state = { locale: resolveLocale() }

function lookup (path, locale) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), MESSAGES[locale])
}

// t('slides.contact.q', { n: 1 }) — з відкатом на uk, якщо ключа немає в ru.
export function t (path, params) {
  let value = lookup(path, state.locale)
  if (value == null && state.locale !== DEFAULT_LOCALE) value = lookup(path, DEFAULT_LOCALE)
  if (value == null) return path
  if (typeof value !== 'string' || !params) return value
  return value.replace(/\{(\w+)\}/g, (match, key) => (params[key] != null ? params[key] : match))
}

export function setLocale (locale) {
  state.locale = normalizeLocale(locale) || DEFAULT_LOCALE
  try { window.localStorage.setItem('clm_quiz2_lang', state.locale) } catch (e) { /* ignore */ }
  applyDocumentLocale()
}

export function applyDocumentLocale () {
  document.documentElement.setAttribute('lang', BCP47[state.locale] || 'uk-UA')
  document.title = t('meta.title')
}
