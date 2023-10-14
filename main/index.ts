import path from "path"

import { initTaskSchedule } from './schedule'

import { app, ipcMain, BrowserWindow, Tray, Menu } from 'electron'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

const createWindow = () => {
  const win = new BrowserWindow({
    // width: 300,
    // height: 300,
    // width: 2000,
    // height: 800,
    // transparent: true ,
    // frame: false ,
    title: "时钟",
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
      outlivesOpener: true,
      overrideBrowserWindowOptions: {
        transparent: true,
        frame: false,
        // fullscreenable: false,
        // backgroundColor: 'black',
        webPreferences: {
        }
      }
    }
  })

  win.webContents.on("dom-ready", async () => {
    // let height = await win.webContents.executeJavaScript('document.body.clientHeight')
    // let width = await win.webContents.executeJavaScript('document.body.clientWidth')
    // console.log(height,'height');
    // win.setSize(width,height)
  })
  win.on("resize", async () => {
    // let height = await win.webContents.executeJavaScript('document.documentElement.clientHeight')
    // let width = await win.webContents.executeJavaScript('document.documentElement.clientWidth')
    // win.setSize(width,height)
  })
  if (process.argv[2]) {
    win.loadURL(process.argv[2])
  } else {
    win.loadFile('index.html')
  }
}
app.whenReady().then(() => {
// app.setAppUserModelId(process.execPath)
  createWindow()
  console.log(createWindow());
  const tray = new Tray(path.join(__dirname.replace('main', ''), 'logo.png'))
  console.log(path.join(__dirname.replace('main', ''), 'logo.png'));
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ])
  tray.setToolTip('clock时钟')
  tray.setContextMenu(contextMenu)
})
//当 Electron 完成初始化时，发出一次。
app.on('ready', () => {
  initTaskSchedule()
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

//右键菜单
ipcMain.on('show-context-menu', (event, arg) => {
  console.log('给我打开右键菜单');
  
  const contextMenu = Menu.buildFromTemplate([
    { label: '时钟', type: 'checkbox' },
    { label: '闹钟', type: 'checkbox' },
    { label: '日期', type: 'checkbox', checked: true },
    { label: '设置', type: 'checkbox' }
  ])
  // 这里可以指定菜单出现的位置
  contextMenu.popup()
})