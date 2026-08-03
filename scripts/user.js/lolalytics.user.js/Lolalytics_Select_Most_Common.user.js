// ==UserScript==
// @name Lolalytics Select Most Common
// @match https://lolalytics.com/lol/*/build/*
// @run-at document-idle
// ==/UserScript==

const debounceMs = 250;

// Navigating to a new champion/build page should reset the build-ranking
// tab to "Most Common Build". This only needs to run once per navigation
// (not on every incidental DOM change), so it stays on the lightweight
// URL-polling approach rather than the MutationObserver below.
const fireOnHashChangesToo = true;
var pageURLCheckTimer = setInterval(
  function () {
    if (this.lastPathStr !== location.pathname
      || this.lastQueryStr !== location.search
      || (fireOnHashChangesToo && this.lastHashStr !== location.hash)
    ) {
      this.lastPathStr = location.pathname;
      this.lastQueryStr = location.search;
      this.lastHashStr = location.hash;
      setTimeout(selectMostCommon, debounceMs);
    }
  }
  , 111
);
selectMostCommon();

// Finds the <div> whose own first text node satisfies `predicate`, ignoring
// nested elements (tooltip "?" icons, hidden tooltip bodies) that would
// otherwise pollute a plain textContent match, as well as Qwik's own
// leading marker comments (e.g. content rendered through a <Slot> is
// preceded by a <!--qv q:s ...--> comment, not real markup). This is how
// every lookup below anchors on the page's actual visible labels instead
// of on build-specific q:key/q:id hashes or generic reused utility classes.
function findDivByOwnText(predicate) {
  for (const div of document.querySelectorAll("div")) {
    for (const node of div.childNodes) {
      if (node.nodeType === Node.COMMENT_NODE) {
        continue;
      }
      if (node.nodeType === Node.TEXT_NODE && predicate(node.textContent)) {
        return div;
      }
      break;
    }
  }
  return null;
}

// The tab is uniquely identified by its exact visible label. (Its
// data-type="pick" attribute looked promising but also matches the
// separate "Most Picked Rune Page" button elsewhere on the page.)
function selectMostCommon() {
  const button = findDivByOwnText(text => text.trim() === "Most Common Build");
  if (button) {
    button.click();
  }
}
