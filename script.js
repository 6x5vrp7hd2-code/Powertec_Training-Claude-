// Powertec Training — shared site script
// Handles mobile nav toggle + simple localStorage-based progress tracking.

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.mobile-toggle');
  var nav = document.querySelector('nav.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
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
