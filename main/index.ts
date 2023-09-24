import path from "path"

const { app, BrowserWindow } = require('electron')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
const createWindow = () => {
  const win = new BrowserWindow({
    // width: 200,
    // height: 200,
    // width:250,
    // height:125,
    width: 1000,
    height: 700,
    // transparent: true ,
    // frame: false ,
    alwaysOnTop :true,
    webPreferences: {
      preload:path.join(__dirname,'preload.js'),
      nodeIntegration: true,//渲染进程 可以调用nodeAPI
      // contextIsolation: false, //隔离沙箱，防止恶意注入木马
      webSecurity: false,//关闭同源策略
      contextIsolation:true,
    },
  })
  win.webContents.openDevTools();
  if (process.argv[2]) {
    win.loadURL(process.argv[2])
  } else {
    win.loadFile('index.html')
  }
}
app.whenReady().then(() => {
  // console.log(process.argv,"process");
  createWindow()

})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
