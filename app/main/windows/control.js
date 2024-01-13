const {BrowserWindow} = require('electron')
const path = require('path')
const robot = require('robotjs')
let win
function create() {
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

module.exports = {create}