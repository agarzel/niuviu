/* niuviu – Black Friday: licznik do końca promocji */
(function () {
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function init(root) {
    root.querySelectorAll('[data-nbf-countdown]').forEach(function (box) {
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
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(document); });
  } else {
    init(document);
  }
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
