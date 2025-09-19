<template>
  <MainLayout>
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="errorMessage" class="alert alert-error shadow-lg mb-6">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>
      </div>

      <!-- 用户信息展示 -->
      <div v-else class="flex flex-col lg:flex-row gap-8">
        <!-- 作者信息卡片 -->
        <AuthorInfo 
          :author="authorProfile.username"
          :bio="authorProfile.bio"
          :article-count="authorProfile.post_count"
          :tag-count="authorProfile.tag_count"
          :avatar-url="authorProfile.avatar_url"
          :is-station-master="authorProfile.is_station_master"
        />

        <!-- 帖子列表 -->
        <div class="flex-grow">
          <div class="bg-base-100 rounded-2xl shadow-lg p-6 mb-6 border border-base-200">
            <h2 class="text-2xl font-bold text-base-content mb-6">作者的帖子</h2>
            
            <!-- 帖子列表 -->
            <div v-if="authorPosts.length > 0" class="space-y-6">
              <BlogPostCardAlt
                v-for="post in authorPosts"
                :key="post.id"
                :post="post"
                @click="goToPostDetail(post.slug)"
                class="cursor-pointer hover:shadow-md transition-shadow duration-300"
              />
            </div>
            
            <!-- 无帖子提示 -->
            <div v-else class="text-center py-12">
              <div class="text-5xl mb-4">📝</div>
              <p class="text-base-content/70">该作者还没有发布任何帖子</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/components/common/MainLayout.vue'
import AuthorInfo from '@/components/features/AuthorInfo.vue'
import BlogPostCardAlt from '@/components/features/BlogPostCardAlt.vue'
import { authService } from '@/api/authService'
import { postService } from '@/api/postService'
import type { User } from '@/types/userTypes'
import type { Post } from '@/types/postTypes'

// 路由和状态管理
const route = useRoute()
const router = useRouter()

// 响应式状态
const isLoading = ref(true)
const errorMessage = ref('')

// 作者信息
const authorProfile = reactive<User>({
  id: 0,
  username: '',
  email: '',
  nickname: '',
  avatar_url: '',
  bio: '',
  is_station_master: false,
  date_joined: '',
  post_count: 0,
  tag_count: 0
})

// 作者的帖子
const authorPosts = reactive<Post[]>([])

// 跳转到帖子详情页
const goToPostDetail = (slug: string) => {
  router.push(`/post/${slug}`)
}

// 根据用户名加载作者信息
const loadAuthorProfile = async (username: string) => {
  try {
    const profileData = await authService.getUserProfileByUsername(username)
    // 添加调试日志
    console.log('获取到的用户信息:', profileData)
    console.log('is_station_master 参数:', profileData.is_station_master)
    // 更新作者信息
    Object.assign(authorProfile, {
      ...profileData,
      post_count: profileData.post_count || 0,
      tag_count: profileData.tag_count || 0,
      is_station_master: profileData.is_station_master || false
    })

     // 添加调试日志
    console.log('更新后的 authorProfile:', authorProfile)
    console.log('authorProfile.is_station_master:', authorProfile.is_station_master)
  } catch (error: any) {
    console.error('获取作者信息失败:', error)
    errorMessage.value = error.response?.data?.detail || '获取作者信息失败'
  }
}

// 加载作者的帖子
const loadAuthorPosts = async (authorId: number) => {
  try {
    const response = await postService.fetchPosts(1, 100, { 
      author: authorId,
      is_published: true
    })
    
    // 更新帖子列表
    authorPosts.splice(0, authorPosts.length, ...response.posts)
  } catch (error: any) {
    console.error('获取作者帖子失败:', error)
    errorMessage.value = error.response?.data?.detail || '获取作者帖子失败'
  }
}

// 初始化数据
const initializeData = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // 从路由参数获取用户名
    const username = route.params.username as string
    
    if (!username) {
      errorMessage.value = '未指定作者'
      return
    }
     console.log('路由参数中的用户名:', username)
    // 加载作者信息
    await loadAuthorProfile(username)
    
    // 如果成功获取作者信息，加载其帖子
    if (authorProfile.id) {
      await loadAuthorPosts(authorProfile.id)
    }
  } catch (error) {
    console.error('初始化数据失败:', error)
    errorMessage.value = '加载数据失败'
  } finally {
    isLoading.value = false
  }
}

// 组件挂载时初始化数据
onMounted(() => {
  document.title = '作者资料 - JacketleBlog社区';
  initializeData()
})

// 监听路由参数变化
// 如果需要支持在不刷新页面的情况下切换作者，可以取消注释以下代码
// watch(
//   () => route.params.username,
//   (newUsername) => {
//     if (newUsername) {
//       initializeData()
//     }
//   }
// )
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>