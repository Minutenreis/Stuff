// ==UserScript==
// @name Lolalytics WR Normalizer Champs
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

// Tier/region/patch changes go through the URL watcher above, but switching
// between the "Highest Win Build" / "Most Common Build" tabs re-renders the
// win rate stat box without touching the URL at all, so a debounced
// MutationObserver keeps the normalized value in sync for that case too.
// normalizeChampWR() is idempotent (guarded by a "marked" flag on the value
// node it rewrites), and it never touches childList/subtree itself in a way
// that would re-trigger this observer's own callback loop, so repeated
// firing is harmless.
let debounceTimer = null;
function scheduleNormalize() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(normalizeChampWR, debounceMs);
}
const observer = new MutationObserver(scheduleNormalize);
observer.observe(document.body, { childList: true, subtree: true });

selectMostCommon();
normalizeChampWR();

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

// "Win Rate:" (with colon) only ever appears once on the page, in the
// tier/region summary line ("Average Emerald+ Win Rate: 51.54%").
function getAverageWR() {
    const container = findDivByOwnText(text => text.includes("Win Rate:"));
    if (!container) {
        return null;
    }
    const match = container.textContent.match(/Win Rate:\s*([\d.]+)\s*%/);
    return match ? Number(match[1]) : null;
}

// The champion's own win rate stat box has no unique label ("Win Rate" is
// reused throughout the item/build tables further down the page), but it
// always sits immediately before the "WR Delta" box, which IS unique.
function getWinRateValueDiv() {
    const deltaLabel = findDivByOwnText(text => text.trim() === "WR Delta");
    const winRateBox = deltaLabel?.parentElement.previousElementSibling;
    return winRateBox ? winRateBox.firstElementChild : null;
}

function normalizeChampWR() {
    const valueDiv = getWinRateValueDiv();
    if (!valueDiv || valueDiv.marked) {
        return;
    }
    const avgWR = getAverageWR();
    if (avgWR == null) {
        return;
    }
    valueDiv.marked = true;
    const ogWR = Number(valueDiv.textContent.split("%")[0].trim());
    console.log("avgWR:", avgWR, "ogWR:", ogWR);

    // shifted normalization (ogWR - (avgWR - 50))
    const WR = Math.round((ogWR - avgWR + 50) * 100) / 100;
    console.log("WR:", WR);
    const color = getColor(WR);
    valueDiv.innerHTML = `<div style="color:${color}"> ${WR}%</div><div style="font-size: 8px; color: grey">${ogWR}%</div>`;
}

function getColor(WR) {
    const high = { r: 0, g: 255, b: 0 };
    const mid = { r: 230, g: 220, b: 215 };
    const low = { r: 255, g: 0, b: 0 };

    if (WR > 55) {
        return toRgb(high);
    } else if (WR > 50) {
        return toRgb(getGradientColor((WR - 50) / 5, high, mid));
    } else if (WR > 45) {
        return toRgb(getGradientColor((WR - 45) / 5, mid, low));
    } else {
        return toRgb(low);
    }
}

function getGradientColor(percentage, high, low) {
    const r = high.r * percentage + low.r * (1 - percentage);
    const g = high.g * percentage + low.g * (1 - percentage);
    const b = high.b * percentage + low.b * (1 - percentage);
    return { r: r, g: g, b: b };
}

function toRgb(color) {
    return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
}
