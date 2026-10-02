/* ============================================================================
   consultant-registration — доповнення до /site/js/consultant-registration.js
   1) Тур платформою: YouTube-фасад. Плеєр створюється лише після кліку, тож до
      цього моменту жодного запиту до YouTube немає (youtube-nocookie.com).
   2) Вбудований квіз v2: кнопки реєстрації відкривають квіз поверх сторінки
      (iframe), а не ведуть на /cabinet/quiz-register. Без JS посилання
      працюють як раніше.

   Конфіг — window.CLM_QUIZ = { src, lang, title } до підключення цього файлу.
   Endpoint заявок — window.QUIZ_SUBMIT_URL (квіз читає його зі сторінки).
   Події для GTM (dataLayer): quiz_open, quiz_step, quiz_submit, quiz_close,
   tour_video_play.
   ========================================================================== */
(function () {
  'use strict'

  var cfg = window.CLM_QUIZ || {}
  var QUIZ_SRC = cfg.src || 'quiz/index.html'
  var LANG = cfg.lang || 'uk'
  var TITLE = cfg.title || 'CONSULTANT'
  var TRIGGER = 'a[href*="/cabinet/quiz-register"], [data-quiz-open]'
  var OPEN_HASH = '#quiz-open'

  function track (event, data) {
    window.dataLayer = window.dataLayer || []
    var payload = { event: event }
    if (data) for (var k in data) payload[k] = data[k]
    window.dataLayer.push(payload)
  }

  // ── 1. Відео туру ──────────────────────────────────────────────────────────
  function startTourVideo (frame) {
    var box = frame.querySelector('.ytf')
    if (!box || box.getAttribute('data-loaded')) return
    box.setAttribute('data-loaded', '1')
    var title = box.getAttribute('data-title') || TITLE
    var id = box.getAttribute('data-yt')
    var src = box.getAttribute('data-src')
    var media

    if (id) {
      media = document.createElement('iframe')
      media.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
        '?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1'
      media.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen'
      media.allowFullscreen = true
      media.title = title
    } else if (src) {
      // Тимчасово самохостинг (ролик ще не на YouTube) — той самий вигляд.
      media = document.createElement('video')
      media.src = src
      media.controls = true
      media.autoplay = true
      media.playsInline = true
      media.setAttribute('playsinline', '')
    } else {
      return
    }

    box.innerHTML = ''
    box.appendChild(media)
    var btn = frame.querySelector('.vplay')
    if (btn) btn.classList.add('is-hidden')
    track('tour_video_play', { video_id: id || src, video_title: title })
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.vframe .vplay, .vframe .ytf') : null
    if (!btn) return
    var frame = btn.closest('.vframe')
    if (frame && frame.querySelector('.ytf')) startTourVideo(frame)
  })

  // Ставимо на паузу все, що грає на сторінці (відео й YouTube) — коли
  // відкривається квіз, звук зі сторінки не має йти паралельно.
  function pausePageMedia () {
    document.querySelectorAll('video').forEach(function (v) { if (!v.paused) v.pause() })
    document.querySelectorAll('.ytf iframe').forEach(function (f) {
      try {
        f.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }), '*')
      } catch (err) { /* ignore */ }
    })
  }

  // ── 2. Квіз поверх сторінки ────────────────────────────────────────────────
  var overlay = null
  var frame = null
  var isOpen = false
  var lastTrigger = null
  var historyPushed = false
  var step = 1

  function quizUrl () {
    // utm_* / gclid / fbclid з адреси лендингу — у квіз.
    var params = new URLSearchParams(window.location.search)
    params.set('embed', '1')
    params.set('lang', LANG)
    return QUIZ_SRC + (QUIZ_SRC.indexOf('?') >= 0 ? '&' : '?') + params.toString()
  }

  function build () {
    if (overlay) return
    overlay = document.createElement('div')
    overlay.className = 'qz-overlay'
    overlay.setAttribute('role', 'dialog')
    overlay.setAttribute('aria-modal', 'true')
    overlay.setAttribute('aria-label', TITLE)
    overlay.hidden = true

    frame = document.createElement('iframe')
    frame.className = 'qz-frame'
    frame.title = TITLE
    frame.setAttribute('allow', 'autoplay; fullscreen')
    frame.src = quizUrl()

    overlay.appendChild(frame)
    document.body.appendChild(overlay)
  }

  function tellQuiz (type) {
    try { frame.contentWindow.postMessage({ source: 'clm-quiz-host', type: type }, '*') } catch (e) { /* ignore */ }
  }

  function open (trigger) {
    build()
    if (isOpen) return
    isOpen = true
    lastTrigger = trigger || null
    pausePageMedia()

    overlay.hidden = false
    void overlay.offsetWidth // старт переходу opacity
    overlay.classList.add('is-open')
    document.documentElement.classList.add('qz-lock')
    tellQuiz('shown')
    setTimeout(function () { try { frame.focus() } catch (e) { /* ignore */ } }, 60)

    // «Назад» у браузері / жест на телефоні закриває квіз, а не сторінку.
    if (!historyPushed) {
      try { history.pushState({ clmQuiz: 1 }, '') ; historyPushed = true } catch (e) { /* ignore */ }
    }

    var label = trigger && trigger.textContent ? trigger.textContent.replace(/\s+/g, ' ').trim() : ''
    track('quiz_open', { quiz_step: step, quiz_trigger: label.slice(0, 60) })
  }

  function close (viaHistory) {
    if (!isOpen) return
    isOpen = false
    overlay.classList.remove('is-open')
    document.documentElement.classList.remove('qz-lock')
    tellQuiz('hidden')
    setTimeout(function () { if (!isOpen) overlay.hidden = true }, 240)

    if (historyPushed) {
      historyPushed = false
      if (!viaHistory) { try { history.back() } catch (e) { /* ignore */ } }
    }
    if (lastTrigger && lastTrigger.focus) {
      try { lastTrigger.focus({ preventScroll: true }) } catch (e) { /* ignore */ }
    }
    track('quiz_close', { quiz_step: step })
  }

  window.addEventListener('popstate', function () { if (isOpen) close(true) })

  document.addEventListener('keydown', function (e) {
    if (isOpen && e.key === 'Escape') close()
  })

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    var trigger = e.target.closest ? e.target.closest(TRIGGER) : null
    if (!trigger) return
    e.preventDefault()
    open(trigger)
  })

  // Прогрів: квіз починає вантажитись, щойно людина наводить/торкається кнопки,
  // тож на клік він відкривається одразу.
  function warm (e) {
    if (overlay) return
    if (e.target.closest && e.target.closest(TRIGGER)) build()
  }
  document.addEventListener('pointerover', warm, { passive: true })
  document.addEventListener('touchstart', warm, { passive: true })
  document.addEventListener('focusin', warm)

  window.addEventListener('message', function (e) {
    if (!frame || e.source !== frame.contentWindow) return
    var d = e.data
    if (!d || d.source !== 'clm-quiz') return
    if (d.type === 'close') close()
    else if (d.type === 'step') {
      step = d.step
      track('quiz_step', { quiz_step: d.step, quiz_step_id: d.id })
    } else if (d.type === 'submit') {
      track('quiz_submit', { quiz_lead_type: d.lead_type, quiz_step: d.step })
    }
  })

  // Пряме посилання на квіз (для реклами): /consultant-registration#quiz-open
  function openFromHash () {
    if (window.location.hash !== OPEN_HASH) return
    try { history.replaceState(null, '', window.location.pathname + window.location.search) } catch (e) { /* ignore */ }
    open(null)
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', openFromHash)
  else openFromHash()

  window.CLM_QUIZ_OPEN = open
  window.CLM_QUIZ_CLOSE = close
})()
