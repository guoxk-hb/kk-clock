import path from "path"

import { initTaskSchedule, createSchedule } from './schedule'

import { app, ipcMain, BrowserWindow, Menu } from 'electron'

import { createWindow, clockOptions } from "./windowSetting"

import { readSetting } from "./nodeApi"

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null

interface SettingForm {
  ringVal: Array<number>,
  ringName: string,
  ringFileUrl: string,
  clockStyle: number, // 1 电子 2 古典 3 粒子
  quit: number // 1 最小化 2 退出
  bootstrap: boolean //开机自启
  country: string,
  province: string,
  city: string,
  county: string,
  dateShow: true,
  alarmShow: true,
}

app.whenReady().then(async () => {
  //开发环境需要加  才能触发 通知
  app.setAppUserModelId(process.execPath)
  const setting: SettingForm = await readSetting()
  let obj = {}
  if (setting.dateShow && setting.alarmShow) {

  }
  else if (setting.dateShow) {
    obj = {
      width: 400,
      height: 229,
      minWidth: 150,
      minHeight: 86,
      maxWidth: 400,
      maxHeight: 229,
      aspectRatio: 1.75,
    }
  }
  else if (setting.alarmShow) {
    obj = {
      width: 400,
      height: 178,
      minWidth: 150,
      minHeight: 66,
      maxWidth: 400,
      maxHeight: 178,
      aspectRatio: 2.25,
    }
  }
  else {
    obj = {
      width: 400,
      height: 107,
      minWidth: 75,
      minHeight: 20,
      maxWidth: 400,
      maxHeight: 107,
      aspectRatio: 3.75,
    }
  }
  win = createWindow(Object.assign(clockOptions,obj)) as BrowserWindow
  win.webContents.send('set-preload-data', setting)
  initTaskSchedule(win.webContents)
  /*获取electron窗体的菜单栏*/
  Menu.setApplicationMenu(null)
})
// 当 Electron 完成初始化时准备创建渲染进程时，发出一次。
// app.on('ready', async () => {
// })
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// //右键菜单 老方式
// ipcMain.on('show-context-menu', (event, arg) => {

// })

//创建定时
ipcMain.on('create-schedule', (event, task) => {
  // console.log(arg)
  if (win) {
    createSchedule(task, win.webContents)
  } else {
    console.log('win is null');
  }
})

ipcMain.on('updata-task', (event, message) => {
  console.log(message);
  if (win) {
    win.webContents.send('schedule')
  } else {
    console.log('win is null');
  }
})

ipcMain.on('restart-app',(event, message)=>{
  app.relaunch()
  app.exit()
})