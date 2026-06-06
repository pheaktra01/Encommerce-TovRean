<template>
  <div class="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl shadow-md p-6 text-center w-full transition-colors">
    <img :src="avatar" alt="Avatar" class="w-24 h-24 mx-auto rounded-full object-cover object-top mb-4" />
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100">{{ name }}</h3>
    <p class="text-sm text-gray-500 dark:text-gray-300 mb-2">{{ role }}</p>
    <a
      class="inline-block bg-[#FF6B6B] text-white px-4 py-1 rounded-xs text-sm font-medium mb-4 hover:bg-[#ff8585] transition-colors">
      {{ email }}
    </a>
    <div class="flex justify-center gap-4 text-[#FF6B6B] text-xl">
      <a :href="facebook" target="_blank">
        <img :src="fb" alt=""></a>
      <a :href="github" target="_blank">
        <img :src="gh" alt=""></a>
      <a :href="linkedin" target="_blank">
        <img :src="li" alt=""></a>
    </div>
  </div>
</template>

<script setup lang="ts">
import fb from "@/assets/images/facebook.png"
import gh from "@/assets/images/github.png"
import li from "@/assets/images/Vector.png"
defineProps<{
  name: string
  role: string
  email: string
  avatar: string
  facebook: string
  github: string
  linkedin: string
}>()
</script>
