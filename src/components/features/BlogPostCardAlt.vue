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
    <div class="w-full md:w-1/3 aspect-video overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none relative group">
        <img
            :src="post.cover_image_url ?? 'https://f.pz.al/pzal/2025/08/11/26fc876190ff7.jpg'"
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
            <!-- 使用作者头像或默认头像 -->
            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
              <img 
                v-if="post.author?.avatar_url" 
                :src="post.author.avatar_url" 
                :alt="post.author.username" 
                class="w-full h-full object-cover"
                @error="handleAvatarError"
              />
              <icon v-else icon="mdi:user" class="w-4 h-4" />
            </div>

             <!-- 用户名链接到个人主页 -->
            <router-link 
              :to="`/author/${post.author?.username}`"
              class="font-medium text-base-content hover:text-primary transition-colors duration-200"
            >
              {{  post.author?.username || '未知作者' }}
            </router-link>
          </div>
          <div class="flex items-center space-x-3">
            <div class="flex items-center">
              <icon icon="mdi:clock-outline" class="w-4 h-4 mr-1 text-primary" />
              <span>{{ formatDate(post.created_at) }}</span>
            </div>
            <div v-if="post.click_count !== undefined" class="flex items-center">
              <icon icon="mdi:eye-outline" class="w-4 h-4 mr-1 text-primary" />
              <span>{{ post.click_count }} 次浏览</span>
            </div>
          </div>
        </div>

       <!-- 标签 -->
        <div v-if="post.tag_list && post.tag_list.length > 0" class="flex flex-wrap gap-2 mt-3">
          <div
              v-for="tag in post.tag_list"
              :key="tag"
              class="badge badge-sm sm:badge-md hover:scale-105 transition-all duration-200 cursor-pointer"
              :class="getTagStyle(tag)"
          >
            <icon icon="mdi:tag" class="w-3 h-3 mr-1" />{{ tag }}
          </div>
        </div>
        <div v-else class="text-sm text-base-content/50 mt-3 italic">暂无标签</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Post } from '@/types'
import { ref, computed } from 'vue'

const props = defineProps({
  post: {
    type: Object as PropType<Post>,
    required: true
  }
})
// 创建一个响应式变量来跟踪图片URL状态
const imageErrorOccurred = ref(false)
// 创建一个响应式变量来跟踪头像URL状态
const avatarErrorOccurred = ref(false)

// 计算属性，返回有效的图片URL
const validImageUrl = computed(() => {
  // 如果已经发生过错误，直接返回默认图片
  if (imageErrorOccurred.value) {
    return 'https://f.pz.al/pzal/2025/08/11/26fc876190ff7.jpg'
  }
  // 否则使用文章的封面图片或默认图片
  return props.post.cover_image_url ?? 'https://f.pz.al/pzal/2025/08/11/26fc876190ff7.jpg'
})

// 计算属性，返回有效的作者头像URL
const authorAvatarUrl = computed(() => {
  // 如果已经发生过头像错误，不显示头像
  if (avatarErrorOccurred.value) {
    return null
  }
  // 否则使用作者的头像URL
  return props.post.author?.avatar_url
})

// 图片错误处理
const handleImageError = (event: Event) => {
  console.log('图片加载失败，切换到默认图片')
  // 标记图片错误已发生
  imageErrorOccurred.value = true
  // 不再修改图片的src属性，而是通过计算属性来控制显示的图片
}

// 头像错误处理
const handleAvatarError = (event: Event) => {
  console.log('头像加载失败，切换到默认图标')
  // 标记头像错误已发生
  avatarErrorOccurred.value = true
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

// 为标签生成随机样式
const getTagStyle = (tag: string) => {
  // 定义几种不同的标签样式
  const styles = [
    'badge-secondary text-white',
    'badge-accent text-white',
    'badge-info text-white',
    'badge-success text-white',
    'badge-warning text-white',
    'badge-error text-white',
    'badge-ghost bg-base-200 text-base-content',
    'badge-outline border-primary text-primary',
    'badge-outline border-secondary text-secondary',
    'badge-outline border-accent text-accent'
  ];
  
  // 使用标签名称生成伪随机索引，确保同一标签始终有相同样式
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % styles.length;
  
  return styles[index];
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

/* 添加标签悬停效果 */
.badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 为标签添加轻微的旋转效果 */
.badge:hover {
  transform: translateY(-2px) rotate(2deg);
}

/* 为不同位置的标签添加轻微的旋转差异 */
.badge:nth-child(2n):hover {
  transform: translateY(-2px) rotate(-2deg);
}

.badge:nth-child(3n):hover {
  transform: translateY(-2px) rotate(1deg);
}

.badge:nth-child(4n):hover {
  transform: translateY(-2px) rotate(-1deg);
}
</style>