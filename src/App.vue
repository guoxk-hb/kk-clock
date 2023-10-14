<template>
  <RouterView />
  <audio ref="ring" src="/public//pikaqiu.mp3" ></audio>
  
</template>

<script setup lang="ts">
import { onMounted,ref} from "vue";
import { useRouter } from 'vue-router'

onMounted(()=>{
  // window.open('http://localhost:5173/notepad')
})

let ring = ref<HTMLAudioElement|null>(null)

const showNotification=(message)=>{
  // window.open('http://localhost:5173/notepad',"_blank")
  let options ={
    title: "闹钟",
    body: message.text,
    silent: false,
    tag:'闹钟',
    icon:'/public/logo.png',
    renotify:true
    // requireInteraction 指示通知应保持活动状态，直到用户单击或关闭它，而不是自动关闭。默认值为 false。
    // vibrate  设备震动字段
  }
console.log(message,'message');

 let notifiy=new window.Notification("kk-clock",options)
 console.log(ring.value,"ring");
 ring.value.play()
}

//右键菜单
window.addEventListener('contextmenu', (e) => {
  //阻止默认行为
  e.preventDefault()
  //发送消息
  window.electronAPI.showContextMenu()
})

window.electronAPI.showNotification(showNotification)

const router = useRouter()
 
const toPage = () => {

}
window.electronAPI.showContextCommand(
  (command)=>{
    //调整方案  不要切换路由 直接打开新的页面窗口
    router.push('/'+ command)
  }
)
</script>
<style lang="scss" scoped></style>
