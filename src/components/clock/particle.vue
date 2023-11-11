<template>
  <div ref="canvasbox" class="h-[32vw]">
    <canvas ref="canvas"></canvas>
  </div>
</template>
<script setup lang="ts">
import useTime from '@/hooks/useTime'
const { time } = useTime()

const canvas = ref<HTMLCanvasElement | null>(null)
class Particle {
  size: number
  x: number
  y: number
  constructor() {
    this.size = getRandom(1 * devicePixelRatio, 2 * devicePixelRatio)
    const rad = (getRandom(0, 360) * Math.PI) / 100
    const r = Math.min(canvas.value.width, canvas.value.height) / 2;
    const cx = canvas.value.width / 2;
    const cy = canvas.value.height / 2;
    this.x = cx + r * Math.cos(rad);
    this.y = cy + r * Math.sin(rad);
  }
  draw() {
    // ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.beginPath();
    ctx.shadowColor = '#d946ef';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fillStyle = '#c084fc';
    ctx.fill();
    // requestAnimationFrame(this.draw)
  }
  moveTo(tx: number, ty: number) {
    const duration = 200;
    const sx = this.x
    const sy = this.y
    this.x = tx
    this.y = ty
    const xSpeed = (tx - sx) / duration
    const ySpeed = (ty - sy) / duration
    const startTime = Date.now()
    const _move = () => {
      const t = Date.now() - startTime;
      const x = sx + xSpeed * t
      const y = sy + ySpeed * t
      this.x = x
      this.y = y
      if (t > duration) {
        this.x = tx;
        this.y = ty;
        return;
      }
      requestAnimationFrame(_move)
    }
    _move()
  }
}
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
}
const partials = []
// let time = null
let fontSizePercentage = 25
function updateCanvas() {
  //画事件文字
  const { width, height } = canvas.value
  ctx.beginPath();
  ctx.textBaseline = 'middle';
  var fontSize = (width * fontSizePercentage) / 100;
  ctx.font = fontSize + 'px Arial';
  // ctx.font = "500px 微软雅黑";
  ctx.textAlign = 'center';
  ctx.fillStyle = 'black';
  ctx.fillText(`${time.hours}:${time.minutes}:${time.seconds}`, width / 2, height / 2);
  let points = getPoint()
  clearCanvas()
  // console.log(points.length);
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i]
    let p = partials[i]
    if (!p) {
      p = new Particle();
      partials.push(p)
    }
    p.moveTo(x, y)
  }
  if (points.length < partials.length) {
    partials.splice(points.length, partials.length - points.length);
  }
}
function getPoint() {
  const point = []
  //拿到文字像素信息
  const { data } = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height);
  // console.log('像素点', data);
  let gap = 3
  for (let i = 0; i < canvas.value.width; i += gap) {
    for (let j = 0; j < canvas.value.height; j += gap) {
      const index = (i + j * canvas.value.width) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];
      if (r === 0 && g === 0 && b === 0 && a === 255) {
        point.push([i, j])
      }
    }
  }
  return point
}
function draw() {
  clearCanvas()
  updateCanvas()
  // p.draw()
  for (const p of partials) {
    p.draw()
  }
  requestAnimationFrame(draw)
}
const canvasbox = ref<HTMLDivElement>(null)
function initCanvasSize() {
  canvas.value.width = canvasbox.value.offsetWidth
  canvas.value.height = canvasbox.value.offsetHeight
  // canvas.value.width = canvasbox.value.offsetWidth * devicePixelRatio
  // canvas.value.height = canvasbox.value.offsetHeight * devicePixelRatio
}
let ctx: CanvasRenderingContext2D = null
let p = null
onMounted(() => {
  ctx = canvas.value?.getContext('2d', {
    willReadFrequently: true
  })
  p = new Particle();
  initCanvasSize()
  // p.draw()
  draw()
})

function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}
defineExpose({
  initCanvasSize,
});
</script>
<style scoped lang="scss"></style>