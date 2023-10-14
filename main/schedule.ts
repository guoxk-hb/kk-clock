import schedule from 'node-schedule'

import { readTask } from './nodeApi'
interface task {
  text: string
  week: Array<number>
  date: string
  switch:boolean
  edit: boolean
}
// const jobs: schedule = []
/**
 * ipcRenderer 把窗口的ipcRenderer给穿过来
 */
//初始化读取 task 中的定时任务
export async function initTaskSchedule(ipcRenderer) {
  const taskList = await readTask()
  // console.log('开启定时任务');
  taskList.forEach((item: task) => {
    if(item.switch===true){
    const dateArr = item.date.split(':')
    const week = item.week
    const hour = dateArr[0]
    const minute = dateArr[1]
    const job: schedule = schedule.scheduleJob({
      hour: hour,
      minute: minute,
      dayOfweek: week,
    }, () => {
      // console.log('scheduleCronstyle:' + item.text);
      ipcRenderer.send('schedule',item)
      // console.log(ipcRenderer,"ipcrenderer");
      if(week.length===0){
      job.cancel()
      }
    });
    console.log('开启定时任务'+item.text);
  }
    // jobs.push(job)
  })
}

//创建新任务
export async function createSchedule(task:task) {
  const dateArr = task.date.split(':')
  const week = task.week
  const hour = dateArr[0]
  const minute = dateArr[1]
  const job: schedule = schedule.scheduleJob({
    hour: hour,
    minute: minute,
    dayOfweek: week,
  }, () => {
    // console.log('scheduleCronstyle:' + task.text);
    if(week.length===0){
    job.cancel()
    }
  });
}