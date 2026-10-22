/* Жовта картка «Замовити ліди» першою в списку + майстер замовлення лідів (7 кроків).
   EN — анкета для імміграційних юристів Техасу, UA — та сама структура під українську практику.
   Стан заявки — localStorage promo_lead_request_v1 (скидається разом із демо-станом). */
(function () {
  var EN = document.documentElement.lang === 'en';
  var KEY = 'promo_lead_request_v1';
  var EMAIL = 'o.kovalchuk@consultant.net.ua';
  var SPRITE = 'assets/cabinet/img/sprite/sprite.svg';
  var OFFER = 'https://consultant.net.ua/legal/consultant-agreement';
  var POLICY = 'https://consultant.net.ua/legal/lead-purchase-and-use-policy';

  var L = EN ? {
    round: 5,
    firm: 'Kovalchuk Immigration Law, PLLC', phone: '+1 (713) 555-0148',
    cardTitle: 'Can’t find the leads you need?', pill: 'Custom order',
    desc: 'If none of the current leads fit, order them for your practice: case types, area, client budget and your price per lead. First leads within 2 days, a steady flow in 2–3 weeks. You’ll be notified by email.',
    chips: ['First leads in 2 days', 'Your price per lead', 'Email notification'],
    btn: 'Order leads', disclaimer: 'Submitting the order charges nothing — you pay only for leads you receive.',
    doneTitle: 'Leads order submitted', pillDone: 'Under review',
    doneDesc: 'We’ll review the order within 2 days. First leads will appear in this list, and the flow becomes steady in 2–3 weeks once the ad campaigns warm up. Notifications go to ' + EMAIL + '.',
    btnEdit: 'View or edit the order', cancelOrder: 'Cancel the order', cancelled: 'The order has been cancelled.',
    cCases: 'Case types: ', cLeads: ' leads/mo', cSum: '/mo',

    mTitle: 'Order leads for your practice', mTitleEdit: 'Your leads order',
    steps: ['About you', 'Case types', 'Area', 'Qualification', 'Volume & price', 'Delivery & payment', 'Review'],
    stepOf: 'Step {n} of {t}', back: 'Back', next: 'Continue', cancel: 'Cancel', submit: 'Submit for review', save: 'Save changes',
    tlTitle: 'How it works',
    tl: [['Within 2 days', 'We review your order and send the first matching leads from our existing pool.'],
         ['First week', 'We launch and warm up Google and Meta campaigns. The algorithms are learning, so leads come in unevenly.'],
         ['In 2–3 weeks', 'SEO kicks in: pages for your case types get indexed by Google, and the lead flow becomes steady.']],
    s1lead: 'Your profile details are already filled in — check them and add what’s missing.',
    fName: 'Full name', fFirm: 'Law firm name', fBar: 'State Bar of Texas number', fBarOpt: '',
    fBarHint: 'We verify every license before campaigns go live.', fEmail: 'Email', fPhone: 'Phone',
    fSite: 'Website', fOffice: 'Office address(es)', fOfficePh: 'For example: 1200 Main St, Houston, TX',
    fLangs: 'Languages spoken by you or your staff', fIntake: 'Who handles intake calls?',
    intake: ['Me personally', 'A paralegal', 'A call center'],
    langs: ['English', 'Spanish', 'Vietnamese', 'Hindi', 'Chinese', 'Arabic', 'Ukrainian', 'Russian'],
    s2title: 'Which case types do you want leads for?',
    s2lead: 'The lead price follows the case value: the higher the typical fee for a case type, the more a lead costs.',
    perLead: '/ lead', fNot: 'Case types you do NOT accept', fNotPh: 'For example: appeals, cases without documents',
    cases: [['Family-based green cards / marriage petitions', 60, 110], ['Naturalization / citizenship', 30, 60],
            ['Removal defense / deportation', 120, 220], ['Detention / bond hearings', 150, 260], ['Asylum', 70, 130],
            ['DACA', 35, 70], ['U-visa / T-visa / VAWA', 70, 130], ['Employment visas (H-1B, L-1, O-1, PERM)', 120, 220],
            ['Investor visas (EB-5, E-2)', 250, 450], ['Crimmigration (criminal + immigration)', 140, 240]],
    fAreas: 'Which Texas cities or counties do you serve?',
    areas: ['All of Texas', 'Houston', 'Dallas–Fort Worth', 'San Antonio', 'Austin', 'El Paso', 'Rio Grande Valley'],
    fOther: 'Another city or county', fOtherPh: 'Type a city or county',
    fRemote: 'Do you accept remote clients from other states?',
    remoteHint: 'Immigration law is federal, so many lawyers take clients from anywhere in the US — it widens the flow and lowers the lead price.',
    yes: 'Yes', no: 'No', fFormat: 'Consultations',
    formats: [['both', 'In person and virtual'], ['office', 'In person only'], ['online', 'Virtual only']],
    fBudget: 'Minimum client budget — can the client afford your fees?',
    budgetHint: 'A higher threshold means pricier leads and fewer of them.',
    budgets: [['No minimum', 1], ['$1,000+', 1.1], ['$3,000+', 1.25], ['$5,000+', 1.4], ['$10,000+', 1.6]],
    fConsult: 'Do you charge for consultations?', consults: [['free', 'Free'], ['paid', 'Paid']], fFee: 'Consultation fee',
    fDet: 'Accept clients currently in detention?', fCrim: 'Accept clients with criminal records?',
    fUrg: 'Urgency', urgs: [['all', 'All cases'], ['urgent', 'Only urgent (court date soon)']],
    fLeadLang: 'Required lead language', anyLang: 'Any',
    s5lead: 'Set how many leads you want and what you’re ready to pay. Five expensive leads or fifty cheap ones — it’s your call.',
    fPeriod: 'Quantity', periods: [['month', 'per month'], ['week', 'per week']],
    fExcl: 'Exclusivity', excls: [['shared', 'Shared — 2–3 lawyers'], ['exclusive', 'Exclusive — only you']],
    exclHint: 'An exclusive lead goes to you alone, so it costs more.',
    colCase: 'Case type', colPrice: 'Your price per lead', colQty: 'Leads', est: 'Estimate: ',
    useEst: 'Use the estimated prices',
    stLow: 'Below the estimate — such leads will come in slower', stOk: 'Within the market range', stHigh: 'Above the market — priority in lead distribution',
    fxTitle: 'What shaped the price', fxNone: 'Base prices, no surcharges',
    fx: { excl: 'Exclusive leads', urg: 'Only urgent cases', budget: 'Client budget ', remote: 'Clients from other states', office: 'In person only', det: 'No clients in detention', crim: 'No clients with records' },
    total: 'Total per month', leadsW: 'leads', fCap: 'Maximum monthly budget',
    capHint: 'The amount you spend on leads — not a Google or Meta ad budget.',
    capWarn: 'The order of {t} exceeds your monthly budget of {c}. Lower the quantity or price, or raise the budget.',
    estNote: 'The estimate is not a guarantee: we confirm the final price after reviewing the order. In the first 1–2 weeks, while campaigns warm up, you may get fewer leads than ordered.',
    fCh: 'Where should we send leads?', chHint: 'Leads always appear in your cabinet; these channels duplicate the notification.',
    channels: ['Email', 'SMS', 'CRM', 'Webhook / API'],
    fCrm: 'Which CRM do you use?', crms: ['Clio', 'MyCase', 'Lawmatics', 'Docketwise', 'Other'],
    fHook: 'Webhook URL', fHours: 'Business hours for receiving leads', fWeek: 'Weekends', weeks: [['no', 'Not on weekends'], ['yes', 'Weekends too']],
    fResp: 'How fast will you call a new lead?', resps: ['Within 15 minutes', 'Within 1 hour', 'Same day', 'Next business day'],
    respHint: 'Clients often contact several lawyers at once and usually pick the one who calls first.',
    fPay: 'Payment method', pays: [['balance', 'Prepaid balance'], ['card', 'Card on file'], ['invoice', 'Invoice']],
    payHint: 'A fixed price per lead — never a percentage of your fees.',
    retTitle: 'Lead returns', retText: 'You can return a lead within 7 days if:',
    retList: ['the number is wrong or inactive', 'it duplicates a lead you already got', 'the client is outside your service area', 'it’s the wrong case type'],
    retNote: '“The client didn’t retain me” is not a reason for a return.',
    fFeedback: 'I agree to mark each lead’s status (contacted / consulted / retained) — it helps improve lead quality.',
    s7lead: 'Check the order before submitting. Any block can be edited.', edit: 'Edit',
    tos: 'I agree to the <a href="' + OFFER + '" target="_blank" rel="noopener noreferrer">Public Offer</a> and the <a href="' + POLICY + '" target="_blank" rel="noopener noreferrer">Lead Purchase Policy</a>',
    consent: 'I consent to receive leads by phone, SMS and email',
    payNote: 'Submitting charges nothing. You pay only for leads you receive, at the agreed price.',
    okTitle: 'Order submitted for review', okId: 'Order', okStatus: 'under review',
    okText: 'We’ll check the parameters and price and email you at ', okNext: 'What happens next', okClose: 'Got it',
    rvFirm: 'Firm', rvBar: 'Bar number', rvContacts: 'Contacts', rvLangs: 'Languages', rvIntake: 'Intake',
    rvCases: 'Accepts', rvNot: 'Does not accept', rvAreas: 'Area', rvRemote: 'Other states',
    rvFormat: 'Consultations', rvBudget: 'Client budget', rvConsult: 'Consultation', rvDet: 'In detention',
    rvCrim: 'With records', rvUrg: 'Urgency', rvLeadLang: 'Lead language', rvExcl: 'Exclusivity', rvCap: 'Monthly budget',
    rvCh: 'Channels', rvHours: 'Hours', rvResp: 'Response', rvPay: 'Payment', rvFeedback: 'Status feedback', none: '—',
    estPer: 'Estimate: {r} per lead', estNone: 'Pick case types to see the estimated price', estTotal: '{n} leads/mo · {t}',
    errName: 'Enter your name.', errEmail: 'Enter a valid email.', errPhone: 'Enter a phone number.',
    errBar: 'Enter your State Bar of Texas number.', errIntake: 'Choose who handles intake calls.',
    errCases: 'Choose at least one case type.', errAreas: 'Choose a city or type your own.',
    errFee: 'Enter the consultation fee.', errRows: 'Enter a price and quantity for every case type.',
    errCrm: 'Choose your CRM.', errHook: 'Enter the webhook URL (https://…).', errHours: 'The end time must be later than the start.',
    errTos: 'Confirm the terms and the consent to receive leads.'
  } : {
    round: 10,
    firm: 'АО «Ковальчук і партнери»', phone: '+380 67 123 45 67',
    cardTitle: 'Не знайшли потрібних лідів?', pill: 'Індивідуальне замовлення',
    desc: 'Якщо серед поточних лідів немає потрібних — замовте їх під свою практику: справи, місто, бюджет клієнта, ціна за лід. Перші ліди — протягом 2 днів, стабільний потік — через 2–3 тижні. Сповіщення прийде на пошту.',
    chips: ['Перші ліди до 2 днів', 'Ваша ціна за лід', 'Сповіщення на пошту'],
    btn: 'Замовити ліди', disclaimer: 'Заявка нічого не списує з балансу — оплата лише за отримані ліди.',
    doneTitle: 'Заявку на ліди надіслано', pillDone: 'На перевірці',
    doneDesc: 'Перевіримо заявку протягом 2 днів. Перші ліди з’являться в цьому списку, стабільний потік — через 2–3 тижні, коли прогріються рекламні кампанії. Сповіщення прийде на ' + EMAIL + '.',
    btnEdit: 'Переглянути або змінити', cancelOrder: 'Скасувати заявку', cancelled: 'Заявку скасовано.',
    cCases: 'Справ: ', cLeads: ' лідів/міс', cSum: '/міс',

    mTitle: 'Замовлення лідів для вашої практики', mTitleEdit: 'Ваша заявка на ліди',
    steps: ['Про вас', 'Справи', 'Географія', 'Кваліфікація', 'Обсяг і ціна', 'Доставка й оплата', 'Перевірка'],
    stepOf: 'Крок {n} з {t}', back: 'Назад', next: 'Далі', cancel: 'Скасувати', submit: 'Надіслати на перевірку', save: 'Зберегти зміни',
    tlTitle: 'Як це працює',
    tl: [['До 2 днів', 'Перевіряємо заявку й надсилаємо перші ліди з наявної бази, якщо вони відповідають вашим параметрам.'],
         ['Перший тиждень', 'Запускаємо й прогріваємо рекламні кампанії в Google і Meta. Алгоритми навчаються — ліди надходять нерівномірно.'],
         ['Через 2–3 тижні', 'Підключається SEO: сторінки під ваші справи індексуються в Google. Потік лідів виходить на стабільний рівень.']],
    s1lead: 'Дані з вашого профілю вже підставлені — перевірте їх і додайте те, чого бракує.',
    fName: 'Імʼя та прізвище', fFirm: 'Назва фірми або адвокатського обʼєднання', fBar: 'Номер свідоцтва адвоката',
    fBarOpt: 'якщо ви адвокат', fBarHint: 'Свідоцтво перевіряємо в ЄРАУ перед запуском кампаній.', fEmail: 'Email', fPhone: 'Телефон',
    fSite: 'Сайт', fOffice: 'Адреса офісу (одна або кілька)', fOfficePh: 'Наприклад: Київ, вул. Хрещатик, 1',
    fLangs: 'Мови, якими володієте ви або ваша команда', fIntake: 'Хто приймає дзвінки клієнтів?',
    intake: ['Я особисто', 'Помічник', 'Кол-центр'],
    langs: ['Українська', 'Англійська', 'Польська', 'Німецька', 'Російська'],
    s2title: 'Які справи ви хочете отримувати?',
    s2lead: 'Ціна ліда залежить від цінності справи: чим вищий гонорар за таку справу, тим дорожчий лід.',
    perLead: '/ лід', fNot: 'Справи, які ви НЕ приймаєте', fNotPh: 'Наприклад: апеляції, справи без документів',
    cases: [['Військове право (ТЦК, ВЛК, відстрочка)', 250, 450], ['Сімейне право (розлучення, аліменти)', 200, 400],
            ['Кримінальний захист', 400, 800], ['Нерухомість і земля', 300, 600], ['Спадщина', 250, 500],
            ['ДТП і страхові виплати', 300, 600], ['Трудові спори', 150, 300], ['Податкові спори', 450, 900],
            ['Бізнес і корпоративне право', 500, 1000], ['Банкрутство', 600, 1200], ['Міграція (ВНЖ, громадянство)', 300, 600],
            ['Інтелектуальна власність', 400, 800]],
    fAreas: 'Де ви обслуговуєте клієнтів?',
    areas: ['Вся Україна', 'Київ', 'Львів', 'Харків', 'Дніпро', 'Одеса', 'Запоріжжя', 'Вінниця'],
    fOther: 'Інше місто або область', fOtherPh: 'Введіть назву',
    fRemote: 'Приймаєте клієнтів з інших областей онлайн?',
    remoteHint: 'Більшість справ можна вести дистанційно — це розширює потік лідів і знижує ціну.',
    yes: 'Так', no: 'Ні', fFormat: 'Формат консультацій',
    formats: [['both', 'Офіс і онлайн'], ['office', 'Лише в офісі'], ['online', 'Лише онлайн']],
    fBudget: 'Мінімальний бюджет клієнта — чи може він оплатити ваші послуги?',
    budgetHint: 'Чим вищий поріг, тим дорожчий лід і тим менше таких клієнтів.',
    budgets: [['Без мінімуму', 1], ['від 5 000 ₴', 1.1], ['від 15 000 ₴', 1.25], ['від 30 000 ₴', 1.4], ['від 60 000 ₴', 1.6]],
    fConsult: 'Ви берете оплату за консультацію?', consults: [['free', 'Безкоштовно'], ['paid', 'Платно']], fFee: 'Вартість консультації',
    fDet: 'Приймаєте клієнтів під вартою (СІЗО)?', fCrim: 'Приймаєте клієнтів із судимістю?',
    fUrg: 'Терміновість', urgs: [['all', 'Усі справи'], ['urgent', 'Лише термінові (засідання найближчим часом)']],
    fLeadLang: 'Мова спілкування з клієнтом', anyLang: 'Будь-яка',
    s5lead: 'Вкажіть, скільки лідів і за якою ціною ви готові купувати. Пʼять дорогих лідів чи пʼятдесят недорогих — вирішуєте ви.',
    fPeriod: 'Кількість', periods: [['month', 'на місяць'], ['week', 'на тиждень']],
    fExcl: 'Ексклюзивність', excls: [['shared', 'Спільні — 2–3 юристи'], ['exclusive', 'Ексклюзивні — лише ви']],
    exclHint: 'Ексклюзивний лід отримуєте тільки ви, тому він дорожчий.',
    colCase: 'Справа', colPrice: 'Ваша ціна за лід', colQty: 'Лідів', est: 'Орієнтовно: ',
    useEst: 'Підставити орієнтовні ціни',
    stLow: 'Нижче орієнтовної — такі ліди надходитимуть повільніше', stOk: 'У межах ринку', stHigh: 'Вище ринку — пріоритет у розподілі лідів',
    fxTitle: 'Що вплинуло на ціну', fxNone: 'Базові ціни — без надбавок',
    fx: { excl: 'Ексклюзивні ліди', urg: 'Лише термінові справи', budget: 'Бюджет клієнта ', remote: 'Клієнти з інших областей', office: 'Лише офіс', det: 'Без клієнтів під вартою', crim: 'Без клієнтів із судимістю' },
    total: 'Разом на місяць', leadsW: 'лідів', fCap: 'Максимальний бюджет на місяць',
    capHint: 'Сума закупівлі лідів, а не рекламний бюджет Google чи Meta.',
    capWarn: 'Замовлення на {t} перевищує ваш місячний бюджет {c}. Зменшіть кількість чи ціну або збільште бюджет.',
    estNote: 'Орієнтовна вартість — не гарантія: остаточну ціну підтвердимо після перевірки заявки. У перші 1–2 тижні, поки прогріваються кампанії, лідів може бути менше, ніж замовлено.',
    fCh: 'Куди надсилати ліди?', chHint: 'Ліди завжди зʼявляються в кабінеті, а ці канали дублюють сповіщення.',
    channels: ['Email', 'SMS', 'Telegram', 'CRM', 'Webhook / API'],
    fCrm: 'Яку CRM ви використовуєте?', crms: ['Bitrix24', 'KeyCRM', 'Kommo', 'HubSpot', 'Інша'],
    fHook: 'URL вебхука', fHours: 'Години прийому лідів', fWeek: 'Вихідні', weeks: [['no', 'Не приймаю'], ['yes', 'Приймаю']],
    fResp: 'За скільки ви зателефонуєте новому ліду?', resps: ['До 15 хвилин', 'До 1 години', 'Того ж дня', 'Наступного робочого дня'],
    respHint: 'Клієнт часто звертається до кількох юристів одночасно й зазвичай обирає того, хто зателефонував першим.',
    fPay: 'Спосіб оплати', pays: [['balance', 'Передплачений баланс'], ['card', 'Привʼязана картка'], ['invoice', 'Рахунок']],
    payHint: 'Фіксована ціна за лід — жодних відсотків від вашого гонорару.',
    retTitle: 'Повернення лідів', retText: 'Лід можна повернути протягом 7 днів, якщо:',
    retList: ['номер неправильний або неактивний', 'це дублікат уже отриманого ліда', 'клієнт поза вашою зоною обслуговування', 'не той тип справи'],
    retNote: '«Клієнт не уклав договір» — не підстава для повернення.',
    fFeedback: 'Я позначатиму статус кожного ліда (звʼязався / провів консультацію / уклав договір) — це допомагає покращувати якість лідів.',
    s7lead: 'Перевірте заявку перед відправкою. Будь-який блок можна змінити.', edit: 'Змінити',
    tos: 'Я погоджуюся з <a href="' + OFFER + '" target="_blank" rel="noopener noreferrer">Публічною офертою</a> та <a href="' + POLICY + '" target="_blank" rel="noopener noreferrer">Політикою придбання лідів</a>',
    consent: 'Погоджуюся отримувати ліди телефоном, SMS та email',
    payNote: 'Відправка заявки нічого не списує. Оплата — лише за отримані ліди за погодженою ціною.',
    okTitle: 'Заявку надіслано на перевірку', okId: 'Заявка', okStatus: 'на перевірці',
    okText: 'Ми перевіримо параметри й ціну та напишемо на ', okNext: 'Що далі', okClose: 'Зрозуміло',
    rvFirm: 'Фірма', rvBar: 'Свідоцтво', rvContacts: 'Контакти', rvLangs: 'Мови', rvIntake: 'Дзвінки приймає',
    rvCases: 'Приймаю', rvNot: 'Не приймаю', rvAreas: 'Географія', rvRemote: 'Інші області',
    rvFormat: 'Консультації', rvBudget: 'Бюджет клієнта', rvConsult: 'Консультація', rvDet: 'Під вартою',
    rvCrim: 'Із судимістю', rvUrg: 'Терміновість', rvLeadLang: 'Мова ліда', rvExcl: 'Ексклюзивність', rvCap: 'Бюджет на місяць',
    rvCh: 'Канали', rvHours: 'Години', rvResp: 'Реакція', rvPay: 'Оплата', rvFeedback: 'Статуси лідів', none: '—',
    estPer: 'Орієнтовно {r} за лід', estNone: 'Оберіть справи, щоб побачити орієнтовну ціну', estTotal: '{n} лідів/міс · {t}',
    errName: 'Вкажіть імʼя.', errEmail: 'Вкажіть коректний email.', errPhone: 'Вкажіть телефон.',
    errBar: '', errIntake: 'Оберіть, хто приймає дзвінки.',
    errCases: 'Оберіть хоча б один тип справ.', errAreas: 'Оберіть місто або вкажіть своє.',
    errFee: 'Вкажіть вартість консультації.', errRows: 'Вкажіть ціну й кількість для кожного типу справ.',
    errCrm: 'Оберіть CRM.', errHook: 'Вкажіть URL вебхука (https://…).', errHours: 'Час завершення має бути пізніше за початок.',
    errTos: 'Підтвердьте згоду з умовами та на отримання лідів.'
  };

  // ---------- стан ----------
  function personName() {
    var n = document.querySelector('.user-about__name');
    return n ? n.textContent.trim() : '';
  }
  function blank() {
    return {
      name: personName(), firm: L.firm, bar: '', email: EMAIL, phone: L.phone, site: '', office: '', langs: [0], intake: '',
      cases: [], notCases: '',
      areas: [], other: '', remote: 'yes', format: 'both',
      budget: '0', consult: 'free', fee: '', det: 'yes', crim: 'yes', urg: 'all', leadLangs: [0],
      period: 'month', excl: 'shared', rows: {}, cap: '',
      channels: [0], crm: '', hook: '', hFrom: '09:00', hTo: '18:00', weekends: 'no', resp: '1', pay: 'balance', feedback: true,
      tos: false, consent: false
    };
  }
  function copy(o) { return JSON.parse(JSON.stringify(o)); }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY) || 'null'); return s && s.id && s.rows ? s : null; } catch (e) { return null; }
  }
  function save(s) { try { if (s) localStorage.setItem(KEY, JSON.stringify(s)); else localStorage.removeItem(KEY); } catch (e) {} }
  var order = load();          // надіслана заявка або null
  var draft = null;            // стан майстра
  var step = 0, seen = 0, doneView = false;

  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function num(v) { return String(v).replace(/[^\d]/g, ''); }
  function money(n) {
    n = Math.round(n);
    return EN ? '$' + n.toLocaleString('en-US') : n.toLocaleString('uk-UA').replace(/[  ]/g, ' ') + ' ₴';
  }
  function range(a, b) {
    var f = function (n) { return Math.round(n).toLocaleString(EN ? 'en-US' : 'uk-UA').replace(/[\u202f\u00a0]/g, ' '); };
    return EN ? '$' + f(a) + '–' + f(b) : f(a) + '–' + f(b) + ' ₴';
  }
  function pick(list, v) { for (var i = 0; i < list.length; i++) if (list[i][0] === v) return list[i][1]; return ''; }
  function fill(t, o) { return t.replace(/\{(\w+)\}/g, function (_, k) { return o[k]; }); }

  // ---------- калькулятор: чим цінніший клієнт, тим дорожчий лід ----------
  function factors(d) {
    var f = [];
    if (d.excl === 'exclusive') f.push([L.fx.excl, 1.8]);
    if (d.urg === 'urgent') f.push([L.fx.urg, 1.25]);
    var b = L.budgets[+d.budget];
    if (b && b[1] > 1) f.push([L.fx.budget + b[0], b[1]]);
    if (d.remote === 'yes') f.push([L.fx.remote, 0.9]);
    if (d.format === 'office') f.push([L.fx.office, 1.1]);
    if (d.det === 'no') f.push([L.fx.det, 1.05]);
    if (d.crim === 'no') f.push([L.fx.crim, 1.05]);
    return f;
  }
  function mult(d) { return factors(d).reduce(function (m, x) { return m * x[1]; }, 1); }
  function rnd(v) { return Math.max(L.round, Math.round(v / L.round) * L.round); }
  function estFor(d, i) { var m = mult(d), c = L.cases[i]; return [rnd(c[1] * m), rnd(c[2] * m)]; }
  function monthly(d, q) { q = parseInt(q, 10) || 0; return d.period === 'week' ? Math.round(q * 4.33) : q; }
  function totals(d) {
    var n = 0, t = 0;
    d.cases.forEach(function (i) {
      var r = d.rows[i] || {}, q = monthly(d, r.qty), p = parseInt(r.price, 10) || 0;
      n += q; t += q * p;
    });
    return { n: n, t: t };
  }
  function pct(m) { var p = Math.round((m - 1) * 100); return (p > 0 ? '+' : '−') + Math.abs(p) + '%'; }

  // ---------- картка ----------
  function cardHtml() {
    var done = !!order;
    var chips = L.chips;
    if (done) {
      var tt = totals(order);
      chips = [L.cCases + order.cases.length, tt.n + L.cLeads, money(tt.t) + L.cSum];
    }
    return '<div class="main-order main-order--lead-new main-order--request" data-rq-card>' +
      '<div class="main-order__top">' +
        '<span class="main-order__title">' + esc(done ? L.doneTitle : L.cardTitle) + '</span>' +
        '<div class="main-order__inner"><span class="main-order__service main-order__service--request">' +
          esc(done ? L.pillDone + ' · ' + order.id : L.pill) + '</span></div>' +
      '</div>' +
      '<div class="main-order__middle"><p class="main-order__description">' + esc(done ? L.doneDesc : L.desc) + '</p></div>' +
      '<div class="main-order__bottom">' +
        '<div class="main-order__chips">' + chips.map(function (c) {
          return '<span class="main-order__chip"><span class="main-order__chip__dot"></span><span>' + esc(c) + '</span></span>';
        }).join('') + '</div>' +
        '<div class="main-order__footer"><button type="button" class="main-order__request-btn' + (done ? ' main-order__request-btn--ghost' : '') + '" data-rq-open>' +
          esc(done ? L.btnEdit : L.btn) + '</button></div>' +
        '<div class="main-order__purchase-disclaimer"><p>' +
          (done ? '<button type="button" class="rq-cancel" data-rq-cancel>' + esc(L.cancelOrder) + '</button>' : esc(L.disclaimer)) +
        '</p></div>' +
      '</div></div>';
  }
  // Vue пересобирает список из шаблона после загрузки — картку щоразу шукаємо в живому DOM
  function renderCard() {
    var list = document.querySelector('.order-list');
    if (!list) return;
    var li = list.querySelector('.order-list__item--request');
    if (!li) {
      li = document.createElement('li');
      li.className = 'order-list__item order-list__item--request';
      li.setAttribute('data-id', 'request-card');
      li.setAttribute('data-item-type', 'request');
      list.insertBefore(li, list.firstChild);
    }
    li.innerHTML = cardHtml();
  }

  // ---------- елементи форми ----------
  function label(text, req, extra) {
    return '<div class="rq-label"><b>' + esc(text) + (req ? ' <i>*</i>' : '') + '</b>' + (extra || '') + '</div>';
  }
  function chipsHtml(group, items, sel) {
    return '<div class="rq-chips">' + items.map(function (t, i) {
      return '<button type="button" class="rq-chip" data-g="' + group + '" data-i="' + i + '" aria-pressed="' + (sel.indexOf(i) > -1) + '">' + esc(t) + '</button>';
    }).join('') + '</div>';
  }
  function segHtml(field, opts, val) {
    return '<div class="rq-seg">' + opts.map(function (o) {
      return '<button type="button" data-seg="' + field + '" data-v="' + o[0] + '" aria-pressed="' + (String(val) === String(o[0])) + '">' + esc(o[1]) + '</button>';
    }).join('') + '</div>';
  }
  function input(field, val, attrs) {
    return '<input type="text" class="rq-input" data-f="' + field + '" value="' + esc(val) + '"' + (attrs || '') + '>';
  }
  function field(text, req, html, hint, extra) {
    return '<div class="rq-field">' + label(text, req, extra) + html + (hint ? '<p class="rq-hint">' + esc(hint) + '</p>' : '') + '</div>';
  }
  function yn() { return [['yes', L.yes], ['no', L.no]]; }
  function idxOpts(list) { return list.map(function (t, i) { return [String(i), Array.isArray(t) ? t[0] : t]; }); }
  function timeOpts(val) {
    var h = '';
    for (var i = 6; i <= 23; i++) { var t = (i < 10 ? '0' : '') + i + ':00'; h += '<option' + (t === val ? ' selected' : '') + '>' + t + '</option>'; }
    return h;
  }
  function timeline(title) {
    return '<div class="rq-tl"><b class="rq-tl__title">' + esc(title || L.tlTitle) + '</b><ol>' + L.tl.map(function (x) {
      return '<li><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></li>';
    }).join('') + '</ol></div>';
  }
  function cur() { return EN ? '$' : '₴'; }

  // ---------- кроки ----------
  var STEPS = [
    function () {
      var d = draft;
      return timeline() + '<p class="rq-lead">' + esc(L.s1lead) + '</p>' +
        '<div class="rq-grid">' +
          field(L.fName, true, input('name', d.name, ' autocomplete="name"')) +
          field(L.fFirm, false, input('firm', d.firm)) +
          field(L.fBar, EN, input('bar', d.bar), L.fBarHint, L.fBarOpt ? '<span class="rq-hint rq-hint--inline">' + esc(L.fBarOpt) + '</span>' : '') +
          field(L.fEmail, true, input('email', d.email, ' inputmode="email"')) +
          field(L.fPhone, true, input('phone', d.phone, ' inputmode="tel"')) +
          field(L.fSite, false, input('site', d.site, ' placeholder="https://"')) +
        '</div>' +
        field(L.fOffice, false, input('office', d.office, ' placeholder="' + esc(L.fOfficePh) + '"')) +
        '<div class="rq-sec">' + label(L.fLangs) + chipsHtml('langs', L.langs, d.langs) + '</div>' +
        '<div class="rq-sec">' + label(L.fIntake, true) + segHtml('intake', idxOpts(L.intake), d.intake) + '</div>';
    },
    function () {
      var d = draft, m = mult(d);
      return '<h4 class="rq-h">' + esc(L.s2title) + ' <i>*</i></h4><p class="rq-lead">' + esc(L.s2lead) + '</p>' +
        '<div class="rq-cases">' + L.cases.map(function (c, i) {
          return '<button type="button" class="rq-case" data-g="cases" data-i="' + i + '" aria-pressed="' + (d.cases.indexOf(i) > -1) + '">' +
            '<span>' + esc(c[0]) + '</span><em>' + range(rnd(c[1] * m), rnd(c[2] * m)) + ' ' + esc(L.perLead) + '</em></button>';
        }).join('') + '</div>' +
        '<div class="rq-sec">' + label(L.fNot) + '<textarea class="rq-input" data-f="notCases" maxlength="300" placeholder="' + esc(L.fNotPh) + '">' + esc(d.notCases) + '</textarea></div>';
    },
    function () {
      var d = draft;
      return '<div class="rq-sec rq-sec--first">' + label(L.fAreas, true) + chipsHtml('areas', L.areas, d.areas) +
          '<div class="rq-city-extra">' + input('other', d.other, ' placeholder="' + esc(L.fOtherPh) + '" aria-label="' + esc(L.fOther) + '"') + '</div></div>' +
        '<div class="rq-sec">' + label(L.fRemote) + segHtml('remote', yn(), d.remote) + '<p class="rq-hint">' + esc(L.remoteHint) + '</p></div>' +
        '<div class="rq-sec">' + label(L.fFormat) + segHtml('format', L.formats, d.format) + '</div>';
    },
    function () {
      var d = draft;
      return '<div class="rq-sec rq-sec--first">' + label(L.fBudget) + segHtml('budget', idxOpts(L.budgets), d.budget) + '<p class="rq-hint">' + esc(L.budgetHint) + '</p></div>' +
        '<div class="rq-sec">' + label(L.fConsult) + '<div class="rq-inline">' + segHtml('consult', L.consults, d.consult) +
          (d.consult === 'paid' ? '<div class="rq-money rq-money--fee">' + input('fee', d.fee, ' inputmode="numeric" data-num placeholder="' + esc(L.fFee) + '" aria-label="' + esc(L.fFee) + '"') + '<em>' + cur() + '</em></div>' : '') +
        '</div></div>' +
        '<div class="rq-sec rq-grid">' +
          '<div>' + label(L.fDet) + segHtml('det', yn(), d.det) + '</div>' +
          '<div>' + label(L.fCrim) + segHtml('crim', yn(), d.crim) + '</div>' +
        '</div>' +
        '<div class="rq-sec">' + label(L.fUrg) + segHtml('urg', L.urgs, d.urg) + '</div>' +
        '<div class="rq-sec">' + label(L.fLeadLang) + chipsHtml('leadLangs', [L.anyLang].concat(L.langs), d.leadLangs) + '</div>';
    },
    function () {
      var d = draft;
      var fx = factors(d);
      return '<p class="rq-lead">' + esc(L.s5lead) + '</p>' +
        '<div class="rq-sec rq-grid">' +
          '<div>' + label(L.fExcl) + segHtml('excl', L.excls, d.excl) + '<p class="rq-hint">' + esc(L.exclHint) + '</p></div>' +
          '<div>' + label(L.fPeriod) + segHtml('period', L.periods, d.period) + '</div>' +
        '</div>' +
        '<div class="rq-sec"><div class="rq-prow rq-prow--head"><span>' + esc(L.colCase) + '</span><span>' + esc(L.colPrice) + '</span><span>' + esc(L.colQty) + '</span></div>' +
          d.cases.map(function (i) {
            var r = d.rows[i] || {}, e = estFor(d, i);
            return '<div class="rq-prow" data-prow="' + i + '">' +
              '<div class="rq-prow__case"><b>' + esc(L.cases[i][0]) + '</b><span>' + esc(L.est) + range(e[0], e[1]) + '</span></div>' +
              '<div class="rq-money"><input type="text" inputmode="numeric" class="rq-input" data-row="' + i + '" data-k="price" value="' + esc(r.price || '') + '" placeholder="' + e[0] + '–' + e[1] + '" aria-label="' + esc(L.colPrice) + '"><em>' + cur() + '</em></div>' +
              '<input type="text" inputmode="numeric" class="rq-input rq-qty" data-row="' + i + '" data-k="qty" value="' + esc(r.qty || '') + '" placeholder="5" aria-label="' + esc(L.colQty) + '">' +
              '<p class="rq-prow__st" data-st="' + i + '"></p>' +
            '</div>';
          }).join('') +
          '<button type="button" class="rq-link" data-rq-est>' + esc(L.useEst) + '</button>' +
        '</div>' +
        '<div class="rq-fx"><b>' + esc(L.fxTitle) + '</b>' + (fx.length ? fx.map(function (x) {
          return '<span class="rq-fx__i' + (x[1] < 1 ? ' rq-fx__i--down' : '') + '">' + esc(x[0]) + ' ' + pct(x[1]) + '</span>';
        }).join('') : '<span class="rq-fx__i rq-fx__i--none">' + esc(L.fxNone) + '</span>') + '</div>' +
        '<div class="rq-total"><span>' + esc(L.total) + '</span><b data-rq-total></b></div>' +
        '<div class="rq-sec rq-grid">' +
          '<div>' + label(L.fCap) + '<div class="rq-money">' + input('cap', d.cap, ' inputmode="numeric" data-num placeholder="' + (EN ? '2000' : '20000') + '"') + '<em>' + cur() + '</em></div>' +
            '<p class="rq-hint">' + esc(L.capHint) + '</p></div>' +
          '<div class="rq-warn" data-rq-capwarn hidden></div>' +
        '</div>' +
        '<p class="rq-note">' + esc(L.estNote) + '</p>';
    },
    function () {
      var d = draft, crmOn = d.channels.indexOf(L.channels.indexOf('CRM')) > -1, hookOn = d.channels.indexOf(L.channels.length - 1) > -1;
      return '<div class="rq-sec rq-sec--first">' + label(L.fCh) + chipsHtml('channels', L.channels, d.channels) + '<p class="rq-hint">' + esc(L.chHint) + '</p>' +
          (crmOn ? '<div class="rq-sub">' + label(L.fCrm, true) + segHtml('crm', idxOpts(L.crms), d.crm) + '</div>' : '') +
          (hookOn ? '<div class="rq-sub">' + label(L.fHook, true) + input('hook', d.hook, ' placeholder="https://" inputmode="url"') + '</div>' : '') +
        '</div>' +
        '<div class="rq-sec rq-grid">' +
          '<div>' + label(L.fHours) + '<div class="rq-range"><select class="rq-input" data-f="hFrom">' + timeOpts(d.hFrom) + '</select><span>—</span><select class="rq-input" data-f="hTo">' + timeOpts(d.hTo) + '</select></div></div>' +
          '<div>' + label(L.fWeek) + segHtml('weekends', L.weeks, d.weekends) + '</div>' +
        '</div>' +
        '<div class="rq-sec">' + label(L.fResp) + segHtml('resp', idxOpts(L.resps), d.resp) + '<p class="rq-hint">' + esc(L.respHint) + '</p></div>' +
        '<div class="rq-sec">' + label(L.fPay) + segHtml('pay', L.pays, d.pay) + '<p class="rq-hint">' + esc(L.payHint) + '</p></div>' +
        '<div class="rq-ret"><b>' + esc(L.retTitle) + '</b><p>' + esc(L.retText) + '</p><ul>' + L.retList.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
          '<p class="rq-ret__note">' + esc(L.retNote) + '</p></div>' +
        '<label class="rq-check"><input type="checkbox" data-f="feedback"' + (d.feedback ? ' checked' : '') + '><span>' + esc(L.fFeedback) + '</span></label>';
    },
    function () {
      return '<p class="rq-lead">' + esc(L.s7lead) + '</p>' + reviewHtml(draft, true) +
        '<label class="rq-check"><input type="checkbox" data-f="tos"' + (draft.tos ? ' checked' : '') + '><span>' + L.tos + ' <i>*</i></span></label>' +
        '<label class="rq-check"><input type="checkbox" data-f="consent"' + (draft.consent ? ' checked' : '') + '><span>' + esc(L.consent) + ' <i>*</i></span></label>' +
        '<p class="rq-note">' + esc(L.payNote) + '</p>';
    }
  ];

  function names(items, idx) { return idx.map(function (i) { return items[i]; }).join(', '); }
  function reviewHtml(d, editable) {
    var tt = totals(d);
    var crmI = L.channels.indexOf('CRM'), hookI = L.channels.length - 1;
    var ch = names(L.channels, d.channels);
    if (d.channels.indexOf(crmI) > -1 && d.crm !== '') ch += ' (' + L.crms[+d.crm] + ')';
    if (d.channels.indexOf(hookI) > -1 && d.hook) ch += ' · ' + d.hook;
    var blocks = [
      [[L.fName, d.name], [L.rvFirm, d.firm], [L.rvBar, d.bar], [L.rvContacts, [d.email, d.phone, d.site].filter(Boolean).join(' · ')],
       [L.rvLangs, names(L.langs, d.langs)], [L.rvIntake, d.intake === '' ? '' : L.intake[+d.intake]]],
      [[L.rvCases, names(L.cases.map(function (c) { return c[0]; }), d.cases)], [L.rvNot, d.notCases]],
      [[L.rvAreas, [names(L.areas, d.areas), d.other].filter(Boolean).join(', ')], [L.rvRemote, d.remote === 'yes' ? L.yes : L.no], [L.rvFormat, pick(L.formats, d.format)]],
      [[L.rvBudget, L.budgets[+d.budget][0]], [L.rvConsult, pick(L.consults, d.consult) + (d.consult === 'paid' && d.fee ? ' · ' + money(+d.fee) : '')],
       [L.rvDet, d.det === 'yes' ? L.yes : L.no], [L.rvCrim, d.crim === 'yes' ? L.yes : L.no], [L.rvUrg, pick(L.urgs, d.urg)],
       [L.rvLeadLang, names([L.anyLang].concat(L.langs), d.leadLangs)]],
      d.cases.map(function (i) {
        var r = d.rows[i] || {};
        return [L.cases[i][0], monthly(d, r.qty) + ' × ' + money(parseInt(r.price, 10) || 0)];
      }).concat([[L.rvExcl, pick(L.excls, d.excl)], [L.total, tt.n + ' ' + L.leadsW + ' · ' + money(tt.t)], [L.rvCap, d.cap ? money(+d.cap) : '']]),
      [[L.rvCh, ch], [L.rvHours, d.hFrom + '–' + d.hTo + ', ' + pick(L.weeks, d.weekends).toLowerCase()], [L.rvResp, L.resps[+d.resp]],
       [L.rvPay, pick(L.pays, d.pay)], [L.rvFeedback, d.feedback ? L.yes : L.no]]
    ];
    return '<div class="rq-review">' + blocks.map(function (rows, b) {
      return '<section><div class="rq-review__h"><b>' + esc(L.steps[b]) + '</b>' + (editable ? '<button type="button" class="rq-link" data-rq-go="' + b + '">' + esc(L.edit) + '</button>' : '') + '</div>' +
        rows.map(function (r) { return '<div class="rq-review__r"><span>' + esc(r[0]) + '</span><b>' + esc(r[1] || L.none) + '</b></div>'; }).join('') + '</section>';
    }).join('') + '</div>';
  }

  // ---------- перевірка кроків: [ключ помилки, поле для фокусу, готовий текст] ----------
  function validate(s) {
    var d = draft;
    if (s === 0) {
      if (!d.name.trim()) return ['errName', 'name'];
      if (EN && !d.bar.trim()) return ['errBar', 'bar'];
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email.trim())) return ['errEmail', 'email'];
      if (num(d.phone).length < 7) return ['errPhone', 'phone'];
      if (d.intake === '') return ['errIntake'];
    }
    if (s === 1 && !d.cases.length) return ['errCases'];
    if (s === 2 && !d.areas.length && !d.other.trim()) return ['errAreas', 'other'];
    if (s === 3 && d.consult === 'paid' && !num(d.fee)) return ['errFee', 'fee'];
    if (s === 4) {
      for (var k = 0; k < d.cases.length; k++) {
        var r = d.rows[d.cases[k]] || {};
        if (!(parseInt(r.price, 10) > 0) || !(parseInt(r.qty, 10) > 0)) return ['errRows'];
      }
      var t = totals(d).t;
      if (d.cap && t > +d.cap) return [null, 'cap', fill(L.capWarn, { t: money(t), c: money(+d.cap) })];
    }
    if (s === 5) {
      if (d.channels.indexOf(L.channels.indexOf('CRM')) > -1 && d.crm === '') return ['errCrm'];
      if (d.channels.indexOf(L.channels.length - 1) > -1 && !/^https?:\/\/\S+\.\S+/.test(d.hook.trim())) return ['errHook', 'hook'];
      if (d.hTo <= d.hFrom) return ['errHours'];
    }
    if (s === 6 && !(d.tos && d.consent)) return ['errTos'];
    return null;
  }

  // ---------- вікно ----------
  var modal = null;
  function headHtml() {
    var of = fill(L.stepOf, { n: step + 1, t: L.steps.length });
    return '<h3 class="rq-title">' + esc(order ? L.mTitleEdit : L.mTitle) + '</h3>' +
      '<ol class="rq-steps" aria-label="' + esc(of) + '">' + L.steps.map(function (t, i) {
        var cls = i === step ? ' is-current' : i <= seen ? ' is-done' : '';
        var inner = '<em>' + (i + 1) + '</em><span>' + esc(t) + '</span>';
        return '<li class="rq-steps__i' + cls + '">' + (i <= seen && i !== step
          ? '<button type="button" class="rq-steps__btn" data-rq-go="' + i + '">' + inner + '</button>'
          : '<span class="rq-steps__btn"' + (i === step ? ' aria-current="step"' : '') + '>' + inner + '</span>') + '</li>';
      }).join('') + '</ol>' +
      '<p class="rq-steps__mob">' + esc(of) + ' · <b>' + esc(L.steps[step]) + '</b></p>';
  }
  function footHtml() {
    var last = step === L.steps.length - 1;
    return '<div class="rq-foot">' +
      (step ? '<button type="button" class="rq-cancel-btn" data-rq-back>← ' + esc(L.back) + '</button>' : '<button type="button" class="rq-cancel-btn" data-rq-close>' + esc(L.cancel) + '</button>') +
      '<span class="rq-est" data-rq-estline></span>' +
      '<button type="button" class="rq-btn" data-rq-next>' + esc(last ? (order ? L.save : L.submit) : L.next + ' →') + '</button></div>';
  }
  function doneHtml(o) {
    return '<div class="rq-done"><div class="rq-done__ico">✓</div><h3>' + esc(L.okTitle) + '</h3>' +
      '<p class="rq-done__id">' + esc(L.okId) + ' <b>' + esc(o.id) + '</b> · ' + esc(L.okStatus) + '</p>' +
      '<p>' + esc(L.okText) + '<b>' + EMAIL + '</b>.</p>' +
      timeline(L.okNext) + reviewHtml(o, false) +
      '<div class="rq-foot rq-foot--center"><button type="button" class="rq-btn" data-rq-close>' + esc(L.okClose) + '</button></div></div>';
  }
  function body() { return modal.querySelector('[data-rq-body]'); }
  function paint(keepScroll) {
    var b = body(), top = b.scrollTop;
    b.innerHTML = doneView ? doneHtml(order) : headHtml() + '<div class="rq-stepbody">' + STEPS[step]() + '</div><div class="rq-error" data-rq-error role="alert" hidden></div>' + footHtml();
    b.scrollTop = keepScroll ? top : 0;
    if (!doneView) live();
  }
  function live() {
    var d = draft, line = modal.querySelector('[data-rq-estline]');
    if (line) {
      if (step >= 4) { var tt = totals(d); line.textContent = fill(L.estTotal, { n: tt.n, t: money(tt.t) }); }
      else if (d.cases.length) {
        var lo = Infinity, hi = 0;
        d.cases.forEach(function (i) { var e = estFor(d, i); lo = Math.min(lo, e[0]); hi = Math.max(hi, e[1]); });
        line.textContent = fill(L.estPer, { r: range(lo, hi) });
      } else line.textContent = step ? L.estNone : '';
    }
    if (step !== 4) return;
    d.cases.forEach(function (i) {
      var el = modal.querySelector('[data-st="' + i + '"]');
      if (!el) return;
      var p = parseInt((d.rows[i] || {}).price, 10), e = estFor(d, i);
      el.className = 'rq-prow__st';
      if (!(p > 0)) { el.textContent = ''; return; }
      var k = p < e[0] ? 'low' : p > e[1] ? 'high' : 'ok';
      el.classList.add('rq-prow__st--' + k);
      el.textContent = k === 'low' ? L.stLow : k === 'high' ? L.stHigh : L.stOk;
    });
    var tt2 = totals(d);
    modal.querySelector('[data-rq-total]').textContent = tt2.n + ' ' + L.leadsW + ' · ' + money(tt2.t);
    var w = modal.querySelector('[data-rq-capwarn]');
    var over = d.cap && tt2.t > +d.cap;
    w.hidden = !over;
    if (over) w.textContent = fill(L.capWarn, { t: money(tt2.t), c: money(+d.cap) });
  }
  function overlayEl() { return document.querySelector('[data-overlay], .overlay'); }
  function openModal() {
    var overlay = overlayEl();
    if (!overlay) return;
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal success-modal rq-modal';
      modal.setAttribute('data-popup', 'lead-request');
      modal.innerHTML = '<div role="dialog" aria-modal="true" class="modal__box success-modal__box">' +
        '<button aria-label="Close" class="close modal__close" data-rq-close><svg width="20" height="20"><use href="' + SPRITE + '#close2"></use></svg></button>' +
        '<div data-rq-body></div></div>';
      overlay.appendChild(modal);
    }
    if (order) { draft = copy(order); step = seen = L.steps.length - 1; }
    else if (!draft) { draft = blank(); step = seen = 0; }
    doneView = false;
    paint(false);
    overlay.classList.add('active');
    modal.classList.add('active');
    document.body.classList.add('dis-scroll');
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    if (doneView) { draft = null; doneView = false; }
    if (!document.querySelector('.modal.active')) {
      var overlay = overlayEl();
      if (overlay) overlay.classList.remove('active');
      document.body.classList.remove('dis-scroll');
      document.body.style.paddingRight = '';
    }
  }
  function fail(v) {
    var box = modal.querySelector('[data-rq-error]');
    box.textContent = v[2] || L[v[0]];
    box.hidden = false;
    var f = v[1] && modal.querySelector('[data-f="' + v[1] + '"]');
    if (f) { f.setAttribute('aria-invalid', 'true'); f.focus(); }
    box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function go(s) { step = s; seen = Math.max(seen, s); paint(false); }
  function next() {
    var v = validate(step);
    if (v) return fail(v);
    if (step < L.steps.length - 1) return go(step + 1);
    var d = copy(draft);
    d.id = order ? order.id : 'LO-' + (2400 + Math.floor(Math.random() * 600));
    d.at = Date.now();
    order = d; save(order);
    doneView = true;
    paint(false);
    renderCard();
  }

  // ---------- взаємодія ----------
  function toggle(arr, i) { var k = arr.indexOf(i); if (k > -1) arr.splice(k, 1); else arr.push(i); }
  var EXCLUSIVE0 = { areas: 1, leadLangs: 1 };      // перший пункт («Вся Україна», «Будь-яка») виключає решту
  function onClick(e) {
    var t = e.target;
    if (t.closest('[data-rq-open]')) { e.preventDefault(); openModal(); return; }
    if (t.closest('[data-rq-cancel]')) {
      e.preventDefault(); order = null; draft = null; save(null); renderCard();
      if (window.demoToast) window.demoToast(L.cancelled);
      return;
    }
    if (!modal || !modal.classList.contains('active')) return;
    if (t === overlayEl()) { closeModal(); return; }
    if (t.closest('[data-rq-close]')) { e.preventDefault(); closeModal(); return; }
    if (t.closest('[data-rq-next]')) { e.preventDefault(); next(); return; }
    if (t.closest('[data-rq-back]')) { go(step - 1); return; }
    var g = t.closest('[data-rq-go]');
    if (g) { go(+g.getAttribute('data-rq-go')); return; }
    var c = t.closest('[data-g]');
    if (c) {
      var grp = c.getAttribute('data-g'), i = +c.getAttribute('data-i'), arr = draft[grp];
      if (EXCLUSIVE0[grp]) {
        if (i === 0) draft[grp] = arr.indexOf(0) > -1 ? [] : [0];
        else { draft[grp] = arr.filter(function (x) { return x !== 0; }); toggle(draft[grp], i); }
      } else toggle(arr, i);
      paint(true);
      return;
    }
    var sg = t.closest('[data-seg]');
    if (sg) { draft[sg.getAttribute('data-seg')] = sg.getAttribute('data-v'); paint(true); return; }
    if (t.closest('[data-rq-est]')) {
      draft.cases.forEach(function (i) {
        var e2 = estFor(draft, i), r = draft.rows[i] || (draft.rows[i] = {});
        r.price = String(rnd((e2[0] + e2[1]) / 2));
        if (!r.qty) r.qty = '5';
      });
      paint(true);
    }
  }
  function onInput(e) {
    if (!modal || !modal.classList.contains('active') || doneView) return;
    var t = e.target, f = t.getAttribute('data-f'), row = t.getAttribute('data-row');
    if (row !== null) {
      var v = num(t.value); if (v !== t.value) t.value = v;
      (draft.rows[row] || (draft.rows[row] = {}))[t.getAttribute('data-k')] = v;
    } else if (f) {
      if (t.type === 'checkbox') draft[f] = t.checked;
      else {
        if (t.hasAttribute('data-num')) { var n = num(t.value); if (n !== t.value) t.value = n; }
        draft[f] = t.value;
      }
    } else return;
    t.removeAttribute('aria-invalid');
    var err = modal.querySelector('[data-rq-error]');
    if (err) err.hidden = true;
    live();
  }

  function init() {
    renderCard();
    document.addEventListener('click', onClick);
    document.addEventListener('input', onInput);
    document.addEventListener('change', onInput);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && modal.classList.contains('active')) closeModal();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
