<template>
  <div class="create-post bg-base-100 min-h-screen">
    <Header/>

    <div class="container mx-auto px-4 py-8 max-w-3xl">
      <h1 class="text-3xl font-bold mb-8 flex items-center gap-2 text-base-content dark:text-base-content transition-colors duration-300 group">
        <icon icon="mdi:note-plus" class="text-primary w-7 h-7 transition-transform duration-300 group-hover:rotate-12"/>
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary group-hover:from-secondary group-hover:to-primary transition-all duration-500">
          发布新帖子
        </span>
      </h1>



      <form @submit.prevent="submitPost" class="space-y-6">
        <!-- 标题 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text flex items-center text-lg">
              <icon icon="mdi:format-title" class="mr-2 text-gray-500 w-6 h-6"/>
              标题
            </span>
          </label>
          <input
              v-model="form.title"
              type="text"
              placeholder="请输入帖子标题"
              class="input input-bordered w-full focus:input-primary transition-all duration-200 bg-base-100 dark:bg-base-700 text-base-content dark:text-base-content"
          />
          <div v-if="errors.title" class="text-error mt-1">{{ errors.title }}</div>
        </div>

        <!-- 文章封面选择 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text flex items-center text-lg">
              <icon icon="mdi:image" class="mr-2 text-gray-500 w-6 h-6"/>
              文章封面（可选）
            </span>
          </label>
          <div class="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
            <div v-for="(image, index) in availableCoverImages" :key="index"
                 class="relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200"
                 :class="{ 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-base-100': form.coverImageUrl === image, 'border-base-300 hover:border-primary/50': form.coverImageUrl !== image }"
                 @click="form.coverImageUrl = image">
              <img :src="image" alt="封面缩略图" class="w-full h-24 object-cover"/>
              <div v-if="form.coverImageUrl === image"
                   class="absolute inset-0 flex items-center justify-center bg-primary/50 text-white">
                <Icon icon="mdi:check-circle" class="w-8 h-8"/>
              </div>
            </div>
          </div>
        </div>
        <div class="divider text-gray-500 dark:text-gray-400">或</div>
        <div class="relative mt-2">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400 text-lg">
              <icon icon="mdi:image" class="w-5 h-5"/>
            </span>
          <input
              type="url"
              v-model="form.coverImageUrl"
              placeholder="输入图片链接 (URL)"
              class="input input-bordered w-full rounded-lg bg-base-100 dark:bg-base-700 text-base-content dark:text-base-content pl-10 
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          />
          
        </div>
        <div v-if="errors.coverImageUrl" class="text-error mt-1">{{ errors.coverImageUrl }}</div>
        <div v-if="form.coverImageUrl" class="mt-4 text-center">
          <p class="label-text text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-center gap-2">
            <icon icon="mdi:eye" class="w-4 h-4"/>
            封面预览:
          </p>
