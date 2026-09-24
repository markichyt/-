# Компоненты — разметка (tokens.css + styles.css)

Подключение в `<head>`:
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Onest:wght@400;500;600&display=swap">
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="styles.css">
```
Иконки (контурные, currentColor):
```html
<!-- check --> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
<!-- chevron --> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>
```

## Навигация
```html
<nav class="nav" aria-label="Main">
  <div class="container">
    <a class="nav__logo" href="/"><img src="assets/logo/logo-on-light.svg" alt="CONSULTANT Legal Marketplace"></a>
    <div class="nav__links"><a href="#services">Services</a><a href="#lawyers">Lawyers</a><a href="#documents">Documents</a><a href="#how">How it works</a><a href="#reviews">Reviews</a></div>
    <div class="nav__actions"><a href="/login">Log in</a><a class="btn btn--sm" href="#help">Get help</a></div>
  </div>
</nav>
```

## Hero
```html
<section class="hero">
  <div class="container">
    <h1 class="display-1">A lawyer is always<br>there for you.</h1>
    <p class="lead">Verified lawyers and consultants, around the clock. Order a consultation, a document or a legal service — the specialist is paid only after you confirm the result.</p>
    <div class="hero__actions">
      <a class="btn btn--primary" href="#help">Get help</a>
      <a class="link" href="#app">Download the app <svg …chevron…></svg></a>
    </div>
    <div class="hero__visual"><!-- product mock or a sharp-cornered photo --></div>
  </div>
</section>
```

## Кнопки и ссылка
```html
<a class="btn btn--primary" href="#">Get help</a>      <!-- одна на экран -->
<a class="btn" href="#">Log in</a>                       <!-- чёрная -->
<a class="btn btn--white" href="#">Log in</a>            <!-- на чёрном фоне -->
<a class="btn btn--outline" href="#">All consultants</a>
<a class="btn btn--sm" href="#">Get help</a>
<a class="link" href="#">All consultants <svg …chevron…></svg></a>
```

## Поле и форма
```html
<form class="cta__form">
  <label class="sr-only" for="phone">Phone number</label>
  <input class="input" id="phone" type="tel" placeholder="+1 Phone number">
  <button class="btn btn--primary" type="submit">Get help</button>
</form>

<form class="form-card">
  <div class="form-row">
    <label class="sr-only" for="p2">Phone number</label><input class="input input--soft" id="p2" type="tel" placeholder="+1 Phone number">
    <button class="btn btn--primary" type="submit">Get help</button>
  </div>
  <div class="form-row">
    <label class="sr-only" for="fn">First name</label><input class="input input--soft" id="fn" type="text" placeholder="First name">
    <label class="sr-only" for="ln">Last name</label><input class="input input--soft" id="ln" type="text" placeholder="Last name">
  </div>
  <p class="caption">A personal manager will contact you — in the app, in any messenger or by phone.</p>
</form>
```

## Заголовок секции
```html
<div class="section-head">
  <h2 class="display-2">Everything legal, in one app.</h2>
  <p class="sub">Legal services, documents and consultations from verified specialists — anywhere in the world.</p>
</div>
```

## Статистика
```html
<section class="section-tight"><div class="container grid grid-4" style="text-align:center">
  <div><div class="stat">1000+</div><div class="stat-label">Specialists</div></div>
  <div><div class="stat">25 000+</div><div class="stat-label">Clients</div></div>
  <div><div class="stat">5000+</div><div class="stat-label">Successful services</div></div>
  <div><div class="stat">1200+</div><div class="stat-label">Positive reviews</div></div>
</div></section>
```

## Плитка услуги
```html
<article class="tile">
  <h3 class="display-3">Legal services</h3>
  <p class="body body--muted">Order legal or financial services at any point in the world from verified performers, with a guaranteed result, 24/7.</p>
  <ul class="check-list">
    <li><svg …check…></svg>Safe transaction</li>
    <li><svg …check…></svg>Transparent pricing</li>
    <li><svg …check…></svg>Verified performers</li>
    <li><svg …check…></svg>Control 24/7</li>
  </ul>
  <a class="link" href="#help" style="margin-top:auto">Order a service <svg …chevron…></svg></a>
