<template>
  <div class="unselect box-border w-full min-w-full overflow-hidden">
    <div class="box-border my-[4vw] border-soild rounded-md border-1 border-gray-300 shadow-lg">     
      <electronic v-if="clockStyle==='electronic'"></electronic>
      <particle v-else-if ="clockStyle==='particle'" ref="particleRef"></particle>
      <div class=" overflow-hidden px-[2vw] flex justify-around rounded-md bg-violet-200/[.4]">
        <!-- bg-violet-200/[.4] -->
        <div style="letter-spacing: 0.5vw" class="text-[5vw]">
          <div class="h-[10vw] leading-[10vw]">
            <span class="">{{ time.year }}年{{ time.month }}月{{ time.date }}日</span>
          </div>
          <div class=" h-[10vw] leading-[10vw]">
            <span class="">{{ lunar }}</span>
          </div>

        </div>
        <div class="px-[4vw] text-[5vw]">
          <div style="letter-spacing: 1vw" class="text-[5vw] h-[10vw] leading-[10vw]">
            <el-image class="unselectable w-[10vw]  p-[1vw] align-bottom " :src="locationPng" fit="fill"
              :lazy="true"></el-image>
            <span class="px-[1vw] ">{{ weatherInfo?.province }}</span>
            <span class="text-[4.5vw]">{{ weatherInfo?.city }}</span>
          </div>
          <div style="letter-spacing: 1vw" class="pt-[0.5vw] h-[10vw] leading-[10vw]">
            <el-tooltip placement="top" effect="light">
              <template #content>
                <div class="w-full overflow-hidden flex justify-between items-center text-[5vw]">
                  <el-tooltip content="空气湿度" placement="top" effect="light">
                    <div class="pr-[1.5vw]">
                      <el-image class="unselectable w-[5vw] scale-150 align-bottom" :src="humidityPng"
                        :lazy="true"></el-image>
                      <span class="pl-[1vw]">{{ weatherInfo?.humidity }}</span>
                    </div>
                  </el-tooltip>
                  <el-tooltip :content="`${weatherInfo?.winddirection}风${weatherInfo?.windpower}级`" placement="top"
                    effect="light">
                    <div class="pl-[2vw]">
                      <el-image class="unselectable w-[5vw] scale-125 align-bottom" :src="windpowerPng"
                        :lazy="true"></el-image>
                      <span class="px-[2vw]">{{ weatherInfo?.windpower }}</span>
                    </div>
                  </el-tooltip>
                  <div class="pr-[2vw]"><span>{{ `天气：${weatherInfo?.weather}，温度：${weatherInfo?.temperature}&#8451;`
                  }}</span></div>
                </div>
              </template>
              <div>
                <el-image class="unselectable w-[10vw] p-[1vw] align-bottom" :src="getWeatherIcon()" fit="fill"
                  :lazy="true"></el-image>
                <span class="px-[2vw]">{{ weatherInfo?.temperature }}&#8451;</span>
                <span class="py-[1vw] text-[4.5vw]">星期{{ WEEK[Number(time.day)] }}</span>
              </div>
            </el-tooltip>
          </div>
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
  </div>
</template>

<script setup lang="ts">
import { formateTimestamp } from '@/common/common'
import { WEEK, WEATHER , CLOCK_STYLE} from '@/common/dict'
import { getWeatherInfo } from '@/api/common'
import humidityPng from '@/assets/humidity.png'
import windpowerPng from '@/assets/windpower.png'
import locationPng from '@/assets/location.png'
import electronic from '@/components/clock/electronic.vue'
import particle from '@/components/clock/particle.vue'
import useTime from '@/hooks/useTime'
const { time, lunar } = useTime()
// 停止requestAnimationFrame动画 时间
let shouldStop = ref(false)

// const clearTimer = () => {
//   clearInterval(timer.value)
// }

const scrollText = ref(null)

const animation = ref(null)

//滚动事件
function handleScrollAnimation() {
  cancelScrollAnimation()
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
  if (animation.value !== null) {
    animation.value.cancel()
    animation.value = null
  }
}
const particleRef = ref<InstanceType<typeof particle> | null>(null)
const initCanvasSize = () => {
  particleRef.value?.initCanvasSize()
}
//窗口移动后 重启滚动、重新计算距离
window.electronAPI.frameResized(() => {
  if (scrollText.value.scrollWidth > scrollText.value.clientWidth) {
    cancelScrollAnimation()
    handleScrollAnimation()
  }
  if (particleRef.value) {
    // particleRef.value.initCanvasSize();
    initCanvasSize()
  }
})
//task 类型
interface Task {
  id: number
  text: string
  week: Array<number>
  date: string
  switch: boolean
  edit: boolean
}
//最近事件类型 定义
interface RecentTask extends Partial<Pick<Task, 'id' | 'date' | 'edit' | 'switch'>> {
  text: string
  week?: number
}
//计算最近的定时闹钟
function findRecentTask(task: Array<Task>) {
  task = task.sort((a, b) => formateTimestamp(a.date) - formateTimestamp(b.date))
  let recentTask: RecentTask | undefined
  for (let i = 0; i < task.length; i++) {
    if (task[i].switch === true &&
      (task[i].week.includes(time.day) || task[i].week.length === 0)
      && formateTimestamp(task[i].date) > formateTimestamp(`${time.hours}:${time.minutes}`)
    ) {
      recentTask = Object.assign({}, task[i], { week: time.day })
      break
    }
  }
  if (!recentTask) {
    return findNotTodayRecentTask(task, time.day + 1)
  } else {
    // console.log('第一遍找到了');
    return recentTask
  }
}
//如果当天没有则 找接下来最近的一个闹钟
function findNotTodayRecentTask(task: Array<Task>, day: number) {
  let recentTask: RecentTask | undefined
  for (let i = 0; i < task.length; i++) {
    if (task[i].switch === true && task[i].week.includes(day)) {
      recentTask = Object.assign({}, task[i], { week: day })
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
const recentTask = ref<RecentTask | null>(null)
async function readTask() {
  let task = await window.electronAPI.readTask()
  recentTask.value = findRecentTask(task);
  await nextTick()
  handleScrollAnimation()
  // console.log('找到了',recentTask.value);
}
readTask()
window.electronAPI.scheduleCallback(() => { readTask() })
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
}
interface Live {
  adcode: string,
  city: string,
  humidity: string,
  humidity_float: string,
  province: string,
  reporttime: string,
  temperature: string,
  temperature_float: string,
  weather: string,
  winddirection: string,
  windpower: string,
}
let weatherInfo = ref<Live>(null)
let weather = ref('cloudy')
function getWeatherIcon() {
  return `/src/assets/icon_weather/${weather.value}.png`
}
//读取 setting
let clockStyle = ref('')
async function readSetting() {
  let settingRes: SettingForm = await window.electronAPI.readSetting()
  clockStyle.value=CLOCK_STYLE[settingRes.clockStyle]
  let weatherInfoRes = await getWeatherInfo({ city: settingRes.county })
  if (weatherInfoRes.data.status === '1') {
    weatherInfo.value = weatherInfoRes.data.lives[0]
    weather.value = WEATHER[weatherInfoRes.data.lives[0].weather]
  }
}
readSetting()
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