import path from "path"

import { taskSchedule } from './schedule'
import schedule from 'node-schedule'

import { app, BrowserWindow } from 'electron'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

const createWindow = () => {
  const win = new BrowserWindow({
    // width: 200,
    // height: 200,
    // width:250,
    // height:125,
    width: 2000,
    height: 800,
    // transparent: true ,
    // frame: false ,
    title:"时钟",
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,//渲染进程 可以调用nodeAPI
      // contextIsolation: false, //隔离沙箱，防止恶意注入木马
      webSecurity: false,//关闭同源策略
      contextIsolation: true,
    },
  })
  win.webContents.openDevTools();
  win.webContents.setWindowOpenHandler(({ url }) => {
    // console.log(url);
    return {
      action: 'allow',

      //主窗口关闭与子窗口关闭独立
      outlivesOpener:true,

      overrideBrowserWindowOptions: {
        transparent: true ,
        frame: false,
        // fullscreenable: false,
        // backgroundColor: 'black',
        webPreferences: {
        }
      }
    }
  })
  if (process.argv[2]) {
    win.loadURL(process.argv[2])
  } else {
    win.loadFile('index.html')
  }
}
app.whenReady().then(() => {
  createWindow()
})

//当 Electron 完成初始化时，发出一次。
app.on('ready', () => {
  taskSchedule()
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
