<!-- src/components/common/Header.vue -->
<template>
  <header class="bg-base-200 shadow-md">
    <div class="navbar container mx-auto px-4">
      <!-- 左侧品牌 -->
      <div class="flex-1">
        <router-link to="/" class="text-xl font-bold text-primary">
          <div class="flex items-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            JacketleBlog
          </div>
        </router-link>
      </div>

      <!-- 右侧导航 -->
      <div class="flex-none">
        <!-- 汉堡菜单按钮 -->
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost lg:hidden">
            <Icon icon="mdi:menu" class="h-5 w-5" />
          </label>
          <!-- 抽屉菜单 -->
          <ul
              tabindex="0"
              class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 max-h-[min(80vh,500px)] overflow-visible z-50 absolute top-full right-0 mt-1"
          >
            <!-- 公共菜单项 -->
            <li>
              <router-link to="/" class="btn btn-ghost btn-sm text-base-content hover:text-primary transition-colors">
                <Icon icon="mdi:home" class="h-5 w-5 mr-1" />
                首页
              </router-link>
            </li>
            <li>
              <router-link to="/create" class="btn btn-ghost btn-sm text-base-content hover:text-primary transition-colors">
                <Icon icon="mdi:pencil" class="h-5 w-5 mr-1" />
                发帖
              </router-link>
            </li>
              <li>
                <router-link to="/about" class="btn btn-ghost btn-sm text-base-content hover:text-primary transition-colors">
                  <Icon icon="mdi:information-outline" class="h-5 w-5 mr-1" />
                  关于
                </router-link>
              </li>
            <li v-if="!isLoggedIn">
              <router-link to="/login" class="btn btn-ghost btn-sm text-base-content hover:text-primary transition-colors">
                <Icon icon="mdi:login" class="h-5 w-5 mr-1" />
                登录
              </router-link>
            </li>
            <li v-if="!isLoggedIn">
              <a href="http://localhost:8000/admin/" target="_blank" class="btn btn-ghost btn-sm text-base-content hover:text-primary transition-colors">
                <Icon icon="mdi:shield-account" class="h-5 w-5 mr-1" />
                后台管理
              </a>
            </li>
            <!-- 移动端用户菜单项 -->
            <li v-if="isLoggedIn" class="lg:hidden">
              <router-link to="/userProfile" class="btn btn-ghost btn-sm text-base-content hover:text-primary transition-colors w-full justify-start">
                <Icon icon="mdi:account" class="h-5 w-5 mr-1" />
                个人主页
              </router-link>
            </li>
            <li v-if="isLoggedIn" class="lg:hidden">
              <button @click="logout" class="btn btn-ghost btn-sm text-error hover:text-error-content transition-colors w-full justify-start">
                <Icon icon="mdi:logout" class="h-5 w-5 mr-1" />
                登出
              </button>
            </li>
            <!-- 移动端主题下拉菜单 -->
            <li>
              <div
                  class="dropdown dropdown-end"
                  @mouseenter="openThemeDropdown"
                  @mouseleave="closeThemeDropdown"
              >
                <div tabindex="0" class="btn btn-ghost btn-sm text-base-content hover:text-primary transition-colors">
                  <Icon icon="mdi:theme-light-dark" class="h-5 w-5" />
                  主题
                </div>
                <ul
                    v-if="isThemeDropdownOpen"
                    class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 max-h-[min(80vh,500px)] overflow-y-auto z-[9999] absolute top-0 right-full mr-1"
                >
                  <li v-for="theme in themes" :key="theme">
                    <button @click="changeTheme(theme)" class="capitalize text-base-content hover:text-primary transition-colors">
                      {{ getTranslatedTheme(theme) }}
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <!-- 桌面端导航 -->
        <ul class="menu menu-horizontal px-1 space-x-2 flex-wrap hidden lg:flex items-center">
          <!-- 公共菜单项 -->
          <li>
            <router-link
                to="/"
                class="btn btn-ghost hover:bg-base-200 transition-colors text-base-content hover:text-primary"
            >
              <Icon icon="mdi:home" class="h-5 w-5 mr-1" />
              首页
            </router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link
                to="/create"
                class="btn btn-ghost hover:bg-base-200 transition-colors text-base-content hover:text-primary"
            >
              <Icon icon="mdi:pencil" class="h-5 w-5 mr-1" />
              发帖
            </router-link>
          </li>
          <li>
            <router-link
                to="/about"
                class="btn btn-ghost hover:bg-base-200 transition-colors text-base-content hover:text-primary"
            >
              <Icon icon="mdi:information-outline" class="h-5 w-5 mr-1" />
              关于
            </router-link>
          </li>
          <li v-if="!isLoggedIn">
            <router-link
                to="/login"
                class="btn btn-ghost hover:bg-base-200 transition-colors text-base-content hover:text-primary"
            >
              <Icon icon="mdi:login" class="h-5 w-5 mr-1" />
              登录
            </router-link>
          </li>
          <li v-if="isLoggedIn">
          <a
                href="http://localhost:8000/admin/"
                target="_blank"
                class="btn btn-ghost hover:bg-base-200 transition-colors text-base-content hover:text-primary"
            >
              <Icon icon="mdi:shield-account" class="h-5 w-5 mr-1" />
              后台管理
            </a>
          </li>

          <!-- 用户下拉菜单 -->
          <li v-if="isLoggedIn" class="relative">
            <div class="dropdown dropdown-end">
              <div
                  tabindex="0"
                  class="btn btn-ghost hover:bg-base-200 transition-colors text-base-content hover:text-primary"
              >
                <Icon icon="mdi:account" class="h-5 w-5 mr-1" />
                {{ user?.username }}
              </div>
              <ul
                  tabindex="0"
                  class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 max-h-[min(80vh,500px)] overflow-y-auto z-[9999] absolute top-full right-0 mt-1"
              >
                <li>
                  <router-link
                      to="/userProfile"
                      class="btn btn-ghost w-full justify-start hover:bg-base-200 transition-colors text-base-content hover:text-primary capitalize"
                  >
                    <Icon icon="mdi:account-box" class="h-4 w-4 mr-2" />
                    个人主页
                  </router-link>
                </li>
                <li>
                  <button
                      @click="logout"
                      class="btn btn-ghost w-full justify-start hover:bg-base-200 transition-colors text-error hover:text-error-content capitalize"
                  >
                    <Icon icon="mdi:logout" class="h-4 w-4 mr-2" />
                    登出
                  </button>
                </li>
              </ul>
            </div>
          </li>

          <!-- 主题选择菜单 -->
          <li class="relative">
            <div class="dropdown dropdown-end">
              <div
                  tabindex="0"
                  class="btn btn-ghost hover:bg-base-200 transition-colors text-base-content hover:text-primary"
              >
                <Icon icon="mdi:theme-light-dark" class="h-5 w-5 mr-1" />
                主题
              </div>
              <ul
                  tabindex="0"
                  class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 max-h-[min(80vh,500px)] overflow-y-auto z-[9999] absolute top-full right-0 mt-1"
              >
                <li v-for="theme in themes" :key="theme">
                  <button
                      @click="changeTheme(theme)"
                      class="btn btn-ghost w-full justify-start hover:bg-base-200 transition-colors text-base-content hover:text-primary capitalize"
                  >
                    {{ getTranslatedTheme(theme) }}
                  </button>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore.ts' // 假设使用 Pinia 状态管理
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// 登录状态和用户信息
const isLoggedIn = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)

