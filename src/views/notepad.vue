<template>
	<div class=" absolute w-full min-w-full h-full p-4 border border-solid border-gray-400 bg-white shadow-lg shadow-black">
		<el-form :model="scheduleForm" ref="form" :rules="rules">
			<el-row :gutter="20" class="">
				<el-col :span="12" :offset="0">
					<el-form-item prop="text" label="">
						<el-input class="" v-model.trim="scheduleForm.text" placeholder="请输入文字" maxlength="20" clearable>
							<template #prefix>
								<i-ep-edit></i-ep-edit>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4" :offset="0">
					<el-form-item prop="week" label="">
						<el-select class="" v-model="scheduleForm.week" placeholder="重复" clearable filterable multiple collapse-tags
							collapse-tags-tooltip :max-collapse-tags="1">
							<el-option v-for="item in weekOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="4" :offset="0">
					<el-form-item prop="date" class="" label="">
						<el-time-picker v-model="scheduleForm.date" placeholder="时间" format="HH:mm" value-format="HH:mm">
						</el-time-picker>
					</el-form-item>
				</el-col>
				<el-col :span="4" :offset="0">
					<el-form-item>
						<el-button class="" type="primary" @click="addTask">创建</el-button>
						<el-button class="">取消</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-table :data="scheduleTable">
			<el-table-column header-align="center" align="center" prop="text" label="事情">
				<template #default="scope">
					<span v-if="!scope.row.edit">{{ scope.row.text }}</span>
					<el-input v-else class="" v-model.trim="editScheduleForm.text" placeholder="请输入文字" maxlength="20" clearable>
						<template #prefix>
							<i-ep-edit></i-ep-edit>
						</template>
					</el-input>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="center" prop="week" label="重复">
				<template #default="scope">
					<el-tag v-if="!scope.row.edit">{{ weekFormatter(scope.row.week) }}</el-tag>
					<el-select v-else class="" v-model="editScheduleForm.week" placeholder="重复" clearable filterable multiple
						collapse-tags collapse-tags-tooltip :max-collapse-tags="1">
						<el-option v-for="item in weekOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="center" prop="date" label="时间">
				<template #default="scope">
					<span v-if="!scope.row.edit">{{ scope.row.date }}</span>
					<el-time-picker v-else v-model="editScheduleForm.date" placeholder="时间" format="HH:mm" value-format="HH:mm">
					</el-time-picker>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="center" prop="switch" label="开关" width="100">
				<template #default="scope">
					<el-switch v-if="!scope.row.edit" v-model="scope.row.switch" :disabled="!scope.row.edit" />
					<el-switch v-else v-model="editScheduleForm.switch" />
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="center" label="操作">
				<template #default="scope">
					<el-link v-if="!scope.row.edit" type="primary" @click="editTask(scope.row)">
						<template #icon>
							<el-icon class="mx-1">
								<i-ep-edit-pen></i-ep-edit-pen>
							</el-icon>
						</template>
						编辑
					</el-link>
					<el-link v-if="!scope.row.edit" type="danger" class="mx-[10px]" @click="deleteTask(scope.$index)">
						<template #icon>
							<el-icon class="mx-1">
								<i-ep-delete></i-ep-delete>
							</el-icon>
						</template>
						删除
					</el-link>
					<el-link v-if="scope.row.edit" type="success" class="mx-[10px]" @click="saveTask(scope.row)">
						<template #icon>
							<el-icon class="mx-1">
								<i-ep-check></i-ep-check>
							</el-icon>
						</template>
						保存
					</el-link>
					<el-link v-if="scope.row.edit" type="info" class="mx-[10px]" @click="cancelTask(scope.row)">
						<template #icon>
							<el-icon class="mx-1">
								<i-ep-close></i-ep-close>
							</el-icon>
						</template>
						取消
					</el-link>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup lang="ts">
import { weekOptions, WEEK } from '@/common/dict'
const rules = reactive({
	text: [
		{
			required: true,
			message: '请输入文字',
			trigger: 'blur'
		}
	],
	date: [
		{
			// type: 'date',
			required: true,
			message: '请选择时间',
			trigger: 'change'
		}
	]
})

interface task {
	id: number
	text: string
	week: Array<number>
	date: string
	switch: boolean
	edit: boolean
}
const scheduleForm: task = reactive({
	id: 0,
	text: '',
	week: [],
	date: null,
	switch: true,
	edit: false
})
const editScheduleForm: task = reactive({
	id: 0,
	text: '',
	week: [],
	date: null,
	switch: true,
	edit: false
})
let scheduleTable = reactive([])
//增
const addTask = async () => {
	if (scheduleForm.text === '') {
		ElMessage({
			message: '请输入task。',
			type: 'warning'
		})
		return
	}
	if (scheduleForm.date === null) {
		ElMessage({
			message: '请选择时间',
			type: 'warning'
		})
		return
	}
	scheduleForm.id = scheduleTable.length
	const task = Object.assign({}, toRaw(scheduleForm))
	task.week = task.week.sort((a, b) => a - b)
	scheduleTable.push(task)
	await window.electronAPI.createSchedule(toRaw(scheduleTable))
  await	window.electronAPI.writeTask(toRaw(scheduleTable))
	await	window.electronAPI.updataTask()
}
//删
const deleteTask = (index:number) => {
	// console.log(index,"row");
	ElMessageBox.confirm('确定要删除此任务吗?', 'warning', {
		// if you want to disable its autofocus
		// autofocus: false,
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
		center: true
	})
		.then(async () => {
			scheduleTable.splice(index, 1)
			await window.electronAPI.writeTask(toRaw(scheduleTable))
			await	window.electronAPI.updataTask()
			ElMessage({
				type: 'success',
				message: '删除成功'
			})
		})
		.catch(() => {
			ElMessage({
				type: 'info',
				message: '已取消删除'
			})
		})
}
//改
const editTask = (row:task) => {
	scheduleTable.forEach((item:task) => {
		item.edit = false
	})
	row.edit = true
	// editScheduleForm=Object.assign({},row)
	editScheduleForm.id = row.id
	editScheduleForm.date = row.date
	// editScheduleForm.edit=row.edit
	editScheduleForm.switch = row.switch
	editScheduleForm.text = row.text
	editScheduleForm.week = row.week
}
//保存
const saveTask = async (row:task) => {
	row.edit = false
	//row.id=editScheduleForm.id
	row.date = editScheduleForm.date
	// row.edit=editScheduleForm.edit
	row.switch = editScheduleForm.switch
	row.text = editScheduleForm.text
	row.week = editScheduleForm.week.sort((a, b) => a - b)
 await	window.electronAPI.createSchedule(toRaw(row))
 await	window.electronAPI.writeTask(toRaw(scheduleTable))
 await	window.electronAPI.updataTask()
}
//取消
const cancelTask = (row:task) => {
	row.edit = false
}
//初始化读取 task任务
async function initScheduleTable() {
	let task = await window.electronAPI.readTask()
	scheduleTable.push(...task)
}
initScheduleTable()

function weekFormatter(week: Array<number>) {
	// if(row)
	if(week.length === 0){
		return '不重复'
	}
	else if (week.length === 7) {
		return '每天'
	} else {
		let weekStr = '周'
		week.forEach((item:number) => {
			weekStr += WEEK[item] + '、'
		})
		weekStr = weekStr.substring(0, weekStr.length - 1)
		return weekStr
	}
}
</script>

<style lang="scss" scoped></style>
