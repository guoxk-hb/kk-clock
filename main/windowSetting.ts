import { ipcMain, BrowserWindow, screen, Menu, app, Tray } from "electron";

import path from "path";

interface windowOptions {
  id: string;//按菜单顺序排列
  width: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  transparent?: boolean;
  frame?: boolean;
  title: string;
  alwaysOnTop?: boolean;
  devTool?: boolean;
  aspectRatioSwtich?: boolean;
  aspectRatio?: number;
  url?: string;
}

export const clockOptions: windowOptions = {
  id: 'clock',
  // width: 900,
  // height: 400,
  // minWidth: 600,
  // minHeight: 400,
  // maxWidth: Infinity,
  // maxHeight: Infinity,
  width: 400,
  height: 275,
  minWidth: 200,
  minHeight: 138,
  maxWidth: 400,
  maxHeight: 275,
  transparent: true,
  frame: false,
  title: "时钟",
  alwaysOnTop: true,
  // devTool: true,
  aspectRatioSwtich: true,
  aspectRatio: 1.45,
  /**
   * 日期和闹钟文字同时显示比例
   */
  // width: 400,
  // height: 320,
  // minWidth: 200,
  // minHeight: 160,
  // maxWidth: 400,
  // maxHeight: 320,
  // aspectRatio: 1.31,
  /**
   * 日期和闹钟文字都不显示的比例
   */
  // width: 400,
  // height: 107,
  // minWidth: 75,
  // minHeight: 20,
  // maxWidth: 400,
  // maxHeight: 107,
  // aspectRatio: 3.75,
  /**
   * 日期文字显示
   */
  // width: 400,
  // height: 229,
  // minWidth: 150,
  // minHeight: 86,
  // maxWidth: 400,
  // maxHeight: 229,
  // aspectRatio: 1.75,
  /**
   * 闹钟文字显示
   */
  // width: 400,
  // height: 178,
  // minWidth: 150,
  // minHeight: 66,
  // maxWidth: 400,
  // maxHeight: 178,
  // aspectRatio: 2.25,
}
const notepadOptions: windowOptions = {
  id: 'notepad',
  width: 900,
  height: 400,
  minWidth: 600,
  minHeight: 400,
  maxWidth: Infinity,
  maxHeight: Infinity,
  transparent: false,
  frame: true,
  title: "闹钟",
  url: 'notepad'
}
const settingOptions: windowOptions = {
  id: 'setting',
  width: 900,
  height: 400,
  minWidth: 600,
  minHeight: 400,
  maxWidth: Infinity,
  maxHeight: Infinity,
  transparent: false,
  frame: true,
  title: "时钟设置",
  url: 'setting',
  // devTool: true,
}
//记录创建的窗口
const BrowserWindowsMap = new Map<string, BrowserWindow | null>()
export function createWindow(windowOptions: windowOptions) {
  if (BrowserWindowsMap.get(windowOptions.id)) {
    return false;
  }
  let win: BrowserWindow | null = new BrowserWindow({
    width: windowOptions.width || 1000,
    height: windowOptions.height || 800,
    minWidth: windowOptions.minWidth || 0,
    minHeight: windowOptions.minWidth || 0,
    maxWidth: windowOptions.maxWidth || Infinity,
    maxHeight: windowOptions.maxHeight || Infinity,
    transparent: windowOptions.transparent || false,
    frame: windowOptions.frame || false,
    title: windowOptions.title,
    alwaysOnTop: windowOptions.alwaysOnTop || false,
    autoHideMenuBar: true,
    hasShadow: true,
    icon: path.join(__dirname.replace('main', 'static'), 'logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,//渲染进程 可以调用nodeAPI
      // contextIsolation: false, //隔离沙箱，防止恶意注入木马
      webSecurity: false,//关闭同源策略
      contextIsolation: true,
      sandbox: false,
    },
  })
  //将创建的窗口记录下来
  BrowserWindowsMap.set(windowOptions.id, win)

  if (windowOptions.devTool) {
    win.webContents.openDevTools()
  }
  //纵横比 等比缩放
  if (windowOptions.aspectRatioSwtich) {
    win.setAspectRatio(windowOptions.aspectRatio || 1.36)
  }
  //顶部菜单
  win.setMenu(null);
  //窗口拖动
  windowMovement(win, windowOptions.id)
  if (windowOptions.id === 'clock') {
    //托盘
    windowTray(win)
  }
  //右键菜单
  win.webContents.on('context-menu', (e, params) => {
    if (win) {
      windowContextMenu(win)
    }
  });
  win.on("resize", async () => {
    win?.webContents.send("resize")
  })
  win.on("resized", async () => {
    win?.webContents.send("resize")
  })
  win.on("closed", () => {
    if (win) {
      BrowserWindowsMap.set(windowOptions.id, null)
      // 在窗口对象被关闭时，取消订阅所有与该窗口相关的事件
      ipcMain.removeAllListeners(`window-move-open-${windowOptions.id}`)
      win = null;
    }
  });
  //node服务
  if (process.argv[2]) {
    if (windowOptions.url) {
      win.loadURL(process.argv[2] + `#/${windowOptions.url}`)
    } else {
      win.loadURL(process.argv[2])
    }
  } else {
    if (windowOptions.url) {
      win.loadFile(path.join(__dirname.replace('main', ''), 'index.html'),{
        hash: windowOptions.url
      })
    } else {
      win.loadURL(path.join(__dirname.replace('main', ''), 'index.html'))
    }

  }

  return win

  // win.loadFile(path.join(__dirname, 'index.html'))

  //window。open打开网页，没有创建新的渲染进程 单纯的web页面交互 提交数据等使用
  // win.webContents.setWindowOpenHandler(({ url }) => {
  //   if (url === 'http://localhost:5173/notepad') {
  //     Menu.setApplicationMenu(null)
  //     return {
  //       action: 'allow',
  //       parent: win,
  //       outlivesOpener: true, //主窗口关闭与子窗口关闭独立
  //       overrideBrowserWindowOptions: {
  //         width: 1000,
  //         height: 800,
  //         title: '定时任务',
  //         icon: path.join(__dirname.replace('main', ''), 'logo.png'),
  //         autoHideMenuBar: true,
  //         webPreferences: {
  //           preload: path.join(__dirname, 'preload.js'),
  //           nodeIntegration: true,//渲染进程 可以调用nodeAPI
  //           // contextIsolation: false, //隔离沙箱，防止恶意注入木马
  //           webSecurity: false,//关闭同源策略
  //           contextIsolation: true,
  //         }
  //       },
  //     }
  //   }
  //   if (url === 'http://localhost:5173/setting') {
  //     Menu.setApplicationMenu(null)
  //     return {
  //       action: 'allow',
  //       parent: win,
  //       outlivesOpener: true, //主窗口关闭与子窗口关闭独立
  //       overrideBrowserWindowOptions: {
  //         width: 1000,
  //         height: 800,
  //         title: '定时任务',
  //         icon: path.join(__dirname.replace('main', ''), 'logo.png'),
  //         autoHideMenuBar: true,
  //         webPreferences: {
  //           preload: path.join(__dirname, 'preload.js'),
  //           nodeIntegration: true,//渲染进程 可以调用nodeAPI
  //           // contextIsolation: false, //隔离沙箱，防止恶意注入木马
  //           webSecurity: false,//关闭同源策略
  //           contextIsolation: true,
  //         }
  //       },
  //     }
  //   }
  //     return {
  //       action: 'deny',
  //     }
  //   })
}

