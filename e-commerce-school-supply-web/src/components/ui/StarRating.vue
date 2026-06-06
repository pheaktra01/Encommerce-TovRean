<script setup lang="ts">
import { computed } from 'vue';

// Define props to accept the rating value and an optional showNumber flag
const props = defineProps<{
  rating?: number;
  showNumber?: boolean; // Optional: whether to show the "4.5" text
}>();

// Ensure rating defaults to 0 if undefined or null
const displayRating = computed(() => props.rating ?? 0);
</script>

<template>
  <div class="flex items-center text-[#FF6B6B]">
    <span v-if="showNumber" class="mr-2 font-semibold text-gray-800 dark:text-gray-200">
      {{ displayRating.toFixed(1) }}
    </span>

    <span class="text-[20px] flex items-center">
      <template v-for="n in 5" :key="n">
        <span v-if="n <= Math.floor(displayRating)">★</span>
        
        <span v-else-if="n - displayRating <= 0.5">⯪</span>
        
        <span v-else>☆</span>
      </template>
    </span>
  </div>
</template>