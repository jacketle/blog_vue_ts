<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-2">当前主题：{{ currentTheme }}</h2>
    <button v-for="theme in themes" :key="theme" @click="changeTheme(theme)" class="btn btn-sm m-1 capitalize">
      {{ theme }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const themes = ref([
  "light", "dark", "cupcake", "bumblebee", "emerald", "retro"
]);

const currentTheme = ref(localStorage.getItem('theme') || 'light');

const changeTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  currentTheme.value = theme;
};
</script>