// 登出方法
const logout = () => {
  authStore.logout()
  router.push('/login')
}

// 主题列表（英文）
const themes = ref([
  'light',
  'dark',
  'cupcake',
  'synthwave',
  'retro',
  'cyberpunk',
  'aqua',
  'pastel',
  'forest'
])

// 定义主题类型
type ThemeType = (typeof themes.value)[number]

// 声明 themeTranslations 类型
const themeTranslations: Record<ThemeType, string> = {
  light: '明亮',
  dark: '暗黑',
  cupcake: '纸杯蛋糕',
  synthwave: '赛博波浪',
  retro: '复古',
  cyberpunk: '赛博朋克',
  aqua: '水蓝色',
  pastel: '粉彩',
  forest: '森林'
}

// 获取中文主题名（类型安全）
const getTranslatedTheme = (theme: ThemeType): string => {
  return themeTranslations[theme] || theme
}

// 恢复 DaisyUI 4.x 的主题切换方法
const changeTheme = (theme: string) => {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
  window.dispatchEvent(new CustomEvent('theme-changed', { detail: theme }))
}

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'

  if (themes.value.includes(savedTheme)) {
    changeTheme(savedTheme)
  } else {
    changeTheme('light')
  }
})

// 主题下拉菜单控制逻辑
const isThemeDropdownOpen = ref(false)

const openThemeDropdown = () => {
  isThemeDropdownOpen.value = true
}

const closeThemeDropdown = () => {
  isThemeDropdownOpen.value = false
}
</script>