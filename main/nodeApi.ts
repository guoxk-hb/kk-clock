import fs from "fs"
import path from 'path'
interface Task{
  id:number,
  text: string
  week: Array<number>
  date: string
  switch:boolean
  edit: boolean
}
type PromiseTask=Promise<Array<Task|never>>

//读取任务队列
const taskPath = path.join(__dirname.replace('main', ''), 'task.json')
export function readTask():PromiseTask{
  const dataObj = new Promise<Awaited<PromiseTask>>((resolve, reject) => {
    fs.readFile(taskPath, 'utf-8', (err, data) => {
      if (err) {
        console.error(err)
        reject(err)
      }
      resolve(JSON.parse(data))
    })
  })
  return dataObj
}

//写入新任务或修改任务
export async function writeTask(task:Array<Task>) {
  const dataObj = new Promise((resolve, reject) => {
    fs.writeFile(taskPath, JSON.stringify(task), 'utf-8', (err) => {
      if (err) {
        reject(err)
      }
      resolve("写入成功")
    })
  })
  return dataObj
}

interface District{
  citycode:Array<number>,
  adcode:string
  name:string
  center:string
  level:string
  districts?:Array<District>
 }
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
//读取任务队列
const settingPath = path.join(__dirname.replace('main', ''), 'setting.json')
//写入设置文件
export async function writeSetting(form:SettingForm) {
  const dataObj = new Promise((resolve, reject) => {
    fs.writeFile(settingPath, JSON.stringify(form), 'utf-8', (err) => {
      if (err) {
        reject(err)
      }
      resolve({
        status:200,
        text:"写入成功"})
    })
  })
  return dataObj
}
type PromiseSetting=Promise<SettingForm|never>
export async function readSetting():PromiseSetting{
  const dataObj = new Promise<Awaited<PromiseSetting>>((resolve, reject) => {
    fs.readFile(settingPath, 'utf-8', (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(JSON.parse(data))
    })
  })
  return dataObj
}

//读取铃声
export async function readRing() {
}

//修改铃声
export async function writeRing(ring) {
}