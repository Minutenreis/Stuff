// ==UserScript==
// @name Youtube Music Skip Artists
// @match https://music.youtube.com/*
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
      setTimeout(main, 1000);
    }
  }
  , 50
);

blockedArtists = ['Neffex', 'Lil Nas X']


async function main() {
  const subtitle = document.getElementsByClassName("subtitle ytmusic-player-bar")[0];
  const childElements = subtitle.firstElementChild.childNodes;

  // initial load takes longer
  while (childElements[0].nodeName === "TEMPLATE") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    childElements = subtitle.firstElementChild.childNodes;
  }


  // filter
  for (let i = 0; i < childElements.length; i++) {
    const child = childElements[i];
    if (child.nodeName === "A") {
      const artistName = child.textContent.trim();
      if (blockedArtists.includes(artistName)) {
        skipSong();
        return;
      }
    }
  }
}

function skipSong() {
  const nextButton = document.getElementsByClassName('next-button')[0];
  if (nextButton) {
    nextButton.click();
  }
}
