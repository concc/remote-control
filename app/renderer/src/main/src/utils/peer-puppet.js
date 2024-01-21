import { ipcRenderer } from 'electron';
import { IPC_EVENTS_NAME, ROBOT_TYPE } from "./enum";
const configuration = {iceServers: [{urls: 'stuns:stun.l.google.com:19302'}]};
// webrtc连接
const pc = new window.RTCPeerConnection(configuration);

const candidateQueue = []

// 获取桌面共享流
const getScreenStream = async () =>  {
    const sourceId = await ipcRenderer.invoke(IPC_EVENTS_NAME.GetSourceId)
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: "desktop",
                    chromeMediaSourceId: sourceId,
                    maxWidth: window.screen.width,
                    maxHeight: window.screen.height,
                },
            },
        });
        return stream;
    } catch (e) {
        console.error(e);
    }
}

// 获取candidate
pc.onicecandidate = (e) => {
    console.log("candidate", JSON.stringify(e.candidate));
    // 发送给傀儡端
    ipcRenderer.send(
        IPC_EVENTS_NAME.Forward,
        IPC_EVENTS_NAME.CuppetCandidate,
        JSON.stringify(e.candidate)
    );
}

// 监听datachannel
pc.ondatachannel = (e) => {
    console.log('data', e)
    e.channel.onmessage = (e)  => {
        console.log('onmessage', e, JSON.parse(e.data))
       let {type, data} = JSON.parse(e.data)
        console.log('robot', type, data)
        if(type === ROBOT_TYPE.Mouse) {
            data.screen = {
                width: window.screen.width, 
                height: window.screen.height
            }
        }
        ipcRenderer.send(IPC_EVENTS_NAME.Robot, type, data)
    }
}

// 监听控制端cecandidate，收到之后设置
ipcRenderer.on(IPC_EVENTS_NAME.Candidate, (e, candidate) => {
    addIceCandidate(JSON.parse(candidate));
});

// 设置 addIceCandidate
const addIceCandidate = async(candidate) => {
    // 依赖remoteDescription,等其设置成功后才会生效
    candidate && candidateQueue.push(candidate);
    if (pc.remoteDescription && pc.remoteDescription.type) {
        for (let candidate of candidateQueue) {
            try {
                const rtcIceCandidate = new RTCIceCandidate(candidate);
                await pc.addIceCandidate(rtcIceCandidate);
                candidateQueue.shift();
            } catch (e) {
                console.error(e)
            }
        }
    }
};

// 创建应答
const createAnswer = async (offer) => {
    const stream = await getScreenStream();
    console.log("stream", stream);
    pc.addStream(stream);
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    console.log("replay answer", JSON.stringify(offer));
    await pc.setLocalDescription(answer);
    return { answer: pc.localDescription, stream };
}

ipcRenderer.on(IPC_EVENTS_NAME.Offer, (e, offer) => {
    console.log('offer', offer);
    createAnswer(offer).then(({ answer, stream }) => {
        console.log("streamstream", stream);
        const { type, sdp } = answer;
        // 发起ipc通信，由主进程转发到控制端
        ipcRenderer.send(
            IPC_EVENTS_NAME.Forward,
            IPC_EVENTS_NAME.Answer, 
            {
                type,
                sdp,
            }
        );
    });
});


window.addIceCandidate = addIceCandidate
window.createAnswer = createAnswer