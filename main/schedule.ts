
import schedule from 'node-schedule'

import { readTask, writeTask } from './nodeApi'
import { Notification } from 'electron'

import path from 'path'

const logo = path.join(__dirname.replace('main', 'static'), 'logo.png')
const img = path.join(__dirname.replace('main', 'static'), 'R.jpg')
// const audio = path.join(__dirname.replace('main', 'static'), 'pikaqiu.mp3')
// const notification= new Notification({
//   toastXml,
// });

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
export async function initTaskSchedule(webContents: Electron.WebContents) {
  let taskList
  try {
    taskList = await readTask()
  } catch {
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
        // console.log('scheduleCronstyle:' + item.text);
        showNotification(item)
        setTimeout(() => {
          webContents.send('schedule')
          console.log('找东西');

        }, 61000);
        if (week.length === 0) {
          job.cancel()
          taskList[item.id].switch = false
          writeTask(taskList)
        }
      });
      jobs[item.id] = job
      console.log('开启定时任务' + item.text);
    }
  })
}

//创建新任务
export async function createSchedule(task: task, webContents: Electron.WebContents) {
  const dateArr = task.date.split(':')
  const week = task.week
  const hour = Number(dateArr[0])
  const minute = Number(dateArr[1])
  // console.log(jobs);
  if (task.switch === false) {
    return 0
  }
  if (jobs[task.id]) {
    jobs[task.id].cancel()
  }
  const job: schedule = schedule.scheduleJob({
    hour: hour,
    minute: minute,
    dayOfweek: week,
  }, async () => {
    // console.log('scheduleCronstyle:' + task.text);
    showNotification(task)
    setTimeout(() => {
      webContents.send('schedule')
      console.log('找东西');
    }, 61000);
    if (week.length === 0) {
      job.cancel()
      try {
        let taskList = await readTask()
        taskList[task.id].switch = false
        writeTask(taskList)
      } catch {
        console.log('读取任务失败');
      }
    }
  });
  jobs[task.id] = job
  console.log('开启定时任务' + task.text);
}

function showNotification(task: task) {
  const toastXml = `
<toast launch="https://www.electronjs.org" activationType="protocol">
  <visual>
      <binding template="ToastGeneric">
          <text hint-callScenarioCenterAlign="true">到时间了！！！</text>
          <text>${task.date}:${task.text}</text>
          <image placement="appLogoOverride" src="${logo}"/>
          <image placement="hero" src="${img}"/>
      </binding>
  </visual>
  <actions>
    <input id="extendTime" type="selection" defaultInput="1">
    <selection id="1" content="1 分钟"/>
    <selection id="15" content="15 分钟"/>
    <selection id="60" content="1 小时"/>
    <selection id="240" content="4 小时"/>
    <selection id="1440" content="1 天"/>
    </input>
    <action
      activationType="system"
      arguments="snooze"
      hint-inputId="snoozeTime"
      content="推迟"/>
    <action
      activationType="system"
      arguments="dismiss"
      content="知道了"/>
  </actions>
</toast>`;
  const notification = new Notification({ toastXml });
  notification.show();
}