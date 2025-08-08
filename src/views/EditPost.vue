<template>
  <Header />
  <!-- 添加暗色模式背景 -->
  <div class="min-h-screen w-full px-4 py-8 md:px-6 lg:px-8 flex flex-col gap-6 bg-base-100 dark:bg-base-200">
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-12 w-full">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="mt-2 text-base-content/70">正在加载文章内容...</p>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="alert alert-error shadow-lg mb-6 w-full">
      <div>
        <icon icon="mdi:alert-circle" class="w-5 h-5 mr-2" />
        <span>{{ errorMessage }}</span>
      </div>
    </div>

    <!-- 编辑表单 -->
    <div v-if="!loading && !error" class="w-full max-w-4xl mx-auto">
      <div class="bg-base-100 dark:bg-base-300 p-6 rounded-lg shadow-md">
        <h1 class="text-3xl font-bold mb-6 text-center">编辑文章</h1>
        
        <form @submit.prevent="savePost">
          <!-- 标题 -->
          <div class="mb-4">
            <label class="label">
              <span class="label-text font-bold">文章标题</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              class="input input-bordered w-full"
              placeholder="请输入文章标题"
              required
            />
          </div>

          <!-- 封面图片URL -->
          <div class="mb-4">
            <label class="label">
              <span class="label-text font-bold">封面图片URL</span>
            </label>
            <input
              v-model="form.cover_image_url"
              type="text"
              class="input input-bordered w-full"
              placeholder="请输入封面图片URL"
            />
          </div>

          <!-- 内容 -->
          <div class="mb-4">
            <label class="label">
              <span class="label-text font-bold">文章内容</span>
            </label>
            <textarea
              v-model="form.content"
              class="textarea textarea-bordered w-full h-64"
              placeholder="请输入文章内容"
              required
            ></textarea>
          </div>

          <!-- 标签 -->
          <div class="mb-4">
            <label class="label">
              <span class="label-text font-bold">标签</span>
            </label>
            <input
              v-model="form.tags"
              type="text"
              class="input input-bordered w-full"
              placeholder="请输入标签，用逗号分隔"
            />
          </div>

          <!-- 分类 -->
          <div class="mb-4">
            <label class="label">
              <span class="label-text font-bold">分类</span>
            </label>
            <select v-model="form.category" class="select select-bordered w-full">
              <option value="tech">技术</option>
              <option value="chat">闲聊</option>
              <option value="life">生活</option>
            </select>
          </div>

          <!-- Slug -->
          <div class="mb-4">
            <label class="label">
              <span class="label-text font-bold">Slug</span>
            </label>
            <input
              v-model="form.slug"
              type="text"
              class="input input-bordered w-full"
              placeholder="请输入文章的唯一标识符"
              required
            />
          </div>

          <!-- 发布状态 -->
          <div class="mb-6 flex items-center">
            <label class="label cursor-pointer mr-4">
              <input
                v-model="form.is_published"
                type="checkbox"
                class="checkbox checkbox-primary mr-2"
              />
              <span class="label-text">发布文章</span>
            </label>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="cancelEdit"
              class="btn btn-outline"
            >
              取消
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSaving"
            >
              <span v-if="isSaving" class="loading loading-spinner loading-sm mr-2"></span>
              {{ isSaving ? '保存中...' : '保存文章' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postService } from '@/api/postService'
import Header from '@/components/common/Header.vue'
import { useAuthStore } from '@/stores/authStore'

// 状态管理
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const form = ref({
  title: '',
  cover_image_url: '',
  content: '',
  tags: '',
  category: 'tech',
  slug: '',
  is_published: false
})

const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')
const isSaving = ref(false)

// 获取文章数据
const fetchPost = async (slug: string) => {
  try {
    const post = await postService.getPostBySlug(slug)
    
    // 填充表单数据
    form.value = {
      title: post.title,
      cover_image_url: post.cover_image_url || '',
      content: post.content,
      tags: post.tags || '',
      category: post.category || 'tech',
      slug: post.slug,
      is_published: post.is_published || false
    }
  } catch (err) {
    console.error('获取文章失败:', err)
    error.value = true
    errorMessage.value = '获取文章失败，请重试'
  } finally {
    loading.value = false
  }
}

// 保存文章
const savePost = async () => {
  if (!form.value.slug) {
    error.value = true
    errorMessage.value = 'Slug不能为空'
    return
  }

  isSaving.value = true
  error.value = false
  errorMessage.value = ''

  try {
    // 准备更新数据
    const updateData = {
      title: form.value.title,
      cover_image_url: form.value.cover_image_url,
      content: form.value.content,
      tags: form.value.tags,
      category: form.value.category,
      slug: form.value.slug,
      is_published: form.value.is_published
    }

    // 调用API更新文章
    const updatedPost = await postService.updatePost(form.value.slug, updateData)
    
    // 显示成功消息并跳转到文章详情页
    alert('文章更新成功！')
    router.push(`/post/${updatedPost.slug}`)
  } catch (err) {
    console.error('保存文章失败:', err)
    error.value = true
    errorMessage.value = `保存文章失败: ${(err as Error).message || '未知错误'}`
  } finally {
    isSaving.value = false
  }
}

// 取消编辑
const cancelEdit = () => {
  if (confirm('确定要取消编辑吗？未保存的更改将会丢失。')) {
    router.back()
  }
}

// 页面加载时获取文章数据
onMounted(async () => {
  // 检查用户是否已登录
  if (!authStore.isLoggedIn) {
    router.push({ name: 'Login', query: { redirect: route.fullPath } })
    return
  }

  const postSlug = route.params.postSlug as string
  if (postSlug) {
    try {
      // 先获取文章数据以检查权限
      const postData = await postService.getPostBySlug(postSlug)
      
      // 检查用户是否有权限编辑此文章
      if (postData.author.id !== authStore.user?.id && !authStore.user?.is_station_master) {
        alert('您没有权限编辑此文章')
        router.push(`/post/${postSlug}`)
        return
      }
      
      // 填充表单数据
      await fetchPost(postSlug)
    } catch (err) {
      console.error('获取文章失败:', err)
      error.value = true
      errorMessage.value = `获取文章失败: ${(err as Error).message || '未知错误'}`
      loading.value = false
    }
  } else {
    error.value = true
    errorMessage.value = '无效的文章标识符'
    loading.value = false
  }
})
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>