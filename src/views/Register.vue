<template>
  <div class="register-container flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
    <div class="register-card w-full max-w-md card bg-base-100 shadow-2xl rounded-2xl overflow-hidden">
      <!-- 装饰性头部 -->
      <div class="bg-gradient-to-r from-pink-400 to-purple-500 p-6 text-center">
        <div class="avatar placeholder">
          <div class="bg-primary text-neutral-content rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <icon icon="mdi:unicorn" class="w-10 h-10" />
          </div>
        </div>
        <h1 class="card-title mt-3 text-white">加入我们</h1>
        <p class="text-white opacity-80 text-sm">创建你的博客账号</p>
      </div>

      <!-- 注册表单 -->
      <form @submit.prevent="handleRegister" class="card-body space-y-4">
        <!-- 用户名 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text flex items-center">
              <icon icon="mdi:user-outline" class="mr-2 w-5 h-5 text-gray-500" />
              用户名
            </span>
          </label>
          <input
            type="text"
            v-model="registerForm.username"
            placeholder="请输入用户名"
            class="input input-bordered rounded-xl"
            required
          />
          <div class="text-xs text-gray-500 mt-1">用户名长度为3-20个字符</div>
        </div>

        <!-- 邮箱 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text flex items-center">
              <icon icon="mdi:email-outline" class="mr-2 w-5 h-5 text-gray-500" />
              邮箱
            </span>
          </label>
          <input
            type="email"
            v-model="registerForm.email"
            placeholder="请输入邮箱地址"
            class="input input-bordered rounded-xl"
            required
          />
        </div>

        <!-- 密码 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text flex items-center">
              <icon icon="mdi:lock-outline" class="mr-2 w-5 h-5 text-gray-500" />
              密码
            </span>
          </label>
          <input
            type="password"
            v-model="registerForm.password"
            placeholder="请输入密码"
            class="input input-bordered rounded-xl"
            required
          />
          <div class="password-strength mt-2">
            <div class="progress progress-xs">
              <div class="progress-bar" :class="passwordStrength" :style="{ width: passwordStrengthWidth }"></div>
            </div>
            <span class="text-xs text-gray-500">{{ passwordStrengthText }}</span>
          </div>
        </div>

        <!-- 确认密码 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text flex items-center">
              <icon icon="mdi:lock-check-outline" class="mr-2 w-5 h-5 text-gray-500" />
              确认密码
            </span>
          </label>
          <input
            type="password"
            v-model="registerForm.confirmPassword"
            placeholder="请再次输入密码"
            class="input input-bordered rounded-xl"
            required
          />
        </div>

        <!-- 昵称 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text flex items-center">
              <icon icon="mdi:star-outline" class="mr-2 w-5 h-5 text-gray-500" />
              昵称
            </span>
          </label>
          <input
            type="text"
            v-model="registerForm.nickname"
            placeholder="请输入昵称（可选）"
            class="input input-bordered rounded-xl"
          />
        </div>

        <!-- 用户协议 -->
        <div class="form-control">
          <label class="cursor-pointer label">
            <input type="checkbox" v-model="registerForm.agreeTerms" required class="checkbox checkbox-primary checkbox-sm" />
            <span class="label-text ml-2">
              我已阅读并同意
              <a href="#" class="link link-primary">用户协议</a>
              和
              <a href="#" class="link link-primary">隐私政策</a>
            </span>
          </label>
        </div>

      <!-- 注册按钮 -->
      <button
        type="submit"
        class="btn btn-primary w-full rounded-xl text-white font-medium"
        :disabled="isLoading || !canSubmit"
      >
        <span v-if="!isLoading">立即注册</span>
        <span v-else class="loading loading-dots loading-md"></span>
      </button>
      
      <!-- 错误消息显示 -->
      <div v-if="errorMessage" class="text-red-500 text-sm text-center mt-2">
        {{ errorMessage }}
      </div>
      </form>

      <!-- 底部链接 -->
      <div class="card-body pt-0 border-t border-base-200">
        <p class="text-center text-sm">
          已有账号？
          <router-link to="/login" class="link link-primary">立即登录</router-link>
        </p>
      </div>
    </div>
  </div>
  <Footer/>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/api/authService'

const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref('')

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  agreeTerms: false
})

// 密码强度计算
const passwordStrength = computed(() => {
  const password = registerForm.password
  if (password.length === 0) return ''
  if (password.length < 6) return 'bg-red-500'
  if (password.length < 10 && /[A-Za-z]/.test(password) && /[0-9]/.test(password)) return 'bg-yellow-500'
  if (password.length >= 10 && /[A-Za-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) return 'bg-green-500'
  return 'bg-yellow-500'
})

const passwordStrengthWidth = computed(() => {
  const password = registerForm.password
  if (password.length === 0) return '0%'
  if (password.length < 6) return '33%'
  if (password.length < 10) return '66%'
  return '100%'
})

const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 'bg-red-500': return '弱'
    case 'bg-yellow-500': return '中等'
    case 'bg-green-500': return '强'
    default: return ''
  }
})

// 表单提交条件
const canSubmit = computed(() => {
  return registerForm.username.length >= 3 &&
         registerForm.email.includes('@') &&
         registerForm.password.length >= 6 &&
         registerForm.password === registerForm.confirmPassword &&
         registerForm.agreeTerms
})

// 注册处理
const handleRegister = async () => {
  if (!canSubmit.value) return

  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // 准备注册数据
const userData = {
  username: registerForm.username,
  email: registerForm.email,
  password: registerForm.password,
  password_confirm: registerForm.confirmPassword, // 添加确认密码字段
  nickname: registerForm.nickname || undefined
};
    
    // 调用注册API
    await authService.register(userData)
    
    // 注册成功后，跳转到登录页
    alert('注册成功！请登录。')
    router.push('/login')
  } catch (error: any) {
    console.error('注册失败:', error)
    // 显示错误消息
if (error.response?.data) {
    // 处理后端返回的验证错误
    const errorData = error.response.data;
    const errorMessages: string[] = [];

    // 收集所有错误信息
    if (errorData.username) errorMessages.push(`用户名: ${errorData.username[0]}`);
    if (errorData.email) errorMessages.push(`邮箱: ${errorData.email[0]}`);
    if (errorData.password) errorMessages.push(`密码: ${errorData.password[0]}`);
    if (errorData.confirm_password) errorMessages.push(`确认密码: ${errorData.confirm_password[0]}`);
    if (errorData.non_field_errors) errorMessages.push(...errorData.non_field_errors);
    if (errorData.detail) errorMessages.push(errorData.detail);

    // 显示所有错误
    errorMessage.value = errorMessages.length > 0
      ? errorMessages.join('; ') 
      : '注册失败，请稍后重试。';
  } else {
    errorMessage.value = '网络错误，请稍后重试。';
  }
  } finally {
    isLoading.value = false
  }
}
onMounted(() => {
  // 设置浏览器标签页标题
  document.title = '用户注册 - JacketleBlog社区';
})
</script>

<style scoped>
/* 自定义进度条样式 */
.progress-bar {
  height: 4px;
  transition: width 0.3s ease;
}
</style>