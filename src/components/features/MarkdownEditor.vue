<template>
  <div ref="editorContainer" class="vditor-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

// Props
const props = defineProps<{
  modelValue: string
  editorId?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// Refs
const editorContainer = ref<HTMLElement | null>(null)
let vditorInstance: Vditor | null = null

// 生成唯一 ID
const editorId = props.editorId || 'vditor-' + Math.random().toString(36).substring(2, 11)

// 映射 DaisyUI 主题到 Vditor 主题
const vditorThemeMap: Record<string, 'dark' | 'classic'> = {
  dark: 'dark',
  light: 'classic',
  // 可以扩展更多主题的映射
  // 其他 DaisyUI 主题映射
  cupcake: 'classic',     // 浅色系
  synthwave: 'dark',   // 粉色调，适合浅色
  retro: 'classic',       // 复古风格，适合浅色
  cyberpunk: 'classic',      // 深色系，赛博朋克
  aqua: 'dark',        // 清新蓝色，适合浅色
  pastel: 'classic',      // 柔和色调，适合浅色
  forest: 'dark',         // 森林绿，深色系
}

// 获取当前应使用的 Vditor 主题
const getVditorTheme = (): 'dark' | 'classic' => {
  const currentTheme = localStorage.getItem('theme') || 'light'
  return vditorThemeMap[currentTheme] || 'classic'
}
// 初始化 Vditor
onMounted(() => {
  if (!editorContainer.value) return
  const initialTheme = getVditorTheme()
  console.log('Vditor Theme:', initialTheme) // 调试日志
  vditorInstance = new Vditor(editorContainer.value, {
    value: props.modelValue,
    lang: 'zh_CN',
    cache: {
      id: editorId,
      enable: true
    },
    mode: 'wysiwyg',
    toolbar: [
      'emoji', 'headings', 'bold', 'italic', 'strike', 'link', '|',
      'list', 'ordered-list', 'check', 'outdent', 'indent', '|',
      'quote', 'line', 'code', 'inline-code', 'insert-before', 'insert-after', '|',
      'upload', 'table', '|', 'undo', 'redo', '|',
      'edit-mode', { name: 'more', toolbar: ['code-theme', 'content-theme', 'export', 'outline', 'preview'] }
    ],
    height: 500,
    theme: initialTheme,
    preview: {
      mode: 'both',
      actions: [],
      markdown: {
        autoSpace: true,
        fixTermTypo: false
      }
    },
    upload: {
      accept: 'image/jpg, image/jpeg, image/png',
      url: '/api/admin/uploadFile?type=99',
      multiple: false,
      fieldName: 'file',
      max: 2 * 1024 * 1024
    },
    input: (value: string) => {
      emit('update:modelValue', value)
    }
  })
// 监听主题变化事件
  const handleThemeChange = (event: CustomEvent) => {
    const newTheme = event.detail
    const vditorTheme = vditorThemeMap[newTheme] || 'classic'
    if (vditorInstance) {
      vditorInstance.setTheme(vditorTheme)
    }
  }

  window.addEventListener('theme-changed', handleThemeChange as EventListener)

  // 卸载时移除监听
  onBeforeUnmount(() => {
    if (vditorInstance) {
      vditorInstance.destroy()
      vditorInstance = null
    }
    window.removeEventListener('theme-changed', handleThemeChange as EventListener)
  })

})

// 响应外部 modelValue 变化
watch(
    () => props.modelValue,
    (newVal) => {
      if (vditorInstance && newVal !== vditorInstance.getValue()) {
        vditorInstance.setValue(newVal)
      }
    }
)


</script>

<style scoped>
.vditor-container {
  border: 1px solid #e4e4e4;
  border-radius: 4px;
}
</style>