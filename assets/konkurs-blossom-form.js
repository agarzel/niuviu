(function () {
  var MAX_CHARS = 1500;

  function patchForm() {
    var form = document.querySelector('.globo-formbuilder-wizard');
    if (!form) return;

    // 1. Character counter — re-insert if missing (handles Globo re-renders)
    var textarea = form.querySelector('textarea.classic_rounded-input');
    if (textarea) {
      if (!textarea.hasAttribute('maxlength')) textarea.setAttribute('maxlength', MAX_CHARS);
      if (!form.querySelector('.custom-char-counter')) {
        var counter = document.createElement('div');
        counter.className = 'custom-char-counter';
        counter.textContent = 'użyto ' + textarea.value.length + ' znaków / ' + MAX_CHARS;
        var taWrap = textarea.closest('.globo-form-input');
        (taWrap || textarea).insertAdjacentElement('afterend', counter);
      }
      // Bind listener once per textarea element instance
      if (!textarea.dataset.counterBound) {
        textarea.dataset.counterBound = '1';
        textarea.addEventListener('input', function () {
          var c = form.querySelector('.custom-char-counter');
          if (c) c.textContent = 'użyto ' + textarea.value.length + ' znaków / ' + MAX_CHARS;
        });
      }
    }

    // 2. File info — re-insert if missing
    var fileInput = form.querySelector('input[type="file"]');
    if (fileInput) {
      if (!form.querySelector('.custom-file-info')) {
        var info = document.createElement('div');
        info.className = 'custom-file-info';
        info.innerHTML = 'max. waga: 5MB<br>format pliku: JPG / JPEG / PNG / PDF / HEIC';
        var fileWrap = fileInput.closest('.globo-form-input');
        (fileWrap || fileInput).insertAdjacentElement('afterend', info);
      }
      if (!form.querySelector('.custom-file-selected')) {
        var selectedEl = document.createElement('div');
        selectedEl.className = 'custom-file-selected';
        selectedEl.style.display = 'none';
        var infoEl = form.querySelector('.custom-file-info');
        (infoEl || fileInput).insertAdjacentElement('afterend', selectedEl);
      }
      if (!fileInput.dataset.infoBound) {
        fileInput.dataset.infoBound = '1';
        fileInput.addEventListener('change', function () {
          var sel = form.querySelector('.custom-file-selected');
          if (fileInput.files && fileInput.files.length > 0) {
            if (sel) { sel.textContent = 'Wybrany plik: ' + fileInput.files[0].name; sel.style.display = ''; }
          } else {
            if (sel) sel.style.display = 'none';
          }
        });
      }
    }
  }

  // Retry every 400ms for 20 sec — survives Globo's dynamic re-render
  var interval = setInterval(patchForm, 400);
  setTimeout(function () { clearInterval(interval); }, 20000);
  document.addEventListener('DOMContentLoaded', patchForm);
})();

(function () {
  function injectDecoStar() {
    var section = document.querySelector('[id$="1779950794b0ea708a"]');
    if (!section || section.querySelector('.konkurs-form-deco-star')) return;
    var star = document.createElement('span');
    star.className = 'konkurs-form-deco-star';
    section.appendChild(star);
  }
  document.addEventListener('DOMContentLoaded', injectDecoStar);
  setTimeout(injectDecoStar, 300);
})();

(function () {
  function initWinnersFilter() {
    var section = document.querySelector('.contest-winners');
    if (!section) return;
    var buttons = section.querySelectorAll('.contest-winners__filter-btn');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var month = btn.dataset.month;
        buttons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        section.querySelectorAll('.contest-winners__month').forEach(function (panel) {
          panel.classList.toggle('is-visible', panel.dataset.month === month);
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initWinnersFilter);
  setTimeout(initWinnersFilter, 500);
})();
