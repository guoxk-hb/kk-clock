import path from "path"

import { initTaskSchedule, createSchedule } from './schedule'

import { app, ipcMain, BrowserWindow, Tray, Menu, WebContents, screen } from 'electron'

import {createWindow,electronicOptions } from "./windowSetting"

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

app.whenReady().then(() => {
  //开发环境需要加  才能触发 通知
  app.setAppUserModelId(process.execPath)
  createWindow(electronicOptions)
  initTaskSchedule()
  /*获取electron窗体的菜单栏*/
  Menu.setApplicationMenu(null)
})
//当 Electron 完成初始化时，发出一次。
// app.on('ready', () => {

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
  createSchedule(task)
})
