# 3D-Printer-Bot
Raspberry Pi based bot to control 3D Printers

## How to setup

1. Open terminal on Raspberry Pi on network
2. `git clone https://github.com/UW-Makerspace/3D-Printer-Bot.git`
3. `cd 3D-Printer-Bot`
4. `npm install`
	- note this needs internet to grab files
	- Run `sudo apt install npm` if it says "npm command not found"
5. move `keys.js` file from drive into this folder of all the printer auth information
	- `cp /home/pi/Downloads/keys.js ./` if in folder on Pi in terminal
6. `node server.js` to start