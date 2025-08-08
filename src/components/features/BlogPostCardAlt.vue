<template>
    <!-- <div>
    调试信息
    <div v-if="true"> 
      <pre>{{ JSON.stringify(post, null, 2) }}</pre>
    </div>
    </div>
  <div>1545d64qw5ew4w5q4d6ada5d6w8e7wq968r45a64s6d5</div> -->
  <div
      class="card bg-base-100 shadow-xl rounded-xl overflow-hidden flex flex-col md:flex-row w-full mb-6
           hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out"
  >
    <!-- 左侧：图片区域 -->
    <div class="w-full md:w-1/3 aspect-video overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none
               relative group">
        <img
            :src="post.cover_image_url ?? 'https://via.placeholder.com/600x400?text=暂无图片'"
            :alt="post.title"
            class="w-full h-full object-cover"
            @error="handleImageError"
        />
      <!-- 悬浮光效 -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100
                 transition-opacity duration-300"></div>
      <!-- 右上角精选徽章 -->
      <div v-if="post.isFeatured" class="absolute top-4 right-4 badge badge-secondary badge-lg
                  text-white font-bold px-4 py-1.5 rounded-xl shadow-md transform -translate-y-1/2
                  animate-pulse">
        <icon icon="mdi:star" class="w-4 h-4 mr-1 text-warning" />精选
      </div>
    </div>

    <!-- 右侧：内容区域 -->
    <div class="p-4 sm:p-6 flex flex-col justify-between flex-grow w-full md:w-2/3">
      <div>
        <!-- 标题 -->
        <h2 class="text-xl sm:text-2xl font-bold mb-3 text-primary">
          <!--          :href="`/post/${post.slug}`"-->
          <router-link
              :to="`/post/${post.slug}`"
              class="hover:underline transition-colors"
          >
            {{ post.title || '无标题' }}
          </router-link>
        </h2>

        <!-- 内容摘要（带深色背景 + 4 行截断 + 首行缩进） -->
        <div class="bg-base-200 rounded-lg p-4 text-base text-base-content/70 line-clamp-4 relative">
          <span class="absolute left-4 top-0 -translate-y-1/2">　　</span>
          <span class="ml-8">{{ post.content_summary || '暂无内容摘要' }}</span>
        </div>

        <!-- 作者 & 时间 -->
        <div class="flex items-center justify-between text-sm text-base-content/60 mb-4">
          <div class="flex items-center space-x-2">
            <!-- 使用daisyui和iconify美化作者信息 -->
            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <icon icon="mdi:user" class="w-4 h-4" />
            </div>
            <span class="font-medium text-base-content hover:text-primary transition-colors duration-200">
              {{  post.author?.username || '未知作者' }}
            </span>
          </div>
          <div class="flex items-center">
            <icon icon="mdi:clock-outline" class="w-4 h-4 mr-1 text-primary" />
            <span>{{ formatDate(post.created_at)  }}</span>
          </div>
        </div>
</div>
       <!-- 标签 -->
        <div v-if="post.tag_list && post.tag_list.length > 0" class="flex flex-wrap gap-2 mt-2">
          <div
              v-for="tag in post.tag_list"
              :key="tag"
              class="badge badge-outline badge-sm hover:bg-base-200 transition-colors text-base-content hover:text-primary"
          >
            <icon icon="mdi:tag" class="w-3 h-3 mr-1 text-primary" />{{ tag }}
          </div>
        </div>
        <div v-else class="text-sm text-base-content/50 mt-2">暂无标签</div>
      </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Post } from '@/types'
import { ref } from 'vue'

defineProps({
  post: {
    type: Object as PropType<Post>,
    required: true
  }
})

// 图片错误处理
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/600x400?text=图片加载失败'
}

// 格式化时间
function formatDate(dateString: string) {
  if (!dateString) return '未知时间'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return '无效时间'
  }
}
</script>

<style scoped>
/* 4 行截断 */
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: 7rem; /* 4 行 × 3rem 行高 */
}

/* 移动端优化 */
@media (max-width: 768px) {
  .card {
    flex-direction: column;
  }

  .card > div {
    width: 100% !important;
  }

  .card > div:first-child {
    height: 200px;
    border-radius: 0.5rem 0.5rem 0 0 !important;
  }
}
</style>