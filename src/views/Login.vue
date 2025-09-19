<template>
  <div
      class="login-container min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 px-4">
    <div class="w-full max-w-md">
      <!-- 卡片容器 -->
      <div
          class="card bg-base-100 shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
        <!-- 头部装饰 -->
        <div class="bg-gradient-to-r from-pink-400 to-purple-500 p-6 text-center">
          <div class="avatar placeholder">
            <div
                class="bg-primary text-neutral-content rounded-full w-20 h-20 mx-auto flex items-center justify-center">
              <icon icon="mdi:cat" class="w-10 h-10"/>
            </div>
          </div>
          <h1 class="card-title mt-3 text-white">欢迎回来</h1>
          <p class="text-white opacity-80 text-sm">登录你的小博客</p>
        </div>

        <!-- 登录表单 -->
        <form @submit.prevent="handleLogin" class="card-body space-y-5">
  <!-- 用户名 -->
  <div class="form-control">
    <label class="label">
      <span class="label-text flex items-center">
        <icon icon="mdi:user-outline" class="mr-2 w-5 h-5 text-gray-500"/>
        用户名
      </span>
    </label>
    <input
      type="text"
      v-model="loginForm.username"
      placeholder="请输入用户名"
      class="input input-bordered rounded-xl"
      :class="{ 'border-red-500': usernameError }"
      required
    />
    <p v-if="usernameError" class="text-red-500 text-xs mt-1">{{ usernameError }}</p>
  </div>

  <!-- 密码 -->
  <div class="form-control">
    <label class="label">
      <span class="label-text flex items-center">
        <icon icon="mdi:lock-outline" class="mr-2 w-5 h-5 text-gray-500"/>
        密码
      </span>
    </label>
    <input
      type="password"
      v-model="loginForm.password"
      placeholder="请输入密码"
      class="input input-bordered rounded-xl"
      :class="{ 'border-red-500': passwordError }"
      required
    />
    <p v-if="passwordError" class="text-red-500 text-xs mt-1">{{ passwordError }}</p>
  </div>

  <!-- 记住我 -->
  <div class="form-control">
    <label class="label cursor-pointer flex items-center gap-2">
      <input type="checkbox" v-model="loginForm.remember" class="checkbox checkbox-primary checkbox-sm"/>
      <span class="label-text">记住我</span>
    </label>
  </div>

          <!-- 登录按钮 -->
      <button
        type="submit"
        class="btn btn-primary w-full rounded-xl text-white font-medium"
        :disabled="isLoading || !isFormValid"
      >
            <span v-if="!isLoading">立即登录</span>
            <span v-else class="loading loading-dots loading-md"></span>
          </button>

          <!-- 错误消息显示 -->
          <div v-if="errorMessage" class="text-red-500 text-sm text-center mt-2">
            {{ errorMessage }}
          </div>
        </form>

        <!-- 社交登录 (注释掉的部分保持不变) -->
        <!--        <div class="card-body pt-0 border-t border-base-200">-->
        <!--          <div class="divider">其他方式登录</div>-->
        <!--          <div class="flex justify-center gap-4">-->
        <!--            <button-->
        <!--              class="btn btn-outline btn-ghost p-0 w-10 h-10 rounded-full hover:bg-primary/5 transition"-->
        <!--              @click="socialLogin('qq')"-->
        <!--            >-->
        <!--              <icon icon="logos:qq" class="w-6 h-6" />-->
        <!--            </button>-->
        <!--            <button-->
        <!--              class="btn btn-outline btn-ghost p-0 w-10 h-10 rounded-full hover:bg-green-500/5 transition"-->
        <!--              @click="socialLogin('wechat')"-->
        <!--            >-->
        <!--              <icon icon="ri:weixin-fill" class="w-6 h-6" />-->
        <!--            </button>-->
        <!--            <button-->
        <!--              class="btn btn-outline btn-ghost p-0 w-10 h-10 rounded-full hover:bg-gray-700/5 transition"-->
        <!--              @click="socialLogin('github')"-->
        <!--            >-->
        <!--              <icon icon="logos:github" class="w-6 h-6" />-->
        <!--            </button>-->
        <!--          </div>-->
        <!--        </div>-->

        <!-- 底部链接 -->
        <div class="card-body pt-0 border-t border-base-200">
          <div class="flex justify-between text-sm">
            <router-link to="/register" class="link link-primary">立即注册</router-link>
            <router-link to="/" class="link link-primary">跳过登录</router-link>
          </div>
          <p class="text-center text-gray-500 text-xs mt-2">
            <a href="#" class="link link-hover">忘记密码？</a>
          </p>
        </div>
      </div>
    </div>
  </div>
  <!-- 确保你有一个 Footer 组件或者移除这一行 -->
  <!-- <Footer/> -->
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'; // 导入 useRoute 以获取重定向路径
import { Icon } from '@iconify/vue';
import { useAuthStore } from '../stores/authStore.ts'; // 导入你的认证 store

const router = useRouter();
const route = useRoute(); // 获取当前路由信息
const authStore = useAuthStore(); // 获取认证 store 实例

const isLoading = ref(false);
const errorMessage = ref(''); // 用于显示错误消息



// 表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false, // 记住我功能目前未实现，但保留字段
});

// 表单验证计算属性
const isUsernameValid = computed(() => {
  const username = loginForm.username.trim();
  return username.length >= 3 && username.length <= 20;
});

const isPasswordValid = computed(() => {
  const password = loginForm.password;
  return password.length >= 8 && password.length <= 20;
});

const isFormValid = computed(() => {
  return isUsernameValid.value && isPasswordValid.value;
});

// 验证错误消息
const usernameError = computed(() => {
  if (!loginForm.username.trim()) return '';
  return isUsernameValid.value ? '' : '用户名长度必须为3-20个字符';
});

const passwordError = computed(() => {
  if (!loginForm.password) return '';
  return isPasswordValid.value ? '' : '密码长度必须为8-20个字符，英文+数字';
});

// 登录处理
const handleLogin = async () => {
  // 表单验证
  if (!isFormValid.value) {
    errorMessage.value = '请检查输入的用户名和密码格式';
    return;
  }
  isLoading.value = true;
  errorMessage.value = ''; // 每次尝试登录前清除错误消息

  try {
    // 调用 Pinia store 中的 login 方法
    await authStore.login({
      username: loginForm.username,
      password: loginForm.password,
      remember: loginForm.remember// 传递记住我状态
    });

    // 登录成功后，检查是否有重定向路径
    const redirectPath = route.query.redirect as string || '/';
    router.push(redirectPath);
    console.log('登录成功，跳转至：', redirectPath);

  } catch (error: any) {
    // 登录失败，显示错误消息
    console.error('登录失败:', error);
    errorMessage.value = error.message || '登录失败，请检查用户名和密码。';
  } finally {
    isLoading.value = false;
  }
};

// 社交登录占位函数
const socialLogin = (platform: string) => {
  console.log(`正在用 ${platform} 登录...`);
  // 这里可以添加一个更友好的提示，例如使用 Toast 消息
};
onMounted(() => {
  // 设置浏览器标签页标题
  document.title = '用户登录 - JacketleBlog社区';
})
</script>

<style scoped>
/* 自定义阴影 */
.shadow-3xl {
  box-shadow: 0 30px 60px -10px rgba(0, 0, 0, 0.2);
}

/* 卡片过渡动画 */
.card:hover {
  transform: translateY(-4px);
}
</style>
