const LCUConnector = require('lcu-connector');
const child_process = require('child_process');
const connector = new LCUConnector();

let runningInterval = null;
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const championsData = require('./champion.json');

const keyToNameMap = new Map();

for (const champId in championsData.data) {
  const champ = championsData.data[champId];
  champ.name = champ.name.replaceAll(' ', '').replaceAll('\'', '').toLowerCase();
  keyToNameMap.set(champ.key, champ.name);
}

connector.on('connect', (data) => {
  runningInterval = getCurrentChampion(data);
});

connector.on('disconnect', () => {
  if (runningInterval) {
    clearInterval(runningInterval);
  }
});

// Start listening for the LCU client
connector.start();

function openLolalytics(champName) {
  console.log(`Opening ${champName} on lolalytics...`);
  var url = `https://lolalytics.com/lol/${champName}/build/`;
  var start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'sensible-browser');
  child_process.exec(start + ' ' + url);
}

SECONDS_BETWEEN_REQUESTS = 15; // seconds
secondsSinceLastRequest = SECONDS_BETWEEN_REQUESTS;
inChampSelect = false; // boolean to check if in champ select
champPicked = false; // boolean to check if champ is picked
lastChamp = null; // last champion picked (to avoid opening the same page multiple times)
function getCurrentChampion(data) {
  return setInterval(() => {

    // to avoid spamming the requests
    if ((!inChampSelect || champPicked) && secondsSinceLastRequest < SECONDS_BETWEEN_REQUESTS) {
      secondsSinceLastRequest++;
      return;
    }

    // console.log("Fetching current champion...");
    fetch(`https://${data.address}:${data.port}/lol-champ-select/v1/current-champion`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(data.username + ":" + data.password).toString('base64'),
      },
    })
      .then(async (response) => {
        const resolvedResponse = await response.json();

        if (resolvedResponse.httpStatus === 404) {
          inChampSelect = false;
          champPicked = false;
          secondsSinceLastRequest = 0;
        }
        else {
          inChampSelect = true;
          secondsSinceLastRequest = 0;
          if (resolvedResponse !== 0) {
            if (champPicked) {
              return;
            }
            champPicked = true;
            const champName = keyToNameMap.get(resolvedResponse.toString());
            if (champName !== lastChamp) {
              lastChamp = champName;
              openLolalytics(champName);
            }
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching current champion:', error);
      });

  }, 1000);
}