// src/stores/postStore.ts
import { defineStore } from 'pinia'
import type { Post, PaginatedPosts } from '@/types'
import { postService } from '@/api/postService'

// 在state中添加新的过滤选项
export const usePostStore = defineStore('post', {
  state: () => ({
    // 确保始终初始化为空数组
    posts: [] as Post[],
    currentPost: null as Post | null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      perPage: 5
    },
    loading: false,
    error: null as string | null,
    searchQuery: '',
    filters: {
      ordering: '' as '' | 'created_at' | '-created_at' | 'updated_at' | '-updated_at',
      author: null as number | null,
      isPublished: null as boolean | null,
      category: '' as '' | 'tech' | 'chat' | 'life'
    }
  }),

// 修改后
  getters: {
    featuredPosts: (state) => state.posts.filter(post => post.isFeatured),
    recentPosts: (state) => [...state.posts].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, 5)
  },

  actions: {
    /**
     * 加载帖子列表
     * @param page 页码
     * @param filters 过滤选项
     */
async loadPosts(page = 1, filters?: { 
  ordering?: '' | 'created_at' | '-created_at' | 'updated_at' | '-updated_at', 
  author?: number, 
  isPublished?: boolean, 
  category?: '' | 'tech' | 'chat' | 'life',
  search?: string  // 添加搜索参数类型
}) {
  this.loading = true
  this.error = null
  if (!this.posts) this.posts = []
  
  // 更新过滤选项
  if (filters) {
    this.filters = { ...this.filters, ...filters }
  }
  
  try {
    const options = {
      ordering: this.filters.ordering || undefined,
      author: this.filters.author || undefined,
      is_published: this.filters.isPublished !== null ? this.filters.isPublished : undefined,
      category: this.filters.category || undefined,
      search: filters?.search || undefined  // 添加搜索参数传递
    }
    
    const response = await postService.fetchPosts(page, this.pagination.perPage, options)
    if (response && Array.isArray(response.posts)) {
      this.posts = response.posts
      this.pagination = response.pagination || this.pagination
    } else {
      console.error('API响应格式不正确，缺少posts数组')
      this.error = '获取帖子数据格式错误'
      this.posts = []
    }
  } catch (error: any) {
    this.error = error.message || '加载帖子失败'
    console.error('加载帖子错误:', error)
    this.posts = []
  } finally {
    this.loading = false
  }
},
    /**
     * 搜索帖子
     * @param query 搜索关键词
     * @param filters 过滤选项
     */
        async searchPosts(query: string, filters?: { 
      ordering?: '' | 'created_at' | '-created_at' | 'updated_at' | '-updated_at', 
      author?: number, 
      isPublished?: boolean, 
      category?: '' | 'tech' | 'chat' | 'life' 
    }) {
      this.searchQuery = query
      this.loading = true
      this.error = null
      
      // 更新过滤选项
      if (filters) {
        this.filters = { ...this.filters, ...filters }
      }
      
      try {
        const options = {
          ordering: this.filters.ordering || undefined,
          author: this.filters.author || undefined,
          is_published: this.filters.isPublished !== null ? this.filters.isPublished : undefined,
          category: this.filters.category || undefined
        }
        
        const response = await postService.searchPosts(query, 1, this.pagination.perPage, options)
        this.posts = response.posts
        this.pagination = response.pagination
      } catch (error: any) {
        this.error = error.message || '搜索帖子失败'
        console.error('搜索帖子错误:', error)
      } finally {
        this.loading = false
      }
    },
    /**
     * 创建新帖子
     * @param postData 帖子数据
     * @returns 创建的帖子
     */
    async createPost(postData: Omit<Post, 'id' | 'createdAt'>) {
      this.loading = true
      this.error = null

      try {
        const newPost = await postService.createPost(postData)
        this.posts.unshift(newPost)
        this.pagination.totalItems += 1
        return newPost
      } catch (error: any) {
        this.error = error.message || '创建帖子失败'
        console.error('创建帖子错误:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * 根据slug加载单个帖子
     * @param slug 帖子唯一标识
     */
    async loadPostBySlug(slug: string) {
      this.loading = true
      this.error = null
      this.currentPost = null

      try {
        this.currentPost = await postService.getPostBySlug(slug)
      } catch (error: any) {
        this.error = error.message || '加载帖子详情失败'
        console.error('加载帖子详情错误:', error)
      } finally {
        this.loading = false
      }
    },
    /**
     * 清空当前帖子和错误状态
     */
    clearCurrentPost() {
      this.currentPost = null
      this.error = null
    },
        /**
     * 更新帖子
     * @param slug 帖子唯一标识
     * @param updateData 更新数据
     * @returns 更新后的帖子
     */
async updatePost(slug: string, updateData: Partial<Post>) {
      this.loading = true
      this.error = null

      try {
        const updatedPost = await postService.updatePost(slug, updateData)
        
        // 更新posts列表中的帖子
        const index = this.posts.findIndex(post => post.slug === slug)
        if (index !== -1) {
          this.posts[index] = updatedPost
        }
        
        // 如果当前帖子是正在更新的帖子，则也更新currentPost
        if (this.currentPost && this.currentPost.slug === slug) {
          this.currentPost = updatedPost
        }
        
        return updatedPost
      } catch (error: any) {
        this.error = error.message || '更新帖子失败'
        console.error('更新帖子错误:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * 删除帖子
     * @param id 帖子ID
     */
    async deletePost(slug: string) {
      this.loading = true
      this.error = null

      try {
        await postService.deletePostBySlug(slug)
        
        // 从posts列表中移除帖子
        this.posts = this.posts.filter(post => post.slug !== slug)
        
        // 如果当前帖子是被删除的帖子，则清空currentPost
        if (this.currentPost && this.currentPost.slug === slug) {
          this.currentPost = null
        }
        
        this.pagination.totalItems -= 1
      } catch (error: any) {
        this.error = error.message || '删除帖子失败'
        console.error('删除帖子错误:', error)
        throw error
      } finally {
        this.loading = false
      }
    }

  }
  
})