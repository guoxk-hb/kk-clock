<template>
  <div class="dragable box-border flex justify-between w-full max-w-full h-[50vw] border border-soild border-gray-500 rounded-full bg-violet-100">
    <div class="flex-1 w-[50vw] h-[50vw] py-[5vw] px-[8vw] ">
      <div class="  w-[40vw] h-[40vw]
         rounded-full
         bg-white"
       >
      </div>
      
    </div>
    <div class="flex-1 text-[5vw]">
        <ul>
          <li></li>
          <li>may:五月 十六日</li>
        </ul>
      </div>
  </div>
</template>

<script setup lang="ts">
import formateTime from '@/common/formateTime'
import { onMounted, reactive,ref } from 'vue'








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
onMounted(() => {
  setInterval(() => {
    time.year = new Date().getFullYear(),
      time.month = formateTime(new Date().getMonth() + 1),
      time.date = formateTime(new Date().getDate()),
      time.day = formateTime(new Date().getDay()),
      time.hours = formateTime(new Date().getHours()),
      time.minutes = formateTime(new Date().getMinutes()),
      time.seconds = formateTime(new Date().getSeconds())
  }, 1000)
})
</script>
<style lang="scss" scoped></style>
