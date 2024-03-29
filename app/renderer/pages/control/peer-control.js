const EventEmitter = require('events')
const peer = new EventEmitter()
const {ipcRenderer} = require('electron')
const { EVENT_NAMES, IPC_EVENTS_NAME } = require("../../../common/enum");
const configuration = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};

// 创建 RTCPeerConnection 实例
const peerConnection = new window.RTCPeerConnection(configuration)
const dc = peerConnection.createDataChannel('robotchannel', {reliable: false});
const candidateQueue = []

// datachannel 打开
dc.onopen = function() {
    console.log('opened')
}

// datachannel收到消息
dc.onmessage = function(event) {
    console.log('message', event)
}

// datachannel错误处理
dc.onerror = (e) => console.log(e)

// 获取icecandidate
peerConnection.onicecandidate = (e) => {
    console.log("candidate", JSON.stringify(e.candidate));    
    // 发送给傀儡端
    ipcRenderer.send(
        IPC_EVENTS_NAME.Forward,
        IPC_EVENTS_NAME.ControlCandidate,
        JSON.stringify(e.candidate)
    );
}

// 监听傀儡端icecandidate，收到之后设置
ipcRenderer.on(IPC_EVENTS_NAME.PuppetCandidate, (e, candidate) => {
    addIceCandidate(JSON.parse(candidate));
});

// 设置 addIceCandidate
const addIceCandidate = async(candidate) => {
    // 依赖remoteDescription,等其设置成功后才会生效
    candidate && candidateQueue.push(candidate);
    if (peerConnection.remoteDescription && peerConnection.remoteDescription.type) {
        for (let candidate of candidateQueue) {
            try {
                const rtcIceCandidate = new RTCIceCandidate(candidate);
                await peerConnection.addIceCandidate(rtcIceCandidate);
                candidateQueue.shift();
            } catch (e) {
                console.error(e)
            }
        }
    }
};

// 创建offer
const createOffer = async() => {
    // 获取offer
    const offer = await peerConnection.createOffer({
        offerToReceiveAudio: false, // 交换音频数据
        offerToReceiveVideo: true, // 交换视频数据 
    });
    // 设置offer sdp
    await peerConnection.setLocalDescription(offer);
    console.log("peerConnection offer", JSON.stringify(offer));
    return peerConnection.localDescription;
}

// 设置answer SDP
const setRemoteAnswer = async(answer) => {
    await peerConnection.setRemoteDescription(answer);
}

// 监听answer
ipcRenderer.on(IPC_EVENTS_NAME.Answer, (e, answer) => {
    setRemoteAnswer(answer);
});


// 监听addstream
peerConnection.onaddstream = (e) => {
    console.log("addstream", e);
    peer.emit(EVENT_NAMES.AddStream, e.stream);
};


createOffer().then(offer => {
    const { type, sdp } = offer;
    ipcRenderer.send(IPC_EVENTS_NAME.Forward, IPC_EVENTS_NAME.Offer, { type, sdp });
});

module.exports = { peer, dc };