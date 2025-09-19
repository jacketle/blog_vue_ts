<template>
  <Header />
  <!-- 添加暗色模式背景 -->
  <div class="min-h-screen w-full px-4 py-8 md:px-6 lg:px-8 flex flex-col md:flex-row gap-6 bg-base-100 dark:bg-base-200">
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-12 w-full">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="mt-2 text-base-content/70">正在加载文章内容...</p>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="alert alert-error shadow-lg mb-6 w-full">
      <div>
        <icon icon="mdi:alert-circle" class="w-5 h-5 mr-2" />
        <span>文章不存在或加载失败</span>
      </div>
    </div>

    <!-- 正常内容 -->
    <div v-if="!loading && !error" class="w-full flex flex-col md:flex-row gap-6">

      <AuthorInfo
          :avatarUrl="post.author.avatar_url"
          :author="post.author.username"
          :bio="post.author.bio || '暂无简介'"
          :articleCount="post.author.post_count || 0"
          :commentCount="0"
          :tagCount="post.author.tag_count || 0"
          :is-station-master="post.author.is_station_master || false"
      />

      <!-- 中间内容（已修改宽度） -->
      <div class="flex-1 md:flex-[4] min-w-2">
        <!-- 标题 -->
        <h1 class="text-4xl sm:text-5xl font-extrabold mb-4 text-base-content dark:text-base-100 leading-tight">{{ post.title }}</h1>

        <!-- 作者与时间 -->
        <div class="flex flex-wrap items-center text-base-content dark:text-base-200 mb-6 text-sm sm:text-base">
          <div class="flex items-center mr-4">
            <icon icon="mdi:account" class="w-5 h-5 mr-2 text-primary" />
            <span class="font-medium">{{ post.author.username }}</span>
          </div>
          <div class="flex items-center mr-4">
            <icon icon="mdi:clock-outline" class="w-5 h-5 mr-2 text-primary" />
            <span class="font-medium">{{ formattedDate }}</span>
          </div>
          <div class="flex items-center">
            <icon icon="mdi:eye" class="w-5 h-5 mr-2 text-primary" />
            <span class="font-medium">{{ post.click_count || 0 }} 次阅读</span>
          </div>
        </div>

        <!-- 内容渲染 -->
        <div class="prose prose-lg dark:prose-invert max-w-none mx-auto mb-8 break-words">
          <div v-html="renderedContent"></div>
        </div>

        <!-- 标签 -->
        <div v-if="tagListArray.length > 0" class="flex flex-wrap gap-2 mb-6 p-4 bg-base-100 dark:bg-base-300 rounded-xl border border-base-200 dark:border-base-700">
          <div class="flex items-center text-base-content/70 text-sm mr-3">
            <icon icon="mdi:tag-multiple" class="w-4 h-4 mr-1 text-primary" />
            <span>标签：</span>
          </div>
          <span
              v-for="tag in tagListArray"
              :key="tag"
              class="badge badge-primary badge-outline text-sm sm:text-base hover:badge-primary hover:text-white transition-all duration-200 cursor-pointer"
          >
            <icon icon="mdi:tag" class="w-4 h-4 mr-1 text-primary" />{{ tag }}
          </span>
        </div>

        <!-- 内容过少提示 -->
        <div v-if="contentTooShort" class="alert alert-info shadow-lg mb-6">
          <div>
            <icon icon="mdi:information" class="w-5 h-5 mr-2" />
            <span>文章内容似乎有些简短，作者可能还在完善中...</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-base-300 dark:border-base-700">
          <!-- 左侧统计信息 -->
          <div class="flex items-center text-base text-base-content/80 font-medium mb-2 sm:mb-0">
            <icon icon="mdi:information-outline" class="w-5 h-5 mr-2 text-primary" />
            <span>最后更新：{{ formatDate(post.updated_at) }}</span>
          </div>
          
          <!-- 右侧操作按钮 -->
          <div class="flex flex-wrap gap-2">
            <button 
                v-if="authStore.user?.id === post.author.id || authStore.user?.is_station_master"
                @click="editPost"
                class="btn btn-outline btn-primary rounded-full shadow-md hover:shadow-lg transition-all duration-200"
            >
              <icon icon="mdi:pencil" class="w-5 h-5 mr-2" />
              编辑
            </button>
            <button 
                v-if="authStore.user?.id === post.author.id || authStore.user?.is_station_master"
                @click="deletePost"
                class="btn btn-outline btn-error rounded-full shadow-md hover:shadow-lg transition-all duration-200"
            >
              <icon icon="mdi:delete" class="w-5 h-5 mr-2" />
              删除
            </button>
            <button 
              @click="goBack" 
              class="btn btn-outline btn-primary rounded-full shadow-md hover:shadow-lg transition-all duration-200"
            >
              <icon icon="mdi:arrow-left" class="w-5 h-5 mr-2" />
              返回上一页
            </button>
          </div>
        </div>
      </div>


      <!-- 右侧目录 -->
      <div class="w-full md:w-64 flex-shrink-0 mt-8 md:mt-0">
        <!-- 目录容器 -->
        <div class="md:sticky md:top-24 bg-base-100 dark:bg-base-300 p-4 rounded-xl shadow-lg h-full md:max-h-[calc(100vh-120px)] overflow-hidden border border-base-200 dark:border-base-700">
          
          <!-- 标题 -->
          <h3 class="font-bold text-lg mb-4 p-3 border-b border-base-300 dark:border-base-700 bg-base-100 dark:bg-base-300 rounded-lg flex items-center">
            <Icon icon="mdi:book-open-page-variant" class="text-primary w-5 h-5 mr-2" />
            <span class="text-base-content">文章目录</span>
          </h3>

          <!-- 目录内容 -->
          <div class="overflow-y-auto pr-2 h-full pb-2">
            <nav class="space-y-2">
              <a
                  v-for="(item, index) in toc"
                  :key="index"
                  :href="'#' + item.id"
                  class="block text-sm transition-all duration-200 py-2.5 px-3.5 rounded-lg hover:bg-base-200 hover:text-primary relative group"
                  :class="[
                  { 'pl-8': item.depth === 3 },
                  { 'pl-6': item.depth === 2 },
                  { 'font-medium': item.depth === 2 },
                  { 'text-base-content/80': item.depth === 2 },
                  { 'text-base-content/70': item.depth === 3 }
                ]"
              >
                <!-- 连接线 -->
                <span 
                  v-if="index > 0" 
                  class="absolute left-1 top-0 bottom-0 w-px bg-base-300 dark:bg-base-600"
                ></span>
                
                <span class="toc-text flex items-center">
                  <!-- 深度图标（使用 Iconify） -->
                  <Icon
                      v-if="item.depth === 2"
                      icon="mdi:circle-medium"
                      class="text-primary/80 w-4 h-4 mr-2.5 flex-shrink-0"
                  />
                  <Icon
                      v-if="item.depth === 3"
                      icon="mdi:circle-small"
                      class="text-secondary/80 w-3.5 h-3.5 mr-3 flex-shrink-0"
                  />
                  
                  <!-- 文字内容 -->
                  <span class="truncate">
                    {{ item.text }}
                  </span>
                  
                  <!-- 悬停指示器 -->
                  <span class="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon icon="mdi:arrow-right-thin" class="text-primary w-4 h-4" />
                  </span>
                </span>
              </a>
              
              <!-- 无目录内容提示 -->
              <div v-if="toc.length === 0" class="text-center py-6 text-base-content/50 text-sm">
                <div class="flex flex-col items-center justify-center">
                  <Icon icon="mdi:file-document-outline" class="text-2xl mb-2" />
                  <span>暂无目录内容</span>
                </div>
              </div>
            </nav>
            
            <!-- 底部装饰 -->
            <div class="pt-2 border-t border-base-200 dark:border-base-700 mt-2">
              <div class="flex items-center text-xs text-base-content/40">
                <Icon icon="mdi:format-list-bulleted" class="mr-1" />
                <span>共 {{ toc.length }} 个项目</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer/>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '../utils/dateFormatter.ts'
