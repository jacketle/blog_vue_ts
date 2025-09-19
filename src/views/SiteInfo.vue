<template>
  <MainLayout>
    <div class="site-info-container max-w-4xl mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4 text-primary flex items-center justify-center">
          <span class="mr-3">👨‍💻</span>
          JacketleBlog
          <span class="ml-3">🌸</span>
        </h1>
        <p class="text-xl text-base-content opacity-80">一个融合程序员思维与二次元文化的博客平台</p>
      </div>

      <!-- 网站信息卡片 -->
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-8 border border-primary/20">
        <h2 class="text-2xl font-bold mb-4 text-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          关于网站
        </h2>
        <div class="space-y-4 text-base-content">
          <p>JacketleBlog是一个专为程序员和二次元爱好者打造的知识分享平台。在这里，你可以分享技术心得，也可以畅谈ACG文化。</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="flex items-center p-3 bg-base-200 rounded-lg">
              <span class="text-primary font-bold mr-2">📌</span>
              <span><strong>技术栈:</strong> Vue 3 + TypeScript + Tailwind CSS</span>
            </div>
            <div class="flex items-center p-3 bg-base-200 rounded-lg">
              <span class="text-primary font-bold mr-2">🚀</span>
              <span><strong>部署:</strong> Vite + Node.js</span>
            </div>
            <div class="flex items-center p-3 bg-base-200 rounded-lg">
              <span class="text-primary font-bold mr-2">🎨</span>
              <span><strong>UI框架:</strong> DaisyUI + Tailwind</span>
            </div>
            <div class="flex items-center p-3 bg-base-200 rounded-lg">
              <span class="text-primary font-bold mr-2">🔧</span>
              <span><strong>状态管理:</strong> Pinia</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 站长信息卡片 -->
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-8 border border-secondary/20">
        <h2 class="text-2xl font-bold mb-4 text-secondary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          关于站长
        </h2>
        <div class="flex flex-col md:flex-row gap-6">
          <div class="md:w-1/3 flex justify-center">
            <div class="avatar">
              <div class="w-32 h-32 rounded-full border-4 border-secondary">
                <img src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=stationmaster" alt="站长头像" class="bg-base-200" />
              </div>
            </div>
          </div>
          <div class="md:w-2/3 space-y-4 text-base-content">
            <div>
              <h3 class="text-xl font-bold text-secondary">Jacketle</h3>
              <p class="text-sm opacity-75">程序猿 & 二次元爱好者</p>
            </div>
            <p>一个热爱编程的研0研究生，同时也是一个爱看番的程序猿，致力于打造有趣且实用的技术分享平台。</p>
            <div class="space-y-2">
              <div class="flex items-center">
                <span class="w-24 font-bold text-secondary">技能树:</span>
                <div class="flex flex-wrap gap-2">
                  <span class="badge badge-outline badge-sm">Vue.js</span>
                  <span class="badge badge-outline badge-sm">TypeScript</span>
                  <span class="badge badge-outline badge-sm">Node.js</span>
                  <span class="badge badge-outline badge-sm">Python</span>
                  <span class="badge badge-outline badge-sm">Docker</span>
                </div>
              </div>
              <div class="flex items-center">
                <span class="w-24 font-bold text-secondary">爱好:</span>
                <div class="flex flex-wrap gap-2">
                  <span class="badge badge-outline badge-sm">动漫</span>
                  <span class="badge badge-outline badge-sm">游戏</span>
                  <span class="badge badge-outline badge-sm">音乐</span>
                  <span class="badge badge-outline badge-sm">摄影</span>
                </div>
              </div>
            </div>
            <div class="pt-2">
              <p class="italic">"代码是诗，二次元是梦，愿此站成为连接现实与幻想的桥梁。"</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 技术特色卡片 -->
      <div class="bg-base-100 rounded-xl shadow-lg p-6 border border-accent/20">
        <h2 class="text-2xl font-bold mb-4 text-accent flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          技术特色
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-base-200 rounded-lg border border-accent/30">
            <h3 class="font-bold text-accent mb-2 flex items-center">
              <span class="mr-2">⌨️</span> 代码高亮
            </h3>
            <p class="text-sm">支持多种编程语言的语法高亮，让技术分享更清晰</p>
          </div>
          <div class="p-4 bg-base-200 rounded-lg border border-accent/30">
            <h3 class="font-bold text-accent mb-2 flex items-center">
              <span class="mr-2">📱</span> 响应式设计
            </h3>
            <p class="text-sm">适配各种设备，无论是PC还是移动端都能完美浏览</p>
          </div>
          <div class="p-4 bg-base-200 rounded-lg border border-accent/30">
            <h3 class="font-bold text-accent mb-2 flex items-center">
              <span class="mr-2">🌙</span> 主题切换
            </h3>
            <p class="text-sm">支持多种主题模式，保护你的眼睛从每一个细节开始</p>
          </div>
        </div>
      </div>

      <!-- 二次元素材版权说明 -->
      <div class="text-center mt-8 text-sm opacity-75">
        <p>本站部分二次元素材来源于网络，仅用于非商业用途。如有侵权，请联系站长删除。</p>
        <p class="mt-1">头像由 <a href="https://dicebear.com/" target="_blank" class="link link-primary">DiceBear</a> 生成</p>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/components/common/MainLayout.vue';
import { onMounted } from 'vue';

onMounted(() => {
  // 设置浏览器标签页标题
  document.title = '站点信息 - JacketleBlog社区';
})
</script>

<style scoped>
.site-info-container {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 添加一些二次元风格的装饰元素 */
.site-info-container::before {
  content: "";
  position: fixed;
  top: 10%;
  left: 5%;
  width: 60px;
  height: 60px;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2364748b" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>');
  opacity: 0.1;
  z-index: -1;
  animation: float 8s ease-in-out infinite;
}

.site-info-container::after {
  content: "";
  position: fixed;
  bottom: 10%;
  right: 5%;
  width: 60px;
  height: 60px;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2364748b" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>');
  opacity: 0.1;
  z-index: -1;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}
</style>