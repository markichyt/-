// ============================================
// ConsultantLM Quiz v9 — Stacked Cards with Depth
// ============================================

(function () {
  'use strict';

  var current = 0;
  var quizData = {};
  var history = [];

  // ===== Pre-warm all animation scenes (loads images & CSS into browser cache) =====
  // Runs at quiz init while user is on slide 1. By the time they reach an animation
  // slide, all 6 scenes are fully cached — no visible "loading" of avatar PNGs etc.
  (function preWarmScenes() {
    var scenes = [
      './htmlTOvideo/8/ConsultantLM Promo.html',
      './htmlTOvideo/2/ConsultantLM Promo 2.html',
      './htmlTOvideo/9/ConsultantLM Promo.html',
      './htmlTOvideo/1/ConsultantLM Promo 1.html',
      './htmlTOvideo/3/ConsultantLM Promo 3.html',
      './htmlTOvideo/6/ConsultantLM Promo 6.html'
    ];
    var container = document.createElement('div');
    container.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;visibility:hidden;pointer-events:none;overflow:hidden';
    container.setAttribute('aria-hidden', 'true');
    scenes.forEach(function (src) {
      var f = document.createElement('iframe');
      f.src = encodeURI(src);
      f.setAttribute('tabindex', '-1');
      f.setAttribute('aria-hidden', 'true');
      f.style.cssText = 'width:1px;height:1px;border:0';
      container.appendChild(f);
    });
    document.body.appendChild(container);
  })();

  // ===== CONFIGURATION =====
  // ⚠ Replace with your actual endpoint:
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

  // ===== US Cities for city dropdown (~50 largest) =====
  var US_CITIES = [
    'New York, NY','Los Angeles, CA','Chicago, IL','Houston, TX','Phoenix, AZ',
    'Philadelphia, PA','San Antonio, TX','San Diego, CA','Dallas, TX','San Jose, CA',
    'Austin, TX','Jacksonville, FL','Fort Worth, TX','Columbus, OH','Charlotte, NC',
    'San Francisco, CA','Indianapolis, IN','Seattle, WA','Denver, CO','Washington, DC',
    'Boston, MA','El Paso, TX','Nashville, TN','Detroit, MI','Oklahoma City, OK',
    'Portland, OR','Las Vegas, NV','Memphis, TN','Louisville, KY','Baltimore, MD',
    'Milwaukee, WI','Albuquerque, NM','Tucson, AZ','Fresno, CA','Sacramento, CA',
    'Kansas City, MO','Mesa, AZ','Atlanta, GA','Omaha, NE','Colorado Springs, CO',
    'Raleigh, NC','Miami, FL','Long Beach, CA','Virginia Beach, VA','Oakland, CA',
    'Minneapolis, MN','Tulsa, OK','Arlington, TX','Tampa, FL','New Orleans, LA',
    'Wichita, KS','Cleveland, OH','Bakersfield, CA','Aurora, CO','Anaheim, CA',
    'Honolulu, HI','Santa Ana, CA','Riverside, CA','Corpus Christi, TX','Lexington, KY',
    'Stockton, CA','Henderson, NV','Saint Paul, MN','St. Louis, MO','Cincinnati, OH',
    'Pittsburgh, PA','Greensboro, NC','Anchorage, AK','Plano, TX','Lincoln, NE',
    'Orlando, FL','Irvine, CA','Newark, NJ','Toledo, OH','Durham, NC',
    'Chula Vista, CA','Fort Wayne, IN','Jersey City, NJ','St. Petersburg, FL','Laredo, TX',
    'Madison, WI','Chandler, AZ','Buffalo, NY','Lubbock, TX','Scottsdale, AZ',
    'Reno, NV','Glendale, AZ','Gilbert, AZ','Winston-Salem, NC','North Las Vegas, NV',
    'Norfolk, VA','Chesapeake, VA','Garland, TX','Irving, TX','Hialeah, FL',
    'Fremont, CA','Boise, ID','Richmond, VA','Baton Rouge, LA','Spokane, WA'
  ];

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
      q:'Which best describes your <span class="accent">profession?</span>',
      sub:'Select your area of expertise',
      options:[
        {v:'attorney',t:'Attorney',icon:'scales',color:'#6366f1'},
        {v:'lawyer',t:'Lawyer',icon:'briefcase',color:'#3b82f6'},
        {v:'notary',t:'Notary',icon:'stamp',color:'#8b5cf6'},
        {v:'patent_attorney',t:'Patent Attorney',icon:'file-text',color:'#0ea5e9'},
        {v:'cpa',t:'CPA',icon:'bar-chart',color:'#10b981'},
        {v:'tax_specialist',t:'Tax Specialist',icon:'dollar',color:'#14b8a6'},
        {v:'other',t:'Other',icon:'briefcase',color:'#64748b'}
      ]},
    // 2. socialProof video
    { type:'card', id:'videoProof', q:'', sub:'' },
    // 3. zip
    { type:'city', field:'city', q:'Your <span class="accent">work city?</span>', sub:'Pick from the list or type any US city' },
    // 4. role
    { type:'radio', field:'role', q:'Which best describes your <span class="accent">role?</span>', sub:'Help us personalize your experience',
      options:[
        {v:'self_employed',t:'Self-employed / Working independently',icon:'user',color:'#3b82f6'},
        {v:'employee',t:'Employee (in a company)',icon:'building',color:'#8b5cf6'},
        {v:'executive',t:'Company executive / Manager',icon:'crown',color:'#f59e0b'},
        {v:'founder',t:'Founder / Business owner',icon:'rocket',color:'#10b981'}
      ]},
    // 5. services (filtered + select all)
    { type:'checkbox', field:'services', q:'What services do you <span class="accent">provide?</span>', sub:'Select all that apply',
      options:[
        {v:'banking_finance',     t:'Banking and Finance',  icon:'dollar',    color:'#3b82f6'},
        {v:'real_estate',         t:'Real Estate',          icon:'home',      color:'#f59e0b'},
        {v:'labour_law',          t:'Labour Law',           icon:'briefcase', color:'#8b5cf6'},
        {v:'intellectual_property',t:'Intellectual Property',icon:'file-text', color:'#7c3aed'},
        {v:'general',             t:'General',              icon:'scales',    color:'#6366f1'},
        {v:'family_law',          t:'Family Law',           icon:'users',     color:'#ef4444'},
        {v:'business',            t:'Business',             icon:'bar-chart', color:'#0ea5e9'},
        {v:'taxes',               t:'Taxes',                icon:'dollar',    color:'#10b981'},
        {v:'cars',                t:'Cars',                 icon:'car',       color:'#ec4899'},
        {v:'employment',          t:'Employment',           icon:'user',      color:'#14b8a6'},
        {v:'immigration_law',     t:'Immigration Law',      icon:'globe',     color:'#0284c7'}
      ]},
    // 6. quickContact — name + email + phone + photo before AI calc (early capture)
    { type:'formWithFiles', id:'quickContact',
      q:'Let\'s get to <span class="accent">know you</span>',
      sub:'A few quick details before we calculate your potential',
      fields:[
        {label:'First Name', field:'first_name', type:'text', ph:'John'},
        {label:'Last Name', field:'last_name', type:'text', ph:'Davis'},
        {label:'Email', field:'email', type:'email', ph:'john@example.com'},
        {label:'Phone', field:'phone', type:'tel', ph:'+1 (555) 123-4567'},
        {label:'Your photo', field:'photo_name', type:'file', accept:'image/*'}
      ] },
    // 7. aiCalc
    { type:'card', id:'aiCalc', q:'Your <span class="accent">AI-powered</span> potential', sub:'Based on your data, our AI calculated your potential on ConsultantLM' },
    // 10. channels
    { type:'checkbox', field:'channels', q:'Where is your business <span class="accent">listed?</span>', sub:'Choose all that apply', skip:'Skip for now',
      options:[
        {v:'instagram',t:'Instagram or Facebook',icon:'instagram',color:'#e1306c'},
        {v:'website',t:'My own website',icon:'globe',color:'#64748b'},
        {v:'tiktok',t:'TikTok',icon:'tiktok',color:'#000000'},
        {v:'youtube',t:'YouTube',icon:'play',color:'#ff0000'},
        {v:'linkedin',t:'LinkedIn',icon:'linkedin',color:'#0a66c2'},
        {v:'twitter',t:'X (Twitter)',icon:'x-twitter',color:'#000000'},
        {v:'telegram',t:'Telegram',icon:'send',color:'#0088cc'},
        {v:'reddit',t:'Reddit',icon:'share',color:'#ff4500'},
        {v:'other_channel',t:'Other',icon:'plus',color:'#94a3b8'}
      ]},
    // 11. preferred_way (+ disclaimer)
    { type:'radio', field:'preferred_way', q:'What\'s your preferred way to get <span class="accent">more customers?</span>', sub:'How would you like to grow',
      options:[
        {v:'social_media',t:'Social media',icon:'share',color:'#8b5cf6'},
        {v:'paid_ads',t:'Paid ads',icon:'megaphone',color:'#f59e0b'},
        {v:'both',t:'Both',icon:'layers',color:'#3b82f6'},
        {v:'ai_decide',t:'No plan yet — AI can decide',icon:'sparkle',color:'#10b981'}
      ]},
    // 12. marketing_time
    { type:'radio', field:'marketing_time', q:'How many hours a day do you spend on <span class="accent">marketing?</span>', sub:'Including social media, content creation, and blogging',
      options:[
        {v:'none',t:"I don't spend time on marketing",icon:'x-circle',color:'#94a3b8'},
        {v:'less_1',t:'Less than 1 hour',icon:'clock',color:'#3b82f6'},
        {v:'1_5',t:'1-5 hours',icon:'clock',color:'#f59e0b'},
        {v:'5_plus',t:'5+ hours',icon:'clock',color:'#ef4444'}
      ]},
    // 13. ad_budget (simplified)
    { type:'radio', field:'ad_budget', q:'What\'s your monthly <span class="accent">ad budget?</span>', sub:'Approximate',
      options:[
        {v:'none',t:"I don't spend",icon:'x-circle',color:'#94a3b8'},
        {v:'under_1k',t:'Up to $1,000',icon:'dollar',color:'#10b981'},
        {v:'1k_10k',t:'$1,000 – $10,000',icon:'dollar',color:'#3b82f6'},
        {v:'over_10k',t:'More than $10,000',icon:'diamond',color:'#f59e0b'}
      ]},
    // 14. team
    { type:'checkbox', field:'team', q:'Who\'s on your <span class="accent">marketing team?</span>', sub:'Select all roles you currently hire', skip:"I don't have a team",
      options:[
        {v:'seo',t:'Content Researcher / SEO Specialist',icon:'search',color:'#3b82f6'},
        {v:'scriptwriter',t:'Scriptwriter',icon:'pen',color:'#8b5cf6'},
        {v:'videographer',t:'Videographer',icon:'camera',color:'#ef4444'},
        {v:'video_editor',t:'Video Editor',icon:'film',color:'#f97316'},
        {v:'smm',t:'Digital Advertiser / SMM',icon:'megaphone',color:'#10b981'},
        {v:'crm_manager',t:'CRM / Inquiry Manager',icon:'users',color:'#0ea5e9'}
      ]},
    // 17. tenx
    { type:'card', id:'tenx', q:'We cracked the code to deliver <span class="accent">10x better results</span>', sub:'Replace a $5K–$30K marketing team — just 15 minutes a day' },
    // 18. video1
    { type:'card', id:'video1', q:'', sub:'' },
    // 19. video2
    { type:'card', id:'video2', q:'', sub:'' },
    // 20. videoAds
    { type:'card', id:'videoAds', q:'', sub:'' },
    // 21. videoSocials
    { type:'card', id:'videoSocials', q:'', sub:'' },
    // 22. wowRoi — interactive ROI calculator with plan tabs
    { type:'card', id:'wowRoi',
      q:'Meet your <span class="accent">future</span> on ConsultantLM',
      sub:"Here's your personalized profile + Estimated Pipeline Value" },
    // 23. period
    { type:'radio', field:'period', q:'How long do you want to <span class="accent">collaborate?</span>', sub:'Longer periods get better pricing',
      options:[
        {v:'1_month',t:'1 month',icon:'calendar',color:'#64748b'},
        {v:'1_year',t:'1 year (Save 10%)',icon:'calendar',color:'#3b82f6'},
        {v:'3_years',t:'3 years (Save 20%)',icon:'calendar',color:'#10b981'}
      ]},
    // 24. time_on_platform
    { type:'radio', field:'time_on_platform', q:'How much time can you spend on <span class="accent">ConsultantLM</span> each week?', sub:'This helps us tailor your plan',
      options:[
        {v:'15min',t:'15 minutes a day',icon:'clock',color:'#10b981'},
        {v:'30min',t:'30 minutes a day',icon:'clock',color:'#3b82f6'},
        {v:'1hr',t:'1 hour a day',icon:'clock',color:'#8b5cf6'},
        {v:'more',t:'More than 1 hour',icon:'clock',color:'#f59e0b'}
      ]},
    // 25. fullProfile — email already captured in quickContact (step 6); ZIP not required here
    // (fullProfile moved to AFTER payment)
    // 25. assessment
    { type:'card', id:'assessment', q:'Your estimated <span class="accent">pipeline value</span>', sub:'Based on your profession, location, services, and goals. Estimates only — not a guarantee.' },
    // 26. profilesPricing
    { type:'card', id:'profilesPricing', q:'Choose your <span class="accent">plan</span>', sub:'' },
    // 27. payment
    { type:'card', id:'payment', q:'Complete your <span class="accent">purchase</span>', sub:'' },
    // 28. fullProfile — after payment, user chooses between long About OR CV upload
    { type:'card', id:'fullProfile',
      q:'Complete your <span class="accent">profile</span>',
      sub:'Choose one — write a detailed bio (3 000+ characters) or upload your CV. Our AI will generate the rest.' }
  ];

  var TOTAL = slides.length;

  // ---- Helpers ----
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  // ---- Sticky action bar at bottom of card (variant C) ----
  // Usage: wrap.appendChild(actionBar(btn));
  //        wrap.appendChild(actionBar(infoEl, btn));
  //        wrap.appendChild(actionBar(skipEl, infoEl, btn));
  function actionBar() {
    var bar = el('div', 'card-action-bar');
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i]) bar.appendChild(arguments[i]);
    }
    return bar;
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
    if (quizData.city || quizData.zip) score += 10;
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
      if (s.type === 'card' || s.type === 'form' || s.type === 'formWithFiles' || s.type === 'services' || s.type === 'dualSlider') {
        cardContent.innerHTML = '';
        scrollWrap.appendChild(qEl);
        scrollWrap.appendChild(subEl);
        cardContent.appendChild(scrollWrap);
        wrap = scrollWrap;
      }
    }

    if (s.type === 'radio') renderRadio(s, wrap);
    else if (s.type === 'city') renderCity(s, wrap);
    else if (s.type === 'formWithFiles') renderFormWithFiles(s, wrap);
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

    // ── Eager-load iframes in the INCOMING card NOW (before 400ms swipe) ──
    // By the time the card finishes sliding into view, its animation is already running.
    behind1Card.querySelectorAll('iframe[data-src]').forEach(function (f) {
      var realSrc = f.getAttribute('data-src');
      if (realSrc && f.getAttribute('src') !== realSrc) {
        f.setAttribute('src', realSrc);
      }
    });

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
    calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    car:'<path d="M5 17h14M3 17v-4l2-5h14l2 5v4M7 13h10"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>'
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
            social_media: 'Automation: We help you create/manage social media automatically, content that builds trust and attracts customers.',
            paid_ads: 'Our AI ads should be an enhancer \u2014 we improve what you do.',
            both: 'Great choice! We\u2019ll combine both paid and organic approaches for maximum results.',
            ai_decide: 'You said trust? Great. AI will pick the best strategy for your business context and bring results.'
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

    var info = el('div', 'card-action-info', '');
    function updateInfo() {
      var n = selected.length;
      info.innerHTML = n > 0 ? '<span class="count">' + n + '</span> selected' : 'Select one or more';
    }

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
        updateInfo();
      });
      list.appendChild(item);
    });
    wrap.appendChild(list);
    updateInfo();

    var skip = null;
    if (s.skip) {
      skip = el('div', 'skip-link', s.skip);
      skip.addEventListener('click', function() { advance(); });
    }

    var btn = el('button', 'card-btn', 'Continue &rarr;');
    btn.addEventListener('click', function() { advance(); });
    wrap.appendChild(actionBar(skip, info, btn));
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

    var btn = el('button', 'card-btn', 'Continue &rarr;');
    btn.addEventListener('click', function() {
      var val = inp.value.trim();
      quizData[s.field] = val;
      advance();
    });
    wrap.appendChild(actionBar(btn));

    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') btn.click();
    });

    setTimeout(function() { inp.focus(); }, 500);
  }

  // ---- City (search + dropdown of US cities) ----
  function renderCity(s, wrap) {
    var searchWrap = el('div', 'svc-search-wrap');
    searchWrap.innerHTML = '<span class="svc-search-icon">' + getIconSVG('search') + '</span>';
    var inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'card-input search-input svc-search-input';
    inp.placeholder = 'Start typing city name';
    inp.autocomplete = 'address-level2';
    inp.name = 'city';
    if (quizData[s.field]) inp.value = quizData[s.field];
    searchWrap.appendChild(inp);
    wrap.appendChild(searchWrap);

    var dropdown = el('div', 'city-dropdown');
    dropdown.style.cssText = 'max-height:280px;overflow-y:auto;border:1px solid var(--border);border-radius:12px;margin-top:8px';
    wrap.appendChild(dropdown);

    function renderList(filter) {
      dropdown.innerHTML = '';
      var q = (filter || '').toLowerCase().trim();
      var matched = US_CITIES.filter(function(c) { return !q || c.toLowerCase().indexOf(q) > -1; });
      if (matched.length === 0) {
        var noRes = el('div', '', 'No match — press Continue to use your input.');
        noRes.style.cssText = 'padding:14px;color:var(--text-light);text-align:center;font-size:14px';
        dropdown.appendChild(noRes);
        return;
      }
      matched.forEach(function(c) {
        var item = el('div', '', '');
        item.style.cssText = 'padding:12px 16px;cursor:pointer;border-bottom:1px solid var(--border);font-size:15px;transition:background 0.15s';
        item.textContent = c;
        item.addEventListener('mouseenter', function() { item.style.background = 'var(--input-bg)'; });
        item.addEventListener('mouseleave', function() { item.style.background = ''; });
        item.addEventListener('click', function() {
          inp.value = c;
          quizData[s.field] = c;
          setTimeout(function() { advance(); }, 200);
        });
        dropdown.appendChild(item);
      });
    }

    renderList('');
    inp.addEventListener('input', function() { renderList(inp.value); });

    var btn = el('button', 'card-btn', 'Continue &rarr;');
    btn.addEventListener('click', function() {
      var val = inp.value.trim();
      quizData[s.field] = val;
      advance();
    });
    wrap.appendChild(actionBar(btn));

    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') btn.click();
    });

    setTimeout(function() { inp.focus(); }, 500);
  }

  // ---- FormWithFiles (flexible mix of text/email/tel/textarea/file inputs, no blocking validation) ----
  // Autocomplete map — drives browser/OS suggestion behavior on inputs
  var AUTOCOMPLETE_MAP = {
    first_name:    'given-name',
    last_name:     'family-name',
    email:         'email',
    phone:         'tel',
    zip:           'postal-code',
    city:          'address-level2',
    address:       'street-address',
    firm_name:     'organization',
    company_name:  'organization',
    referral_code: 'off',
    about:         'off'
  };

  function renderFormWithFiles(s, wrap) {
    var groups = [];

    s.fields.forEach(function(f) {
      var required = !f.optional;
      var grp = el('div', 'form-group');
      var labelHtml = '<label class="form-label">' + f.label + (required ? ' <em class="form-req">*</em>' : '') + '</label>';
      grp.innerHTML = labelHtml;

      var controlEl;
      var isValid = function() {
        if (!required) return true;
        if (f.type === 'file') return !!quizData[f.field];
        if (f.type === 'email') {
          var v = (quizData[f.field] || '').trim();
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        }
        return !!(quizData[f.field] && String(quizData[f.field]).trim());
      };

      if (f.type === 'file') {
        var area = el('div', 'upload-area', '');
        var lbl = el('div', 'upload-text', quizData[f.field] || f.label);
        area.appendChild(lbl);
        var fileInp = document.createElement('input');
        fileInp.type = 'file';
        if (f.accept) fileInp.accept = f.accept;
        fileInp.style.display = 'none';
        area.appendChild(fileInp);
        area.addEventListener('click', function() { fileInp.click(); });
        fileInp.addEventListener('change', function() {
          if (fileInp.files.length) {
            var name = fileInp.files[0].name;
            quizData[f.field] = name;
            lbl.textContent = name;
            area.classList.add('uploaded');
            grp.classList.remove('form-group--invalid');
          }
        });
        if (quizData[f.field]) area.classList.add('uploaded');
        grp.appendChild(area);
        controlEl = area;
      } else if (f.type === 'textarea') {
        var ta = document.createElement('textarea');
        ta.className = 'card-input';
        ta.rows = 4;
        ta.placeholder = f.ph || '';
        ta.name = f.field;
        ta.autocomplete = f.autocomplete || AUTOCOMPLETE_MAP[f.field] || 'off';
        if (quizData[f.field]) ta.value = quizData[f.field];
        ta.addEventListener('input', function() {
          quizData[f.field] = ta.value;
          if (isValid()) grp.classList.remove('form-group--invalid');
        });
        grp.appendChild(ta);
        controlEl = ta;
      } else {
        var inp = document.createElement('input');
        inp.type = f.type || 'text';
        inp.className = 'card-input';
        inp.placeholder = f.ph || '';
        inp.name = f.field;
        inp.autocomplete = f.autocomplete || AUTOCOMPLETE_MAP[f.field] || 'on';
        if (f.field === 'email') inp.inputMode = 'email';
        if (f.type === 'tel') inp.inputMode = 'tel';
        if (quizData[f.field]) inp.value = quizData[f.field];
        inp.addEventListener('input', function() {
          quizData[f.field] = inp.value;
          if (isValid()) grp.classList.remove('form-group--invalid');
        });
        grp.appendChild(inp);
        controlEl = inp;
      }
      wrap.appendChild(grp);
      groups.push({ field: f, grp: grp, isValid: isValid });
    });

    var btn = el('button', 'card-btn', 'Continue &rarr;');
    btn.addEventListener('click', function() {
      var firstInvalid = null;
      groups.forEach(function(g) {
        if (g.isValid()) {
          g.grp.classList.remove('form-group--invalid');
        } else {
          g.grp.classList.add('form-group--invalid');
          if (!firstInvalid) firstInvalid = g.grp;
        }
      });
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      advance();
    });
    wrap.appendChild(actionBar(btn));
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
    searchInput.placeholder = 'Search services...';
    searchWrap.appendChild(searchInput);
    wrap.appendChild(searchWrap);

    var tree = el('div', 'category-tree');

    var allCategories = [
      { name:'Family Law', icon:'scales', color:'#6366f1', subs:[
        { name:'Divorce', items:[{s:'divorce_contested',t:'Contested Divorce'},{s:'divorce_uncontested',t:'Uncontested Divorce'},{s:'divorce_mediation',t:'Divorce Mediation'}]},
        { name:'Property Division', items:[{s:'property_division',t:'Property Division'},{s:'asset_valuation',t:'Asset Valuation'}]},
        { name:'Alimony', items:[{s:'alimony_spousal',t:'Spousal Support'},{s:'alimony_modification',t:'Alimony Modification'}]},
        { name:'Child Custody', items:[{s:'custody_joint',t:'Joint Custody'},{s:'custody_sole',t:'Sole Custody'},{s:'custody_visitation',t:'Visitation Rights'}]},
        { name:'Adoption', items:[{s:'adoption_domestic',t:'Domestic Adoption'},{s:'adoption_international',t:'International Adoption'}]}
      ]},
      { name:'Criminal Law', icon:'shield', color:'#ef4444', subs:[
        { name:'Criminal Defense', items:[{s:'criminal_defense',t:'General Criminal Defense'},{s:'assault_defense',t:'Assault Defense'}]},
        { name:'DUI Defense', items:[{s:'dui_first',t:'First Offense DUI'},{s:'dui_repeat',t:'Repeat DUI'}]},
        { name:'Drug Offenses', items:[{s:'drug_possession',t:'Drug Possession'},{s:'drug_trafficking',t:'Drug Trafficking'}]},
        { name:'White Collar Crime', items:[{s:'fraud',t:'Fraud'},{s:'embezzlement',t:'Embezzlement'}]}
      ]},
      { name:'Real Estate', icon:'home', color:'#f59e0b', subs:[
        { name:'Transactions', items:[{s:'real_estate_transactions',t:'Real Estate Transactions'},{s:'closings',t:'Closings'}]},
        { name:'Landlord & Tenant', items:[{s:'landlord_tenant',t:'Landlord-Tenant Disputes'},{s:'eviction',t:'Eviction'}]},
        { name:'Zoning & Land Use', items:[{s:'zoning',t:'Zoning'},{s:'land_use',t:'Land Use Permits'}]}
      ]},
      { name:'Immigration', icon:'globe', color:'#3b82f6', subs:[
        { name:'Visas', items:[{s:'work_visa',t:'Work Visas'},{s:'family_visa',t:'Family Visas'}]},
        { name:'Green Cards', items:[{s:'green_card_employment',t:'Employment-Based'},{s:'green_card_family',t:'Family-Based'}]},
        { name:'Deportation Defense', items:[{s:'deportation',t:'Deportation Defense'},{s:'asylum',t:'Asylum'}]}
      ]},
      { name:'Tax & Accounting', icon:'dollar', color:'#10b981', subs:[
        { name:'Tax Planning', items:[{s:'tax_planning',t:'Tax Planning'},{s:'tax_compliance',t:'Tax Compliance'}]},
        { name:'Tax Disputes', items:[{s:'tax_disputes',t:'Tax Disputes'},{s:'audit_representation',t:'Audit Representation'}]},
        { name:'Bookkeeping', items:[{s:'bookkeeping',t:'Bookkeeping'},{s:'payroll',t:'Payroll Services'}]}
      ]}
    ];

    // Filter categories based on profession
    var profCategoryMap = {
      attorney: ['Family Law', 'Criminal Law', 'Real Estate', 'Immigration'],
      lawyer: ['Family Law', 'Criminal Law', 'Real Estate', 'Immigration'],
      patent_attorney: null, // null = show all
      notary: ['Real Estate', 'Family Law'],
      cpa: ['Tax & Accounting', 'Real Estate'],
      tax_specialist: ['Tax & Accounting', 'Real Estate'],
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
        counterBadge.textContent = count + ' service' + (count !== 1 ? 's' : '') + ' selected';
        counterBadge.classList.add('visible');
      } else {
        counterBadge.textContent = '';
        counterBadge.classList.remove('visible');
      }
    }

    // "Select All" button
    var selectAllBtn = el('button', 'svc-select-all-btn', 'Select All');
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
    customInput.placeholder = 'Or type your own services...';
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

    var btn = el('button', 'card-btn', 'Continue &rarr;');
    btn.addEventListener('click', function() { advance(); });
    wrap.appendChild(actionBar(btn));
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

    var btn = el('button', 'card-btn', 'Continue &rarr;');
    btn.addEventListener('click', function() { advance(); });
    wrap.appendChild(actionBar(btn));
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

    var btn = el('button', 'card-btn', 'Continue &rarr;');
    btn.addEventListener('click', function() { advance(); });
    wrap.appendChild(actionBar(btn));
  }

  // ---- Form ----
  function renderForm(s, wrap) {
    var fields = [
      {label:'First Name', field:'first_name', type:'text', ph:'John'},
      {label:'Last Name', field:'last_name', type:'text', ph:'Davis'},
      {label:'Email', field:'email', type:'email', ph:'john@example.com'},
      {label:'Phone', field:'phone', type:'tel', ph:'+1 (555) 123-4567'},
      {label:'ZIP Code', field:'zip', type:'text', ph:'e.g. 10001'},
      {label:'Referral Code (optional)', field:'referral_code', type:'text', ph:'Enter code'}
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
    aboutGrp.innerHTML = '<label class="form-label">About yourself</label>';
    var ta = document.createElement('textarea');
    ta.className = 'card-input';
    ta.rows = 4;
    ta.placeholder = 'Tell us about your experience, education, achievements...';
    if (quizData.about) ta.value = quizData.about;
    ta.addEventListener('input', function() { quizData.about = ta.value; });
    aboutGrp.appendChild(ta);
    wrap.appendChild(aboutGrp);

    var errEl = el('div', '', '');
    errEl.style.cssText = 'color:#ef4444;font-size:13px;text-align:center;margin-top:8px;display:none';
    wrap.appendChild(errEl);

    var btn = el('button', 'card-btn', 'Continue &rarr;');
    btn.addEventListener('click', function() {
      advance();
    });
    wrap.appendChild(actionBar(btn));
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
    else if (s.id === 'assessment') renderAssessmentCard(wrap);
    else if (s.id === 'profilesPricing') renderProfilesPricingCard(wrap);
    else if (s.id === 'payment') renderPaymentCard(wrap);
    else if (s.id === 'videoProof') renderVideoCard(wrap, './htmlTOvideo/8/ConsultantLM Promo.html');
    else if (s.id === 'wowRoi') renderWowRoiCard(wrap);
    else if (s.id === 'fullProfile') renderFullProfileCard(wrap);

    if (s.id !== 'payment' && s.id !== 'profilesPricing' && s.id !== 'wowRoi' && s.id !== 'fullProfile') {
      var btn = el('button', 'card-btn', 'Continue &rarr;');
      btn.addEventListener('click', function() { advance(); });
      wrap.appendChild(actionBar(btn));
    }

    if (s.id === 'profilesPricing' || s.id === 'payment') startTimer();
  }

  // ---- AI Calculation ----
  function renderAICalcCard(wrap) {
    var prof = quizData.profession || 'attorney';
    var roleVal = quizData.role || 'self_employed';
    var loc = quizData.city || quizData.zip || '';
    var mult = {attorney:1,lawyer:0.95,patent_attorney:1.2,cpa:0.8,notary:0.6,tax_specialist:0.75,other:0.6};
    var roleMult = {founder:1.2,executive:1.15,self_employed:1.0,employee:0.85};
    var profLabels = {attorney:'Attorney',lawyer:'Lawyer',patent_attorney:'Patent Attorney',cpa:'CPA',notary:'Notary',tax_specialist:'Tax Specialist',other:'Specialist'};
    var roleLabels = {self_employed:'Self-employed',employee:'Employee',executive:'Executive',founder:'Founder'};

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
    var svcText = svcNames.length > 0 ? svcNames.slice(0,3).join(', ') + (svcNames.length > 3 ? '...' : '') : 'General';

    // ROI math: in-house marketing team in US legal sector — industry estimate
    var teamCostLow  = 5000;
    var teamCostHigh = 30000;
    var ourPlan = 199; // Pro tier — the rational recommendation
    var saveLow  = teamCostLow  - ourPlan;
    var saveHigh = teamCostHigh - ourPlan;

    var html =
      '<div class="stats-row">' +
        '<div class="stat-card"><div class="stat-label">SEO (Google)</div><div class="stat-value">'+seoMin+'–'+seoMax+'</div><div class="stat-trend">Leads/mo</div></div>' +
        '<div class="stat-card"><div class="stat-label">Paid Ads</div><div class="stat-value">'+adsMin+'–'+adsMax+'</div><div class="stat-trend">Leads/mo</div></div>' +
        '<div class="stat-card"><div class="stat-label">Social</div><div class="stat-value">'+socMin+'–'+socMax+'</div><div class="stat-trend">Leads/mo</div></div>' +
      '</div>' +
      '<div class="highlight-card"><div class="stat-label">Total Potential Leads</div><div class="big-number">'+tMin+'–'+tMax+'</div><div class="stat-label">per month</div></div>' +
      '<div class="highlight-card" style="margin-top:10px"><div class="stat-label">Estimated Pipeline Value</div><div class="big-number green">$'+rMin.toLocaleString('en-US')+' – $'+rMax.toLocaleString('en-US')+'</div><div class="stat-label">per month</div></div>' +
      // Dynamic ROI block — vs hiring an in-house team
      '<div class="roi-card" style="margin-top:14px;background:linear-gradient(135deg,#0a2540,#1a5276);color:#fff;padding:16px 18px;border-radius:14px">' +
        '<div style="font-size:11px;letter-spacing:1px;color:#7eb8d8;text-transform:uppercase;margin-bottom:8px">vs Hiring a Marketing Team</div>' +
        '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">' +
          '<span style="font-size:13px;color:#cbd5e1">In-house team</span>' +
          '<span style="font-size:18px;font-weight:700;color:#fca5a5">$'+teamCostLow.toLocaleString()+'–$'+teamCostHigh.toLocaleString()+'/mo</span>' +
        '</div>' +
        '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px">' +
          '<span style="font-size:13px;color:#cbd5e1">Pro plan on ConsultantLM</span>' +
          '<span style="font-size:18px;font-weight:700;color:#86efac">$'+ourPlan+'/mo</span>' +
        '</div>' +
        '<div style="border-top:1px solid rgba(255,255,255,0.12);padding-top:10px;display:flex;justify-content:space-between;align-items:baseline">' +
          '<span style="font-size:14px;font-weight:600">You save up to</span>' +
          '<span style="font-size:22px;font-weight:800;color:#86efac">$'+saveHigh.toLocaleString()+'/mo</span>' +
        '</div>' +
      '</div>' +
      '<p class="fine-print"><strong>Calculated for:</strong> ' + (profLabels[prof]||prof) + (loc ? ', ' + loc : '') + ', ' + (roleLabels[roleVal]||roleVal) + ', ' + svcText + '.<br>Includes: Google SEO + Meta/Google Ads + organic traffic + social media. <em>Estimates only — actual results may vary based on market conditions, profile optimization and individual effort. Not a guarantee of income.</em></p>';
    var d = el('div', '', html);
    wrap.appendChild(d);
  }

  // ---- Proof ----
  function renderProofCard(wrap) {
    var html =
      '<div class="proof-card"><div class="proof-header"><div class="proof-avatar">JD</div><div class="proof-meta"><div class="proof-name">John Davis</div><div class="proof-role">Attorney -- New York</div><div class="proof-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div></div><span class="badge badge-green">+$47K/mo</span></div><p class="proof-quote">"ConsultantLM transformed my practice. 47 new clients in the first month."</p></div>' +
      '<div class="proof-card"><div class="proof-header"><div class="proof-avatar orange">SM</div><div class="proof-meta"><div class="proof-name">Sarah Mitchell</div><div class="proof-role">CPA -- California</div><div class="proof-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div></div><span class="badge badge-green">+$32K/mo</span></div><p class="proof-quote">"21 Leads in the first hour! The AI content engine is incredible."</p></div>' +
      '<div class="featured-in">Featured in: <strong>Forbes</strong> -- <strong>HiiL Justice</strong></div>';
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
            '<div class="tenx-card-label">Without ConsultantLM</div>' +
            '<div class="tenx-card-items">' +
              '<div class="tenx-item">You need a full team</div>' +
              '<div class="tenx-item tenx-price-bad">$5K–$30K/month</div>' +
              '<div class="tenx-item">Months to see results</div>' +
            '</div>' +
          '</div>' +
          '<div class="tenx-vs">VS</div>' +
          '<div class="tenx-card tenx-after">' +
            '<div class="tenx-card-icon">&#10003;</div>' +
            '<div class="tenx-card-label">With ConsultantLM</div>' +
            '<div class="tenx-card-items">' +
              '<div class="tenx-item">AI does it all</div>' +
              '<div class="tenx-item tenx-price-good">From $199/month</div>' +
              '<div class="tenx-item">Results in weeks</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="tenx-hero">' +
          '<div class="tenx-hero-label">One tool replaces</div>' +
          '<div class="tenx-hero-number">6 hires</div>' +
        '</div>' +
        '<div class="tenx-savings">' +
          '<div class="tenx-savings-amount">$35,000</div>' +
          '<div class="tenx-savings-text">YOU SAVE PER MONTH</div>' +
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
      d.innerHTML = '<iframe data-src="' + encodeURI(src) + '" src="about:blank" scrolling="no" frameborder="0" allow="autoplay" style="width:100%;aspect-ratio:360/576;border:0;display:block;background:#fff"></iframe>';
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
      var realSrc = f.getAttribute('data-src');
      if (!realSrc) return;
      // If swipeAndRender already kicked off the load, just leave the animation alone.
      // Only force-load here as a safety net (e.g. first slide, programmatic jumps).
      if (f.getAttribute('src') !== realSrc) {
        f.setAttribute('src', realSrc);
      }
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
        '<table class="team-table"><thead><tr><th>Role</th><th>USA (Monthly)</th></tr></thead><tbody>' +
        '<tr><td>Content Researcher / SEO</td><td>$9,425</td></tr>' +
        '<tr><td>Scriptwriter</td><td>$5,115</td></tr>' +
        '<tr><td>Videographer</td><td>$5,327</td></tr>' +
        '<tr><td>Video Editor</td><td>$5,477</td></tr>' +
        '<tr><td>Digital Advertiser / SMM</td><td>$5,404</td></tr>' +
        '<tr><td>CRM / Inquiry Manager</td><td>$5,598</td></tr>' +
        '</tbody></table>' +
        '<div class="team-total">' +
          '<div class="team-total-label">Total Monthly Team Cost</div>' +
          '<div class="team-total-value">~$35,346</div>' +
        '</div>' +
        '<div class="team-savings">' +
          '<div class="team-savings-vs">vs ConsultantLM from <span class="accent">$199/mo</span></div>' +
          '<div class="badge badge-green" style="font-size:14px;padding:8px 16px;margin-top:8px">You save up to $35,000/month</div>' +
        '</div>' +
      '</div>';
  }

  // ---- WOW ROI — interactive ROI calculator (ported from marcetingQUIZ) ----
  function renderWowRoiCard(wrap) {
    // Inquiry economics — realistic for US legal market
    var INQUIRY_COST_AVG = 95;        // realistic per-inquiry cost ($80-$110 typical)
    var CONVERSION = 1 / 6;            // ~17% — 1 paying client per 6 Leads

    // Per-tier client revenue ranges:
    //  - Base: fewer but higher-value cases (high-touch consults / litigation)
    //  - Pro/Premium: more volume of smaller cases (consults, doc reviews)
    var PLANS = {
      base:    { name: 'Base',    sub: 49,  maxInq: 6,   defaultInq: 3,  unlimited: false,
                 clientLow: 10000, clientHigh: 20000 },
      pro:     { name: 'Pro',     sub: 199, maxInq: 30,  defaultInq: 15, unlimited: false,
                 clientLow: 2000,  clientHigh: 6000  },
      premium: { name: 'Premium', sub: 499, maxInq: 100, defaultInq: 50, unlimited: true,
                 clientLow: 2000,  clientHigh: 5000  }
    };

    var profLabels = { attorney:'Attorney', lawyer:'Lawyer', notary:'Notary', patent_attorney:'Patent Attorney', cpa:'CPA', tax_specialist:'Tax Specialist' };
    var displayName = (quizData.first_name || 'You') + (quizData.last_name ? ' ' + quizData.last_name : '');
    var displayProf = profLabels[quizData.profession] || 'Attorney';
    var displayCity = quizData.city || 'United States';

    var currentPlan = quizData.plan || 'pro';
    quizData.plan = currentPlan;

    var html = ''
      + '<div class="wow-card-v2">'
      // Plan tabs
      + '<div class="plan-tabs">'
      + '<button class="plan-tab" data-plan="base">Base</button>'
      + '<button class="plan-tab" data-plan="pro">Pro</button>'
      + '<button class="plan-tab" data-plan="premium">Premium</button>'
      + '</div>'
      // Profile card
      + '<div class="wow-profile" id="wowProfile">'
      + '<div class="wow-profile-header">'
      + '<span class="wow-profile-plan-badge" id="wowPlanBadge">PRO</span>'
      + '<span class="wow-profile-rating">&#9733; <span id="wowRating">67.59</span></span>'
      + '</div>'
      + '<div class="wow-profile-body">'
      + '<div class="wow-profile-photo" id="wowProfilePhoto">'
      + '<div class="wow-profile-photo-placeholder">&#128247;</div>'
      + '</div>'
      + '<div class="wow-profile-info">'
      + '<div class="wow-profile-name">' + displayName + '</div>'
      + '<div class="wow-profile-role">' + displayProf + '</div>'
      + '<div class="wow-profile-city"><span class="loc-pin">&#128205;</span> ' + displayCity + '</div>'
      + '</div></div></div>'
      // ROI calculator — realistic conversion math
      + '<div class="roi-calc">'
      + '<div class="roi-calc-label">&#128200;  Your Estimated Pipeline Value</div>'
      + '<div class="roi-slider-row">'
      + '<span class="roi-slider-label">Leads / month: <strong id="roiInqLabel">15</strong> <span id="roiInqMaxHint" class="roi-max-hint">(of 30 included)</span></span>'
      + '<input type="range" id="roiInqSlider" min="0" max="30" step="1" value="15" class="roi-slider"/>'
      + '</div>'
      + '<div class="roi-table">'
      + '<div class="roi-row roi-highlight"><span>Paying clients (1 in 6):</span><span id="roiClients">~2&nbsp;–&nbsp;3</span></div>'
      + '<div class="roi-row"><span>Expected revenue:</span><span id="roiRevenue">$5,000 – $15,000</span></div>'
      + '<div class="roi-row roi-minus"><span>Lead cost (<span id="roiInqLabel3">15</span> &times; $' + INQUIRY_COST_AVG + '):</span><span id="roiInqCost">&minus;$1,425</span></div>'
      + '<div class="roi-row roi-minus"><span>ConsultantLM subscription:</span><span id="roiSub">&minus;$199 /mo</span></div>'
      + '<div class="roi-row roi-total"><span>Net potential:</span><span id="roiNet">$3,376 – $13,376 /mo</span></div>'
      + '</div>'
      + '<div class="roi-payback" id="roiPaybackRow">Payback period: <strong id="roiPayback">~ 2&ndash;3 weeks</strong></div>'
      + '<div class="roi-disclaimer"><strong>Leads are not yet clients, not paid clients.</strong> Realistic conversion: ~1 in 6 Leads becomes a paying case. Actual results depend on your response speed, follow-up workflow, pricing and specialty match. Estimates only — past performance does not guarantee future results.</div>'
      + '</div>'
      + '</div>';

    var container = el('div', '', html);
    wrap.appendChild(container);

    var slider = container.querySelector('#roiInqSlider');

    function recalc() {
      var plan = PLANS[currentPlan];
      var n = parseInt(slider.value, 10);
      var inqLabel = plan.unlimited && n >= plan.maxInq ? (n + '+') : String(n);
      container.querySelector('#roiInqLabel').textContent = inqLabel;
      container.querySelector('#roiInqLabel3').textContent = inqLabel;

      // ── Conversion: 1 client per 6 Leads (~17%) ──
      // Show as a range to keep credibility (clients vary in practice)
      var clientsAvg = n * CONVERSION;
      var clientsLow = Math.max(0, Math.floor(clientsAvg));
      var clientsHigh = Math.max(0, Math.ceil(clientsAvg + 0.5)); // small spread for "good month"
      // Single integer when low==high
      var clientsLabel;
      if (clientsAvg === 0) clientsLabel = '0';
      else if (clientsLow === clientsHigh) clientsLabel = '~' + clientsLow;
      else clientsLabel = '~' + clientsLow + '–' + clientsHigh;

      // ── Revenue range = clients × per-client min/max ──
      var revLow  = clientsLow  * plan.clientLow;
      var revHigh = clientsHigh * plan.clientHigh;

      var inqCost = n * INQUIRY_COST_AVG;
      var subCost = plan.sub;
      var netLow  = Math.max(0, revLow  - inqCost - subCost);
      var netHigh = Math.max(0, revHigh - inqCost - subCost);

      // Display strings
      var revStr = clientsAvg === 0
        ? '$0'
        : '$' + revLow.toLocaleString('en-US') + ' – $' + revHigh.toLocaleString('en-US');
      var netStr = clientsAvg === 0
        ? '−$' + (inqCost + subCost).toLocaleString('en-US') + ' /mo'
        : '$' + netLow.toLocaleString('en-US') + ' – $' + netHigh.toLocaleString('en-US') + ' /mo';

      container.querySelector('#roiClients').textContent = clientsLabel;
      container.querySelector('#roiRevenue').textContent = revStr;
      container.querySelector('#roiInqCost').textContent = '−$' + inqCost.toLocaleString('en-US');
      container.querySelector('#roiSub').textContent = '−$' + subCost + ' /mo';
      container.querySelector('#roiNet').textContent = netStr;

      // ── Payback period: hardcoded to "1 day" per product decision ──
      var paybackRow = container.querySelector('#roiPaybackRow');
      if (revLow > 0) {
        container.querySelector('#roiPayback').textContent = '~ 1 day';
        paybackRow.style.display = '';
      } else {
        paybackRow.style.display = 'none';
      }

      // Sync into quizData for backend (realistic numbers, not "theoretical max")
      quizData.desired_clients = clientsLow;
      quizData.desired_revenue = revLow;
    }

    function switchPlan(planId) {
      currentPlan = planId;
      quizData.plan = planId;
      saveQuizData();
      var plan = PLANS[planId];

      container.querySelectorAll('.plan-tab').forEach(function(t) {
        t.classList.toggle('active', t.getAttribute('data-plan') === planId);
      });
      var badge = container.querySelector('#wowPlanBadge');
      badge.textContent = plan.name.toUpperCase();
      badge.className = 'wow-profile-plan-badge wow-profile-plan-badge--' + planId;
      var ratings = { base: '52.18', pro: '67.59', premium: '88.42' };
      container.querySelector('#wowRating').textContent = ratings[planId];

      slider.max = plan.maxInq;
      slider.value = plan.defaultInq;
      var maxHint = plan.unlimited ? '(unlimited)' : '(of ' + plan.maxInq + ' included)';
      container.querySelector('#roiInqMaxHint').textContent = maxHint;

      recalc();
    }

    slider.addEventListener('input', recalc);
    container.querySelectorAll('.plan-tab').forEach(function(tab) {
      tab.addEventListener('click', function() { switchPlan(tab.getAttribute('data-plan')); });
    });

    switchPlan(currentPlan);

    // Continue button (wowRoi has its own; default dispatch skips it)
    var btn = el('button', 'card-btn', 'Continue &rarr;');
    btn.addEventListener('click', function() { advance(); });
    wrap.appendChild(actionBar(btn));
  }

  // ---- Full Profile (post-payment) — choose: About 3000+ chars OR upload CV ----
  function renderFullProfileCard(wrap) {
    var MIN_CHARS = 3000;

    var html = ''
      + '<div class="fp-card">'
      + '<div class="fp-tabs">'
      + '<button type="button" class="fp-tab active" data-fp="about">Write about yourself</button>'
      + '<button type="button" class="fp-tab" data-fp="cv">Upload CV</button>'
      + '</div>'
      + '<div class="fp-pane fp-pane-about" data-fp="about">'
      + '<label class="form-label">About yourself <span class="fp-min-hint">minimum ' + MIN_CHARS + ' characters</span></label>'
      + '<textarea id="fpAbout" class="card-input" rows="10" placeholder="Tell us about your experience, education, achievements, notable cases, certifications, awards…"></textarea>'
      + '<div class="fp-counter"><span id="fpCount">0</span> / ' + MIN_CHARS + '</div>'
      + '</div>'
      + '<div class="fp-pane fp-pane-cv" data-fp="cv" hidden>'
      + '<label class="form-label">Upload your CV <em class="form-req">*</em></label>'
      + '<div class="upload-area" id="fpCvArea">'
      + '<div class="upload-text" id="fpCvLabel">Click to choose .pdf / .doc / .docx</div>'
      + '<input type="file" id="fpCvInput" accept=".pdf,.doc,.docx" style="display:none">'
      + '</div>'
      + '<div class="fp-note">CV will be processed by AI to extract your experience, education and achievements.</div>'
      + '</div>'
      + '</div>';

    var box = el('div', '', html);
    wrap.appendChild(box);

    var aboutPane = box.querySelector('.fp-pane-about');
    var cvPane = box.querySelector('.fp-pane-cv');
    var aboutTa = box.querySelector('#fpAbout');
    var aboutCount = box.querySelector('#fpCount');
    var cvArea = box.querySelector('#fpCvArea');
    var cvInput = box.querySelector('#fpCvInput');
    var cvLabel = box.querySelector('#fpCvLabel');
    var tabs = box.querySelectorAll('.fp-tab');

    if (quizData.about) { aboutTa.value = quizData.about; aboutCount.textContent = quizData.about.length; }
    if (quizData.cv_name) { cvLabel.textContent = quizData.cv_name; cvArea.classList.add('uploaded'); }

    var currentChoice = quizData.profile_method || 'about';

    function activate(method) {
      currentChoice = method;
      quizData.profile_method = method;
      tabs.forEach(function(t) { t.classList.toggle('active', t.getAttribute('data-fp') === method); });
      aboutPane.hidden = (method !== 'about');
      cvPane.hidden = (method !== 'cv');
    }
    activate(currentChoice);

    tabs.forEach(function(t) {
      t.addEventListener('click', function() { activate(t.getAttribute('data-fp')); });
    });

    aboutTa.addEventListener('input', function() {
      quizData.about = aboutTa.value;
      aboutCount.textContent = aboutTa.value.length;
    });

    cvArea.addEventListener('click', function() { cvInput.click(); });
    cvInput.addEventListener('change', function() {
      if (cvInput.files.length) {
        var name = cvInput.files[0].name;
        quizData.cv_name = name;
        cvLabel.textContent = name;
        cvArea.classList.add('uploaded');
      }
    });

    var errEl = el('div', '', '');
    errEl.style.cssText = 'color:#ef4444;font-size:12px;text-align:center;margin-top:8px;display:none';
    wrap.appendChild(errEl);

    var btn = el('button', 'card-btn', 'Finish &rarr;');
    btn.addEventListener('click', function() {
      var valid = false;
      var msg = '';
      if (currentChoice === 'about') {
        var len = (aboutTa.value || '').trim().length;
        if (len >= MIN_CHARS) valid = true;
        else msg = 'About yourself must be at least ' + MIN_CHARS + ' characters (you have ' + len + ').';
      } else {
        if (quizData.cv_name) valid = true;
        else msg = 'Please upload your CV (.pdf, .doc or .docx).';
      }
      if (!valid) {
        errEl.textContent = msg;
        errEl.style.display = 'block';
        return;
      }
      errEl.style.display = 'none';
      // Submit final profile completion to backend
      submitQuizData(function(ok) {
        if (ok) { try { localStorage.removeItem(STORAGE_KEY); } catch (e) {} }
        advance();
      });
    });
    wrap.appendChild(actionBar(btn));
  }

  // ---- Assessment ----
  function renderAssessmentCard(wrap) {
    var score = calcProfileScore();
    var level = score >= 75 ? 'High' : score >= 50 ? 'Moderate' : score >= 30 ? 'Normal' : 'Low';
    var levelColor = score >= 75 ? '#10b981' : score >= 50 ? '#3b82f6' : score >= 30 ? '#f59e0b' : '#ef4444';

    var profLabels = {attorney:'Attorney',lawyer:'Lawyer',patent_attorney:'Patent Attorney',cpa:'CPA',notary:'Notary',tax_specialist:'Tax Specialist',other:'Specialist'};
    var prof = quizData.profession || 'other';
    var loc = quizData.city || quizData.zip || '';
    var svcNames = (quizData.services || []).slice(0,3).map(function(s){return s.replace(/_/g,' ');});
    var svcText = svcNames.length > 0 ? svcNames.join(', ') : 'General';

    var html =
      '<div class="potential-scale"><div class="scale-bar"><div class="scale-marker" id="scaleMarker" style="left:10%"></div></div><div class="scale-labels"><span>Low</span><span>Normal</span><span>Moderate</span><span>High</span></div></div>' +
      '<div class="highlight-card" style="margin-top:16px"><span class="badge" style="font-size:14px;padding:6px 16px;background:' + levelColor + '22;color:' + levelColor + '">Your level: <strong>' + level + '</strong> (' + score + '%)</span></div>' +
      '<div class="fine-print" style="margin-top:12px"><strong>Calculated for:</strong> ' + (profLabels[prof]||prof) + (loc ? ', ' + loc : '') + ', ' + svcText + '.' +
      '<br>Factors: ad budget' + (quizData.ad_budget ? ' (' + quizData.ad_budget.replace(/_/g,' ') + ')' : '') + ', cooperation period' + (quizData.period ? ' (' + quizData.period.replace(/_/g,' ') + ')' : '') + ', desired goals.<br><em>Estimates only — actual results may vary. Not a guarantee of income.</em></div>';
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
    html += '<div class="pp-timer-label">20% DISCOUNT JUST FOR YOU!</div>';
    html += '<div class="pp-timer-digits">';
    html += '<div class="t-block"><span class="num" id="ppTH">23</span><span class="lbl">hrs</span></div>';
    html += '<span class="t-sep">:</span>';
    html += '<div class="t-block"><span class="num" id="ppTM">59</span><span class="lbl">min</span></div>';
    html += '<span class="t-sep">:</span>';
    html += '<div class="t-block"><span class="num" id="ppTS">59</span><span class="lbl">sec</span></div>';
    html += '</div></div>';

    // ── Profile viewport with arrows ──
    // Sticky nav rail — arrows stay visible while user scrolls the slide
    html += '<div class="pp-arrow-rail" aria-hidden="true">';
    html += '<button class="pp-arrow pp-arrow--left" id="ppArrowLeft" aria-label="Previous plan">' + arrowLeftSvg + '</button>';
    html += '<button class="pp-arrow pp-arrow--right" id="ppArrowRight" aria-label="Next plan">' + arrowRightSvg + '</button>';
    html += '</div>';

    html += '<div class="pp-viewport" id="ppViewport">';
    html += '<div class="pp-track" id="ppProfileTrack">';

    // BASE profile slide
    html += '<div class="pp-slide"><div class="prof-card prof-base">';
    html += '<div class="prof-topbar"><span class="tier-label">BASE (Basic)</span><span class="separator"></span><span class="rating-area">' + starSvg + '<span class="rating-num">54.42</span></span></div>';
    html += '<div class="prof-body"><div class="prof-avatar-wrap"><img src="' + imgPath + '" alt="Attorney"></div>';
    html += '<div class="prof-info"><div class="name">Alexander K\u00f6nig</div><div class="role">Attorney</div><div class="location">' + pinSvg + ' USA, New York</div></div></div>';
    html += '<div class="prof-info-btn">i</div></div></div>';

    // PRO profile slide
    html += '<div class="pp-slide"><div class="prof-card prof-pro">';
    html += '<div class="prof-topbar"><span class="tier-label">PRO</span><span class="separator"></span><span class="rating-area">' + starSvg + '<span class="rating-num">67.59</span></span></div>';
    html += '<div class="prof-body"><div class="prof-avatar-wrap"><img src="' + imgPath + '" alt="Attorney"></div>';
    html += '<div class="prof-info"><div class="name">Alexander K\u00f6nig</div><div class="role">Attorney</div><div class="location">' + pinSvg + ' USA, New York</div></div></div>';
    html += '<div class="prof-info-btn">i</div></div></div>';

    // PREMIUM profile slide
    html += '<div class="pp-slide"><div class="prof-card prof-premium">';
    html += '<div class="prof-topbar"><span class="tier-label">PREMIUM</span><span class="separator"></span><span class="rating-area">' + starSvg + '<span class="rating-num">76.02</span></span></div>';
    html += '<div class="prof-body"><div class="prof-info-area"><div class="prof-info"><div class="name">Alexander K\u00f6nig</div><div class="role">Attorney</div><div class="location">' + pinSvg + ' USA, New York</div></div></div>';
    html += '<div class="prof-photo-right"><img src="' + imgPath + '" alt="Attorney"></div></div>';
    html += '<div class="prof-info-btn">i</div></div></div>';

    html += '</div></div>'; // close pp-track, pp-viewport

    // ── Dots ──
    html += '<div class="pp-dots" id="ppDots">';
    html += '<button class="pp-dot active" data-idx="0" aria-label="Base plan"></button>';
    html += '<button class="pp-dot" data-idx="1" aria-label="Pro plan"></button>';
    html += '<button class="pp-dot" data-idx="2" aria-label="Premium plan"></button>';
    html += '</div>';

    // ── AI Avatar Video Section (hidden for BASE, visible for PRO/PREMIUM) ──
    html += '<div class="pp-avatar-section" id="ppAvatarSection">';
    html += '<div class="pp-avatar-inner">';
    html += '<span class="pp-avatar-label">AI Avatar Preview</span>';
    html += '<div class="pp-avatar-video-wrap">';
    html += '<video id="ppAvatarVideo" loop playsinline preload="metadata">';
    html += '<source src="./videos/i_avatar.mp4" type="video/mp4">';
    html += '</video>';
    html += '<button class="pp-avatar-sound-btn" id="ppAvatarSoundBtn" title="Toggle sound">&#128264;</button>';
    html += '</div>';
    html += '<div class="pp-avatar-tagline">Your AI avatar speaks for you 24/7</div>';
    html += '</div>';
    html += '</div>';

    // ── Billing toggle ──
    html += '<div class="pp-billing-toggle">';
    html += '<span class="toggle-label active" id="ppLabelMonthly">Monthly</span>';
    html += '<div class="pp-toggle-track" id="ppToggleTrack"><div class="pp-toggle-thumb"></div></div>';
    html += '<span class="toggle-label" id="ppLabelAnnual">Annual</span>';
    html += '<span class="pp-save-badge">Save 10%</span>';
    html += '</div>';

    // ── Pricing section ──
    html += '<div class="pp-pricing-section">';
    html += '<div class="pp-pricing-content" id="ppPricingTrack">';

    // BASE pricing panel
    html += '<div class="pp-pricing-panel">';
    html += '<div class="pp-plan-name pp-base-name">Base</div>';
    html += '<div class="pp-price-row"><span class="pp-new-price" id="ppPriceBase">$49<span class="period">/mo</span></span></div>';
    html += '<div class="pp-billing-note" id="ppNoteBase">per month, billed monthly</div>';
    html += '<div class="pp-features" id="ppFeatBase"></div>';
    html += '</div>';

    // PRO pricing panel
    html += '<div class="pp-pricing-panel">';
    html += '<div class="pp-plan-name pp-pro-name">Pro</div>';
    html += '<div class="pp-price-row"><span class="pp-new-price" id="ppPricePro">$199<span class="period">/mo</span></span></div>';
    html += '<div class="pp-billing-note" id="ppNotePro">per month, billed monthly</div>';
    html += '<div class="pp-features" id="ppFeatPro"></div>';
    html += '</div>';

    // PREMIUM pricing panel
    html += '<div class="pp-pricing-panel">';
    html += '<div class="pp-plan-name pp-premium-name">Premium</div>';
    html += '<div class="pp-price-row"><span class="pp-new-price" id="ppPricePremium">$499<span class="period">/mo</span></span></div>';
    html += '<div class="pp-billing-note" id="ppNotePremium">per month, billed monthly</div>';
    html += '<div class="pp-features" id="ppFeatPremium"></div>';
    html += '</div>';

    html += '</div></div>'; // close pp-pricing-content, pp-pricing-section

    // ── Trust & compliance block (US legal market) ──
    var trustScalesSvg  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 7h14"/><path d="M8 7l-3 7a4 4 0 0 0 6 0z"/><path d="M16 7l-3 7a4 4 0 0 0 6 0z"/><path d="M8 21h8"/></svg>';
    var trustLockSvg    = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
    var trustShieldSvg  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4z"/><path d="M9 12l2 2 4-4"/></svg>';
    var trustBotSvg     = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4v4"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/><path d="M9 17h6"/><path d="M3 13h1"/><path d="M20 13h1"/></svg>';

    html += '<div class="pp-trust-block">';
    html += '<div class="pp-trust-title">Built for US attorneys</div>';
    html += '<div class="pp-trust-grid">';
    html += '<div class="pp-trust-item"><span class="pp-trust-icon">' + trustScalesSvg + '</span><span class="pp-trust-text"><strong>ABA Model Rules</strong> compliant</span></div>';
    html += '<div class="pp-trust-item"><span class="pp-trust-icon">' + trustLockSvg + '</span><span class="pp-trust-text"><strong>SOC 2 ready</strong></span></div>';
    html += '</div></div>';

    // ── Custom-quote link (for large firms — opens lead modal) ──
    html += '<div class="pp-custom-quote-link"><a href="#" id="ppCustomQuoteLink" role="button">Large firm? Get a custom quote <span class="arrow">&rarr;</span></a></div>';

    // ── CTA button ──
    html += '<div class="pp-cta-area"><button class="pp-cta-btn pp-cta-base" id="ppCtaBtn">Get Base</button></div>';

    // ── Enterprise lead form (hidden overlay) ──
    html += '<div class="pp-lead-overlay" id="ppLeadOverlay" aria-hidden="true">';
    html += '<div class="pp-lead-modal" role="dialog" aria-labelledby="ppLeadTitle">';
    html += '<button class="pp-lead-close" id="ppLeadClose" aria-label="Close">&times;</button>';
    html += '<div class="pp-lead-header">';
    html += '<div class="pp-lead-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>';
    html += '<div class="pp-lead-title" id="ppLeadTitle">Team registration</div>';
    html += '<div class="pp-lead-sub">Tell us about your firm — your manager will reach out within 24h with a tailored plan.</div>';
    html += '</div>';
    html += '<form class="pp-lead-form" id="ppLeadForm" novalidate>';
    html += '<div class="pp-lead-note">This plan is for teams of 10+ specialists. For smaller teams, please choose Base, Pro or Premium.</div>';
    html += '<label class="pp-lead-field"><span class="pp-lead-label">Firm name <em>*</em></span><input type="text" name="firm_name" id="ppLeadFirm" autocomplete="organization" required></label>';
    html += '<label class="pp-lead-field"><span class="pp-lead-label">Company name <em>*</em></span><input type="text" name="company_name" id="ppLeadCompany" autocomplete="organization" required></label>';
    html += '<label class="pp-lead-field"><span class="pp-lead-label">Team size <em>*</em> <span class="pp-lead-hint">(minimum 10)</span></span><input type="number" name="team_size" id="ppLeadSize" min="10" placeholder="e.g. 12" required></label>';
    html += '<label class="pp-lead-field"><span class="pp-lead-label">Country / city</span><input type="text" name="firm_location" id="ppLeadLocation" autocomplete="address-level2"></label>';
    html += '<label class="pp-lead-field"><span class="pp-lead-label">Contact email <em>*</em></span><input type="email" name="contact_email" id="ppLeadEmail" autocomplete="email" required></label>';
    html += '<label class="pp-lead-field"><span class="pp-lead-label">Phone</span><input type="tel" name="contact_phone" id="ppLeadPhone" autocomplete="tel"></label>';
    html += '<label class="pp-lead-field"><span class="pp-lead-label">What do you need?</span><textarea name="message" id="ppLeadMsg" rows="3" placeholder="Volume, integrations, white-label, deadlines…"></textarea></label>';
    html += '<button type="submit" class="pp-lead-submit" id="ppLeadSubmit">Request a call</button>';
    html += '<div class="pp-lead-foot">By submitting you agree to be contacted by our team.</div>';
    html += '</form>';
    html += '<div class="pp-lead-thanks" id="ppLeadThanks" hidden>';
    html += '<div class="pp-lead-thanks-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>';
    html += '<div class="pp-lead-thanks-title">Got it — thanks!</div>';
    html += '<div class="pp-lead-thanks-sub">Your manager will reach out within 24 hours with a tailored plan for your team.</div>';
    html += '<button type="button" class="pp-lead-thanks-close" id="ppLeadThanksClose">Close</button>';
    html += '</div>';
    html += '</div></div>';

    html += '</div>'; // close profiles-pricing-wrap

    var d = el('div', '', html);
    wrap.appendChild(d);

    // ── Feature data (from D1) ──
    // graduated: true → category has tier-specific value; only the matching row shows per tier
    // (others in same category are hidden, not rendered as ✗)
    var ppFeatures = [
      // AI avatar — graduated
      { label: 'AI PRO avatar',              graduated: true, base: false, pro: true,  premium: false },
      { label: 'AI PREMIUM avatar',          graduated: true, base: false, pro: false, premium: true  },
      // Included AI Production — graduated
      { label: '10 AI posts/videos',   graduated: true, base: true,  pro: false, premium: false },
      { label: '40 AI posts/videos',   graduated: true, base: false, pro: true,  premium: false },
      { label: '100 AI posts/videos',  graduated: true, base: false, pro: false, premium: true  },
      // Lead buying — graduated
      { label: '6 lead buying',        graduated: true, base: true,  pro: false, premium: false },
      { label: '30 lead buying',       graduated: true, base: false, pro: true,  premium: false },
      { label: 'Unlimited lead buying',graduated: true, base: false, pro: false, premium: true  },
      // Reputation checks — graduated
      { label: 'Up to 10 reputation checks', graduated: true, base: false, pro: true,  premium: false },
      { label: 'Unlimited reputation checks',graduated: true, base: false, pro: false, premium: true  },
      // Premium-only binary
      { label: 'Top in Google by your name', base: false, pro: false, premium: true },
      { label: '24/7 personal manager',      base: false, pro: false, premium: true },
      { label: 'Exclusive social promotion', base: false, pro: false, premium: true },
      // Pro + Premium binary
      { label: 'Boost rating from past experience',   base: false, pro: true, premium: true },
      { label: 'Set custom prices for your services', base: false, pro: true, premium: true },
      // Universal binary
      { label: 'AI module for Google & Meta', base: true, pro: true, premium: true },
      { label: 'AI competitor monitoring',    base: true, pro: true, premium: true },
      { label: 'AI client assistant',         base: true, pro: true, premium: true },
      { label: 'Referral earnings',           base: true, pro: true, premium: true },
      { label: 'Private specialist chat',     base: true, pro: true, premium: true },
      { label: 'CRM system',                  base: true, pro: true, premium: true },
      { label: 'Secure messenger',            base: true, pro: true, premium: true }
    ];

    // Generic placeholders for graduated categories where the tier has no own entry.
    // E.g. Base has no avatar row → show generic 'AI avatar' as ✗ on Base panel only.
    var ppGenericPlaceholders = [
      { categoryRows: ['AI PRO avatar', 'AI PREMIUM avatar'],                  label: 'AI avatar'         },
      { categoryRows: ['Up to 10 reputation checks', 'Unlimited reputation checks'], label: 'Reputation checks' }
    ];

    var ppProBadges = {
      '40 AI posts/videos': { text: '4x more', type: 'green' },
      '30 lead buying': { text: '5x more', type: 'green' },
      'Up to 10 reputation checks': { text: 'NEW', type: 'cyan' },
      'Boost rating from past experience': { text: 'NEW', type: 'cyan' },
      'Set custom prices for your services': { text: 'NEW', type: 'cyan' },
      'AI PRO avatar': { text: 'NEW', type: 'cyan' }
    };

    var ppPremiumBadges = {
      '100 AI posts/videos': { text: '2.5x more', type: 'green' },
      'Unlimited lead buying': { text: '\u221e', type: 'green' },
      'Top in Google by your name': { text: 'NEW', type: 'cyan' },
      '24/7 personal manager': { text: 'NEW', type: 'cyan' },
      'Exclusive social promotion': { text: 'NEW', type: 'cyan' },
      'Unlimited reputation checks': { text: '\u221e', type: 'green' },
      'AI PREMIUM avatar': { text: 'UPGRADE', type: 'cyan' }
    };

    function ppBuildFeatures(tier) {
      var relevant = [];
      var badgeMap = null;
      if (tier === 'pro') badgeMap = ppProBadges;
      else if (tier === 'premium') badgeMap = ppPremiumBadges;

      ppFeatures.forEach(function(f) {
        // Graduated categories: only the row whose flag matches the tier is shown;
        // other rows in the same category are hidden (not rendered as ✗).
        if (f.graduated && !f[tier]) return;
        var item = { label: f.label, on: !!f[tier] };
        if (badgeMap && badgeMap[f.label]) item.badge = badgeMap[f.label];
        relevant.push(item);
      });

      // Generic ✗ placeholder for graduated categories where the tier has no entry
      // (e.g. Base lacks any avatar / reputation row).
      ppGenericPlaceholders.forEach(function(p) {
        var hasOwnEntry = ppFeatures.some(function(f) {
          return p.categoryRows.indexOf(f.label) >= 0 && f[tier];
        });
        if (!hasOwnEntry) relevant.push({ label: p.label, on: false });
      });

      // Show enabled features first, disabled at bottom
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
        { text: 'Get Base',    cls: 'pp-cta-btn pp-cta-base',    plan: 'base' },
        { text: 'Get Pro',     cls: 'pp-cta-btn pp-cta-pro',     plan: 'pro' },
        { text: 'Get Premium', cls: 'pp-cta-btn pp-cta-premium', plan: 'premium' }
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

        // Toggle avatar video section (hidden for Base)
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
      // Horizontal swipe DISABLED — switching only via dots/arrows.
      // Vertical scroll remains as normal page scroll.

      // ── CTA click selects plan and advances ──
      if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
          quizData.plan = ppCtaConfig[ppCurrent].plan;
          advance();
        });
      }

      // ── Custom-quote link + lead form wiring (for large firms) ──
      var customQuoteLink = document.getElementById('ppCustomQuoteLink');
      var leadOverlay = document.getElementById('ppLeadOverlay');
      var leadClose = document.getElementById('ppLeadClose');
      var leadForm = document.getElementById('ppLeadForm');
      var leadThanks = document.getElementById('ppLeadThanks');
      var leadThanksClose = document.getElementById('ppLeadThanksClose');
      var leadSubmit = document.getElementById('ppLeadSubmit');
      var leadEmail = document.getElementById('ppLeadEmail');
      var leadPhone = document.getElementById('ppLeadPhone');

      function ppOpenLead() {
        if (!leadOverlay) return;
        if (leadEmail && !leadEmail.value && quizData.email) leadEmail.value = quizData.email;
        if (leadPhone && !leadPhone.value && quizData.phone) leadPhone.value = quizData.phone;
        leadOverlay.classList.add('open');
        leadOverlay.setAttribute('aria-hidden', 'false');
      }
      function ppCloseLead() {
        if (!leadOverlay) return;
        leadOverlay.classList.remove('open');
        leadOverlay.setAttribute('aria-hidden', 'true');
      }
      if (customQuoteLink) customQuoteLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        ppOpenLead();
      });
      if (leadClose) leadClose.addEventListener('click', function(e) { e.stopPropagation(); ppCloseLead(); });
      if (leadOverlay) leadOverlay.addEventListener('click', function(e) {
        if (e.target === leadOverlay) ppCloseLead();
      });
      if (leadThanksClose) leadThanksClose.addEventListener('click', function(e) {
        e.stopPropagation();
        ppCloseLead();
      });

      if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
          e.preventDefault();
          var firm = (document.getElementById('ppLeadFirm') || {}).value || '';
          var company = (document.getElementById('ppLeadCompany') || {}).value || '';
          var size = parseInt((document.getElementById('ppLeadSize') || {}).value, 10) || 0;
          var loc = (document.getElementById('ppLeadLocation') || {}).value || '';
          var em = (leadEmail || {}).value || '';
          var ph = (leadPhone || {}).value || '';
          var msg = (document.getElementById('ppLeadMsg') || {}).value || '';

          if (!firm.trim() || !company.trim() || size < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
            leadForm.classList.add('pp-lead-invalid');
            return;
          }
          leadForm.classList.remove('pp-lead-invalid');

          quizData.plan = 'enterprise';
          quizData.tier = 'enterprise';
          quizData.lead_type = 'team_registration';
          quizData.firm = { name: firm.trim(), company: company.trim(), team_size: size, location: loc.trim(), message: msg.trim() };
          if (em) quizData.email = em.trim();
          if (ph) quizData.phone = ph.trim();
          try { localStorage.setItem('clm_enterprise_intent', '1'); } catch (e) {}

          if (leadSubmit) { leadSubmit.disabled = true; leadSubmit.textContent = 'Sending…'; }

          submitQuizData(function(ok) {
            if (leadSubmit) { leadSubmit.disabled = false; leadSubmit.textContent = 'Request a call'; }
            leadForm.hidden = true;
            if (leadThanks) leadThanks.hidden = false;
          });
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
      var ppIsAnnual = false;  // start without annual discount; user toggles to enable
      var ppToggleTrack = document.getElementById('ppToggleTrack');
      var ppLabelMonthly = document.getElementById('ppLabelMonthly');
      var ppLabelAnnual = document.getElementById('ppLabelAnnual');

      // Base monthly prices — annual mode applies -10% discount on top
      var ppPrices = {
        monthly: { base: {price:'$49',  note:'per month, billed monthly'},
                   pro:  {price:'$199', note:'per month, billed monthly'},
                   premium: {price:'$499', note:'per month, billed monthly'} },
        annual:  { base: {price:'$44',  note:'per month, billed annually (–10%)'},
                   pro:  {price:'$179', note:'per month, billed annually (–10%)'},
                   premium: {price:'$449', note:'per month, billed annually (–10%)'} }
      };

      function ppUpdatePrices() {
        var mode = ppIsAnnual ? 'annual' : 'monthly';
        var p = ppPrices[mode];
        var elPriceBase = document.getElementById('ppPriceBase');
        var elNoteBase = document.getElementById('ppNoteBase');
        var elPricePro = document.getElementById('ppPricePro');
        var elNotePro = document.getElementById('ppNotePro');
        var elPricePremium = document.getElementById('ppPricePremium');
        var elNotePremium = document.getElementById('ppNotePremium');

        if (elPriceBase) elPriceBase.innerHTML = p.base.price + '<span class="period">/mo</span>';
        if (elNoteBase) elNoteBase.textContent = p.base.note;
        if (elPricePro) elPricePro.innerHTML = p.pro.price + '<span class="period">/mo</span>';
        if (elNotePro) elNotePro.textContent = p.pro.note;
        if (elPricePremium) elPricePremium.innerHTML = p.premium.price + '<span class="period">/mo</span>';
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

      // Set default plan to PRO; billing starts as MONTHLY (no annual discount)
      ppGoTo(1);
      ppUpdatePrices();
      quizData.billing = 'monthly';
    }, 100);

  }

  // ---- Transition Marketing ----
  function renderTransitionMarketingCard(wrap) {
    var html =
      '<div style="text-align:center;padding:20px 0">' +
        '<div style="width:48px;height:48px;border-radius:14px;background:#f59e0b;display:flex;align-items:center;justify-content:center;margin:0 auto 16px"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 11-5.8-1.6"/></svg></div>' +
        '<p style="font-size:14px;color:#64748b;line-height:1.5">Answer a few quick questions about your current marketing so we can build the best plan for you.</p>' +
      '</div>';
    var d = el('div', '', html);
    wrap.appendChild(d);
  }

  // ---- Upload Files Card ----
  function renderUploadFilesCard(wrap) {
    var html =
      '<div style="text-align:center;padding:10px 0 16px">' +
        '<div style="width:48px;height:48px;border-radius:14px;background:#00b4d8;display:flex;align-items:center;justify-content:center;margin:0 auto 12px"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>' +
        '<p style="font-size:13px;color:#94a3b8;margin-bottom:16px">Upload your files so our AI can create a professional profile for you. You can skip this step.</p>' +
      '</div>';
    var d = el('div', '', html);
    wrap.appendChild(d);

    var uploads = [
      {text:'Upload your photo (optional)', accept:'image/*', field:'photo'},
      {text:'Upload CV (optional)', accept:'.pdf,.doc,.docx', field:'cv'},
      {text:'Upload company logo (optional)', accept:'image/*', field:'company_logo'}
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
      '1_month': {base:59, pro:239, premium:599, label:'1 Month', discount:0},
      '1_year':  {base:49, pro:199, premium:499, label:'1 Year',  discount:10},
      '3_years': {base:39, pro:159, premium:399, label:'3 Years', discount:20}
    };

    var html = '';

    // ── Timer at top ──
    html += '<div class="pay-timer-top">';
    html += '<div class="pay-timer-label">20% DISCOUNT JUST FOR YOU!</div>';
    html += '<div class="pay-timer-digits">';
    html += '<span class="pay-t-block"><span class="pay-t-num" id="payTH">23</span><span class="pay-t-lbl">hrs</span></span>';
    html += '<span class="pay-t-sep">:</span>';
    html += '<span class="pay-t-block"><span class="pay-t-num" id="payTM">59</span><span class="pay-t-lbl">min</span></span>';
    html += '<span class="pay-t-sep">:</span>';
    html += '<span class="pay-t-block"><span class="pay-t-num" id="payTS">59</span><span class="pay-t-lbl">sec</span></span>';
    html += '</div></div>';

    // ── Period toggle (1 month / 1 year / 3 years) ──
    html += '<div class="pay-period-toggle" id="payPeriodToggle">';
    html += '<button class="pay-period-btn" data-period="1_month">1 Month</button>';
    html += '<button class="pay-period-btn active" data-period="1_year">1 Year <span class="pay-period-save">-10%</span></button>';
    html += '<button class="pay-period-btn" data-period="3_years">3 Years <span class="pay-period-save">-20%</span></button>';
    html += '</div>';

    // ── Savings hero ──
    html += '<div class="pay-savings-hero" id="paySavingsHero">';
    html += '<div class="pay-savings-amount" id="paySavingsAmount">$475</div>';
    html += '<div class="pay-savings-text">YOU JUST SAVED</div>';
    html += '</div>';

    // ── Discount summary ──
    html += '<div class="discount-summary" id="payDiscountSummary"></div>';

    // ── Payment icons ──
    html += '<div class="payment-icons"><svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#1434CB"/><text x="19" y="15" font-size="9" fill="#fff" text-anchor="middle" font-weight="bold" font-family="Arial">VISA</text></svg><svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#252525"/><circle cx="15" cy="12" r="7" fill="#EB001B"/><circle cx="23" cy="12" r="7" fill="#F79E1B"/><path d="M19 6.5a7 7 0 010 11 7 7 0 010-11z" fill="#FF5F00"/></svg><svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#003087"/><text x="19" y="15" font-size="7" fill="#fff" text-anchor="middle" font-weight="bold" font-family="Arial">PayPal</text></svg></div>';

    // ── Payment buttons ──
    html += '<div class="payment-buttons"><button class="btn btn-paypal" id="paypalBtn"><img class="btn-icon-paypal" src="icon/paypal.svg" alt="" width="24" height="24"> Pay with PayPal</button><button class="btn btn-primary" id="cardBtn"><img class="btn-icon-card" src="icon/card-credit.svg" alt="" width="24" height="24"> Pay with Card</button></div>';

    // ── FAQ ──
    html += '<h3 class="faq-heading">Frequently Asked Questions</h3>';
    html += '<div class="faq-list">';
    html += '<div class="faq-item"><div class="faq-question">How many clients can I expect per month?</div><div class="faq-answer"><div class="faq-answer-inner">Depending on your specialization, city, and profile optimization -- many lawyers receive 5-15 clients already in the first month, scaling to 20-30+ over time thanks to AI-generated content and SEO promotion.</div></div></div>';
    html += '<div class="faq-item"><div class="faq-question">Is this a guaranteed number of clients?</div><div class="faq-answer"><div class="faq-answer-inner">We provide you with Leads that you work with yourself. You can also work under exclusive conditions with platform clients, in which case these are already paid clients.</div></div></div>';
    html += '<div class="faq-item"><div class="faq-question">How does the pricing work?</div><div class="faq-answer"><div class="faq-answer-inner">We have a three-tier subscription: Basic, Pro, and Premium. The cost is significantly lower than traditional marketing agencies. Many lawyers cover the subscription cost with just 1-2 clients.</div></div></div>';
    html += '<div class="faq-item"><div class="faq-question">What if there are no clients?</div><div class="faq-answer"><div class="faq-answer-inner">The presence of Leads depends on your activity on the platform. We guarantee uninterrupted access to the platform and its resources. Payment is non-refundable once access has been provided.</div></div></div>';
    html += '<div class="faq-item"><div class="faq-question">Is my data safe?</div><div class="faq-answer"><div class="faq-answer-inner">Yes, we use a secure messenger, data encryption, and do not transfer information to third parties. The platform complies with GDPR and data protection regulations.</div></div></div>';
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
        var fullPrice = {base:79, pro:329, premium:799}[planKey] * months;

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
            '<div class="discount-row"><span>' + planNames[planKey] + ' plan — ' + p.label + '</span><span>$' + fullPrice.toLocaleString() + '</span></div>' +
            '<div class="discount-row"><span>Urgency discount (20%)</span><span class="saved">-$' + urgencyAmt.toLocaleString() + '</span></div>' +
            (referralAmt > 0 ? '<div class="discount-row"><span>Referral code (10%)</span><span class="saved">-$' + referralAmt.toLocaleString() + '</span></div>' : '') +
            (periodAmt > 0 ? '<div class="discount-row"><span>' + p.label + ' discount (' + p.discount + '%)</span><span class="saved">-$' + periodAmt.toLocaleString() + '</span></div>' : '') +
            '<div class="discount-row total"><span>Total</span><span>$' + total.toLocaleString() + '</span></div>';
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
          if (btn) { btn.disabled = true; btn.dataset._origText = btn.innerHTML; btn.innerHTML = 'Submitting…'; }
          submitQuizData(function (ok, status, body) {
            if (btn) { btn.disabled = false; if (btn.dataset._origText) btn.innerHTML = btn.dataset._origText; }
            if (ok) {
              try { localStorage.removeItem(STORAGE_KEY); } catch (er) {}
              alert('Thank you! Your submission has been received.');
            } else {
              alert('Submission failed (status ' + status + '). Please try again.');
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
