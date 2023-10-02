<template>
	<div class="dragable box-border w-full min-w-full">
		<div class="box-border px-[8vw] py-[4vw]  border-soild rounded-md border-1 border-gray-300 bg-violet-200 shadow-lg">
			<div class="flex justify-between">
				<template v-for="(item, index) in Object.values(time)" :key="index">
					<div class="box-border flex-3 text-center" v-if="index > 3">
						<span class="align-text-top text-shadow text-[20vw] text-white font-sans">{{
							item
						}}</span>
					</div>
					<div v-if="6 > index && index > 3" class="box-border flex-1 text-center">
						<span class="align-top text-shadow text-[20vw] text-white font-sans">:</span>
					</div>
				</template>
			</div>
			<div class="text-center text-[4vw]">
				<span>{{ time.month }}月{{ time.date }}日</span>
				<span class="p-[3vw]">星期六</span>
				<span>傍晚</span>
			</div>
		</div>
		<el-scrollbar ref="taskText" native
			class="box-border my-2 px-3 py-[1vw] border-soild rounded-md border-1 border-gray-300 bg-violet-200 shadow-lg">
			<div class="scroll-text">
				<span class="whitespace-nowrap text-[5vw]">代办事项:周六晚7点要塞 7点要塞 7点要塞 7点要塞 7点要塞
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
import { formateTime } from '@/common/common'
import { onMounted, reactive ,onUnmounted} from 'vue'
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
	}, 1000)
}
const clearTimer = () => {
	clearInterval(timer.value)
}

const taskText = ref(null)

onMounted(() => {
	setTimer()
})
onUnmounted(()=>{
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
