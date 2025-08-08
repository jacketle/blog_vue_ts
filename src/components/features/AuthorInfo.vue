//src/components/common/AuthorInfo.vue
<template>
  <div class="md:w-72 flex-shrink-0 pr-6 mb-6 md:mb-0">
    <div class="sticky top-24 bg-base-100 p-6 rounded-2xl shadow-lg overflow-hidden border border-base-200">
      <!-- 二次元风格头像 + 作者信息（居中） -->
      <div class="flex flex-col items-center mb-6">
        <!-- 头像 -->
        <div class="mb-4 relative">
          <div class="avatar">
            <div class="w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary/20 ring-offset-base-100 ring-offset-4 relative z-10 transition-all duration-300 hover:ring-primary/40">
              <img :src="`${avatarUrl}`" alt="Author Avatar" class="object-cover" />
            </div>
          </div>
          <!-- 装饰性元素 -->
          <div class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary/10 z-0"></div>
        </div>

        <!-- 作者信息 -->
        <h3 class="font-bold text-xl mb-2 text-center text-base-content">{{ author }}</h3>
        <div class="prose prose-sm text-base-content/70 max-w-xs text-center leading-relaxed">
          <p>{{ bio }}</p>
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
            <div class="text-lg font-bold text-primary">{{ articleCount }}</div>
          </div>
          <div class="flex flex-col items-center p-3 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors duration-300">
          
  <div class="text-xs font-medium text-base-content/60 mb-1">评论</div>
            <div class="text-lg font-bold text-primary">{{ commentCount }}</div>
          </div>
          <div class="flex flex-col items-center p-3 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors duration-300">
            <div class="text-xs font-medium text-base-content/60 mb-1">标签</div>
            <div class="text-lg font-bold text-primary">{{ tagCount }}</div>
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
import { Icon } from '@iconify/vue';
import { ref } from 'vue'

// 定义 props 的类型
interface AuthorInfoProps {
  author: string
  bio?: string
  articleCount?: number
  commentCount?: number
  tagCount?: number
  avatarUrl?: string
}

// 设置默认值
const props = withDefaults(defineProps<AuthorInfoProps>(), {
  bio: '技术博客作者，专注于前端开发与开源项目。',
  articleCount: 30,
  commentCount: 150,
  tagCount: 20,
  avatarUrl: ''

})

// 解构 props 用于模板使用
const {
  author,
  bio,
  articleCount,
  commentCount,
  tagCount,
  avatarUrl
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