</article>
```

## Шаги (чёрная полоса)
```html
<section class="section section--dark"><div class="container">
  <div class="section-head"><h2 class="display-2">How we work</h2><p class="sub">A professionally tuned process, from the first message to a confirmed result.</p></div>
  <div class="grid grid-3" style="gap:56px 40px">
    <div class="stack" style="gap:14px"><div class="step-number">01</div><h3 class="title">Reach out to us</h3><p class="body body--muted">CONSULTANT offers the widest range of services and unique solutions for the most complex situations.</p></div>
    <!-- …02–06 -->
  </div>
</div></section>
```

## Карточка консультанта
```html
<article class="card">
  <div class="row" style="justify-content:space-between"><div class="avatar">BC</div><span class="caption" style="font-weight:600">Top 1</span></div>
  <div class="stack" style="gap:4px"><div class="title-sm">Basil Chochla</div><div class="small body--muted">Lawyer · New York</div></div>
  <div class="row" style="align-items:baseline;gap:6px;margin-top:auto"><span class="display-3" style="font-size:28px">22.62</span><span class="caption">rating</span></div>
</article>
```

## Отзыв
```html
<blockquote class="quote">
  <p>“I liked that the service prices were clear and known in advance. There were no surprises, as often happens with in-person consultations.”</p>
  <footer><div class="avatar avatar--sm">VI</div><div><div class="small" style="font-weight:600">Viktor</div><div class="caption">Feb 4, 2026</div></div></footer>
</blockquote>
```

## CTA-полоса
```html
<section class="cta" id="help"><div class="container">
  <h2 class="display-1">Get help now.</h2>
  <p class="sub">A personal manager is available 24/7 — in the app, in any messenger or by phone.</p>
  <form class="cta__form"><label class="sr-only" for="phone-cta">Phone number</label><input class="input" id="phone-cta" type="tel" placeholder="+1 Phone number"><button class="btn btn--primary" type="submit">Get help</button></form>
</div></section>
```

## Футер
```html
<footer class="footer"><div class="container">
  <div class="footer__grid">
    <div class="stack" style="gap:16px"><img src="assets/logo/logo-icon.svg" alt="CONSULTANT" style="width:46px"><p class="small body--muted" style="max-width:280px">The largest ranking of lawyers and attorneys. Legal services, documents and consultations, 24/7.</p></div>
    <div class="footer__col"><span class="label">Services</span><a href="#">Legal services</a><a href="#">Documents</a><a href="#">Consultations</a></div>
    <div class="footer__col"><span class="label">Marketplace</span><a href="#">Consultants</a><a href="#">Reviews</a><a href="#">How we work</a></div>
    <div class="footer__col"><span class="label">Company</span><a href="#">Log in</a><a href="#">Terms</a><a href="#">Privacy policy</a></div>
    <div class="footer__col"><span class="label">Follow</span><a href="#">Telegram</a><a href="#">Instagram</a><a href="#">Facebook</a><a href="#">YouTube</a></div>
  </div>
  <div class="footer__bottom"><div>© 2026 CONSULTANT Legal Marketplace</div><div class="row" style="gap:10px"><a class="store" href="#">App Store</a><a class="store" href="#">Google Play</a></div></div>
</div></footer>
```

## Чипы, лейблы, live-точка, картинка
```html
<span class="chip"><span class="dot"></span>Manager online</span>
<span class="chip chip--tier">PRO</span>
<span class="chip chip--tier" data-tier="premium">PREMIUM</span>
<span class="label">Services</span>
<span class="t-brand-num" style="font-size:44px">3 500+</span>
<figure class="image image--bw" style="aspect-ratio:16/9"><img src="assets/images/hero-lawyer-bw.png" alt="A lawyer reviewing documents"></figure>
```

Метки уровней (`.chip--tier`), лейблы капсом (`.label`) и крупные цифры (`.stat`, `.t-brand-num`) набираются фирменным шрифтом `--font-brand` — правило §4 дизайн-системы; в тексте, кнопках и заголовках-предложениях он не используется.
