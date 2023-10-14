<template>
  <RouterView />
  <audio src="/public//pikaqiu.mp3" ></audio>
  
</template>

<script setup lang="ts">
import { onMounted } from "vue";
onMounted(()=>{
  // window.open('http://localhost:5173/notepad')
})
const showNotification=(options)=>{
  // window.open('http://localhost:5173/notepad',"_blank")
  // let options ={
  //   title: "123",
  //   body: "Notification from the Main process",
  //   silent: true,
  //   sound:'@/assets/pikaqiu.mp3'
  // }
 let notifiy=new window.Notification("kk-clock",options)
}

//右键菜单
window.addEventListener('contextmenu', (e) => {
  //阻止默认行为
  e.preventDefault()
  //发送消息
  window.electronAPI.showContextMenu()
})
</script>
<style lang="scss" scoped></style>
