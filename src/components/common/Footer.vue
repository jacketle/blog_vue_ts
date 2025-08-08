<template>
  <footer class="footer bg-base-200 text-base-content p-10">
    <!-- 左侧内容：版权信息 -->
    <div class="flex-1">
      <p>© {{ currentYear }} My Blog. All rights reserved.</p>
    </div>
    <div class="blog-running-time">
      My Blog Has Been Running For：{{ runningTime }} (*๓´╰╯`๓)
    </div>

    <!-- 右侧内容：社交媒体链接 -->
    <div class="flex-1 flex justify-end gap-4">
      <!-- GitHub -->
      <a
          href="https://github.com/jacketle"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-ghost btn-circle"
          aria-label="GitHub"
      >
        <Icon icon="mdi:github" width="20" height="20"/>
      </a>

      <!-- Gitee -->
      <a
          href="https://gitee.com/jacketle"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-ghost btn-circle"
          aria-label="Gitee"
      >
        <Icon icon="simple-icons:gitee" width="20" height="20"/>
      </a>

      <!-- Bilibili -->
      <a
          href="https://space.bilibili.com/youruid"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-ghost btn-circle"
          aria-label="Bilibili"
      >
        <Icon icon="mingcute:bilibili-line" width="20" height="20"/>
      </a>

      <!-- Email -->
      <a
          href="mailto:you@example.com"
          class="btn btn-ghost btn-circle"
          aria-label="Email"
      >
        <Icon icon="mdi:email" width="20" height="20"/>
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {Icon} from '@iconify/vue';
import { onMounted, onBeforeUnmount } from 'vue'

// 博客起始时间（请根据你的实际情况修改）
const startTime = new Date('2025-08-01T00:00:00').getTime()

// 当前运行时间（动态显示）
const runningTime = ref<string>('')

// 计算时间差
function calculateDuration(ms: number): {
  years: number
  days: number
  hours: number
  minutes: number
  seconds: number
} {
  const second = 1000
  const minute = second * 60
  const hour = minute * 60
  const day = hour * 24
  const year = day * 365

  return {
    years: Math.floor(ms / year),
    days: Math.floor((ms % year) / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor((ms % hour) / minute),
    seconds: Math.floor((ms % minute) / second),
  }
}

// 格式化输出字符串
function formatDuration(duration: {
  years: number
  days: number
  hours: number
  minutes: number
  seconds: number
}): string {
  return `${duration.years}年${duration.days}天${duration.hours}时${duration.minutes}分${duration.seconds}秒`
}

// 更新时间
function updateTimer(): void {
  const now = new Date().getTime()
  const diff = now - startTime
  const duration = calculateDuration(diff)
  runningTime.value = formatDuration(duration)
}

// 定时器引用
let interval: number | null = null

onMounted(() => {
  updateTimer() // 初始化一次
  interval = setInterval(updateTimer, 1000)
})

onBeforeUnmount(() => {
  if (interval !== null) {
    clearInterval(interval)
  }
})
// 动态显示当前年份
const currentYear = ref(new Date().getFullYear());
</script>
<style scoped>
.blog-running-time {
  font-size: 14px;
  color: #666;
  margin: 10px;
  text-align: center;
}
</style>