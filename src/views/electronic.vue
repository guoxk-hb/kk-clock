<template>
  <div class="dragable box-border w-full min-w-full overflow-hidden">
    <div class="box-border my-[4vw] border-soild rounded-md border-1 border-gray-300 shadow-lg">
      <!-- bg-violet-200 -->
      <div class="mx-[6vw] flex justify-between text-center text-[20vw] text-white">
        <template v-for="(item, index) in Object.values(time)" :key="index">
          <div class="unselect box-border flex-3 text-shadow" v-if="index > 3">
            <span class="undragable align-middle">{{ item }}</span>
          </div>
          <div v-if="6 > index && index > 3" class="box-border flex-1 text-shadow">
            <span class="undragable">:</span>
          </div>
        </template>
        <div
          class="p-[2vw] text-[4vw] flex-1 text-end"
          style="text-orientation: upright; writing-mode: vertical-rl; letter-spacing: 0.5vw"
        >
          <span class="undragable px-[0.5vw] py-[1vw] bg-red-700 rounded">{{ timeFrame }}</span>
        </div>
      </div>
      <div
        class="unselect px-[5vw] py-[3vw] flex justify-around text-left text-[4vw] rounded-md bg-violet-200/[.4]"
      >
        <!-- bg-violet-200/[.4] -->
        <div style="letter-spacing: 0.5vw" class="dragable">
          <div class="py-[1vw]">
            <span class="undragable">{{ time.year }}年{{ time.month }}月{{ time.date }}日</span>
          </div>
          <div class="py-[1vw]">
            <span class="undragable">{{ lunar }}</span>
          </div>
        </div>
        <div style="letter-spacing: 1vw" class="dragable px-[4vw] py-[2vw]">
          <span class="undragable">星期{{ WEEK[Number(time.day)] }}</span>
        </div>
        <!-- writing-mode: vertical-rl; -->
        <!-- text-orientation: upright; -->
      </div>
    </div>
    <el-scrollbar
      @mouseenter="cancelScrollAnimation"
      @mouseleave="handleScrollAnimation"
      native
      class="undragable box-border my-[2vw] px-[vw] py-[1vw] border-soild rounded-md border-1 border-gray-300 bg-violet-200/[0.4] shadow-lg"
    >
      <div ref="scrollText" class="whitespace-nowrap text-[5vw]">
        <span class="scroll-text px-[4vw]">{{ recentTask.text }}天地！！！！！！！！</span>
      </div>
    </el-scrollbar>
    <!-- <div class="undragable flex justify-around p-[2vw] rounded-md hover:bg-slate-100/20 hover:opacity-100 opacity-0">
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
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue'
interface Time {
  year: number
  month: string
  date: string
  day: string
  hours: string
  minutes: string
  seconds: string
}
const time: Time = reactive({
  year: new Date().getFullYear(),
  month: formateTime(new Date().getMonth() + 1),
  date: formateTime(new Date().getDate()),
  day: formateTime(new Date().getDay()),
  hours: formateTime(new Date().getHours()),
  minutes: formateTime(new Date().getMinutes()),
  seconds: formateTime(new Date().getSeconds())
})
let shouldStop = ref(false)
function setTimer() {
	if(shouldStop.value){
		return
	}
  time.year = new Date().getFullYear()
  time.month = formateTime(new Date().getMonth() + 1)
  time.date = formateTime(new Date().getDate())
  time.day = formateTime(new Date().getDay())
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
const recentTask = ref({
  text: '',
  date: 0
})
const animation = ref(null)
onMounted(async () => {
  setTimer()
  let task = await window.electronAPI.readTask()
  task.forEach((item) => {
    //闹钟开启，且在当天      定时包含这一天、或只执行一次
    if (item.switch === true && (item.week.includes(time.day) || item.week.length === 0)) {
      console.log(1111)
    }
  })
  handleScrollAnimation()
})
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
    // autoScroll()
  }
}
function cancelScrollAnimation() {
  animation.value.cancel()
}

window.electronAPI.frameResized(() => {
  cancelScrollAnimation()
  handleScrollAnimation()
})
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
onUnmounted(() => {
	shouldStop.value = true
  clearTimer()
})
</script>
<style lang="scss" scoped></style>
