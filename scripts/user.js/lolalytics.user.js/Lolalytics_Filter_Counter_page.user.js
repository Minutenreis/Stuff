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
    filter();
    let filterButtonQIds = ["3q", "3r", "3s", "3t", "3u", "3v"];
    for (const qid of filterButtonQIds) {
        const btn = document.querySelector(`[q\\:id='${qid}']`);
        if (btn) {
            btn.onclick = filterAfterTimeout;
        }
    }
}

function filterAfterTimeout() {
    setTimeout(filter, timeout);
}

function filter() {
    const counters = document.querySelectorAll("[q\\:key='2G_1']")[2];
    const champSpans = counters.children[0].children[1].children;
    let hideCounter = 0;
    for (const champSpan of champSpans) {
        if (champSpan.tagName !== "SPAN") {
            continue;
        }
        const gamesText = champSpan.children[0].children[0].children[0].children[5].innerText;
        const games = Number(gamesText.slice(0, -6).replace(/\,|\./g, ""));
        let hide = games < cutoff;
        hideCounter += Number(hide);
        if (hide) {
            champSpan.style.display = "none";
        } else {
            champSpan.style.display = "";
        }
    }
    console.log(`Filtered ${hideCounter} of ${champSpans.length} champions with less than ${cutoff} games played.`);
}