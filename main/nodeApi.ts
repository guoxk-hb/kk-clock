import fs from "fs"
import path from 'path'
interface task{
  text: string
  week: Array<number>
  date: string
  switch:boolean
  edit: boolean
}
type PromiseTask=Promise<Array<task|never>>

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

//写入新任务
export async function writeTask(task) {
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

//读取铃声
export async function readRing() {
}

//修改铃声
export async function writeRing(ring) {
}