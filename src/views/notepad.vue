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
								<i-ep-editPen></i-ep-editPen>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4" :offset="0">
					<el-form-item prop="week" label="">
						<el-select
							class="undragable"
							v-model="scheduleForm.week"
							value-key=""
							placeholder="重复"
							clearable
							filterable
							@change=""
						>
							<!-- <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option> -->
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="4" :offset="0">
					<el-form-item prop="date" class="undragable" label="">
						<el-time-picker style="width: 200rem" v-model="scheduleForm.date" placeholder="时间">
						</el-time-picker>
					</el-form-item>
				</el-col>
				<el-col :span="4" :offset="0">
					<el-form-item>
						<el-button class="undragable" type="primary" @click="creatTask">创建</el-button>
						<el-button class="undragable">取消</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-table :data="scheduleTable">
			<el-table-column header-align="center" align="center" prop="text" label="事情">
			</el-table-column>
			<el-table-column header-align="center" align="center" prop="week" label="重复">
			</el-table-column>
			<el-table-column header-align="center" align="center" prop="date" label="时间">
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup lang="ts">
	import { reactive } from 'vue'
	const rules = reactive({
		text: {
			type: 'string',
			required: true,
			message: '请输入文字',
			trigger: 'blur'
		},
		date: {
			type: 'date',
			required: true,
			message: '请选择时间',
			trigger: 'change'
		}
	})
	const scheduleForm: {
		text: string
		week: string
		date: string
	} = reactive({
		text: '',
		week: '星期一',
		date: ''
	})
	const scheduleTable = reactive([
		{
			text: 123,
			week: '1',
			date: '18:00:00'
		}
	])
	const creatTask = () => {
		if (scheduleForm.text === '') {
			// console.log("请输入task");
			ElMessage({
				message: '请输入task。',
				type: 'warning'
			})
			return
		}
		if (scheduleForm.date === '') {
			console.log('请选择时间')
			ElMessage({
				message: '请选择时间',
				type: 'warning'
			})
			return
		}
		const task = Object.assign({}, toRaw(scheduleForm))
		scheduleTable.push(task)
	}

	onMounted(()=>{
	})
</script>

<style lang="scss" scoped></style>
