// ============================================
// ConsultantLM Quiz v9 — Stacked Cards with Depth
// ============================================

(function () {
  'use strict';

  var current = 0;
  var quizData = {};
  var history = [];

  var mainCard = document.getElementById('mainCard');
  var cardContent = document.getElementById('cardContent');
  var stackCard2 = document.getElementById('stackCard2');
  var stackCard3 = document.getElementById('stackCard3');
  var backBtn = document.getElementById('backBtn');

  // ---- UTM ----
  (function parseUTM() {
    var p = new URLSearchParams(window.location.search);
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(function(k) {
      var v = p.get(k); if (v) quizData[k] = v;
    });
  })();

  // ---- Slide definitions ----
  var slides = [
    { type:'radio', field:'profession',
      q:'Which best describes your <span class="accent">profession?</span>',
      sub:'Select your area of expertise',
      options:[
        {v:'attorney',t:'Attorney / Lawyer',icon:'scales',color:'#6366f1'},
        {v:'notary',t:'Notary',icon:'stamp',color:'#8b5cf6'},
        {v:'patent_attorney',t:'Patent Attorney',icon:'file-text',color:'#3b82f6'},
        {v:'agent',t:'Agent',icon:'home',color:'#f59e0b'},
        {v:'cpa',t:'CPA',icon:'bar-chart',color:'#10b981'},
        {v:'tax_specialist',t:'Tax Specialist',icon:'dollar',color:'#14b8a6'},
        {v:'insurance_adjuster',t:'Insurance Adjuster',icon:'shield',color:'#ef4444'},
        {v:'private_investigator',t:'Private Investigator',icon:'search',color:'#f97316'},
        {v:'other',t:'Other',icon:'briefcase',color:'#64748b'}
      ]},
    { type:'text', field:'zip', q:'Where do you <span class="accent">operate?</span>', sub:'This helps us calculate your market potential', placeholder:'e.g. 10001', inputmode:'numeric' },
    { type:'radio', field:'role', q:'Which best describes your <span class="accent">role?</span>', sub:'Help us personalize your experience',
      options:[
        {v:'self_employed',t:'Self-employed / Working independently',icon:'user',color:'#3b82f6'},
        {v:'employee',t:'Employee (in a company)',icon:'building',color:'#8b5cf6'},
        {v:'executive',t:'Company executive / Manager',icon:'crown',color:'#f59e0b'},
        {v:'founder',t:'Founder / Business owner',icon:'rocket',color:'#10b981'}
      ]},
    { type:'services', field:'services', q:'What services do you <span class="accent">provide?</span>', sub:'Select all that apply' },
    { type:'card', id:'aiCalc', q:'Your <span class="accent">AI-powered</span> potential', sub:'Based on your data, our AI calculated your potential on ConsultantLM' },
    { type:'card', id:'video7', q:'', sub:'' },
    { type:'checkbox', field:'channels', q:'Where is your business <span class="accent">listed?</span>', sub:'Choose all that apply', skip:'Skip for now',
      options:[
        {v:'instagram',t:'Instagram or Facebook',icon:'instagram',color:'#e1306c'},
        {v:'website',t:'My own website',icon:'globe',color:'#64748b'},
        {v:'tiktok',t:'TikTok',icon:'tiktok',color:'#000000'},
        {v:'youtube',t:'YouTube',icon:'play',color:'#ff0000'},
        {v:'linkedin',t:'LinkedIn',icon:'linkedin',color:'#0a66c2'},
        {v:'twitter',t:'X (Twitter)',icon:'x-twitter',color:'#000000'},
        {v:'telegram',t:'Telegram',icon:'send',color:'#0088cc'},
        {v:'other_channel',t:'Other',icon:'plus',color:'#94a3b8'}
      ]},
    { type:'radio', field:'preferred_way', q:'What\'s your preferred way to get <span class="accent">more customers?</span>', sub:'How would you like to grow',
      options:[
        {v:'social_media',t:'Social media',icon:'share',color:'#8b5cf6'},
        {v:'paid_ads',t:'Paid ads',icon:'megaphone',color:'#f59e0b'},
        {v:'both',t:'Both',icon:'layers',color:'#3b82f6'},
        {v:'ai_decide',t:'No plan yet — AI can decide',icon:'sparkle',color:'#10b981'}
      ]},
    { type:'radio', field:'marketing_time', q:'How many hours a day do you spend on <span class="accent">marketing?</span>', sub:'Including social media, content creation, and blogging',
      options:[
        {v:'none',t:"I don't spend time on marketing",icon:'x-circle',color:'#94a3b8'},
        {v:'less_1',t:'Less than 1 hour',icon:'clock',color:'#3b82f6'},
        {v:'1_5',t:'1-5 hours',icon:'clock',color:'#f59e0b'},
        {v:'5_plus',t:'5+ hours',icon:'clock',color:'#ef4444'}
      ]},
    { type:'radio', field:'ad_budget', q:'What\'s your monthly <span class="accent">ad budget?</span>', sub:'How much do you spend on advertising',
      options:[
        {v:'not_ready',t:'Not ready to invest',icon:'x-circle',color:'#94a3b8'},
        {v:'500_2000',t:'$500 - $2,000',icon:'dollar',color:'#10b981'},
        {v:'2000_5000',t:'$2,000 - $5,000',icon:'dollar',color:'#3b82f6'},
        {v:'5000_10000',t:'$5,000 - $10,000',icon:'dollar',color:'#8b5cf6'},
        {v:'10000_plus',t:'$10,000+',icon:'diamond',color:'#f59e0b'}
      ]},
    { type:'checkbox', field:'team', q:'Who\'s on your <span class="accent">marketing team?</span>', sub:'Select all roles you currently hire', skip:"I don't have a team",
      options:[
        {v:'seo',t:'Content Researcher / SEO Specialist',icon:'search',color:'#3b82f6'},
        {v:'scriptwriter',t:'Scriptwriter',icon:'pen',color:'#8b5cf6'},
        {v:'videographer',t:'Videographer',icon:'camera',color:'#ef4444'},
        {v:'video_editor',t:'Video Editor',icon:'film',color:'#f97316'},
        {v:'smm',t:'Digital Advertiser / SMM',icon:'megaphone',color:'#10b981'},
        {v:'crm_manager',t:'CRM / Lead Manager',icon:'users',color:'#0ea5e9'}
      ]},
    { type:'radio', field:'team_salary', q:'How much do you spend on your <span class="accent">marketing team?</span>', sub:'Total monthly salary for all marketing staff',
      options:[
        {v:'under_1000',t:'Under $1,000',icon:'dollar',color:'#10b981'},
        {v:'1000_5000',t:'$1,000 - $5,000',icon:'dollar',color:'#3b82f6'},
        {v:'5000_20000',t:'$5,000 - $20,000',icon:'dollar',color:'#8b5cf6'},
        {v:'20000_plus',t:'$20,000+',icon:'diamond',color:'#f59e0b'}
      ]},
    { type:'card', id:'tenx', q:'We cracked the code to deliver <span class="accent">10x better results</span>', sub:'Starting from $19/month -- Just 15 minutes a day' },
    { type:'card', id:'video1', q:'', sub:'' },
    { type:'card', id:'video2', q:'', sub:'' },
    { type:'card', id:'videoAds', q:'', sub:'' },
    { type:'card', id:'videoSocials', q:'', sub:'' },
    { type:'dualSlider', q:'Set your <span class="accent">goals</span> for the first month', sub:'This will help AI build a growth plan for you',
      sliders:[
        { field:'desired_clients', label:'Desired clients', min:0, max:100, val:25, step:1, fmt:function(v){return v>=100?'100+':v;}, labels:'<span>0</span><span>25</span><span>50</span><span>75</span><span>100+</span>' },
        { field:'desired_revenue', label:'Desired revenue', min:0, max:100000, val:25000, step:1000, fmt:function(v){return v>=100000?'$100K+':'$'+Number(v).toLocaleString('en-US');}, labels:'<span>$0</span><span>$25K</span><span>$50K</span><span>$75K</span><span>$100K+</span>' }
      ]},
    { type:'radio', field:'period', q:'How long do you want to <span class="accent">collaborate?</span>', sub:'Longer periods get better pricing',
      options:[
        {v:'1_month',t:'1 month',icon:'calendar',color:'#64748b'},
        {v:'1_year',t:'1 year (Save 10%)',icon:'calendar',color:'#3b82f6'},
        {v:'3_years',t:'3 years (Save 20%)',icon:'calendar',color:'#10b981'}
      ]},
    { type:'radio', field:'time_on_platform', q:'How much time can you spend on <span class="accent">ConsultantLM</span> each week?', sub:'This helps us tailor your plan',
      options:[
        {v:'15min',t:'15 minutes a day',icon:'clock',color:'#10b981'},
        {v:'30min',t:'30 minutes a day',icon:'clock',color:'#3b82f6'},
        {v:'1hr',t:'1 hour a day',icon:'clock',color:'#8b5cf6'},
        {v:'more',t:'More than 1 hour',icon:'clock',color:'#f59e0b'}
      ]},
    { type:'card', id:'teamReplace', q:'One tool. <span class="accent">Full team output.</span>', sub:'Replace expensive hires with AI' },
    { type:'card', id:'assessment', q:'Your income <span class="accent">potential</span>', sub:'Based on your profession, location, services, and goals' },
    { type:'form', id:'contactForm', q:'Almost done! Let our AI create your <span class="accent">profile</span>', sub:'Provide your details and our AI assistant will automatically build your profile' },
    { type:'card', id:'profilesPricing', q:'Choose your <span class="accent">plan</span>', sub:'Thank you for completing the survey — 20% discount available!' },
    { type:'card', id:'payment', q:'Complete your <span class="accent">purchase</span>', sub:'Select payment method' }
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

  // ---- Card transition: swipe out right, render new ----
  function swipeAndRender(dir) {
    var exitClass = dir === 'right' ? 'exit-right' : 'exit-left';

    // Animate out
    mainCard.classList.remove('active');
    mainCard.classList.add(exitClass);

    // Shift back cards forward
    stackCard2.style.transition = 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
    stackCard3.style.transition = 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
    stackCard2.className = 'stack-card active';
    stackCard3.className = 'stack-card behind-1';

    setTimeout(function() {
      // Reset: put mainCard back as the active top card with new content
      mainCard.style.transition = 'none';
      mainCard.classList.remove(exitClass);
      mainCard.classList.remove('active');
      mainCard.classList.add('enter-from-below');

      // Render new content
      renderSlide(current);

      // Force reflow
      void mainCard.offsetHeight;

      // Animate in
      mainCard.style.transition = '';
      mainCard.className = 'stack-card active';
      stackCard2.className = 'stack-card behind-1';
      stackCard3.className = 'stack-card behind-2';
    }, 420);
  }

  // ---- Advance ----
  function advance() {
    if (current >= TOTAL) return;
    history.push(current);
    current++;
    updateUI();

    if (current === 1) {
      renderSlide(current);
      mainCard.className = 'stack-card active';
    } else {
      swipeAndRender('right');
    }
  }

  // ---- Go back ----
  function goBack() {
    if (history.length === 0) return;
    current = history.pop();
    if (current === 0) { current = 1; history = []; }
    updateUI();
    swipeAndRender('left');
  }

  backBtn.addEventListener('click', function() { goBack(); });

  // ---- Render slide ----
  function renderSlide(n) {
    var s = slides[n - 1];
    cardContent.innerHTML = '';

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
      // Move q and sub into scroll wrap for card types
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
    s.options.forEach(function(opt) {
      var item = el('div', 'option-item');
      var iconHtml = opt.icon ? '<span class="opt-icon" style="background:' + (opt.color || '#64748b') + '">' + getIconSVG(opt.icon) + '</span>' : '';
      item.innerHTML = iconHtml + '<span class="option-text">' + opt.t + '</span><span class="option-radio"></span>';
      item.addEventListener('click', function() {
        quizData[s.field] = opt.v;
        list.querySelectorAll('.option-item').forEach(function(i) { i.classList.remove('selected'); });
        item.classList.add('selected');
        setTimeout(function() { advance(); }, 500);
      });
      list.appendChild(item);
    });
    wrap.appendChild(list);
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

    var btn = el('button', 'card-btn', 'Continue &rarr;');
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

    var btn = el('button', 'card-btn', 'Continue &rarr;');
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

    var searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'card-input search-input';
    searchInput.placeholder = 'Search services...';
    wrap.appendChild(searchInput);

    var tree = el('div', 'category-tree');

    var categories = [
      { name:'Family Law', subs:[
        { name:'Divorce', items:[{s:'divorce_contested',t:'Contested Divorce'},{s:'divorce_uncontested',t:'Uncontested Divorce'},{s:'divorce_mediation',t:'Divorce Mediation'}]},
        { name:'Property Division', items:[{s:'property_division',t:'Property Division'},{s:'asset_valuation',t:'Asset Valuation'}]},
        { name:'Alimony', items:[{s:'alimony_spousal',t:'Spousal Support'},{s:'alimony_modification',t:'Alimony Modification'}]},
        { name:'Child Custody', items:[{s:'custody_joint',t:'Joint Custody'},{s:'custody_sole',t:'Sole Custody'},{s:'custody_visitation',t:'Visitation Rights'}]},
        { name:'Adoption', items:[{s:'adoption_domestic',t:'Domestic Adoption'},{s:'adoption_international',t:'International Adoption'}]}
      ]},
      { name:'Criminal Law', subs:[
        { name:'Criminal Defense', items:[{s:'criminal_defense',t:'General Criminal Defense'},{s:'assault_defense',t:'Assault Defense'}]},
        { name:'DUI Defense', items:[{s:'dui_first',t:'First Offense DUI'},{s:'dui_repeat',t:'Repeat DUI'}]},
        { name:'Drug Offenses', items:[{s:'drug_possession',t:'Drug Possession'},{s:'drug_trafficking',t:'Drug Trafficking'}]},
        { name:'White Collar Crime', items:[{s:'fraud',t:'Fraud'},{s:'embezzlement',t:'Embezzlement'}]}
      ]},
      { name:'Real Estate', subs:[
        { name:'Transactions', items:[{s:'real_estate_transactions',t:'Real Estate Transactions'},{s:'closings',t:'Closings'}]},
        { name:'Landlord & Tenant', items:[{s:'landlord_tenant',t:'Landlord-Tenant Disputes'},{s:'eviction',t:'Eviction'}]},
        { name:'Zoning & Land Use', items:[{s:'zoning',t:'Zoning'},{s:'land_use',t:'Land Use Permits'}]}
      ]},
      { name:'Immigration', subs:[
        { name:'Visas', items:[{s:'work_visa',t:'Work Visas'},{s:'family_visa',t:'Family Visas'}]},
        { name:'Green Cards', items:[{s:'green_card_employment',t:'Employment-Based'},{s:'green_card_family',t:'Family-Based'}]},
        { name:'Deportation Defense', items:[{s:'deportation',t:'Deportation Defense'},{s:'asylum',t:'Asylum'}]}
      ]},
      { name:'Tax & Accounting', subs:[
        { name:'Tax Planning', items:[{s:'tax_planning',t:'Tax Planning'},{s:'tax_compliance',t:'Tax Compliance'}]},
        { name:'Tax Disputes', items:[{s:'tax_disputes',t:'Tax Disputes'},{s:'audit_representation',t:'Audit Representation'}]},
        { name:'Bookkeeping', items:[{s:'bookkeeping',t:'Bookkeeping'},{s:'payroll',t:'Payroll Services'}]}
      ]}
    ];

    categories.forEach(function(cat) {
      var grp = el('div', 'category-group');
      var hdr = el('div', 'category-header', cat.name);
      hdr.addEventListener('click', function() { grp.classList.toggle('open'); });
      grp.appendChild(hdr);

      var catItems = el('div', 'category-items');
      cat.subs.forEach(function(sub) {
        var subGrp = el('div', 'subcategory-group');
        var subHdr = el('div', 'subcategory-header', sub.name);
        subHdr.addEventListener('click', function(e) { e.stopPropagation(); subGrp.classList.toggle('open'); });
        subGrp.appendChild(subHdr);

        var subItems = el('div', 'subcategory-items');
        sub.items.forEach(function(it) {
          var item = el('div', 'category-item');
          var chk = el('span', 'cat-check');
          item.appendChild(chk);
          item.appendChild(document.createTextNode(' ' + it.t));
          item.dataset.service = it.s;
          item.dataset.text = it.t.toLowerCase();
          if (selectedServices.indexOf(it.s) > -1) item.classList.add('selected');
          item.addEventListener('click', function() {
            item.classList.toggle('selected');
            var idx = selectedServices.indexOf(it.s);
            if (idx > -1) selectedServices.splice(idx, 1);
            else selectedServices.push(it.s);
            quizData.services = selectedServices.slice();
          });
          subItems.appendChild(item);
        });
        subGrp.appendChild(subItems);
        catItems.appendChild(subGrp);
      });
      grp.appendChild(catItems);
      tree.appendChild(grp);
    });

    wrap.appendChild(tree);

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
      tree.querySelectorAll('.category-item').forEach(function(item) {
        item.style.display = item.dataset.text.includes(q) ? '' : 'none';
      });
      tree.querySelectorAll('.subcategory-group').forEach(function(sub) {
        var vis = 0;
        sub.querySelectorAll('.category-item').forEach(function(it) { if (it.style.display !== 'none') vis++; });
        if (q) { sub.style.display = vis ? '' : 'none'; if (vis) sub.classList.add('open'); }
        else { sub.style.display = ''; sub.classList.remove('open'); }
      });
      tree.querySelectorAll('.category-group').forEach(function(grp) {
        var vis = 0;
        grp.querySelectorAll('.category-item').forEach(function(it) { if (it.style.display !== 'none') vis++; });
        if (q) { grp.style.display = vis ? '' : 'none'; if (vis) grp.classList.add('open'); }
        else { grp.style.display = ''; grp.classList.remove('open'); }
      });
    });

    var btn = el('button', 'card-btn', 'Continue &rarr;');
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

    var btn = el('button', 'card-btn', 'Continue &rarr;');
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

    var btn = el('button', 'card-btn', 'Continue &rarr;');
    btn.addEventListener('click', function() { advance(); });
    wrap.appendChild(btn);
  }

  // ---- Form ----
  function renderForm(s, wrap) {
    var fields = [
      {label:'First Name', field:'first_name', type:'text', ph:'John'},
      {label:'Last Name', field:'last_name', type:'text', ph:'Davis'},
      {label:'Email', field:'email', type:'email', ph:'john@example.com'},
      {label:'Phone', field:'phone', type:'tel', ph:'+1 (555) 123-4567'},
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

    var uploads = [
      {text:'Upload your photo (optional)', accept:'image/*', field:'photo'},
      {text:'Upload company logo (optional)', accept:'image/*', field:'company_logo'},
      {text:'Upload CV (optional)', accept:'.pdf,.doc,.docx', field:'cv'}
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

    var aboutGrp = el('div', 'form-group');
    aboutGrp.innerHTML = '<label class="form-label">About yourself (optional, min 3000 characters)</label>';
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
    wrap.appendChild(btn);
  }

  // ---- Card slides ----
  function renderCard(s, wrap) {
    if (s.id === 'aiCalc') renderAICalcCard(wrap);
    else if (s.id === 'video7') renderVideoCard(wrap, 'videos/video-7.mp4');
    else if (s.id === 'tenx') renderTenxCard(wrap);
    else if (s.id === 'video1') renderVideoCard(wrap, 'videos/video-2-google-ranking.mp4');
    else if (s.id === 'video2') renderVideoCard(wrap, 'videos/video-3-competitor-monitor.mp4');
    else if (s.id === 'videoAds') renderVideoCard(wrap, 'videos/video-1-ai-ads.mp4');
    else if (s.id === 'videoSocials') renderVideoCard(wrap, 'videos/video-4-ai-socials.mp4');
    else if (s.id === 'teamReplace') renderTeamReplaceCard(wrap);
    else if (s.id === 'assessment') renderAssessmentCard(wrap);
    else if (s.id === 'profilesPricing') renderProfilesPricingCard(wrap);
    else if (s.id === 'payment') renderPaymentCard(wrap);

    if (s.id !== 'payment' && s.id !== 'profilesPricing') {
      var btn = el('button', 'card-btn', 'Continue &rarr;');
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
    var profLabels = {attorney:'Attorney / Lawyer',patent_attorney:'Patent Attorney',cpa:'CPA',notary:'Notary',agent:'Agent',tax_specialist:'Tax Specialist',insurance_adjuster:'Insurance Adjuster',private_investigator:'Private Investigator',other:'Specialist'};
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

    var html =
      '<div class="stats-row">' +
        '<div class="stat-card"><div class="stat-label">SEO (Google)</div><div class="stat-value">'+seoMin+'–'+seoMax+'</div><div class="stat-trend">leads/mo</div></div>' +
        '<div class="stat-card"><div class="stat-label">Paid Ads</div><div class="stat-value">'+adsMin+'–'+adsMax+'</div><div class="stat-trend">leads/mo</div></div>' +
        '<div class="stat-card"><div class="stat-label">Social</div><div class="stat-value">'+socMin+'–'+socMax+'</div><div class="stat-trend">leads/mo</div></div>' +
      '</div>' +
      '<div class="highlight-card"><div class="stat-label">Total Potential Clients</div><div class="big-number">'+tMin+'–'+tMax+'</div><div class="stat-label">per month</div></div>' +
      '<div class="highlight-card" style="margin-top:10px"><div class="stat-label">Estimated Revenue</div><div class="big-number green">$'+rMin.toLocaleString('en-US')+' – $'+rMax.toLocaleString('en-US')+'</div><div class="stat-label">per month</div></div>' +
      '<p class="fine-print"><strong>Calculated for:</strong> ' + (profLabels[prof]||prof) + (zip ? ', ZIP ' + zip : '') + ', ' + (roleLabels[roleVal]||roleVal) + ', ' + svcText + '.<br>Includes: Google SEO + Meta/Google Ads + organic traffic + social media.</p>';
    var d = el('div', '', html);
    wrap.appendChild(d);
  }

  // ---- Proof ----
  function renderProofCard(wrap) {
    var html =
      '<div class="proof-card"><div class="proof-header"><div class="proof-avatar">JD</div><div class="proof-meta"><div class="proof-name">John Davis</div><div class="proof-role">Attorney -- New York</div><div class="proof-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div></div><span class="badge badge-green">+$47K/mo</span></div><p class="proof-quote">"ConsultantLM transformed my practice. 47 new clients in the first month."</p></div>' +
      '<div class="proof-card"><div class="proof-header"><div class="proof-avatar orange">SM</div><div class="proof-meta"><div class="proof-name">Sarah Mitchell</div><div class="proof-role">CPA -- California</div><div class="proof-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div></div><span class="badge badge-green">+$32K/mo</span></div><p class="proof-quote">"21 leads in the first hour! The AI content engine is incredible."</p></div>' +
      '<div class="featured-in">Featured in: <strong>Forbes</strong> -- <strong>HiiL Justice</strong></div>';
    var d = el('div', '', html);
    wrap.appendChild(d);
  }

  // ---- 10X ----
  function renderTenxCard(wrap) {
    var html =
      '<div class="before-after"><div class="ba-card before"><div class="ba-label">Without ConsultantLM</div><div class="ba-text">You need a team<br>$5K-$30K/month<br>Months to see results</div></div><div class="ba-card after"><div class="ba-label">With ConsultantLM</div><div class="ba-text">AI does it all<br>From $19/month<br>Results in weeks</div></div></div>' +
      '<div class="highlight-card"><div class="stat-label-sm">One tool replaces</div><div class="big-number">6 hires</div><div class="stat-savings">You save up to $35,000/month</div></div>';
    var d = el('div', '', html);
    wrap.appendChild(d);
  }

  // ---- Video ----
  function renderVideoCard(wrap, src) {
    var d = el('div', 'video-wrap');
    d.innerHTML = '<video src="'+src+'" autoplay muted loop playsinline></video>';
    wrap.appendChild(d);
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
        '<tr><td>CRM / Lead Manager</td><td>$5,598</td></tr>' +
        '</tbody></table>' +
        '<div class="team-total">' +
          '<div class="team-total-label">Total Monthly Team Cost</div>' +
          '<div class="team-total-value">~$35,346</div>' +
        '</div>' +
        '<div class="team-savings">' +
          '<div class="team-savings-vs">vs ConsultantLM from <span class="accent">$19/mo</span></div>' +
          '<div class="badge badge-green" style="font-size:14px;padding:8px 16px;margin-top:8px">You save up to $35,000/month</div>' +
        '</div>' +
      '</div>';
  }

  // ---- Assessment ----
  function renderAssessmentCard(wrap) {
    var score = calcProfileScore();
    var level = score >= 75 ? 'High' : score >= 50 ? 'Moderate' : score >= 30 ? 'Normal' : 'Low';
    var levelColor = score >= 75 ? '#10b981' : score >= 50 ? '#3b82f6' : score >= 30 ? '#f59e0b' : '#ef4444';

    var profLabels = {attorney:'Attorney / Lawyer',patent_attorney:'Patent Attorney',cpa:'CPA',notary:'Notary',agent:'Agent',tax_specialist:'Tax Specialist',insurance_adjuster:'Insurance Adjuster',private_investigator:'Private Investigator',other:'Specialist'};
    var prof = quizData.profession || 'other';
    var zip = quizData.zip || '';
    var svcNames = (quizData.services || []).slice(0,3).map(function(s){return s.replace(/_/g,' ');});
    var svcText = svcNames.length > 0 ? svcNames.join(', ') : 'General';

    var html =
      '<div class="potential-scale"><div class="scale-bar"><div class="scale-marker" id="scaleMarker" style="left:10%"></div></div><div class="scale-labels"><span>Low</span><span>Normal</span><span>Moderate</span><span>High</span></div></div>' +
      '<div class="highlight-card" style="margin-top:16px"><span class="badge" style="font-size:14px;padding:6px 16px;background:' + levelColor + '22;color:' + levelColor + '">Your level: <strong>' + level + '</strong> (' + score + '%)</span></div>' +
      '<div class="fine-print" style="margin-top:12px"><strong>Calculated for:</strong> ' + (profLabels[prof]||prof) + (zip ? ', ZIP ' + zip : '') + ', ' + svcText + '.' +
      '<br>Factors: ad budget' + (quizData.ad_budget ? ' (' + quizData.ad_budget.replace(/_/g,' ') + ')' : '') + ', cooperation period' + (quizData.period ? ' (' + quizData.period.replace(/_/g,' ') + ')' : '') + ', desired goals.</div>';
    var d = el('div', '', html);
    wrap.appendChild(d);

    setTimeout(function(){
      var mk = document.getElementById('scaleMarker');
      if (mk) mk.style.left = score + '%';
    }, 600);
  }

  // ---- Profiles + Pricing (combined carousel) ----
  function renderProfilesPricingCard(wrap) {
    // Profile carousel
    var profiles = [
      { name:'Base Profile', desc:'Basic level — Auto-generated', avatar:'BP', color:'#64748b',
        details:'Name & City, Specialization, Average market pricing, AI-generated intro, SEO-optimized text' },
      { name:'Pro Profile', desc:'Professional level — Enhanced', avatar:'PP', color:'#3b82f6',
        details:'Everything in Base, AI Pro avatar, Custom pricing, 50-star rating, AI video intro, Built-in CRM & messenger' },
      { name:'Premium Profile', desc:'Maximum level — Full package', avatar:'PM', color:'#8b5cf6',
        details:'Everything in Pro, AI Premium avatar, Top in Google search, 24/7 personal manager, Exclusive social promotion' }
    ];

    var carouselHtml =
      '<div class="profile-carousel">' +
        '<div class="carousel-track" id="carouselTrack">';
    profiles.forEach(function(p) {
      carouselHtml +=
        '<div class="carousel-slide">' +
          '<div class="profile-preview-card">' +
            '<div class="profile-avatar-lg" style="background:'+p.color+'">'+p.avatar+'</div>' +
            '<div class="profile-preview-name">'+p.name+'</div>' +
            '<div class="profile-preview-desc">'+p.desc+'</div>' +
            '<div class="profile-preview-details">'+p.details.split(', ').map(function(d){return '<div class="profile-detail-item">&#10003; '+d+'</div>';}).join('')+'</div>' +
          '</div>' +
        '</div>';
    });
    carouselHtml +=
        '</div>' +
        '<div class="carousel-nav">' +
          '<button class="carousel-btn carousel-prev" id="carPrev">&#8592;</button>' +
          '<div class="carousel-dots" id="carDots"><span class="dot active"></span><span class="dot"></span><span class="dot"></span></div>' +
          '<button class="carousel-btn carousel-next" id="carNext">&#8594;</button>' +
        '</div>' +
      '</div>';

    // Timer
    var timerHtml = '<div class="timer-bar"><span class="timer-text">Discount expires in</span><span class="timer-countdown" id="timerCountdown">23:59:59</span></div>';

    // Pricing cards
    var pricingHtml =
      '<div class="pricing-grid">' +
        '<div class="pricing-card" data-plan="base"><div class="pricing-name">BASE</div><div class="pricing-price"><span class="currency">$</span>19<span class="period"> /month</span></div><ul class="pricing-features">' +
          '<li><span class="check">&#10003;</span> Basic profile level</li>' +
          '<li><span class="check">&#10003;</span> 19 tokens for AI content</li>' +
          '<li><span class="check">&#10003;</span> Up to 6 clients/month</li>' +
          '<li><span class="check">&#10003;</span> AI module for Google & Meta</li>' +
          '<li><span class="check">&#10003;</span> AI competitor monitoring</li>' +
          '<li><span class="check">&#10003;</span> AI client assistant</li>' +
          '<li><span class="check">&#10003;</span> Referral earnings</li>' +
          '<li><span class="check">&#10003;</span> Private chat for specialists</li>' +
          '<li><span class="check">&#10003;</span> Built-in CRM system</li>' +
          '<li><span class="check">&#10003;</span> Secure messenger</li>' +
          '<li><span class="cross">&#10007;</span> Top in Google by your name</li>' +
          '<li><span class="cross">&#10007;</span> Reputation checks</li>' +
          '<li><span class="cross">&#10007;</span> 24/7 personal manager</li>' +
          '<li><span class="cross">&#10007;</span> Social media promotion</li>' +
          '<li><span class="cross">&#10007;</span> Boost rating</li>' +
          '<li><span class="cross">&#10007;</span> Custom service pricing</li>' +
        '</ul></div>' +
        '<div class="pricing-card popular" data-plan="pro"><div class="pricing-name">PRO</div><div class="pricing-price"><span class="currency">$</span>99<span class="period"> /month</span></div><ul class="pricing-features">' +
          '<li><span class="check">&#10003;</span> Professional profile level</li>' +
          '<li><span class="check">&#10003;</span> AI Pro avatar</li>' +
          '<li><span class="check">&#10003;</span> 109 tokens (+10% bonus)</li>' +
          '<li><span class="check">&#10003;</span> Up to 30 clients/month</li>' +
          '<li><span class="check">&#10003;</span> Up to 10 reputation checks</li>' +
          '<li><span class="check">&#10003;</span> AI module for Google & Meta</li>' +
          '<li><span class="check">&#10003;</span> AI competitor monitoring</li>' +
          '<li><span class="check">&#10003;</span> AI client assistant</li>' +
          '<li><span class="check">&#10003;</span> Referral earnings</li>' +
          '<li><span class="check">&#10003;</span> Private chat for specialists</li>' +
          '<li><span class="check">&#10003;</span> Built-in CRM system</li>' +
          '<li><span class="check">&#10003;</span> Secure messenger</li>' +
          '<li><span class="check">&#10003;</span> Boost rating</li>' +
          '<li><span class="check">&#10003;</span> Custom service pricing</li>' +
          '<li><span class="cross">&#10007;</span> Top in Google by your name</li>' +
          '<li><span class="cross">&#10007;</span> 24/7 personal manager</li>' +
          '<li><span class="cross">&#10007;</span> Exclusive social promotion</li>' +
        '</ul></div>' +
        '<div class="pricing-card" data-plan="premium"><div class="pricing-name">PREMIUM</div><div class="pricing-price"><span class="currency">$</span>299<span class="period"> /month</span></div><ul class="pricing-features">' +
          '<li><span class="check">&#10003;</span> Premium profile level</li>' +
          '<li><span class="check">&#10003;</span> AI Premium avatar</li>' +
          '<li><span class="check">&#10003;</span> 389 tokens (+30% bonus)</li>' +
          '<li><span class="check">&#10003;</span> Unlimited clients</li>' +
          '<li><span class="check">&#10003;</span> Top in Google by your name</li>' +
          '<li><span class="check">&#10003;</span> Unlimited reputation checks</li>' +
          '<li><span class="check">&#10003;</span> 24/7 personal manager</li>' +
          '<li><span class="check">&#10003;</span> Exclusive social promotion</li>' +
          '<li><span class="check">&#10003;</span> AI module for Google & Meta</li>' +
          '<li><span class="check">&#10003;</span> AI competitor monitoring</li>' +
          '<li><span class="check">&#10003;</span> AI client assistant</li>' +
          '<li><span class="check">&#10003;</span> Referral earnings</li>' +
          '<li><span class="check">&#10003;</span> Private chat for specialists</li>' +
          '<li><span class="check">&#10003;</span> Built-in CRM system</li>' +
          '<li><span class="check">&#10003;</span> Secure messenger</li>' +
          '<li><span class="check">&#10003;</span> Boost rating</li>' +
          '<li><span class="check">&#10003;</span> Custom service pricing</li>' +
        '</ul></div>' +
      '</div>';

    var d = el('div', '', carouselHtml + timerHtml + pricingHtml);
    wrap.appendChild(d);

    // Carousel logic
    setTimeout(function() {
      var track = document.getElementById('carouselTrack');
      var dots = document.querySelectorAll('#carDots .dot');
      var prevBtn = document.getElementById('carPrev');
      var nextBtn = document.getElementById('carNext');
      var idx = 0;
      var total = 3;

      function goTo(i) {
        idx = Math.max(0, Math.min(i, total - 1));
        track.style.transform = 'translateX(-' + (idx * 100) + '%)';
        dots.forEach(function(d,j) { d.classList.toggle('active', j === idx); });
      }

      prevBtn.addEventListener('click', function(e) { e.stopPropagation(); goTo(idx - 1); });
      nextBtn.addEventListener('click', function(e) { e.stopPropagation(); goTo(idx + 1); });
      dots.forEach(function(d,j) { d.addEventListener('click', function(e) { e.stopPropagation(); goTo(j); }); });

      // Touch swipe
      var startX = 0;
      track.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; });
      track.addEventListener('touchend', function(e) {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(idx + (diff > 0 ? 1 : -1));
      });

      // Plan selection
      wrap.querySelectorAll('.pricing-card[data-plan]').forEach(function(pc) {
        pc.addEventListener('click', function() {
          wrap.querySelectorAll('.pricing-card[data-plan]').forEach(function(c){ c.classList.remove('selected-plan'); });
          pc.classList.add('selected-plan');
          quizData.plan = pc.dataset.plan;
        });
      });
    }, 100);

    // Continue button
    var btn = el('button', 'card-btn', 'Continue &rarr;');
    btn.addEventListener('click', function() { advance(); });
    wrap.appendChild(btn);
  }

  // ---- Payment ----
  function renderPaymentCard(wrap) {
    var html =
      '<div class="discount-summary">' +
        '<div class="discount-row"><span>Pro plan -- 12 months</span><span>$1,188.00</span></div>' +
        '<div class="discount-row"><span>Urgency discount (20%)</span><span class="saved">-$237.60</span></div>' +
        '<div class="discount-row"><span>Referral code (10%)</span><span class="saved">-$118.80</span></div>' +
        '<div class="discount-row"><span>Annual discount (10%)</span><span class="saved">-$118.80</span></div>' +
        '<div class="discount-row total"><span>Total</span><span>$712.80</span></div>' +
        '<div style="text-align:center;margin-top:8px"><span class="badge badge-green" style="font-size:13px;padding:6px 14px">You just saved $475.20 (40% off)</span></div>' +
      '</div>' +
      '<div class="payment-icons"><svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#1434CB"/><text x="19" y="15" font-size="9" fill="#fff" text-anchor="middle" font-weight="bold" font-family="Arial">VISA</text></svg><svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#252525"/><circle cx="15" cy="12" r="7" fill="#EB001B"/><circle cx="23" cy="12" r="7" fill="#F79E1B"/><path d="M19 6.5a7 7 0 010 11 7 7 0 010-11z" fill="#FF5F00"/></svg><svg class="pay-icon" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#003087"/><text x="19" y="15" font-size="7" fill="#fff" text-anchor="middle" font-weight="bold" font-family="Arial">PayPal</text></svg></div>' +
      '<div class="payment-buttons"><button class="btn btn-paypal" id="paypalBtn"><span class="btn-icon-paypal">P</span> Pay with PayPal</button><button class="btn btn-primary" id="cardBtn"><span class="btn-icon-card">&#128179;</span> Pay with Card</button></div>' +
      '<div class="timer-bar"><span class="timer-text">Discount expires in</span><span class="timer-countdown" id="timerCountdown2">23:59:59</span></div>' +
      '<h3 class="faq-heading">Frequently Asked Questions</h3>' +
      '<div class="faq-list">' +
        '<div class="faq-item"><div class="faq-question">How many clients can I expect per month?</div><div class="faq-answer"><div class="faq-answer-inner">Depending on your specialization, city, and profile optimization -- many lawyers receive 5-15 clients already in the first month, scaling to 20-30+ over time thanks to AI-generated content and SEO promotion.</div></div></div>' +
        '<div class="faq-item"><div class="faq-question">Is this a guaranteed number of clients?</div><div class="faq-answer"><div class="faq-answer-inner">We provide you with leads that you work with yourself. You can also work under exclusive conditions with platform clients, in which case these are already paid clients.</div></div></div>' +
        '<div class="faq-item"><div class="faq-question">How does the pricing work?</div><div class="faq-answer"><div class="faq-answer-inner">We have a three-tier subscription: Basic, Pro, and Premium. The cost is significantly lower than traditional marketing agencies. Many lawyers cover the subscription cost with just 1-2 clients.</div></div></div>' +
        '<div class="faq-item"><div class="faq-question">What if there are no clients?</div><div class="faq-answer"><div class="faq-answer-inner">The presence of leads depends on your activity on the platform. We guarantee uninterrupted access to the platform and its resources. Payment is non-refundable once access has been provided.</div></div></div>' +
        '<div class="faq-item"><div class="faq-question">Is my data safe?</div><div class="faq-answer"><div class="faq-answer-inner">Yes, we use a secure messenger, data encryption, and do not transfer information to third parties. The platform complies with GDPR and data protection regulations.</div></div></div>' +
      '</div>';
    var d = el('div', '', html);
    wrap.appendChild(d);

    setTimeout(function() {
      wrap.querySelectorAll('.faq-question').forEach(function(q) {
        q.addEventListener('click', function() { q.parentElement.classList.toggle('open'); });
      });
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
