// ==UserScript==
// @name Lolalytics Filter Counters
// @match https://lolalytics.com/lol/*/counters/*
// @run-at document-idle
// ==/UserScript==

const cutoff = 1000; // minimum games played
const timeout = 250; // time to wait before executing function after button click

var fireOnHashChangesToo = true;
var pageURLCheckTimer = setInterval(
    function () {
        if (this.lastPathStr !== location.pathname
            || this.lastQueryStr !== location.search
            || (fireOnHashChangesToo && this.lastHashStr !== location.hash)
        ) {
            this.lastPathStr = location.pathname;
            this.lastQueryStr = location.search;
            this.lastHashStr = location.hash;
            setTimeout(main, timeout);
        }
    }
    , 111
);

function main() {
    filter()
    const btn = document.querySelector("[q\\:id='3q']");
    btn.onclick = filterAfterTimeout;
}

function filterAfterTimeout() {
    setTimeout(filter, timeout);
}

function filter() {
    const counters = document.querySelectorAll("[q\\:key='yJ_1']")[2];
    const champSpans = counters.children[0].children[1].children;
    for (const champSpan of champSpans) {
        if (champSpan.tagName !== "SPAN") {
            continue;
        }
        const gamesText = champSpan.children[0].children[0].children[0].children[5].innerText;
        const games = Number(gamesText.slice(0, -6).replace(/\,|\./g, ""));
        if (games < cutoff) {
            champSpan.style.display = "none";
        } else {
            champSpan.style.display = "";
        }
    }
}