<template>
	<div
		class="dragable absolute w-full min-w-full h-full p-4 border border-solid border-gray-400 bg-white shadow-lg shadow-black"
	>
		<el-form :model="scheduleForm" ref="form" :rules="rules">
			<el-row :gutter="20" class="">
				<el-col :span="12" :offset="0">
					<el-form-item prop="text" label="">
						<el-input
							class="undragable"
							v-model.trim="scheduleForm.text"
							placeholder="请输入文字"
							maxlength="20"
							clearable
						>
							<template #prefix>
								<i-ep-edit></i-ep-edit>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4" :offset="0">
					<el-form-item prop="week" label="">
						<el-select
							class="undragable"
							v-model="scheduleForm.week"
							placeholder="重复"
							clearable
							filterable
							multiple
							collapse-tags
							collapse-tags-tooltip
							:max-collapse-tags="1"
						>
							<el-option
								v-for="item in weekOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="4" :offset="0">
					<el-form-item prop="date" class="undragable" label="">
						<el-time-picker
							v-model="scheduleForm.date"
							placeholder="时间"
							format="HH:mm"
							value-format="HH:mm"
						>
						</el-time-picker>
					</el-form-item>
				</el-col>
				<el-col :span="4" :offset="0">
					<el-form-item>
						<el-button class="undragable" type="primary" @click="addTask">创建</el-button>
						<el-button class="undragable">取消</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-table :data="scheduleTable">
			<el-table-column header-align="center" align="center" prop="text" label="事情">
						<template #default="scope">
							<span v-if="!scope.row.edit">{{scope.row.text}}</span>
							<input v-else />
						</template>
			</el-table-column>
			<el-table-column header-align="center" align="center" prop="week" label="重复">
			</el-table-column>
			<el-table-column header-align="center" align="center" prop="date" label="时间">
			</el-table-column>
			<el-table-column header-align="center" align="center" label="操作">
				<template #default="scope">
					<el-link type="primary" @click="editTask(scope.row)">
						<template #icon>
							<el-icon class="mx-1">
								<i-ep-edit-pen></i-ep-edit-pen>
							</el-icon>
						</template>
						编辑
					</el-link>
					<el-link type="danger" class="mx-[10px]" @click="deleteTask(scope.$index)">
						<template #icon>
							<el-icon class="mx-1">
								<i-ep-delete></i-ep-delete>
							</el-icon>
						</template>
						删除
					</el-link>
										<el-link type="danger" class="mx-[10px]" @click="saveTask(scope.$index)">
						<template #icon>
							<el-icon class="mx-1">
								<i-ep-delete></i-ep-delete>
							</el-icon>
						</template>
						删除
					</el-link>
										<el-link type="danger" class="mx-[10px]" @click="cancelTask(scope.$index)">
						<template #icon>
							<el-icon class="mx-1">
								<i-ep-delete></i-ep-delete>
							</el-icon>
						</template>
						删除
					</el-link>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup lang="ts">
	import { reactive, toRaw } from 'vue'
	import { weekOptions } from '@/common/dict'
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
		text: string
		week: Array<number>
		date: string
		eidt: boolean
	}
	const scheduleForm: task = reactive({
		text: '',
		week: '',
		date: null,
		edit: false
	})
	let scheduleTable = reactive([])
	//增
	const addTask = () => {
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
		const task = Object.assign({}, toRaw(scheduleForm))
		scheduleTable.push(task)
		window.electronAPI.writeTask(toRaw(scheduleTable))
	}
	//删
	const deleteTask = (index) => {
		// console.log(index,"row");
		ElMessageBox.confirm('确定要删除此任务吗?', 'warning', {
			// if you want to disable its autofocus
			// autofocus: false,
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
			center: true
		})
			.then(() => {
				scheduleTable.splice(index, 1)
				window.electronAPI.writeTask(toRaw(scheduleTable))
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
	const editTask=(row)=>{
		row.edit=true
	}
	//保存
	const saveTask=()=>{

	}
	//取消
	const cancelTask=()=>{

	}
	async function initScheduleTable() {
		let task = await window.electronAPI.readTask()
		scheduleTable.push(...task)
	}
	initScheduleTable()
</script>

<style lang="scss" scoped></style>
