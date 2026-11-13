/* ═══════════════════════════════════════════════════════════════════════════
   ВОРОНКА (ТЗ v2, 17.09.2026; ADR-038, ADR-039)
   · экран = #sN в URL (аналитика по шагам; ТЗ §5) · «Назад» и действие шага — в нижней панели
   · состояние — только в памяти: повторный вход начинает квиз сначала (ТЗ §5)
   · UTM / источник — с первого экрана до лида · события — dataLayer + CustomEvent «ds:quiz»
   · фокус после смены экрана — на заголовок, живой регион объявляет шаг
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.getElementById('funnel');
  if (!root) return;
  /* локаль страницы: язык, телефонный код и маска, валюта, множественное число, города — window.QUIZ_LOCALE (build.py) */
  var locale = window.QUIZ_LOCALE || {};

  /* ── данные-заглушки (в продукте — база сайта); населённые пункты — из локали ── */
  var SETTLEMENTS = locale.settlements || [
    ['Kijów', 'Kijów', 1000, 50.45, 30.52],
    ['Lwów', 'obw. lwowski', 640, 49.84, 24.03],
    ['Odessa', 'obw. odeski', 520, 46.48, 30.73],
    ['Charków', 'obw. charkowski', 480, 49.99, 36.23],
    ['Dniepr', 'obw. dniepropetrowski', 450, 48.46, 35.05],
    ['Połtawa', 'obw. połtawski', 1000, 49.59, 34.55],
    ['Zaporoże', 'obw. zaporoski', 210, 47.84, 35.14],
    ['Winnica', 'obw. winnicki', 190, 49.23, 28.47],
    ['Iwano-Frankiwsk', 'obw. iwanofrankiwski', 170, 48.92, 24.71],
    ['Czerkasy', 'obw. czerkaski', 160, 49.44, 32.06],
    ['Chmielnicki', 'obw. chmielnicki', 150, 49.42, 26.98],
    ['Żytomierz', 'obw. żytomierski', 140, 50.25, 28.66],
    ['Krzywy Róg', 'obw. dniepropetrowski', 140, 47.91, 33.39],
    ['Równe', 'obw. rówieński', 130, 50.62, 26.25],
    ['Łuck', 'obw. wołyński', 120, 50.75, 25.33],
    ['Mikołajów', 'obw. mikołajowski', 120, 46.97, 32.0],
    ['Tarnopol', 'obw. tarnopolski', 110, 49.55, 25.59],
    ['Czerniowce', 'obw. czerniowiecki', 100, 48.29, 25.94],
    ['Użhorod', 'obw. zakarpacki', 90, 48.62, 22.29],
    ['Czernihów', 'obw. czernihowski', 90, 51.5, 31.29],
    ['Kropywnycki', 'obw. kirowohradzki', 85, 48.51, 32.26],
    ['Sumy', 'obw. sumski', 80, 50.91, 34.8],
    ['Krzemieńczuk', 'obw. połtawski', 70, 49.07, 33.42],
    ['Chersoń', 'obw. chersoński', 60, 46.64, 32.61],
    ['Biała Cerkiew', 'obw. kijowski', 60, 49.8, 30.11],
    ['Browary', 'obw. kijowski', 45, 50.51, 30.79],
    ['Dubno', 'obw. rówieński', 41, 50.42, 25.75],
    ['Irpień', 'obw. kijowski', 40, 50.52, 30.25],
    ['Mukaczewo', 'obw. zakarpacki', 35, 48.44, 22.72],
    ['Kamieniec Podolski', 'obw. chmielnicki', 32, 48.68, 26.58],
    ['Humań', 'obw. czerkaski', 30, 48.75, 30.22],
    ['Bucza', 'obw. kijowski', 30, 50.54, 30.21],
    ['Drohobycz', 'obw. lwowski', 28, 49.35, 23.51],
    ['Pawłohrad', 'obw. dniepropetrowski', 26, 48.52, 35.87],
    ['Berdyczów', 'obw. żytomierski', 25, 49.9, 28.58],
    ['Kowel', 'obw. wołyński', 24, 51.22, 24.71],
    ['Niżyn', 'obw. czernihowski', 22, 51.05, 31.89],
    ['Wasylków', 'obw. kijowski', 20, 50.18, 30.31],
    ['Stryj', 'obw. lwowski', 20, 49.26, 23.85],
    ['Obuchów', 'obw. kijowski', 18, 50.11, 30.63],
    ['Kołomyja', 'obw. iwanofrankiwski', 18, 48.53, 25.04],
    ['Fastów', 'obw. kijowski', 15, 50.08, 29.92],
    ['Nowogród Wołyński', 'obw. żytomierski', 12, 50.59, 27.62],
    ['Sławutycz', 'obw. kijowski', 6, 51.52, 30.76],
    ['Tetijów', 'obw. kijowski', 4, 49.37, 29.68],
    ['Kagarlik', 'obw. kijowski', 3, 49.87, 30.82],
    ['Wołodarka', 'obw. kijowski', 2, 49.52, 29.92],
    ['Stawyszcze', 'obw. kijowski', 1, 49.39, 30.19],
    ['Warszawa', 'Polska', 38, 52.23, 21.01, 'PL'],
    ['Kraków', 'Polska', 21, 50.06, 19.94, 'PL'],
    ['Berlin', 'Niemcy', 17, 52.52, 13.4, 'DE'],
    ['Praga', 'Czechy', 12, 50.08, 14.44, 'CZ'],
  ];
  /* карта країни на S3: контур і проекція приходять з QUIZ_LOCALE.geo (tools/make-geo.py) */
  var geo = locale.geo || null,
    ASSETS = locale.assets || 'assets/',
    geoCache = {};
  if (geo) geoCache[locale.country || 'UA'] = geo;
  function geoXY(g, lat, lon) {
    var proj = g.proj;
    return [proj[4] + (lon - proj[0]) * proj[2], proj[5] + (proj[1] - lat) * proj[3]];
  }
  /* контур страны населённого пункта; нет файла — карта мира */
  function loadGeo(countryCode) {
    if (geoCache[countryCode]) return Promise.resolve(geoCache[countryCode]);
    if (!window.fetch) return Promise.reject(new Error('no fetch'));
    return fetch(ASSETS + 'geo/' + countryCode + '.json')
      .then(function (r) {
        if (!r.ok) throw new Error(countryCode);
        return r.json();
      })
      .then(function (g) {
        geoCache[countryCode] = g;
        return g;
      });
  }
  var REGION_TOTAL = locale.regionTotal || {
    'obw. kijowski': 1000,
    'obw. rówieński': 130,
    'obw. żytomierski': 140,
  };
  var CATEGORIES = [
    ['family', 'Rodzina', 312, 'i-family'],
    ['general', 'Sprawy ogólne', 240, 'i-file'],
    ['debtor', 'Ochrona dłużnika', 198, 'i-shield'],
    ['social', 'Sprawy socjalne', 165, 'i-heart'],
    ['migration', 'Migracja', 184, 'i-globe'],
    ['auto', 'Motoryzacja', 150, 'i-car'],
    ['business', 'Biznes', 220, 'i-briefcase'],
    ['military', 'Sprawy wojskowe', 275, 'i-shield-alert'],
    ['criminal', 'Sprawy karne', 130, 'i-scale'],
    ['debt', 'Odzyskiwanie długów', 118, 'i-coins'],
    ['other', 'Inne', 0, 'i-dots'],
  ];
  /* відповіді фахівців на S7/S8 — три рівні; для інших країн — з QUIZ_LOCALE.answers (build.py, data/cast-<loc>.json) */
  var ANSWERS = locale.answers || [
    {
      tier: 'premium',
      score: '76,37',
      name: 'Ołeksandr Studencow',
      role: 'Prawnik',
      city: 'Kijów',
      photo: 'st',
      initials: 'SO',
      ts: 'po 14 min',
      text: 'Proponuje drogę pozasądową i wyjaśnia, dlaczego w Twoim przypadku jest szybsza.',
    },
    {
      tier: 'pro',
      score: '68,26',
      name: 'Ołena Sobianina',
      role: 'Prawnik',
      city: 'Odessa',
      photo: 'so',
      initials: 'SO',
      ts: 'po 26 min',
      text: 'Radzi od razu przygotować pozew i pokazuje, które dowody wzmocnią Twoje stanowisko.',
    },
    {
      tier: 'start',
      score: '34,15',
      name: 'Serhij Wysocki',
      role: 'Prawnik',
      city: 'Odessa',
      photo: 'vy',
      initials: 'WS',
      ts: 'po 41 min',
      hide: true,
      text: 'Radzi spisać ustalenia na piśmie i od razu złożyć wniosek o alimenty — to oszczędzi czas w sądzie.',
    },
  ];
  var CASE_COUNT = locale.caseCounts || null; // реальна кількість кейсів за категорією (data/quiz-cases.json), інакше — показник з CATEGORIES
  function caseCount(id) {
    var category = CATEGORIES.filter(function (x) {
      return x[0] === id;
    })[0];
    return CASE_COUNT ? CASE_COUNT[id] || 0 : category ? category[2] : 0;
  }
  var CASES = locale.cases || {
    // кейси — заголовками, як у макеті власника 24.09 (фікстури до бази кейсів сайту)
    family: [
      ['Rozwód i miejsce zamieszkania dziecka', 'Ugoda i harmonogram kontaktów z dzieckiem'],
      ['Alimenty od ojca mieszkającego za granicą', 'Zasądzono alimenty w stałej kwocie'],
      ['Opieka babci nad wnukiem', 'Opiekę ustanowiono, świadczenia wypłacono'],
    ],
    general: [
      ['Sąsiad zalał mieszkanie, ubezpieczyciel odmówił', 'Szkodę naprawiono bez sądu'],
      ['Sporne naliczenia od zarządcy budynku', 'Naliczenia skorygowano, dług anulowano'],
      ['Odmowa udostępnienia informacji publicznej', 'Informację udostępniono po skardze'],
    ],
    debtor: [
      [
        'Nacisk windykatorów z powodu pożyczki',
        'Odsetki karne uznano za bezprawne, kwotę obniżono',
      ],
      ['Pozew banku o kredyt sprzed 10 lat', 'Uwzględniono przedawnienie, powództwo oddalono'],
      [
        'Komornik zablokował kartę, na którą wpływa pensja',
        'Zajęcie zniesiono, ustalono harmonogram spłaty',
      ],
    ],
    social: [
      ['Odmowa emerytury z powodu nieuwzględnionego stażu', 'Staż zaliczono, emeryturę przyznano'],
      [
        'Nie wypłacają świadczenia dla osób przesiedlonych',
        'Wypłaty wznowiono wraz z zaległościami',
      ],
      ['Odmowa przyznania grupy inwalidzkiej', 'Decyzję zmieniono, grupę przyznano'],
    ],
    migration: [
      ['Karta pobytu po zmianie pracodawcy', 'Kartę przedłużono bez wyjazdu'],
      ['Łączenie rodziny z zagranicy', 'Wiza D i zezwolenie na pobyt uzyskane'],
      ['Groźba wydalenia z powodu meldunku', 'Przymusowy powrót uchylono'],
    ],
    auto: [
      ['Wypadek, sprawca nie miał polisy OC', 'Odszkodowanie zasądzone przez sąd'],
      ['Ubezpieczyciel zaniżył wypłatę po wypadku', 'Dopłata po niezależnej wycenie'],
      ['Utrata prawa jazdy za odmowę badania', 'Postanowienie uchylono, prawo jazdy zachowane'],
    ],
    business: [
      ['Kontrahent nie płaci za towar', 'Dług odzyskany wraz z odsetkami i kosztami'],
      [
        'Urząd skarbowy naliczył dodatkowy podatek',
        'Dodatkowy wymiar podatku zaskarżono, kwotę obniżono',
      ],
      ['Spółka z zagranicznym wspólnikiem', 'Spółkę zarejestrowano, konto otwarto'],
    ],
    military: [
      ['Grzywna z TCK bez prawidłowego doręczenia', 'Postanowienie uchylono'],
      [
        'Odroczenie dla opiekuna osoby z niepełnosprawnością',
        'Odroczenie przyznane, dane w rejestrze',
      ],
      ['Brak wypłaty świadczeń po zranieniu', 'Świadczenie przyznano, zaległość spłacono'],
    ],
    criminal: [
      ['Przeszukanie bez postanowienia sądu', 'Dowody uznano za niedopuszczalne'],
      ['Podejrzenie oszustwa bez dowodów', 'Postępowanie umorzono'],
      ['Zatrzymanie bez obrońcy', 'Złagodzono środek zapobiegawczy'],
    ],
    debt: [
      ['Dłużnik nie odpowiadał na kontakt', 'Dług odzyskany, zajęto samochód'],
      ['Najemca nie płaci i nie opuszcza lokalu', 'Lokal odzyskany, dług zasądzony'],
      ['Brak zwrotu zaliczki za remont', 'Pieniądze zwrócone z odsetkami'],
    ],
  };
  var PEOPLE = locale.people || [
    ['Studencow', 'Ołeksandr', 'Prawnik', 'SO', 'online', 'st'],
    ['Mołczanow', 'Oleh', 'Adwokat', 'MO', 'online', 'mo'],
    ['Podliniewa', 'Wioleta', 'Prawnik', 'PW', 'online', 'po'],
    ['Hrycaj', 'Mykoła', 'Prawnik', 'HM', 'offline', 'hr'],
  ];

  /* ── порядок экранов, вопросы, панель действий ── */
  var STEPS = [
    's0',
    's1',
    's2',
    's3',
    's4',
    's5',
    's6',
    's7',
    's8',
    's9',
    's12',
    's15',
    's11',
    's13',
    's14',
    's16',
  ];
  var NAMES = {
    s0: 'entry',
    s1: 'proof_matching',
    s2: 'q_location',
    s3: 'proof_local',
    s4: 'q_category',
    s5: 'proof_cases',
    s6: 'q_description',
    s7: 'processing',
    s8: 'proof_opinions',
    s9: 'q_intent',
    s11: 'membership',
    s12: 'q_contacts',
    s13: 'checkout',
    s14: 'membership_success',
    s15: 'final_processing',
    s16: 'app_cta',
  };
  var QUESTION = {
    s2: [1, 'Lokalizacja'],
    s4: [2, 'Kategoria'],
    s6: [3, 'Opis'],
    s9: [4, 'Zamiary'],
    s12: [5, 'Kontakt'],
  };
  var NEXT = {
    s0: 's1',
    s1: 's2',
    s2: 's3',
    s3: 's4',
    s4: 's5',
    s5: 's6',
    s6: 's7',
    s7: 's8',
    s8: 's9',
    s9: 's12',
    s15: 's11',
    s13: 's14',
    s14: 's16',
  };
  var ANIMATED = {
    s1: true,
    s3: true,
    s7: true,
  };
  var BAR = {
    s0: {
      label: 'Rozpocznij analizę',
      event: 'quiz_start',
      back: false,
      note: '2–3 minuty',
    },
    s1: {
      label: 'Dalej',
    },
    s2: {
      label: 'Dalej',
      submit: true,
    },
    s3: {
      label: 'Dalej',
    },
    s4: {
      label: 'Dalej',
      submit: true,
    },
    s5: {
      label: 'Dalej',
    },
    s6: {
      label: 'Przeanalizuj sytuację',
      short: 'Przeanalizuj',
      submit: true,
    },
    s7: {
      label: 'Dalej',
    },
    s8: {
      label: 'Dalej',
    },
    s9: {
      label: 'Dalej',
      submit: true,
    },
    s11: {
      label: 'Kup pakiet',
      submit: true,
      alt: {
        label: 'Kontynuuj bez VIP',
        nav: 'free',
      },
    },
    s12: {
      label: 'Otrzymaj analizę',
      submit: true,
      event: 'quiz_contact_submit',
    },
    s13: {
      label: 'Zapłać',
      submit: true,
      alt: {
        label: 'Kontynuuj bez VIP',
        nav: 'free-after-fail',
      },
    },
    s14: {
      label: 'Dalej',
      back: false,
    },
    s15: {
      label: 'Poznaj szczegóły',
      back: false,
      alt: {
        label: 'Kontynuuj bez VIP',
        nav: 'free',
      },
    },
    s16: {
      link: true,
      back: false,
      note: 'Otworzy się App Store lub Google Play, zależnie od urządzenia. Zaloguj się numerem podanym w quizie.',
    },
  };
  var PLANS_ENTER = null;
  var state = {
    branch: 'free',
    settlement: null,
    remote: false,
    categories: [],
    description: '',
    intent: null,
    plan: null,
    phone: '',
    name: '',
    email: '',
    channels: [],
    leadId: null,
    paid: false,
    title: '',
    payFail: false,
    attribution: {},
    trail: [],
  };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  var timers = [];
  /* модальность ввода: после мыши/касания фокус уходит на main без кольца, с клавиатуры — на заголовок с кольцом */
  var modality = 'pointer';
  addEventListener(
    'pointerdown',
    function () {
      modality = 'pointer';
    },
    true,
  );
  addEventListener(
    'keydown',
    function (event) {
      if (
        event.key === 'Tab' ||
        event.key === 'Enter' ||
        event.key === ' ' ||
        event.key.indexOf('Arrow') === 0
      )
        modality = 'keyboard';
    },
    true,
  );

  /* ── служебное ── */
  var qs = function (sel, ctx) {
    return (ctx || document).querySelector(sel);
  };
  var qsAll = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };
  var live = qs('#funnel-live');
  var bar = {
    back: qs('#funnel-back'),
    skip: qs('#funnel-skip'),
    next: qs('#funnel-next'),
    link: qs('#funnel-link'),
    altrow: qs('#funnel-altrow'),
    alt: qs('#funnel-alt'),
    note: qs('#funnel-note'),
    full: qs('[data-lbl-full]'),
    short: qs('[data-lbl-short]'),
  };
  function later(fn, ms) {
    var timer = setTimeout(fn, reduce.matches ? Math.min(ms, 80) : ms);
    timers.push(timer);
    return timer;
  }
  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
      }[c];
    });
  }
  function nbsp(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  /* форма слова по правилу локали: L.plural(n) → 0 | 1 | 2 (uk: 1 фахівець · 2 фахівці · 5 фахівців; en: 1 specialist · 2 specialists) */
  function pluralIndex(n) {
    if (locale.plural) return locale.plural(n);
    var mod10 = n % 10,
      mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 0;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 1;
    return 2;
  }
  function plural(n, forms) {
    return forms[pluralIndex(n)];
  }
  function specialists(n, acc) {
    return n >= 1000
      ? '1 000+ prawników'
      : nbsp(n) +
          ' ' +
          plural(
            n,
            acc ? ['prawnika', 'prawnicy', 'prawników'] : ['prawnik', 'prawnicy', 'prawników'],
          );
  }
  function stepText(n, m) {
    return locale.step ? locale.step(n, m) : 'Krok ' + n + ' z ' + m;
  }
  function money(n) {
    return locale.money ? locale.money(n) : nbsp(n) + ' zł';
  }
  function track(eventName, extra) {
    var payload = {
      event: eventName,
      quiz_branch: state.branch,
      quiz_lead: state.leadId || null,
    };
    if (extra) for (var k in extra) payload[k] = extra[k];
    for (var a in state.attribution) payload[a] = state.attribution[a];
    (window.dataLayer = window.dataLayer || []).push(payload);
    document.dispatchEvent(
      new CustomEvent('ds:quiz', {
        detail: payload,
      }),
    );
  }
  function announce(text) {
    if (live) {
      live.textContent = '';
      setTimeout(function () {
        live.textContent = text;
      }, 40);
    }
  }
  function setBusy(btn, on) {
    if (!btn) return;
    btn.setAttribute('aria-busy', on ? 'true' : 'false');
    btn.disabled = !!on;
  }
  function catOf(id) {
    return CATEGORIES.filter(function (c) {
      return c[0] === id;
    })[0];
  }

  /* атрибуция — с первого экрана до лида (ТЗ §5) */
  (function () {
    var params = new URLSearchParams(location.search);
    [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
      'source',
      'campaign',
      'creative',
      'landing',
      'ref',
    ].forEach(function (k) {
      if (params.get(k)) state.attribution[k] = params.get(k);
    });
    if (document.referrer) state.attribution.referrer = document.referrer;
    state.attribution.entry_url = location.href.split('#')[0];
    state.attribution.entered_at = new Date().toISOString();
  })();

  /* ── доступность экрана по состоянию (повторный вход — сначала, ТЗ §5) ── */
  function allowed(id) {
    switch (id) {
      case 's0':
      case 's1':
      case 's2':
        return true;
      case 's3':
      case 's4':
        return !!(state.settlement || state.remote);
      case 's5':
      case 's6':
        return state.categories.length > 0;
      case 's7':
      case 's8':
      case 's9':
        return !!state.description;
      case 's12':
        return !!state.intent;
      case 's11':
        return !!state.leadId;
      case 's13':
        return !!state.leadId && !!state.plan && !state.paid;
      case 's14':
        return !!state.paid;
      case 's15':
      case 's16':
        return !!state.leadId;
    }
    return false;
  }

  /* ── прогресс в верхней панели ── */
  var progress = qs('#funnel-progress'),
    bars = qs('#funnel-bars'),
    where = qs('#funnel-where');
  var STEP_AT = {
    s1: 1,
    s2: 1,
    s3: 2,
    s4: 2,
    s5: 3,
    s6: 3,
    s7: 4,
    s8: 4,
    s9: 4,
    s12: 5,
  }; // крок видно й на проміжних екранах: номер наступного питання
  function updateProgress(id) {
    var step = STEP_AT[id],
      question = QUESTION[id];
    progress.hidden = !step;
    where.hidden = !step;
    if (!step) return;
    qsAll('.progress__seg', bars).forEach(function (b, i) {
      var num = i + 1;
      b.classList.toggle('is-done', num < step);
      b.classList.toggle('is-current', num === step);
      b.style.setProperty('--fill', num === step ? (question ? '1' : '0.5') : '0');
    });
    bars.setAttribute('aria-valuenow', String(step));
    bars.setAttribute('aria-valuetext', stepText(step, 5));
    where.textContent = stepText(step, 5);
  }

  /* ── кнопка кроку неактивна, поки не виконано обов’язкове (побажання власника 30.09) ── */
  var titleOkFn = null,
    phoneStateFn = null; /* перевірка заголовка S6 — задає сам екран, правило залежить від локалі */
  var GATE = {
    s2: function () {
      var remote = qs('#remote');
      return !!(state.settlement || (remote && remote.checked));
    },
    s4: function () {
      return !!qs('#s4-options input:checked');
    },
    s6: function () {
      var story = qs('#story');
      return !!(titleOkFn ? titleOkFn() : true) && !!(story && story.value.trim().length >= 50);
    },
    s9: function () {
      return !!qs('#s9 input:checked');
    },
    s12: function () {
      var phoneStatus = phoneStateFn ? phoneStateFn() : null;
      return !!(qs('#consent').checked && phoneStatus && phoneStatus.valid);
    },
  };
  function refreshGate() {
    var gate = GATE[current];
    if (!gate) return;
    var disabled = !gate();
    bar.next.disabled = disabled;
    bar.next.setAttribute('aria-disabled', disabled ? 'true' : 'false');
  }
  root.addEventListener('input', refreshGate);
  root.addEventListener('change', refreshGate);

  /* ── нижняя панель действий ── */
  function renderBar(id) {
    var barConfig = BAR[id];
    bar.back.hidden = barConfig.back === false;
    bar.skip.hidden = !ANIMATED[id];
    bar.note.hidden = !barConfig.note;
    bar.note.textContent = barConfig.note || '';
    bar.altrow.hidden = !barConfig.alt;
    if (barConfig.alt) {
      bar.alt.textContent = barConfig.alt.label;
      bar.alt.dataset.nav = barConfig.alt.nav;
    }
    if (barConfig.link) {
      bar.next.hidden = true;
      bar.link.hidden = false;
      return;
    }
    bar.link.hidden = true;
    bar.next.hidden = false;
    var label = barConfig.label;
    if (id === 's13')
      label =
        'Zapłać ' +
        money(
          state.plan
            ? state.plan.price
            : locale.plans && locale.plans[1]
              ? locale.plans[1].price
              : 0,
        );
    bar.full.textContent = label;
    var short = barConfig.short || '';
    bar.short.textContent = short;
    bar.next.dataset.hasShort = short ? 'true' : 'false';
    if (barConfig.shortAt) bar.next.dataset.shortAt = barConfig.shortAt;
    else delete bar.next.dataset.shortAt;
    if (barConfig.submit) {
      bar.next.type = 'submit';
      bar.next.setAttribute('form', id);
      delete bar.next.dataset.nav;
    } else {
      bar.next.type = 'button';
      bar.next.removeAttribute('form');
      bar.next.dataset.nav = 'next';
    }
    bar.next.setAttribute(
      'data-ds-event',
      barConfig.event || (barConfig.submit ? 'quiz_step_complete' : 'quiz_step_view'),
    );
    setBusy(bar.next, false);
  }
  function doneAnimating() {
    bar.skip.hidden = true;
  }

  /* ── показ экрана ── */
  var current = null;
  function render(id, dir, initial) {
    clearTimers();
    qsAll('.funnel__screen', root).forEach(function (s) {
      if (s.dataset.screen !== id) {
        s.hidden = true;
        s.removeAttribute('data-anim');
      }
    });
    var el = qs('#' + id);
    el.hidden = false;
    el.setAttribute('data-anim', dir === 'back' ? 'back' : 'forward');
    root.dataset.step = id;
    root.dataset.branch = state.branch;
    document.body.classList.toggle('is-dark', id === 's16');
    document.body.classList.toggle('is-entry', id === 's0');
    document.body.classList.toggle('is-final', id === 's16');
    updateProgress(id);
    renderBar(id);
    if (ENTER[id]) ENTER[id](el, dir);
    var s0Video = qs('#s0-video');
    if (s0Video) {
      if (id === 's0' && !reduce.matches) {
        var playing = s0Video.play();
        if (playing && playing.catch) playing.catch(function () {});
      } else {
        s0Video.pause();
      }
    }
    var s16Video = qs('#s16-video');
    if (s16Video) {
      if (id === 's16' && !reduce.matches) {
        try {
          s16Video.currentTime = 0;
        } catch (e) {}
        var pr16 = s16Video.play();
        if (pr16 && pr16.catch) pr16.catch(function () {});
      } else {
        s16Video.pause();
      }
    } /* відеотуторіал на фіналі — з початку при кожному показі */
    window.scrollTo(0, 0);
    var title = qs('.funnel__title', el);
    if (!initial)
      setTimeout(function () {
        (modality === 'keyboard' && title ? title : qs('#main')).focus({
          preventScroll: true,
        });
      }, 60);
    var question = QUESTION[id];
    announce(
      (question ? stepText(question[0], 5) + '. ' : '') + (title ? title.textContent.trim() : ''),
    );
    if (current !== id) {
      track('quiz_step_view', {
        quiz_step: id,
        quiz_step_name: NAMES[id],
      });
      if (state.trail[state.trail.length - 1] !== id) state.trail.push(id);
    }
    current = id;
    refreshGate();
  }
  function targetFromHash() {
    var hash = (location.hash || '#s0').replace('#', '');
    if (hash === 's13-error') {
      state.payFail = true;
      hash = 's13';
    }
    return STEPS.indexOf(hash) === -1 ? 's0' : hash;
  }
  var pendingDir = 'forward';
  function go(id, dir) {
    var idx = STEPS.indexOf(current),
      nidx = STEPS.indexOf(id);
    dir = dir || (nidx < idx ? 'back' : 'forward');
    if ('#' + id === location.hash) {
      render(id, dir);
      return;
    }
    pendingDir = dir;
    location.hash = id;
  }
  addEventListener('hashchange', function () {
    var id = targetFromHash();
    if (!allowed(id)) {
      history.replaceState(null, '', '#s0');
      id = 's0';
    }
    var dir = pendingDir || (STEPS.indexOf(id) < STEPS.indexOf(current) ? 'back' : 'forward');
    pendingDir = null;
    render(id, dir);
  });

  /* ── навигационные кнопки панели ── */
  document.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-nav]');
    if (!btn || !root.contains(btn)) return;
    var nav = btn.dataset.nav;
    if (nav === 'back') {
      event.preventDefault();
      if (state.trail.length > 1) {
        state.trail.pop();
        go(state.trail[state.trail.length - 1], 'back');
      } else go('s0', 'back');
      return;
    }
    if (nav === 'skip') {
      event.preventDefault();
      track('quiz_proof_skip', {
        quiz_step: current,
      });
      go(NEXT[current]);
      return;
    }
    if (nav === 'next') {
      event.preventDefault();
      if (current === 's0') track('quiz_start');
      go(NEXT[current]);
      return;
    }
    if (nav === 'free') {
      event.preventDefault();
      state.branch = 'free';
      state.plan = null;
      track('membership_skip');
      go('s16');
      return;
    }
    if (nav === 'free-after-fail') {
      event.preventDefault();
      state.branch = 'free';
      track('membership_skip_after_fail');
      go('s16');
      return;
    }
  });
  function showError(box, err, on, focusEl) {
    if (box) box.setAttribute('data-invalid', on ? 'true' : 'false');
    if (err) err.hidden = !on;
    if (on && focusEl) focusEl.focus();
  }

  /* S2 · локация: combobox */
  (function () {
    var input = qs('#settlement'),
      pop = qs('#settlement-pop'),
      list = qs('#settlement-list'),
      empty = qs('#settlement-empty');
    var clear = qs('.q-search__clear', qs('#settlement-box')),
      remote = qs('#remote'),
      err = qs('#settlement-err');
    var items = [],
      active = -1;
    function norm(s) {
      return s.toLowerCase().replace(/[’'ʼ]/g, '');
    }
    function close() {
      pop.hidden = true;
      pop.classList.remove('is-open');
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      active = -1;
    }
    function open() {
      pop.hidden = false;
      void pop.offsetWidth;
      pop.classList.add('is-open');
      input.setAttribute('aria-expanded', 'true');
    }
    function pick(i) {
      var item = items[i];
      if (!item) return;
      state.settlement = {
        name: item[0],
        region: item[1],
        count: item[2],
        lat: item[3],
        lon: item[4],
        country: item[5] || locale.country,
      };
      refreshGate();
      if (state.settlement.country !== locale.country)
        loadGeo(state.settlement.country).catch(function () {});
      input.value = item[0] + ', ' + item[1];
      clear.hidden = false;
      close();
      showError(null, err, false);
      announce('Wybrano: ' + item[0] + ', ' + item[1]);
    }
    function renderList(q) {
      var query = norm(q.trim());
      items = query.length
        ? SETTLEMENTS.filter(function (s) {
            var name = norm(s[0]);
            return (
              name.indexOf(query) === 0 ||
              name.indexOf(' ' + query) !== -1 ||
              name.indexOf('-' + query) !== -1
            );
          }).slice(0, 8)
        : [];
      list.innerHTML = items
        .map(function (s, i) {
          return (
            '<div class="q-search__opt" role="option" id="settlement-o' +
            i +
            '" aria-selected="false" data-i="' +
            i +
            '">' +
            '<span class="q-search__opt-text">' +
            escapeHtml(s[0]) +
            ', ' +
            escapeHtml(s[1]) +
            '</span></div>'
          );
        })
        .join('');
      empty.hidden = !(query.length && !items.length);
      if (query.length) open();
      else close();
    }
    input.addEventListener('input', function () {
      state.settlement = null;
      refreshGate();
      clear.hidden = !input.value;
      renderList(input.value);
    });
    input.addEventListener('focus', function () {
      if (input.value && !state.settlement) renderList(input.value);
    });
    input.addEventListener('keydown', function (event) {
      if (pop.hidden) return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (!items.length) return;
        active =
          event.key === 'ArrowDown'
            ? (active + 1) % items.length
            : (active - 1 + items.length) % items.length;
        qsAll('.q-search__opt', list).forEach(function (o, i) {
          o.classList.toggle('is-active', i === active);
          o.setAttribute('aria-selected', i === active ? 'true' : 'false');
        });
        input.setAttribute('aria-activedescendant', 'settlement-o' + active);
      } else if (event.key === 'Enter') {
        if (active > -1) {
          event.preventDefault();
          pick(active);
        }
      } else if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    });
    list.addEventListener('mousedown', function (event) {
      event.preventDefault();
    });
    list.addEventListener('click', function (event) {
      var o = event.target.closest('[data-i]');
      if (o) pick(+o.dataset.i);
    });
    input.addEventListener('blur', function () {
      setTimeout(close, 120);
    });
    clear.addEventListener('click', function () {
      input.value = '';
      state.settlement = null;
      refreshGate();
      clear.hidden = true;
      close();
      input.focus();
    });
    remote.addEventListener('change', function () {
      state.remote = remote.checked;
      if (remote.checked) showError(null, err, false);
    });
    qs('#s2').addEventListener('submit', function (event) {
      event.preventDefault();
      state.remote = remote.checked;
      if (!state.settlement && !state.remote) {
        showError(null, err, true, input);
        announce(err.textContent.trim());
        return;
      }
      showError(null, err, false);
      track('quiz_step_complete', {
        quiz_step: 's2',
        settlement: state.settlement ? state.settlement.name : null,
        region: state.settlement ? state.settlement.region : null,
        remote_ok: state.remote,
      });
      go('s3');
    });
  })();

  /* S4 · категории (multi) — плитки с иконками */
  (function () {
    var fieldset = qs('#s4-options'),
      err = qs('#s4-err');
    fieldset.insertAdjacentHTML(
      'beforeend',
      CATEGORIES.map(function (c) {
        return (
          '<label class="q-option q-option--tile"><input class="q-option__input" type="checkbox" name="practice_areas" value="' +
          c[0] +
          '">' +
          '<span class="q-option__label"><svg class="funnel__tile-icon icon" aria-hidden="true"><use href="#' +
          c[3] +
          '"></use></svg><span class="funnel__tile-text"><span>' +
          escapeHtml(c[1]) +
          '</span></span></span></label>'
        );
      }).join(''),
    );
    var LIMIT = 3;
    fieldset.addEventListener('change', function () {
      var checkedCount = qsAll('input:checked', fieldset).length;
      if (checkedCount) showError(fieldset, err, false);
      qsAll('input', fieldset).forEach(function (i) {
        if (!i.checked) {
          i.disabled = checkedCount >= LIMIT;
          i.closest('.q-option').classList.toggle('is-locked', checkedCount >= LIMIT);
        }
      }); /* не більше трьох категорій */
    });
    qs('#s4').addEventListener('submit', function (event) {
      event.preventDefault();
      var picked = qsAll('input:checked', fieldset).map(function (i) {
        return i.value;
      });
      if (!picked.length) {
        showError(fieldset, err, true, qs('input', fieldset));
        announce(err.textContent.trim());
        return;
      }
      state.categories = picked;
      track('quiz_step_complete', {
        quiz_step: 's4',
        practice_areas: picked.join(','),
      });
      go('s5');
    });
  })();

  /* S6 · заголовок + описание (голосовое сообщение убрано 12.11.2026, как в продовом квизе consultant.net.ua) */
  (function () {
    var storyField = qs('#story'),
      count = qs('.q-textarea__count-num', qs('#s6')),
      err = qs('#story-err'),
      errText = qs('[data-story-err-text]', err);
    var title = qs('#story-title'),
      terr = qs('#story-title-err'),
      twords = qs('[data-title-words]'),
      thint = qs('#story-title-hint');
    var titleWords =
      locale.titleWords ||
      null; /* uk: 7–12 слів; en/gb: лише довжина до 100 символів (правки US 13.10) */
    if (!titleWords) {
      title.maxLength = 100;
      thint.textContent = locale.titleHint || '';
    }
    var MIN_DESC = 50;
    function wordsOf(v) {
      return v.trim().split(/\s+/).filter(Boolean).length;
    }
    function titleOk() {
      var value = title.value.trim(),
        words = wordsOf(value);
      return titleWords
        ? words >= titleWords[0] && words <= titleWords[1]
        : value.length >= 3 && value.length <= 100;
    }
    titleOkFn = titleOk;
    title.addEventListener('input', function () {
      if (titleWords) twords.textContent = wordsOf(title.value);
      if (titleOk()) {
        terr.hidden = true;
        title.removeAttribute('aria-invalid');
      }
    });
    storyField.addEventListener('input', function () {
      count.textContent = nbsp(storyField.value.length);
      if (storyField.value.trim().length >= MIN_DESC) showError(null, err, false);
    });
    qs('#s6').addEventListener('submit', function (event) {
      event.preventDefault();
      state.description = storyField.value.trim();
      state.title = title.value.trim().replace(/\s+/g, ' ');
      if (!titleOk()) {
        terr.hidden = false;
        title.setAttribute('aria-invalid', 'true');
        title.focus();
        announce(terr.textContent.trim());
        return;
      }
      if (!state.description) {
        errText.textContent = 'Opisz sytuację — co najmniej 50 znaków';
        showError(null, err, true, storyField);
        announce(err.textContent.trim());
        return;
      }
      if (state.description.length < MIN_DESC) {
        errText.textContent = 'Opisz sytuację dokładniej — co najmniej 50 znaków';
        showError(null, err, true, storyField);
        announce(err.textContent.trim());
        return;
      }
      track('quiz_step_complete', {
        quiz_step: 's6',
        has_text: !!state.description,
        text_length: state.description.length,
        title_words: wordsOf(state.title),
      });
      go('s7');
    });
  })();

  /* S9 · intent */
  (function () {
    var fieldset = qs('#s9-options'),
      err = qs('#s9-err');
    fieldset.addEventListener('change', function () {
      showError(fieldset, err, false);
    });
    qs('#s9').addEventListener('submit', function (event) {
      event.preventDefault();
      var checked = qs('input:checked', fieldset);
      if (!checked) {
        showError(fieldset, err, true, qs('input', fieldset));
        announce(err.textContent.trim());
        return;
      }
      state.intent = checked.value;
      track('quiz_step_complete', {
        quiz_step: 's9',
        client_intent: checked.value,
      });
      go(NEXT.s9);
    });
  })();

  /* S11 · membership: план и пример экономии */
  (function () {
    var PLANS = locale.plans || [],
      rail = qs('[data-plans-track]'),
      dots = qs('[data-plans-dots]'),
      toggle = qs('#s11-plans .plans__toggle');
    if (!rail || !PLANS.length) return;
    var period = 'month';
    function amount(plan) {
      return money(period === 'year' ? plan.year : plan.price);
    }
    function perLabel() {
      return period === 'year' ? '/ 1 rok' : '/ 1 miesiąc';
    }
    function yearPct(plan) {
      return Math.round((1 - plan.year / (plan.price * 12)) * 100);
    } // знижка річної оплати проти 12 місячних
    function yearInfo(plan) {
      var full = plan.price * 12,
        save = full - plan.year;
      return period === 'year'
        ? 'Zamiast ' + money(full) + ' · oszczędzasz ' + money(save)
        : 'Za rok — ' + money(plan.year) + ' (−' + yearPct(plan) + ' %)';
    }
    rail.insertAdjacentHTML(
      'beforeend',
      PLANS.map(function (p) {
        var icons = ['i-message', 'i-file', 'i-coins'];
        return (
          '<label class="plan" data-tone="' +
          p.id +
          '">' +
          '<input class="q-option__input" type="radio" name="membership_plan" value="' +
          p.id +
          '"' +
          (p.recommended ? ' checked' : '') +
          '>' +
          '<span class="plan__head"><span class="plan__name">' +
          escapeHtml(p.name) +
          '</span><span class="plan__head-right">' +
          (p.recommended ? '<span class="chip chip--sm plan__rec">' + 'Polecany' + '</span>' : '') +
          '<span class="chip chip--sm plan__disc" data-plan-disc hidden></span></span></span>' +
          '<span class="plan__price"><span class="plan__amount num" data-plan-amount>' +
          amount(p) +
          '</span><span class="plan__period" data-plan-period>' +
          perLabel() +
          '</span></span>' +
          '<span class="plan__year num" data-plan-year>' +
          yearInfo(p) +
          '</span>' +
          '<ul class="plan__features">' +
          p.features
            .map(function (f) {
              return (
                '<li><svg class="icon" aria-hidden="true"><use href="#i-check"></use></svg><span>' +
                escapeHtml(f) +
                '</span></li>'
              );
            })
            .join('') +
          '</ul>' +
          '<span class="plan__pill"><span>' +
          escapeHtml(p.pill) +
          '</span></span>' +
          '<ul class="plan__savings"><li class="plan__savings-total"><svg class="icon" aria-hidden="true"><use href="#i-coins"></use></svg><span>' +
          escapeHtml(p.savings.total) +
          '</span></li>' +
          p.savings.items
            .map(function (t, k) {
              return (
                '<li class="funnel__hide-mid"><svg class="icon" aria-hidden="true"><use href="#' +
                icons[k] +
                '"></use></svg><span>' +
                escapeHtml(t) +
                '</span></li>'
              );
            })
            .join('') +
          '</ul>' +
          '<span class="plan__note funnel__hide-mid">' +
          'W porównaniu z płaceniem za te same konsultacje, wzory i usługi bez pakietu.' +
          '</span>' +
          '<span class="btn btn--outline plan__btn" aria-hidden="true"><span class="plan__btn-off">' +
          'Wybierz pakiet' +
          '</span><span class="plan__btn-on">' +
          'Wybrano' +
          '</span></span>' +
          '</label>'
        );
      }).join(''),
    );
    var cards = qsAll('.plan', rail);
    var yearTab = qs('.plans__tab[data-period="year"]', toggle);
    if (yearTab && PLANS[0])
      yearTab.textContent = '1 rok' + ' −' + yearPct(PLANS[1] || PLANS[0]) + ' %'; // вигода річної оплати видна одразу
    dots.innerHTML = PLANS.map(function (p, i) {
      return (
        '<button class="plans__dot" type="button" role="tab" aria-label="' +
        escapeHtml(p.name) +
        '" data-i="' +
        i +
        '"></button>'
      );
    }).join('');
    var dotEls = qsAll('.plans__dot', dots);
    function rel(c) {
      return rail.scrollLeft + c.getBoundingClientRect().left - rail.getBoundingClientRect().left;
    }
    function center(i, smooth) {
      var card = cards[i];
      if (!card) return;
      var left = rel(card) - (rail.clientWidth - card.clientWidth) / 2;
      if (smooth && rail.scrollTo && !reduce.matches)
        rail.scrollTo({
          left: left,
          behavior: 'smooth',
        });
      else rail.scrollLeft = left;
    }
    function current() {
      var mid = rail.scrollLeft + rail.clientWidth / 2,
        best = 0,
        d = Infinity;
      cards.forEach(function (c, i) {
        var distance = Math.abs(rel(c) + c.clientWidth / 2 - mid);
        if (distance < d) {
          d = distance;
          best = i;
        }
      });
      return best;
    }
    function mark() {
      var i = current();
      dotEls.forEach(function (d, k) {
        d.classList.toggle('is-on', k === i);
        d.setAttribute('aria-selected', k === i ? 'true' : 'false');
      });
    }
    var raf = 0;
    rail.addEventListener(
      'scroll',
      function () {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          mark();
        });
      },
      {
        passive: true,
      },
    );
    dotEls.forEach(function (d) {
      d.addEventListener('click', function () {
        center(+d.dataset.i, true);
      });
    });
    qs('[data-plans-prev]').addEventListener('click', function () {
      center(Math.max(0, current() - 1), true);
    });
    qs('[data-plans-next]').addEventListener('click', function () {
      center(Math.min(cards.length - 1, current() + 1), true);
    });
    rail.addEventListener('change', function (event) {
      var c = event.target.closest('.plan'),
        i = cards.indexOf(c);
      if (i >= 0) center(i, true);
    });
    qsAll('.plans__tab', toggle).forEach(function (b) {
      b.addEventListener('click', function () {
        period = b.dataset.period;
        qsAll('.plans__tab', toggle).forEach(function (x) {
          x.classList.toggle('is-on', x === b);
          x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
        });
        cards.forEach(function (c, i) {
          qs('[data-plan-amount]', c).textContent = amount(PLANS[i]);
          qs('[data-plan-period]', c).textContent = perLabel();
          qs('[data-plan-year]', c).textContent = yearInfo(PLANS[i]);
          var discountEl = qs('[data-plan-disc]', c);
          discountEl.hidden = period !== 'year';
          discountEl.textContent = '−' + yearPct(PLANS[i]) + ' %';
        });
        example();
      });
    });
    function example() {
      var checked = qs('input[name="membership_plan"]:checked', rail);
      if (!checked) return;
      var plan = PLANS.filter(function (x) {
        return x.id === checked.value;
      })[0];
      if (!plan || !plan.example) return;
      var price = plan.example.price,
        save = Math.round((price * plan.discount) / 100),
        fee = period === 'year' ? plan.year : plan.price;
      qs('[data-ex-service]').textContent = plan.example.service;
      qs('[data-ex-price]').textContent = money(price);
      qs('[data-ex-plan]').textContent = plan.name;
      qs('[data-ex-discount]').textContent = plan.discount;
      qs('[data-ex-new]').textContent = money(price - save);
      qs('[data-ex-fee]').textContent = money(fee);
      qs('[data-ex-save]').textContent = money(save);
    }
    rail.addEventListener('change', example);
    PLANS_ENTER = function () {
      var i = -1;
      cards.forEach(function (c, k) {
        if (qs('input', c).checked) i = k;
      });
      center(i < 0 ? 0 : i, false);
      mark();
      example();
    };
    qs('#s11').addEventListener('submit', function (event) {
      event.preventDefault();
      var checked = qs('input[name="membership_plan"]:checked', rail);
      if (!checked) return;
      var plan = PLANS.filter(function (x) {
        return x.id === checked.value;
      })[0];
      state.branch = 'member';
      state.plan = {
        id: plan.id,
        name: plan.name,
        price: period === 'year' ? plan.year : plan.price,
        discount: plan.discount,
        period: period,
      };
      track('membership_select', {
        membership_plan: plan.id,
        period: period,
      });
      go('s13');
    });
  })();

  /* S12 · контакты → лид + вопрос в застосунке (ТЗ S12) */
  (function () {
    var form = qs('#s12'),
      phone = qs('#phone'),
      phoneBox = qs('#phone-box'),
      perr = qs('#phone-err');
    var email = qs('#email'),
      eerr = qs('#email-err'),
      consent = qs('#consent'),
      cerr = qs('#consent-err'),
      more = qs('#s12-more');
    /* поле телефону — оригінальний компонент компанії (assets/vendor/phone-country-dropdown, jQuery + jquery.mask) без змін; тут лише надбудова:
       перевірка повноти номера за маскою країни, стан поля, країна за замовчуванням — з локалі (атрибут data-country підставляє build.py) */
    var NEED = {
      UA: 12,
      PL: 11,
      UK: 12,
      USA: 11,
      AE: 12,
    }; // цифр разом із кодом країни за масками компонента
    function phoneState() {
      var country =
          (window.PhoneCountryDropdown && PhoneCountryDropdown.getSelectedCountry(phone)) || 'UA',
        digits = phone.value.replace(/\D/g, '');
      var valid =
        country === 'NEUTRAL'
          ? digits.length >= 8 && digits.length <= 15
          : digits.length === NEED[country];
      return {
        country: country,
        valid: valid,
        value: phone.value,
        e164: '+' + digits,
      };
    }
    phoneStateFn = phoneState;
    function phoneSync() {
      if (phoneState().valid) {
        phoneBox.dataset.state = 'success';
        perr.hidden = true;
      } else phoneBox.removeAttribute('data-state');
    }
    /* надбудова: ведучий нуль після коду країни («067…», «07700…») знімається — маска компонента його не очікує і зсунула б цифри.
       Слухач стоїть раніше за обробник jquery.mask (той підключається при показі поля), тож маска форматує вже виправлене значення */
    var TRUNK = {
      UA: '380',
      PL: '48',
      UK: '44',
      USA: '1',
      AE: '971',
    };
    phone.addEventListener('input', function () {
      var country =
          (window.PhoneCountryDropdown && PhoneCountryDropdown.getSelectedCountry(phone)) || 'UA',
        trunk = TRUNK[country];
      if (!trunk) return;
      var digits = phone.value.replace(/\D/g, '');
      if (digits.indexOf(trunk + '0') === 0)
        phone.value = '+' + trunk + digits.slice(trunk.length + 1);
    });
    phone.addEventListener('input', phoneSync);
    phoneBox.addEventListener('click', function (event) {
      if (event.target.closest('.country-select__option'))
        setTimeout(function () {
          phoneSync();
          refreshGate();
        }, 0); /* без синтетичного input: його перехоплює jquery.mask і падає на зміні маски */
    });
    consent.addEventListener('change', function () {
      if (consent.checked) cerr.hidden = true;
    });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var ok = true,
        first = null;
      if (!phoneState().valid) {
        phoneBox.dataset.state = 'invalid';
        phone.setAttribute('aria-invalid', 'true');
        perr.hidden = false;
        ok = false;
        first = first || phone;
      } else {
        phoneBox.dataset.state = 'success';
        phone.removeAttribute('aria-invalid');
        perr.hidden = true;
      }
      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        more.open = true;
        email.setAttribute('aria-invalid', 'true');
        eerr.hidden = false;
        ok = false;
        first = first || email;
      } else {
        email.removeAttribute('aria-invalid');
        eerr.hidden = true;
      }
      if (!consent.checked) {
        consent.setAttribute('aria-invalid', 'true');
        cerr.hidden = false;
        ok = false;
        first = first || consent;
      } else {
        consent.removeAttribute('aria-invalid');
        cerr.hidden = true;
      }
      if (!ok) {
        first.focus();
        announce('Sprawdź pola formularza');
        return;
      }
      state.phone = phoneState().value;
      state.phoneE164 = phoneState().e164;
      state.phoneCountry = phoneState().country;
      state.name = qs('#name').value.trim();
      state.email = email.value.trim();
      state.channels = qsAll('input[name="preferred_channels"]:checked', form).map(function (i) {
        return i.value;
      });
      setBusy(bar.next, true);
      later(function () {
        state.leadId = '2026-' + String(Math.floor(10000 + Math.random() * 89999));
        var lead = {
          lead_id: state.leadId,
          phone: state.phoneE164,
          phone_country: state.phoneCountry,
          name: state.name || null,
          email: state.email || null,
          settlement: state.settlement ? state.settlement.name : null,
          region: state.settlement ? state.settlement.region : null,
          remote_ok: state.remote,
          practice_areas: state.categories,
          case_title: state.title || null,
          case_description: state.description || null,
          client_intent: state.intent,
          membership_intent: state.plan ? state.plan.id : null,
          attribution: state.attribution,
          last_step_reached: 's12',
          created_at: new Date().toISOString(),
        };
        try {
          console.info('[quiz] lead + question created', lead);
        } catch (err) {}
        track('quiz_contact_submit', {
          quiz_step: 's12',
          client_intent: state.intent,
          has_email: !!state.email,
        });
        setBusy(bar.next, false);
        qsAll('[data-s13-phone], [data-s15-phone]').forEach(function (n) {
          n.textContent = state.phone;
        });
        go('s15');
      }, 900);
    });
  })();

  /* S13 · оплата (существующий checkout в продукте; здесь — имитация) */
  (function () {
    var form = qs('#s13'),
      alert = qs('#s13-error');
    qs('[data-pay="retry"]', form).addEventListener('click', function () {
      alert.hidden = true;
      state.payFail = false;
      history.replaceState(null, '', '#s13');
      bar.next.focus();
    });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!state.plan) {
        go('s11');
        return;
      }
      setBusy(bar.next, true);
      track('checkout_submit', {
        membership_plan: state.plan.id,
      });
      later(function () {
        setBusy(bar.next, false);
        if (state.payFail) {
          track('payment_failed', {
            membership_plan: state.plan.id,
          });
          alert.hidden = false;
          alert.focus();
          return;
        }
        state.paid = true;
        track('payment_success', {
          membership_plan: state.plan.id,
          amount: state.plan.price,
        });
        go('s14');
      }, 1200);
    });
  })();

  /* ── сцены proof-экранов: staged reveal как ответ на переход (принцип 8), «Пропустити» — пока идёт ── */
  function runList(ol, stepMs, onDone) {
    var items = qsAll('.q-steps__item', ol);
    items.forEach(function (li) {
      li.dataset.state = 'upcoming';
      li.removeAttribute('aria-current');
      var statusEl = qs('[data-status]', li);
      if (statusEl) statusEl.hidden = true;
    });
    items.forEach(function (li, i) {
      later(function () {
        items.forEach(function (o, j) {
          if (j < i) o.dataset.state = 'done';
        });
        li.dataset.state = 'current';
        li.setAttribute('aria-current', 'step');
        var statusEl = qs('[data-status]', li);
        if (statusEl) statusEl.hidden = false;
      }, stepMs * i);
    });
    later(function () {
      if (onDone) onDone(items);
    }, stepMs * items.length);
  }
  function fmtNow() {
    var now = new Date(),
      pad2 = function (n) {
        return (n < 10 ? '0' : '') + n;
      };
    return (
      (locale.date
        ? locale.date(now)
        : pad2(now.getDate()) + '.' + pad2(now.getMonth() + 1) + '.' + now.getFullYear()) +
      ', ' +
      pad2(now.getHours()) +
      ':' +
      pad2(now.getMinutes())
    );
  }
  function stampNow(el) {
    qsAll('.appframe__date', el).forEach(function (q) {
      q.lastChild.textContent = fmtNow();
    });
  }
  var TIER_MARK =
    '<svg class="q-tier__mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="14" width="4" height="7" rx="1"/><rect x="10" y="9" width="4" height="12" rx="1"/><rect x="17" y="4" width="4" height="17" rx="1"/></svg>';
  /* картка «юрист друкує відповідь»: шапка фахівця як у застосунку, замість тексту — нескінченний індикатор набору.
     Тексти відповідей на екрані не показуються (ТЗ власника 15.10): людина бачить, що відповідь уже пишуть, а читає її в застосунку.
     --d зсуває ритм крапок, щоб три картки не блимали синхронно */
  function typingCard(answer, i) {
    return (
      '<article class="appframe__ans appframe__ans--typing' +
      (answer.hide ? ' funnel__hide-short' : '') +
      '" data-tier="' +
      answer.tier +
      '" style="--d:' +
      (i || 0) * 0.4 +
      's"><div class="appframe__band"><span class="chip chip--sm q-tier" data-tier="' +
      answer.tier +
      '">' +
      TIER_MARK +
      answer.tier.toUpperCase() +
      '</span>' +
      '<span class="q-score"><span class="q-score__value num">' +
      escapeHtml(answer.score) +
      '</span><span class="q-score__scale">/ 100</span></span></div>' +
      '<div class="appframe__who"><span class="avatar avatar--photo" aria-hidden="true"><img src="assets/people/' +
      answer.photo +
      '.jpg" alt="" width="160" height="160" loading="lazy" decoding="async" onerror="this.remove()">' +
      escapeHtml(answer.initials) +
      '</span>' +
      '<span class="appframe__meta"><span class="appframe__name">' +
      escapeHtml(answer.name) +
      '</span><span class="appframe__role">' +
      escapeHtml(answer.role) +
      '</span><span class="appframe__geo"><svg class="icon" aria-hidden="true"><use href="#i-map-pin"></use></svg>' +
      escapeHtml(answer.city) +
      '</span></span></div>' +
      '<p class="appframe__typing-line" aria-label="' +
      'Pisze odpowiedź' +
      '"><span class="appframe__typing-dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
      'Pisze odpowiedź…' +
      '</p></article>'
    );
  }
  (function () {
    var list = qs('[data-answers]');
    if (list)
      list.innerHTML = ANSWERS.map(function (a, i) {
        return typingCard(a, i);
      }).join('');
  })();
  function reveal(el, on) {
    if (el) el.classList.toggle('is-visible', on !== false);
  }
  /* горизонтальная лента карточек: точки-пагинация, активная — ближайшая к центру */
  function railDots(rail, dots) {
    var cards = [].slice.call(rail.children);
    dots.innerHTML =
      cards.length > 1
        ? cards
            .map(function (c, i) {
              return (
                '<button class="plans__dot" type="button" role="tab" aria-label="' +
                (i + 1) +
                '" data-i="' +
                i +
                '"></button>'
              );
            })
            .join('')
        : '';
    var dotEls = [].slice.call(dots.children);
    function rel(c) {
      return rail.scrollLeft + c.getBoundingClientRect().left - rail.getBoundingClientRect().left;
    }
    function current() {
      var mid = rail.scrollLeft + rail.clientWidth / 2,
        best = 0,
        d = Infinity;
      cards.forEach(function (c, i) {
        var distance = Math.abs(rel(c) + c.clientWidth / 2 - mid);
        if (distance < d) {
          d = distance;
          best = i;
        }
      });
      return best;
    }
    function mark() {
      var i = current();
      dotEls.forEach(function (x, k) {
        x.classList.toggle('is-on', k === i);
        x.setAttribute('aria-selected', k === i ? 'true' : 'false');
      });
    }
    dotEls.forEach(function (x) {
      x.addEventListener('click', function () {
        var card = cards[+x.dataset.i],
          left = rel(card) - (rail.clientWidth - card.clientWidth) / 2;
        if (rail.scrollTo && !reduce.matches)
          rail.scrollTo({
            left: left,
            behavior: 'smooth',
          });
        else rail.scrollLeft = left;
      });
    });
    if (!rail.dataset.railBound) {
      rail.dataset.railBound = '1';
      var raf = 0;
      rail.addEventListener(
        'scroll',
        function () {
          if (raf) return;
          raf = requestAnimationFrame(function () {
            raf = 0;
            if (rail._mark) rail._mark();
          });
        },
        {
          passive: true,
        },
      );
    }
    rail._mark = mark;
    rail.scrollLeft = 0;
    mark();
  }
  (function initGeo() {
    if (!geo) return;
    var land = qs('[data-geo-land]'),
      dots = qs('[data-geo-dots]');
    if (!land) return;
    land.setAttribute('d', geo.path);
    dots.innerHTML = (geo.cities || [])
      .map(function (c) {
        var point = geoXY(geo, c[0], c[1]);
        return '<circle cx="' + point[0].toFixed(1) + '" cy="' + point[1].toFixed(1) + '" r="7"/>';
      })
      .join('');
  })();
  // S1: два ряди фахівців з рейтингом під «3 500+» — 28 фото, кожен ряд подвоєний для безшовного циклу
  (function buildMarquee() {
    var host = qs('[data-marquee]');
    if (!host) return;
    // 28 реальних фахівців платформи (усі — рівень PREMIUM у каталозі consultant.net.ua, вересень 2026); бейдж показує рівень, а не вигадану оцінку
    // 28 реальних фахівців платформи з каталогу consultant.net.ua (знімок 30.09.2026): рівні PREMIUM / PRO / START упереміш, бейдж показує рівень
    var REAL = locale.marquee || [
      ['real/787', 'PREMIUM'],
      ['real/2473', 'PRO'],
      ['real/523', 'PREMIUM'],
      ['real/1361', 'START'],
      ['real/280', 'PREMIUM'],
      ['real/2486', 'PRO'],
      ['real/301', 'PREMIUM'],
      ['real/2434', 'START'],
      ['real/2258', 'PREMIUM'],
      ['real/2528', 'PRO'],
      ['real/828', 'PREMIUM'],
      ['real/2488', 'START'],
      ['real/1380', 'PREMIUM'],
      ['real/2534', 'PRO'],
      ['real/941', 'PREMIUM'],
      ['real/2705', 'START'],
      ['real/2189', 'PREMIUM'],
      ['real/2712', 'PRO'],
      ['real/1132', 'PREMIUM'],
      ['real/2792', 'START'],
      ['real/444', 'PREMIUM'],
      ['real/2714', 'PRO'],
      ['real/870', 'PREMIUM'],
      ['real/738', 'START'],
      ['real/2351', 'PREMIUM'],
      ['real/2634', 'PRO'],
      ['real/379', 'PREMIUM'],
      ['real/1606', 'PRO'],
    ];
    var STAR =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9z"/></svg>';
    function set(from, to) {
      var h = '<div class="mq__set">';
      for (var i = from; i <= to; i++)
        h +=
          '<span class="mq__tile"><img src="assets/people/' +
          REAL[i - 1][0] +
          '.jpg" alt="" width="176" height="176" decoding="async" fetchpriority="low"><span class="mq__badge" data-level="' +
          REAL[i - 1][1].toLowerCase() +
          '">' +
          STAR +
          REAL[i - 1][1] +
          '</span></span>';
      return h + '</div>';
    }
    host.innerHTML =
      '<div class="mq__tilt"><div class="mq__row mq__row--a">' +
      set(1, 14) +
      set(1, 14) +
      '</div></div>' +
      '<div class="mq__tilt"><div class="mq__row mq__row--b">' +
      set(15, 28) +
      set(15, 28) +
      '</div></div>';
  })();
  var ENTER = {
    s1: function (el) {
      var cards = qsAll('[data-s1-step]', el),
        chips = qsAll('#s1-chips .funnel__chip', el);
      cards.forEach(function (c) {
        reveal(c, false);
      });
      chips.forEach(function (c) {
        c.removeAttribute('data-state');
      });
      later(function () {
        reveal(cards[0]);
      }, 150);
      later(function () {
        reveal(cards[1]);
      }, 650);
      chips.forEach(function (c, i) {
        later(
          function () {
            c.dataset.state = 'done';
          },
          1000 + i * 320,
        );
      });
      later(doneAnimating, 1000 + chips.length * 320 + 600);
    },
    s3: function (el) {
      var settlement = state.settlement,
        title = qs('[data-s3-title]', el),
        cap = qs('[data-s3-caption]', el),
        sub = qs('[data-s3-caption-sub]', el);
      var people = qs('#s3-people'),
        note = qs('[data-s3-people-note]', el),
        media = qs('[data-s3-media]', el);
      var name = settlement ? settlement.name : 'Zdalnie',
        region = settlement ? settlement.region : 'online w całej Polsce';
      var count = settlement ? settlement.count : 1000,
        fallback = false;
      if (settlement && settlement.count != null && settlement.count < 3) {
        count = REGION_TOTAL[settlement.region] || 120;
        fallback = true;
      }
      title.textContent = name + ': dobieramy prawników…';
      cap.textContent = name;
      sub.textContent = region;
      qs('[data-s3-loadmap]', el).hidden = !settlement;
      var pin = qs('[data-geo-pin]', el),
        dots = qs('[data-geo-dots]', el),
        land = qs('[data-geo-land]', el);
      pin.style.display = 'none';
      dots.style.display = 'none';
      var lbl0 = qs('[data-geo-label]', el);
      if (lbl0) lbl0.style.display = 'none';
      if (geo && settlement && typeof settlement.lat === 'number') {
        var want = settlement.country || locale.country,
          token = (el.dataset.geoToken = String(Date.now()));
        loadGeo(want)
          .catch(function () {
            return loadGeo('world');
          })
          .then(function (g) {
            if (el.dataset.geoToken !== token) return;
            land.setAttribute('d', g.path);
            var point = geoXY(g, settlement.lat, settlement.lon),
              inside = point[0] > 0 && point[0] < 800 && point[1] > 0 && point[1] < 450;
            pin.setAttribute(
              'transform',
              'translate(' + point[0].toFixed(1) + ' ' + point[1].toFixed(1) + ')',
            );
            pin.style.display = inside ? '' : 'none';
            var label = qs('[data-geo-label]', el);
            if (label) {
              label.textContent = settlement.name;
              label.setAttribute('x', point[0].toFixed(1));
              label.setAttribute('y', (point[1] + 44).toFixed(1)); /* підпис нижче вістря піна */
              label.style.display = inside ? '' : 'none';
            }
          })
          .catch(function () {
            land.setAttribute('d', '');
          });
      } else if (geo) {
        land.setAttribute('d', geo.path);
        dots.style.display = '';
      }
      var iframe = qs('iframe', media);
      if (iframe) {
        iframe.remove();
        qs('[data-s3-svg]', el).hidden = false;
      }
      people.innerHTML = PEOPLE.map(function (p) {
        return (
          '<div class="funnel__person funnel__reveal" role="listitem">' +
          '<span class="avatar' +
          (p[5] ? ' avatar--photo' : '') +
          '" data-status="' +
          p[4] +
          '" aria-hidden="true">' +
          (p[5]
            ? '<img src="assets/people/' +
              p[5] +
              '.jpg" alt="" width="160" height="160" loading="lazy" decoding="async" onerror="this.remove()">'
            : '') +
          escapeHtml(p[3]) +
          '<span class="dot q-online' +
          (p[4] === 'offline' ? ' q-online--off' : '') +
          '"></span></span>' +
          '<span class="funnel__person-name">' +
          escapeHtml(p[0]) +
          '<br>' +
          escapeHtml(p[1]) +
          '</span>' +
          '<span class="funnel__person-role">' +
          escapeHtml(p[2]) +
          '</span></div>'
        );
      }).join('');
      note.textContent = fallback
        ? 'Prawnicy z regionu — pracują zdalnie'
        : settlement
          ? 'Pasują do Twojego zgłoszenia'
          : 'Pracują zdalnie';
      [
        qs('[data-s3-map]', el),
        qs('[data-s3-people-wrap]', el),
        note,
        qs('[data-s3-bottom]', el),
      ].forEach(function (n) {
        reveal(n, false);
      });
      qsAll('.funnel__person', people).forEach(function (n) {
        reveal(n, false);
      });
      later(function () {
        reveal(qs('[data-s3-map]', el));
      }, 400);
      later(function () {
        reveal(qs('[data-s3-people-wrap]', el));
      }, 1100);
      qsAll('.funnel__person', people).forEach(function (n, i) {
        later(
          function () {
            reveal(n);
          },
          1300 + i * 220,
        );
      });
      later(function () {
        title.textContent = settlement
          ? name + ': prawnicy są gotowi zająć się Twoją sprawą.'
          : 'Zdalnie: prawnicy z całego kraju są gotowi pomóc.';
        reveal(note);
        reveal(qs('[data-s3-bottom]', el));
        announce(title.textContent);
        doneAnimating();
      }, 2500);
    },
    s5: function (el) {
      var picked = state.categories.filter(function (c) {
        return c !== 'other';
      });
      if (!picked.length) picked = ['general'];
      picked = picked.slice().sort(function (a, b) {
        return catOf(b)[2] - catOf(a)[2];
      });
      var total = picked.reduce(function (n, id) {
        return n + caseCount(id);
      }, 0);
      qs('[data-s5-total]', el).textContent = nbsp(total);
      qs('[data-s5-total-label]', el).textContent =
        plural(total, ['sprawa', 'sprawy', 'spraw']) +
        ' na platformie' +
        (picked.length === 1 ? ' · ' + catOf(picked[0])[1] : '');
      var counts = qs('#s5-counts'),
        cases = qs('#s5-cases');
      counts.hidden = picked.length < 2;
      counts.innerHTML = picked
        .map(function (id, k) {
          var category = catOf(id);
          return (
            '<li class="cases-stat' +
            (k === 0 ? ' cases-stat--accent' : '') +
            '"><strong class="num">' +
            nbsp(caseCount(id)) +
            '</strong><span>' +
            escapeHtml(category[1]) +
            '</span></li>'
          );
        })
        .join('');
      var pool = [],
        i = 0;
      while (pool.length < 3 && i < 3) {
        picked.forEach(function (id) {
          if (pool.length < 3 && CASES[id][i]) pool.push([id, CASES[id][i]]);
        });
        i++;
      }
      cases.innerHTML = pool
        .map(function (x) {
          var category = catOf(x[0]);
          return (
            '<li class="case-row"><span class="case-row__icon" aria-hidden="true"><svg class="icon"><use href="#' +
            category[3] +
            '"></use></svg></span>' +
            '<div class="case-row__body"><p class="case-row__cat">' +
            escapeHtml(category[1]) +
            '</p><p class="case-row__text">' +
            escapeHtml(x[1][0]) +
            '</p>' +
            '<p class="case-row__result"><svg class="icon" aria-hidden="true"><use href="#i-check"></use></svg><span>' +
            escapeHtml(x[1][1]) +
            '</span></p></div></li>'
          );
        })
        .join('');
    },
    s7: function (el) {
      stampNow(el);
      var cat = CATEGORIES.filter(function (c) {
          return c[0] === state.categories[0];
        })[0],
        catName = cat ? cat[1] : '';
      qs('[data-s7-question]', el).textContent = state.title || state.description;
      qs('[data-s7-desc]', el).textContent = state.description;
      var answers = qs('#s7-answers'),
        list = qs('#s7-list'),
        items = qsAll('.q-steps__item', list),
        statusEl = qs('[data-status]', list),
        short = matchMedia('(max-height: 699px)').matches;
      var aiProfile = locale.ai || {
        name: 'Asystent Andrij',
        photo: 'ai-uk',
      };
      function step(i, state_) {
        items.forEach(function (li, k) {
          if (k < i) li.dataset.state = 'done';
        });
        if (items[i]) {
          items[i].dataset.state = state_;
          if (state_ === 'current') items[i].setAttribute('aria-current', 'step');
          else items[i].removeAttribute('aria-current');
        }
      }
      function add(html) {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        var node = wrapper.firstElementChild;
        node.classList.add('q-in');
        answers.appendChild(node);
        return node;
      }
      items.forEach(function (li) {
        li.dataset.state = 'upcoming';
        li.removeAttribute('aria-current');
      });
      if (statusEl) statusEl.hidden = true;
      answers.innerHTML = '';
      step(0, 'current');
      /* 1. питання отримано → 2. AI визначає категорію → 3. фахівці переглядають → перший бере в роботу; ~8 с, «Пропустити» доступне одразу */
      later(function () {
        step(1, 'current');
        add(
          '<div class="appframe__typing" aria-label="Asystent AI analizuje"><span class="appframe__typing-dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
            'Asystent AI analizuje pytanie…' +
            '</div>',
        );
      }, 900);
      later(function () {
        var typing = qs('.appframe__typing', answers);
        if (typing) typing.remove();
        add(
          '<article class="appframe__ans appframe__ans--ai"><div class="appframe__band"><span class="chip chip--sm q-tier" data-tier="ai">AI</span><span class="appframe__band-note">' +
            'przed chwilą' +
            '</span></div>' +
            '<div class="appframe__who"><span class="avatar avatar--photo" aria-hidden="true"><img src="assets/people/' +
            aiProfile.photo +
            '.jpg" alt="" width="160" height="160" loading="lazy" decoding="async" onerror="this.remove()">AI</span><span class="appframe__meta"><span class="appframe__name">' +
            escapeHtml(aiProfile.name) +
            '</span><span class="appframe__role">' +
            'Sztuczna inteligencja' +
            '</span></span></div>' +
            '<p class="appframe__txt">' +
            (catName ? 'Kategoria: ' + escapeHtml(catName) + '. ' : '') +
            'Szukam prawników z doświadczeniem w podobnych sprawach…' +
            '</p></article>',
        );
        step(2, 'current');
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.textContent = 'Prawnicy przeglądają pytanie…';
        }
      }, 2600);
      later(function () {
        add(
          '<div class="appframe__viewers"><span class="appframe__viewers-av" aria-hidden="true">' +
            ANSWERS.slice(0, 3)
              .map(function (a) {
                return (
                  '<img src="assets/people/' +
                  a.photo +
                  '.jpg" alt="" width="160" height="160" loading="lazy" decoding="async">'
                );
              })
              .join('') +
            '</span><span>' +
            ANSWERS.slice(0, 3).length +
            ' ' +
            'prawników przegląda Twoje pytanie' +
            '</span></div>',
        );
      }, 4400);
      later(function () {
        var viewers = qs('.appframe__viewers', answers);
        if (viewers) viewers.remove();
        if (short) {
          var aiAnswer = qs('.appframe__ans--ai', answers);
          if (aiAnswer) aiAnswer.remove();
        } /* на коротких екранах — лише остання картка */
        add(
          typingCard(ANSWERS[0], 0),
        ); /* перший фахівець уже друкує — текст відповіді не показуємо */
        step(3, 'done');
        if (statusEl) statusEl.textContent = 'Pierwszy prawnik przyjął zgłoszenie';
      }, 6200);
      later(function () {
        doneAnimating();
        go('s8');
      }, 8400);
    },
    s8: function (el) {
      stampNow(el);
      var q = qs('[data-s8-question]', el),
        d = qs('[data-s8-desc]', el);
      q.textContent = state.title || state.description;
      d.textContent = state.description;
      var list = qs('[data-answers]', el);
      list.innerHTML = typingCard(ANSWERS[0], 0); /* та сама картка, що друкувала на S7 */
      ANSWERS.slice(1).forEach(function (a, k) {
        later(
          function () {
            var wrapper = document.createElement('div');
            wrapper.innerHTML = typingCard(a, k + 1);
            var node = wrapper.firstElementChild;
            node.classList.add('q-in');
            list.appendChild(node);
          },
          1100 + k * 1300,
        );
      }); /* ще двоє приєднуються — видно живий процес */
    },
    s11: function () {
      if (PLANS_ENTER) PLANS_ENTER();
    },
    s12: function () {
      track('membership_offer_result', {
        membership_choice: state.branch,
      });
    },
    s13: function (el) {
      var plan = state.plan ||
        (locale.plans && locale.plans[1]) || {
          id: 'pro',
          name: 'PRO',
          price: 410,
          discount: 10,
        };
      var full =
        (locale.plans || []).filter(function (x) {
          return x.id === plan.id;
        })[0] || {};
      var yearly = plan.period === 'year',
        fee = plan.price,
        next = new Date();
      if (yearly) next.setFullYear(next.getFullYear() + 1);
      else next.setMonth(next.getMonth() + 1);
      qs('[data-s13-plan]', el).textContent = plan.name;
      qs('[data-s13-chip]', el).setAttribute('data-tier', plan.id || 'pro');
      qs('[data-s13-total]', el).textContent = money(fee);
      qs('[data-s13-period]', el).textContent = yearly ? '/ 1 rok' : '/ 1 miesiąc';
      qs('[data-s13-disc]', el).textContent = '−' + plan.discount + ' %';
      var save = qs('[data-s13-save]', el);
      save.parentNode.hidden = !(full.savings && full.savings.total);
      if (full.savings && full.savings.total) save.textContent = full.savings.total;
      qs('[data-s13-period2]', el).textContent = yearly ? '1 rok' : '1 miesiąc';
      qs('[data-s13-plan2]', el).textContent = plan.name;
      qs('[data-s13-price2]', el).textContent = money(fee);
      qs('[data-s13-cadence]', el).textContent = yearly ? 'co roku' : 'co miesiąc';
      qs('#s13-error').hidden = !state.payFail;
      track('checkout_view', {
        membership_plan: plan.id || 'standard',
      });
    },
    s14: function (el) {
      qs('[data-s14-plan]', el).textContent = state.plan ? state.plan.name : 'PRO';
    },
    s15: function (el) {
      var from = qs('[data-s15-from]', el);
      if (from && locale.plans && locale.plans[0]) from.textContent = money(locale.plans[0].price);
      track('membership_offer_view');
    },
    s16: function () {
      track('quiz_result_view', {
        membership_status: state.paid ? 'paid' : 'none',
      });
    },
  };

  /* S3 · карта провайдера — только по клику (EXC-004, 08-visual §8.6.2) */
  qs('[data-s3-loadmap]').addEventListener('click', function () {
    var settlement = state.settlement;
    if (!settlement) return;
    var media = qs('[data-s3-media]'),
      svg = qs('[data-s3-svg]');
    var frame = document.createElement('iframe');
    frame.src =
      'https://www.google.com/maps?q=' +
      encodeURIComponent(
        settlement.name +
          ', ' +
          settlement.region +
          (settlement.country === locale.country ? ', ' + 'Polska' : ''),
      ) +
      '&z=12&output=embed';
    frame.title = 'Mapa: ' + settlement.name + ', ' + settlement.region;
    frame.loading = 'lazy';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    svg.hidden = true;
    media.insertBefore(frame, media.firstChild);
    this.hidden = true;
    track('map_loaded', {
      settlement: settlement.name,
    });
  });

  /* ── старт: всегда с первого экрана, если состояние не подтверждает шаг ── */
  var start = targetFromHash();
  if (!allowed(start)) {
    start = 's0';
    if (location.hash && location.hash !== '#s0') history.replaceState(null, '', '#s0');
  }
  render(start, 'forward', true);
})();
