// ==UserScript==
// @name Lolalytics WR Normalizer
// @match https://lolalytics.com/lol/tierlist/*
// @run-at document-idle
// ==/UserScript==

// !IMPORTANT this script does not run (well) with the new Lolalytics design as not all elements are loaded at the same time

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
            setTimeout(main, 250);
        }
    }
    , 111
);

function main() {

    //get average Winrate of Elo Bracket
    avgWRText = document.getElementsByClassName("ml-auto text-right")[0].textContent
    avgWR = avgWRText.split(":")[1].split("%")[0].trim()
    console.log("avgWR:", avgWR)
    //normalize Champion WR
    tableData = document.getElementsByClassName("m-auto w-[99%] sm:w-[98%] lg:w-[970px] xl:w-[1038px]  menu:relative menu:left-[30px] 2xl:w-[1280px]")[0].children
    index = 5;
    for (i = 2; i < tableData.length; i++) {
        div = tableData[i]
        ogStat = div.childNodes[index].innerText.split("\n")
        ogWR = ogStat[0]
        console.log("ogWR:", ogWR)
        WR = Math.round((div.childNodes[index].innerText.split("\n")[0] - avgWR + 50) * 100) / 100
        console.log("WR:", WR)
        color = getColor(WR)
        div.childNodes[index].innerHTML = '<div class="text-center"><span style="color:' + color + '"> ' + WR + '</span><br /><span class="mt-[2px] text-[11px] text-[#aaa]">' + ogStat[0] + "<br />" + ogStat[1] + "</span></div>"
    }
}

function getColor(WR) {
    high = { r: 0, g: 255, b: 0 }
    mid = { r: 230, g: 220, b: 215 }
    low = { r: 255, g: 0, b: 0 }

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
    var r = high.r * percentage + low.r * (1 - percentage);
    var g = high.g * percentage + low.g * (1 - percentage);
    var b = high.b * percentage + low.b * (1 - percentage);
    return { r: r, g: g, b: b };
}

function toRgb(color) {
    return "rgb(" + color.r + "," + color.g + "," + color.b + ")"
}