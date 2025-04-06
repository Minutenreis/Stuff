const LCUConnector = require('lcu-connector');
const child_process = require('child_process');
const connector = new LCUConnector();

let runningInterval = null;
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const championsData  = require('./champion.json');

const keyToNameMap = new Map();

for (const champId in championsData.data) {
  const champ = championsData.data[champId];
  champ.name = champ.name.replaceAll(' ', '').replaceAll('\'', '').toLowerCase();
  keyToNameMap.set(champ.key, champ.name);
}

lastChamp = null;

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
  var url = `https://lolalytics.com/lol/${champName}/build/`;
  var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
  child_process.exec(start + ' ' + url);
}


function getCurrentChampion(data) {
  return setInterval(() => {
    fetch(`https://${data.address}:${data.port}/lol-champ-select/v1/current-champion`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(data.username + ":" + data.password).toString('base64'),
      },
    })
      .then(async (response) => {
        const resolvedResponse = await response.json();

        if (resolvedResponse.httpStatus === 404) {
        }
        else {
          if (resolvedResponse !== 0){
            const champName = keyToNameMap.get(resolvedResponse.toString());
            if (!champName) {
              console.log(resolvedResponse, champName);
            } else if (champName !== lastChamp) {
              lastChamp = champName;
              openLolalytics(champName);
            }
          }
        }
      })
      .catch((error) => {
      });
    
  }, 1000);
}