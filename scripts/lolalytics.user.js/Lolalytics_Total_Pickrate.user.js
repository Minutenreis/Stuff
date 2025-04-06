//estimate total games of champ
tableData = document.getElementsByClassName("TierList_list__j33gd")[0].children
for (var div of tableData) {
    index = div.childNodes[0].className.startsWith("ListRow_rank") ? 4 : 3; // lane%
    index2 = index + 4; // Games
    lanePercentage = div.childNodes[index].innerText
    games = div.childNodes[index2].innerText.split('.').join("")
    totalGames = Math.round(games / lanePercentage * 100)
    div.childNodes[index2].innerText = numberWithDots(totalGames)
}

function numberWithDots(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}