import { processContent } from '../utils/contentProcessor'
import AuthorInfo from '@/components/features/AuthorInfo.vue'
import Header from "@/components/common/Header.vue";
import { postService } from '@/api/postService'
import { useAuthStore } from '@/stores/authStore' // 添加这行

// 添加inheritAttrs配置
defineOptions({
  inheritAttrs: false
})
// 状态管理 - 更新为正确的数据结构，与类型定义保持一致
const post = ref({
  id: 0,
  title: '',
  content: '',
  slug: '',
  created_at: '',
  updated_at: '',
  author: {
    id: 0,
    username: '',
    nickname: '',
    avatar_url: '',
    bio: '',
    post_count: 0,
    tag_count: 0,
    is_station_master: false
  },
  tag_list: [],
  tags: '',
  category: '',
  cover_image_url: '',
  is_published: false,
  click_count: 0  // 添加click_count字段
})

// 计算属性，将tag_list字符串转换为数组用于显示
const tagListArray = computed(() => {
  console.log('tag_list:', post.value.tag_list);
  console.log('tag_list类型:', typeof post.value.tag_list);
  console.log('是否为数组:', Array.isArray(post.value.tag_list));
  return post.value.tag_list || [];
});

// 判断内容是否过短
const contentTooShort = computed(() => {
  const contentText = post.value.content.replace(/<[^>]*>/g, '').trim();
  return contentText.length < 50; // 如果纯文本内容少于50个字符，认为内容过短
});

