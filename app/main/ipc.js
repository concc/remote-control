const {ipcMain, desktopCapturer} = require('electron')
const {create: createControlWindow} = require('./windows/control')
const { IPC_EVENTS_NAME } = require('../common/enum')
const {send: sendMainWindow} = require('./windows/main')
const { send: sendControlWindow} = require('./windows/control')
const signal = require('./signal')

module.exports = function() {
    ipcMain.handle(IPC_EVENTS_NAME.Login, async () => {
        const { code } = await signal.invoke(IPC_EVENTS_NAME.Login, null, 'logined')
        return code
    })

    ipcMain.on(IPC_EVENTS_NAME.Control, async (e, remote) => {
       // 这里是跟服务端的交互，成功后我们会唤起面板
       signal.send(IPC_EVENTS_NAME.Control, {remote})
    })

    signal.on(IPC_EVENTS_NAME.Controlled, (data) => {
        createControlWindow()
        sendMainWindow(IPC_EVENTS_NAME.ControlStateChange, data.remote, 1)
    })


    signal.on(IPC_EVENTS_NAME.BeControlled, (data) => {
        sendMainWindow(IPC_EVENTS_NAME.ControlStateChange, data.remote, 2)
    })

    // 获取桌面共享id
    ipcMain.handle(IPC_EVENTS_NAME.GetSourceId, async () => {
        const sources = await desktopCapturer.getSources({ types: ['screen'] });
        console.log(sources)
        for (const source of sources) {
            if (source.id) {
                return source.id;
            }
        }
        return null;
    })


    ipcMain.on(IPC_EVENTS_NAME.Forward, (e, event, data) => {
        signal.send(IPC_EVENTS_NAME.Forward, {event, data})
    })

    // 收到offer，puppet响应
    signal.on(IPC_EVENTS_NAME.Offer, (data) => {
        sendMainWindow(IPC_EVENTS_NAME.Offer, data)
    })
    
    // 收到puppet证书，answer响应
    signal.on(IPC_EVENTS_NAME.Answer, (data) => {
        sendControlWindow(IPC_EVENTS_NAME.Answer, data)
    })
    
    // 收到control证书，puppet响应
    signal.on(IPC_EVENTS_NAME.CuppetCandidate, (data) => {
        sendControlWindow(IPC_EVENTS_NAME.CuppetCandidate, data)
    })
    
    // 收到puppet证书，control响应
    signal.on(IPC_EVENTS_NAME.ControlCandidate, (data) => {
        sendMainWindow(IPC_EVENTS_NAME.ControlCandidate, data)
    })
}