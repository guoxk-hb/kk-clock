import schedule from 'node-schedule'

import { readTask } from './nodeApi'
interface task {
  text: string
  week: Array<number>
  date: string
  switch:boolean
  edit: boolean
}
let jobs: schedule = []
export async function taskSchedule() {
  const taskList = await readTask()
  console.log('开启定时任务');
  taskList.forEach((item: task) => {
    let dateArr = item.date.split(':')
    let week = item.week
    let hour = dateArr[0]
    let minute = dateArr[1]
    let job: schedule = schedule.scheduleJob({
      hour: hour,
      minute: minute,
      dayOfweek: week,
    }, () => {
      console.log('scheduleCronstyle:' + item.text);
      if(week.length===0){
      job.cancel()
      }
    });
    // jobs.push(job)
  })
}