/*
 * Code walkthrough: scroll the code panel so the highlighted chunk sits level
 * with the active step, and on a step with no code of its own keep the
 * previous chunk highlighted instead of greying the whole file.
 *
 * Reads only the rendered DOM (step markers and line classes). If a Realm
 * upgrade renames them, the panel falls back to Realm's default behavior.
 */
(function () {
  if (typeof MutationObserver === 'undefined') {
    return;
  }

  var PANEL = '.code-walkthrough [data-component-name="Markdoc/CodeWalkthrough/CodePanel"]';
  var PANEL_PRE = PANEL + ' pre';
  var ACTIVE_MARKER =
    '.code-walkthrough [data-component-name="Marker/Marker"][data-step-active="true"]';

  // Keep the chunk clear of the panel header when the step has scrolled above it.
  var TOP_PADDING_PX = 12;
  // Realm scrolls the chunk into view 200ms after a step change; run after it
  // so this alignment is the one that lands.
  var ALIGN_DELAY_MS = 260;
  // Clicking a step smooth-scrolls the page to it. Re-measure until the step
  // stops moving so the panel aligns with where the step ends up.
  var SETTLE_INTERVAL_MS = 120;
  var SETTLE_MAX_MS = 1200;

  var timer = null;
  var run = 0;
  // Line indexes of the last chunk highlighted in each file, keyed by a
  // fingerprint of the file as rendered.
  var lastChunkByFile = {};
  // True while the panel is showing a carried-over chunk; it is not re-aligned.
  var carried = false;

  function fileKey(allLines) {
    return allLines.length + ':' + (allLines[0] ? allLines[0].textContent : '');
  }

  // Viewport top of the active step's box (the element with the blue bar).
  // Each step renders its marker immediately before that box.
  function activeStepTop() {
    var marker = document.querySelector(ACTIVE_MARKER);
    var box = marker && marker.nextElementSibling;
    if (!box || !box.classList.contains('code-step-wrapper')) {
      return null;
    }
    return box.getBoundingClientRect().top;
  }

  // On a step with no code of its own, put back the chunk last shown in this
  // file. Runs inside the mutation callback, so before the next paint.
  function keepPreviousChunk() {
    var pre = document.querySelector(PANEL_PRE);
    if (!pre) {
      return false;
    }
    if (pre.querySelector('span.line.highlighted') || !pre.querySelector('span.line.greyed-out')) {
      return false;
    }
    var allLines = pre.querySelectorAll('span.line');
    var previous = lastChunkByFile[fileKey(allLines)];
    if (!previous) {
      return false;
    }
    for (var i = 0; i < previous.length; i++) {
      var line = allLines[previous[i]];
      if (line) {
        line.classList.add('highlighted');
        line.classList.remove('greyed-out');
      }
    }
    return true;
  }

  function align(id, lastStepTop, waited) {
    if (id !== run || carried) {
      return;
    }
    var pre = document.querySelector(PANEL_PRE);
    if (!pre) {
      return;
    }
    var allLines = pre.querySelectorAll('span.line');
    var lines = pre.querySelectorAll('span.line.highlighted');
    if (!lines.length || !pre.querySelector('span.line.greyed-out')) {
      // Nothing to point at (no highlight, or the whole file is selected).
      return;
    }
    lastChunkByFile[fileKey(allLines)] = Array.prototype.map.call(lines, function (l) {
      return Array.prototype.indexOf.call(allLines, l);
    });

    var stepTop = activeStepTop();
    if (stepTop !== null && stepTop !== lastStepTop && waited < SETTLE_MAX_MS) {
      setTimeout(function () {
        align(id, stepTop, waited + SETTLE_INTERVAL_MS);
      }, SETTLE_INTERVAL_MS);
      return;
    }

    var preRect = pre.getBoundingClientRect();
    var firstRect = lines[0].getBoundingClientRect();
    var lastRect = lines[lines.length - 1].getBoundingClientRect();

    var chunkOffset = firstRect.top - preRect.top + pre.scrollTop;
    var chunkHeight = lastRect.bottom - firstRect.top;

    // Where the chunk should start inside the panel: level with the step, but
    // never above the panel and, when the chunk fits, never cut off below.
    var stepOffset = stepTop === null ? TOP_PADDING_PX : stepTop - preRect.top;
    var lowestStart = Math.max(pre.clientHeight - chunkHeight - TOP_PADDING_PX, 0);
    var startOffset = Math.min(Math.max(stepOffset, TOP_PADDING_PX), lowestStart);

    var maxScrollTop = Math.max(pre.scrollHeight - pre.clientHeight, 0);
    var top = Math.min(Math.max(chunkOffset - startOffset, 0), maxScrollTop);

    var reduceMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    pre.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function onStepChange() {
    carried = false;
    clearTimeout(timer);
    run += 1;
    var id = run;
    timer = setTimeout(function () {
      align(id, null, 0);
    }, ALIGN_DELAY_MS);
  }

  // One observer for the whole document: it survives client-side navigation
  // and costs nothing on pages without a walkthrough. Realm flips the step
  // marker first and replaces the panel's code in a later commit, so the
  // carry-over runs when the code itself changes.
  new MutationObserver(function (mutations) {
    var stepChanged = false;
    var codeChanged = false;
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      var target = m.target;
      if (m.type === 'attributes') {
        if (target.getAttribute('data-step-active') === 'true') {
          stepChanged = true;
        }
      } else if (target.closest && target.closest(PANEL)) {
        codeChanged = true;
      }
    }
    if (stepChanged) {
      onStepChange();
    }
    if ((stepChanged || codeChanged) && keepPreviousChunk()) {
      carried = true;
    }
  }).observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['data-step-active'],
  });
})();
