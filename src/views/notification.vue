<template>
	<div>通知</div>
</template>

<script setup lang="ts">
	import { ElNotification } from 'element-plus'

	const open = ():void => {
		ElNotification({
			title: 'Prompt',
			message: 'This is a message that does not automatically close',
			duration: 0
		})
	}
</script>

<style lang="scss" scoped>
</style>