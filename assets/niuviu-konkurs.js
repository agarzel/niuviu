/* niuviu – landing konkursowy: licznik znaków i nazwa wybranego pliku */
(function () {
  function init(root) {
    root.querySelectorAll('[data-nvk-count]').forEach(function (ta) {
      var out = document.getElementById(ta.getAttribute('data-nvk-count'));
      if (!out) return;
      var update = function () { out.textContent = ta.value.length; };
      ta.addEventListener('input', update);
      update();
    });
    root.querySelectorAll('.nvk-drop input[type="file"]').forEach(function (input) {
      input.addEventListener('change', function () {
        var drop = input.closest('.nvk-drop');
        var label = drop && drop.querySelector('[data-nvk-file]');
        if (!label) return;
        if (input.files && input.files.length) {
          label.textContent = input.files[0].name;
          drop.classList.add('is-filled');
        }
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(document); });
  } else {
    init(document);
  }
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
