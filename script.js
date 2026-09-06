// Powertec Training — shared site script
// Handles mobile nav toggle + simple localStorage-based progress tracking.

document.addEventListener('DOMContentLoaded', function () {
  // Hamburger nav panel (site-wide), with click-outside-to-close scrim.
  var btns = document.querySelectorAll('.hamburger');
  var panel = document.getElementById('navPanel');
  if (panel && btns.length) {
    var scrim = document.createElement('div');
    scrim.className = 'nav-scrim';
    document.body.appendChild(scrim);

    function closeNav() {
      panel.classList.remove('open');
      scrim.classList.remove('open');
      btns.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    }
    function openNav() {
      panel.classList.add('open');
      scrim.classList.add('open');
      btns.forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    }
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (panel.classList.contains('open')) closeNav(); else openNav();
      });
    });
    scrim.addEventListener('click', closeNav);
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
  }

  // Generic checkbox progress tracker.
  // Any checkbox with data-track="some-key" persists its checked state in localStorage.
  var trackedBoxes = document.querySelectorAll('input[type="checkbox"][data-track]');
  trackedBoxes.forEach(function (box) {
    var key = 'pt_' + box.getAttribute('data-track');
    var saved = localStorage.getItem(key);
    if (saved === '1') box.checked = true;
    box.addEventListener('change', function () {
      localStorage.setItem(key, box.checked ? '1' : '0');
      updateProgressBars();
    });
  });

  // Text/select fields that persist their value.
  var trackedFields = document.querySelectorAll('[data-track-field]');
  trackedFields.forEach(function (field) {
    var key = 'ptf_' + field.getAttribute('data-track-field');
    var saved = localStorage.getItem(key);
    if (saved !== null) field.value = saved;
    field.addEventListener('input', function () {
      localStorage.setItem(key, field.value);
    });
    field.addEventListener('change', function () {
      localStorage.setItem(key, field.value);
    });
  });

  updateProgressBars();
});

function updateProgressBars() {
  document.querySelectorAll('[data-progress-group]').forEach(function (bar) {
    var group = bar.getAttribute('data-progress-group');
    var boxes = document.querySelectorAll('input[type="checkbox"][data-track^="' + group + '"]');
    if (!boxes.length) return;
    var total = boxes.length, done = 0;
    boxes.forEach(function (b) { if (b.checked) done++; });
    var pct = Math.round((done / total) * 100);
    var fill = bar.querySelector('span');
    if (fill) fill.style.width = pct + '%';
    var label = bar.parentElement.querySelector('.progress-label');
    if (label) label.textContent = done + ' / ' + total + ' complete (' + pct + '%)';
  });
}
