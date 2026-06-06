<template>
  <!-- Header: Total reviews + Sort -->
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-h-[60px] md:h-[70px] border-b border-gray-300 bg-[#F5F5F5] px-4 md:px-6 py-3 sm:py-0 dark:bg-gray-800 dark:border-gray-700">
    <h2 class="text-base md:text-lg lg:text-xl font-bold dark:text-white">{{ $t("reviews.title", {count: reviews.length}) }}</h2>

    <div class="flex items-center gap-2 text-xs md:text-sm dark:text-gray-300 w-full sm:w-auto">
      <span class="font-semibold whitespace-nowrap">{{ $t("reviews.sortBy") }}</span>
      <drop-down-component v-model="sortOption" :options="sortOptions" />
    </div>
  </div>

  <!-- Review List -->
  <div  class="bg-[#F5F5F5] w-full rounded-sm p-4 md:p-6 lg:p-10 space-y-4 md:space-y-6 dark:bg-gray-800">
    <review-card-component
      v-if="reviews.length > 0"
      v-for="(review, index) in visibleReviews"
      :key="review.id"
      :review="review"
    />

    <!-- See More / Show Less Buttons -->
    <div class="flex flex-col sm:flex-row justify-center mt-4 gap-3 sm:gap-4">
      <button
        v-if="visibleCount < sortedReviews.length"
        @click="seeMore()"
        class="px-4 md:px-6 py-2 text-sm md:text-base bg-[#1A535C] text-white rounded-sm font-semibold dark:bg-[#1A535C] dark:text-gray-100 dark:hover:bg-[#2A7A8F] transition"
      >
        {{ $t('reviews.seeMore') }}
      </button>

      <button
        v-if="visibleCount > initialVisibleCount"
        @click="showLess()"
        class="px-4 md:px-6 py-2 text-sm md:text-base bg-[#1A535C] text-white rounded-sm font-semibold dark:bg-[#1A535C] dark:text-gray-100 dark:hover:bg-[#2A7A8F] transition"
      >
        {{ $t('reviews.showLess') }}
      </button>
    </div>
    <div v-if="reviews.length === 0" class="w-full justify-center flex text-lg md:text-xl lg:text-2xl text-red-500 dark:text-red-400">
        <h1>{{ $t('reviews.noComments') }}</h1>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref, computed, type PropType, watch } from "vue";
import ReviewCardComponent from "./review-card-component.vue";
import DropDownComponent from "./drop-down-component.vue";

interface Review {
  id: string | number;
  profile: string;
  name: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  recommend: boolean;
  verified: boolean;
}

export default defineComponent({
  name: "ReviewsComponent",
  components: { ReviewCardComponent, DropDownComponent },

  props: {
    reviews: {
      type: Array as PropType<Review[]>,
      required: true
    },
    initialVisibleCount: {
      type: Number,
      default: 6
    }
  },

  setup(props) {
    const visibleCount = ref(props.initialVisibleCount);

    const sortOption = ref("newest");

    const sortOptions = [
      { label: "Newest", value: "newest" },
      { label: "Oldest", value: "oldest" },
      { label: "Highest Rating", value: "high_rating" },
      { label: "Lowest Rating", value: "low_rating" }
    ];

    // Computed property to sort reviews dynamically
    const sortedReviews = computed(() => {
      return [...props.reviews].sort((a, b) => {
        switch (sortOption.value) {
          case "newest":
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          case "oldest":
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          case "high_rating":
            return b.rating - a.rating;
          case "low_rating":
            return a.rating - b.rating;
          default:
            return 0;
        }
      });
    });

    // Slice sorted reviews for visible count
    const visibleReviews = computed(() =>
      sortedReviews.value.slice(0, visibleCount.value)
    );

    const seeMore = () => {
      visibleCount.value = Math.min(
        visibleCount.value + props.initialVisibleCount,
        sortedReviews.value.length
      );
    };

    const showLess = () => {
      visibleCount.value = props.initialVisibleCount;
    };

    return {
      visibleCount,
      visibleReviews,
      seeMore,
      showLess,
      sortOption,
      sortOptions,
      sortedReviews,
      initialVisibleCount: props.initialVisibleCount
    };
  }
});
</script>
