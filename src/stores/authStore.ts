// src/stores/authService.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/api/authService'
import type { User } from '@/types/index';
// 定义 API 基础 URL (在模拟模式下不再需要，但保留注释以备将来使用)
// const API_BASE_URL = 'http://localhost:3000/api';



interface AuthTokens {
    access: string;
    refresh: string;
    // expires_at 是一个 Unix 时间戳，表示 access_token 的过期时间
    // 例如：当前时间戳 + 3600 秒
    expires_at: number;
    refresh_expires_at: number; // 添加refresh_token过期时间
}

export const useAuthStore = defineStore('auth', () => {
    const tokens = ref<AuthTokens | null>(null);
    const user = ref<User | null>(null);
    const router = useRouter();

    // 追踪刷新 token 的请求，防止多次并发刷新 (在模拟模式下简化)
    let isRefreshing = false;
    let failedRequestsQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

    // 计算属性：判断用户是否已登录
    const isLoggedIn = computed(() => {
        // 检查是否有 access_token 并且 access_token 尚未过期
        return !!tokens.value?.access && Date.now() < (tokens.value.expires_at || 0);
    });
    const currentUser = computed(() => user.value);

    // --- 认证相关方法 ---

    /**
     * 模拟登录方法
     * @param credentials 用户名和密码
     * @returns Promise<void>
     */
    // async function login(credentials: { username: string; password: string }): Promise<void> {
    //     return new Promise((resolve, reject) => {
    //         isLoading.value = true; // 模拟加载状态
    //         setTimeout(() => {
    //             if (credentials.username && credentials.password) {
    //                 // 模拟登录成功，生成模拟 token 和过期时间
    //                 const expires_in = 3600; // 1小时后过期
    //                 const expires_at = Date.now() + expires_in * 1000;

    //                 tokens.value = {
    //                     access_token: 'mock-access-token-' + Date.now(),
    //                     refresh_token: 'mock-refresh-token-' + Date.now(),
    //                     expires_at: expires_at,
    //                 };
    //                 user.value = {
    //                     username: credentials.username,
    //                     // 模拟管理员角色：如果用户名为 'admin'，则赋予 'admin' 角色
    //                     roles: credentials.username === 'admin' ? ['user', 'admin'] : ['user'],
    //                 };

    //                 // 保存到 localStorage
    //                 localStorage.setItem('tokens', JSON.stringify(tokens.value));
    //                 localStorage.setItem('user', JSON.stringify(user.value));

    //                 console.log('模拟登录成功！');
    //                 resolve();
    //             } else {
    //                 // 模拟登录失败
    //                 reject(new Error('用户名或密码不能为空。'));
    //             }
    //             isLoading.value = false; // 模拟加载状态结束
    //         }, 1000); // 模拟网络延迟
    //     });
    // }
/**
 * 登录方法
 * @param credentials 用户名和密码
 * @returns Promise<void>
 */
async function login(credentials: { username: string; password: string; remember: boolean }): Promise<void> {
  isLoading.value = true;
  try {
    const response = await authService.login({
      username: credentials.username,
      password: credentials.password
    });
    
    const { access, refresh } = response.data;

    // access_token有效期1小时
    const expires_in = 3600;
    const expires_at = Date.now() + expires_in * 1000;
    
    // refresh_token有效期1天
    const refresh_expires_in = 86400;
    const refresh_expires_at = Date.now() + refresh_expires_in * 1000;

    tokens.value = {
      access: response.data.access,
      refresh: response.data.refresh,
      expires_at: expires_at,
      refresh_expires_at: refresh_expires_at
    };

    // 存储操作
    const storageOperation = () => {
      return new Promise((resolve, reject) => {
        try {
          if (credentials.remember) {
            localStorage.setItem('tokens', JSON.stringify(tokens.value));
            localStorage.setItem('remember', 'true');
          } else {
            sessionStorage.setItem('tokens', JSON.stringify(tokens.value));
            localStorage.setItem('remember', 'false');
          }
          resolve(null);
        } catch (storageError) {
          console.error('令牌存储操作失败:', storageError);
          reject(storageError);
        }
      });
    };

    // 确保存储完成后再获取用户资料
    await storageOperation();

    // 获取用户资料
    const userProfile: User = await authService.getUserProfile();

    // 获取用户信息
    user.value = {
      id: userProfile.id,
      username: userProfile.username,
      email: userProfile.email,
      nickname: userProfile.nickname,
      avatar: userProfile.avatar,
      bio: userProfile.bio,
      is_station_master: userProfile.is_station_master,
      date_joined: userProfile.date_joined || ''
    };
    
    // 存储用户信息
    if (credentials.remember) {
      localStorage.setItem('user', JSON.stringify(user.value));
    } else {
      sessionStorage.setItem('user', JSON.stringify(user.value));
    }
    
    console.log('登录成功！');

  } catch (error: any) {
    console.error('登录失败:', error);
    
    // 根据错误状态码或错误信息提供更明确的提示
    let errorMessage = '登录失败，请检查用户名和密码。';
    
    if (error.response?.status === 401) {
      errorMessage = '用户名或密码错误，请重新输入。';
    } else if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  } finally {
    isLoading.value = false;
  }
}
/**
 * 刷新 Access Token 方法
 * 这个方法通常只在 HTTP 拦截器中被调用
 * @returns Promise<string> 返回新的 access_token
 */
async function refreshAccessToken(): Promise<string> {
    if (isRefreshing) {
        // 如果已经在刷新中，则将后续请求加入队列
        return new Promise((resolve, reject) => {
            failedRequestsQueue.push({ resolve, reject });
        });
    }

    isRefreshing = true; // 标记正在刷新
    return new Promise(async (resolve, reject) => {
        try {
            if (!tokens.value?.refresh) {
                throw new Error('No refresh token available. User must re-login.');
            }

            // 调用后端API刷新令牌
            const response = await authService.refreshToken(tokens.value.refresh);
            
            // 从响应中提取新的访问令牌
            const { access } = response.data;
            
            // 设置新的过期时间
            const new_expires_in = 3600; // 新的过期时间
            const new_expires_at = Date.now() + new_expires_in * 1000;

            tokens.value = {
                ...tokens.value,
                access: access,
                expires_at: new_expires_at,
            };

            // 保存到存储中
            const rememberMe = localStorage.getItem('remember') === 'true';
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('tokens', JSON.stringify(tokens.value));

            // 执行队列中等待的请求
            failedRequestsQueue.forEach(p => p.resolve(tokens.value!.access));
            failedRequestsQueue = [];

            console.log('Token 刷新成功！');
            resolve(tokens.value!.access);
        } catch (error) {
            console.error('刷新 Token 失败！', error);
            // 刷新失败，强制用户登出
            logout();
            // 拒绝队列中所有等待的请求
            failedRequestsQueue.forEach(p => p.reject(error));
            failedRequestsQueue = [];
            reject(error); // 抛出错误
        } finally {
            isRefreshing = false; // 标记刷新完成
        }
    });
}

/**
 * 登出方法
 */
function logout(): void {
  tokens.value = null;
  user.value = null;
  // 清除两种存储中的数据
  localStorage.removeItem('tokens');
  localStorage.removeItem('user');
  localStorage.removeItem('remember');
  sessionStorage.removeItem('tokens');
  sessionStorage.removeItem('user');
  // 添加清除用户资料缓存的逻辑
  localStorage.removeItem('user_profile_cache');
  console.log('用户已登出。');
  // 检查当前路由是否在登录页，避免重复跳转
  if (router.currentRoute.value.name !== 'Login') {
    router.push('/login');
  }
}

    /**
     * 初始化时从 localStorage 恢复认证状态
     */
function initAuth(): void {
  // 先检查localStorage中是否有记住我的状态
  const rememberMe = localStorage.getItem('remember') === 'true';
  const storage = rememberMe ? localStorage : sessionStorage;
  
  const savedTokens = storage.getItem('tokens');
  const savedUser = storage.getItem('user');
  
  if (savedTokens) {
    try {
      const parsedTokens: AuthTokens = JSON.parse(savedTokens);
      const now = Date.now();
      
      // 检查access_token是否过期
      if (parsedTokens.expires_at && now < parsedTokens.expires_at) {
        tokens.value = parsedTokens;
        console.log(`从${rememberMe ? 'localStorage' : 'sessionStorage'}恢复Token成功。`);
      } else {
        console.warn('Token已过期，请重新登录。');
        logout();
      }
    } catch (e) {
      console.error('解析tokens失败:', e);
      logout();
    }
  }
  
  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser);
    } catch (e) {
      console.error('解析user失败:', e);
      user.value = null;
    }
  }
}

    // 在 store 初始化时调用
    initAuth();

    // 用于模拟加载状态 (在实际项目中通常由组件管理，但此处为了模拟效果)
    const isLoading = ref(false);

    return {
        tokens,
        user,
        isLoggedIn,
        currentUser,
        login,
        refreshAccessToken,
        logout,
        initAuth,
        isLoading // 暴露 isLoading 状态，方便在组件中使用
    };
});

// --- 配置 Axios 拦截器 ---
// 在模拟模式下，我们不需要 Axios 拦截器，因为没有实际的 API 请求
// export const setupAxiosInterceptors = () => {
//     const authStore = useAuthStore();

//     axios.interceptors.request.use(
//         config => {
//             const accessToken = authStore.tokens?.access_token;
//             if (accessToken && !config.url?.includes('/auth/login') && !config.url?.includes('/auth/refresh')) {
//                 config.headers.Authorization = `Bearer ${accessToken}`;
//             }
//             return config;
//         },
//         error => {
//             return Promise.reject(error);
//         }
//     );

//     axios.interceptors.response.use(
//         response => response,
//         async error => {
//             const originalRequest = error.config;
//             if (error.response?.status === 401 && !originalRequest._retry) {
//                 originalRequest._retry = true;

//                 try {
//                     const newAccessToken = await authStore.refreshAccessToken();
//                     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//                     return axios(originalRequest);
//                 } catch (refreshError) {
//                     console.error('Access Token 刷新失败，强制登出。', refreshError);
//                     authStore.logout();
//                     return Promise.reject(refreshError);
//                 }
//             }
//             return Promise.reject(error);
//         }
//     );
// };
