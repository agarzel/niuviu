(() => {
  const MAX_CHARS = 300;
  let selectedFileName = null;
  let originalTitleText = null;

  const applyFileName = (form) => {
    const titleEl = form.querySelector('.gfb__dropzone--placeholder--title');
    if (!titleEl) return;
    if (!originalTitleText) originalTitleText = titleEl.textContent || '';
    const desired = selectedFileName || originalTitleText;
    if (titleEl.textContent !== desired) titleEl.textContent = desired;
  };

  document.addEventListener('change', (e) => {
    if (!e.target || e.target.type !== 'file') return;
    const files = e.target.files;
    selectedFileName = (files && files.length > 0) ? files[0].name : null;
    const form = document.querySelector('.globo-formbuilder-wizard');
    if (!form) return;
    applyFileName(form);
    setTimeout(() => applyFileName(form), 50);
    setTimeout(() => applyFileName(form), 250);
  }, true);

  const patchForm = () => {
    const form = document.querySelector('.globo-formbuilder-wizard');
    if (!form) return;

    const textarea = form.querySelector('textarea.classic_rounded-input');
    if (textarea) {
      if (!textarea.hasAttribute('maxlength')) textarea.setAttribute('maxlength', MAX_CHARS);
      if (!form.querySelector('.custom-char-counter')) {
        const counter = document.createElement('div');
        counter.className = 'custom-char-counter';
        counter.textContent = `użyto ${textarea.value.length} znaków / ${MAX_CHARS}`;
        const taWrap = textarea.closest('.globo-form-input');
        (taWrap || textarea).insertAdjacentElement('afterend', counter);
      }
      if (!textarea.dataset.counterBound) {
        textarea.dataset.counterBound = '1';
        textarea.addEventListener('input', () => {
          const c = form.querySelector('.custom-char-counter');
          if (c) c.textContent = `użyto ${textarea.value.length} znaków / ${MAX_CHARS}`;
        });
      }
    }

    const fileInput = form.querySelector('input[type="file"]');
    if (fileInput && !form.querySelector('.custom-file-info')) {
      const info = document.createElement('div');
      info.className = 'custom-file-info';
      info.innerHTML = 'max. waga: 2MB<br>format pliku: JPG / JPEG / PNG / PDF / HEIC';
      const fileWrap = fileInput.closest('.globo-form-input');
      (fileWrap || fileInput).insertAdjacentElement('afterend', info);
    }

    applyFileName(form);
  };

  const interval = setInterval(patchForm, 400);
  setTimeout(() => clearInterval(interval), 20000);
  document.addEventListener('DOMContentLoaded', patchForm);
})();

(() => {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-anchor]');
    if (!btn) return;
    const target = document.querySelector(btn.dataset.anchor);
    if (!target) return;
    e.preventDefault();
    const header = document.querySelector('#header-component, header-component, sticky-header, header');
    const offset = header ? header.getBoundingClientRect().height : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

(() => {
  const injectDecoStar = () => {
    const section = document.querySelector('[id$="1779950794b0ea708a"]');
    if (!section || section.querySelector('.konkurs-form-deco-star')) return;
    const star = document.createElement('span');
    star.className = 'konkurs-form-deco-star';
    section.appendChild(star);
  };
  document.addEventListener('DOMContentLoaded', injectDecoStar);
  setTimeout(injectDecoStar, 300);
})();

(() => {
  const initWinnersFilter = () => {
    const section = document.querySelector('.contest-winners');
    if (!section) return;
    const buttons = section.querySelectorAll('.contest-winners__filter-btn');
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const month = btn.dataset.month;
        buttons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        section.querySelectorAll('.contest-winners__month').forEach((panel) => {
          panel.classList.toggle('is-visible', panel.dataset.month === month);
        });
      });
    });
  };

  document.addEventListener('DOMContentLoaded', initWinnersFilter);
  setTimeout(initWinnersFilter, 500);
})();
