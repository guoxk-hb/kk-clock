
import schedule from 'node-schedule'

import { readTask } from './nodeApi'
import { Notification } from 'electron'
interface task {
  id: number,
  text: string
  week: Array<number>
  date: string
  switch: boolean
  edit: boolean
}
const jobs = {}
/**
 * WebContents 把窗口的WebContents给穿过来
 */
//初始化读取 task 中的定时任务
export async function initTaskSchedule(webContents) {
  let taskList
  try{
    taskList = await readTask()
  }catch{
    console.log('读取任务失败');
  }
  // console.log('开启定时任务');
  if (taskList.length === 0) {
    return
  }
  taskList.forEach((item: task) => {
    if (item.switch === true) {
      const dateArr = item.date.split(':')
      const week = item.week
      const hour = Number(dateArr[0])
      const minute = Number(dateArr[1])
      const job: schedule = schedule.scheduleJob({
        hour: hour,
        minute: minute,
        dayOfweek: week,
      }, () => {
       new Notification({
        title: "闹钟",
        body: item.text,
        silent: false,
        // icon: '/logo.png',
       }).show()
        // console.log('scheduleCronstyle:' + item.text);
        webContents.send('schedule', item)
        // console.log(ipcRenderer,"ipcrenderer");
        if (week.length === 0) {
          job.cancel()
        }
      });
      jobs[item.id] = job
      console.log('开启定时任务' + item.text);
    }
  })
}

//创建新任务
export async function createSchedule(task: task, webContents) {
  const dateArr = task.date.split(':')
  const week = task.week
  const hour = Number(dateArr[0])
  const minute = Number(dateArr[1])
  console.log(jobs);
  
  if (jobs[task.id]) {
    jobs[task.id].cancel()
  }
  const job: schedule = schedule.scheduleJob({
    hour: hour,
    minute: minute,
    dayOfweek: week,
  }, () => {
    console.log('scheduleCronstyle:' + task.text);
    webContents.send('schedule', task)
    if (week.length === 0) {
      job.cancel()
    }
  });
  jobs[task.id] = job
  console.log('开启定时任务' + task.text);
}