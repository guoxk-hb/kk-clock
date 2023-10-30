<template>
  	<drag-tool>
  <RouterView/>
  <audio ref="ring" src="/public//pikaqiu.mp3"></audio>
</drag-tool>
</template>

<script setup lang="ts">
import DragTool from '@/components/DragTool.vue'
import { onMounted, ref } from "vue";
onMounted(() => {
})
let ring = ref<HTMLAudioElement | null>(null)
const showNotification = (message) => {
  ring.value.play()
}
</script>
<style lang="scss" scoped></style>
