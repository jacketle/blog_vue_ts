import axios from 'axios'
import type { User } from '../types/index';
// 创建认证专用的 Axios 实例
const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器，为需要认证的请求添加token
authClient.interceptors.request.use(
  config => {
    // 添加调试日志：检查存储中的内容
    // console.log('从localStorage读取:', localStorage.getItem('tokens'));
    // console.log('从sessionStorage读取:', sessionStorage.getItem('tokens'));
    
    // 从localStorage或sessionStorage中获取tokens对象
    const tokensStr = localStorage.getItem('tokens') || sessionStorage.getItem('tokens');
    // console.log('从存储中读取的令牌字符串:', tokensStr);
    if (tokensStr) {
      try {
        const tokens = JSON.parse(tokensStr);
        // console.log('解析后的令牌对象:', tokens);
        // 注意：这里使用的是access而不是access_token
        const token = tokens.access;
        // console.log('使用的access令牌:', token);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('解析tokens失败:', e);
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 认证API服务
export const authService = {
  /**
   * 用户登录
   * @param credentials 登录凭证
   * @returns 包含访问令牌和刷新令牌的响应
   */
  async login(credentials: { username: string; password: string }) {
    return authClient.post('/users/token/', credentials)
  },

  /**
   * 刷新访问令牌
   * @param refreshToken 刷新令牌
   * @returns 包含新访问令牌的响应
   */
  async refreshToken(refreshToken: string) {
    return authClient.post('/users/token/refresh/', { refresh: refreshToken })
  },
  
  /**
   * 用户注册
   * @param userData 用户注册信息
   * @returns 注册响应
   */
  async register(userData: { 
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  nickname?: string;
  }) {
    return authClient.post('/users/register/', userData)
  },
  
  /**
   * 获取用户资料
   * @returns 用户资料
   */
  async getUserProfile(): Promise<User> {
    const response = await authClient.get('/users/profile/');
    const userData = response.data;
    
    // 确保post_count和tag_count是整数类型
    if (userData.post_count !== undefined) {
      userData.post_count = parseInt(userData.post_count as any, 10);
    }
    if (userData.tag_count !== undefined) {
      userData.tag_count = parseInt(userData.tag_count as any, 10);
    }
    
    return userData;
  },
    /**
   * 更新用户资料
   * @param profileData 需要更新的用户资料数据
   * @returns 更新后的用户资料
   */
  async updateProfile(profileData: {
    username: string;
    nickname?: string;
    bio?: string;
    avatar_url?: string;  // 添加avatar_url字段
  }): Promise<User> {
    const response = await authClient.put('/users/profile/', profileData);
    return response.data;
  }
};
