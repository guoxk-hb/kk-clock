
import { formateTime, toCnDate, formateTimestamp } from '@/common/common'

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
import { WEEK, WEATHER, timeFrameOptions } from '@/common/dict'

export default function(){
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
  let timeFrame = computed(() => {
    let timeFrame = timeFrameOptions.find(
      (item) => item.value[0] <= Number(time.hours) && item.value[1] > Number(time.hours)
    )
    if(timeFrame.label){
    return timeFrame.label
    }else{
      return ''
    }
  })
  let lunar = ref<string>(toCnDate(new Date()))
  onMounted(() => {
    setTimer()
  })
  onUnmounted(() => {
    shouldStop.value = true
    // cancelScrollAnimation()
    // clearTimer()
  })
  return {time,timeFrame,lunar}
}