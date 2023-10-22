const { contextBridge,ipcRenderer} = require('electron')
import { readTask, writeTask, readRing, writeRing } from "./nodeApi"
contextBridge.exposeInMainWorld('electronAPI', {
  readTask: () => readTask(),
  writeTask: (task) => writeTask(task),
  createSchedule:(item)=>ipcRenderer.send('create-schedule',item),
  readRing: () => readRing(),
  writeRing: (ring) => writeRing(ring),
  //右键菜单
  showContextMenu:() => ipcRenderer.send('show-context-menu'),
  //右键菜单触发的回调
  showContextCommand:(callback) => ipcRenderer.on('show-context-command',(e,command)=>{
    //切换路由
    callback(command)
  }),
  //定时器 闹钟通知
  showNotification:(callback)=>ipcRenderer.on('schedule',(el,message)=>{
    // console.log(el,message,'接受到了scheduleCronstyle');
    callback(message)
  }),
})