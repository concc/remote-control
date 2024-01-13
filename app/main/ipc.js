const {ipcMain, desktopCapturer} = require('electron')
const {create: createControlWindow} = require('./windows/control')
const { IPC_EVENTS_NAME, WINDOW_NAME } = require('../common/enum')
const {send: sendMainWindow} = require('./windows/main')
const { send: sendControlWindow} = require('./windows/control')

module.exports = function() {
    ipcMain.handle(IPC_EVENTS_NAME.Login, async () => {
        // 这里是跟服务端的交互，先mock
        let code = Math.floor(Math.random()*(999999-100000)) + 100000;
        return code
    })

    ipcMain.on(IPC_EVENTS_NAME.Control, async (e, remoteCode) => {
        // 这里是跟服务端的交互，成功后我们会唤起面板
        createControlWindow()
        sendMainWindow('control-state-change', remoteCode, 1)
    })

    // 获取桌面共享id
    ipcMain.handle(IPC_EVENTS_NAME.GetSourceId, async () => {
        const sources = await desktopCapturer.getSources({ types: ['screen'] });
        console.log(sources)
        for (const source of sources) {
            if (source.name === 'Screen 1') {
                return source.id;
            }
        }
        return null;
    })

    ipcMain.on(IPC_EVENTS_NAME.Forward, (e, event, channel, data) => {
        if (channel === WINDOW_NAME.Main) {
            sendMainWindow(event, data);
        }else if (channel === WINDOW_NAME.Control) {
            sendControlWindow(event, data);
        }
    })
}