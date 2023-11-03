<template>
  <div class="unselect box-border w-full min-w-full overflow-hidden">
    <div class="box-border my-[4vw] border-soild rounded-md border-1 border-gray-300 shadow-lg">
      <!-- bg-violet-200 -->
      <div class="mx-[6vw] flex justify-between text-center text-[20vw] text-white">
        <template v-for="(item, index) in Object.values(time)" :key="index">
          <div class=" box-border flex-3 text-shadow" v-if="index > 3">
            <span class=" align-middle">{{ item }}</span>
          </div>
          <div v-if="6 > index && index > 3" class="box-border flex-1 text-shadow">
            <span class="">:</span>
          </div>
        </template>
        <div class="p-[2vw] text-[4vw] flex-1 text-end"
          style="text-orientation: upright; writing-mode: vertical-rl; letter-spacing: 0.5vw">
          <span class=" px-[0.5vw] py-[1vw] bg-red-500 rounded-[1vw]">{{ timeFrame }}</span>
        </div>
      </div>
      <div class=" px-[5vw] py-[3vw] flex justify-around text-left text-[4vw] rounded-md bg-violet-200/[.4]">
        <!-- bg-violet-200/[.4] -->
        <div style="letter-spacing: 0.5vw" class="">
          <div class="py-[1vw]">
            <span class="">{{ time.year }}年{{ time.month }}月{{ time.date }}日</span>
          </div>
          <div class="py-[1vw]">
            <span class="">{{ lunar }}</span>
          </div>
        </div>
        <div style="letter-spacing: 1vw" class=" px-[4vw] py-[2vw]">
          <span class="">星期{{ WEEK[Number(time.day)] }}</span>
        </div>
        <!-- writing-mode: vertical-rl; -->
        <!-- text-orientation: upright; -->
      </div>
    </div>
    <div @mouseenter="cancelScrollAnimation" @mouseleave="handleScrollAnimation"
      class=" overflow-hidden my-[2vw] px-[vw] py-[1vw] text-[5vw] border-soild rounded-md border-1 border-gray-300 bg-violet-200/[0.4] ">
      <div v-if="recentTask?.week"
        class="float-left w-[18vw] mx-[1vw] text-center rounded-[1vw] border-violet-600 border ">星期{{
          WEEK[Number(recentTask?.week)] }}</div>
      <div v-if="recentTask?.date"
        class="float-left w-[18vw] mx-[1vw] text-center rounded-[1vw] border-violet-600 border ">{{ recentTask?.date }}
      </div>
      <div class="float-right w-[60vw] overflow-hidden">
        <div ref="scrollText" class="whitespace-nowrap">
          <span class="scroll-text px-[4vw]">{{ recentTask?.text }}</span>
        </div>
      </div>
    </div>
    <!-- <div class=" flex justify-around p-[2vw] rounded-md hover:bg-slate-100/20 hover:opacity-100 opacity-0">
			<el-icon size="7vw" v-show="false">
				<i-ep-lock></i-ep-lock>
			</el-icon>
			<el-icon size="7vw">
				<i-ep-unlock></i-ep-unlock>
			</el-icon>
			<el-icon size="7vw">
				<i-ep-setting></i-ep-setting>
			</el-icon>
			<el-icon size="7vw">
				<i-ep-calendar> </i-ep-calendar>
			</el-icon>
		</div> -->
  </div>
</template>

