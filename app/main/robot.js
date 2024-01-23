const {ipcMain} = require('electron')
const robot = require('robotjs')
const vkey = require('vkey')
const { IPC_EVENTS_NAME, ROBOT_TYPE } = require('../common/enum')

function handleMouse(data) {
    let {clientX, clientY, screen, video, button} = data
    // data {clientX, clientY, screen: {width, height}, video: {width, height}}
    let x = clientX * screen.width / video.width
    let y = clientY * screen.height / video.height
    console.log(x, y)
    robot.moveMouse(x, y)
    // e.button === 0: 左键被点击
    // e.button === 1: 中间按钮被点击
    // e.button === 2: 右键被点击
    if (button === 2) {
        robot.mouseClick('right')
    }else {
        robot.mouseClick()
    }
}

function handleKey(data) {
    const modifiers = []
    if(data.meta) modifiers.push('meta')
    if(data.shift) modifiers.push('shift')
    if(data.alt) modifiers.push('alt')
    if(data.ctrl) modifiers.push('ctrl')
    let key = vkey[data.keyCode].toLowerCase()
    // 修饰键也会触发key值，过滤一下
    if(key !== '<shift>' && key !==  '<control>' && key !==  '<alt>') {
        robot.keyTap(key, modifiers)
    }
}

module.exports = function() {
    ipcMain.on(IPC_EVENTS_NAME.Robot, (e, type, data) => {
        console.log('handle', type, data)
        if(type === ROBOT_TYPE.Mouse) {
            handleMouse(data)
        } else if(type === ROBOT_TYPE.Keyboard) {
            handleKey(data)
        }
    })
}
