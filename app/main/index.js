const {app, ipcMain} = require('electron')
const handleIPC = require('./ipc')
const {create: createMainWindow} = require('./windows/main')

app.on('ready', () => {
    createMainWindow()
    handleIPC()
    // require('./robot.js')()
})