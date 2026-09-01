(function () {
  var LOCAL = location.origin;

  // Серверні шляхи бойового кабінету: у статичному демо їх нікому обслуговувати
  var API = [
    '/consultant/', '/broadcasting/', '/cabinet/', '/api/',
    '/call-trigger', '/livekit', '/login', '/logout'
  ];

  function isBlocked(url) {
    try {
      if (typeof url !== 'string') url = String(url);
      if (url.indexOf('#demo-action:') === 0) return true;
      if (/^(data|blob|javascript):/i.test(url)) return false;
      var u = new URL(url, location.href);
      if (u.origin !== LOCAL) return true;
      var p = u.pathname;
      for (var i = 0; i < API.length; i++) {
        if (p.indexOf(API[i]) === 0) return true;
      }
      return false;
    } catch (e) { return false; }
  }
  window.__demoIsBlocked = isBlocked;

  var _fetch = window.fetch;
  if (_fetch) {
    window.fetch = function (input, init) {
      var url = (input && input.url) ? input.url : input;
      if (isBlocked(url)) {
        return Promise.resolve(new Response('{}', {
          status: 200, headers: { 'Content-Type': 'application/json' }
        }));
      }
      return _fetch.apply(this, arguments);
    };
  }

  var _open = XMLHttpRequest.prototype.open;
  var _send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    this.__demoBlocked = isBlocked(url);
    if (this.__demoBlocked) {
      var a = Array.prototype.slice.call(arguments);
      a[0] = 'GET';
      a[1] = 'data:application/json,%7B%7D';
      return _open.apply(this, a);
    }
    return _open.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function (body) {
    if (this.__demoBlocked) return _send.call(this);
    return _send.apply(this, arguments);
  };

  if (navigator.sendBeacon) {
    var _beacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = function (url, data) {
      return isBlocked(url) ? true : _beacon(url, data);
    };
  }

  var _WS = window.WebSocket;
  if (_WS) {
    function DemoWS(url) {
      if (isBlocked(url)) {
        this.url = url; this.readyState = 3; this.bufferedAmount = 0; this.protocol = '';
        this.send = function () {}; this.close = function () {};
        this.addEventListener = function () {}; this.removeEventListener = function () {};
        this.dispatchEvent = function () { return false; };
        this.onopen = this.onclose = this.onerror = this.onmessage = null;
        return this;
      }
      return arguments.length > 1 ? new _WS(url, arguments[1]) : new _WS(url);
    }
    DemoWS.prototype = _WS.prototype;
    ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(function (k, i) { DemoWS[k] = i; });
    window.WebSocket = DemoWS;
  }

  // ---- тост ----
  var toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!document.body) return;
    if (!toastEl || !toastEl.isConnected) {
      toastEl = document.createElement('div');
      toastEl.className = 'demo-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    void toastEl.offsetWidth;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 3200);
  }
  window.demoToast = toast;

  var MSG_ACTION = 'Демо-режим: дія виконується на сервері, тут вона вимкнена.';
  var MSG_MODAL = 'Це вікно бойовий кабінет заповнює з сервера — у статичному демо воно порожнє.';

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else { fn(); }
  }

  onReady(function () {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#demo-action:"]');
      if (a) { e.preventDefault(); toast(MSG_ACTION); }
    }, true);

    document.addEventListener('submit', function (e) {
      var f = e.target;
      if (!f || f.tagName !== 'FORM') return;
      var action = f.getAttribute('action') || '';
      var method = (f.getAttribute('method') || 'get').toLowerCase();
      if (action.indexOf('#demo-action:') === 0 || method === 'post' || isBlocked(action)) {
        e.preventDefault(); e.stopPropagation();
        toast('Демо-режим: форма не надсилається на сервер.');
      }
    }, true);

    function closeShell(el) {
      el.classList.remove('active');
      document.querySelectorAll('.overlay.active').forEach(function (o) {
        o.classList.remove('active');
      });
      document.body.classList.remove('dis-scroll', 'modal-open', 'no-scroll', 'overflow-hidden');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // Модалки, які бойовий кабінет наповнює з сервера, у знімку порожні:
    // не показуємо чорний екран — знімаємо стан і пояснюємо.
    var seen = new WeakSet();
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        var el = m.target;
        if (!(el instanceof Element) || !el.classList.contains('modal')) return;
        if (!el.classList.contains('active')) return;
        if (el.textContent.trim() !== '' || el.querySelector('img,input,button,svg')) return;
        if (seen.has(el)) { el.classList.remove('active'); return; }
        seen.add(el);
        closeShell(el);
        toast(MSG_MODAL);
      });
    }).observe(document.documentElement, {
      subtree: true, attributes: true, attributeFilter: ['class']
    });
  });
})();
