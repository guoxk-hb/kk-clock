const { contextBridge,ipcRenderer} = require('electron')
import { readTask, writeTask, readRing, writeRing,writeSetting} from "./nodeApi"


// 定义预加载数据对象
let setting = null;

// 设置从主进程接收数据对象的函数
ipcRenderer.on('set-preload-data', (event, dataObject) => {
  setting = dataObject;
});
contextBridge.exposeInMainWorld('electronAPI', {
  readTask: () => readTask(),
  writeTask: (task) => writeTask(task),
  writeSetting:(setting)=>writeSetting(setting),
  readRing: () => readRing(),
  writeRing: (ring) => writeRing(ring),
  createSchedule:(item)=>ipcRenderer.send('create-schedule',item),
  // //右键菜单 更新了新的方式，使用electron方式
  // showContextMenu:() => ipcRenderer.send('show-context-menu'),
  //右键菜单触发的回调
  showContextCommand:(callback) => ipcRenderer.on('show-context-command',(e,command)=>{
    //切换路由
    callback(command)
  }),
  //定时器 闹钟通知
  scheduleCallback:(callback)=>ipcRenderer.on('schedule',(el,message)=>{
    // console.log(el,message,'接受到了scheduleCronstyle');
    callback()
  }),
  updataTask:()=>ipcRenderer.send('updata-task','执行了'),
  //拉伸应用
  frameResized:(callback)=>ipcRenderer.on('resized',(e,message)=>{ 
    callback()
  }),
  windowMove:(boolean:boolean,name:string)=>ipcRenderer.send(`window-move-open-${name}`,boolean),
  readSetting:()=>{
    return setting
  },
  // readSetting:()=>readSetting(),
})