<template>
    <!-- bg-violet-200 -->
    <div class="mx-[6vw] h-[32vw] flex justify-between text-center text-[20vw] text-white">
      <template v-for="(item, index) in Object.values(time)" :key="index">
        <div class=" box-border flex-3 text-shadow" v-if="index > 3">
          <span class=" align-middle">{{ item }}</span>
        </div>
        <div v-if="6 > index && index > 3" class="box-border flex-1 text-shadow">
          <span class="">:</span>
        </div>
      </template>
      <div class="p-[2vw] text-[4vw] flex-1 text-end"
        style="text-orientation: upright; writing-mode: vertical-rl; letter-spacing: 0.5vw">
        <span class=" px-[0.5vw] py-[1vw] bg-red-500 rounded-[1vw]">{{ timeFrame }}</span>
      </div>
    </div>
</template>

<script setup lang="ts">
import useTime from '@/hooks/useTime'
const { time, timeFrame } = useTime()
</script>
<style lang="scss" scoped>
</style>