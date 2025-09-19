<template>
  <div class="md:w-72 flex-shrink-0 pr-6 mb-6 md:mb-0">
    <div class="sticky top-24 bg-base-100 p-6 rounded-2xl shadow-lg overflow-hidden border border-base-200">
      <!-- 二次元风格头像 + 作者信息（居中） -->
      <div class="flex flex-col items-center mb-6">
        <!-- 头像 -->
        <div class="mb-4 relative">
          <div class="avatar placeholder">
            <div class="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 relative z-10 transition-all duration-300 hover:ring-primary/40 bg-gradient-to-br from-purple-400 to-pink-500 text-white flex items-center justify-center text-2xl font-bold">
              <img v-if="avatarUrl" :src="avatarUrl" alt="Author Avatar" class="object-cover rounded-full w-full h-full" />
              <div v-else class="placeholder-avatar">{{ author?.charAt(0).toUpperCase() }}</div>
            </div>
          </div>
          <!-- 装饰性元素 -->
          <div class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary/10 z-0"></div>
        </div>

        <!-- 作者信息 -->
        <h3 class="font-bold text-xl mb-2 text-center text-base-content">{{ author }}</h3>
        <div class="flex flex-wrap items-center justify-center gap-2 mb-3">
          <div v-if="isStationMaster" class="flex items-center bg-gradient-to-r from-amber-400 to-yellow-500 text-yellow-900 font-bold px-3 py-1 rounded-full">
            <Icon icon="mdi:crown" class="w-4 h-4 mr-1" />
            <span class="text-xs">站长</span>
            <Icon icon="mdi:shield-check" class="w-4 h-4 ml-1" />
          </div>
          <span v-else class="badge badge-primary badge-outline badge-sm">普通用户</span>
        </div>
        <div class="prose prose-sm text-base-content/70 max-w-xs text-center leading-relaxed">
          <p>{{ bio || '这个用户很懒，还没有填写个人简介' }}</p>
        </div>
      </div>

      <!-- 创作数据 -->
      <div class="mb-6">
        <h4 class="font-semibold mb-4 text-center text-base-content/80 relative inline-block mx-auto">
          <span class="relative z-10 bg-base-100 px-2">创作数据</span>
          <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-base-200"></div>
          </div>
        </h4>
        <div class="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto">
          <div class="flex flex-col items-center p-3 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors duration-300">
            <div class="text-xs font-medium text-base-content/60 mb-1">文章</div>
            <div class="text-lg font-bold text-primary">{{ articleCount || 0 }}</div>
          </div>
          <div class="flex flex-col items-center p-3 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors duration-300">
            <div class="text-xs font-medium text-base-content/60 mb-1">评论</div>
            <div class="text-lg font-bold text-primary">{{ commentCount || 0 }}</div>
          </div>
          <div class="flex flex-col items-center p-3 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors duration-300">
            <div class="text-xs font-medium text-base-content/60 mb-1">标签</div>
            <div class="text-lg font-bold text-primary">{{ tagCount || 0 }}</div>
          </div>
        </div>
      </div>

      <!-- 社交链接 -->
      <div class="flex justify-center space-x-4 mb-6">
        <a href="#" class="btn btn-sm btn-circle btn-ghost text-base-content/60 hover:text-primary hover:bg-primary/10 transition-colors duration-300" title="GitHub(还没弄)">
          <Icon icon="mdi:github" class="h-5 w-5" />
        </a>
        <a href="#" class="btn btn-sm btn-circle btn-ghost text-base-content/60 hover:text-primary hover:bg-primary/10 transition-colors duration-300" title="邮箱(懒QWQ)">
          <Icon icon="mdi:email-outline" class="h-5 w-5" />
        </a>
        <a href="#" class="btn btn-sm btn-circle btn-ghost text-base-content/60 hover:text-primary hover:bg-primary/10 transition-colors duration-300" title="关于(懒QWQ)">
          <Icon icon="mdi:information-outline" class="h-5 w-5" />
        </a>
      </div>

      <!-- 版权信息 -->
      <div class="pt-4 border-t border-base-200 text-center">
        <p class="text-sm text-base-content/50">© {{ new Date().getFullYear() }} {{ author }}. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

// 定义 props 的类型
interface AuthorInfoProps {
  author: string
  bio?: string
  articleCount?: number
  commentCount?: number
  tagCount?: number
  avatarUrl?: string
  isStationMaster?: boolean
}

// 设置默认值
const props = withDefaults(defineProps<AuthorInfoProps>(), {
  bio: '',
  articleCount: 0,
  commentCount: 0,
  tagCount: 0,
  avatarUrl: '',
  isStationMaster: false
})

// 解构 props 用于模板使用
const {
  author,
  bio,
  articleCount,
  commentCount,
  tagCount,
  avatarUrl,
  isStationMaster
} = props
</script>

<style scoped>
/* 移动端专用样式 */
@media (max-width: 768px) {
  .stat {
    padding: 0.5rem 0;
    border-bottom: 1px solid #e0e0e0;
  }
  .stat:last-child {
    border-bottom: none;
  }
}
</style>