// 路由参数
const route = useRoute()
const router = useRouter()
const postSlug = route.params.postSlug as string
const loading = ref(true)
const error = ref(false)
const renderedContent = ref('')
const toc = ref([] as { id: string; text: string; depth: number }[])
// 状态管理
const authStore = useAuthStore(); // 添加这行获取authStore实

// 格式化时间 - 更新为使用created_at字段
const formattedDate = computed(() => formatDate(post.value.created_at))

// 真实 API 请求
const fetchPostBySlug = async (slug: string) => {
  console.log('请求的slug:', slug);
  try {
    // 直接获取响应以检查数据结构
    const response = await postService.getPostBySlug(slug);
    console.log('API响应:', response);
    console.log('响应类型:', typeof response);
    
    // 检查响应数据结构
    if (!response) {
      throw new Error('API未返回数据');
    }
    
    // 如果响应是对象且包含data属性，返回data
    if (typeof response === 'object' && response !== null && 'data' in response) {
      return (response as any).data;
    }
    
    // 否则直接返回响应
    return response;
  } catch (err) {
    console.error('获取文章失败:', err);
    console.error('错误详情:', {
      message: (err as Error).message,
      name: (err as Error).name,
      stack: (err as Error).stack
    });
    
    // 设置错误状态
    error.value = true;
    return null;
  }
};

// 编辑文章
const editPost = async () => {
  try {
    // 检查用户是否已登录
    const authStore = useAuthStore();
    if (!authStore.isLoggedIn) {
      router.push({ name: 'Login', query: { redirect: route.fullPath } });
      return;
    }
    
    // 检查用户是否有权限编辑此文章
    if (post.value.author.id !== authStore.user?.id && !authStore.user?.is_station_master) {
      alert('您没有权限编辑此文章');
      return;
    }
    
    // 执行导航
    await router.push(`/edit/${post.value.slug}`);
  } catch (error) {
    console.error('导航到编辑页面失败:', error);
    alert('无法导航到编辑页面，请重试');
  }
};

// 删除文章
const deletePost = async () => {
  // 检查文章数据是否存在
  if (!post.value || !post.value.slug) {
    alert('文章信息不完整');
    return;
  }
  
  // 检查用户是否已登录
  if (!authStore.isLoggedIn) {
    router.push({ name: 'Login', query: { redirect: route.fullPath } });
    return;
  }
  
  // 检查用户是否有权限删除此文章
  if (post.value.author.id !== authStore.user?.id && !authStore.user?.is_station_master) {
    alert('您没有权限删除此文章');
    return;
  }
  
  if (confirm(`确定要删除文章 "${post.value.title}" 吗？`)) {
    try {
      await postService.deletePostBySlug(post.value.slug);
      alert('文章删除成功');
      router.push('/');
    } catch (err) {
      console.error('删除失败:', err);
      alert('删除失败: ' + (err as Error).message);
    }
  }
};

