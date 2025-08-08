<template>
  <div class="card card-compact bg-base-100 shadow-md hover:shadow-xl transition-shadow h-full">
    <div class="card-body">
      <router-link :to="`/${post.slug}`">
        <h2 class="card-title text-lg hover:text-primary transition-colors">
          {{ post.title }}
          <div v-if="post.isFeatured" class="badge badge-secondary badge-sm">精选</div>
        </h2>
      </router-link>

      <div class="prose prose-sm max-w-none text-base-content/70 mb-3 line-clamp-3">
        {{ post.content }}
      </div>

      <div class="card-actions justify-between items-center">
        <div class="flex items-center space-x-2">
          <div class="avatar">
            <div class="w-8 rounded-full">
              <img :src="post.authorAvatar" />
            </div>
          </div>
          <span class="text-sm">{{ post.author }}</span>
        </div>
        <div class="text-xs text-base-content/50">
          {{ formatDate(post.createdAt) }}
        </div>
      </div>

      <div class="flex flex-wrap gap-2 mt-3">
        <div v-for="tag in post.tags" :key="tag" class="badge badge-outline badge-sm">
          {{ tag }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Post } from '@/types'

defineProps({
  post: {
    type: Object as PropType<Post>,
    required: true
  }
})

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>