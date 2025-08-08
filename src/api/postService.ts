// src/api/postService.ts
import axios from 'axios'
import type { Post, PaginatedPosts } from '@/types'
import { useAuthStore } from '@/stores/authStore.ts';

// 创建 Axios 实例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})
// 添加CSRF令牌处理
// 从cookie中获取CSRF令牌的函数
function getCSRFToken() {
  const cookieValue = document.cookie
    .split('; ') // 分割cookie
    .find(row => row.startsWith('XSRF-TOKEN=')) // 查找XSRF-TOKEN
    ?.split('=')[1]; // 提取值
  return cookieValue ? decodeURIComponent(cookieValue) : null;
}

// 更新请求拦截器以包含CSRF令牌
apiClient.interceptors.request.use(config => {
  const authStore = useAuthStore();
  // 添加调试日志
  // console.log('authStore.tokens:', authStore.tokens);
  if (authStore.tokens?.access) {
    // 统一使用Bearer前缀
    config.headers.Authorization = `Bearer ${authStore.tokens.access}`;
    // 添加调试日志
    // console.log('添加认证头:', config.headers.Authorization);
  } else {
    // 添加调试日志
    console.log('未添加认证头，因为authStore.tokens?.access为空');
  }
  // 添加CSRF令牌
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});


// 添加响应拦截器
apiClient.interceptors.response.use(
  response => {
    // 添加调试信息
    console.log('响应拦截器 - 原始响应:', response);
    
    // 对于204状态码(无内容)，直接返回响应
    if (response.status === 204) {
      return response;
    }
    
    // 检查响应结构
    if (!response || !response.data) {
      console.error('响应拦截器 - 响应数据为空');
      throw new Error('响应数据为空');
    }
    
    return response.data;
  },
  async error => {
    const originalRequest = error.config;
    
    // 如果是401错误且未尝试刷新
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const authStore = useAuthStore();
      try {
        // 尝试刷新令牌
        await authStore.refreshAccessToken();
        
        // 使用新令牌重试原请求
        originalRequest.headers.Authorization = `Bearer ${authStore.tokens?.access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 刷新失败，需要重新登录
        authStore.logout();
        return Promise.reject(new Error('会话已过期，请重新登录'));
      }
    }
    
    // 统一错误处理
    let errorMessage = '请求失败';
    if (error.response) {
      errorMessage = error.response.data.detail || errorMessage;
    } else if (error.request) {
      errorMessage = '网络错误，请检查连接';
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

// 帖子API服务
export const postService = {
/**
   * 获取帖子列表
   * @param page 页码
   * @param perPage 每页数量
   * @param options 其他查询选项
   * @returns 分页的帖子数据
   */
async fetchPosts(
  page = 1, 
  perPage = 10, 
  options?: {
    search?: string,
    ordering?: 'created_at' | '-created_at' | 'updated_at' | '-updated_at',
    author?: number,
    is_published?: boolean,
    category?: 'tech' | 'chat' | 'life'
  }
): Promise<PaginatedPosts> {
  const params: Record<string, any> = { page, perPage }
  
  if (options) {
    if (options.search) params.search = options.search
    if (options.ordering) params.ordering = options.ordering
    if (options.author !== undefined) params.author = options.author
    if (options.is_published !== undefined) params.is_published = options.is_published
    if (options.category) params.category = options.category
  }
  
  try {
    const response = await apiClient.get<PaginatedPosts | Post[]>('/posts/', { params })
    
    // 处理API返回直接是帖子数组的情况
    if (Array.isArray(response)) {
      // 模拟分页数据
      const totalItems = response.length
      const totalPages = Math.ceil(totalItems / perPage)
      const startIndex = (page - 1) * perPage
      const endIndex = Math.min(startIndex + perPage, totalItems)
      const paginatedPosts = response.slice(startIndex, endIndex)
       const processedPosts = paginatedPosts.map(post => ({
        ...post,
        content_summary: post.content_summary || '',// 对于列表接口，content字段可能不需要，可以考虑置空以节省内存
        // content: ''
      }));
      return {
        posts: paginatedPosts,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalItems,
          perPage: perPage
        }
      }
    } 
 // 处理API返回包含posts和pagination的对象的情况
    else if (response && Array.isArray(response.posts)) {
      // 处理posts数组中的content_summary字段
      const processedPosts = response.posts.map(post => ({
        ...post,
        content_summary: post.content_summary || ''
      }));
      
      return {
        ...response,
        posts: processedPosts
      };
    } else {
      throw new Error('API返回的数据格式不正确');
    }
  } catch (error) {
    console.error('获取帖子列表失败:', error);
    // 返回默认的分页数据
    return {
      posts: [],
      pagination: {
        currentPage: page,
        totalPages: 1,
        totalItems: 0,
        perPage
      }
    };
  }
},


  /**
   * 创建新帖子
   * @param postData 帖子数据
   * @returns 创建的帖子
   */
  async createPost(postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post> {
    return apiClient.post('/posts/create/', postData)
  },

  /**
   * 根据slug获取帖子
   * @param slug 帖子唯一标识
   * @returns 帖子数据
   */
  async getPostBySlug(slug: string): Promise<Post> {
    try {
      // 恢复使用泛型参数
      const postData = await apiClient.get<Post>(`/posts/${slug}/`);
      
      // 添加调试信息
      console.log('API响应:', postData);
      
      // 检查响应结构
      if (!postData) {
        throw new Error('API返回了空数据');
      }
      
      // 确保author对象中的post_count和tag_count是整数类型
      const authorData = {
        id: postData.author?.id || 0,
        username: postData.author?.username || '',
        nickname: postData.author?.nickname || undefined,
        bio: postData.author?.bio || undefined,
        // 确保post_count和tag_count是整数类型
        post_count: postData.author?.post_count !== undefined ? 
          parseInt(postData.author.post_count as any, 10) : undefined,
        tag_count: postData.author?.tag_count !== undefined ? 
          parseInt(postData.author.tag_count as any, 10) : undefined,
        avatar_url: postData.author?.avatar_url || undefined,  // 新增字段
      };
      
      // 不再需要类型断言，可以直接使用postData
      const post: Post = {
        id: postData.id,
        title: postData.title,
        content: postData.content,
        slug: postData.slug,
        created_at: postData.created_at,
        updated_at: postData.updated_at,
        author: authorData,
        tag_list: Array.isArray(postData.tag_list) ? postData.tag_list : [], // 确保是数组
        tags: postData.tags || '',
        category: postData.category || '',
        cover_image_url: postData.cover_image_url || '',
        is_published: postData.is_published || false
      };
      
      return post;
    } catch (error) {
      console.error('获取帖子失败:', error);
      throw error;
    }
  },
// ... existing code ...

  /**
   * 更新帖子
   * @param slug 帖子唯一标识
   * @param updateData 更新数据
   * @returns 更新后的帖子
   */
async updatePost(slug: string, updateData: Partial<Post>): Promise<Post> {
  // 确保slug存在
  if (!slug) {
    throw new Error('文章标识符不能为空');
  }
  
  // 过滤掉不需要的字段
  const { id, created_at, updated_at, author, ...dataToUpdate } = updateData;
  
  // 发送更新请求
  try {
    const response = await apiClient.patch<Post>(`/posts/${slug}/update/`, dataToUpdate);
    return response;
  } catch (error) {
    console.error('更新文章失败:', error);
    throw error;
  }
},

  /**
   * 根据slug删除帖子
   * @param slug 帖子唯一标识
   */
  async deletePostBySlug(slug: string): Promise<void> {
    try {
      const response = await apiClient.delete(`/posts/${slug}/delete/`);
      // 对于204状态码，不需要返回数据
      if (response.status === 204) {
        return;
      }
    } catch (error) {
      throw error;
    }
  },

/**
   * 搜索帖子
   * @param query 搜索关键词
   * @param page 页码
   * @param perPage 每页数量
   * @param options 其他查询选项
   * @returns 搜索结果
   */
  async searchPosts(
    query: string, 
    page = 1, 
    perPage = 10,
    options?: {
      ordering?: 'created_at' | '-created_at' | 'updated_at' | '-updated_at',
      author?: number,
      is_published?: boolean,
      category?: 'tech' | 'chat' | 'life'
    }
  ): Promise<PaginatedPosts> {
    const params: Record<string, any> = { search: query, page, perPage }
    
    if (options) {
      if (options.ordering) params.ordering = options.ordering
      if (options.author !== undefined) params.author = options.author
      if (options.is_published !== undefined) params.is_published = options.is_published
      if (options.category) params.category = options.category
    }
    
    return apiClient.get('/posts/', { params })
  }
}

// // 模拟数据实现（开发环境使用）
// if (import.meta.env.DEV) {
//   // 生成模拟数据
//   const generateMockPost = (id: number, title: string): Post => {
//     const slug = title.toLowerCase().replace(/\s+/g, '-')
//     return {
//       id,
//       title,
//       content: `这是关于${title}的详细内容。`.repeat(10),
//       slug,
//       createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
//       author: ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)],
//       authorAvatar: `https://robohash.org/${Math.random()}.png?size=150x150`,
//       views: Math.floor(Math.random() * 1000),
//       tags: ['前端', 'Vue', 'JavaScript', 'TypeScript', 'CSS'].slice(0, Math.floor(Math.random() * 3) + 1),
//       isFeatured: Math.random() > 0.7
//     }
//   }

//   const mockPosts: Post[] = Array.from({ length: 50 }, (_, i) =>
//     generateMockPost(i + 1, `博客文章 #${i + 1} - ${['Vue 技巧', 'React 实战', 'CSS 揭秘', 'TypeScript 进阶'][i % 4]}`)
//   )

//   // 覆盖API方法为模拟实现
//   postService.fetchPosts = async (page = 1, perPage = 10) => {
//     await new Promise(resolve => setTimeout(resolve, 500))
//     const start = (page - 1) * perPage
//     const end = start + perPage
//     return {
//       posts: mockPosts.slice(start, end),
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(mockPosts.length / perPage),
//         totalItems: mockPosts.length,
//         perPage
//       }
//     }
//   }

//   postService.createPost = async (postData) => {
//     await new Promise(resolve => setTimeout(resolve, 300))
//     return {
//       ...postData,
//       id: mockPosts.length + 1,
//       createdAt: new Date().toISOString(),
//       views: 0,
//       authorAvatar: 'https://i.pravatar.cc/150?u=newuser'
//     }
//   }

//   postService.getPostBySlug = async (slug) => {
//     await new Promise(resolve => setTimeout(resolve, 200))
//     const post = mockPosts.find(p => p.slug === slug)
//     if (!post) throw new Error('帖子未找到')
//     return post
//   }
// }