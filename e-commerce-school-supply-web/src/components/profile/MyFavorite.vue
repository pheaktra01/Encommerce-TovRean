<script setup lang="ts">
import type { Product } from '@/types/product';
import FavoriteInfo from './Info/FavoriteInfo.vue'

const props = defineProps<{
  favProduct: Product[]
}>()

</script>

<template>
  <div class="border border-default border-dashed rounded-base p-5 bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors">
    <h1 class="mb-5 dark:text-white">My Favorites</h1>
    <FavoriteInfo :products="favProduct" />
  </div>
</template>
