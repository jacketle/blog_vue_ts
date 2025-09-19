<template>
  <MainLayout>
    <div class="text-center mb-8 sm:mb-12">
      <h1 class="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-primary">文章归档</h1>
      <p class="text-base sm:text-lg text-base-content opacity-70">按时间顺序查看所有已发布的文章</p>
    </div>

    <div class="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <h2 class="text-xl sm:text-2xl font-bold">所有文章 (按时间倒序)</h2>
      <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div class="flex items-center space-x-2">
          <input 
            v-model="searchKeyword"
            type="text" 
            placeholder="输入关键词搜索..." 
            class="input input-bordered w-full sm:w-auto min-w-[200px]"
            @keyup.enter="handleSearch"
          />
          <button 
            class="btn btn-primary whitespace-nowrap" 
            @click="handleSearch"
          >
            搜索
          </button>
        </div>
        <div class="tabs tabs-boxed overflow-x-auto">
          <a class="tab tab-sm sm:tab-md whitespace-nowrap" :class="currentCategory === '' ? 'tab-active' : ''" @click="handleCategoryChange('')">全部</a>
          <a class="tab tab-sm sm:tab-md whitespace-nowrap" :class="currentCategory === 'tech' ? 'tab-active' : ''" @click="handleCategoryChange('tech')">技术</a>
          <a class="tab tab-sm sm:tab-md whitespace-nowrap" :class="currentCategory === 'chat' ? 'tab-active' : ''" @click="handleCategoryChange('chat')">杂谈</a>
          <a class="tab tab-sm sm:tab-md whitespace-nowrap" :class="currentCategory === 'life' ? 'tab-active' : ''" @click="handleCategoryChange('life')">生活</a>
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

    <!-- 时间线形式的文章归档 -->
    <div v-else class="relative">
      <!-- 时间线主轴 -->
      <div class="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-primary/30 transform -translate-x-1/2 rounded-full"></div>
      
      <!-- 按年份分组显示 -->
      <div v-for="(yearGroup, year) in groupedPostsByYear" :key="year" class="mb-12 sm:mb-16">
        <!-- 年份标题 -->
        <div class="flex items-center mb-6 sm:mb-8">
          <div class="absolute left-4 sm:left-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base sm:text-lg z-10 transform -translate-x-1/2 shadow-lg">
            {{ year }}
          </div>
          <div class="ml-12 sm:ml-20 text-2xl sm:text-3xl font-bold text-primary border-b-2 border-primary/20 pb-1 sm:pb-2">{{ year }}年</div>
        </div>
        
        <!-- 该年份下的月份分组 -->
        <div v-for="(monthGroup, month) in yearGroup" :key="month" class="mb-8 sm:mb-10">
          <!-- 月份标题 -->
          <div class="flex items-center mb-4 sm:mb-6 ml-12 sm:ml-20">
            <div class="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-secondary mr-2 sm:mr-3"></div>
            <div class="text-lg sm:text-xl font-semibold text-base-content/90">{{ getMonthName(month) }}</div>
          </div>
          
          <!-- 该月份下的文章列表 -->
          <div class="space-y-5 sm:space-y-6 ml-12 sm:ml-20">
            <div 
              v-for="post in monthGroup" 
              :key="post.id"
              class="relative flex items-start group"
            >
              <!-- 时间点 -->
              <div class="absolute left-4 sm:left-8 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary border-4 border-white shadow-lg transform -translate-x-1/2"></div>
              
          <!-- 文章内容 -->
  <div class="ml-12 sm:ml-20 flex-1 bg-base-100 rounded-xl shadow-md p-4 sm:p-6 transition-all duration-300 group-hover:shadow-lg border border-base-200 hover:border-primary/30 overflow-hidden">
    <!-- 采用灵活布局：图片和文字可以左右或上下排列 -->
    <div class="flex flex-col md:flex-row gap-4">
      <!-- 封面图片区域（仅当有图片时显示） -->
      <div v-if="post.cover_image_url" class="md:w-1/3 flex-shrink-0">
        <div class="aspect-video overflow-hidden rounded-lg relative group/image">
          <img
            :src="post.cover_image_url || 'https://f.pz.al/pzal/2025/08/11/26fc876190ff7.jpg'"
            :alt="post.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-105"
            @error="handleImageError"
          />
          <!-- 悬浮光效 -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
      
      <!-- 文字内容区域 -->
      <div class="flex-1">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-3">
          <router-link 
            :to="`/post/${post.slug}`" 
            class="text-lg sm:text-xl font-bold text-primary hover:underline flex-1"
          >
            {{ post.title }}
          </router-link>
          <div class="text-xs sm:text-sm font-medium text-base-content/80 whitespace-nowrap bg-base-200 px-2 py-1 sm:px-3 sm:py-1 rounded-full self-start">
            {{ formatDate(post.created_at) }}
          </div>
        </div>
        
        <!-- 添加作者信息显示 -->
        <div class="mt-2 flex items-center space-x-2">
          <div class="flex items-center text-xs sm:text-sm text-base-content/70">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>作者: {{ post.author?.username || '未知作者' }}</span>
          </div>
        </div>
        
        <div class="mt-3 sm:mt-4 flex flex-wrap items-center gap-1 sm:gap-2">
          <span class="badge badge-outline badge-sm sm:badge-md badge-primary">
            {{ getCategoryName(post.category) }}
          </span>
          <div v-if="post.tag_list && post.tag_list.length > 0" class="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
            <span 
              v-for="tag in post.tag_list" 
              :key="tag" 
              class="badge badge-sm sm:badge-md hover:scale-105 transition-transform duration-200 cursor-pointer"
              :class="getTagStyle(tag)"
            >
              <icon icon="mdi:tag" class="w-3 h-3 mr-1" />{{ tag }}
            </span>
          </div>
          <div v-else class="text-xs sm:text-sm text-base-content/50 italic">暂无标签</div>
        </div>
        
        <!-- 优化文章摘要显示，解决边框显示不全问题 -->
        <div class="mt-3 sm:mt-4 text-base-content/90 leading-relaxed">
          <div class="line-clamp-3 text-sm sm:text-base whitespace-pre-line break-words" v-html="sanitizeContentSummary(post.content_summary)"></div>
        </div>
        
        <!-- 新的内容预览方案：显示文章统计信息和互动元素 -->
        <div class="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 border-t border-base-200 gap-2">
          <div class="flex items-center space-x-3 sm:space-x-4">
            <div class="flex items-center text-xs sm:text-sm text-base-content/70">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{{ post.click_count || 0 }} 浏览</span>
            </div>
          </div>
          
          <router-link 
            :to="`/post/${post.slug}`" 
            class="btn btn-xs sm:btn-sm btn-primary rounded-full px-3 py-1 sm:px-4 sm:py-1 h-auto min-h-0 text-xs sm:text-sm font-medium flex items-center whitespace-nowrap"
          >
            <span>查看详情</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 没有找到文章时的提示 -->
      <div v-if="Object.keys(groupedPostsByYear).length === 0" class="text-center py-8 sm:py-12">
        <div class="text-base sm:text-lg text-base-content/60">暂无符合条件的文章</div>
      </div>
    </div>

    <!-- 分页控件 -->
    <div class="mt-8 sm:mt-12 flex justify-center" v-if="postStore.pagination.totalPages > 1">
      <div class="join">
        <button 
          class="join-item btn btn-sm sm:btn-md"
          :class="{ 'btn-disabled': postStore.pagination.currentPage === 1 }"
          @click="loadPage(postStore.pagination.currentPage - 1)"
        >
          «
        </button>
        
        <button 
          v-for="page in visiblePages" 
          :key="page" 
          class="join-item btn btn-sm sm:btn-md" 
          :class="{ 'btn-active': page === postStore.pagination.currentPage }"
          @click="typeof page === 'number' ? loadPage(page) : null"
        >
          {{ page }}
        </button>
        
        <button 
          class="join-item btn btn-sm sm:btn-md"
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
import { ref, onMounted, computed } from 'vue'
import { usePostStore } from '@/stores/postStore'
import MainLayout from '@/components/common/MainLayout.vue'
import { useRouter } from 'vue-router'

