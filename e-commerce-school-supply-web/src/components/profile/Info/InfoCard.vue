<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  label: string
  value: string
  icon: Component
}

defineProps<Props>()
</script>

<template>
  <div class="flex-1 min-w-[250px] border border-default dark:border-gray-700 rounded-base p-5 bg-white dark:bg-gray-800 transition-colors">
    <div class="flex items-center gap-3">
      <div class="text-accent dark:text-[#1A535C]">
        <component :is="icon" :size="24" />
      </div>
      <div class="flex-1">
        <p class="text-sm text-body font-medium dark:text-gray-300">{{ label }}</p>
        <p class="text-base text-heading font-semibold mt-1 dark:text-gray-100">{{ value }}</p>
      </div>
    </div>
  </div>
</template>
