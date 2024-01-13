const peer = require('./peer-control')
const {ipcRenderer} = require('electron')


ipcRenderer.invoke('get-source-id').then(async sourceId => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sourceId,
              maxWidth: window.screen.width,
              maxHeight: window.screen.height
            }
          }
        })
        console.log(stream)
        play(stream)
      } catch (e) {
          console.log(e)
      }
})


let video = document.getElementById('screen-video')
function play(stream) {
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
    peer.emit('robot', 'mouse', data)
}
