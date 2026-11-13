/* ═══════════════════════════════════════════════════════════════════════════
   ДИНАМИЧЕСКИЙ КВИЗ «Підбір юриста» (голосовое ТЗ 18.09.2026; ADR-040; оболочка — ADR-039)
   · маршрут строится по ответам: FLOW[id].next(answers) — «питання підставляється під відповідь»
   · «Ні» и «×» → экран возражений (exit) → bye; «Не впевнений(-на)» → своя ветка (worry)
   · назад — по следу (trail); из резюме можно вернуться к любому шагу и продолжить с того же места
   · экран = #id в URL (аналитика по шагам) · состояние — только в памяти: повторный вход — сначала
   · UTM / источник — с первого экрана до лида · события — dataLayer + CustomEvent «ds:quiz», quiz_id: dynamic
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.getElementById('funnel');
  if (!root) return;
  var locale = window.QUIZ_LOCALE || {};
  var APP_URL = 'https://consultantlm.com/app?src=quiz-dynamic';
  function stepText(n, m) {
    return locale.step ? locale.step(n, m) : 'Step ' + n + ' of ' + m;
  }

  /* ── данные-заглушки (фикстуры 11-datamodel.md §11; в продукте — база сайта) ── */
  var CATEGORIES = [
    ['family', 'Family', 'i-family'],
    ['military', 'Military', 'i-shield-alert'],
    ['auto', 'Auto & accidents', 'i-car'],
    ['business', 'Business', 'i-briefcase'],
    ['criminal', 'Criminal', 'i-scale'],
    ['debt', 'Debts & loans', 'i-coins'],
    ['property', 'Real estate & inheritance', 'i-home'],
    ['labor', 'Employment', 'i-users'],
    ['migration', 'Immigration', 'i-globe'],
    ['other', 'Other', 'i-dots'],
  ];
  var TOPICS = {
    family: [
      ['divorce', 'Divorce'],
      ['alimony', 'Child support'],
      ['property', 'Property division'],
      ['custody', 'Child custody'],
      ['other', 'Other family matters'],
    ],
    military: [
      ['summons', 'Draft notice or mobilization'],
      ['fine', 'Draft office fine'],
      ['deferment', 'Deferment or exemption'],
      ['payments', 'Military payments'],
      ['other', 'Other military matters'],
    ],
    auto: [
      ['accident', 'Car accident'],
      ['license', 'License suspension'],
      ['insurance', 'The insurer won’t pay'],
      ['fine', 'A fine or a ticket'],
      ['other', 'Other auto matters'],
    ],
    business: [
      ['contract', 'Contract or counterparty'],
      ['registration', 'Company registration or changes'],
      ['tax', 'Tax audit'],
      ['dispute', 'Dispute with a partner'],
      ['other', 'Other business matters'],
    ],
    criminal: [
      ['suspect', 'Suspicion or charges'],
      ['search', 'Search or detention'],
      ['victim', 'I am the victim'],
      ['witness', 'Called as a witness'],
      ['other', 'Other criminal matters'],
    ],
    debt: [
      ['collectors', 'Collectors or payday lenders'],
      ['bank', 'Bank loan'],
      ['enforcement', 'Enforcement proceedings'],
      ['owed', 'I am owed money'],
      ['other', 'Other debt matters'],
    ],
    property: [
      ['inheritance', 'Inheritance'],
      ['deal', 'Buying or selling'],
      ['rent', 'Rental'],
      ['neighbors', 'Neighbors or HOA'],
      ['other', 'Other real estate matters'],
    ],
    labor: [
      ['dismissal', 'Dismissal'],
      ['salary', 'Unpaid wages'],
      ['contract', 'Employment contract'],
      ['injury', 'Injury at work'],
      ['other', 'Other employment matters'],
    ],
    migration: [
      ['residence', 'Residence permit'],
      ['citizenship', 'Citizenship'],
      ['visa', 'Visas and travel'],
      ['deportation', 'Deportation risk'],
      ['other', 'Other immigration matters'],
    ],
  };
  /* прізвище, ім’я, професія, ініціали, статус, місто, рівень, бал «зі 100», напрями — лише дозволені поля (11-datamodel §2) */
  var PEOPLE = locale.dqPeople || [
    [
      'Oleksandr',
      'Studentsov',
      'Lawyer',
      'OS',
      'online',
      'Kyiv',
      'PREMIUM',
      '76,37',
      ['family', 'property', 'debt'],
      'st',
    ],
    [
      'Oleh',
      'Molchanov',
      'Attorney',
      'OM',
      'online',
      'Kyiv',
      'PREMIUM',
      '42,28',
      ['criminal', 'military', 'auto'],
      'mo',
    ],
    [
      'Violeta',
      'Podlinieva',
      'Lawyer',
      'VP',
      'online',
      'Kyiv',
      'PREMIUM',
      '42,37',
      ['labor', 'business', 'family'],
      'po',
    ],
    [
      'Mykola',
      'Hrytsai',
      'Lawyer',
      'MH',
      'offline',
      'Kyiv',
      'PREMIUM',
      '68,14',
      ['migration', 'property', 'business'],
      'hr',
    ],
    [
      'Valeriia',
      'Odyntsova',
      'Lawyer',
      'VO',
      'online',
      'Kyiv',
      'PREMIUM',
      '55,05',
      ['debt', 'auto', 'labor'],
      'od',
    ],
    [
      'Mariia',
      'Borevych',
      'Lawyer',
      'MB',
      'online',
      'Kyiv',
      'PREMIUM',
      '54,01',
      ['military', 'criminal', 'migration'],
      'bo',
    ],
  ];

  /* ── FLOW: экраны и переходы. kind: single (радио-карточки), text, form, info, exit, end.
        static — разметка в HTML; остальные генерируются. next — id или функция от ответов. ── */
  var FLOW = {
    start: {
      kind: 'single',
      static: true,
      name: 'need',
      /* разметка в HTML: единственный заголовок первого уровня */
      next: function (answers) {
        return answers.start === 'no' ? 'exit' : answers.start === 'unsure' ? 'worry' : 'category';
      },
      bar: {
        label: 'Next',
        event: 'quiz_start',
        back: false,
        note: 'Free · 1–2 minutes · No obligation',
      },
    },
    worry: {
      kind: 'single',
      name: 'worry',
      title: 'What is worrying you?',
      hint: 'Pick the closest option — a lawyer will tell you whether you need help. It’s free.',
      options: [
        [
          'document',
          'I received a document or a letter',
          'A summons, a claim, a demand letter, an order',
          'i-file',
        ],
        [
          'conflict',
          'A conflict that won’t resolve',
          'Employer, bank, neighbors, partner',
          'i-users',
        ],
        [
          'plan',
          'I am planning an important step',
          'A deal, inheritance, business, relocation',
          'i-briefcase',
        ],
        [
          'rights',
          'I want to understand my rights',
          'Just to make sense of the situation',
          'i-book',
        ],
      ],
      next: 'category',
    },
    category: {
      kind: 'single',
      name: 'category',
      grid: true,
      title: 'What do you need help with?',
      hint: 'Pick an area — the next question adapts to it.',
      options: CATEGORIES.map(function (c) {
        return [c[0], c[1], '', c[2]];
      }),
      next: function (answers) {
        return answers.category === 'other' ? 'describe' : 'topic';
      },
    },
    topic: {
      kind: 'single',
      name: 'topic',
      title: 'Tell us more.',
      hintOf: function (a) {
        return catName(a.category) + ': pick the closest option.';
      },
      optionsOf: function (a) {
        return (TOPICS[a.category] || []).map(function (t) {
          return [t[0], t[1], '', null];
        });
      },
      next: function (answers) {
        return answers.topic === 'other' ? 'describe' : 'stage';
      },
    },
    describe: {
      kind: 'text',
      name: 'describe',
      static: true,
      next: 'stage',
    },
    stage: {
      kind: 'single',
      name: 'stage',
      title: 'What stage is the matter at?',
      hint: 'This determines which attorney and format of work will fit.',
      options: [
        ['thinking', 'Just thinking about it', 'I want to prepare in advance', 'i-eye'],
        [
          'documents',
          'I have documents or letters',
          'A contract, a demand letter, a summons, an order',
          'i-file',
        ],
        [
          'court',
          'The case is already in court',
          'There is a claim, a hearing or a ruling',
          'i-scale',
        ],
        [
          'decision',
          'There is a decision — I need to act',
          'Appeal, enforcement, recovery',
          'i-shield',
        ],
      ],
      next: 'urgency',
    },
    urgency: {
      kind: 'single',
      name: 'urgency',
      title: 'How urgently do you need help?',
      hint: 'For urgent requests we show attorneys who are online now.',
      options: [
        ['today', 'Today', 'There is a deadline or an event in the next few hours', 'i-bolt'],
        ['week', 'This week', 'I want to resolve it in the next few days', 'i-clock'],
        ['month', 'Within a month', 'There is time, but the matter is important', 'i-calendar'],
        ['later', 'Still gathering information', 'No specific deadline', 'i-book'],
      ],
      next: 'price',
    },
    price: {
      kind: 'single',
      name: 'price',
      static: true,
      next: 'channel',
      bar: {
        label: 'Next',
        note: 'The first consultation is free',
      },
    },
    channel: {
      kind: 'single',
      name: 'channel',
      title: 'How would you like to be contacted?',
      hint: 'The attorney will only write or call the way you choose.',
      hintShort: true,
      options: [
        ['call', 'Phone call', 'We call back at a convenient time', 'i-phone-call'],
        ['telegram', 'Telegram', 'We message your number', 'i-message'],
        ['viber', 'Viber', 'We message your number', 'i-message'],
        ['whatsapp', 'WhatsApp', 'We message your number', 'i-message'],
        ['email', 'E-mail', 'We email you the matches', 'i-mail'],
      ],
      next: function (answers) {
        return answers.channel === 'call' && answers.urgency !== 'today' ? 'calltime' : 'match';
      },
    },
    calltime: {
      kind: 'single',
      name: 'calltime',
      title: 'When is a good time for a call?',
      hint: 'We only call within the chosen window.',
      options: [
        ['asap', 'As soon as possible', 'During working hours, 9 AM–8 PM', 'i-bolt'],
        ['evening', 'Today after 6 PM', 'Until 8 PM', 'i-clock'],
        ['tomorrow', 'Tomorrow morning', '9:00–12:00', 'i-calendar'],
        ['any', 'Any time during working hours', 'I’ll decide when they call', 'i-check'],
      ],
      next: 'match',
    },
    match: {
      kind: 'info',
      static: true,
      next: 'contacts',
      bar: {
        label: 'Get the matches',
        short: 'Get them',
      },
    },
    contacts: {
      kind: 'form',
      static: true,
      name: 'contacts',
      next: 'thanks',
      bar: {
        label: 'Send the request',
        short: 'Send',
        event: 'quiz_contact_submit',
      },
    },
    thanks: {
      kind: 'end',
      static: true,
      bar: {
        link: true,
        back: false,
        alt: {
          label: 'Take the quiz again',
          nav: 'restart',
        },
        note: 'The App Store or Google Play opens depending on your device. Sign in with the number you provided.',
      },
    },
    exit: {
      kind: 'exit',
      static: true,
      bar: {
        label: 'Back to the quiz',
        short: 'Back',
        alt: {
          label: 'Yes, leave',
          nav: 'leave',
        },
      },
    },
    bye: {
      kind: 'end',
      static: true,
      bar: {
        link: {
          href: '/',
          label: 'Home',
        },
        back: false,
        alt: {
          label: 'Start the quiz over',
          nav: 'restart',
        },
      },
    },
  };
  var QUESTION = {
    single: true,
    text: true,
    form: true,
  };
  var state = {
    answers: {},
    labels: {},
    trail: [],
    editing: false,
    exitFrom: null,
    lead: null,
    attribution: {},
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
  var live = qs('#funnel-live'),
    exitBtn = qs('#funnel-exit');
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
  function catName(id) {
    var category = CATEGORIES.filter(function (x) {
      return x[0] === id;
    })[0];
    return category ? category[1] : 'Your situation';
  }
  function track(eventName, extra) {
    var payload = {
      event: eventName,
      quiz_id: 'dynamic',
      quiz_branch: state.answers.start || 'yes',
      quiz_lead: state.lead ? state.lead.lead_id : null,
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
  function showError(box, err, on, focusEl) {
    if (box) box.setAttribute('data-invalid', on ? 'true' : 'false');
    if (err) err.hidden = !on;
    if (on && focusEl) focusEl.focus();
  }

  /* атрибуция — с первого экрана до лида */
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

  /* ── генерация экранов-вопросов из FLOW ── */
  function optionHTML(name, option, grid) {
    var icon = '',
      note = '';
    if (option[3] && grid)
      icon =
        '<svg class="funnel__tile-icon" aria-hidden="true"><use href="#' +
        option[3] +
        '"></use></svg>';
    else if (option[3])
      icon =
        '<span class="q-option__icon" aria-hidden="true"><svg class="icon"><use href="#' +
        option[3] +
        '"></use></svg></span>';
    if (option[2] && !grid)
      note = '<span class="q-option__note">' + escapeHtml(option[2]) + '</span>';
    return (
      '<label class="q-option">' +
      '<input class="q-option__input" type="radio" name="' +
      escapeHtml(name) +
      '" value="' +
      escapeHtml(option[0]) +
      '" data-label="' +
      escapeHtml(option[1]) +
      '">' +
      (grid ? '' : icon) +
      '<span class="q-option__label">' +
      (grid ? icon : '') +
      escapeHtml(option[1]) +
      note +
      '</span></label>'
    );
  }
  function optionsHTML(flow, a) {
    var opts = flow.optionsOf ? flow.optionsOf(a) : flow.options;
    return opts
      .map(function (o) {
        return optionHTML(flow.name, o, flow.grid);
      })
      .join('');
  }
  function screenHTML(id, flow) {
    var headingTag = flow.h1 ? 'h1' : 'h2',
      titleId = flow.h1 ? 'quiz-title' : id + '-title';
    return (
      '<form class="funnel__screen" id="' +
      id +
      '" data-screen="' +
      id +
      '" aria-labelledby="' +
      titleId +
      '" novalidate hidden>' +
      '<div class="funnel__head">' +
      '<' +
      headingTag +
      ' class="funnel__title' +
      (flow.h1 ? ' funnel__title--hero' : '') +
      '" id="' +
      titleId +
      '" tabindex="-1">' +
      escapeHtml(flow.title) +
      '</' +
      headingTag +
      '>' +
      '<p class="funnel__hint funnel__hint--sm' +
      (flow.hintShort ? ' funnel__hide-short' : '') +
      '" data-hint>' +
      escapeHtml(flow.hint || '') +
      '</p>' +
      '</div>' +
      '<fieldset class="funnel__options' +
      (flow.grid ? ' funnel__options--grid' : '') +
      '" id="' +
      id +
      '-options" aria-describedby="' +
      id +
      '-err">' +
      '<legend class="sr-only">Pick one option</legend>' +
      (flow.optionsOf ? '' : optionsHTML(flow, state.answers)) +
      '</fieldset>' +
      '<p class="funnel__error" id="' +
      id +
      '-err" role="alert" hidden>Pick one option to continue</p>' +
      '</form>'
    );
  }
  (function () {
    var html = '';
    for (var id in FLOW)
      if (FLOW[id].kind === 'single' && !FLOW[id].static) html += screenHTML(id, FLOW[id]);
    qs('#exit').insertAdjacentHTML('beforebegin', html); /* после статичного start */
  })();
  var topicKey = null;
  function fillOptions(el, f) {
    var key = state.answers.category || '';
    if (topicKey === key) return;
    var fieldset = qs('fieldset', el);
    qsAll('label', fieldset).forEach(function (l) {
      l.remove();
    });
    fieldset.insertAdjacentHTML('beforeend', optionsHTML(f, state.answers));
    topicKey = key;
    var answer = state.answers[el.dataset.screen];
    if (answer) {
      var r = qs('input[value="' + answer + '"]', fieldset);
      if (r) r.checked = true;
    }
  }

  /* ── маршрут по ответам; неотвеченному — ветка по умолчанию («так», без уточнений) ── */
  function nextOf(id, a) {
    var nextId = FLOW[id].next;
    return typeof nextId === 'function' ? nextId(a) : nextId;
  }
  function route(a) {
    var ids = [],
      id = 'start',
      guard = 0;
    while (id && FLOW[id] && guard++ < 24) {
      ids.push(id);
      if (id === 'exit' || id === 'bye' || id === 'thanks') break;
      id = nextOf(id, a);
    }
    return ids;
  }
  function answered(id) {
    var flow = FLOW[id];
    if (flow.kind === 'single') return state.answers[id] != null;
    if (flow.kind === 'text') return state.answers.describe != null;
    return false;
  }
  function stepsOf(a) {
    return route(a).filter(function (id) {
      return QUESTION[FLOW[id].kind];
    });
  }

  /* ── доступность экрана по состоянию (повторный вход — сначала) ── */
  function allowed(id) {
    if (!FLOW[id]) return false;
    if (id === 'start' || id === 'exit' || id === 'bye') return true;
    if (id === 'thanks') return !!state.lead;
    if (state.trail.indexOf(id) !== -1) return true;
    var path = route(state.answers),
      i = path.indexOf(id);
    if (i === -1) return false;
    for (var k = 0; k < i; k++) {
      var stepId = path[k];
      if (QUESTION[FLOW[stepId].kind] && stepId !== 'contacts' && !answered(stepId)) return false;
    }
    return true;
  }

  /* ── прогресс в верхней панели: доля маршрута, «Крок N із M» пересчитывается по ответам ── */
  var progress = qs('#funnel-progress'),
    bars = qs('#funnel-bars'),
    where = qs('#funnel-where');
  function updateProgress(id) {
    var isQ = QUESTION[FLOW[id].kind] && id !== 'exit';
    progress.hidden = !isQ;
    where.hidden = !isQ;
    if (!isQ) return;
    var steps = stepsOf(state.answers),
      stepNum = steps.indexOf(id) + 1,
      stepTotal = steps.length;
    if (stepNum < 1) {
      stepNum = Math.min(state.trail.length + 1, stepTotal);
    }
    var pct = Math.round((stepNum / stepTotal) * 100);
    bars.style.setProperty('--progress-value', String(stepNum / stepTotal));
    bars.setAttribute('aria-valuenow', String(pct));
    bars.setAttribute('aria-valuetext', stepText(stepNum, stepTotal));
    where.textContent = stepText(stepNum, stepTotal);
    return [stepNum, stepTotal];
  }

  /* ── нижняя панель действий ── */
  function renderBar(id) {
    var flow = FLOW[id],
      barConfig = flow.bar || {};
    var isForm = QUESTION[flow.kind] || flow.kind === 'exit';
    bar.back.hidden = barConfig.back === false;
    bar.skip.hidden = true;
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
      if (typeof barConfig.link === 'object') {
        bar.link.href = barConfig.link.href;
        bar.link.textContent = barConfig.link.label;
        bar.link.removeAttribute('rel');
      } else {
        bar.link.href = APP_URL;
        bar.link.textContent = 'Open the app';
        bar.link.rel = 'noopener';
      }
      return;
    }
    bar.link.hidden = true;
    bar.next.hidden = false;
    var label = barConfig.label || 'Next',
      short = barConfig.short || '';
    if (id === 'describe') label = 'Next';
    bar.full.textContent = label;
    bar.short.textContent = short;
    bar.next.dataset.hasShort = short ? 'true' : 'false';
    if (isForm) {
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
      barConfig.event || (isForm ? 'quiz_step_complete' : 'quiz_step_view'),
    );
    setBusy(bar.next, false);
  }

  /* ── показ экрана ── */
  var current = null;
  function render(id, dir, initial) {
    clearTimers();
    var flow = FLOW[id];
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
    root.dataset.branch = state.answers.start || 'yes';
    document.body.classList.toggle('is-dark', id === 'thanks');
    if (flow.optionsOf) fillOptions(el, flow);
    if (flow.hintOf) qs('[data-hint]', el).textContent = flow.hintOf(state.answers);
    var nm = updateProgress(id);
    renderBar(id);
    if (exitBtn) exitBtn.hidden = id === 'exit' || id === 'bye' || id === 'thanks';
    if (ENTER[id]) ENTER[id](el, dir);
    window.scrollTo(0, 0);
    var title = qs('.funnel__title', el);
    if (!initial)
      setTimeout(function () {
        (modality === 'keyboard' && title ? title : qs('#main')).focus({
          preventScroll: true,
        });
      }, 60);
    announce((nm ? stepText(nm[0], nm[1]) + '. ' : '') + (title ? title.textContent.trim() : ''));
    if (current !== id) {
      track('quiz_step_view', {
        quiz_step: id,
        quiz_step_index: nm ? nm[0] : null,
        quiz_step_total: nm ? nm[1] : null,
      });
      if (state.trail[state.trail.length - 1] !== id) state.trail.push(id);
    }
    current = id;
  }
  function targetFromHash() {
    var hash = (location.hash || '#start').replace('#', '');
    return FLOW[hash] ? hash : 'start';
  }
  var pendingDir = 'forward';
  function go(id, dir) {
    dir = dir || (state.trail.indexOf(id) !== -1 && id !== current ? 'back' : 'forward');
    if (dir === 'back') {
      var i = state.trail.indexOf(id);
      if (i !== -1) state.trail.length = i;
    }
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
      history.replaceState(null, '', '#start');
      id = 'start';
    }
    var dir = pendingDir || 'forward';
    pendingDir = null;
    render(id, dir);
  });

  /* ── ответы: запись, инвалидация зависимых, переход по маршруту ── */
  function setAnswer(id, value, label) {
    var answers = state.answers,
      prev = answers[id];
    answers[id] = value;
    state.labels[id] = label;
    if (id === 'start' && value !== 'unsure') {
      delete answers.worry;
      delete state.labels.worry;
    }
    if (id === 'category' && prev !== value) {
      delete answers.topic;
      delete state.labels.topic;
      if (value !== 'other' && prev === 'other') {
        delete answers.describe;
      }
    }
    if (id === 'topic' && prev !== value && prev === 'other') {
      delete answers.describe;
    }
    if (id === 'channel' && value !== 'call') {
      delete answers.calltime;
      delete state.labels.calltime;
    }
    if (id === 'urgency' && value === 'today') {
      delete answers.calltime;
      delete state.labels.calltime;
    }
  }
  function advance(from) {
    var next = nextOf(from, state.answers);
    if (next === 'exit') {
      state.exitFrom = from;
      track('quiz_exit_intent', {
        quiz_step: from,
        reason: 'answer_no',
      });
      go('exit');
      return;
    }
    if (state.editing) {
      var guard = 0;
      while (
        next &&
        FLOW[next] &&
        QUESTION[FLOW[next].kind] &&
        next !== 'contacts' &&
        answered(next) &&
        guard++ < 12
      )
        next = nextOf(next, state.answers);
      if (!next || next === 'match' || next === 'contacts' || !QUESTION[FLOW[next].kind]) {
        state.editing = false;
        next = 'match';
      }
    }
    go(next);
  }
  function resetAll() {
    state.answers = {};
    state.labels = {};
    state.trail = [];
    state.editing = false;
    state.exitFrom = null;
    state.lead = null;
    qsAll('form', root).forEach(function (f) {
      f.reset();
    });
    qsAll('[data-invalid]', root).forEach(function (n) {
      n.removeAttribute('data-invalid');
    });
    qsAll('.funnel__error, .q-error', root).forEach(function (n) {
      n.hidden = true;
    });
    qs('#exit-reply').hidden = true;
    topicKey = null;
    track('quiz_restart');
  }

  /* ── отправка форм-экранов ── */
  root.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form.classList.contains('funnel__screen')) return;
    event.preventDefault();
    var id = form.dataset.screen,
      flow = FLOW[id];
    if (flow.kind === 'single') {
      var fieldset = qs('fieldset', form),
        err = qs('.funnel__error', form),
        checked = qs('input:checked', fieldset);
      if (!checked) {
        showError(fieldset, err, true, qs('input', fieldset));
        announce(err.textContent.trim());
        return;
      }
      showError(fieldset, err, false);
      setAnswer(id, checked.value, checked.dataset.label || checked.value);
      var extra = {
        quiz_step: id,
      };
      extra['quiz_' + flow.name] = checked.value;
      track('quiz_step_complete', extra);
      if (id === 'start' && checked.value !== 'no')
        track('quiz_start', {
          quiz_need: checked.value,
        });
      advance(id);
      return;
    }
    if (flow.kind === 'text') {
      var text = qs('#story').value.trim();
      setAnswer('describe', text, text ? text : 'No description');
      track('quiz_step_complete', {
        quiz_step: id,
        has_text: !!text,
        text_length: text.length,
      });
      advance(id);
      return;
    }
    if (flow.kind === 'exit') {
      stay();
      return;
    }
    if (id === 'contacts') {
      submitContacts(form);
    }
  });
  root.addEventListener('change', function (event) {
    var fieldset = event.target.closest('fieldset.funnel__options');
    if (fieldset) {
      var form = fieldset.closest('form');
      showError(fieldset, qs('.funnel__error', form), false);
    }
  });

  /* ── навигация панели и резюме ── */
  function stay() {
    track('quiz_exit_stay', {
      objection: state.answers.objection || null,
    });
    var target = state.exitFrom || 'start';
    if (target === 'start' && state.answers.start === 'no') {
      delete state.answers.start;
      delete state.labels.start;
      var checked = qs('#start input:checked');
      if (checked) checked.checked = false;
    }
    state.exitFrom = null;
    go(target, 'back');
  }
  document.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-nav], [data-goto]');
    if (!btn || !root.contains(btn)) return;
    if (btn.dataset.goto) {
      event.preventDefault();
      state.editing = true;
      track('quiz_edit', {
        quiz_step: btn.dataset.goto,
      });
      go(btn.dataset.goto, 'back');
      return;
    }
    var nav = btn.dataset.nav;
    event.preventDefault();
    if (nav === 'back') {
      if (current === 'exit') {
        stay();
        return;
      }
      if (state.trail.length > 1) {
        state.trail.pop();
        go(state.trail[state.trail.length - 1], 'back');
      } else go('start', 'back');
    } else if (nav === 'next') {
      go(nextOf(current, state.answers));
    } else if (nav === 'exit') {
      if (current === 'exit') return;
      state.exitFrom = current;
      track('quiz_exit_intent', {
        quiz_step: current,
        reason: 'close',
      });
      go('exit');
    } else if (nav === 'leave') {
      track('quiz_exit_leave', {
        objection: state.answers.objection || null,
      });
      go('bye');
    } else if (nav === 'restart') {
      resetAll();
      go('start', 'back');
    }
  });

  /* exit · возражение → ответ */
  (function () {
    var fs = qs('#exit-options'),
      reply = qs('#exit-reply'),
      text = qs('[data-exit-reply]');
    fs.addEventListener('change', function (event) {
      var target = event.target;
      state.answers.objection = target.value;
      text.textContent = target.dataset.reply;
      reply.hidden = false;
      track('quiz_objection', {
        objection: target.value,
      });
    });
  })();

  /* describe · счётчик */
  (function () {
    var storyField = qs('#story'),
      count = qs('.q-textarea__count-num', qs('#describe'));
    storyField.addEventListener('input', function () {
      count.textContent = String(storyField.value.length);
    });
  })();

  /* contacts · валидация и лид */
  var phone = qs('#phone'),
    phoneBox = qs('#phone-box'),
    perr = qs('#phone-err');
  var email = qs('#email'),
    emailField = qs('#email-field'),
    eerr = qs('#email-err'),
    consent = qs('#consent'),
    cerr = qs('#consent-err');
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
      setTimeout(
        phoneSync,
        0,
      ); /* без синтетичного input: його перехоплює jquery.mask і падає на зміні маски */
  });
  consent.addEventListener('change', function () {
    if (consent.checked) cerr.hidden = true;
  });
  function submitContacts(form) {
    var digits = phone.value.replace(/\D/g, ''),
      ok = true,
      first = null,
      needEmail = state.answers.channel === 'email';
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
    if (needEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
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
      announce('Check the form fields');
      return;
    }
    var answers = state.answers;
    setBusy(bar.next, true);
    later(function () {
      var id = '2026-' + String(Math.floor(10000 + Math.random() * 89999));
      state.lead = {
        lead_id: id,
        quiz_id: 'dynamic',
        phone: phoneState().e164,
        phone_country: phoneState().country,
        name: qs('#name').value.trim() || null,
        email: needEmail ? email.value.trim() : null,
        need: answers.start,
        worry: answers.worry || null,
        practice_area: answers.category,
        topic: answers.topic || null,
        case_description: answers.describe || null,
        stage: answers.stage,
        urgency: answers.urgency,
        price_range: answers.price,
        preferred_channel: answers.channel,
        call_time: answers.calltime || null,
        matched: matched().map(function (p) {
          return p[0] + ' ' + p[1];
        }),
        attribution: state.attribution,
        created_at: new Date().toISOString(),
      };
      try {
        console.info('[quiz-dynamic] lead created', state.lead);
      } catch (err) {}
      track('quiz_contact_submit', {
        quiz_step: 'contacts',
        preferred_channel: answers.channel,
        price_range: answers.price,
        urgency: answers.urgency,
      });
      setBusy(bar.next, false);
      go('thanks');
    }, 900);
  }

  /* ── подбор фахівців по ответам ── */
  function matched() {
    var answers = state.answers,
      cat = answers.category;
    var pool = PEOPLE.filter(function (p) {
      return p[8].indexOf(cat) !== -1;
    });
    if (answers.urgency === 'today')
      pool = pool
        .filter(function (p) {
          return p[4] === 'online';
        })
        .concat(
          pool.filter(function (p) {
            return p[4] !== 'online';
          }),
        );
    PEOPLE.forEach(function (p) {
      if (pool.indexOf(p) === -1) pool.push(p);
    });
    return pool.slice(0, 3);
  }
  var CHANNEL_TEXT = {
    call: ['Will call', 'will call you', 'The attorney will call this number.'],
    telegram: [
      'Will message on Telegram',
      'will message you on Telegram',
      'The attorney will message you on Telegram at this number.',
    ],
    viber: [
      'Will message on Viber',
      'will message you on Viber',
      'The attorney will message you on Viber at this number.',
    ],
    whatsapp: [
      'Will message on WhatsApp',
      'will message you on WhatsApp',
      'The attorney will message you on WhatsApp at this number.',
    ],
    email: [
      'Will send by email',
      'will send the answer by email',
      'The matches and the answer arrive by email. The number is needed to sign in to the app.',
    ],
  };
  var WHEN = {
    asap: 'during working hours, 9 AM–8 PM, as soon as possible',
    evening: 'today after 6 PM',
    tomorrow: 'tomorrow between 9 AM and 12 PM',
    any: 'any time during working hours',
  };
  var ENTER = {
    match: function (el) {
      var answers = state.answers,
        labels = state.labels,
        rows = [];
      if (answers.worry) rows.push(['Concern', labels.worry, 'worry']);
      rows.push(['Area', labels.category, 'category']);
      if (answers.topic) rows.push(['Situation', labels.topic, 'topic']);
      if (answers.describe != null)
        rows.push([
          'Description',
          answers.describe
            ? answers.describe.length > 48
              ? answers.describe.slice(0, 48) + '…'
              : answers.describe
            : 'No description',
          'describe',
        ]);
      rows.push(
        ['Stage', labels.stage, 'stage'],
        ['Urgency', labels.urgency, 'urgency'],
        ['Price', labels.price, 'price'],
        ['Contact', labels.channel + (labels.calltime ? ' · ' + labels.calltime : ''), 'channel'],
      );
      qs('#match-summary').innerHTML = rows
        .map(function (r) {
          return (
            '<button class="chip dq__chip" type="button" role="listitem" data-goto="' +
            r[2] +
            '" aria-label="' +
            escapeHtml(r[0]) +
            ': ' +
            escapeHtml(r[1] || '—') +
            '. Change">' +
            '<span class="q-chip__label">' +
            escapeHtml(r[1] || '—') +
            '</span><svg class="icon" aria-hidden="true"><use href="#i-pen"></use></svg></button>'
          );
        })
        .join('');
      var people = matched();
      qs('#match-people').innerHTML = people
        .map(function (p, i) {
          return (
            '<div class="dq__person' +
            (i === 2 ? ' funnel__hide-short' : '') +
            '" role="listitem">' +
            '<span class="avatar' +
            (p[9] ? ' avatar--photo' : '') +
            '" data-status="' +
            p[4] +
            '" aria-hidden="true">' +
            (p[9]
              ? '<img src="assets/people/' +
                p[9] +
                '.jpg" alt="" width="160" height="160" loading="lazy" decoding="async" onerror="this.remove()">'
              : '') +
            escapeHtml(p[3]) +
            '<span class="dot q-online' +
            (p[4] === 'offline' ? ' q-online--off' : '') +
            '"></span></span>' +
            '<span><span class="dq__person-name">' +
            escapeHtml(p[0]) +
            ' ' +
            escapeHtml(p[1]) +
            '</span>' +
            '<span class="dq__person-meta">' +
            escapeHtml(p[2]) +
            ' · ' +
            escapeHtml(p[5]) +
            ' · ' +
            escapeHtml(p[6]) +
            (p[4] === 'online' ? ' · online' : '') +
            '</span></span>' +
            '<span class="q-score" aria-label="Rating ' +
            escapeHtml(p[7]) +
            ' of 100"><span class="q-score__value num">' +
            escapeHtml(p[7]) +
            '</span><span class="q-score__scale">/ 100</span></span></div>'
          );
        })
        .join('');
      var words = ['one attorney', 'two attorneys', 'three attorneys'];
      qs('[data-match-title]').textContent =
        'We matched ' +
        words[people.length - 1] +
        ': ' +
        catName(answers.category).toLowerCase() +
        '.';
      track('quiz_match_view', {
        practice_area: answers.category,
        matched: people.length,
      });
    },
    contacts: function () {
      var answers = state.answers,
        channelText = CHANNEL_TEXT[answers.channel] || CHANNEL_TEXT.telegram;
      emailField.hidden = answers.channel !== 'email';
      qs('[data-contacts-hint]').textContent = channelText[2];
    },
    thanks: function () {
      var answers = state.answers,
        lead = state.lead || {},
        channelText = CHANNEL_TEXT[answers.channel] || CHANNEL_TEXT.telegram,
        specialist = matched()[0];
      qs('[data-thanks-title]').textContent = lead.name
        ? 'Thank you, ' + lead.name + '. Your request has been sent.'
        : 'Thank you, your request has been sent.';
      qs('[data-thanks-hint]').textContent =
        'The attorney ' +
        channelText[1] +
        (answers.urgency === 'today' ? ' — the request is marked as urgent.' : '.');
      qs('[data-thanks-who]').textContent =
        specialist[0] + ' ' + specialist[1] + ' is reviewing your answers';
      qs('[data-thanks-when]').textContent =
        answers.channel === 'call'
          ? 'A call ' + (WHEN[answers.calltime] || 'as soon as possible during working hours')
          : channelText[0] + ' during working hours, 9 AM–8 PM';
      track('quiz_result_view', {
        preferred_channel: answers.channel,
      });
    },
  };

  /* ── старт: всегда с первого экрана, если состояние не подтверждает шаг ── */
  var start = targetFromHash();
  if (!allowed(start)) {
    start = 'start';
    if (location.hash && location.hash !== '#start') history.replaceState(null, '', '#start');
  }
  render(start, 'forward', true);
})();
