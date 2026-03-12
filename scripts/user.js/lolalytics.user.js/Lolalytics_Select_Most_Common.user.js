// ==UserScript==
// @name Lolalytics Select Most Common
// @match https://lolalytics.com/lol/*/build/*
// @run-at document-idle
// ==/UserScript==

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
      setTimeout(main, 250);
    }
  }
  , 111
);

function main() {
  selectMostCommon()
}

function selectMostCommon() {
  console.log('selected')
  const xpath = "//div[text()='Most Common Build']";
  const button = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  button.click();
}