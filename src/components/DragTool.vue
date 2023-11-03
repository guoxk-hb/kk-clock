<template>
  <div @mouseenter ="mouseenter" @mouseleave="mouseleave" @mousedown="mousedown" @mouseup="mouseup" >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// 鼠标进入判断，只有鼠标进入到范围内，才能进行鼠标按压拖拽
let enterFlag = false;
// 鼠标按压判断，只有鼠标进入范围内，并且按压状态，此时释放鼠标才会关闭窗口移动
let mousedownFlag = false;

let timer: NodeJS.Timeout | null;
/**鼠标移入 */
function mouseenter() {
  enterFlag = true;
}

/**鼠标移出 */
function mouseleave() {
  enterFlag = false;
  // 避免卡顿的情况下，鼠标滑出移动范围，但窗口仍跟随鼠标移动
  if (timer !== null) {
    timer = setTimeout(() => {
      mousedownFlag = false;
      window.electronAPI.windowMove(false);
      timer = null;
    }, 1000);
  }
}

function mousedown(e:MouseEvent) {
  // alert('点击了')
  const target = e.target as HTMLElement;
  if(target.className.includes('el-slider')){
    return
  }
  if (enterFlag) {
    window.electronAPI.windowMove(true);
    mousedownFlag = true;
  }
}
function mouseup(e: MouseEvent) {
  if (enterFlag && mousedownFlag) {
    window.electronAPI.windowMove(false);
    mousedownFlag = false;
  }
}
// 右键菜单 跳转响应
// window.electronAPI.showContextCommand(
//   (command) => {
//     //调整方案  不要切换路由 直接打开新的页面窗口
//     // router.push('/'+ command)
//     window.open('http://localhost:5173/' + command)
//   }
// )
//右键菜单 老方法
// window.addEventListener('contextmenu', (e) => {
//   console.log('右键点击了');
//   //阻止默认行为
//   e.preventDefault()
//   //发送消息
//   window.electronAPI.showContextMenu()
// })

</script>
<style lang="scss" scoped></style>