<div class="relative w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
  <img 
    :src="form.coverImageUrl || 'https://placehold.co/600x400/cccccc/969696?text=图片加载失败'" 
    alt="封面预览" 
    class="w-full h-full object-cover"
  >
            <button
                @click="form.coverImageUrl = ''"
                class="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 rounded-full p-1.5 shadow-md 
                       hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <icon icon="mdi:close" class="w-6 h-6 text-gray-700 dark:text-gray-300 "/>
            </button>
          </div>
        </div>

        <!-- 分区 -->
        <div class="form-control bg-transparent">
          <label class="label">
            <span class="label-text flex items-center text-lg">
              <icon icon="mdi:folder" class="mr-2 text-base-content/70 w-6 h-6"/>
              分区
            </span>
          </label>
          <select v-model="form.category"
                  class="select select-bordered w-full bg-base-100 dark:bg-base-700 text-base-content dark:text-base-content 
                         focus:select-primary transition-all duration-200">
            <option value="" disabled selected>请选择分区</option>
            <option value="技术">技术</option>
            <option value="杂谈">杂谈</option>
            <option value="生活">生活</option>
          </select>
          <div v-if="errors.category" class="text-error mt-1">{{ errors.category }}</div>
        </div>

        <!-- Markdown 内容 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text flex items-center text-lg">
              <icon icon="mdi:file-document-edit" class="mr-2 text-gray-500 w-6 h-6"/>
              内容
            </span>
          </label>
          <MarkdownEditor v-model:model-value="form.content"/>
          <div v-if="errors.content" class="text-error mt-1">{{ errors.content }}</div>
        </div>

        <!-- 标签 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text flex items-center text-lg">
              <icon icon="mdi:tag-multiple" class=" text-gray-500 w-6 h-6"/>
              标签（逗号分隔）
            </span>
          </label>
          <input
              v-model="form.tags"
              type="text"
              placeholder="例如：技术,Vue,DaisyUI"
              class="input input-bordered w-full focus:input-primary transition-all duration-200 bg-base-100 dark:bg-base-700 text-base-content dark:text-base-content"
          />
          <div v-if="errors.tags" class="text-error mt-1">{{ errors.tags }}</div>
        </div>
        <!-- 添加发布状态开关 -->
        <div class="form-control py-4">
          <label class="label cursor-pointer flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <icon icon="mdi:checkbox-marked-circle-outline" class="w-6 h-6 text-gray-600 dark:text-gray-300"/>
              <div>
                <span class="label-text text-lg font-medium flex items-center">发布状态</span>
                <p class="text-sm text-gray-500 mt-0.5">开: 直接发布文章 | 关: 保存为草稿</p>
              </div>
            </div>
            <input
                v-model="form.isPublished"
                type="checkbox"
                class="toggle toggle-primary toggle-lg"
            />
          </label>
        </div>
        <!-- Slug 自定义路径 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text flex items-center text-lg  ">
              <icon icon="mdi:link" class="mr-2 text-gray-600 dark:text-gray-300 w-6 h-6"/>
              自定义链接（可选）
            </span>
          </label>
          <div class="join w-full flex flex-nowrap">
    <span
        class="input input-bordered join-item pointer-events-none opacity-70 whitespace-nowrap flex items-center text-base-content text-gray-400 dark:text-gray-300">
        /{{ form.slug || 'your-slug' }}
    </span>
            <input
                v-model="form.slug"
                type="text"
                placeholder="your-slug"
                class="input input-bordered join-item w-full focus:input-primary transition-all duration-200 bg-base-100 dark:bg-base-700 text-base-content dark:text-base-content"
            />
          </div>
          <div v-if="errors.slug" class="text-error mt-1">{{ errors.slug }}</div>
        </div>

              <!-- 错误提示 -->
      <div v-if="hasErrors" class="alert alert-error shadow-lg mb-6">
        <div>
          <icon icon="mdi:alert-circle" class="w-6 h-6"/>
          <span>请修正以下错误后再提交</span>
        </div>
      </div>

        <!-- 提交按钮 -->
        <div class="form-control mt-6">
          <div class="flex justify-center gap-2">
            <!-- 发布帖子按钮 -->
            <button
                type="submit"
                class="btn btn-primary btn-lg rounded-btn flex justify-center gap-2"
                :disabled="submitting"
            >
              <span v-if="submitting">
                <span class="loading loading-spinner"></span>
                正在发布...
              </span>
              <span v-else class="flex items-center gap-2">
                <icon icon="mdi:publish" class="w-5 h-5"/>
                发布帖子
              </span>
            </button>

            <!-- 预览帖子按钮
  <button
      type="button"
      class="btn btn-outline btn-lg rounded-btn flex justify-center gap-2"
  >
    <icon icon="mdi:eye" class="w-5 h-5"/>
    预览帖子
  </button> -->
          </div>
        </div>
      </form>
    </div>

    <Footer/>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import MarkdownEditor from '@/components/features/MarkdownEditor.vue'
