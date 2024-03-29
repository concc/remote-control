const {BrowserWindow, Menu} = require('electron')
const path = require('path')
const robot = require('robotjs')
let win
function create() {
    // Menu.setApplicationMenu(null) 
    win = new BrowserWindow({
        width: 1000,
        height: 680,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    win.loadFile(path.resolve(__dirname, '../../renderer/pages/control/index.html'))
}

function send(channel, ...args) {
    win.webContents.send(channel, ...args);
}


module.exports = {create, send}