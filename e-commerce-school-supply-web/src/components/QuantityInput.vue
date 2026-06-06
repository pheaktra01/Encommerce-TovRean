<template>
  <div class="flex items-center gap-4 border rounded px-4 py-2 w-fit dark:border-gray-600 dark:bg-gray-800 transition-colors">

    <button @click="updateQuantity(value - 1)" class="hover:text-accent dark:hover:text-cyan-300 h-full dark:text-gray-400">
      <IconMinus size="18"/>
    </button>

    <span class="text-center w-6 font-inter font-medium text-black dark:text-white">
      {{ value }}
    </span>

    <button @click="updateQuantity(value + 1)" class="hover:text-accent dark:hover:text-cyan-300 h-full dark:text-gray-400">
      <IconPlus size="18"/>
    </button>
  </div>
</template>

<script setup lang="ts">
import { IconMinus, IconPlus } from '@tabler/icons-vue';

defineProps<{
  value: number
}>()

const emit = defineEmits<{
  'update:value': [value: number]
}>()

const updateQuantity = (qty: number) => {
  if (qty > 0) {
    emit('update:value', qty)
  }
}
</script>
