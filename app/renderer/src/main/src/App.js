import './App.css';
import './utils/peer-puppet.js';
import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';

export const App = () => {

// 远程控制码
  const [remoteCode, setRemoteCode] = useState('');
  // 本地控制码
  const [localCode, setLocalCode] = useState('');
  // 0未连接，1已控制，2被控制
  const [controlText, setControlText] = useState(''); 

  const login = async () => {
    let code = await ipcRenderer.invoke('login')
    setLocalCode(code)
  }

  // 组件初始化执行一次，退出的时候清掉监听
  useEffect(() => {
    login()
    ipcRenderer.on('control-state-change', handleControlState)
    return () => {
      ipcRenderer.removeListener('control-state-change', handleControlState)
    }
  }, [])

  // 开始控制
  const startControl = (remoteCode) => {
    ipcRenderer.send('control', remoteCode)
  }
  
  // 控制状态改变
  const handleControlState = (e, name, type) => {
    let text = ''
    if (type === 1) {
      text = `正在远程控制${name}`
    }else if (type === 2) {
      text = `被${name}控制中`
    }
    setControlText(text)
  }

  return (
    <div className="link-container">
      <div className="link-container-con">
        {
          controlText? <h3 className='state'>{controlText}</h3> :
          <>
            <div className="code">你的控制码:<span>{localCode}</span></div>
            <div className="link">
              <input type='text' value={remoteCode} onChange={e => setRemoteCode(e.target.value)}></input>
              <button onClick={() => startControl(remoteCode)}>确认</button>
            </div>
          </>
        }
      </div>
    </div>
  );
}