// 返回上一页功能
const goBack = () => {
  router.go(-1);
};

// 加载文章数据
onMounted(async () => {
  const data = await fetchPostBySlug(postSlug)
  console.log('获取到的文章数据:', data);
  console.log('标签列表:', data?.tag_list);
  if (data && typeof data === 'object' && Object.keys(data).length > 0) {
    // 确保数据结构正确
    post.value = data;

    // 处理内容和目录
    const { html, toc: parsedToc } = processContent(post.value.content)
    renderedContent.value = html
    toc.value = parsedToc
    console.log('Generated TOC:', toc.value)

        // 修改检测逻辑：在处理后的内容中检测网易云音乐嵌入
    const hasNeteaseEmbed = html.includes('netease-embed');
     // 修改检测逻辑：在处理后的内容中检测B站视频嵌入
    const hasBilibiliEmbed = html.includes('player.bilibili.com') && html.includes('lazy-load');
    // 仅在有网易云音乐嵌入时加载播放器脚本

    if (hasNeteaseEmbed) {
      // 动态加载 APlayer CSS
      const apCss = document.createElement('link')
      apCss.rel = 'stylesheet'
      apCss.href = 'https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css'
      document.head.appendChild(apCss)
    
      // 动态加载 APlayer JS
      const apScript = document.createElement('script')
      apScript.src = 'https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js'
      apScript.onload = () => {
        // 动态加载 MetingJS
        const metingScript = document.createElement('script')
        metingScript.src = 'https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js'
        metingScript.onload = () => {
          // 使用nextTick确保DOM更新完成后再处理
nextTick(() => {
  document.querySelectorAll('.netease-embed').forEach(el => {
    const meting = el.querySelector('meting-js')
    const placeholder = el.querySelector('.netease-placeholder')
    if (meting && placeholder) {
      // 类型断言为HTMLElement以访问style属性
// 将报错的行替换为以下代码：
(meting as HTMLElement).style.display = 'block' as const;
(placeholder as HTMLElement).style.display = 'none' as const;
    }
  })
})
        }
        document.head.appendChild(metingScript)
      }
      document.head.appendChild(apScript)
    }


    // 新增：B站视频懒加载条件初始化
    if (hasBilibiliEmbed) {
      // 初始化懒加载观察器
      nextTick(() => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const iframe = entry.target as HTMLIFrameElement
              const src = iframe.dataset.src
              if (src) {
                iframe.src = decodeURIComponent(src)
              }
              observer.unobserve(iframe)
            }
          })
        }, {
          rootMargin: '0px',
          threshold: 0.1
        })

        // 懒加载 B 站视频
        document.querySelectorAll('iframe.lazy-load').forEach(iframe => {
          const iframeEl = iframe as HTMLIFrameElement
          iframeEl.src = ''
          observer.observe(iframeEl)
        })
      })
    }
  }else {
    console.warn('未获取到有效的文章数据');
    error.value = true
  }
  loading.value = false
  
 if (post.value && post.value.title) {
    document.title = `${post.value.title} - JacketleBlog社区`;
  } else {
    document.title = '文章详情 - JacketleBlog社区';
  }
})
</script>

<style scoped>
/* Base styling for aplayer */
.aplayer {
  padding: 8px 12px;
}

/* Scrollbar styling for TOC */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

/* TOC text transition */
.toc-text {
  transition: color 0.3s ease;
}

/* 动态樱花飘落 */
@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
  100% { transform: translateY(0) rotate(360deg); }
}
.animate-float {
  animation: float 3s infinite ease-in-out;
}

/* 淡入动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

/* 霓虹脉冲动画 */
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
}
.animate-pulse {
  animation: pulse 1.5s infinite ease-in-out;
}
</style>