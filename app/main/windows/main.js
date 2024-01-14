const {BrowserWindow, Menu} = require('electron')
const isDev = require('electron-is-dev')

let win
function create () {
    Menu.setApplicationMenu(null) 
    win = new BrowserWindow({
        width: 600,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    if (isDev) {
        win.loadURL('http://localhost:3000')
    } else {
        win.loadFile(path.resolve(__dirname, '../../renderer/pages/main/index.html'))
    }
}

function send(channel, ...args) {
    win.webContents.send(channel, ...args)
}

module.exports = {create, send}