//鼠标拖动 新解决方案
export function windowMovement(win: BrowserWindow, id: string): void {
  //窗口定位
  let winStartPosition = { x: 0, y: 0 };
  //鼠标定位
  let mouseStartPosition = { x: 0, y: 0 };
  //移动定时器
  let movingInterval: ReturnType<typeof setInterval> | null;
  //接受渲染进程鼠标事件
  ipcMain.on(`window-move-open-${id}`, (events, canMoving: boolean) => {
    if (!win.isDestroyed()) {
      // console.log('点击了',canMoving);
      const currentWindowSize = win.getSize();
      const currentWindow = BrowserWindow.getFocusedWindow() as BrowserWindow;
      if (currentWindow === win) {
        if (canMoving) {
          // 读取原位置
          const winPosition = win.getPosition();
          winStartPosition = { x: winPosition[0], y: winPosition[1] };
          mouseStartPosition = screen.getCursorScreenPoint();
          // 清除
          if (movingInterval) {
            clearInterval(movingInterval);
          }
          // 新开
          movingInterval = setInterval(() => {
            if (!currentWindow.isDestroyed()) {
              // 如果窗口失去焦点，则停止移动
              if (!currentWindow.isFocused()) {
                clearInterval(movingInterval as NodeJS.Timeout);
                movingInterval = null;
              }
              // 实时更新位置
              const cursorPosition = screen.getCursorScreenPoint();
              //计算移动的距离重新设置定位
              const x = winStartPosition.x + cursorPosition.x - mouseStartPosition.x;
              const y = winStartPosition.y + cursorPosition.y - mouseStartPosition.y;
              //setBounds 调整窗口大小并将窗口移动到提供的边界。 Resizes and moves the window to the supplied bounds. 
              win.setBounds({ x, y, width: currentWindowSize[0], height: currentWindowSize[1] });
              //win.setsetPosition 将窗口移动到 x 和 y。 animate boolean (可选) macOS
              //win.setsetPosition(x,y,true)
            }
          }, 10);
        } else {
          clearInterval(movingInterval as ReturnType<typeof setInterval>);
          movingInterval = null;
        }
      }
    }
  })
}

