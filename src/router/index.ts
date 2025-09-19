//src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/authStore.ts';

// 导入你的视图组件
// 请确保这些路径是正确的
import Home from '../views/Home.vue';
import LoginView from '../views/Login.vue';
import RegisterView from '../views/Register.vue';
import CreatePost from '../views/CreateArticle.vue';
import PostDetail from '../views/ArticleDetail.vue';
// import AdminDashboard from '../views/AdminDashboard.vue'; // 管理员页面示例
import NotFound from '../views/NotFound.vue';
import Test from '../views/Test.vue';
import UserProfile from '../views/UserProfile.vue';
import EditPost from '../views/EditPost.vue'; // 添加这一行
import SiteInfo from '../views/SiteInfo.vue';
import AuthorProfile from '../views/AuthorProfile.vue'; // 添加这一行
import Archive from '../views/Archive.vue'; // 添加这一行

// 定义路由规则
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
   {
    path: '/archive',
    name: 'Archive',
    component: Archive,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    // 如果已登录，访问登录页时重定向到首页
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      if (authStore.isLoggedIn) {
        next({ name: 'Home' });
      } else {
        next();
      }
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/userProfile',
    name: 'UserProfile',
    component: UserProfile,
  },
   {
    path: '/author/:username',
    name: 'AuthorProfile',
    component: AuthorProfile,
    props: true,
  },
  {
    path: '/create',
    name: 'CreatePost',
    component: CreatePost,
    meta: {
      requiresAuth: true, // 需要登录才能创建帖子
    }
  },
  {
    path: '/post/:postSlug', // 你的 postSlug 正则表达式很好，这里简化一下
    name: 'PostDetail',
    component: PostDetail,
    props: true,
  },
    {
    path: '/edit/:postSlug', // 添加这一块
    name: 'EditPost',
    component: EditPost,
    props: true,
    meta: {
      requiresAuth: true // 需要登录才能编辑帖子
    }
  },
  
  // {
  //   path: '/admin',
  //   name: 'AdminDashboard',
  //   component: AdminDashboard,
  //   meta: {
  //     requiresAuth: true, // 需要登录
  //     requiresRole: 'admin' // 需要管理员角色
  //   }
  // },
  {
    path: '/about',
    name: 'SiteInfo',
    component: SiteInfo,
  },
  // 404 页面，匹配所有未定义的路径
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（比如浏览器前进/后退），则滚动到该位置
    if (savedPosition) {
      return savedPosition;
    }
    // 如果路由有hash，滚动到对应的元素
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    }
    // 默认情况下滚动到页面顶部
    return { top: 0 };
  }
});

// 全局前置守卫 (Navigation Guard) (保持不变)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLoggedIn; // 使用 authStore 中更新后的 isLoggedIn
  const isStationMaster = authStore.user?.is_station_master || false;

  const requiresAuth = to.meta.requiresAuth;
  const requiredRole = to.meta.requiresRole as string | undefined;

  // 1. 检查路由是否需要认证
  if (requiresAuth) {
    // 1.1 如果用户未登录
    if (!isLoggedIn) {
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      });
    } else {
      // 1.2 用户已登录，检查角色权限
      if (requiredRole) {
        // 修改2: 根据实际角色需求调整检查逻辑
        if (requiredRole === 'admin' && !isStationMaster) {
          console.warn(`权限不足：需要站长权限，但用户不是站长`);
          next({ name: 'Home' });
        } else {
          // 认证和授权都通过
          next();
        }
      } else {
        // 不需要特定角色
        next();
      }
    }
  } else {
    // 2. 不需要认证的页面，直接放行
    next();
  }
});


export default router;
