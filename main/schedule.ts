import schedule from 'node-schedule'

import { readTask } from './nodeApi'

export async function taskSchedule() {
  const taskList = await readTask()
  taskList.forEach(item => {
    schedule.scheduleJob('30 * * * * *', () => {
      console.log('scheduleCronstyle:' + new Date());
    });
  })
}