/**
 * 老方法、通过禁止win窗口的默认事件来 控制右键关闭
 * 缺点:dragable透明窗口无frame 需要设置可拖动，导致无法右击菜单
 * 透明窗口 无frame 将内容全部视为frame
 */
//windows窗口事件的二进制码
//当electron 改为透明时，右击不会触发浏览器的右击 而是windows的右击
//需要给他禁用一下
// win.hookWindowMessage(278,function(e){
//   win.setEnabled(false);//窗口禁用
//   setTimeout(()=>{
//     win.setEnabled(true);//窗口启用
//   },100);
//   return true;
// })

//设置 右键和托盘菜单
function windowMenu(win: BrowserWindow) {
  const template: any[] = [
    // accelerator 快捷键
    {
      id: "1", label: '时钟', type: 'normal', commandId: 1,
      click: (e) => {
        createWindow(clockOptions)
        // win.webContents.send('show-context-command', 'notepad')
      }
    },
    {
      id: "2", label: '闹钟', type: 'normal', commandId: 2,
      click(e) {
        // win.webContents.send('show-context-command', 'notepad')
        createWindow(notepadOptions)

      }
    },
    {
      id: "3", label: '日期', type: 'normal', commandId: 3,
      click: (e) => {
        win.webContents.send('show-context-command', '日期')
      }
    },
    {
      id: "4", label: '设置', type: 'normal', commandId: 4,
      click: (e) => {
        // win.webContents.send('show-context-command', '设置')
        createWindow(settingOptions)
        // handleMenuItemClick()
      }
    },
    {
      id: "5", label: '最小化', type: 'normal', role: 'minimize', commandId: 5,
      click: (e) => {
        // win.hide()
      }
    },
    {
      id: "6", label: '退出', type: 'checkbox', commandId: 6,
      click: (e) => {
        // app.quit()
        // if(win===BrowserWindowsMap.get('electronic')){
        //   win.hide()
        // }else{
        win.close()
        // }
      }
    },
  ]
  const contextMenu = Menu.buildFromTemplate(template)
  return contextMenu
}

//右键菜单
export function windowContextMenu(win: BrowserWindow): void {
  //右键菜单
  // console.log('给我打开右键菜单');
  const contextMenu = windowMenu(win)
  // Menu.setApplicationMenu(contextMenu)
  // 这里可以指定菜单出现的位置
  contextMenu.popup()

}

//系统托盘
export function windowTray(win: BrowserWindow): void {
  const tray = new Tray(path.join(__dirname.replace('main', 'static'), 'logo.png'))
  const contextMenu = windowMenu(win)
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

//打开子窗口 相当于一个单纯的web提交数据页面 公用一个渲染进程
export function openNewWindow(win: BrowserWindow): void {

}

//

// export function 
ipcMain.on('close-win-setting', (event, message) => {
  let win = BrowserWindowsMap.get('setting')
  win?.destroy();
})