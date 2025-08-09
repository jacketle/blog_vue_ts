<template>
  <MainLayout>
    <!-- 图片画布容器 -->
    <div class="  canvas-container h-[70vh] w-full overflow-hidden relative mb-12">
      <!-- 图片轮播容器 -->
      <div class="carousel w-full h-full relative overflow-hidden">
        <div class="flex transition-transform duration-500 ease-in-out"
             :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
          <div v-for="(url, index) in loadedImages"
               :key="index"
               class="w-full h-full flex justify-center items-center flex-shrink-0">
            <img :src="url" alt="Banner" class="w-full h-full object-cover rounded-xl" />
          </div>
        </div>

        <!-- 左右切换按钮 -->
        <button @click="prevSlide" class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md z-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button @click="nextSlide" class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md z-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
    <div class="text-center mb-12">
      <!-- 标题使用 primary 主色，增强视觉焦点 -->
      <h1 class="text-5xl font-bold mb-6 text-primary">欢迎来到JacketleBlog社区</h1>
      <!-- 正文使用 base-content 配合透明度，确保暗色/亮色模式自适应 -->
      <p class="text-xl mb-8 text-base-content opacity-70">分享你的知识、经验和见解，与志同道合的人一起成长</p>
    </div>

  <div class="mb-8 flex justify-between items-center">
    <h2 class="text-3xl font-bold">最新帖子</h2>
    <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
        <input 
          v-model="searchKeyword"
          type="text" 
          placeholder="输入关键词搜索..." 
          class="input input-bordered w-full max-w-xs"
          @keyup.enter="handleSearch"
        />
        <button 
          class="btn btn-primary" 
          @click="handleSearch"
        >
          搜索
        </button>
        </div>
    <div class="tabs tabs-boxed">
      <a class="tab" :class="currentCategory === '' ? 'tab-active' : ''" @click="handleCategoryChange('')">全部</a>
      <a class="tab" :class="currentCategory === 'tech' ? 'tab-active' : ''" @click="handleCategoryChange('tech')">技术</a>
      <a class="tab" :class="currentCategory === 'chat' ? 'tab-active' : ''" @click="handleCategoryChange('chat')">杂谈</a>
      <a class="tab" :class="currentCategory === 'life' ? 'tab-active' : ''" @click="handleCategoryChange('life')">生活</a>
    </div>
    </div>
    </div>
    <div v-if="postStore.loading" class="text-center py-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="postStore.error" class="alert alert-error shadow-lg mb-6">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ postStore.error }}</span>
      </div>
    </div>

  <div v-else class="space-y-6">
    <BlogPostCardAlt
        v-for="post in filteredPosts"
        :key="post.id"
        :post="post"
    />
  </div>

  <!-- 分页控件 -->
  <div class="mt-12 flex justify-center" v-if="postStore.pagination.totalPages > 1">
    <div class="join">
      <button 
        class="join-item btn"
        :class="{ 'btn-disabled': postStore.pagination.currentPage === 1 }"
        @click="loadPage(postStore.pagination.currentPage - 1)"
      >
        «
      </button>
      
      <button 
        v-for="page in visiblePages" 
        :key="page" 
        class="join-item btn" 
        :class="{ 'btn-active': page === postStore.pagination.currentPage }"
        @click="typeof page === 'number' ? loadPage(page) : null"
      >
        {{ page }}
      </button>
      
      <button 
        class="join-item btn"
        :class="{ 'btn-disabled': postStore.pagination.currentPage === postStore.pagination.totalPages }"
        @click="loadPage(postStore.pagination.currentPage + 1)"
      >
        »
      </button>
    </div>
  </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { usePostStore } from '@/stores/postStore'
import BlogPostCardAlt from '@/components/features/BlogPostCardAlt.vue'
import MainLayout from '@/components/common/MainLayout.vue'

// 动态导入图片
const images = import.meta.glob('@/assets/homeImg/banner*.webp')
const imageArray = Object.values(images)
const loadedImages = ref<string[]>([])
// 加载帖子数据
const postStore = usePostStore()
// 添加分类状态管理
const currentCategory = ref('')

// 添加搜索相关状态
const searchKeyword = ref('')


// 计算可见的页码（简化版，显示当前页前后各2页）
const visiblePages = computed(() => {
  const totalPages = postStore.pagination.totalPages
  const currentPage = postStore.pagination.currentPage
  const delta = 2
  
  const range = []
  for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
    range.push(i)
  }
  
  if (currentPage - delta > 2) {
    range.unshift('...')
  }
  if (currentPage + delta < totalPages - 1) {
    range.push('...')
  }
  
  range.unshift(1)
  if (totalPages > 1) {
    range.push(totalPages)
  }
  
  return range
})

// 加载指定页码的数据
const loadPage = async (page: number) => {
  const filters: {
    category?: '' | 'tech' | 'chat' | 'life',
    isPublished?: boolean,
    search?: string
  } = {
    category: currentCategory.value as '' | 'tech' | 'chat' | 'life' || undefined,
    isPublished: true,
    search: searchKeyword.value || undefined
  }

  await postStore.loadPosts(page, filters)
  // window.scrollTo({ top: 1000, behavior: 'smooth' })
}
// 添加搜索处理方法
const handleSearch = () => {
  // 搜索时重置到第一页
  loadPage(1)
}

// 实现分类切换方法
// 修改分类切换方法，保留搜索关键词
const handleCategoryChange = async (category: string) => {
  currentCategory.value = category
  await loadPage(1)
}

// 修改计算属性：根据当前分类和搜索关键词过滤帖子，并确保只显示已发布的帖子
const filteredPosts = computed(() => {
  // 直接返回store中的数据，因为后端已经完成了过滤
  return postStore.posts || []
})

// 在onMounted中也需要添加过滤参数
onMounted(async () => {
  // 添加类型断言解决TypeScript类型推断问题
  const results = await Promise.all(imageArray.map(load => load())) as { default: string }[];
  // 直接使用类型断言后的数组
  loadedImages.value = results.map(img => img.default);
  // console.log('Loaded Images:', loadedImages.value)

  // 加载帖子数据
  try {
    // 添加空值检查
    if (!postStore.posts || postStore.posts.length === 0) {
      // 添加过滤参数，只加载已发布的帖子
      await postStore.loadPosts(1, { isPublished: true })
      console.log('帖子数据加载完成:', postStore.posts)
      if (!postStore.posts || postStore.posts.length === 0) {
        console.warn('没有获取到帖子数据')
      }
    }
  } catch (error) {
    console.error('加载帖子数据出错:', error)
  }
   // 设置浏览器标签页标题
  document.title = 'JacketleBlog社区 - 分享你的知识、经验和见解';
  // 启动自动播放
  startAutoPlay()

})

let intervalId: number | null = null
const isPaused = ref(false)
const currentIndex = ref(0)

const startAutoPlay = () => {
  intervalId = window.setInterval(() => {
    if (!isPaused.value && loadedImages.value.length > 0) {
      nextSlide()
    }
  }, 10000) // 每 10 秒切换一次
}
const stopAutoPlay = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const pauseAutoPlay = () => {
  isPaused.value = true
}

const resumeAutoPlay = () => {
  isPaused.value = false
}

const nextSlide = () => {
  const newIndex = (currentIndex.value + 1) % loadedImages.value.length
  currentIndex.value = newIndex
}

const prevSlide = () => {
  const newIndex = (currentIndex.value - 1 + loadedImages.value.length) % loadedImages.value.length
  currentIndex.value = newIndex
}


// 组件卸载时清除定时器
onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.carousel {
  display: flex;
  transition: transform 0.5s ease-in-out;
}
</style>