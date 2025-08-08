<template>
  <div class="min-h-screen flex flex-col bg-base-100">
    <Header />

    <main class="flex-grow container mx-auto px-4 py-8">
      <slot />
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
</script>