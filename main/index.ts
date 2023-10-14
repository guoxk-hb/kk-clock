import path from "path"

import { initTaskSchedule } from './schedule'

import { app, ipcMain, BrowserWindow, Tray, Menu, WebContents, MenuItem } from 'electron'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

//用于 闹钟IPCrenderer发送消息
let notification: WebContents | null = null
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
  notification = win.webContents
}
app.whenReady().then(() => {
  // app.setAppUserModelId(process.execPath)
  createWindow()
  initTaskSchedule(notification)
  // const tray = new Tray(path.join(__dirname.replace('main', ''), 'logo.png'))
  // console.log(path.join(__dirname.replace('main', ''), 'logo.png'));

  // // const contextMenu = Menu.buildFromTemplate([
  // //   { label: 'Item1', type: 'radio' },
  // //   { label: 'Item2', type: 'radio' },
  // //   { label: 'Item3', type: 'radio', checked: true },
  // //   { label: 'Item4', type: 'radio' }
  // // ])
  // tray.setToolTip('clock时钟')
  // tray.setContextMenu(contextMenu)
})
//当 Electron 完成初始化时，发出一次。
// app.on('ready', () => {

// })
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

const menuItemState={
  menuItem1: true,
  menuItem2: false,
  menuItem3: false,
  menuItem4: false,
}
//右键菜单
ipcMain.on('show-context-menu', (event, arg) => {
  // console.log('给我打开右键菜单');
  let template :any[]= [
    // accelerator 快捷键
    {
      id:"1",label: '时钟', type: 'checkbox', checked: menuItemState.menuItem1,commandId:1,
      click: (e) => {
        for(let key in menuItemState){
          menuItemState[key]=false
        }
        menuItemState.menuItem1=true,
        event.sender.send('show-context-command', 'electron')
      }
    },
    {
      id:"2",label:'闹钟', type: 'checkbox', checked: menuItemState.menuItem2,commandId:2,
      click(e){
        for(let key in menuItemState){
          menuItemState[key]=false
        }
        menuItemState.menuItem2=true,
        event.sender.send('show-context-command', 'notepad')
      }
    },
    {
      id:"3",label: '日期', type: 'checkbox',checked: menuItemState.menuItem3,commandId:3,
      click: (e) => {
        for(let key in menuItemState){
          menuItemState[key]=false
        }
        menuItemState.menuItem3=true,
        event.sender.send('show-context-command', '日期')
      }
    },
    {
      id:"4",label: '设置', type: 'checkbox', checked: menuItemState.menuItem4,commandId:4,
      click: (e) => {
        for(let key in menuItemState){
          menuItemState[key]=false
        }
        menuItemState.menuItem4=true,
        event.sender.send('show-context-command', '设置')
        // handleMenuItemClick()
      }
    }
  ]
  const contextMenu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(contextMenu)
  // 这里可以指定菜单出现的位置
  contextMenu.popup()
})