import './index.css' // 添加这一行
import { Icon } from '@iconify/vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'


const app = createApp(App)
// 注册为 kebab-case 组件名
app.component('icon', Icon)
app.use(createPinia())
app.use(router)

app.mount('#app')