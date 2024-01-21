/**
 * 枚举值
 */

// ipc event name
const IPC_EVENTS_NAME = {
    Login: "login",
    Control: "control",
    GetSourceId: 'get-source-id',
    ControlStateChange: "control-state-change",
    AddStream: "add-stream",
    Robot: "robot",
    Offer: "offer",
    Answer: "answer",
    Forward: "forward",
    Candidate:"candidate",
    ControlCandidate: "control-candidate",
    PuppetCandidate: "puppet-candidate",
};

// robot type
const ROBOT_TYPE = {
    Mouse: "mouse", // 鼠标事件
    Keyboard: "key", // 键盘事件
};

// EventEmitter
const EVENT_NAMES = {
    AddStream: "add-stream",
};


module.exports = {
    IPC_EVENTS_NAME,
    ROBOT_TYPE,
    EVENT_NAMES,
};