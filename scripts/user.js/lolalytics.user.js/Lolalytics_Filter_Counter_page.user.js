// ==UserScript==
// @name Lolalytics Filter Counters
// @match https://lolalytics.com/lol/*/counters/*
// @run-at document-idle
// ==/UserScript==

const cutoff = 1000; // minimum games played
const debounceMs = 250; // time to let the DOM settle before re-filtering

let debounceTimer = null;

function scheduleFilter() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(filter, debounceMs);
}

// Each matchup card is an <a href=".../vs/<champ>/build/...">, identified
// semantically by its URL shape and by containing a "<games> Games" label,
// rather than by the site's build-specific q:key/q:id hashes (which change
// across deploys). The page also links to /vs/.../build/ from intro text
// and lane-select thumbnails, so requiring the "Games" label filters those
// out and keeps only the actual counter cards.
function filter() {
    const cards = document.querySelectorAll('a[href*="/vs/"][href*="/build/"]');
    let total = 0;
    let hideCounter = 0;
    for (const card of cards) {
        const match = card.textContent.match(/([\d.,]+)\s*Games/);
        if (!match) {
            continue;
        }
        total++;
        const games = Number(match[1].replace(/[.,]/g, ""));
        const hide = games < cutoff;
        hideCounter += Number(hide);
        card.parentElement.style.display = hide ? "none" : "";
    }
    console.log(`Filtered ${hideCounter} of ${total} champions with less than ${cutoff} games played.`);
}

// Sorting/filtering on the site re-renders the card list (childList
// mutations) rather than firing events we can hook, and SPA navigation does
// the same, so a debounced MutationObserver covers clicks, dropdown changes,
// and navigation alike without depending on any button ids. Watching only
// childList/subtree (not attributes) also means our own style.display
// writes below never re-trigger this observer.
const observer = new MutationObserver(scheduleFilter);
observer.observe(document.body, { childList: true, subtree: true });

filter();
