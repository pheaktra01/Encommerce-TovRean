<script setup lang="ts">
import { IconUserFilled } from '@tabler/icons-vue'
import type { Component } from 'vue'
const props = defineProps<{
  label: string
  value: string
  icon: Component
}>()
</script>

<template>
  <div
    class="group w-full max-w-lg bg-white dark:bg-gray-800 border border-default dark:border-gray-700 drop-shadow-lg p-5 rounded rounded-4 hover:bg-accent dark:hover:bg-[#1A535C] transition-colors"
  >
    <div class="flex flex-row justify-between items-center text-accent mb-5 group-hover:text-white dark:text-[#1A535C]">
      <h1 class="font-bold text-lg dark:text-gray-100 group-hover:text-white">{{ label }}</h1>
      <component :is="icon" class="w-5 h-5" />
    </div>
    <h1 class="font-light text-base text-heading dark:text-gray-200 group-hover:text-white">{{ value }}</h1>
  </div>
</template>
