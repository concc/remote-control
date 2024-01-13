const EventEmitter = require('events')
const peer = new EventEmitter()
const {ipcRenderer, desktopCapturer} = require('electron')



peer.on('robot', (type, data) => {
    console.log('robot', type, data)
    if (type === 'mouse') {
        data.screen = {
            // 屏幕分辨率
            width: window.screen.width, 
            height: window.screen.height
        }
    }
    setTimeout(() => {
        ipcRenderer.send('robot', type, data)
    }, 2000);
})

module.exports = peer