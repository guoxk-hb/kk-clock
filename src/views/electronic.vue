<template>
	<div class=" box-border w-full min-w-full">
		<div class="box-border py-[4vw]  border-soild rounded-md border-1 border-gray-300  shadow-lg">
			<!-- bg-violet-200 -->
			<div class=" px-[8vw] flex justify-between text-center text-shadow text-[20vw] text-white">
				<template v-for="(item, index) in Object.values(time)" :key="index">
					<div class="unselect  box-border flex-3" v-if="index > 3">
						<span class="dragable align-middle">{{
							item
						}}</span>
					</div>
					<div v-if="6 > index && index > 3" class="box-border flex-1 ">
						<span class="dragable">:</span>
					</div>
				</template>
			</div>
			<div class="unselect px-[5vw] py-[3vw] flex text-left text-[4vw] rounded-md bg-violet-200/[.4] ">
				<!-- bg-violet-200/[.4] -->
				<div style="text-orientation: upright;writing-mode: vertical-rl; letter-spacing: 3vw;" class="dragable px-[2vw] py-[3vw] rounded-[4vw] bg-violet-200/[.4]">
					<span>星期{{ WEEK[Number(time.day)] }}</span>
				</div>
				<div class="dragable">
					<span>{{ time.year }}年 {{ time.month }}月{{ time.date }}日</span>
					<br>
					<span>{{ lunar }}</span>
					<br>
				</div>
				<!-- writing-mode: vertical-rl; -->
<!-- text-orientation: upright; -->
				<span>{{ timeFrame }}</span>
			</div>
		</div>
		<el-scrollbar ref="taskText" native
			class="box-border my-2 px-3 py-[1vw] border-soild rounded-md border-1 border-gray-300 bg-violet-200/[0.4] shadow-lg ">
			<div class="dragable scroll-text">
				<span class="unselect whitespace-nowrap text-[5vw]">代办事项:周六晚7点要塞 7点要塞 7点要塞 7点要塞 7点要塞
				</span>
			</div>
		</el-scrollbar>
		<div class="undragable flex justify-around p-[2vw] rounded-md hover:bg-slate-100/20 hover:opacity-100 opacity-0">
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
		</div>
	</div>
</template>

<script setup lang="ts">
import { formateTime, toCnDate } from '@/common/common'
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
let timer = ref(null)
const setTimer = () => {
	timer.value = setInterval(() => {
		(time.year = new Date().getFullYear()),
			(time.month = formateTime(new Date().getMonth() + 1)),
			(time.date = formateTime(new Date().getDate())),
			(time.day = formateTime(new Date().getDay())),
			(time.hours = formateTime(new Date().getHours())),
			(time.minutes = formateTime(new Date().getMinutes())),
			(time.seconds = formateTime(new Date().getSeconds()))
		// lunar.value=toCnDate(new Date())
	}, 1000)
}
const clearTimer = () => {
	clearInterval(timer.value)
}
const taskText = ref(null)

let timeFrame = computed(() => {
	let timeFrame = timeFrameOptions.find((item) => item.value[0] <= Number(time.hours) && item.value[1] > Number(time.hours))
	return timeFrame.label
})

let lunar = ref<string>(toCnDate(new Date()))
onMounted(() => {
	setTimer()
})
onUnmounted(() => {
	clearTimer()
})
</script>
<style lang="scss" scoped>
.scroll-text {
	// animation: scrollText 10s linear infinite;
	/* 应用动画 */
}

.scroll-text:hover {
	animation: none;
}

@keyframes scrollText {
	from {
		transform: translateX(0);
		/* 初始位置 */
	}

	to {
		transform: translateX(-100%);
		/* 初始位置 */
	}
}
</style>
