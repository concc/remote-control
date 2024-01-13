const {app} = require('electron')
const handleIPC = require('./ipc')
const {create: createMainWindow} = require('./windows/main')

let win
app.on('ready', () => {
    createMainWindow()
    handleIPC()
    require('./robot.js')()
})