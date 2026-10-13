/*
 * Поле телефону з вибором країни (прапор + префікс + маска) — як у проєктах компанії (phone-country-dropdown, soinproduction/_country_dropdown.scss),
 * але без jQuery і jquery.mask. Розмітка та класи ті самі: .js-call-trigger-modal__input-group > .country-select (.js-selected-country, .country-select__option[data-value][data-country-value])
 * + input[type=tel]; маски — у data-mask опцій (Z — цифра). Поведінка: клік по кнопці перемикає `open`; вибір країни підставляє прапор, префікс і маску;
 * введення іншого префікса вручну перемикає країну; у приховане поле name="country_code" пишеться код країни. Події: input на полі після кожної зміни.
 */
(function () {
  'use strict';
  var NEUTRAL_MASK = '+ZZZ (ZZ) ZZZ-ZZ-ZZ';
  function digitsOf(s) { return String(s || '').replace(/\D/g, ''); }
  function zCount(mask) { return (mask.match(/Z/g) || []).length; }
  function format(mask, prefixDigits, national) {
    // маска містить код країни літерально («+380 (ZZ) ZZZ-ZZZZ»); для «іншої країни» код набирає користувач («+ZZZ …»)
    var out = '', i = 0;
    for (var k = 0; k < mask.length; k++) {
      var ch = mask[k];
      if (ch === 'Z') { if (i >= national.length) break; out += national[i++]; }
      else out += ch;
    }
    // не залишати роздільники після останньої цифри
    return out.replace(/[\s()\-]+$/, '');
  }
  function attach(group, opts) {
    if (!group || group.dataset.initialized === 'true') return;
    group.dataset.initialized = 'true';
    opts = opts || {};
    var input = group.querySelector('input[type="tel"]'), select = group.querySelector('.country-select'), button = group.querySelector('.js-selected-country');
    var flag = button && button.querySelector('img'), options = Array.prototype.slice.call(group.querySelectorAll('.country-select__option'));
    var hidden = input.form ? input.form.elements.namedItem(input.dataset.countryCodeName || 'country_code') : null;
    if (!input || !select || !button || !flag || !options.length) return;
    var cur = null;
    function optData(li) { return { el: li, code: li.getAttribute('data-value'), country: li.getAttribute('data-country-value'), mask: li.getAttribute('data-mask') || NEUTRAL_MASK, flag: li.querySelector('.flag').getAttribute('src'), name: (li.querySelector('.country-name') || {}).textContent || '' }; }
    function byCountry(c) { for (var i = 0; i < options.length; i++) if (options[i].getAttribute('data-country-value') === c) return optData(options[i]); return null; }
    function national() {  // цифри без коду країни
      var d = digitsOf(input.value);
      if (cur.country === 'NEUTRAL') return d;
      var pre = digitsOf(cur.code);
      return d.indexOf(pre) === 0 ? d.slice(pre.length) : d;
    }
    function render(nat) {
      var max = zCount(cur.mask); nat = nat.slice(0, max);
      input.value = nat.length ? format(cur.mask, digitsOf(cur.code), nat) : cur.code;
    }
    function setCountry(country, keepDigits) {
      var o = byCountry(country) || optData(options[0]); var nat = keepDigits && cur ? national() : '';
      cur = o; flag.setAttribute('src', o.flag); button.setAttribute('data-country', o.country); button.setAttribute('aria-label', o.name + ' ' + o.code);
      options.forEach(function (li) { li.setAttribute('aria-selected', li === o.el ? 'true' : 'false'); });
      input.placeholder = o.code; if (hidden) hidden.value = o.country;
      render(nat);
      if (opts.onChange) opts.onChange(getState());
    }
    function getState() {
      var nat = national(), need = zCount(cur.mask), valid = cur.country === 'NEUTRAL' ? (nat.length >= 8 && nat.length <= 15) : nat.length === need;
      return { country: cur.country, code: cur.code, national: nat, valid: valid, value: input.value, e164: cur.country === 'NEUTRAL' ? '+' + nat : cur.code + nat };
    }
    function open(on) { select.classList.toggle('open', on); button.setAttribute('aria-expanded', on ? 'true' : 'false'); }
    options.forEach(function (li) { li.setAttribute('role', 'option'); li.addEventListener('click', function () { setCountry(li.getAttribute('data-country-value')); open(false); input.focus(); input.dispatchEvent(new Event('input', { bubbles: true })); }); });
    button.addEventListener('click', function () { open(!select.classList.contains('open')); });
    input.addEventListener('focus', function () { open(false); });
    document.addEventListener('click', function (e) { if (!select.contains(e.target) && e.target !== input) open(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
    input.addEventListener('input', function () {
      var d = digitsOf(input.value);
      // введений інший код країни — перемкнути
      if (cur.country !== 'NEUTRAL' || d.length >= 1) {
        var match = null;
        options.forEach(function (li) { var c = li.getAttribute('data-country-value'), pre = digitsOf(li.getAttribute('data-value')); if (c !== 'NEUTRAL' && pre && d.indexOf(pre) === 0 && (!match || pre.length > digitsOf(match.getAttribute('data-value')).length)) match = li; });
        if (match && match.getAttribute('data-country-value') !== cur.country && input.value.charAt(0) === '+' && cur.country === 'NEUTRAL') { cur = optData(match); flag.setAttribute('src', cur.flag); button.setAttribute('data-country', cur.country); if (hidden) hidden.value = cur.country; input.placeholder = cur.code; }
      }
      render(national());
      if (opts.onChange) opts.onChange(getState());
    });
    input.addEventListener('keydown', function (e) {  // не давати стерти код країни
      if (e.key === 'Backspace' && cur.country !== 'NEUTRAL' && input.selectionStart <= cur.code.length && input.selectionEnd <= cur.code.length) e.preventDefault();
    });
    setCountry(opts.country || button.getAttribute('data-country') || options[0].getAttribute('data-country-value'));
    group.__phone = { getState: getState, setCountry: setCountry };
  }
  function attachAll() { Array.prototype.forEach.call(document.querySelectorAll('.js-call-trigger-modal__input-group'), function (g) { attach(g); }); }
  window.PhoneCountryDropdown = { attach: attach, getState: function (group) { return group && group.__phone ? group.__phone.getState() : null; }, setCountry: function (group, c) { if (group && group.__phone) group.__phone.setCountry(c); } };
})();
