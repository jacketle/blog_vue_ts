<template>
  <Header />
  <div class="min-h-screen bg-base-200 text-base-content p-4 sm:p-6 lg:p-8 font-inter">
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <div v-else class="space-y-8">
        <!-- 错误提示 -->
        <div v-if="errorMessage" class="alert alert-error shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- 个人信息卡片 -->
        <div class="card bg-base-100 shadow-md rounded-xl p-6">
          <div class="flex flex-col sm:flex-row items-start gap-6">
            <!-- 头像 -->
            <div class="avatar placeholder">
              <div class="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-gradient-to-br from-purple-400 to-pink-500 text-white flex items-center justify-center text-2xl font-bold">
                <img v-if="userProfile.avatar_url" :src="userProfile.avatar_url" alt="Avatar" class="rounded-full object-cover w-full h-full" />
                <img v-else-if="userProfile.avatar_file" :src="userProfile.avatar_file" alt="Avatar" class="rounded-full object-cover w-full h-full" />
                <div v-else class="placeholder-avatar">{{ userProfile.username?.charAt(0).toUpperCase() }}</div>
              </div>
            </div>

            <!-- 个人信息 -->
            <div class="flex-1 w-full">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 class="text-2xl font-bold mb-1">{{ userProfile.username }}</h2>
                  <div class="flex flex-wrap items-center gap-2">
                    <div v-if="userProfile.is_station_master" class="flex items-center bg-gradient-to-r from-amber-400 to-yellow-500 text-yellow-900 font-bold px-3 py-1 rounded-full">
                      <Icon icon="mdi:crown" class="w-5 h-5 mr-1" />
                      <span class="text-sm">站长</span>
                      <Icon icon="mdi:shield-check" class="w-4 h-4 ml-1" />
                    </div>
                    <span v-else class="badge badge-primary badge-outline badge-sm">普通用户</span>
                    <span class="text-sm text-base-content text-opacity-60">加入于 {{ formatDate(userProfile.date_joined) }}</span> 
                  </div>
                </div>
                <button class="btn btn-primary btn-sm rounded-full" @click="openEditProfileModal">
                  <Icon icon="mdi:pencil" class="w-4 h-4 mr-1" />
                  编辑
                </button>
              </div>
              <p class="text-base-content text-opacity-70 mb-4">{{ userProfile.bio || '这个用户很懒，还没有填写个人简介' }}</p>
              <div class="flex gap-4">
                <div class="bg-base-200 rounded-lg px-4 py-2 flex-1">
                  <div class="text-sm text-base-content text-opacity-60">帖子数</div>
                  <div class="text-2xl font-bold text-primary">{{ userProfile.post_count || 0 }}</div>
                </div>
                <div class="bg-base-200 rounded-lg px-4 py-2 flex-1">
                  <div class="text-sm text-base-content text-opacity-60">标签数</div>
                  <div class="text-2xl font-bold text-primary">{{ userProfile.tag_count || 0 }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Posts Section -->
<div class="space-y-6">
  <div class="flex justify-between items-center mb-4">
    <h3 class="text-2xl font-bold text-base-content">我的帖子</h3>
    
    <!-- 筛选控件 -->
    <div class="flex gap-4">
      <!-- 分区筛选 -->
      <select v-model="categoryFilter" class="select select-bordered select-sm" @change="applyFilters">
        <option value="">所有分区</option>
        <option value="tech">技术</option>
        <option value="chat">杂谈</option>
        <option value="life">生活</option>
      </select>
      
      <!-- 发布状态筛选 -->
      <select v-model="publishStatusFilter" class="select select-bordered select-sm" @change="applyFilters">
        <option value="">所有状态</option>
        <option value="published">已发布</option>
        <option value="draft">草稿</option>
      </select>
    </div>
  </div>

  <div v-if="filteredPosts.length === 0" class="text-center py-10">
    <p class="text-base-content text-opacity-60">没有找到符合条件的帖子。</p>
    <button class="btn btn-accent mt-4 rounded-full" @click="() => router.push('/create/')">
      <Icon icon="mdi:plus" class="w-5 h-5 mr-1" />
      发布新帖子
    </button>
  </div>
      
          <div v-else class="space-y-4">
<!-- 单个帖子行布局 -->
<div v-for="post in filteredPosts" :key="post.id" class="flex items-start p-6 border rounded-2xl hover:shadow-xl transition-all bg-base-100">
  <!-- 左侧帖子封面 -->
  <div class="w-32 h-32 flex-shrink-0 mr-6">
    <img 
      :src="post.cover_image_url || '/default-cover.png'" 
      alt="帖子封面" 
      class="w-full h-full object-cover rounded-xl"
    >
  </div>

<!-- 右侧内容区 -->
<div class="flex-1 min-w-0">
  <div class="flex items-start justify-between mb-3">
    <!-- 帖子标题 -->
    <router-link :to="`/post/${post.slug}`" class="group">
      <h4 class="text-2xl font-bold text-primary group-hover:underline">
        {{ post.title }}
      </h4>
    </router-link>
    <!-- 发布状态 -->
    <div class="flex items-center text-sm" :class="post.is_published ? 'text-success' : 'text-warning'">
      <Icon 
        :icon="post.is_published ? 'mdi:check-circle-outline' : 'mdi:clock-outline'" 
        class="w-5 h-5 mr-1" 
      />
      <span>{{ post.is_published ? '已发布' : '草稿' }}</span>
    </div>
  </div>
  
  <!-- 内容摘要 -->
  <p class="text-base-content text-opacity-80 text-base mb-4 line-clamp-2">
    {{ post.content_summary || post.content }}
  </p>
  
  <!-- 标签和分类信息 -->
  <div class="flex flex-col gap-2 mb-4">
    <!-- 分类标签和发布时间 -->
    <div class="flex flex-wrap items-center gap-4">
      <!-- 分类标签 -->
      <div class="flex items-center text-base text-base-content text-opacity-80">
        <Icon icon="mdi:folder-outline" class="w-5 h-5 mr-2" />
        <span>分区: {{ getCategoryName(post.category) }}</span>
      </div>
      
      <!-- 发布时间 -->
      <div class="flex items-center text-base text-base-content text-opacity-80">
        <Icon icon="mdi:calendar-outline" class="w-5 h-5 mr-2" />
        <span>发布于: {{ formatDate(post.created_at) }}</span>
      </div>
    </div>
    
    <!-- 标签列表 -->
    <div class="flex flex-wrap gap-2">
      <span 
        v-for="tag in post.tag_list" 
        :key="tag" 
        class="px-3 py-1.5 text-sm bg-primary bg-opacity-10 text-primary rounded-full flex items-center"
      >
        <Icon icon="mdi:tag-outline" class="w-4 h-4 mr-1.5" />
        {{ tag }}
      </span>
    </div>
  </div>

  <!-- 操作按钮组 -->
  <div class="flex flex-wrap gap-3">
    <button class="btn btn-info" @click="editPost(post)">
      <Icon icon="mdi:pencil" class="w-5 h-5 mr-2" /> 编辑
    </button>
    <button class="btn btn-error" @click="confirmDeletePost(post.slug)">
      <Icon icon="mdi:delete" class="w-5 h-5 mr-2" /> 删除
    </button>
    <!-- 发布按钮（仅未发布帖子显示） -->
    <button 
      v-if="!post.is_published"
      class="btn btn-success"
      @click="publishPost(post.id)"
    >
      <Icon icon="mdi:check" class="w-5 h-5 mr-2" /> 发布
    </button>
  </div>
</div>
</div>
          </div>
        </div>
      <!-- 编辑个人信息-->
      <dialog id="edit_profile_modal" class="modal">
        <div class="modal-box bg-base-100 rounded-xl shadow-lg">
          <h3 class="font-bold text-2xl mb-4">编辑个人资料</h3>
          <form @submit.prevent="saveProfile" class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">用户名(不要随意修改)</span>
              </label>
              <input type="text" v-model="editProfileForm.username" class="input input-bordered w-full bg-base-200 text-base-content" required />
            </div>
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">个人简介</span>
            </label>
            <textarea
              v-model="editProfileForm.bio"
              class="textarea textarea-bordered h-24"
              placeholder="介绍一下你自己吧..."
            ></textarea>
          </div>
          <!-- 新增头像 URL 输入框 -->
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">头像 URL</span>
            </label>
            <input
              v-model="editProfileForm.avatar_url"
              type="text"
              class="input input-bordered"
              placeholder="请输入头像图片的 URL"
            />
          </div>
            <div class="modal-action">
              <button type="button" class="btn btn-ghost" @click="closeEditProfileModal">取消</button>
              <button type="submit" class="btn btn-primary">
                <Icon icon="mdi:check" class="w-5 h-5 mr-1" />
                保存
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="closeEditProfileModal">close</button>
        </form>
      </dialog>

      <!-- 编辑帖子信息 -->
      <!-- <dialog id="edit_post_modal" class="modal">
        <div class="modal-box bg-base-100 rounded-xl shadow-lg">
          <h3 class="font-bold text-2xl mb-4">{{ editingPost?.id ? '编辑帖子' : '发布新帖子' }}</h3>
          <form @submit.prevent="savePost" class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">帖子标题</span>
              </label>
              <input type="text" v-model="editingPostForm.title" class="input input-bordered w-full bg-base-200 text-base-content" required />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">帖子内容</span>
              </label>
              <textarea v-model="editingPostForm.content" class="textarea textarea-bordered h-36 w-full bg-base-200 text-base-content" required></textarea>
            </div>
            <div class="modal-action">
              <button type="button" class="btn btn-ghost" @click="closeEditPostModal">取消</button>
              <button type="submit" class="btn btn-primary">
                <Icon icon="mdi:check" class="w-5 h-5 mr-1" />
                保存
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="closeEditPostModal">close</button>
        </form>
      </dialog> -->

      <!-- Success/Error Toast Message -->
      <div v-if="toastMessage" class="toast toast-end z-50">
        <div :class="['alert', toastType === 'success' ? 'alert-success' : 'alert-error']">
          <div class="flex items-center">
            <Icon
                :icon="toastType === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'"
                class="w-6 h-6 mr-2"
            />
            <span>{{ toastMessage }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<Footer />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'; // 注意这里添加了 watch 和 computed
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router'; // 添加 useRouter 导入
import Header from "@/components/common/Header.vue";
import Footer from "@/components/common/Footer.vue";
import { authService } from '@/api/authService';
import { useRoute } from 'vue-router';
import { formatDate } from '@/utils/dateFormatter.ts';
import { postService } from '@/api/postService'; // 添加这行导入
import { useAuthStore } from '@/stores/authStore'; // 添加这行导入
// 更新接口定义以匹配后端返回结构

// 获取路由实例
const route = useRoute();
const router = useRouter(); // 添加这行获取 
const authStore = useAuthStore(); // 添加这行获取authStore实例

// 监听路由变化，当路由参数变化时重新加载数据
watch(() => route.params, async (newParams, oldParams) => {
  // 清除缓存
  localStorage.removeItem(CACHE_KEY);
  // 重新加载数据
  await loadUserData();
}, { deep: true });

// 如果需要监听路由名称变化（用户切换时）
watch(() => route.name, async (newName, oldName) => {
  // 清除缓存
  localStorage.removeItem(CACHE_KEY);
  // 重新加载数据
  await loadUserData();
});

interface UserProfile {
  id: number;
  username: string;
  email: string;
  nickname?: string;
  avatar_file?: string;  // 添加avatar_file字段
  avatar_url?: string;   // 添加avatar_url字段
  avatar?: string;       // 保留原有字段，用于前端计算后的头像URL
  bio?: string;
  is_station_master: boolean;
  date_joined: string;
  post_count?: number;  // 添加post_count字段
  tag_count?: number;   // 添加tag_count字段
}

// 修改Post接口定义以匹配后端返回的数据结构
interface Post {
  id: number;
  title: string;
  content: string;
  content_summary?: string;
  slug: string;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    username: string;
    nickname?: string;
    bio?: string;
  };
  tag_list: string[];
  tags: string;
  category: string;
  cover_image_url: string;
  is_published: boolean;
  views?: number;
  isFeatured?: boolean;
}

// 添加筛选相关的响应式数据
const categoryFilter = ref('');
const publishStatusFilter = ref('');

// 计算属性：根据筛选条件过滤帖子
const filteredPosts = computed(() => {
  return userPosts.filter(post => {
    // 分区筛选
    if (categoryFilter.value && post.category !== categoryFilter.value) {
      return false;
    }
    
    // 发布状态筛选
    if (publishStatusFilter.value) {
      if (publishStatusFilter.value === 'published' && !post.is_published) {
        return false;
      }
      if (publishStatusFilter.value === 'draft' && post.is_published) {
        return false;
      }
    }
    
    return true;
  });
});

// 应用筛选（当筛选条件改变时调用）
const applyFilters = () => {
  // 筛选逻辑已经在computed属性中实现，这里可以添加其他需要的操作
  console.log('应用筛选:', { category: categoryFilter.value, status: publishStatusFilter.value });
};

//加载和错误信息
const isLoading = ref(true);
const errorMessage = ref('');


// 缓存配置
const CACHE_KEY = 'user_profile_cache';
const CACHE_DURATION = 10 * 60 * 1000; // 10分钟缓存有效期

// Reactive state for user profile and posts
// 响应式状态
//个人信息
const userProfile = reactive<UserProfile>({ 
  id: 0, 
  username: '小猫咪博主', 
  email: '', 
  nickname: '', 
  avatar_url: 'https://placehold.co/100x100/A78BFA/FFFFFF?text=🐱', 
  bio: '一个热爱编程、分享生活、沉迷撸猫的野生博主。欢迎来到我的数字花园！', 
  is_station_master: false, 
  date_joined: '' 
});
//个人帖子
 // 修改模拟数据以包含content_summary字段
  const userPosts = reactive<Post[]>([
    { 
      id: 1, 
      title: '我的第一篇博客：Vue 3 入门', 
      content: 'Vue 3 带来了 Composition API，让我爱不释手。这篇文章记录了我学习 Vue 3 的心路历程...',
      content_summary: 'Vue 3 带来了 Composition API，让我爱不释手。这篇文章记录了我学习 Vue 3 的心路历程...',
      slug: 'my-first-blog-vue3-intro',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      author: {
        id: 1,
        username: '小猫咪博主',
        nickname: '',
        bio: '一个热爱编程、分享生活、沉迷撸猫的野生博主。欢迎来到我的数字花园！'
      },
      tag_list: ['Vue', '编程'],
      tags: 'Vue,编程',
      category: '技术',
      cover_image_url: '/default-cover.png',
      is_published: true,
      views: 0,
      isFeatured: false
    },
  ]);


  // 添加分类名称映射函数
const getCategoryName = (category: string) => {
  const categoryMap: Record<string, string> = {
    'technology': '技术',
    'tech': '技术',
    'technical': '技术',
    'chat': '杂谈',
    'chatter': '杂谈',
    'life': '生活',
    'lifestyle': '生活',
    'default': category  // 如果没有匹配项，返回原始值
  };
  
  return categoryMap[category.toLowerCase()] || categoryMap['default'];
};
// 添加获取用户帖子的方法
const loadUserPosts = async () => {
  try {
    // 获取当前用户的ID
    const userId = userProfile.id;
    
    if (userId) {
      // 调用API获取用户的所有帖子（包括已发布和未发布的）
      // 分别获取已发布和未发布的帖子
      const publishedResponse = await postService.fetchPosts(1, 100, { 
        author: userId,
        is_published: true
      });
      
      const draftResponse = await postService.fetchPosts(1, 100, { 
        author: userId,
        is_published: false
      });
      
      // 合并已发布和未发布的帖子
      const allPosts = [...publishedResponse.posts, ...draftResponse.posts];
      
      // 清空现有帖子并添加新获取的帖子
      userPosts.splice(0, userPosts.length, ...allPosts);
    }
  } catch (error: any) {
    console.error('获取用户帖子失败:', error);
    errorMessage.value = error.response?.data?.detail || '获取用户帖子失败，请重试';
  }
};





// 缓存工具函数
const getCache = (key: string) => {
  const cacheStr = localStorage.getItem(key);
  if (!cacheStr) return null;
  return JSON.parse(cacheStr);
};

const setCache = (key: string, data: any) => {
  const cacheData = {
    data, 
    timestamp: Date.now()
  };
  localStorage.setItem(key, JSON.stringify(cacheData));
};

const isCacheValid = (cache: any) => {
  return Date.now() - cache.timestamp < CACHE_DURATION;
};


// 修改loadUserData方法，在获取用户数据后也获取用户的帖子
const loadUserData = async () => {
  try {
    // 先检查缓存
    const cache = getCache(CACHE_KEY);
    if (cache && isCacheValid(cache)) {
      console.log('使用缓存数据');
      Object.assign(userProfile, cache.data);
      isLoading.value = false;
      
      // 加载用户帖子
      await loadUserPosts();
      return;
    }

    // 缓存无效或不存在，从API获取
    console.log('缓存不存在或已过期，从API获取数据');
    const profileResponse = await authService.getUserProfile();
    
    // 确保post_count和tag_count是整数类型
    if (profileResponse.post_count !== undefined) {
      profileResponse.post_count = parseInt(profileResponse.post_count as any, 10);
    }
    if (profileResponse.tag_count !== undefined) {
      profileResponse.tag_count = parseInt(profileResponse.tag_count as any, 10);
    }
    
    // 计算最终的avatar字段
    const avatar = profileResponse.avatar_url || profileResponse.avatar_file || '';
    Object.assign(userProfile, {...profileResponse, avatar});
    
    // 更新缓存
    setCache(CACHE_KEY, {...profileResponse, avatar});
    
    // 加载用户帖子
    await loadUserPosts();
  } catch (error: any) {
    console.error('获取用户数据失败:', error);
    errorMessage.value = error.response?.data?.detail || '获取用户信息失败，请重试';
  } finally {
    isLoading.value = false;
  }
};
// 修改publishPost方法以调用实际的API
const publishPost = async (id: number) => {
  try {
    // 调用API发布帖子
    const post = userPosts.find(p => p.id === id);
    if (post) {
      // 使用帖子的slug调用更新方法
      await postService.updatePost(post.slug, { is_published: true });
      
      // 更新本地状态
      post.is_published = true;
      
      showToast('帖子已发布！', 'success');
    }
  } catch (error) {
    console.error('发布帖子失败:', error);
    showToast('发布帖子失败，请重试', 'error');
  }
};
// 组件挂载时加载数据
onMounted(async () => {
  await loadUserData();
});

// 修改保存个人资料方法，更新缓存
const saveProfile = async () => {
  try {
    isLoading.value = true;
    // 调用API保存资料，只传递需要的字段
    const profileData = {
      username: editProfileForm.username,
      nickname: editProfileForm.nickname,
      bio: editProfileForm.bio,
      avatar_url: editProfileForm.avatar_url // 确保有这个字段
    };
    const response = await authService.updateProfile(profileData);
    
    // 计算最终的avatar字段
    const avatar = response.avatar_url || response.avatar_file || '';
    
    // 正确更新userProfile的所有字段
    Object.assign(userProfile, {...response, avatar});
    
    // 更新缓存
    setCache(CACHE_KEY, {...response, avatar});
    
    closeEditProfileModal();
    showToast('个人资料已更新！', 'success');
  } catch (error: any) {
    console.error('保存个人资料失败:', error);
    // 检查是否是用户名已被占用的错误
    const errorMessage = error.response?.data?.detail || error.response?.data?.username || '保存失败，请重试';
    if (errorMessage.includes('already exists') || errorMessage.includes('已存在')) {
      showToast('该用户名已被占用，请选择其他用户名。', 'error');
    } else {
      showToast(errorMessage, 'error');
    }
  } finally {
    isLoading.value = false;
  }
};
// 添加编辑帖子的方法
const editPost = (post: Post) => {
  // 检查用户是否有权限编辑此文章
  if (post.author.id !== authStore.user?.id && !authStore.user?.is_station_master) {
    alert('您没有权限编辑此文章');
    return;
  }
  
  router.push({ name: 'EditPost', params: { postSlug: post.slug } });
};

// State for profile editing modal
const editProfileForm = reactive({
  username: '',
  nickname: '',
  bio: '',
  avatar_url: '' // 新增 avatar 字段
});
const isEditingProfile = ref(false); // Not directly used for modal, but good for state tracking

// State for post editing/creating modal
const editingPost = ref<Post | null>(null);
const editingPostForm = reactive<Post>({
  id: 0,
  title: '',
  content: '',
  content_summary: '',
  slug: '',
  created_at: '',
  updated_at: '',
  author: {
    id: 0,
    username: '',
    nickname: '',
    bio: ''
  },
  tag_list: [],
  tags: '',
  category: '',
  cover_image_url: '',
  is_published: false,
  views: 0,
  isFeatured: false
});
const isEditingPost = ref(false); // Not directly used for modal, but good for state tracking

// Toast message state
const toastMessage = ref('');
const toastType = ref<'success' | 'error'>('success');

// --- Profile Editing Functions ---

const openEditProfileModal = () => {
  // Copy current profile data to form for editing
  Object.assign(editProfileForm, userProfile);
  const modal = document.getElementById('edit_profile_modal') as HTMLDialogElement;
  if (modal) {
    modal.showModal();
  }
};

const closeEditProfileModal = () => {
  const modal = document.getElementById('edit_profile_modal') as HTMLDialogElement;
  if (modal) {
    modal.close();
  }
};


// --- Post Editing/Creating Functions ---

// const openEditPostModal = (post: Post) => {
//   editingPost.value = post;
//   // 使用深拷贝确保不会意外修改原始数据
//   Object.assign(editingPostForm, JSON.parse(JSON.stringify(post)));
//   const modal = document.getElementById('edit_post_modal') as HTMLDialogElement;
//   if (modal) {
//     modal.showModal();
//   }
// };

// const openCreatePostModal = () => {
//   editingPost.value = null; // Indicate creating new post
  
//   // 正确初始化editingPostForm
//   Object.assign(editingPostForm, {
//     id: 0,
//     title: '',
//     content: '',
//     content_summary: '',
//     slug: '',
//     created_at: '',
//     updated_at: '',
//     author: {
//       id: userProfile.id,
//       username: userProfile.username,
//       nickname: userProfile.nickname || '',
//       bio: userProfile.bio || ''
//     },
//     tag_list: [],
//     tags: '',
//     category: '',
//     cover_image_url: '',
//     is_published: false,
//     views: 0,
//     isFeatured: false
//   });
  
//   const modal = document.getElementById('edit_post_modal') as HTMLDialogElement;
//   if (modal) {
//     modal.showModal();
//   }
// };

// const closeEditPostModal = () => {
//   const modal = document.getElementById('edit_post_modal') as HTMLDialogElement;
//   if (modal) {
//     modal.close();
//   }
//   editingPost.value = null; // Clear editing state
// };

// const savePost = async () => {
//   try {
//     if (editingPostForm.id === 0) {
//       // Create new post
//       // 确保newPostData包含所有必需的字段
//       const newPostData = {
//         title: editingPostForm.title,
//         content: editingPostForm.content,
//         content_summary: editingPostForm.content_summary || '',
//         slug: editingPostForm.slug || '',
//         author: editingPostForm.author,
//         tag_list: editingPostForm.tag_list,
//         tags: editingPostForm.tags || '',
//         category: editingPostForm.category || '',
//         cover_image_url: editingPostForm.cover_image_url || '',
//         is_published: editingPostForm.is_published
//       };
      
//       const response = await postService.createPost(newPostData);
      
//       // 添加到本地数组
//       userPosts.push(response);
//       showToast('帖子创建成功！', 'success');
//     } else {
//       // Update existing post
//       const updateData = {
//         title: editingPostForm.title,
//         content: editingPostForm.content,
//         content_summary: editingPostForm.content_summary || '',
//         slug: editingPostForm.slug || '',
//         author: editingPostForm.author,
//         tag_list: editingPostForm.tag_list,
//         tags: editingPostForm.tags || '',
//         category: editingPostForm.category || '',
//         cover_image_url: editingPostForm.cover_image_url || '',
//         is_published: editingPostForm.is_published
//       };
      
//       const response = await postService.updatePost(editingPostForm.slug, updateData);
      
//       // 更新本地数组
//       const index = userPosts.findIndex(p => p.id === editingPostForm.id);
//       if (index !== -1) {
//         Object.assign(userPosts[index], response);
//       }
//       showToast('帖子已更新！', 'success');
//     }
//   } catch (error) {
//     console.error('保存帖子失败:', error);
//     showToast('保存帖子失败，请重试', 'error');
//   } finally {
//     closeEditPostModal();
//   }
// };

const confirmDeletePost = (slug: string) => {
  // 使用简单的确认对话框
  if (confirm('确定要删除这篇帖子吗？')) {
    deletePost(slug);
  }
};

const deletePost = async (slug: string) => {
  try {
    // 查找要删除的帖子以进行权限验证
    const post = userPosts.find(p => p.slug === slug)
    
    // 检查用户是否有权限删除此文章
    if (!post) {
      showToast('未找到要删除的帖子', 'error')
      return
    }
    
    // 验证用户权限
    const currentUser = authStore.user
    if (!currentUser) {
      showToast('用户未登录', 'error')
      return
    }
    
    const isOwner = post.author.id === currentUser.id
    const isStationMaster = currentUser.is_station_master
    
    if (!isOwner && !isStationMaster) {
      showToast('您没有权限删除此文章', 'error')
      return
    }
    
    // 调用API删除帖子
    await postService.deletePostBySlug(slug)
    
    // 从本地数组中移除
    const index = userPosts.findIndex(p => p.slug === slug)
    if (index !== -1) {
      userPosts.splice(index, 1)
      showToast('帖子已删除！', 'success')
    } else {
      showToast('删除帖子失败。', 'error')
    }
  } catch (error: any) {
    console.error('删除帖子失败:', error)
    // 检查是否是404错误（帖子不存在）
    if (error.response?.status === 404) {
      showToast('帖子不存在或已被删除', 'error')
    } else {
      showToast('删除帖子失败，请重试', 'error')
    }
  }
}

// --- Toast Message Functions ---
const showToast = (message: string, type: 'success' | 'error') => {
  toastMessage.value = message;
  toastType.value = type;
  setTimeout(() => {
    toastMessage.value = '';
  }, 3000); // Hide toast after 3 seconds
};

</script>

<style scoped>
/* Custom styles if needed, but DaisyUI and Tailwind handle most of it */
/* Font Inter for a modern look */
.font-inter {
  font-family: 'Inter', sans-serif;
}

/* Ensure modals are styled correctly by DaisyUI */
.modal-box {
  padding: 2rem;
}

/* Dark mode adjustments for inputs/textareas */
.dark .input-bordered,
.dark .textarea-bordered {
  border-color: #4b5563; /* gray-600 */
}
</style>
