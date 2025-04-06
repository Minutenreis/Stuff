// ==UserScript==
// @name Lolalytics WR Normalizer Champs & Delta2 Calc
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
    normalizeChampWR()
    // calculateDelta2()
}

function normalizeChampWR() {
    const avgWRText = document.getElementsByClassName("ml-auto text-right")[0].textContent
    const avgWR = avgWRText.split(":")[1].split("%")[0].trim()
    console.log("avgWR:", avgWR)

    //normalize WR of champ
    const StatContainer = document.getElementsByClassName("mb-1 font-bold")[0]
    if (!StatContainer.marked) {
        StatContainer.marked = true
        const ogWR = StatContainer.textContent.split("%")[0].trim()
        console.log("ogWR:", ogWR)
        //shifted Normalization (ogWR - (avgWR - 50))
        WR = Math.round((ogWR - avgWR + 50) * 100) / 100
        // StatContainer.childNodes[1].nodeValue = WR
        //coloring
        console.log("WR:", WR)
        const color = getColor(WR)
        StatContainer.innerHTML = '<div style="color:' + color + '"> ' + WR + "%" + '<\div><div style="font-size: 8px; color: grey">' + ogWR + "%" + "</div>"
    }
}

// function calculateDelta2() {
//     const lane = getSelectedLane()
//     const laneIndex = laneToIndex(lane)
//     const laneMatchups = document.getElementsByClassName("CountersPanel_counters__U8zc5")[laneIndex].children[1].children[0].children
//     const delta2SquaredScaled = Array.from(laneMatchups, (matchup) => (matchup.children[3].innerText ** 2 * matchup.children[4].innerText / 100))
//     const delta2SquaredScaledSum = delta2SquaredScaled.reduce((a, b) => a + b, 0)
//     StatContainer = document.getElementsByClassName("ChampionStats_stats__26e3l")[0].children
//     if (!StatContainer[3].marked) {
//         StatContainer[3].marked = true
//         const pickrate = StatContainer[3].childNodes[0].innerHTML
//         console.log(pickrate)
//         StatContainer[3].childNodes[0].innerHTML = '<div> ' + pickrate + '<\div><div style="font-size: 8px; color: grey">' + Math.round(delta2SquaredScaledSum * 100) / 100 + "</div>"
//     }
// }

/**
 * get the selected lane
 * @returns "top" | "jungle" | "middle" | "bottom" | "support"
 */
// function getSelectedLane() {
//     const classSymbol = document.getElementsByClassName("LanePicker_inneractive__bEJGw")[0]
//     return classSymbol.children[0].alt
// }

// function laneToIndex(lane) {
//     switch (lane) {
//         case "top":
//             return 0
//         case "jungle":
//             return 1
//         case "middle":
//             return 2
//         case "bottom":
//             return 3
//         case "support":
//             return 4
//         default:
//             return -1
//     }
// }

function getColor(WR) {
    const high = { r: 0, g: 255, b: 0 }
    const mid = { r: 230, g: 220, b: 215 }
    const low = { r: 255, g: 0, b: 0 }

    if (WR > 55) {
        return toRgb(high)
    } else if (WR > 50) {
        return toRgb(getGradientColor((WR - 50) / 5, high, mid))
    } else if (WR > 45) {
        return toRgb(getGradientColor((WR - 45) / 5, mid, low))
    } else {
        return toRgb(low)
    }
}

function getGradientColor(percentage, high, low) {
    const r = high.r * percentage + low.r * (1 - percentage);
    const g = high.g * percentage + low.g * (1 - percentage);
    const b = high.b * percentage + low.b * (1 - percentage);
    return { r: r, g: g, b: b };
}

function toRgb(color) {
    return "rgb(" + color.r + "," + color.g + "," + color.b + ")"
}