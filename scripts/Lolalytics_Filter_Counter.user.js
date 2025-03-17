// IMPORTANT: due to Lolalytics Server Side rendering this script doesn't really work all that well


let cutOff = 1000; // minimum games played
let loadtime = 0; // time to wait before executing function

btn1 = document.querySelector("[data-type='strong_counter']");
btn2 = document.querySelector("[data-type='weak_counter']");
btn1.onclick = filterCounter;
btn2.onclick = filterCounter;

function filterCounter() {
    setTimeout(() => {
        let counterPage = document.querySelector("[q\\:id='hl']");
        for (i = 1; i <= 5; i++) {
            let lane = counterPage.children[i];
            let counterChamps = lane.children[1].children[0].children;
            for (let champ of counterChamps) {
                let games = Number(champ.children[5].innerText.replace(/\./g, ""));
                if (games < cutOff) {
                    champ.remove();
                }
            }
        }
    }, loadtime);
}