<script setup lang="ts">
import { formateTime, toCnDate, formateTimestamp } from '@/common/common'
import { WEEK, timeFrameOptions } from '@/common/dict'
import { reactive, ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import {getWeatherInfo } from '@/api/common'
//时间相关信息类型定义
interface Time {
  year: number
  month: string
  date: string
  day: number
  hours: string
  minutes: string
  seconds: string
}
const time: Time = reactive({
  year: new Date().getFullYear(),
  month: formateTime(new Date().getMonth() + 1),
  date: formateTime(new Date().getDate()),
  day: new Date().getDay(),
  hours: formateTime(new Date().getHours()),
  minutes: formateTime(new Date().getMinutes()),
  seconds: formateTime(new Date().getSeconds())
})
// 停止requestAnimationFrame动画 时间
let shouldStop = ref(false)
function setTimer() {
  if (shouldStop.value) {
    return
  }
  time.year = new Date().getFullYear()
  time.month = formateTime(new Date().getMonth() + 1)
  time.date = formateTime(new Date().getDate())
  time.day = new Date().getDay()
  time.hours = formateTime(new Date().getHours())
  time.minutes = formateTime(new Date().getMinutes())
  time.seconds = formateTime(new Date().getSeconds())
  // timer.value = setInterval(() => {
  // lunar.value=toCnDate(new Date())
  // }, 1000)
  requestAnimationFrame(setTimer)
}
// const clearTimer = () => {
//   clearInterval(timer.value)
// }
let timeFrame = computed(() => {
  let timeFrame = timeFrameOptions.find(
    (item) => item.value[0] <= Number(time.hours) && item.value[1] > Number(time.hours)
  )
  return timeFrame.label
})

let lunar = ref<string>(toCnDate(new Date()))
const scrollText = ref(null)

const animation = ref(null)

//滚动事件
function handleScrollAnimation() {
  //元素支持滚动
  if (scrollText.value.scrollWidth > scrollText.value.clientWidth) {
    const duration = 6000 // 动画持续时间（毫秒）
    const keyframes = [
      { transform: `translateX(${scrollText.value.clientWidth}px)` },
      { transform: `translateX(-${scrollText.value.scrollWidth}px)` }
    ]
    const options = {
      duration: duration,
      iterations: Infinity // 无限循环
    }
    animation.value = scrollText.value.animate(keyframes, options)
  }
}
//取消滚动
function cancelScrollAnimation() {
  if (scrollText.value.scrollWidth > scrollText.value.clientWidth && animation.value !== null) {
    animation.value.cancel()
  }
}
//窗口移动后 重启滚动、重新计算距离
window.electronAPI.frameResized(() => {
  if (scrollText.value.scrollWidth > scrollText.value.clientWidth) {
    cancelScrollAnimation()
    handleScrollAnimation()
  }
})
//task 类型
interface task {
  id: number
  text: string
  week: Array<number>
  date: string
  switch: boolean
  edit: boolean
}
//最近事件类型 定义
interface recentTask extends Partial<Pick<task, 'id' | 'date' | 'edit' | 'switch'>> {
  text: string
  week?: number
}
//计算最近的定时闹钟
function findRecentTask(task: Array<task>) {
  task = task.sort((a, b) => formateTimestamp(a.date) - formateTimestamp(b.date))
  let recentTask: recentTask|undefined
  for (let i = 0; i < task.length; i++) {
    if (task[i].switch === true && (task[i].week.includes(time.day) || task[i].week.length === 0)) {
      recentTask=Object.assign(task[i],{week:time.day})
      break
    }
  }
  if (!recentTask) {
    return findNotTodayRecentTask(task, time.day + 1)
  } else {
    return recentTask
  }

}
//如果当天没有则 找接下来最近的一个闹钟
function findNotTodayRecentTask(task: Array<task>, day: number) {
  let recentTask: recentTask|undefined
  for (let i = 0; i < task.length; i++) {
    if (task[i].switch === true && task[i].week.includes(day)) {
      recentTask=Object.assign(task[i],{week:day})
      console.log(recentTask)
      break
    }
  }
  if (recentTask) {
    recentTask.week = day
    return recentTask
  } else if (day === time.day) {
    return {
      text: '今天没有代办事项',
    }
  }
  else {
    day = day === 6 ? 0 : day
    return findNotTodayRecentTask(task, day + 1)
  }
}
const recentTask = ref<recentTask | null>(null)
async function readTask() {
  let task = await window.electronAPI.readTask()
  recentTask.value = findRecentTask(task);
  await nextTick()
  handleScrollAnimation()
}
readTask()

interface SettingForm{
  ringVal: Array<number>,
  ringName: string,
  ringFileUrl: string,
  clockStyle: number, // 1 电子 2 古典 3 粒子
  quit:number // 1 最小化 2 退出
  bootstrap:boolean //开机自启
  country: string,
  province: string,
  city: string,
  county: string,
}
//读取 setting
async function readSetting(){
   let res:SettingForm =await window.electronAPI.readSetting()
   let weatherInfo = await getWeatherInfo({city:res.county})
   console.log(weatherInfo,'weatherInfo');
}
readSetting()
onMounted(() => {
  setTimer()
})

onUnmounted(() => {
  shouldStop.value = true
  cancelScrollAnimation()
  // clearTimer()
})
</script>
<style lang="scss" scoped></style>


<!--
  // requestAnimationFrame自动滚动 相对来说有缺点，不如css
  // function autoScroll() {
//   // 元素支持滚动
//   if (scrollText.value.scrollWidth >= scrollText.value.clientWidth) {
//     // 元素支持滚动
//     scrollText.value.scrollLeft += 1.2
//     // console.log('支持滚动');
//     if (
//       scrollText.value.scrollWidth ==
//       Math.ceil(scrollText.value.scrollLeft) + scrollText.value.offsetWidth
//     ) {
//       scrollText.value.scrollLeft = 0
//     }
//     console.log(
//       scrollText.value.scrollWidth,
//       scrollText.value.scrollLeft,
//       scrollText.value.offsetWidth
//     )

//     requestAnimationFrame(autoScroll)
//   }
// }
-->