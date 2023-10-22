<template>
  <RouterView />
  <audio ref="ring" src="/public//pikaqiu.mp3"></audio>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
onMounted(() => {
  // window.open('http://localhost:5173/notepad')
})
let ring = ref<HTMLAudioElement | null>(null)
const showNotification = (message) => {
  ring.value.play()
}

//右键菜单
window.addEventListener('contextmenu', (e) => {
  console.log('右键点击了');
  
  //阻止默认行为
  e.preventDefault()
  //发送消息
  window.electronAPI.showContextMenu()
})
window.electronAPI.showNotification(showNotification)

//一定要把 ipcRender.on的东西尽量放到onMounted中 否则路由会出问题
//可能跟某些 执行顺序有关
window.electronAPI.showContextCommand(
  (command) => {
    //调整方案  不要切换路由 直接打开新的页面窗口
    // router.push('/'+ command)
    window.open('http://localhost:5173/' + command)
  }
)
</script>
<style lang="scss" scoped></style>
