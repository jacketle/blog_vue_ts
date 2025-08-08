<template>
  <div class="flex flex-col items-center justify-center h-screen bg-base-200">
    <h1 class="text-6xl font-bold text-error">404</h1>
    <p class="mt-4 text-lg">抱歉，您访问的页面不存在。</p>
    <router-link to="/" class="btn btn-primary mt-6">返回首页</router-link>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onUnmounted } from 'vue'

const router = useRouter()
let timer = null

// 设置定时器
timer = setTimeout(() => {
  router.push('/')
}, 3000)

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>