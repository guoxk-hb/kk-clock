import path from "path"

import { initTaskSchedule, createSchedule } from './schedule'

import { app, ipcMain, BrowserWindow, Tray, Menu, WebContents, } from 'electron'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

//用于 闹钟IPCrenderer发送消息
let notification: WebContents | null = null
const createWindow = () => {
  const win = new BrowserWindow({
    // width: 300,
    // height: 300,
    // width: 2000,
    // height: 800,
    transparent: true ,
    frame: false ,
    title: "时钟",
    alwaysOnTop: true,
    useContentSize: true,
    autoHideMenuBar: true,
    hasShadow: true,
    icon: path.join(__dirname.replace('main', ''), 'logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,//渲染进程 可以调用nodeAPI
      // contextIsolation: false, //隔离沙箱，防止恶意注入木马
      webSecurity: false,//关闭同源策略
      contextIsolation: true,
    },
  })
  win.setMenu(null);
  // win.webContents.openDevTools();
  win.webContents.setWindowOpenHandler(({ url }) => {
    // console.log(url);
    if (url === 'http://localhost:5173/notepad') {
      // win.hide();
      // win.kiosk=false
      // win.close();
      Menu.setApplicationMenu(null)
      return {
        action: 'allow',
        parent: win,
        //主窗口关闭与子窗口关闭独立
        outlivesOpener: true,
        overrideBrowserWindowOptions: {
          // transparent: true,
          // frame: false,
          // fullscreenable: false,
          // backgroundColor: 'black',
          width: 1000,
          height: 800,
          title: '定时任务',
          icon: path.join(__dirname.replace('main', ''), 'logo.png'),
          autoHideMenuBar: true,
          webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,//渲染进程 可以调用nodeAPI
            // contextIsolation: false, //隔离沙箱，防止恶意注入木马
            webSecurity: false,//关闭同源策略
            contextIsolation: true,
          }
        },
      }
    }
  })

  // win.webContents.on("dom-ready", async () => {
  //   // let height = await win.webContents.executeJavaScript('document.body.clientHeight')
  //   // let width = await win.webContents.executeJavaScript('document.body.clientWidth')
  //   // console.log(height,'height');
  //   // win.setSize(width,height)
  // })
  // win.on("resize", async () => {
  //   // let height = await win.webContents.executeJavaScript('document.documentElement.clientHeight')
  //   // let width = await win.webContents.executeJavaScript('document.documentElement.clientWidth')
  //   // win.setSize(width,height)
  // })
  if (process.argv[2]) {
    win.loadURL(process.argv[2])
  } else {
    win.loadFile('index.html')
  }
  notification = win.webContents
  const tray = new Tray(path.join(__dirname.replace('main', ''), 'logo.png'))
  console.log(path.join(__dirname.replace('main', ''), 'logo.png'));

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: '退出', type: 'checkbox' }
  ])
  tray.setToolTip('clock时钟')
  tray.setContextMenu(contextMenu)
  // 托盘图标被点击时显示或隐藏主窗口
  tray.on('click', () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });
}
app.whenReady().then(() => {
  //开发环境需要加  才能触发 通知
  app.setAppUserModelId(process.execPath)
  createWindow()
  initTaskSchedule(notification)
})
//当 Electron 完成初始化时，发出一次。
// app.on('ready', () => {

// })
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

const menuItemState = {
  menuItem1: true,
  menuItem2: false,
  menuItem3: false,
  menuItem4: false,
  menuItem5: false,
}
//右键菜单
ipcMain.on('show-context-menu', (event, arg) => {
  // console.log('给我打开右键菜单');
  const template: any[] = [
    // accelerator 快捷键
    {
      id: "1", label: '时钟', type: 'checkbox', checked: menuItemState.menuItem1, commandId: 1,
      click: (e) => {
        for (const key in menuItemState) {
          menuItemState[key] = false
        }
        menuItemState.menuItem1 = true,
          event.sender.send('show-context-command', 'electron')
      }
    },
    {
      id: "2", label: '闹钟', type: 'checkbox', checked: menuItemState.menuItem2, commandId: 2,
      click(e) {
        for (const key in menuItemState) {
          menuItemState[key] = false
        }
        menuItemState.menuItem2 = true,
          event.sender.send('show-context-command', 'notepad')
      }
    },
    {
      id: "3", label: '日期', type: 'checkbox', checked: menuItemState.menuItem3, commandId: 3,
      click: (e) => {
        for (const key in menuItemState) {
          menuItemState[key] = false
        }
        menuItemState.menuItem3 = true,
          event.sender.send('show-context-command', '日期')
      }
    },
    {
      id: "4", label: '设置', type: 'checkbox', checked: menuItemState.menuItem4, commandId: 4,
      click: (e) => {
        for (const key in menuItemState) {
          menuItemState[key] = false
        }
        menuItemState.menuItem4 = true,
          event.sender.send('show-context-command', '设置')
        // handleMenuItemClick()
      }
    },
    {
      id: "5", label: '退出', type: 'checkbox', checked: menuItemState.menuItem4, commandId: 4,
      click: (e) => {
        for (const key in menuItemState) {
          menuItemState[key] = false
        }
        menuItemState.menuItem5 = true,
          app.quit()
      }
    },
  ]
  const contextMenu = Menu.buildFromTemplate(template)
  // Menu.setApplicationMenu(contextMenu)
  // 这里可以指定菜单出现的位置
  contextMenu.popup()
})

//创建定时
ipcMain.on('create-schedule', (event, task) => {
  // console.log(arg)
  createSchedule(task, notification)
})