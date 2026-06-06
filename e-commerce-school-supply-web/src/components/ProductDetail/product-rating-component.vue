<template>
  <!-- Overall Rating (Rating + Stars + Reviews) -->
  <div class="flex flex-col justify-start space-y-1 m-3 md:m-5 dark:bg-gray-800 p-3 md:p-4 rounded-md">
    <h2 class="text-base md:text-lg lg:text-xl dark:text-white">{{ $t('productRating.overall') }}</h2>
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <h2 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl dark:text-white">{{ rating.toFixed(1) }}</h2>

      <div class="sm:ml-5">
        <!-- Stars Row -->
        <StarRating :rating="rating" />

        <!-- Reviews Count -->
        <span class="text-gray-600 text-xs md:text-sm dark:text-gray-400">{{ $t('productRating.reviews', { count: reviews }) }}</span>                 
      </div>
    </div>

    <!-- Recommendation Line -->
    <span class="text-gray-600 text-xs md:text-sm mt-1 dark:text-gray-400">
      {{ $t('productRating.recommendation', { recommendCount: recommend, reviewCount: reviews }) }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import StarRating from '../ui/StarRating.vue';

export default defineComponent({
  name: 'ProductRatingComponent',
  components: { StarRating },
  props: {
    rating: { type: Number, required: true },       // e.g., 4.0
    reviews: { type: Number, required: true },      // e.g., 150
    recommend: { type: Number, required: true }     // e.g., 140
  }
})
</script>
