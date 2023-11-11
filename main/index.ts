import path from "path"

import { initTaskSchedule, createSchedule } from './schedule'

import { app, ipcMain, BrowserWindow, Menu } from 'electron'

import { createWindow, clockOptions } from "./windowSetting"

import { readSetting } from "./nodeApi"

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null

app.whenReady().then(async () => {
  //开发环境需要加  才能触发 通知
  app.setAppUserModelId(process.execPath)
  win = createWindow(clockOptions) as BrowserWindow
  const setting = await readSetting()
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