import {Icon} from '@iconify/vue'
import pinyin from 'pinyin'
// 假设 Header 和 Footer 组件已正确导入
import Header from '@/components/common/Header.vue'; // 请根据你的实际路径修改
import Footer from '@/components/common/Footer.vue'; // 请根据你的实际路径修改
import { postService } from '@/api/postService' 
import { useRouter } from 'vue-router'

const router = useRouter()
// 表单数据
const form = ref({
  title: '',
  content: '',
  tags: '',
  slug: '',
  category: '',
  coverImageUrl: '',
  isPublished: true  // 添加发布状态字段，默认为true
})

// 错误信息
const errors = ref({
  title: '',
  content: '',
  tags: '',
  slug: '',
  category: '',
  coverImageUrl: '',
  isPublished: ''  // 添加发布状态错误信息
})


// 提交状态
const submitting = ref(false)

// 是否有错误
const hasErrors = computed(() => {
  return Object.values(errors.value).some(msg => msg !== '')
})

// 预设封面图片列表
const availableCoverImages = ref([
  // 'https://mypicture.s3.bitiful.net/2025/08/e9b42d6674a9e20f0676d7f72336dcaf.webp',
  'https://pic.sl.al/gdrive/pic/2025-09-18/hash_5bae1e04_10d3da3b5b6b_wallhaven-n62d8q.webp',
  'https://f.pz.al/pzal/2025/09/15/625b9face0924.jpg',
  'https://mypicture.s3.bitiful.net/2025/08/240ea099b19bbabb5b0a8166c5bafcf8.webp',
  'https://pic.sl.al/gdrive/pic/2025-09-18/hash_697a2e7d_12bcd4bf98c2_wallhaven-q213e5.webp',
]);

// 添加分类代码映射函数
function getCategoryCode(categoryName: string): string {
  const categoryMap: Record<string, string> = {
    '技术': 'tech',
    '杂谈': 'chat',
    '生活': 'life'
  };
  return categoryMap[categoryName] || categoryName;
}
// 格式化 Slug 输入
function formatSlug(input: string): string {
  if (!input) return ''

  // 中文转拼音
  let slug = pinyin(input, {
    style: pinyin.STYLE_NORMAL, // 不带声调
    segment: true // 分词
  }).join('')

  slug = slug.toLowerCase()
  slug = slug.replace(/\s+/g, '-')
  slug = slug.replace(/[^a-z0-9\-_\.]/g, '')
  slug = slug.replace(/[-_\.]+/g, '-')
  slug = slug.replace(/^-+/, '').replace(/-+$/, '')

  return slug
}

// 生成 Slug（基于标题）
function generateSlugFromTitle(title: string): string {
  return formatSlug(title)
}

//检查 Slug 是否唯一（预留后端接口）
async function checkIfSlugExists(slug: string): Promise<boolean> {
  // TODO: 后端完成后再替换为真实 API
  // 示例：模拟已存在 /test-slug
  return slug === 'test-slug'
}

// 生成唯一 Slug（预留后端接口）
async function ensureUniqueSlug(slug: string): Promise<string> {
  let count = 1
  let uniqueSlug = slug

  // TODO: 后端完成后再替换为真实 API
  while (await checkIfSlugExists(uniqueSlug)) {
    uniqueSlug = `${slug}-${count}`
    count++
  }

  return uniqueSlug
}




// 获取表单数据（带格式化）
function getFormData() {
  const raw = form.value

  // 格式化 tags 字段
  const tags = raw.tags
      ? raw.tags.split(/[\s]*[，,][\s]*/g).map(tag => tag.trim()).filter(Boolean)
      : []

  return {
    title: raw.title,
    content: raw.content,
    tags: tags.join(','), // 转换为逗号分隔的字符串
    slug: raw.slug,
    category: getCategoryCode(raw.category), // 转换为英文代码
    cover_image_url: raw.coverImageUrl,
    is_published: raw.isPublished  // 添加发布状态字段
  }
}

