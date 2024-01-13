const peer = require('./peer-control')
const {ipcRenderer} = require('electron')
const { EVENT_NAMES, IPC_EVENTS_NAME } = require("../../../common/enum");
let video = document.getElementById('screen-video')

peer.on(EVENT_NAMES.AddStream, (stream) => {
    console.log("play stream", stream);
    play(stream);
});

// 播放视频
const play = (stream) => {
    video.srcObject = stream
    // onloadedmetadata 事件在指定视频/音频（audio/video）的元数据加载后触发
    video.onloadedmetadata = function() {
        video.play()
    }
}

window.onkeydown = function(e) {
    // data {keyCode, meta, alt, ctrl, shift}
    let data = {
        keyCode: e.keyCode,
        shift: e.shiftKey,
        meta: e.metaKey,
        control: e.ctrlKey,
        alt: e.altKey
    }
    peer.emit('robot', 'key', data) 
}

window.onmouseup = function(e) {
    // data {clientX, clientY, screen: {width, height}, video: {width, height}}
    let data = {}
    // 鼠标指针位置相对于窗口区域的 x 坐标
    data.clientX = e.clientX
    // 鼠标指针位置相对于窗口区域的 y 坐标
    data.clientY = e.clientY
    data.video = {
        // 元素宽度
        width: video.getBoundingClientRect().width,
        // 元素高度
        height: video.getBoundingClientRect().height
    }
    peer.emit(IPC_EVENTS_NAME.Robot, 'mouse', data)
}


peer.on(IPC_EVENTS_NAME.Robot, (type, data) => {
    console.log('robot', type, data)
    if (type === 'mouse') {
        data.screen = {
            // 屏幕分辨率
            width: window.screen.width, 
            height: window.screen.height
        }
    }
    setTimeout(() => {
        ipcRenderer.send(IPC_EVENTS_NAME.Robot, type, data)
    }, 2000);
})