// 加载帖子数据
const postStore = usePostStore()
const router = useRouter()

// 添加分类状态管理
const currentCategory = ref('')

// 添加搜索相关状态
const searchKeyword = ref('')

// 图片错误处理
const handleImageError = (event: Event) => {
  const imgElement = event.target as HTMLImageElement
  imgElement.src = 'https://f.pz.al/pzal/2025/08/11/26fc876190ff7.jpg'
}

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

// 将文章按年份和月份分组
const groupedPostsByYear = computed(() => {
  const groups: Record<string, Record<string, any[]>> = {}
  
  // 获取过滤后的文章
  const posts = filteredPosts.value || []
  
  posts.forEach(post => {
    const date = new Date(post.created_at)
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    
    if (!groups[year]) {
      groups[year] = {}
    }
    
    if (!groups[year][month]) {
      groups[year][month] = []
    }
    
    groups[year][month].push(post)
  })
  
  // 按年份倒序排列
  return Object.keys(groups)
    .sort((a, b) => parseInt(b) - parseInt(a))
    .reduce((obj, key) => {
      // 按月份倒序排列
      const sortedMonths = Object.keys(groups[key])
        .sort((a, b) => parseInt(b) - parseInt(a))
        .reduce((monthObj, monthKey) => {
          monthObj[monthKey] = groups[key][monthKey]
          return monthObj
        }, {} as Record<string, any[]>)
      
      obj[key] = sortedMonths
      return obj
    }, {} as Record<string, Record<string, any[]>>)
})

