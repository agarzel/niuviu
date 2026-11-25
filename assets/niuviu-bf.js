/* niuviu – Black Friday: licznik do końca promocji + dodawanie do koszyka bez przeładowania strony */
(function () {
  var TXT = {
    added: 'Dodano do koszyka',
    view: 'Zobacz koszyk',
    error: 'Nie udało się dodać produktu. Spróbuj ponownie.'
  };
  var ICON_CHECK = '<svg class="nbf-i" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function root() { return (window.Shopify && Shopify.routes && Shopify.routes.root) || '/'; }

  /* ---------- Licznik ---------- */
  function initCountdown(scope) {
    scope.querySelectorAll('[data-nbf-countdown]').forEach(function (box) {
      if (box.dataset.nbfReady) return;
      box.dataset.nbfReady = '1';
      var end = new Date(box.getAttribute('data-end')).getTime();
      if (isNaN(end)) return;
      var d = box.querySelector('[data-d]'), h = box.querySelector('[data-h]'),
          m = box.querySelector('[data-m]'), s = box.querySelector('[data-s]');
      var timer = box.querySelector('.nbf-timer'), ended = box.querySelector('.nbf-timer-end');
      function tick() {
        var left = Math.max(0, Math.floor((end - Date.now()) / 1000));
        if (left === 0) {
          if (timer) timer.hidden = true;
          if (ended) ended.hidden = false;
          return false;
        }
        d.textContent = pad(Math.floor(left / 86400));
        h.textContent = pad(Math.floor(left % 86400 / 3600));
        m.textContent = pad(Math.floor(left % 3600 / 60));
        s.textContent = pad(left % 60);
        return true;
      }
      if (tick()) {
        var id = setInterval(function () { if (!tick()) clearInterval(id); }, 1000);
      }
    });
  }

  /* ---------- Komunikat ---------- */
  var toastTimer;
  function toast(message, isError) {
    var el = document.querySelector('.nbf-toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'nbf-toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.classList.toggle('nbf-toast--error', !!isError);
    el.innerHTML = '';
    var text = document.createElement('span');
    text.className = 'nbf-toast__text';
    text.textContent = message;
    el.appendChild(text);
    if (!isError) {
      var btn = document.createElement('a');
      btn.className = 'nbf-toast__btn';
      btn.href = root() + 'cart';
      btn.textContent = TXT.view;
      btn.addEventListener('click', function (e) {
        var drawer = document.querySelector('cart-drawer-component');
        if (drawer && typeof drawer.open === 'function') {
          e.preventDefault();
          drawer.open();
          hide();
        }
      });
      el.appendChild(btn);
    }
    requestAnimationFrame(function () { el.classList.add('is-visible'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hide, isError ? 6000 : 4000);
    function hide() { el.classList.remove('is-visible'); }
  }

  /* ---------- Odświeżenie koszyka w motywie ---------- */
  function refreshThemeCart(added, sections) {
    return fetch(root() + 'cart.js', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        // Motywy Shopify z rodziny Horizon (m.in. Pitch): licznik w nagłówku i zawartość koszyka bocznego
        document.dispatchEvent(new CustomEvent('cart:update', {
          bubbles: true,
          detail: { resource: cart, sourceId: 'nbf-landing', data: { source: 'nbf-landing', itemCount: cart.item_count, productId: added.product_id, sections: sections || {} } }
        }));
        // Inne motywy – popularne oznaczenia licznika koszyka
        document.querySelectorAll('[data-cart-count], .cart-count-bubble span[aria-hidden], #CartCount, .cart-count').forEach(function (n) {
          n.textContent = cart.item_count;
        });
      })
      .catch(function () {});
  }

  /* ---------- Dodawanie do koszyka ---------- */
  function addToCart(form) {
    var btn = form.querySelector('.nbf-add');
    if (!btn || btn.classList.contains('is-loading')) return;
    var original = btn.innerHTML;
    btn.classList.add('is-loading');
    btn.setAttribute('aria-busy', 'true');

    var data = new FormData(form);
    if (!data.get('quantity')) data.set('quantity', '1');
    var sectionIds = [];
    document.querySelectorAll('cart-items-component[data-section-id]').forEach(function (c) {
      if (sectionIds.indexOf(c.dataset.sectionId) === -1) sectionIds.push(c.dataset.sectionId);
    });
    if (sectionIds.length) data.append('sections', sectionIds.join(','));

    fetch(root() + 'cart/add.js', {
      method: 'POST',
      headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      body: data
    })
      .then(function (r) { return r.json().then(function (json) { return { ok: r.ok, json: json }; }); })
      .then(function (res) {
        if (!res.ok || res.json.status) {
          throw new Error(res.json.description || res.json.message || TXT.error);
        }
        var item = res.json;
        btn.classList.remove('is-loading');
        btn.classList.add('is-added');
        btn.innerHTML = ICON_CHECK;
        setTimeout(function () {
          btn.classList.remove('is-added');
          btn.innerHTML = original;
        }, 1800);
        toast(TXT.added + (item.product_title ? ': ' + item.product_title : ''));
        return refreshThemeCart(item, item.sections);
      })
      .catch(function (err) {
        btn.classList.remove('is-loading');
        toast(err && err.message ? err.message : TXT.error, true);
      })
      .finally(function () {
        btn.removeAttribute('aria-busy');
      });
  }

  document.addEventListener('submit', function (e) {
    var form = e.target && e.target.closest ? e.target.closest('.nbf-add-form') : null;
    if (!form || !window.fetch) return;
    e.preventDefault();
    addToCart(form);
  });

  /* ---------- Start ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initCountdown(document); });
  } else {
    initCountdown(document);
  }
  document.addEventListener('shopify:section:load', function (e) { initCountdown(e.target); });
})();
