/* Форми «Запропонувати статтю / кейс / відео»: селекти й каскад ведуть у демо, бо Vue-компонент без сервера мертвий. */
(function () {
  var T = document.documentElement.lang === 'en' ? {
    fixed: 'Topic locked', fix: 'Lock topic', sub: 'Choose a subcategory*', svc: 'Choose a service*',
    gen: 'Generating…', genDone: 'Generate with AI'
  } : {
    fixed: 'Тему зафіксовано', fix: 'Зафіксувати тему', sub: 'Оберіть підкатегорію*', svc: 'Оберіть послугу*',
    gen: 'Генеруємо…', genDone: 'Згенерувати через ШІ'
  };

  function closeAll(except) {
    document.querySelectorAll('.modal-select.select.active').forEach(function (s) {
      if (s !== except) s.classList.remove('active');
    });
  }
  function input(sel) { return sel.querySelector('input.select__input'); }
  function name(sel) { var i = input(sel); return i ? i.getAttribute('name') : ''; }
  function find(n) {
    return [].slice.call(document.querySelectorAll('.modal-select.select')).filter(function (s) { return name(s) === n; })[0] || null;
  }
  function reset(sel, label) {
    if (!sel) return;
    var cur = sel.querySelector('.select__current');
    if (cur) { cur.innerHTML = '<span>' + label + '</span>'; cur.setAttribute('data-id', ''); }
    var i = input(sel); if (i) i.value = '';
  }
  function filterItems(sel, test) {
    if (!sel) return;
    sel.querySelectorAll('.select__item').forEach(function (li) {
      li.style.display = test(li) ? '' : 'none';
    });
  }

  document.addEventListener('click', function (e) {
    var header = e.target.closest('.modal-select.select .select__header');
    var btn = e.target.closest('.modal-select.select .select__btn');

    if (header) {
      var sel = header.closest('.select');
      if (sel.classList.contains('disabled')) return;
      closeAll(sel);
      sel.classList.toggle('active');
      return;
    }
    if (btn) {
      var sel2 = btn.closest('.select');
      var li = btn.closest('.select__item');
      var cur = sel2.querySelector('.select__current');
      if (cur) { cur.innerHTML = '<span>' + btn.textContent.trim() + '</span>'; cur.setAttribute('data-id', btn.getAttribute('data-id') || ''); }
      var inp = input(sel2); if (inp) inp.value = btn.getAttribute('data-id') || '';
      sel2.classList.remove('active');

      // каскад: рубрика → підкатегорія → послуга
      var n = name(sel2);
      if (n === 'content_task_id') {
        // тема обрана — ШІ-генерація стає доступною, як на бою
        document.querySelectorAll('.ai-btn').forEach(function (b) {
          b.removeAttribute('disabled'); b.classList.remove('ai-btn--disabled');
        });
      }
      if (n === 'parent_category_id') {
        var rid = li.getAttribute('data-id');
        var sub = find('category_id'), svc = find('service_id');
        reset(sub, T.sub); reset(svc, T.svc);
        filterItems(sub, function (x) { return x.getAttribute('data-parent') === rid; });
        filterItems(svc, function () { return false; });
      } else if (n === 'category_id') {
        var pid = li.getAttribute('data-parent'), sid = li.getAttribute('data-id');
        var svc2 = find('service_id');
        reset(svc2, T.svc);
        filterItems(svc2, function (x) { return x.getAttribute('data-parent') === pid && x.getAttribute('data-sub') === sid; });
      }
      return;
    }
    // «Зафіксувати тему»
    var fix = e.target.closest('.lang-form__btn');
    if (fix && !fix.disabled) {
      var topic = find('content_task_id');
      if (!topic || !input(topic).value) return;
      e.preventDefault();
      fix.textContent = T.fixed;
      fix.disabled = true;
      topic.classList.add('disabled');
      var h = topic.querySelector('.select__header');
      if (h) { h.style.color = '#ccc'; h.style.cursor = 'not-allowed'; }
      return;
    }
    if (!e.target.closest('.modal-select.select')) closeAll();
  });

  // «Згенерувати через ШІ» — мок: коротка пауза й готовий чорновик у редакторі
  document.addEventListener('click', function (e) {
    var ai = e.target.closest('.ai-btn, [class*="ai-generation-btn"]');
    if (!ai || ai.disabled) return;
    e.preventDefault();
    var label = ai.textContent.trim();
    ai.textContent = T.gen; ai.disabled = true;
    setTimeout(function () {
      var ed = document.querySelector('.ck-editor__editable, .ck-content');
      if (ed) {
        var uk = document.documentElement.lang !== 'en';
        ed.innerHTML = uk
          ? '<h2>Як оскаржити висновок ВЛК у 2026 році</h2><p>Висновок військово-лікарської комісії можна оскаржити в адміністративному порядку або в суді. У статті — покроковий алгоритм, строки та типові помилки.</p><ul><li>Куди подавати скаргу і в які строки</li><li>Які документи потрібні</li><li>Коли варто йти до суду</li></ul>'
          : '<h2>How to appeal a medical board decision in 2026</h2><p>A military medical board conclusion can be appealed administratively or in court. The article gives a step-by-step algorithm, deadlines and typical mistakes.</p><ul><li>Where and when to file</li><li>Which documents are needed</li><li>When to go to court</li></ul>';
        ed.dispatchEvent(new Event('input', { bubbles: true }));
      }
      ai.textContent = label; ai.disabled = false;
    }, 1400);
  });

  // мови: чекбокс додає вкладку мови поруч з «Українська» (на бою це робить Vue)
  var LANG = document.documentElement.lang === 'en'
    ? { uk: 'Ukrainian', en: 'English', ru: 'Russian' }
    : { uk: 'Українська', en: 'Англійська', ru: 'Російська' };
  document.addEventListener('DOMContentLoaded', function () {
    var ukCb = document.querySelector('input[name="selectedLanguages[uk]"]');
    if (ukCb) ukCb.checked = true;
  });
  document.addEventListener('change', function (e) {
    var cb = e.target.closest('input[type="checkbox"][name^="selectedLanguages"]');
    if (!cb) return;
    var code = (cb.name.match(/\[(\w+)\]/) || [])[1];
    var base = document.querySelector('.lang-form__btn.active') || document.querySelector('button.lang-form__btn');
    if (!base || !code) return;
    var row = base.parentElement;
    var existing = row.querySelector('[data-lang-tab="' + code + '"]');
    if (cb.checked && !existing) {
      var b = base.cloneNode(true);
      b.classList.remove('active'); b.textContent = LANG[code] || code; b.setAttribute('data-lang-tab', code);
      row.appendChild(b);
    } else if (!cb.checked && existing) {
      existing.remove();
    }
  });
  document.addEventListener('click', function (e) {
    var tab = e.target.closest('button.lang-form__btn[data-lang-tab], button.lang-form__btn.active');
    if (!tab || !tab.parentElement) return;
    if (tab.closest('.main-form__top--custom')) return;   // це «Зафіксувати тему», не вкладка
    tab.parentElement.querySelectorAll('button.lang-form__btn').forEach(function (b) { b.classList.remove('active'); });
    tab.classList.add('active');
  });
})();
