<template>
  <el-button type="primary" size="default" @click="open"></el-button>
  
  <RouterView />
</template>

<script setup lang="ts">
onMounted(()=>{
  // window.open('http://localhost:5173/notepad')
})
const open=()=>{
  window.open('http://localhost:5173/notepad',"_blank")
}
</script>
<style lang="scss" scoped></style>
