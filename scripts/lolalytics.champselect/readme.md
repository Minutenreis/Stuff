## How to use

1. Install Node.js (https://nodejs.org/en/download/) if you haven't already.

2. Install lcu-connector:
   ```bash
   npm install lcu-connector
   ```

3. (only on WSL) Set `BROWSER` variable to your windows default browser:
   ```bash
   export BROWSER="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"
   export BROWSER="/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
   export BROWSER="/mnt/c/Program Files (x86)/Mozilla Firefox/firefox.exe"
   ```

4. Run the script:
   ```bash
   node lola_champselect.js
   ```

5. Open the League of Legends client and start a game.

6. The script will automatically find the currently selected champion and open its Lolalytics page.

### Note

I haven't checked all URL's. I currently just autoconvert them from the champions.json file. If you find any broken links, please let me know.