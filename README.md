# remote-control
基于electron和webrtc实现的远程控制


#### 前端项目 安装命令
```
cd ./app/renderer/src/main
npm i
```


#### electron 安装编译命令
```
npm i

编译原生模块
npx electron-rebuild
```

#### 启动命令
```
npm run start:render
npm run start:main
```


## 目录结构
```
| ——— package.json
| ——— app
|  - common
|    - enum.js 常量枚举值
|  - main
|    - index.js 主进程
|    - windows
|      -- control.js 控制端窗体
|      -- main.js  傀儡端窗体
|    - ipc.js 通信模块
|    - robot.js 键鼠控制模块
|  - render
|      - pages
|       -- control 
|         -- index.html 控制端视图
|         -- app.js 控制端JS逻辑
|         -- peer-control.js 控制端webRtc逻辑
|      - src
|        -- main 基于React cra脚手架搭建的傀儡端视图
|           -- src
|              -- utils
|                 -- enum.js 常量枚举值
|                 -- peer-puppet.js 傀儡端webRtc逻辑 
```