// 获取月份名称
const getMonthName = (month: string) => {
  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ]
  return monthNames[parseInt(month) - 1]
}

// 获取分类名称
const getCategoryName = (category: string) => {
  const categoryMap: Record<string, string> = {
    'tech': '技术',
    'chat': '杂谈',
    'life': '生活'
  }
  return categoryMap[category] || category
}

// 格式化时间
const formatDate = (dateString: string) => {
  if (!dateString) return '未知时间'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return '无效时间'
  }
}

// 加载指定页码的数据，按创建时间倒序排列
const loadPage = async (page: number) => {
  const filters: {
    category?: '' | 'tech' | 'chat' | 'life',
    isPublished?: boolean,
    search?: string,
    ordering?: '-created_at' // 按创建时间倒序排列
  } = {
    category: currentCategory.value as '' | 'tech' | 'chat' | 'life' || undefined,
    isPublished: true,
    search: searchKeyword.value || undefined,
    ordering: '-created_at' // 按创建时间倒序排列
  }

  await postStore.loadPosts(page, filters)
}

// 添加搜索处理方法
const handleSearch = () => {
  // 搜索时重置到第一页
  loadPage(1)
}

// 实现分类切换方法
const handleCategoryChange = async (category: string) => {
  currentCategory.value = category
  await loadPage(1)
}

// 修改计算属性：根据当前分类和搜索关键词过滤帖子，并确保只显示已发布的帖子
const filteredPosts = computed(() => {
  // 直接返回store中的数据，因为后端已经完成了过滤
  return postStore.posts || []
})

// 内容清理函数，解决特殊字符导致的渲染问题
const sanitizeContentSummary = (content: string) => {
  if (!content) return '';
  
  // 移除可能导致布局问题的特殊字符
  return content
    .replace(/\u00A0/g, ' ')  // 替换不间断空格
    .replace(/\s+/g, ' ')     // 合并多个空白字符
    .trim();
};

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
// 在onMounted中加载数据
onMounted(async () => {
  // 设置浏览器标签页标题
  document.title = '文章归档 - JacketleBlog社区'
  
  // 加载帖子数据，按创建时间倒序排列
  try {
    await postStore.loadPosts(1, { 
      isPublished: true,
      ordering: '-created_at' // 按创建时间倒序排列
    })
  } catch (error) {
    console.error('加载帖子数据出错:', error)
  }
})
</script>

<style scoped>
/* 3 行截断 */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式优化 */
@media (max-width: 640px) {
  .ml-12 {
    margin-left: 3rem;
  }
  
  .sm\:ml-20 {
    margin-left: 3rem;
  }
}

/* 在小屏幕设备上，始终使用上下布局 */
@media (max-width: 767px) {
  .md\:flex-row {
    flex-direction: column !important;
  }

}
</style>