// 获取表单数据（带验证）
function getFormDataWithValidation() {
  // 清空旧错误
  errors.value = {
    title: '',
    content: '',
    tags: '',
    slug: '',
    category: '',
    coverImageUrl: '',
    isPublished: ''  // 清空发布状态错误
  }

  let hasError = false

  // 标题不能为空
  if (!form.value.title.trim()) {
    errors.value.title = '标题不能为空'
    hasError = true
  }

  // 内容不能为空
  if (!form.value.content.trim()) {
    errors.value.content = '内容不能为空'
    hasError = true
  }

  // 标签不能为空或格式错误
  const tagsList = form.value.tags
      ? form.value.tags
          .split(/[\s]*[，,][\s]*/g)
          .map(tag => tag.trim())
          .filter(Boolean)
      : []
  if (tagsList.length === 0) {
    errors.value.tags = '至少需要一个标签'
    hasError = true
  }

  // 分区不能为空
  if (!form.value.category) {
    errors.value.category = '请选择分区'
    hasError = true
  }

  // Slug 格式校验（如果填写）
  if (form.value.slug) {
    const original = form.value.slug
    const formatted = formatSlug(original)

    // 如果格式化后不等于原始值，说明被自动修改过
    if (formatted !== original) {
      errors.value.slug = 'Slug 已自动格式化为：' + formatted
    }

    // 检查格式是否符合要求
    if (!/^[a-z0-9]+(-|_|\.?)+[a-z0-9]+$/.test(formatted)) {
      errors.value.slug = 'Slug 只能包含小写字母、数字、连字符、下划线或点号'
      hasError = true
    }
  }

  // 封面图片 URL 格式校验（如果填写）
  if (form.value.coverImageUrl && !/^https?:\/\/.+\.(png|jpg|jpeg|gif|webp|svg)$/i.test(form.value.coverImageUrl)) {
    errors.value.coverImageUrl = '请输入有效的图片链接 (png, jpg, gif, webp, svg)'
    hasError = true
  }

  if (hasError) return null // 返回 null 表示校验失败

  return getFormData()
}

async function submitPost() {
  const formData = getFormDataWithValidation()

  if (!formData) return // 验证失败时不提交

  // 如果用户未填写 Slug，则自动生成
  if (!formData.slug) {
    const generatedSlug = generateSlugFromTitle(formData.title)
    formData.slug = await ensureUniqueSlug(generatedSlug)
  }

  submitting.value = true

  try {
    // 使用真实的后端API创建帖子，添加缺失的字段以满足类型检查
    const postData = {
      title: formData.title,
      cover_image_url: formData.cover_image_url,
      content: formData.content,
      tags: formData.tags,
      category: formData.category,
      slug: formData.slug,
      // 添加缺失的字段以满足Post接口要求
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: {
        id: 0, // 临时值，后端会替换
        username: 'unknown', // 临时值，后端会替换
      },
      tag_list: formData.tags.split(',').map(tag => tag.trim()),
      is_published: formData.is_published,  // 这里硬编码为true，应该使用formData.is_published
    };
    
    const createdPost = await postService.createPost(postData);
    console.log('帖子创建成功:', createdPost);
    
    // 显示成功消息
    alert('帖子发布成功！');
    
  // 重置表单
    form.value = {
      title: '',
      content: '',
      tags: '',
      slug: '',
      category: '',
      coverImageUrl: '',
      isPublished: true  // 这里也应该重置为默认值，但不是必须的
    };
    
   // 可选：导航到新创建的帖子页面
// 首先需要导入 router

router.push(`/post/${createdPost.slug}`);
  } catch (error) {
    console.error('提交失败:', error);
    
    // 显示错误消息
    if (error instanceof Error) {
      alert(`发布失败: ${error.message}`);
    } else {
      alert('发布失败，请稍后再试');
    }
  } finally {
    submitting.value = false
  }
}
onMounted(() => {
  // 设置浏览器标签页标题
  document.title = '编辑文章 - JacketleBlog社区';
})
</script>
