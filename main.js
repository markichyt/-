// ============================================
// ConsultantLM Quiz v9 — Stacked Cards with Depth
// ============================================

(function () {
  'use strict';

  var current = 0;
  var quizData = {};
  var history = [];

  // ===== CONFIGURATION =====
  // ⚠ Замінити на реальний endpoint:
  var SUBMIT_URL = 'https://your-api.example.com/quiz-submit';
  var STORAGE_KEY = 'clm_quiz_data';

  function saveQuizData() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(quizData)); } catch (e) {}
  }

  function submitQuizData(callback) {
    saveQuizData();
    var payload = JSON.stringify(quizData);
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', SUBMIT_URL, true);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.onload = function () {
        var ok = xhr.status >= 200 && xhr.status < 300;
        if (callback) callback(ok, xhr.status, xhr.responseText);
      };
      xhr.onerror = function () { if (callback) callback(false, 0, ''); };
      xhr.send(payload);
    } catch (e) {
      if (callback) callback(false, 0, String(e));
    }
  }

  var backBtn = document.getElementById('backBtn');

  // ---- Card role management ----
  var cards = [
    document.getElementById('mainCard'),
    document.getElementById('stackCard2'),
    document.getElementById('stackCard3')
  ];
  var activeIdx = 0;  // which card in the array is currently active/visible
  var cardContent = document.getElementById('cardContent'); // points to active card's .card-content

  // ---- UTM ----
  (function parseUTM() {
    var p = new URLSearchParams(window.location.search);
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(function(k) {
      var v = p.get(k); if (v) quizData[k] = v;
    });
  })();

  // ---- Slide definitions ----
  var slides = [
    // 1. profession
    { type:'radio', field:'profession',
      q:'Яка ваша <span class="accent">професія?</span>',
      sub:'Оберіть вашу сферу',
      options:[
        {v:'attorney',t:'Адвокат / Юрист',icon:'scales',color:'#6366f1'},
        {v:'notary',t:'Нотаріус',icon:'stamp',color:'#8b5cf6'},
        {v:'patent_attorney',t:'Патентний повірений',icon:'file-text',color:'#3b82f6'},
        {v:'agent',t:'Агент',icon:'home',color:'#f59e0b'},
        {v:'cpa',t:'CPA (Бухгалтер)',icon:'bar-chart',color:'#10b981'},
        {v:'tax_specialist',t:'Податковий спеціаліст',icon:'dollar',color:'#14b8a6'},
        {v:'insurance_adjuster',t:'Страховий експерт',icon:'shield',color:'#ef4444'},
        {v:'private_investigator',t:'Приватний детектив',icon:'search',color:'#f97316'},
        {v:'other',t:'Інше',icon:'briefcase',color:'#64748b'}
      ]},
    // 2. socialProof video
    { type:'card', id:'videoProof', q:'', sub:'' },
    // 3. zip
    { type:'text', field:'zip', q:'Ваше <span class="accent">місто</span> роботи?', sub:'Вкажіть ZIP-код', placeholder:'наприклад 10001', inputmode:'numeric' },
    // 4. role
    { type:'radio', field:'role', q:'Яка ваша <span class="accent">роль?</span>', sub:'Допоможіть нам персоналізувати ваш досвід',
      options:[
        {v:'self_employed',t:'Самозайнятий / Працюю самостійно',icon:'user',color:'#3b82f6'},
        {v:'employee',t:'Найманий працівник (в компанії)',icon:'building',color:'#8b5cf6'},
        {v:'executive',t:'Керівник компанії / Менеджер',icon:'crown',color:'#f59e0b'},
        {v:'founder',t:'Засновник / Власник бізнесу',icon:'rocket',color:'#10b981'}
      ]},
    // 5. services (filtered + select all)
    { type:'services', field:'services', q:'Які послуги ви <span class="accent">надаєте?</span>', sub:'Оберіть усе, що підходить' },
    // 6. aiCalc
    { type:'card', id:'aiCalc', q:'Ваш <span class="accent">AI-потенціал</span>', sub:'На основі ваших даних наш AI розрахував ваш потенціал на ConsultantLM' },
    // 7. contactForm (MOVED, simplified - no uploads)
    { type:'form', id:'contactForm', q:'Майже готово! Наш AI створить ваш <span class="accent">профіль</span>', sub:'Вкажіть свої дані — AI-асистент автоматично побудує ваш профіль' },
    // 8. transitionMarketing (NEW)
    { type:'card', id:'transitionMarketing', q:'Поговоримо про ваш <span class="accent">маркетинг</span>', sub:'Обговоримо вашу маркетингову активність і створимо персональну пропозицію' },
    // 10. channels
    { type:'checkbox', field:'channels', q:'Де представлений ваш <span class="accent">бізнес?</span>', sub:'Оберіть усе, що підходить', skip:'Поки що пропустити',
      options:[
        {v:'instagram',t:'Instagram або Facebook',icon:'instagram',color:'#e1306c'},
        {v:'website',t:'Власний сайт',icon:'globe',color:'#64748b'},
        {v:'tiktok',t:'TikTok',icon:'tiktok',color:'#000000'},
        {v:'youtube',t:'YouTube',icon:'play',color:'#ff0000'},
        {v:'linkedin',t:'LinkedIn',icon:'linkedin',color:'#0a66c2'},
        {v:'twitter',t:'X (Twitter)',icon:'x-twitter',color:'#000000'},
        {v:'telegram',t:'Telegram',icon:'send',color:'#0088cc'},
        {v:'other_channel',t:'Інше',icon:'plus',color:'#94a3b8'}
      ]},
    // 11. preferred_way (+ disclaimer)
    { type:'radio', field:'preferred_way', q:'Який ваш бажаний спосіб <span class="accent">залучати клієнтів?</span>', sub:'Як ви хочете розвиватись',
      options:[
        {v:'social_media',t:'Соцмережі',icon:'share',color:'#8b5cf6'},
        {v:'paid_ads',t:'Платна реклама',icon:'megaphone',color:'#f59e0b'},
        {v:'both',t:'Обидва',icon:'layers',color:'#3b82f6'},
        {v:'ai_decide',t:'Поки немає плану — AI вирішить',icon:'sparkle',color:'#10b981'}
      ]},
    // 12. marketing_time
    { type:'radio', field:'marketing_time', q:'Скільки годин на день ви витрачаєте на <span class="accent">маркетинг?</span>', sub:'Включаючи соцмережі, створення контенту, ведення блогу',
      options:[
        {v:'none',t:"Не витрачаю час на маркетинг",icon:'x-circle',color:'#94a3b8'},
        {v:'less_1',t:'Менше 1 години',icon:'clock',color:'#3b82f6'},
        {v:'1_5',t:'1-5 годин',icon:'clock',color:'#f59e0b'},
        {v:'5_plus',t:'5+ годин',icon:'clock',color:'#ef4444'}
      ]},
    // 13. ad_budget
    { type:'radio', field:'ad_budget', q:'Який ваш місячний <span class="accent">бюджет на рекламу?</span>', sub:'Скільки витрачаєте на рекламу',
      options:[
        {v:'not_ready',t:'Не готовий інвестувати',icon:'x-circle',color:'#94a3b8'},
        {v:'500_2000',t:'$500 - $2,000',icon:'dollar',color:'#10b981'},
        {v:'2000_5000',t:'$2,000 - $5,000',icon:'dollar',color:'#3b82f6'},
        {v:'5000_10000',t:'$5,000 - $10,000',icon:'dollar',color:'#8b5cf6'},
        {v:'10000_plus',t:'$10,000+',icon:'diamond',color:'#f59e0b'}
      ]},
    // 14. team
    { type:'checkbox', field:'team', q:'Хто у вашій <span class="accent">маркетинг-команді?</span>', sub:'Оберіть усі ролі, яких ви наразі наймаєте', skip:"У мене немає команди",
      options:[
        {v:'seo',t:'Контент-дослідник / SEO-спеціаліст',icon:'search',color:'#3b82f6'},
        {v:'scriptwriter',t:'Сценарист',icon:'pen',color:'#8b5cf6'},
        {v:'videographer',t:'Відеограф',icon:'camera',color:'#ef4444'},
        {v:'video_editor',t:'Відеомонтажер',icon:'film',color:'#f97316'},
        {v:'smm',t:'Таргетолог / SMM',icon:'megaphone',color:'#10b981'},
        {v:'crm_manager',t:'CRM / Лід-менеджер',icon:'users',color:'#0ea5e9'}
      ]},
    // 15. team_salary
    { type:'radio', field:'team_salary', q:'Скільки ви витрачаєте на <span class="accent">маркетинг-команду?</span>', sub:'Сумарна місячна зарплата всієї маркетинг-команди',
      options:[
        {v:'under_1000',t:'До $1,000',icon:'dollar',color:'#10b981'},
        {v:'1000_5000',t:'$1,000 - $5,000',icon:'dollar',color:'#3b82f6'},
        {v:'5000_20000',t:'$5,000 - $20,000',icon:'dollar',color:'#8b5cf6'},
        {v:'20000_plus',t:'$20,000+',icon:'diamond',color:'#f59e0b'}
      ]},
    // 16. teamReplace (MOVED, new title)
    { type:'card', id:'teamReplace', q:'Ваші <span class="accent">витрати на команду</span>', sub:'Подивіться, скільки ви могли б заощадити з ConsultantLM' },
    // 17. tenx
    { type:'card', id:'tenx', q:'Ми зламали код, щоб надати <span class="accent">в 10 разів кращі результати</span>', sub:'Від $19/міс — Всього 15 хвилин на день' },
    // 18. video1
    { type:'card', id:'video1', q:'', sub:'' },
    // 19. video2
    { type:'card', id:'video2', q:'', sub:'' },
    // 20. videoAds
    { type:'card', id:'videoAds', q:'', sub:'' },
    // 21. videoSocials
    { type:'card', id:'videoSocials', q:'', sub:'' },
    // 22. dualSlider
    { type:'dualSlider', q:'Встановіть ваші <span class="accent">цілі</span> на перший місяць', sub:'Це допоможе AI побудувати план росту для вас',
      sliders:[
        { field:'desired_clients', label:'Бажані клієнти', min:0, max:100, val:25, step:1, fmt:function(v){return v>=100?'100+':v;}, labels:'<span>0</span><span>25</span><span>50</span><span>75</span><span>100+</span>' },
        { field:'desired_revenue', label:'Бажаний дохід', min:0, max:100000, val:25000, step:1000, fmt:function(v){return v>=100000?'$100K+':'$'+Number(v).toLocaleString('en-US');}, labels:'<span>$0</span><span>$25K</span><span>$50K</span><span>$75K</span><span>$100K+</span>' }
      ]},
    // 23. period
    { type:'radio', field:'period', q:'Як довго ви хочете <span class="accent">співпрацювати?</span>', sub:'Довші періоди — кращі ціни',
      options:[
        {v:'1_month',t:'1 місяць',icon:'calendar',color:'#64748b'},
        {v:'1_year',t:'1 рік (Економія 10%)',icon:'calendar',color:'#3b82f6'},
        {v:'3_years',t:'3 роки (Економія 20%)',icon:'calendar',color:'#10b981'}
      ]},
    // 24. time_on_platform
    { type:'radio', field:'time_on_platform', q:'Скільки часу на тиждень можете приділити <span class="accent">ConsultantLM</span>?', sub:'Це допоможе нам підлаштувати ваш план',
      options:[
        {v:'15min',t:'15 хвилин на день',icon:'clock',color:'#10b981'},
        {v:'30min',t:'30 хвилин на день',icon:'clock',color:'#3b82f6'},
        {v:'1hr',t:'1 година на день',icon:'clock',color:'#8b5cf6'},
        {v:'more',t:'Більше 1 години',icon:'clock',color:'#f59e0b'}
      ]},
    // 25. uploadFiles (NEW)
    { type:'card', id:'uploadFiles', q:'Завантажте ваші <span class="accent">файли</span>', sub:'Додайте фото і CV — ми створимо професійний профіль' },
    // 26. assessment
    { type:'card', id:'assessment', q:'Ваш <span class="accent">потенціал доходу</span>', sub:'На основі професії, локації, послуг і цілей' },
    // 27. profilesPricing
    { type:'card', id:'profilesPricing', q:'Оберіть ваш <span class="accent">тариф</span>', sub:'' },
    // 28. payment
    { type:'card', id:'payment', q:'Завершіть <span class="accent">оплату</span>', sub:'' }
  ];

  var TOTAL = slides.length;

  // ---- Helpers ----
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function updateUI() {
    if (current > 1) backBtn.classList.add('visible');
    else backBtn.classList.remove('visible');
    updateGlobalScale();
  }

  // ---- Global profile completeness scale ----
  function calcProfileScore() {
    var score = 0;
    var max = 100;
    // Q1: profession (weight 15)
    if (quizData.profession) score += 15;
    // Q2: location (weight 10)
    if (quizData.zip) score += 10;
    // Q3: role (weight 10)
    if (quizData.role) score += 10;
    // Q4: services (weight 10)
    if (quizData.services && quizData.services.length > 0) score += 10;
    // Q7: channels (weight 5)
    if (quizData.channels && quizData.channels.length > 0) score += 5;
    // Q8: preferred way (weight 5)
    if (quizData.preferred_way) score += 5;
    // Q9: marketing time (weight 5)
    if (quizData.marketing_time) score += 5;
    // Q10: ad budget (weight 5)
    if (quizData.ad_budget) score += 5;
    // Q11: team (weight 3)
    if (quizData.team && quizData.team.length > 0) score += 3;
    // Q12: team salary (weight 3)
    if (quizData.team_salary) score += 3;
    // Q18: desired clients + revenue (weight 4)
    if (quizData.desired_clients !== undefined) score += 2;
    if (quizData.desired_revenue !== undefined) score += 2;
    // Q20: period (weight 5)
    if (quizData.period) score += 5;
    // Q21: time on platform (weight 3)
    if (quizData.time_on_platform) score += 3;
    // Q24: contact form (weight 14)
    if (quizData.first_name) score += 3;
    if (quizData.last_name) score += 3;
    if (quizData.email) score += 4;
    if (quizData.phone) score += 4;
    return Math.min(score, max);
  }

  function updateGlobalScale() {
    var score = calcProfileScore();
    var fillEl = document.getElementById('globalFill');
    var pctEl = document.getElementById('globalPct');
    if (fillEl) fillEl.style.width = score + '%';
    if (pctEl) pctEl.textContent = score + '%';
  }

  // ---- Render into a specific card element ----
  function renderSlideInto(cardEl, n) {
    var contentDiv = cardEl.querySelector('.card-content');
    // Temporarily point cardContent to this card's content div
    var prevCardContent = cardContent;
    cardContent = contentDiv;
    cardContent.innerHTML = '';

    var s = slides[n - 1];

    // Question + subtitle
    var qEl = el('div', 'card-question', s.q);
    var subEl = el('div', 'card-sub', s.sub);
    cardContent.appendChild(qEl);
    cardContent.appendChild(subEl);

    // Need scroll wrapper for long cards
    var needsScroll = ['services','form','card','dualSlider'].indexOf(s.type) > -1;
    var wrap = cardContent;
    if (needsScroll) {
      var scrollWrap = el('div', 'card-scroll');
      cardContent.appendChild(scrollWrap);
      if (s.type === 'card' || s.type === 'form' || s.type === 'services' || s.type === 'dualSlider') {
        cardContent.innerHTML = '';
        scrollWrap.appendChild(qEl);
        scrollWrap.appendChild(subEl);
        cardContent.appendChild(scrollWrap);
        wrap = scrollWrap;
      }
    }

    if (s.type === 'radio') renderRadio(s, wrap);
    else if (s.type === 'checkbox') renderCheckbox(s, wrap);
    else if (s.type === 'text') renderText(s, wrap);
    else if (s.type === 'services') renderServices(s, wrap);
    else if (s.type === 'slider') renderSlider(s, wrap);
    else if (s.type === 'dualSlider') renderDualSlider(s, wrap);
    else if (s.type === 'form') renderForm(s, wrap);
    else if (s.type === 'card') renderCard(s, wrap);

    // Restore cardContent reference
    cardContent = prevCardContent;
    return cardEl;
  }

  // ---- Pre-render next slide into behind-1 card ----
  function preRenderNext() {
    if (current >= TOTAL) return;
    // Find the card currently in behind-1 position
    var behind1Idx = (activeIdx + 1) % 3;
    var behind1Card = cards[behind1Idx];
    renderSlideInto(behind1Card, current + 1);
    // Pause any videos in the pre-rendered card (don't autoplay yet)
    behind1Card.querySelectorAll('video').forEach(function(v) { v.pause(); });
  }

  // ---- Card transition: swipe out, promote behind cards ----
  function swipeAndRender(dir) {
    var exitClass = dir === 'right' ? 'exit-right' : 'exit-left';

    var activeCard = cards[activeIdx];
    var behind1Idx = (activeIdx + 1) % 3;
    var behind2Idx = (activeIdx + 2) % 3;
    var behind1Card = cards[behind1Idx];
    var behind2Card = cards[behind2Idx];

    // Animate active card out
    activeCard.classList.remove('active');
    activeCard.classList.add(exitClass);

    // Promote behind-1 to active, behind-2 to behind-1
    behind1Card.style.transition = 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
    behind2Card.style.transition = 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
    behind1Card.className = 'stack-card active';
    behind2Card.className = 'stack-card behind-1';

    setTimeout(function() {
      // Move exited card to behind-2 position (no animation)
      activeCard.style.transition = 'none';
      activeCard.className = 'stack-card behind-2';
      // Force reflow
      void activeCard.offsetHeight;
      activeCard.style.transition = '';

      // Update active index
      activeIdx = behind1Idx;
      // Update cardContent to point to new active card's .card-content
      cardContent = cards[activeIdx].querySelector('.card-content');

      // Activate media (video + iframe HTML scenes) in the now-active card
      activateMedia(cards[activeIdx]);

      // Deactivate media in the exited card
      deactivateMedia(activeCard);

      // Pre-render the next-next slide
      preRenderNext();
    }, 420);
  }

  // ---- Advance ----
  function advance() {
    if (current >= TOTAL) return;
    history.push(current);
    current++;
    saveQuizData();
    updateUI();

    if (current === 1) {
      // First slide: render directly into active card
      renderSlideInto(cards[activeIdx], current);
      cards[activeIdx].className = 'stack-card active';
      activateMedia(cards[activeIdx]);
      // Pre-render next
      preRenderNext();
    } else {
      // Content is already pre-rendered in behind-1 card
      swipeAndRender('right');
    }
  }

  // ---- Go back ----
  function goBack() {
    if (history.length === 0) return;
    current = history.pop();
    if (current === 0) { current = 1; history = []; }
    updateUI();

    // For going back, we need to render the previous slide into the behind-2 card
    // (which will become the new behind-1 after we swap directions)
    // Actually, we render into the card that will become active after the left swipe
    var behind1Idx = (activeIdx + 1) % 3;
    var behind1Card = cards[behind1Idx];
    renderSlideInto(behind1Card, current);
    // Pause videos until card becomes active
    behind1Card.querySelectorAll('video').forEach(function(v) { v.pause(); });

    swipeAndRender('left');
  }

  backBtn.addEventListener('click', function() { goBack(); });

  // ---- Render slide (compatibility wrapper) ----
  function renderSlide(n) {
    renderSlideInto(cards[activeIdx], n);
  }

  // ---- SVG Icon Map ----
  var svgIcons = {
    scales:'<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
    stamp:'<rect x="5" y="14" width="14" height="6" rx="1"/><path d="M12 14V6"/><circle cx="12" cy="4" r="2"/>',
    'file-text':'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    home:'<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    'bar-chart':'<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
    dollar:'<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>',
    shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    search:'<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    briefcase:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>',
    user:'<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    building:'<rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><path d="M9 22v-4h6v4"/>',
    crown:'<path d="M2 20h20"/><path d="M4 16l2-12 6 6 6-6 2 12z"/>',
    rocket:'<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/>',
    instagram:'<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
    globe:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>',
    tiktok:'<path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/>',
    play:'<polygon points="5 3 19 12 5 21 5 3"/>',
    linkedin:'<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    'x-twitter':'<path d="M4 4l16 16"/><path d="M20 4L4 20"/>',
    send:'<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
    plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
    megaphone:'<path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 11-5.8-1.6"/>',
    layers:'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    sparkle:'<path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/>',
    'x-circle':'<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
    clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    diamond:'<path d="M6 3h12l4 6-10 13L2 9z"/>',
    pen:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>',
    camera:'<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>',
    film:'<rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/>',
    users:'<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
    calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'
  };

  function getIconSVG(name) {
    var paths = svgIcons[name] || svgIcons['briefcase'];
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
  }

  // ---- Radio ----
  function renderRadio(s, wrap) {
    var list = el('div', 'option-list');
    var disclaimerDiv = null;

    // Add disclaimer div for preferred_way
    if (s.field === 'preferred_way') {
      disclaimerDiv = el('div', 'pref-disclaimer');
      disclaimerDiv.id = 'prefWayDisclaimer';
    }

    s.options.forEach(function(opt) {
      var item = el('div', 'option-item');
      var iconHtml = opt.icon ? '<span class="opt-icon" style="background:' + (opt.color || '#64748b') + '">' + getIconSVG(opt.icon) + '</span>' : '';
      item.innerHTML = iconHtml + '<span class="option-text">' + opt.t + '</span><span class="option-radio"></span>';
      item.addEventListener('click', function() {
        quizData[s.field] = opt.v;
        list.querySelectorAll('.option-item').forEach(function(i) { i.classList.remove('selected'); });
        item.classList.add('selected');

        // Update preferred_way disclaimer
        if (s.field === 'preferred_way' && disclaimerDiv) {
          var disclaimerTexts = {
            social_media: 'Автоматизація: ми допомагаємо створювати і вести соцмережі автоматично, контент будує довіру і залучає клієнтів.',
            paid_ads: 'Наша AI-реклама — це підсилювач. Ми покращуємо те, що ви робите.',
            both: 'Чудовий вибір! Ми поєднаємо платний і органічний підходи для максимального результату.',
            ai_decide: 'Сказали "довіра"? Чудово. AI підбере найкращу стратегію під ваш бізнес і принесе результат.'
          };
          disclaimerDiv.textContent = disclaimerTexts[opt.v] || '';
        }

        setTimeout(function() { advance(); }, 500);
      });
      list.appendChild(item);
    });
    wrap.appendChild(list);

    // Append disclaimer after options for preferred_way
    if (disclaimerDiv) {
      wrap.appendChild(disclaimerDiv);
    }
  }

  // ---- Checkbox ----
  function renderCheckbox(s, wrap) {
    var selected = quizData[s.field] || [];
    var list = el('div', 'option-list');

    s.options.forEach(function(opt) {
      var item = el('div', 'option-item');
      var iconHtml = opt.icon ? '<span class="opt-icon" style="background:' + (opt.color || '#64748b') + '">' + getIconSVG(opt.icon) + '</span>' : '';
      item.innerHTML = iconHtml + '<span class="option-text">' + opt.t + '</span><span class="option-check"></span>';
      if (selected.indexOf(opt.v) > -1) item.classList.add('selected');
      item.addEventListener('click', function() {
        item.classList.toggle('selected');
        var idx = selected.indexOf(opt.v);
        if (idx > -1) selected.splice(idx, 1);
        else selected.push(opt.v);
        quizData[s.field] = selected.slice();
      });
      list.appendChild(item);
    });
    wrap.appendChild(list);

    if (s.skip) {
      var skip = el('div', 'skip-link', s.skip);
      skip.addEventListener('click', function() { advance(); });
      wrap.appendChild(skip);
    }

    var btn = el('button', 'card-btn', 'Продовжити &rarr;');
    btn.addEventListener('click', function() { advance(); });
    wrap.appendChild(btn);
  }

  // ---- Text ----
  function renderText(s, wrap) {
    var inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'card-input';
    inp.placeholder = s.placeholder || '';
    if (s.inputmode) inp.inputMode = s.inputmode;
    if (quizData[s.field]) inp.value = quizData[s.field];
    wrap.appendChild(inp);

    var btn = el('button', 'card-btn', 'Продовжити &rarr;');
    btn.addEventListener('click', function() {
      var val = inp.value.trim();
      if (!val) return;
      quizData[s.field] = val;
      advance();
    });
    wrap.appendChild(btn);

    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') btn.click();
    });

    setTimeout(function() { inp.focus(); }, 500);
  }

  // ---- Services ----
  function renderServices(s, wrap) {
    var selectedServices = quizData.services || [];

    // Search input with icon
    var searchWrap = el('div', 'svc-search-wrap');
    searchWrap.innerHTML = '<span class="svc-search-icon">' + getIconSVG('search') + '</span>';
    var searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'card-input search-input svc-search-input';
    searchInput.placeholder = 'Пошук послуг...';
    searchWrap.appendChild(searchInput);
    wrap.appendChild(searchWrap);

    var tree = el('div', 'category-tree');

    var allCategories = [
      { name:'Сімейне право', icon:'scales', color:'#6366f1', subs:[
        { name:'Розлучення', items:[{s:'divorce_contested',t:'Спірне розлучення'},{s:'divorce_uncontested',t:'Безспірне розлучення'},{s:'divorce_mediation',t:'Медіація розлучення'}]},
        { name:'Поділ майна', items:[{s:'property_division',t:'Поділ майна'},{s:'asset_valuation',t:'Оцінка активів'}]},
        { name:'Аліменти', items:[{s:'alimony_spousal',t:'Підтримка дружини/чоловіка'},{s:'alimony_modification',t:'Зміна аліментів'}]},
        { name:'Опіка над дітьми', items:[{s:'custody_joint',t:'Спільна опіка'},{s:'custody_sole',t:'Одноосібна опіка'},{s:'custody_visitation',t:'Права на побачення'}]},
        { name:'Усиновлення', items:[{s:'adoption_domestic',t:'Усиновлення в країні'},{s:'adoption_international',t:'Міжнародне усиновлення'}]}
      ]},
      { name:'Кримінальне право', icon:'shield', color:'#ef4444', subs:[
        { name:'Кримінальний захист', items:[{s:'criminal_defense',t:'Загальний кримінальний захист'},{s:'assault_defense',t:'Захист у справах нападу'}]},
        { name:'Захист у справах DUI', items:[{s:'dui_first',t:'Перше DUI'},{s:'dui_repeat',t:'Повторне DUI'}]},
        { name:'Наркотичні справи', items:[{s:'drug_possession',t:'Зберігання наркотиків'},{s:'drug_trafficking',t:'Розповсюдження наркотиків'}]},
        { name:'Білокомірцеві злочини', items:[{s:'fraud',t:'Шахрайство'},{s:'embezzlement',t:'Розтрата'}]}
      ]},
      { name:'Нерухомість', icon:'home', color:'#f59e0b', subs:[
        { name:'Угоди', items:[{s:'real_estate_transactions',t:'Угоди з нерухомістю'},{s:'closings',t:'Закриття угод'}]},
        { name:'Орендодавець і орендар', items:[{s:'landlord_tenant',t:'Спори орендодавця-орендаря'},{s:'eviction',t:'Виселення'}]},
        { name:'Зонування та землекористування', items:[{s:'zoning',t:'Зонування'},{s:'land_use',t:'Дозволи на землекористування'}]}
      ]},
      { name:'Імміграція', icon:'globe', color:'#3b82f6', subs:[
        { name:'Візи', items:[{s:'work_visa',t:'Робочі візи'},{s:'family_visa',t:'Сімейні візи'}]},
        { name:'Грін-карти', items:[{s:'green_card_employment',t:'На основі працевлаштування'},{s:'green_card_family',t:'На основі сімейних зв\'язків'}]},
        { name:'Захист від депортації', items:[{s:'deportation',t:'Захист від депортації'},{s:'asylum',t:'Притулок'}]}
      ]},
      { name:'Податки та бухгалтерія', icon:'dollar', color:'#10b981', subs:[
        { name:'Податкове планування', items:[{s:'tax_planning',t:'Податкове планування'},{s:'tax_compliance',t:'Податкова відповідність'}]},
        { name:'Податкові спори', items:[{s:'tax_disputes',t:'Податкові спори'},{s:'audit_representation',t:'Представництво на аудиті'}]},
        { name:'Бухгалтерія', items:[{s:'bookkeeping',t:'Бухгалтерський облік'},{s:'payroll',t:'Розрахунок зарплат'}]}
      ]}
    ];

    // Filter categories based on profession
    var profCategoryMap = {
      attorney: ['Сімейне право', 'Кримінальне право', 'Нерухомість', 'Імміграція'],
      patent_attorney: null, // null = show all
      notary: ['Нерухомість', 'Сімейне право'],
      cpa: ['Податки та бухгалтерія', 'Нерухомість'],
      tax_specialist: ['Податки та бухгалтерія', 'Нерухомість'],
      agent: ['Нерухомість', 'Імміграція'],
      insurance_adjuster: null,
      private_investigator: ['Кримінальне право', 'Сімейне право'],
      other: null
    };

    var allowedNames = profCategoryMap[quizData.profession] || null;
    var categories = allowedNames ? allCategories.filter(function(cat) {
      return allowedNames.indexOf(cat.name) > -1;
    }) : allCategories;

    // Counter badge
    var counterBadge = el('div', 'svc-counter');
    counterBadge.id = 'svcCounter';

    function updateServiceCount() {
      var count = selectedServices.length;
      if (count > 0) {
        counterBadge.textContent = count + ' послуг обрано';
        counterBadge.classList.add('visible');
      } else {
        counterBadge.textContent = '';
        counterBadge.classList.remove('visible');
      }
    }

    // "Select All" button
    var selectAllBtn = el('button', 'svc-select-all-btn', 'Обрати все');
    selectAllBtn.addEventListener('click', function() {
      // Select all visible chips
      tree.querySelectorAll('.svc-chip').forEach(function(chip) {
        if (chip.style.display !== 'none' && !chip.classList.contains('selected')) {
          chip.classList.add('selected');
          var svcKey = chip.dataset.service;
          if (selectedServices.indexOf(svcKey) === -1) {
            selectedServices.push(svcKey);
          }
        }
      });
      quizData.services = selectedServices.slice();
      updateServiceCount();
    });
    tree.appendChild(selectAllBtn);

    categories.forEach(function(cat, catIdx) {
      var grp = el('div', 'category-group');
      // First category open by default
      if (catIdx === 0) grp.classList.add('open');

      var hdr = el('div', 'svc-category');
      hdr.innerHTML =
        '<span class="opt-icon" style="background:' + cat.color + '">' + getIconSVG(cat.icon) + '</span>' +
        '<span class="svc-category-name">' + cat.name + '</span>' +
        '<span class="svc-category-chevron"></span>';
      hdr.addEventListener('click', function() { grp.classList.toggle('open'); });
      grp.appendChild(hdr);

      var catBody = el('div', 'svc-category-body');
      cat.subs.forEach(function(sub) {
        var subGrp = el('div', 'subcategory-group');
        var subLabel = el('div', 'svc-subcategory-label');
        subLabel.style.borderLeftColor = cat.color;
        subLabel.textContent = sub.name;
        subGrp.appendChild(subLabel);

        var chips = el('div', 'svc-chips');
        sub.items.forEach(function(it) {
          var chip = el('div', 'svc-chip');
          chip.textContent = it.t;
          chip.dataset.service = it.s;
          chip.dataset.text = it.t.toLowerCase();
          if (selectedServices.indexOf(it.s) > -1) chip.classList.add('selected');
          chip.addEventListener('click', function() {
            chip.classList.toggle('selected');
            var idx = selectedServices.indexOf(it.s);
            if (idx > -1) selectedServices.splice(idx, 1);
            else selectedServices.push(it.s);
            quizData.services = selectedServices.slice();
            updateServiceCount();
          });
          chips.appendChild(chip);
        });
        subGrp.appendChild(chips);
        catBody.appendChild(subGrp);
      });
      grp.appendChild(catBody);
      tree.appendChild(grp);
    });

    wrap.appendChild(tree);

    // Counter badge (before custom input)
    updateServiceCount();
    wrap.appendChild(counterBadge);

    var customInput = document.createElement('input');
    customInput.type = 'text';
    customInput.className = 'card-input';
    customInput.placeholder = 'Або введіть свою послугу...';
    customInput.style.marginTop = '10px';
    if (quizData.custom_services) customInput.value = quizData.custom_services;
    customInput.addEventListener('input', function() { quizData.custom_services = customInput.value; });
    wrap.appendChild(customInput);

    searchInput.addEventListener('input', function() {
      var q = searchInput.value.toLowerCase();
      tree.querySelectorAll('.svc-chip').forEach(function(chip) {
        chip.style.display = chip.dataset.text.includes(q) ? '' : 'none';
      });
      tree.querySelectorAll('.subcategory-group').forEach(function(sub) {
        var vis = 0;
        sub.querySelectorAll('.svc-chip').forEach(function(c) { if (c.style.display !== 'none') vis++; });
        if (q) { sub.style.display = vis ? '' : 'none'; }
        else { sub.style.display = ''; }
      });
      tree.querySelectorAll('.category-group').forEach(function(grp) {
        var vis = 0;
        grp.querySelectorAll('.svc-chip').forEach(function(c) { if (c.style.display !== 'none') vis++; });
        if (q) { grp.style.display = vis ? '' : 'none'; if (vis) grp.classList.add('open'); }
        else { grp.style.display = ''; }
      });
    });

    var btn = el('button', 'card-btn', 'Продовжити &rarr;');
    btn.addEventListener('click', function() { advance(); });
    wrap.appendChild(btn);
  }

  // ---- Slider ----
  function renderSlider(s, wrap) {
    var curVal = quizData[s.field] !== undefined ? quizData[s.field] : s.val;
    var valDisplay = el('div', 'range-value', String(s.fmt(curVal)));
    wrap.appendChild(valDisplay);

    var slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'range-slider';
    slider.min = s.min;
    slider.max = s.max;
    slider.value = curVal;
    slider.step = s.step;
    quizData[s.field] = curVal;

    slider.addEventListener('input', function() {
      var v = parseInt(slider.value);
      valDisplay.innerHTML = String(s.fmt(v));
      quizData[s.field] = v;
    });
    wrap.appendChild(slider);

    var labels = el('div', 'range-labels');
    if (s.field === 'desired_clients') labels.innerHTML = '<span>0</span><span>25</span><span>50</span><span>75</span><span>100+</span>';
    else labels.innerHTML = '<span>$0</span><span>$25K</span><span>$50K</span><span>$75K</span><span>$100K+</span>';
    wrap.appendChild(labels);

    var btn = el('button', 'card-btn', 'Продовжити &rarr;');
    btn.addEventListener('click', function() { advance(); });
    wrap.appendChild(btn);
  }

  // ---- Dual Slider ----
  function renderDualSlider(s, wrap) {
    s.sliders.forEach(function(sl) {
      var curVal = quizData[sl.field] !== undefined ? quizData[sl.field] : sl.val;

      var group = el('div', 'dual-slider-group');
      var labelEl = el('div', 'dual-slider-label', sl.label);
      group.appendChild(labelEl);

      var valDisplay = el('div', 'range-value range-value-sm', String(sl.fmt(curVal)));
      group.appendChild(valDisplay);

      var slider = document.createElement('input');
      slider.type = 'range';
      slider.className = 'range-slider';
      slider.min = sl.min;
      slider.max = sl.max;
      slider.value = curVal;
      slider.step = sl.step;
      quizData[sl.field] = curVal;

      slider.addEventListener('input', function() {
        var v = parseInt(slider.value);
        valDisplay.innerHTML = String(sl.fmt(v));
        quizData[sl.field] = v;
        updateGlobalScale();
      });
      group.appendChild(slider);

      var labels = el('div', 'range-labels');
      labels.innerHTML = sl.labels;
      group.appendChild(labels);

      wrap.appendChild(group);
    });

    var btn = el('button', 'card-btn', 'Продовжити &rarr;');
    btn.addEventListener('click', function() { advance(); });
    wrap.appendChild(btn);
  }

  // ---- Form ----
  function renderForm(s, wrap) {
    var fields = [
      {label:'Імʼя', field:'first_name', type:'text', ph:'Іван'},
      {label:'Прізвище', field:'last_name', type:'text', ph:'Іваненко'},
      {label:'Email', field:'email', type:'email', ph:'ivan@example.com'},
      {label:'Телефон', field:'phone', type:'tel', ph:'+380 50 123 4567'},
      {label:'Поштовий індекс', field:'zip', type:'text', ph:'напр. 10001'},
      {label:'Реферальний код (необов\'язково)', field:'referral_code', type:'text', ph:'Введіть код'}
    ];

    fields.forEach(function(f) {
      var grp = el('div', 'form-group');
      grp.innerHTML = '<label class="form-label">' + f.label + '</label>';
      var inp = document.createElement('input');
      inp.type = f.type;
      inp.className = 'card-input';
      inp.placeholder = f.ph;
      if (quizData[f.field]) inp.value = quizData[f.field];
      inp.addEventListener('input', function() { quizData[f.field] = inp.value; });
      grp.appendChild(inp);
      wrap.appendChild(grp);
    });

    var aboutGrp = el('div', 'form-group');
    aboutGrp.innerHTML = '<label class="form-label">Про себе (необовʼязково, мін. 3000 символів)</label>';
    var ta = document.createElement('textarea');
    ta.className = 'card-input';
    ta.rows = 4;
    ta.placeholder = 'Розкажіть про досвід, освіту, досягнення...';
    if (quizData.about) ta.value = quizData.about;
    ta.addEventListener('input', function() { quizData.about = ta.value; });
    aboutGrp.appendChild(ta);
    wrap.appendChild(aboutGrp);

    var errEl = el('div', '', '');
    errEl.style.cssText = 'color:#ef4444;font-size:13px;text-align:center;margin-top:8px;display:none';
    wrap.appendChild(errEl);

    var btn = el('button', 'card-btn', 'Продовжити &rarr;');
    btn.addEventListener('click', function() {
      advance();
    });
    wrap.appendChild(btn);
  }

  // ---- Card slides ----
  function renderCard(s, wrap) {
    if (s.id === 'aiCalc') renderAICalcCard(wrap);
    else if (s.id === 'video7') renderVideoCard(wrap, './htmlTOvideo/6/ConsultantLM Promo 6.html');
    else if (s.id === 'tenx') renderTenxCard(wrap);
    else if (s.id === 'video1') renderVideoCard(wrap, './htmlTOvideo/2/ConsultantLM Promo 2.html');
    else if (s.id === 'video2') renderVideoCard(wrap, './htmlTOvideo/9/ConsultantLM Promo.html');
    else if (s.id === 'videoAds') renderVideoCard(wrap, './htmlTOvideo/1/ConsultantLM Promo 1.html');
    else if (s.id === 'videoSocials') renderVideoCard(wrap, './htmlTOvideo/3/ConsultantLM Promo 3.html');
    else if (s.id === 'teamReplace') renderTeamReplaceCard(wrap);
    else if (s.id === 'assessment') renderAssessmentCard(wrap);
    else if (s.id === 'profilesPricing') renderProfilesPricingCard(wrap);
    else if (s.id === 'payment') renderPaymentCard(wrap);
    else if (s.id === 'videoProof') renderVideoCard(wrap, './htmlTOvideo/8/ConsultantLM Promo.html');
    else if (s.id === 'transitionMarketing') renderTransitionMarketingCard(wrap);
    else if (s.id === 'uploadFiles') renderUploadFilesCard(wrap);

    if (s.id !== 'payment' && s.id !== 'profilesPricing') {
      var btn = el('button', 'card-btn', 'Продовжити &rarr;');
      btn.addEventListener('click', function() { advance(); });
      wrap.appendChild(btn);
    }

    if (s.id === 'profilesPricing' || s.id === 'payment') startTimer();
  }

  // ---- AI Calculation ----
  function renderAICalcCard(wrap) {
    var prof = quizData.profession || 'attorney';
    var roleVal = quizData.role || 'self_employed';
    var zip = quizData.zip || '';
    var mult = {attorney:1,patent_attorney:1.2,cpa:0.8,notary:0.6,agent:0.7,tax_specialist:0.75,insurance_adjuster:0.65,private_investigator:0.5,other:0.6};
    var roleMult = {founder:1.2,executive:1.15,self_employed:1.0,employee:0.85};
    var profLabels = {attorney:'Адвокат / Юрист',patent_attorney:'Патентний повірений',cpa:'CPA (Бухгалтер)',notary:'Нотаріус',agent:'Агент',tax_specialist:'Податковий спеціаліст',insurance_adjuster:'Страховий експерт',private_investigator:'Приватний детектив',other:'Спеціаліст'};
    var roleLabels = {self_employed:'Самозайнятий',employee:'Найманий працівник',executive:'Керівник',founder:'Засновник'};

    var m = (mult[prof] || 0.7) * (roleMult[roleVal] || 1.0);

    // Services bonus
    var svcCount = (quizData.services || []).length;
    var svcMult = 1 + Math.min(svcCount, 8) * 0.05;
    m *= svcMult;

    var seoMin=Math.round(15*m),seoMax=Math.round(30*m),adsMin=Math.round(20*m),adsMax=Math.round(40*m),socMin=Math.round(10*m),socMax=Math.round(20*m);
    var tMin=seoMin+adsMin+socMin, tMax=seoMax+adsMax+socMax;
    var rMin=tMin*3000, rMax=tMax*8000;

    // Dynamic services list
    var svcNames = [];
    wrap.parentElement && document.querySelectorAll('.category-item.selected'); // won't work cross-slide, use quizData
    (quizData.services || []).forEach(function(s) { svcNames.push(s.replace(/_/g,' ')); });
    var svcText = svcNames.length > 0 ? svcNames.slice(0,3).join(', ') + (svcNames.length > 3 ? '...' : '') : 'Загальна';

    var html =
      '<div class="stats-row">' +
        '<div class="stat-card"><div class="stat-label">SEO (Google)</div><div class="stat-value">'+seoMin+'–'+seoMax+'</div><div class="stat-trend">лідів/міс</div></div>' +
        '<div class="stat-card"><div class="stat-label">Платна реклама</div><div class="stat-value">'+adsMin+'–'+adsMax+'</div><div class="stat-trend">лідів/міс</div></div>' +
        '<div class="stat-card"><div class="stat-label">Соцмережі</div><div class="stat-value">'+socMin+'–'+socMax+'</div><div class="stat-trend">лідів/міс</div></div>' +
      '</div>' +
      '<div class="highlight-card"><div class="stat-label">Загальний потенціал клієнтів</div><div class="big-number">'+tMin+'–'+tMax+'</div><div class="stat-label">на місяць</div></div>' +
      '<div class="highlight-card" style="margin-top:10px"><div class="stat-label">Очікуваний дохід</div><div class="big-number green">$'+rMin.toLocaleString('en-US')+' – $'+rMax.toLocaleString('en-US')+'</div><div class="stat-label">на місяць</div></div>' +
      '<p class="fine-print"><strong>Розраховано для:</strong> ' + (profLabels[prof]||prof) + (zip ? ', індекс ' + zip : '') + ', ' + (roleLabels[roleVal]||roleVal) + ', ' + svcText + '.<br>Включає: Google SEO + Meta/Google Ads + органічний трафік + соцмережі.</p>';
    var d = el('div', '', html);
    wrap.appendChild(d);
  }

  // ---- Proof ----
  function renderProofCard(wrap) {
    var html =
      '<div class="proof-card"><div class="proof-header"><div class="proof-avatar">JD</div><div class="proof-meta"><div class="proof-name">John Davis</div><div class="proof-role">Адвокат — New York</div><div class="proof-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div></div><span class="badge badge-green">+$47K/міс</span></div><p class="proof-quote">"ConsultantLM змінив мою практику. 47 нових клієнтів за перший місяць."</p></div>' +
      '<div class="proof-card"><div class="proof-header"><div class="proof-avatar orange">SM</div><div class="proof-meta"><div class="proof-name">Sarah Mitchell</div><div class="proof-role">CPA — California</div><div class="proof-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div></div><span class="badge badge-green">+$32K/міс</span></div><p class="proof-quote">"21 лід за першу годину! AI-контент — це неймовірно."</p></div>' +
      '<div class="featured-in">Про нас: <strong>Forbes</strong> — <strong>HiiL Justice</strong></div>';
    var d = el('div', '', html);
    wrap.appendChild(d);
  }

  // ---- 10X ----
  function renderTenxCard(wrap) {
    var html =
      '<div class="tenx-wrap">' +
        '<div class="tenx-before-after">' +
          '<div class="tenx-card tenx-before">' +
            '<div class="tenx-card-icon">&#10005;</div>' +
            '<div class="tenx-card-label">Без ConsultantLM</div>' +
            '<div class="tenx-card-items">' +
              '<div class="tenx-item">Потрібна повна команда</div>' +
              '<div class="tenx-item tenx-price-bad">$5K–$30K/міс</div>' +
              '<div class="tenx-item">Місяці до результатів</div>' +
            '</div>' +
          '</div>' +
          '<div class="tenx-vs">VS</div>' +
          '<div class="tenx-card tenx-after">' +
            '<div class="tenx-card-icon">&#10003;</div>' +
            '<div class="tenx-card-label">З ConsultantLM</div>' +
            '<div class="tenx-card-items">' +
              '<div class="tenx-item">AI робить усе</div>' +
              '<div class="tenx-item tenx-price-good">Від $19/міс</div>' +
              '<div class="tenx-item">Результати за тижні</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="tenx-hero">' +
          '<div class="tenx-hero-label">Один інструмент замінює</div>' +
          '<div class="tenx-hero-number">6 співробітників</div>' +
        '</div>' +
        '<div class="tenx-savings">' +
          '<div class="tenx-savings-amount">$35,000</div>' +
          '<div class="tenx-savings-text">ВИ ЕКОНОМИТЕ ЩОМІСЯЦЯ</div>' +
        '</div>' +
      '</div>';
    var d = el('div', '', html);
    wrap.appendChild(d);
  }

  // ---- Video / HTML scene ----
  // For HTML scenes we use data-src and only load real src when card becomes active,
  // so animation starts only when user actually sees the slide.
  function renderVideoCard(wrap, src) {
    var d = el('div', 'video-wrap');
    var isHtml = /\.html(\?|$)/i.test(src);
    if (isHtml) {
      d.innerHTML = '<iframe data-src="' + encodeURI(src) + '" src="about:blank" scrolling="no" frameborder="0" allow="autoplay" style="width:100%;aspect-ratio:360/640;border:0;display:block;background:#fff"></iframe>';
    } else {
      d.innerHTML = '<video src="' + src + '" muted loop playsinline preload="metadata"></video>';
    }
    wrap.appendChild(d);
  }

  // ---- Media activation helpers ----
  function activateMedia(card) {
    if (!card) return;
    card.querySelectorAll('video').forEach(function(v) {
      try { v.currentTime = 0; } catch(e){}
      v.play().catch(function() {});
    });
    card.querySelectorAll('iframe[data-src]').forEach(function(f) {
      var src = f.getAttribute('data-src');
      if (!src) return;
      // Force reload by clearing then setting — restarts the animation from frame 0
      f.setAttribute('src', 'about:blank');
      requestAnimationFrame(function() { f.setAttribute('src', src); });
    });
  }

  function deactivateMedia(card) {
    if (!card) return;
    card.querySelectorAll('video').forEach(function(v) {
      v.pause();
      try { v.currentTime = 0; } catch(e){}
    });
    card.querySelectorAll('iframe[data-src]').forEach(function(f) {
      f.setAttribute('src', 'about:blank');
    });
  }

  // ---- Team Replace ("One tool. Full team output.") ----
  function renderTeamReplaceCard(wrap) {
    wrap.innerHTML =
      '<div class="team-replace-card">' +
        '<table class="team-table"><thead><tr><th>Роль</th><th>США (на місяць)</th></tr></thead><tbody>' +
        '<tr><td>Контент-дослідник / SEO</td><td>$9,425</td></tr>' +
        '<tr><td>Сценарист</td><td>$5,115</td></tr>' +
        '<tr><td>Відеограф</td><td>$5,327</td></tr>' +
        '<tr><td>Відеомонтажер</td><td>$5,477</td></tr>' +
        '<tr><td>Таргетолог / SMM</td><td>$5,404</td></tr>' +
        '<tr><td>CRM / Лід-менеджер</td><td>$5,598</td></tr>' +
        '</tbody></table>' +
        '<div class="team-total">' +
          '<div class="team-total-label">Сумарна вартість команди на місяць</div>' +
          '<div class="team-total-value">~$35,346</div>' +
        '</div>' +
        '<div class="team-savings">' +
          '<div class="team-savings-vs">проти ConsultantLM від <span class="accent">$19/міс</span></div>' +
          '<div class="badge badge-green" style="font-size:14px;padding:8px 16px;margin-top:8px">Ви економите до $35,000/міс</div>' +
        '</div>' +
      '</div>';
  }

  // ---- Assessment ----
  function renderAssessmentCard(wrap) {
    var score = calcProfileScore();
    var level = score >= 75 ? 'Високий' : score >= 50 ? 'Помірний' : score >= 30 ? 'Звичайний' : 'Низький';
    var levelColor = score >= 75 ? '#10b981' : score >= 50 ? '#3b82f6' : score >= 30 ? '#f59e0b' : '#ef4444';

    var profLabels = {attorney:'Адвокат / Юрист',patent_attorney:'Патентний повірений',cpa:'CPA (Бухгалтер)',notary:'Нотаріус',agent:'Агент',tax_specialist:'Податковий спеціаліст',insurance_adjuster:'Страховий експерт',private_investigator:'Приватний детектив',other:'Спеціаліст'};
    var prof = quizData.profession || 'other';
    var zip = quizData.zip || '';
    var svcNames = (quizData.services || []).slice(0,3).map(function(s){return s.replace(/_/g,' ');});
    var svcText = svcNames.length > 0 ? svcNames.join(', ') : 'Загальна';

    var html =
      '<div class="potential-scale"><div class="scale-bar"><div class="scale-marker" id="scaleMarker" style="left:10%"></div></div><div class="scale-labels"><span>Низький</span><span>Звичайний</span><span>Помірний</span><span>Високий</span></div></div>' +
      '<div class="highlight-card" style="margin-top:16px"><span class="badge" style="font-size:14px;padding:6px 16px;background:' + levelColor + '22;color:' + levelColor + '">Ваш рівень: <strong>' + level + '</strong> (' + score + '%)</span></div>' +
      '<div class="fine-print" style="margin-top:12px"><strong>Розраховано для:</strong> ' + (profLabels[prof]||prof) + (zip ? ', індекс ' + zip : '') + ', ' + svcText + '.' +
      '<br>Фактори: бюджет реклами' + (quizData.ad_budget ? ' (' + quizData.ad_budget.replace(/_/g,' ') + ')' : '') + ', термін співпраці' + (quizData.period ? ' (' + quizData.period.replace(/_/g,' ') + ')' : '') + ', бажані цілі.</div>';
    var d = el('div', '', html);
    wrap.appendChild(d);

    setTimeout(function(){
      var mk = document.getElementById('scaleMarker');
      if (mk) mk.style.left = score + '%';
    }, 600);
  }

  // ---- Profiles + Pricing (D1 variant with carousel) ----
  function renderProfilesPricingCard(wrap) {
    var imgPath = './images/profiles/PHOTO3.png';
    var starSvg = '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>';
    var pinSvg = '<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>';
    var arrowLeftSvg = '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>';
    var arrowRightSvg = '<svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg>';

    var html = '<div class="profiles-pricing-wrap">';

    // ── Timer at top ──
    html += '<div class="pp-timer-bar pp-timer-top">';
    html += '<div class="pp-timer-label">ЗНИЖКА 20% ДЛЯ ВАС!</div>';
    html += '<div class="pp-timer-digits">';
    html += '<div class="t-block"><span class="num" id="ppTH">23</span><span class="lbl">год</span></div>';
    html += '<span class="t-sep">:</span>';
    html += '<div class="t-block"><span class="num" id="ppTM">59</span><span class="lbl">хв</span></div>';
    html += '<span class="t-sep">:</span>';
    html += '<div class="t-block"><span class="num" id="ppTS">59</span><span class="lbl">сек</span></div>';
    html += '</div></div>';

    // ── Profile viewport with arrows ──
    html += '<div class="pp-viewport" id="ppViewport">';
    html += '<button class="pp-arrow pp-arrow--left" id="ppArrowLeft" aria-label="Попередній тариф">' + arrowLeftSvg + '</button>';
    html += '<button class="pp-arrow pp-arrow--right" id="ppArrowRight" aria-label="Наступний тариф">' + arrowRightSvg + '</button>';
    html += '<div class="pp-track" id="ppProfileTrack">';

    // BASE profile slide
    html += '<div class="pp-slide"><div class="prof-card prof-base">';
    html += '<div class="prof-topbar"><span class="tier-label">BASE (Базовий)</span><span class="separator"></span><span class="rating-area">' + starSvg + '<span class="rating-num">54.42</span></span></div>';
    html += '<div class="prof-body"><div class="prof-avatar-wrap"><img src="' + imgPath + '" alt="Адвокат"></div>';
    html += '<div class="prof-info"><div class="name">Alexander K\u00f6nig</div><div class="role">Адвокат</div><div class="location">' + pinSvg + ' США, New York</div></div></div>';
    html += '<div class="prof-info-btn">i</div></div></div>';

    // PRO profile slide
    html += '<div class="pp-slide"><div class="prof-card prof-pro">';
    html += '<div class="prof-topbar"><span class="tier-label">PRO</span><span class="separator"></span><span class="rating-area">' + starSvg + '<span class="rating-num">67.59</span></span></div>';
    html += '<div class="prof-body"><div class="prof-avatar-wrap"><img src="' + imgPath + '" alt="Адвокат"></div>';
    html += '<div class="prof-info"><div class="name">Alexander K\u00f6nig</div><div class="role">Адвокат</div><div class="location">' + pinSvg + ' США, New York</div></div></div>';
    html += '<div class="prof-info-btn">i</div></div></div>';

    // PREMIUM profile slide
    html += '<div class="pp-slide"><div class="prof-card prof-premium">';
    html += '<div class="prof-topbar"><span class="tier-label">PREMIUM</span><span class="separator"></span><span class="rating-area">' + starSvg + '<span class="rating-num">76.02</span></span></div>';
    html += '<div class="prof-body"><div class="prof-info-area"><div class="prof-info"><div class="name">Alexander K\u00f6nig</div><div class="role">Адвокат</div><div class="location">' + pinSvg + ' США, New York</div></div></div>';
    html += '<div class="prof-photo-right"><img src="' + imgPath + '" alt="Адвокат"></div></div>';
    html += '<div class="prof-info-btn">i</div></div></div>';

    html += '</div></div>'; // close pp-track, pp-viewport

    // ── Dots ──
    html += '<div class="pp-dots" id="ppDots">';
    html += '<button class="pp-dot active" data-idx="0" aria-label="Тариф Base"></button>';
    html += '<button class="pp-dot" data-idx="1" aria-label="Тариф Pro"></button>';
    html += '<button class="pp-dot" data-idx="2" aria-label="Тариф Premium"></button>';
    html += '</div>';

    // ── AI Avatar Video Section (hidden for BASE, visible for PRO/PREMIUM) ──
    html += '<div class="pp-avatar-section" id="ppAvatarSection">';
    html += '<div class="pp-avatar-inner">';
    html += '<span class="pp-avatar-label">AI-аватар попередній перегляд</span>';
    html += '<div class="pp-avatar-video-wrap">';
    html += '<video id="ppAvatarVideo" loop playsinline preload="metadata">';
    html += '<source src="./videos/i_avatar.mp4" type="video/mp4">';
    html += '</video>';
    html += '<button class="pp-avatar-sound-btn" id="ppAvatarSoundBtn" title="Звук вкл/викл">&#128264;</button>';
    html += '</div>';
    html += '<div class="pp-avatar-tagline">Ваш AI-аватар говорить за вас 24/7</div>';
    html += '</div>';
    html += '</div>';

    // ── Billing toggle ──
    html += '<div class="pp-billing-toggle">';
    html += '<span class="toggle-label" id="ppLabelMonthly">Щомісяця</span>';
    html += '<div class="pp-toggle-track annual" id="ppToggleTrack"><div class="pp-toggle-thumb"></div></div>';
    html += '<span class="toggle-label active" id="ppLabelAnnual">Щороку</span>';
    html += '<span class="pp-save-badge">Економія 20%</span>';
    html += '</div>';

    // ── Pricing section ──
    html += '<div class="pp-pricing-section">';
    html += '<div class="pp-pricing-content" id="ppPricingTrack">';

    // BASE pricing panel
    html += '<div class="pp-pricing-panel">';
    html += '<div class="pp-plan-name pp-base-name">Base</div>';
    html += '<div class="pp-price-row"><span class="pp-old-price" id="ppOldBase">$49</span><span class="pp-new-price" id="ppPriceBase">$19<span class="period">/міс</span></span></div>';
    html += '<div class="pp-billing-note" id="ppNoteBase">на місяць, оплата раз на рік</div>';
    html += '<div class="pp-features" id="ppFeatBase"></div>';
    html += '</div>';

    // PRO pricing panel
    html += '<div class="pp-pricing-panel">';
    html += '<div class="pp-plan-name pp-pro-name">Pro</div>';
    html += '<div class="pp-price-row"><span class="pp-old-price" id="ppOldPro">$249</span><span class="pp-new-price" id="ppPricePro">$99<span class="period">/міс</span></span></div>';
    html += '<div class="pp-billing-note" id="ppNotePro">на місяць, оплата раз на рік</div>';
    html += '<div class="pp-features" id="ppFeatPro"></div>';
    html += '</div>';

    // PREMIUM pricing panel
    html += '<div class="pp-pricing-panel">';
    html += '<div class="pp-plan-name pp-premium-name">Premium</div>';
    html += '<div class="pp-price-row"><span class="pp-old-price" id="ppOldPremium">$599</span><span class="pp-new-price" id="ppPricePremium">$299<span class="period">/міс</span></span></div>';
    html += '<div class="pp-billing-note" id="ppNotePremium">на місяць, оплата раз на рік</div>';
    html += '<div class="pp-features" id="ppFeatPremium"></div>';
    html += '</div>';

    html += '</div></div>'; // close pp-pricing-content, pp-pricing-section

    // ── CTA button ──
    html += '<div class="pp-cta-area"><button class="pp-cta-btn pp-cta-base" id="ppCtaBtn">Обрати Base</button></div>';

    html += '</div>'; // close profiles-pricing-wrap

    var d = el('div', '', html);
    wrap.appendChild(d);

    // ── Feature data (from D1) ──
    var ppFeatures = [
      { label: 'Базовий рівень профілю',       base: true,  pro: true,  premium: true  },
      { label: 'Професійний рівень профілю', base: false, pro: true,  premium: true  },
      { label: 'Преміум рівень профілю',     base: false, pro: false, premium: true  },
      { label: 'AI-аватар',                 base: true,  pro: true,  premium: true  },
      { label: '19 токенів',                 base: true,  pro: false, premium: false },
      { label: '109 +10% токенів',           base: false, pro: true,  premium: false },
      { label: '389 +30% токенів',           base: false, pro: false, premium: true  },
      { label: '6 клієнтів',                 base: true,  pro: false, premium: false },
      { label: '30 клієнтів',                base: false, pro: true,  premium: false },
      { label: 'Необмежено клієнтів',         base: false, pro: false, premium: true  },
      { label: 'Топ у Google',             base: true,  pro: true,  premium: true  },
      { label: 'Перевірки репутації',         base: true,  pro: true,  premium: true  },
      { label: 'Менеджер 24/7',              base: false, pro: true,  premium: true  },
      { label: 'Просування у соцмережах',          base: true,  pro: true,  premium: true  },
      { label: 'AI для Google і Meta',      base: false, pro: true,  premium: true  },
      { label: 'AI-моніторинг конкурентів',   base: false, pro: false, premium: true  },
      { label: 'AI-асистент клієнтів',       base: false, pro: true,  premium: true  },
      { label: 'Реферальний дохід',         base: true,  pro: true,  premium: true  },
      { label: 'Приватний чат',              base: true,  pro: true,  premium: true  },
      { label: 'CRM-система',               base: true,  pro: true,  premium: true  },
      { label: 'Безпечний месенджер',          base: true,  pro: true,  premium: true  },
      { label: 'Підвищення рейтингу',              base: false, pro: true,  premium: true  },
      { label: 'Кастомні ціни',            base: false, pro: false, premium: true  }
    ];

    var ppProBadges = {
      '109 +10% токенів': { text: '×5.7 більше', type: 'green' },
      '30 клієнтів': { text: '×5 більше', type: 'green' },
      'Менеджер 24/7': { text: 'НОВЕ', type: 'cyan' },
      'AI для Google і Meta': { text: 'НОВЕ', type: 'cyan' },
      'AI-асистент клієнтів': { text: 'НОВЕ', type: 'cyan' },
      'Підвищення рейтингу': { text: 'НОВЕ', type: 'cyan' },
      'Професійний рівень профілю': { text: 'АПГРЕЙД', type: 'cyan' }
    };

    var ppPremiumBadges = {
      '389 +30% токенів': { text: '×3.6 більше', type: 'green' },
      'Необмежено клієнтів': { text: '\u221e', type: 'green' },
      'AI-моніторинг конкурентів': { text: 'НОВЕ', type: 'cyan' },
      'Кастомні ціни': { text: 'НОВЕ', type: 'cyan' },
      'Преміум рівень профілю': { text: 'АПГРЕЙД', type: 'cyan' }
    };

    function ppBuildFeatures(tier) {
      var relevant = [];
      var badgeMap = tier === 'pro' ? ppProBadges : tier === 'premium' ? ppPremiumBadges : null;

      ppFeatures.forEach(function(f) {
        var isTokenRow = f.label.indexOf('tokens') > -1;
        var isClientRow = f.label.indexOf('clients') > -1 || f.label === 'Необмежено клієнтів';

        if (isTokenRow) {
          if ((tier === 'base' && f.label === '19 токенів') ||
              (tier === 'pro' && f.label === '109 +10% токенів') ||
              (tier === 'premium' && f.label === '389 +30% токенів')) {
            var item = { label: f.label, on: true };
            if (badgeMap && badgeMap[f.label]) item.badge = badgeMap[f.label];
            relevant.push(item);
          }
          return;
        }
        if (isClientRow) {
          if ((tier === 'base' && f.label === '6 клієнтів') ||
              (tier === 'pro' && f.label === '30 клієнтів') ||
              (tier === 'premium' && f.label === 'Необмежено клієнтів')) {
            var item2 = { label: f.label, on: true };
            if (badgeMap && badgeMap[f.label]) item2.badge = badgeMap[f.label];
            relevant.push(item2);
          }
          return;
        }

        var item3 = { label: f.label, on: f[tier] };
        if (badgeMap && badgeMap[f.label]) item3.badge = badgeMap[f.label];
        relevant.push(item3);
      });

      relevant.sort(function(a, b) { return (b.on ? 1 : 0) - (a.on ? 1 : 0); });
      return relevant;
    }

    function ppRenderFeatures(container, tier) {
      var items = ppBuildFeatures(tier);
      container.innerHTML = items.map(function(f) {
        var cls = f.on ? 'yes' : 'no';
        var icon = f.on ? '&#10003;' : '&#10005;';
        var badgeHtml = '';
        if (f.badge) {
          var badgeCls = f.badge.type === 'green' ? 'comp-badge--green' : 'comp-badge--cyan';
          badgeHtml = '<span class="comp-badge ' + badgeCls + '">' + f.badge.text + '</span>';
        }
        return '<div class="pp-feat ' + cls + '"><span class="feat-left"><span class="icon">' + icon + '</span><span>' + f.label + '</span></span>' + badgeHtml + '</div>';
      }).join('');
    }

    // ── Carousel logic (inside setTimeout to ensure DOM is ready) ──
    setTimeout(function() {
      var ppCurrent = 0;
      var ppTotal = 3;
      var profileTrack = document.getElementById('ppProfileTrack');
      var pricingTrack = document.getElementById('ppPricingTrack');
      var dotsContainer = document.getElementById('ppDots');
      var dots = dotsContainer ? dotsContainer.querySelectorAll('.pp-dot') : [];
      var ctaBtn = document.getElementById('ppCtaBtn');
      var arrowLeft = document.getElementById('ppArrowLeft');
      var arrowRight = document.getElementById('ppArrowRight');
      var viewport = document.getElementById('ppViewport');
      var avatarSection = document.getElementById('ppAvatarSection');
      var avatarVideo = document.getElementById('ppAvatarVideo');
      var avatarSoundBtn = document.getElementById('ppAvatarSoundBtn');

      // Render features into containers
      var featBase = document.getElementById('ppFeatBase');
      var featPro = document.getElementById('ppFeatPro');
      var featPremium = document.getElementById('ppFeatPremium');
      if (featBase) ppRenderFeatures(featBase, 'base');
      if (featPro) ppRenderFeatures(featPro, 'pro');
      if (featPremium) ppRenderFeatures(featPremium, 'premium');

      var ppCtaConfig = [
        { text: 'Обрати Base',    cls: 'pp-cta-btn pp-cta-base',    plan: 'base' },
        { text: 'Обрати Pro',     cls: 'pp-cta-btn pp-cta-pro',     plan: 'pro' },
        { text: 'Обрати Premium', cls: 'pp-cta-btn pp-cta-premium', plan: 'premium' }
      ];

      function ppGoTo(idx) {
        if (idx < 0) idx = ppTotal - 1;
        if (idx >= ppTotal) idx = 0;
        ppCurrent = idx;

        var pct = -(idx * 100);
        if (profileTrack) profileTrack.style.transform = 'translateX(' + pct + '%)';
        if (pricingTrack) pricingTrack.style.transform = 'translateX(' + pct + '%)';

        for (var i = 0; i < dots.length; i++) {
          if (i === idx) dots[i].classList.add('active');
          else dots[i].classList.remove('active');
        }

        if (ctaBtn) {
          ctaBtn.textContent = ppCtaConfig[idx].text;
          ctaBtn.className = ppCtaConfig[idx].cls;
        }

        quizData.plan = ppCtaConfig[idx].plan;

        // Toggle avatar video section
        if (avatarSection && avatarVideo) {
          if (idx === 0) {
            avatarSection.classList.remove('visible');
            avatarVideo.pause();
          } else {
            avatarSection.classList.add('visible');
            // Only play video if this card is actually visible (not pre-rendered in background)
            var ppCard = avatarVideo.closest('.stack-card');
            var isVisible = ppCard && ppCard.classList.contains('active');
            if (isVisible) {
              avatarVideo.muted = false;
              avatarVideo.play().catch(function() {
                avatarVideo.muted = true;
                if (avatarSoundBtn) { avatarSoundBtn.innerHTML = '&#9834;&#xFE0E;'; avatarSoundBtn.classList.add('muted'); }
                avatarVideo.play().catch(function() {});
              });
              if (avatarSoundBtn) { avatarSoundBtn.innerHTML = '&#9834;'; avatarSoundBtn.classList.remove('muted'); }
            }
          }
        }
      }

      if (arrowLeft) arrowLeft.addEventListener('click', function(e) { e.stopPropagation(); ppGoTo(ppCurrent - 1); });
      if (arrowRight) arrowRight.addEventListener('click', function(e) { e.stopPropagation(); ppGoTo(ppCurrent + 1); });
      for (var di = 0; di < dots.length; di++) {
        (function(i) {
          dots[i].addEventListener('click', function(e) { e.stopPropagation(); ppGoTo(i); });
        })(di);
      }

      // ── Avatar sound toggle (sound ON by default, fallback to muted if blocked) ──
      if (avatarSoundBtn && avatarVideo) {
        avatarVideo.muted = false;
        avatarSoundBtn.innerHTML = '&#9834;';
        avatarSoundBtn.title = 'Mute';
        // If autoplay with sound fails, fallback to muted
        avatarVideo.addEventListener('play', function() {
          if (avatarVideo.muted) avatarSoundBtn.innerHTML = '&#9834;&#xFE0E;';
        });
        avatarSoundBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          avatarVideo.muted = !avatarVideo.muted;
          avatarSoundBtn.innerHTML = avatarVideo.muted ? '&#9834;&#xFE0E;' : '&#9834;';
          avatarSoundBtn.classList.toggle('muted', avatarVideo.muted);
        });
      }

      // ── Touch / Swipe ──
      var ppStartX = 0, ppStartY = 0, ppDragging = false, ppDx = 0;

      if (viewport) {
        viewport.addEventListener('touchstart', function(e) {
          ppStartX = e.touches[0].clientX;
          ppStartY = e.touches[0].clientY;
          ppDragging = true;
          ppDx = 0;
          if (profileTrack) profileTrack.style.transition = 'none';
          if (pricingTrack) pricingTrack.style.transition = 'none';
        }, { passive: true });

        viewport.addEventListener('touchmove', function(e) {
          if (!ppDragging) return;
          var moveX = e.touches[0].clientX;
          var moveY = e.touches[0].clientY;
          ppDx = moveX - ppStartX;

          if (Math.abs(moveY - ppStartY) > Math.abs(ppDx)) {
            ppDragging = false;
            return;
          }

          var basePct = -(ppCurrent * 100);
          var dragPct = (ppDx / viewport.offsetWidth) * 100;
          var t = 'translateX(' + (basePct + dragPct) + '%)';
          if (profileTrack) profileTrack.style.transform = t;
          if (pricingTrack) pricingTrack.style.transform = t;
        }, { passive: true });

        viewport.addEventListener('touchend', function() {
          if (!ppDragging) {
            if (profileTrack) profileTrack.style.transition = '';
            if (pricingTrack) pricingTrack.style.transition = '';
            return;
          }
          ppDragging = false;
          if (profileTrack) profileTrack.style.transition = '';
          if (pricingTrack) pricingTrack.style.transition = '';

          var threshold = viewport.offsetWidth * 0.2;
          if (ppDx < -threshold) ppGoTo(ppCurrent + 1);
          else if (ppDx > threshold) ppGoTo(ppCurrent - 1);
          else ppGoTo(ppCurrent);
        });
      }

      // ── CTA click selects plan ──
      if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
          quizData.plan = ppCtaConfig[ppCurrent].plan;
          advance();
        });
      }

      // ── Timer using existing localStorage-based quiz timer ──
      var ppEndTime = localStorage.getItem('clm_timer_end');
      if (!ppEndTime) {
        ppEndTime = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem('clm_timer_end', ppEndTime);
      }
      ppEndTime = parseInt(ppEndTime);

      var ppTH = document.getElementById('ppTH');
      var ppTM = document.getElementById('ppTM');
      var ppTS = document.getElementById('ppTS');

      function ppPad(n) { return n < 10 ? '0' + n : '' + n; }

      function ppTick() {
        var diff = Math.max(0, ppEndTime - Date.now());
        var h = Math.floor(diff / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var sec = Math.floor((diff % 60000) / 1000);
        if (ppTH) ppTH.textContent = ppPad(h);
        if (ppTM) ppTM.textContent = ppPad(m);
        if (ppTS) ppTS.textContent = ppPad(sec);
      }

      ppTick();
      setInterval(ppTick, 1000);

      // ── Billing toggle (monthly/annual) ──
      var ppIsAnnual = true;
      var ppToggleTrack = document.getElementById('ppToggleTrack');
      var ppLabelMonthly = document.getElementById('ppLabelMonthly');
      var ppLabelAnnual = document.getElementById('ppLabelAnnual');

      var ppPrices = {
        annual: { base: {old:'$49', price:'$19', note:'на місяць, оплата раз на рік'},
                  pro: {old:'$249', price:'$99', note:'на місяць, оплата раз на рік'},
                  premium: {old:'$599', price:'$299', note:'на місяць, оплата раз на рік'} },
        monthly: { base: {old:'$29', price:'$24', note:'на місяць, помісячна оплата'},
                   pro: {old:'$149', price:'$124', note:'на місяць, помісячна оплата'},
                   premium: {old:'$399', price:'$349', note:'на місяць, помісячна оплата'} }
      };

      function ppUpdatePrices() {
        var mode = ppIsAnnual ? 'annual' : 'monthly';
        var p = ppPrices[mode];
        var elOldBase = document.getElementById('ppOldBase');
        var elPriceBase = document.getElementById('ppPriceBase');
        var elNoteBase = document.getElementById('ppNoteBase');
        var elOldPro = document.getElementById('ppOldPro');
        var elPricePro = document.getElementById('ppPricePro');
        var elNotePro = document.getElementById('ppNotePro');
        var elOldPremium = document.getElementById('ppOldPremium');
        var elPricePremium = document.getElementById('ppPricePremium');
        var elNotePremium = document.getElementById('ppNotePremium');

        if (elOldBase) elOldBase.textContent = p.base.old;
        if (elPriceBase) elPriceBase.innerHTML = p.base.price + '<span class="period">/міс</span>';
        if (elNoteBase) elNoteBase.textContent = p.base.note;
        if (elOldPro) elOldPro.textContent = p.pro.old;
        if (elPricePro) elPricePro.innerHTML = p.pro.price + '<span class="period">/міс</span>';
        if (elNotePro) elNotePro.textContent = p.pro.note;
        if (elOldPremium) elOldPremium.textContent = p.premium.old;
        if (elPricePremium) elPricePremium.innerHTML = p.premium.price + '<span class="period">/міс</span>';
        if (elNotePremium) elNotePremium.textContent = p.premium.note;

        if (ppToggleTrack) {
          if (ppIsAnnual) ppToggleTrack.classList.add('annual');
          else ppToggleTrack.classList.remove('annual');
        }
        if (ppLabelMonthly) ppLabelMonthly.classList.toggle('active', !ppIsAnnual);
        if (ppLabelAnnual) ppLabelAnnual.classList.toggle('active', ppIsAnnual);

        quizData.billing = ppIsAnnual ? 'annual' : 'monthly';
      }

      function ppToggleBilling() {
        ppIsAnnual = !ppIsAnnual;
        ppUpdatePrices();
      }

      if (ppToggleTrack) ppToggleTrack.addEventListener('click', function(e) { e.stopPropagation(); ppToggleBilling(); });
      if (ppLabelMonthly) ppLabelMonthly.addEventListener('click', function(e) { e.stopPropagation(); ppIsAnnual = false; ppUpdatePrices(); });
      if (ppLabelAnnual) ppLabelAnnual.addEventListener('click', function(e) { e.stopPropagation(); ppIsAnnual = true; ppUpdatePrices(); });

      // Set default plan to PRO
      ppGoTo(1);
      quizData.billing = 'annual';
    }, 100);

  }

  // ---- Transition Marketing ----
  function renderTransitionMarketingCard(wrap) {
    var html =
      '<div style="text-align:center;padding:20px 0">' +
        '<div style="width:48px;height:48px;border-radius:14px;background:#f59e0b;display:flex;align-items:center;justify-content:center;margin:0 auto 16px"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 11-5.8-1.6"/></svg></div>' +
        '<p style="font-size:14px;color:#64748b;line-height:1.5">Дайте відповідь на кілька питань про ваш поточний маркетинг — і ми побудуємо найкращий план для вас.</p>' +
      '</div>';
    var d = el('div', '', html);
    wrap.appendChild(d);
  }

  // ---- Upload Files Card ----
  function renderUploadFilesCard(wrap) {
    var html =
      '<div style="text-align:center;padding:10px 0 16px">' +
        '<div style="width:48px;height:48px;border-radius:14px;background:#00b4d8;display:flex;align-items:center;justify-content:center;margin:0 auto 12px"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>' +
        '<p style="font-size:13px;color:#94a3b8;margin-bottom:16px">Завантажте файли — AI створить професійний профіль. Цей крок можна пропустити.</p>' +
      '</div>';
    var d = el('div', '', html);
    wrap.appendChild(d);

    var uploads = [
      {text:'Завантажити фото (необовʼязково)', accept:'image/*', field:'photo'},
      {text:'Завантажити CV (необовʼязково)', accept:'.pdf,.doc,.docx', field:'cv'},
      {text:'Завантажити лого компанії (необовʼязково)', accept:'image/*', field:'company_logo'}
    ];

    uploads.forEach(function(u) {
      var area = el('div', 'upload-area');
      area.innerHTML = '<div class="upload-text">' + u.text + '</div>';
      var inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = u.accept;
      inp.style.display = 'none';
      inp.addEventListener('change', function() {
        if (inp.files.length) {
          area.querySelector('.upload-text').textContent = inp.files[0].name;
          area.classList.add('uploaded');
        }
      });
      area.appendChild(inp);
      area.addEventListener('click', function() { inp.click(); });
      wrap.appendChild(area);
    });
  }

  // ---- Payment ----
  function renderPaymentCard(wrap) {
    var plan = quizData.plan || 'pro';
    var planNames = {base:'Base', pro:'Pro', premium:'Premium'};

    var prices = {
      '1_month': {base:24, pro:124, premium:349, label:'1 місяць', discount:0},
      '1_year':  {base:19, pro:99,  premium:299, label:'1 рік',  discount:10},
      '3_years': {base:15, pro:79,  premium:249, label:'3 роки', discount:20}
    };

    var html = '';

    // ── Timer at top ──
    html += '<div class="pay-timer-top">';
    html += '<div class="pay-timer-label">ЗНИЖКА 20% ДЛЯ ВАС!</div>';
    html += '<div class="pay-timer-digits">';
    html += '<span class="pay-t-block"><span class="pay-t-num" id="payTH">23</span><span class="pay-t-lbl">год</span></span>';
    html += '<span class="pay-t-sep">:</span>';
    html += '<span class="pay-t-block"><span class="pay-t-num" id="payTM">59</span><span class="pay-t-lbl">хв</span></span>';
    html += '<span class="pay-t-sep">:</span>';
    html += '<span class="pay-t-block"><span class="pay-t-num" id="payTS">59</span><span class="pay-t-lbl">сек</span></span>';
    html += '</div></div>';

    // ── Period toggle (1 month / 1 year / 3 years) ──
    html += '<div class="pay-period-toggle" id="payPeriodToggle">';
    html += '<button class="pay-period-btn" data-period="1_month">1 місяць</button>';
    html += '<button class="pay-period-btn active" data-period="1_year">1 рік <span class="pay-period-save">-10%</span></button>';
    html += '<button class="pay-period-btn" data-period="3_years">3 роки <span class="pay-period-save">-20%</span></button>';
    html += '</div>';

    // ── Savings hero ──
    html += '<div class="pay-savings-hero" id="paySavingsHero">';
    html += '<div class="pay-savings-amount" id="paySavingsAmount">$475</div>';
    html += '<div class="pay-savings-text">ВИ ЩОЙНО ЗАОЩАДИЛИ</div>';
    html += '</div>';

    // ── Discount summary ──
    html += '<div class="discount-summary" id="payDiscountSummary"></div>';

    // ── Payment icons ──
    html += '<div class="payment-icons"><svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#1434CB"/><text x="19" y="15" font-size="9" fill="#fff" text-anchor="middle" font-weight="bold" font-family="Arial">VISA</text></svg><svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#252525"/><circle cx="15" cy="12" r="7" fill="#EB001B"/><circle cx="23" cy="12" r="7" fill="#F79E1B"/><path d="M19 6.5a7 7 0 010 11 7 7 0 010-11z" fill="#FF5F00"/></svg><svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#003087"/><text x="19" y="15" font-size="7" fill="#fff" text-anchor="middle" font-weight="bold" font-family="Arial">PayPal</text></svg></div>';

    // ── Payment buttons ──
    html += '<div class="payment-buttons"><button class="btn btn-paypal" id="paypalBtn"><img class="btn-icon-paypal" src="icon/paypal.svg" alt="" width="24" height="24"> Сплатити PayPal</button><button class="btn btn-primary" id="cardBtn"><img class="btn-icon-card" src="icon/card-credit.svg" alt="" width="24" height="24"> Сплатити карткою</button></div>';

    // ── FAQ ──
    html += '<h3 class="faq-heading">Часті питання</h3>';
    html += '<div class="faq-list">';
    html += '<div class="faq-item"><div class="faq-question">Скільки клієнтів очікувати на місяць?</div><div class="faq-answer"><div class="faq-answer-inner">Залежно від вашої спеціалізації, міста і оптимізації профілю — багато юристів отримують 5-15 клієнтів вже у перший місяць, з ростом до 20-30+ з часом завдяки AI-контенту і SEO-просуванню.</div></div></div>';
    html += '<div class="faq-item"><div class="faq-question">Це гарантована кількість клієнтів?</div><div class="faq-answer"><div class="faq-answer-inner">Ми надаємо ліди, з якими ви працюєте самостійно. Також можна працювати на ексклюзивних умовах з клієнтами платформи — це вже оплачені клієнти.</div></div></div>';
    html += '<div class="faq-item"><div class="faq-question">Як працює прайс?</div><div class="faq-answer"><div class="faq-answer-inner">У нас тришарова підписка: Base, Pro і Premium. Ціна значно нижча за традиційні маркетингові агенції. Багато юристів окупають підписку всього з 1-2 клієнтів.</div></div></div>';
    html += '<div class="faq-item"><div class="faq-question">Що якщо клієнтів немає?</div><div class="faq-answer"><div class="faq-answer-inner">Наявність лідів залежить від вашої активності на платформі. Ми гарантуємо безперервний доступ до платформи і її ресурсів. Оплата не повертається після надання доступу.</div></div></div>';
    html += '<div class="faq-item"><div class="faq-question">Чи мої дані в безпеці?</div><div class="faq-answer"><div class="faq-answer-inner">Так, ми використовуємо безпечний месенджер, шифрування даних, і не передаємо інформацію третім особам. Платформа відповідає GDPR і правилам захисту даних.</div></div></div>';
    html += '</div>';

    var d = el('div', '', html);
    wrap.appendChild(d);

    setTimeout(function() {
      // FAQ accordion
      wrap.querySelectorAll('.faq-question').forEach(function(q) {
        q.addEventListener('click', function() { q.parentElement.classList.toggle('open'); });
      });

      // Period toggle logic
      var currentPeriod = quizData.period || '1_year';
      var periodBtns = document.querySelectorAll('#payPeriodToggle .pay-period-btn');

      function payUpdateSummary() {
        var p = prices[currentPeriod];
        var planKey = quizData.plan || 'pro';
        var months = currentPeriod === '1_month' ? 1 : currentPeriod === '1_year' ? 12 : 36;
        var fullPrice = {base:29, pro:149, premium:399}[planKey] * months;

        // Compute actual discount amounts (each applied to fullPrice)
        var urgencyAmt = Math.round(fullPrice * 0.2);
        var referralAmt = quizData.referral_code ? Math.round(fullPrice * 0.1) : 0;
        var periodAmt = p.discount > 0 ? Math.round(fullPrice * p.discount / 100) : 0;
        var totalDiscount = urgencyAmt + referralAmt + periodAmt;
        var total = Math.max(0, fullPrice - totalDiscount);
        var saved = fullPrice - total;

        var summaryEl = document.getElementById('payDiscountSummary');
        if (summaryEl) {
          summaryEl.innerHTML =
            '<div class="discount-row"><span>' + planNames[planKey] + ' тариф — ' + p.label + '</span><span>$' + fullPrice.toLocaleString() + '</span></div>' +
            '<div class="discount-row"><span>Знижка за терміновість (20%)</span><span class="saved">-$' + urgencyAmt.toLocaleString() + '</span></div>' +
            (referralAmt > 0 ? '<div class="discount-row"><span>Реферальний код (10%)</span><span class="saved">-$' + referralAmt.toLocaleString() + '</span></div>' : '') +
            (periodAmt > 0 ? '<div class="discount-row"><span>' + p.label + ' знижка (' + p.discount + '%)</span><span class="saved">-$' + periodAmt.toLocaleString() + '</span></div>' : '') +
            '<div class="discount-row total"><span>Разом</span><span>$' + total.toLocaleString() + '</span></div>';
        }

        var savingsAmount = document.getElementById('paySavingsAmount');
        var savingsHero = document.getElementById('paySavingsHero');
        if (savingsAmount && saved > 0) {
          savingsAmount.textContent = '$' + saved.toLocaleString();
          if (savingsHero) savingsHero.style.display = '';
        } else if (savingsHero && saved <= 0) {
          savingsHero.style.display = 'none';
        }

        // Update period buttons
        periodBtns.forEach(function(b) {
          b.classList.toggle('active', b.dataset.period === currentPeriod);
        });

        quizData.payment_period = currentPeriod;
      }

      periodBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          currentPeriod = btn.dataset.period;
          payUpdateSummary();
        });
      });

      payUpdateSummary();

      // Timer
      var payEndTime = localStorage.getItem('clm_timer_end');
      if (!payEndTime) {
        payEndTime = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem('clm_timer_end', payEndTime);
      }
      payEndTime = parseInt(payEndTime);
      var payTH = document.getElementById('payTH');
      var payTM = document.getElementById('payTM');
      var payTS = document.getElementById('payTS');
      function payPad(n) { return n < 10 ? '0' + n : '' + n; }
      function payTick() {
        var diff = Math.max(0, payEndTime - Date.now());
        var h = Math.floor(diff / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var sec = Math.floor((diff % 60000) / 1000);
        if (payTH) payTH.textContent = payPad(h);
        if (payTM) payTM.textContent = payPad(m);
        if (payTS) payTS.textContent = payPad(sec);
      }
      payTick();
      setInterval(payTick, 1000);

      // ---- Submit on Pay click (final step of the quiz) ----
      function handlePay(method) {
        return function (e) {
          if (e && e.preventDefault) e.preventDefault();
          quizData.payment_method = method;
          quizData.submitted_at = new Date().toISOString();
          var btn = e && e.currentTarget;
          if (btn) { btn.disabled = true; btn.dataset._origText = btn.innerHTML; btn.innerHTML = 'Надсилання…'; }
          submitQuizData(function (ok, status, body) {
            if (btn) { btn.disabled = false; if (btn.dataset._origText) btn.innerHTML = btn.dataset._origText; }
            if (ok) {
              try { localStorage.removeItem(STORAGE_KEY); } catch (er) {}
              alert('Дякуємо! Ваша заявка прийнята.');
            } else {
              alert('Не вдалося надіслати (status ' + status + '). Спробуйте ще раз.');
            }
          });
        };
      }
      var paypalBtn = document.getElementById('paypalBtn');
      var cardBtn = document.getElementById('cardBtn');
      if (paypalBtn) paypalBtn.addEventListener('click', handlePay('paypal'));
      if (cardBtn) cardBtn.addEventListener('click', handlePay('card'));
    }, 100);
  }

  // ---- Timer ----
  var timerInterval = null;
  function startTimer() {
    if (timerInterval) return;
    var endTime = localStorage.getItem('clm_timer_end');
    if (!endTime) {
      endTime = Date.now() + 24*60*60*1000;
      localStorage.setItem('clm_timer_end', endTime);
    }
    endTime = parseInt(endTime);

    function tick() {
      var diff = Math.max(0, endTime - Date.now());
      var h = Math.floor(diff/3600000);
      var m = Math.floor((diff%3600000)/60000);
      var sec = Math.floor((diff%60000)/1000);
      var str = String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0');
      var t1 = document.getElementById('timerCountdown');
      var t2 = document.getElementById('timerCountdown2');
      if (t1) t1.textContent = str;
      if (t2) t2.textContent = str;
      if (diff <= 0) { clearInterval(timerInterval); timerInterval = null; }
    }
    tick();
    timerInterval = setInterval(tick, 1000);
  }

  // ---- Keyboard nav ----
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && current > 1) goBack();
  });

  // ---- Start ----
  advance();

})();
