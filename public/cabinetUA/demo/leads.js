/* Демо-флоу придбання ліда: резерв 90 с → списання з балансу → лід у «Моїх лідах».
   Ціни й знижка — тут, у CONFIG: правляться одним рядком. */
(function () {
  var CONFIG = {
    RESERVE_SEC: 90,
    // Ціни взяті з текстів самого кабінету:
    // «за кожного потенційного клієнта ... Ви сплачуєте 70,00 ₴» (правила консультацій)
    // «при кожному відкритті контактів ... буде списано 250,00 ₴» (сторінка Контакти)
    PRICE: { question: 70, order: 250 },
    DISCOUNT_PCT: 20,          // знижка підписки PREMIUM
    PLAN: 'PREMIUM',
    TAX_PCT: 23,            // податок на поповнення, як у кабінеті
    START_BALANCE: 0
  };

  var KEY = 'promo_leads_v1';

  // ---------- сховище ----------
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (s && typeof s.balance === 'number') {
        if (!Array.isArray(s.bought)) s.bought = [];
        if (!Array.isArray(s.hidden)) s.hidden = [];
        if (s.reserve && (!s.reserve.until || s.reserve.until < Date.now())) s.reserve = null;
        return s;
      }
    } catch (e) {}
    return { balance: CONFIG.START_BALANCE, bought: [], hidden: [], reserve: null };
  }
  function save(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }
  var state = load();

  // ---------- формат ----------
  function money(v) {
    var neg = v < 0;
    v = Math.abs(v);
    var int = Math.floor(v);
    var frac = Math.round((v - int) * 100);
    var s = String(int).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (neg ? '−' : '') + s + ',' + (frac < 10 ? '0' : '') + frac + ' ₴';
  }

  // ---------- баланс і лічильники в хромі ----------
  function paintChrome() {
    document.querySelectorAll('.user-about__balance-value').forEach(function (el) {
      el.textContent = money(state.balance);
    });
    // блок «Баланс» на сторінці balance.html — перший рядок списку
    document.querySelectorAll('.main-balance__coll').forEach(function (li) {
      var name = li.querySelector('.main-balance__name');
      var val = li.querySelector('.main-balance__value');
      if (!name || !val) return;
      var t = name.textContent.trim().toLowerCase();
      if (t === 'баланс' || t === 'balance') val.textContent = money(state.balance);
    });
    var gone = state.bought.length + state.hidden.length;
    if (!gone) return;
    document.querySelectorAll('.new-orders__badge').forEach(function (el) {
      var base = el.getAttribute('data-demo-base');
      if (base === null) { base = el.textContent.trim(); el.setAttribute('data-demo-base', base); }
      var n = parseInt(base, 10);
      if (!isNaN(n)) el.textContent = Math.max(0, n - gone);
    });
  }

  // ---------- дані картки ----------
  function parseMoney(txt) {
    var m = String(txt).replace(/\u00a0/g, ' ').match(/(\d[\d\s]*(?:[.,]\d{2})?)/);
    if (!m) return 0;
    return parseFloat(m[1].replace(/\s/g, '').replace(',', '.')) || 0;
  }

  function readCard(li) {
    var q = function (sel) { return li.querySelector(sel); };
    var titleEl = q('.main-order__title');
    var svc = q('.main-order__service');
    var type = li.getAttribute('data-item-type') || 'order';
    var priceEl = q('.main-order__price');

    // Бойова картка-лід: ціна стоїть у самій кнопці «Купити N ₴», знижка вже врахована
    var buyBtn = q('.main-order__buy-btn');
    if (buyBtn) {
      var chips = [].slice.call(li.querySelectorAll('.main-order__chip'));
      var chipText = function (label) {
        for (var i = 0; i < chips.length; i++) {
          var t = chips[i].textContent.replace(/\s+/g, ' ').trim();
          if (t.indexOf(label) === 0) return t.slice(label.length).trim();
        }
        return '';
      };
      var srcChip = q('.main-order__chip--source');
      var desc = q('.main-order__description');
      return {
        id: li.getAttribute('data-id') || '',
        itemId: li.getAttribute('data-item-id') || '',
        type: 'lead',
        title: (titleEl && (titleEl.getAttribute('data-full-title') || titleEl.textContent.trim())) || 'Лід',
        text: desc ? desc.textContent.replace(/\s+/g, ' ').trim() : '',
        service: svc ? svc.textContent.trim() : 'Лід',
        serviceBlue: false,
        time: '',
        income: '',
        category: chipText('Категорія:'),
        region: chipText('Регіон:'),
        source: srcChip ? srcChip.textContent.trim() : '',
        price: parseMoney(buyBtn.textContent),
        fixedPrice: true
      };
    }

    return {
      id: li.getAttribute('data-id') || '',
      itemId: li.getAttribute('data-item-id') || '',
      type: type,
      title: (titleEl && (titleEl.getAttribute('data-full-title') || titleEl.textContent.trim())) || 'Лід',
      text: (q('.main-order__text') ? q('.main-order__text').textContent.trim() : ''),
      service: svc ? svc.textContent.trim() : '',
      serviceBlue: !!(svc && svc.className.indexOf('--blue') > -1),
      time: (q('.main-order__time b') ? q('.main-order__time b').textContent.trim() : ''),
      income: priceEl ? priceEl.textContent.trim() : '',
      price: CONFIG.PRICE[type] != null ? CONFIG.PRICE[type] : CONFIG.PRICE.order
    };
  }

  // демо-контакти клієнта: детерміновані від id, щоб не «стрибали» між перезавантаженнями
  var NAMES = ['Олена Ковальчук', 'Ігор Мельник', 'Наталія Бондаренко', 'Сергій Ткаченко',
               'Марина Литвин', 'Андрій Шевчук', 'Оксана Кравець', 'Дмитро Поліщук'];
  function contactsFor(id) {
    var n = 0, str = String(id);
    for (var i = 0; i < str.length; i++) n = (n * 31 + str.charCodeAt(i)) >>> 0;
    var name = NAMES[n % NAMES.length];
    var tail = 1000 + (n % 9000);
    var lat = name.split(' ')[0]
      .replace(/[^А-Яа-яЄІЇҐєіїґ]/g, '').toLowerCase()
      .replace(/[а-яєіїґ]/g, function (c) {
        var map = { 'а':'a','б':'b','в':'v','г':'h','ґ':'g','д':'d','е':'e','є':'ie','ж':'zh','з':'z',
          'и':'y','і':'i','ї':'i','й':'i','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r',
          'с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ь':'','ю':'iu','я':'ia' };
        return map[c] != null ? map[c] : c;
      });
    return {
      name: name,
      phone: '+380 (9' + (n % 10) + ') ' + (100 + n % 900) + '-' + tail.toString().slice(0, 2) + '-' + tail.toString().slice(2),
      email: lat + tail + '@gmail.com'
    };
  }

  // ---------- модалка ----------
  var SPRITE = 'assets/cabinet/img/sprite/sprite.svg';
  var modal = null, timer = null, current = null;

  function build() {
    var overlay = document.querySelector('[data-overlay], .overlay');
    if (!overlay) return null;
    var m = document.createElement('div');
    m.className = 'modal success-modal pl-modal';
    m.setAttribute('data-popup', 'demo-buy');
    m.innerHTML =
      '<div role="dialog" aria-modal="true" class="modal__box success-modal__box">' +
        '<button aria-label="Закрити модальне вікно" class="close modal__close" data-pl-close>' +
          '<svg width="20" height="20"><use href="' + SPRITE + '"></use></svg>' +
        '</button>' +
        '<div data-pl-screen="buy">' +
          '<div class="pl-head">' +
            '<span class="pl-badge" data-pl-badge></span>' +
            '<h3 class="pl-title" data-pl-title></h3>' +
            '<p class="pl-sub" data-pl-sub></p>' +
          '</div>' +
          '<div class="pl-reserve">' +
            '<div class="pl-reserve__row">' +
              '<span class="pl-reserve__label" data-pl-rlabel>Лід зарезервовано за вами</span>' +
              '<b class="pl-reserve__time" data-pl-time>1:30</b>' +
            '</div>' +
            '<div class="pl-reserve__bar"><i data-pl-bar></i></div>' +
            '<p class="pl-reserve__hint" data-pl-hint></p>' +
            '<button type="button" class="pl-rebook" data-pl-rebook hidden>Зарезервувати ще раз</button>' +
          '</div>' +
          '<div class="pl-stats">' +
            '<div class="pl-stat"><span>Вартість ліда</span><b data-pl-price></b></div>' +
            '<div class="pl-stat pl-stat--discount" data-pl-drow><span data-pl-dlabel></span><b data-pl-discount></b></div>' +
            '<div class="pl-stat pl-stat--total"><span>До списання</span><b data-pl-total></b></div>' +
            '<div class="pl-stat"><span data-pl-after-label>Баланс після оплати</span><b data-pl-after></b></div>' +
          '</div>' +
          '<div class="pl-short" data-pl-short hidden>' +
            '<b data-pl-short-title></b>' +
            '<p data-pl-short-text></p>' +
            '<a class="pl-btn pl-btn--sm" href="balance-pay.html" data-pl-topup>Поповнити баланс</a>' +
          '</div>' +
          '<p class="pl-note" data-pl-note></p>' +
          '<div class="pl-foot">' +
            '<button type="button" class="pl-cancel" data-pl-close>Скасувати</button>' +
            '<button type="button" class="pl-btn" data-pl-confirm>Підтвердити придбання</button>' +
          '</div>' +
        '</div>' +
        '<div data-pl-screen="result" hidden>' +
          '<div class="pl-result">' +
            '<div class="pl-result__ico" data-pl-rico></div>' +
            '<h3 class="pl-result__title" data-pl-rtitle></h3>' +
            '<p class="pl-result__text" data-pl-rtext></p>' +
            '<div class="pl-stats" data-pl-rstats></div>' +
            '<div class="pl-foot">' +
              '<button type="button" class="pl-cancel" data-pl-close>Закрити</button>' +
              '<a class="pl-btn" data-pl-rcta href="applications-my.html"></a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    overlay.appendChild(m);
    return m;
  }

  function el(sel) { return modal.querySelector(sel); }

  function openModal() {
    var overlay = document.querySelector('[data-overlay], .overlay');
    if (overlay) overlay.classList.add('active');
    modal.classList.add('active');
    document.body.classList.add('dis-scroll');
  }
  function closeModal() {
    stopTimer();
    if (state.reserve) { state.reserve = null; save(state); renderReserveBar(); }
    if (!modal) return;
    modal.classList.remove('active');
    var others = document.querySelectorAll('.modal.active');
    if (!others.length) {
      var overlay = document.querySelector('[data-overlay], .overlay');
      if (overlay) overlay.classList.remove('active');
      document.body.classList.remove('dis-scroll');
      document.body.style.paddingRight = '';
    }
    current = null;
  }

  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

  function startReserve(untilTs) {
    stopTimer();
    modal.classList.remove('is-expired');
    el('[data-pl-rlabel]').textContent = 'Лід зарезервовано за вами';
    el('[data-pl-hint]').textContent =
      'Завершіть оплату, поки діє резерв — інші спеціалісти не можуть придбати цей лід.';
    el('[data-pl-rebook]').hidden = true;
    var btn = el('[data-pl-confirm]');
    btn.disabled = false;
    btn.textContent = 'Підтвердити придбання';

    // відлік від реального часу: у фоновій вкладці setInterval тротлиться
    var end = untilTs || (Date.now() + CONFIG.RESERVE_SEC * 1000);
    if (current) {
      state.reserve = { id: current.data.id, until: end, data: current.data, total: current.total };
      save(state);
    }
    function render() {
      var left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      var mm = Math.floor(left / 60), ss = left % 60;
      el('[data-pl-time]').textContent = mm + ':' + (ss < 10 ? '0' : '') + ss;
      el('[data-pl-bar]').style.width = (left / CONFIG.RESERVE_SEC * 100) + '%';
      return left;
    }
    render();
    timer = setInterval(function () { if (render() <= 0) expire(); }, 1000);
  }

  function expire() {
    stopTimer();
    state.reserve = null;
    save(state);
    renderReserveBar();
    modal.classList.add('is-expired');
    el('[data-pl-rlabel]').textContent = 'Резерв знято';
    el('[data-pl-hint]').textContent = 'Лід знову доступний іншим спеціалістам.';
    el('[data-pl-rebook]').hidden = false;
    var btn = el('[data-pl-confirm]');
    btn.disabled = true;
    btn.textContent = 'Резерв закінчився';
  }

  function showBuy(data, card) {
    current = { data: data, card: card };
    el('[data-pl-screen="buy"]').hidden = false;
    el('[data-pl-screen="result"]').hidden = true;

    var badge = el('[data-pl-badge]');
    badge.textContent = data.service || 'Лід';
    badge.className = 'pl-badge' + (data.serviceBlue ? ' pl-badge--blue' : '');
    el('[data-pl-title]').textContent = data.title;
    el('[data-pl-sub]').textContent = data.text
      ? (data.text.length > 190 ? data.text.slice(0, 190) + '…' : data.text)
      : '';

    var discount = data.fixedPrice ? 0 : Math.round(data.price * CONFIG.DISCOUNT_PCT) / 100;
    var total = data.price - discount;
    el('[data-pl-price]').textContent = money(data.price);
    el('[data-pl-dlabel]').textContent = 'Знижка підписки ' + CONFIG.PLAN + ' −' + CONFIG.DISCOUNT_PCT + '%';
    el('[data-pl-discount]').textContent = '−' + money(discount);
    el('[data-pl-drow]').style.display = discount > 0 ? '' : 'none';
    el('[data-pl-total]').textContent = money(total);
    el('[data-pl-after]').textContent = money(state.balance - total);
    var meta = [];
    if (data.category) meta.push('Категорія: ' + data.category);
    if (data.region) meta.push('Регіон: ' + data.region);
    if (data.source) meta.push('Джерело: ' + data.source);
    el('[data-pl-note]').textContent = data.income
      ? 'Потенційний дохід за цим замовленням — ' + data.income + '. Після оплати відкриються контакти клієнта.'
      : (meta.length ? meta.join(' · ') + '. Після оплати відкриються контакти клієнта, і лід перейде до розділу «Мої ліди».'
                     : 'Після оплати відкриються контакти клієнта, і лід перейде до розділу «Мої ліди».');

    current.total = total;
    openModal();

    var r = state.reserve;
    var alive = r && r.id === data.id && r.until > Date.now();
    startReserve(alive ? r.until : null);
    updateShortfall();
  }

  // Коштів бракує: резерв не знімаємо — юрист іде поповнювати й повертається
  function updateShortfall() {
    if (!current) return;
    var box = el('[data-pl-short]');
    var btn = el('[data-pl-confirm]');
    var lack = current.total - state.balance;
    var afterLabel = el('[data-pl-after-label]');
    var afterVal = el('[data-pl-after]');
    if (lack > 0) {
      if (afterLabel) afterLabel.textContent = 'Ваш баланс';
      if (afterVal) afterVal.textContent = money(state.balance);
      box.hidden = false;
      el('[data-pl-short-title]').textContent = 'Не вистачає ' + money(lack);
      el('[data-pl-short-text]').textContent =
        'Лід залишається зарезервованим за вами, поки біжить таймер. Поповніть баланс і поверніться — резерв не згорить.';
      btn.disabled = true;
      btn.textContent = 'Недостатньо коштів';
    } else {
      if (afterLabel) afterLabel.textContent = 'Баланс після оплати';
      if (afterVal) afterVal.textContent = money(state.balance - current.total);
      box.hidden = true;
      if (!modal.classList.contains('is-expired')) {
        btn.disabled = false;
        btn.textContent = 'Підтвердити придбання';
      }
    }
    return lack;
  }

  function showResult(kind, opts) {
    stopTimer();
    el('[data-pl-screen="buy"]').hidden = true;
    el('[data-pl-screen="result"]').hidden = false;
    var ico = el('[data-pl-rico]');
    ico.className = 'pl-result__ico pl-result__ico--' + (kind === 'ok' ? 'ok' : 'warn');
    ico.textContent = kind === 'ok' ? '✓' : '!';
    el('[data-pl-rtitle]').textContent = opts.title;
    el('[data-pl-rtext]').textContent = opts.text;
    el('[data-pl-rstats]').innerHTML = (opts.rows || []).map(function (r) {
      return '<div class="pl-stat' + (r.total ? ' pl-stat--total' : '') + '"><span>' + r.k + '</span><b>' + r.v + '</b></div>';
    }).join('');
    var cta = el('[data-pl-rcta]');
    cta.textContent = opts.cta;
    cta.setAttribute('href', opts.href);
    openModal();
  }

  function moveCard(card) {
    if (!card || !document.body.contains(card)) return;
    var badge = document.createElement('div');
    badge.className = 'pl-moved';
    badge.textContent = 'Переходить до «Моїх лідів»';
    card.appendChild(badge);
    setTimeout(function () {
      card.classList.add('is-bought');
      setTimeout(function () { card.remove(); }, 460);
    }, 1200);
  }

  function confirmBuy() {
    if (!current || modal.classList.contains('is-expired')) return;
    var total = current.total;
    if (state.balance < total) {
      updateShortfall();
      return;
    }
    var btn = el('[data-pl-confirm]');
    btn.disabled = true;
    btn.textContent = 'Оплата…';
    stopTimer();
    setTimeout(function () {
      state.balance -= total;
      state.reserve = null;
      var d = current.data;
      state.bought.unshift({
        id: d.id, itemId: d.itemId, type: d.type, title: d.title, text: d.text,
        service: d.service, serviceBlue: d.serviceBlue, income: d.income,
        category: d.category || '', region: d.region || '', source: d.source || '',
        paid: total, at: new Date().toISOString()
      });
      save(state);
      paintChrome();
      renderReserveBar();
      moveCard(current.card);
      showResult('ok', {
        title: 'Лід придбано',
        text: 'Контакти клієнта відкрито. Лід перенесено до розділу «Мої ліди».',
        rows: [
          { k: 'Списано з балансу', v: money(total) },
          { k: 'Залишок на балансі', v: money(state.balance), total: true }
        ],
        cta: 'Перейти до «Моїх лідів»',
        href: 'applications-my.html'
      });
    }, 700);
  }

  // ---------- сторінка «Купити лід» ----------
  function initRelevant() {
    var list = document.querySelector('.order-list');
    if (!list) return;

    // сховати вже придбані / відхилені
    var gone = {};
    state.bought.forEach(function (b) { gone[b.id] = 1; });
    state.hidden.forEach(function (id) { gone[id] = 1; });
    list.querySelectorAll('.order-list__item').forEach(function (li) {
      if (gone[li.getAttribute('data-id')]) li.remove();
    });

    document.addEventListener('click', function (e) {
      var buy = e.target.closest('[data-btn-modal], .main-order__buy-btn');
      if (buy) {
        var li = buy.closest('.order-list__item');
        if (!li) return;
        e.preventDefault();
        e.stopPropagation();
        if (!modal) modal = build();
        if (!modal) return;
        showBuy(readCard(li), li);
        return;
      }
      var skip = e.target.closest('.main-order__close');
      if (skip) {
        var card = skip.closest('.order-list__item');
        if (!card) return;
        e.preventDefault();
        e.stopPropagation();
        var id = card.getAttribute('data-id');
        if (id && state.hidden.indexOf(id) < 0) { state.hidden.push(id); save(state); }
        card.classList.add('is-bought');
        setTimeout(function () { card.remove(); paintChrome(); }, 460);
      }
    }, true);
  }

  // ---------- сторінка «Мої ліди» ----------
  function initMy() {
    var inner = document.querySelector('.order-section__inner');
    if (!inner) return;
    if (!state.bought.length) return;

    var empty = inner.querySelector('.order-section__empty');
    if (empty) empty.remove();

    var ul = document.createElement('ul');
    ul.className = 'order-list';
    ul.innerHTML = state.bought.map(function (b) {
      var c = contactsFor(b.id || b.itemId || b.title);
      var when = new Date(b.at);
      var stamp = ('0' + when.getDate()).slice(-2) + '.' + ('0' + (when.getMonth() + 1)).slice(-2) + '.' + when.getFullYear();
      return '' +
        '<li data-id="' + b.id + '" class="order-list__item">' +
          '<div class="main-order info">' +
            '<div class="main-order__top">' +
              '<div class="main-order__inner">' +
                '<span class="main-order__time"><svg width="24" height="24"><use href="' + SPRITE + '"></use></svg> <b>Придбано ' + stamp + '</b></span>' +
                (b.income ? '<span class="main-order__price">' + b.income + '</span>' : '') +
              '</div>' +
              '<span class="main-order__title">' + b.title + '</span>' +
              '<span class="main-order__service main-order__service--' + (b.serviceBlue ? 'blue' : 'yellow') + '">' + (b.service || 'Лід') + '</span>' +
            '</div>' +
            '<div class="main-order__middle"><p class="main-order__text">' + (b.text || '') + '</p></div>' +
            '<div class="main-order__bottom">' +
              '<div class="pl-contacts">' +
                '<span class="pl-contact"><b>' + c.name + '</b></span>' +
                '<a class="pl-contact" href="tel:' + c.phone.replace(/[^+\d]/g, '') + '">' + c.phone + '</a>' +
                '<a class="pl-contact" href="mailto:' + c.email + '">' + c.email + '</a>' +
                '<span class="pl-status">Сплачено ' + money(b.paid) + '</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</li>';
    }).join('');
    inner.appendChild(ul);
  }

  // ---------- загальні обробники ----------
  function initCommon() {
    document.addEventListener('click', function (e) {
      if (!modal) return;
      if (e.target.closest('[data-pl-close]')) { e.preventDefault(); closeModal(); return; }
      if (e.target.closest('[data-pl-rebook]')) { e.preventDefault(); startReserve(); return; }
      if (e.target.closest('[data-pl-confirm]')) { e.preventDefault(); confirmBuy(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && modal.classList.contains('active')) closeModal();
    });
  }

  // ручний скид демо-стану: щоб показувати флоу покупки з нуля
  window.demoLeadsReset = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.reload();
  };

  function initReset() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-demo-reset]');
      if (!b) return;
      e.preventDefault();
      window.demoLeadsReset();
    });
  }

  // ---------- поповнення балансу ----------
  function initTopUp() {
    var modal = document.querySelector('[data-popup="card_replenishment"]');
    if (!modal) return;
    var input = modal.querySelector('.replenish-card-modal__amount-input');
    var submit = modal.querySelector('.replenish-card-modal__submit');
    if (!input || !submit) return;

    function calc() {
      var amount = parseMoney(input.value);
      var tax = Math.round(amount * CONFIG.TAX_PCT) / 100;
      return { amount: amount, tax: tax, credited: Math.max(0, Math.round((amount - tax) * 100) / 100) };
    }

    function render() {
      var v = calc();
      var cells = modal.querySelectorAll('.replenish-card-modal__row-value');
      if (cells[0]) cells[0].textContent = money(v.amount);
      if (cells[1]) cells[1].textContent = money(v.tax);
      if (cells[2]) cells[2].textContent = money(v.credited);
      submit.disabled = !(v.amount > 0);
    }

    function closeTopUp() {
      modal.classList.remove('active');
      var overlay = document.querySelector('[data-overlay], .overlay');
      if (overlay && !document.querySelector('.modal.active')) overlay.classList.remove('active');
      document.body.classList.remove('dis-scroll');
      document.body.style.paddingRight = '';
    }

    input.addEventListener('input', function () {
      var clean = input.value.replace(/[^\d\s.,]/g, '');
      if (clean !== input.value) input.value = clean;
      render();
    });
    input.addEventListener('change', render);

    submit.addEventListener('click', function (e) {
      e.preventDefault();
      var v = calc();
      if (v.amount <= 0) return;
      state.balance += v.credited;
      save(state);
      paintChrome();
      input.value = '';
      render();
      closeTopUp();
      renderReserveBar();
      if (window.demoToast) {
        window.demoToast('Баланс поповнено на ' + money(v.credited) + ' — податок ' + money(v.tax) + ' утримано.');
      }
    });

    modal.addEventListener('submit', function (e) { e.preventDefault(); });
    var closeBtn = modal.querySelector('.replenish-card-modal__close');
    if (closeBtn) closeBtn.addEventListener('click', function (e) { e.preventDefault(); closeTopUp(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeTopUp();
    });

    render();
  }

  // ---------- плашка активного резерву (видно на всіх сторінках) ----------
  var barEl = null, barTimer = null;

  function reserveLeft() {
    var r = state.reserve;
    if (!r || !r.until) return 0;
    return Math.max(0, Math.ceil((r.until - Date.now()) / 1000));
  }

  function renderReserveBar() {
    var left = reserveLeft();
    var onLeadsPage = /applications-relevant\.html$/.test(location.pathname) || location.pathname === '/';
    var modalOpen = modal && modal.classList.contains('active');

    if (!left || (onLeadsPage && modalOpen)) {
      if (barEl) { barEl.remove(); barEl = null; }
      if (barTimer) { clearInterval(barTimer); barTimer = null; }
      if (!left && state.reserve) { state.reserve = null; save(state); }
      return;
    }
    if (!barEl) {
      barEl = document.createElement('div');
      barEl.className = 'pl-resbar';
      barEl.innerHTML =
        '<span class="pl-resbar__dot"></span>' +
        '<span class="pl-resbar__text">Лід <b data-rb-title></b> зарезервовано ще <b data-rb-time></b></span>' +
        '<a class="pl-resbar__cta" href="applications-relevant.html">Повернутися до ліда</a>' +
        '<button type="button" class="pl-resbar__close" aria-label="Зняти резерв">×</button>';
      document.body.appendChild(barEl);
      barEl.querySelector('.pl-resbar__close').addEventListener('click', function () {
        state.reserve = null; save(state); renderReserveBar();
      });
    }
    var t = state.reserve.data && state.reserve.data.title ? state.reserve.data.title : '';
    barEl.querySelector('[data-rb-title]').textContent = t.length > 42 ? t.slice(0, 42) + '…' : t;
    var mm = Math.floor(left / 60), ss = left % 60;
    barEl.querySelector('[data-rb-time]').textContent = mm + ':' + (ss < 10 ? '0' : '') + ss;
    if (!barTimer) barTimer = setInterval(renderReserveBar, 1000);
  }

  // повернулись на сторінку лідів із живим резервом — одразу відкриваємо вікно придбання
  function resumeReserve() {
    var r = state.reserve;
    if (!r || reserveLeft() <= 0) return;
    var li = document.querySelector('.order-list__item[data-id="' + r.id + '"]');
    if (!li) return;
    if (!modal) modal = build();
    if (!modal) return;
    showBuy(readCard(li), li);
  }

  function start() {
    paintChrome();
    initCommon();
    initReset();
    renderReserveBar();
    var path = location.pathname.split('/').pop();
    if (path === 'applications-relevant.html' || path === '') { initRelevant(); resumeReserve(); }
    if (path === 'applications-my.html') initMy();
    if (path === 'balance-pay.html') initTopUp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else { start(); }
})();
