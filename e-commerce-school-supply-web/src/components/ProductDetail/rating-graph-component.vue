<template>
  <div class="p-3 md:p-4 rounded-md">
    <h3 class="text-base md:text-lg lg:text-xl font-bold mb-3 md:mb-4 dark:text-white">{{ $t('ratingGraph.title') }}</h3>

    <!-- Rating Bars -->
    <div class="space-y-1 md:space-y-2">
      <div 
        v-for="(item, index) in ratings" 
        :key="index" 
        class="flex items-center gap-2 md:gap-3"
      >
        <span class="w-3 text-xs md:text-sm font-medium dark:text-gray-300">{{ item.stars }}</span>
        <span class="text-[#FF6B6B] text-base md:text-lg">★</span>
        <div class="flex-1 h-3 md:h-4 bg-gray-300 rounded-md overflow-hidden dark:bg-gray-600">
          <div 
            class="h-full bg-[#FF6B6B] rounded-md" 
            :style="{ width: item.percentage + '%' }"
          ></div>
        </div>
        <span class="w-6 md:w-8 text-right text-xs md:text-sm dark:text-gray-300">{{ item.count }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export interface RatingItem {
  stars: number      // 1 to 5
  count: number      // number of reviews for this star
  percentage: number // width percentage of the bar (0-100)
}

export default defineComponent({
  name: 'RatingGraphComponent',

  props: {
    ratings: {
      type: Array as () => RatingItem[],
      required: true
    }
  }
})
</script>
