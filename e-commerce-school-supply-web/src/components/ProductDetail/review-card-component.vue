<template>
  <div class="space-y-4 md:space-y-8 border-b border-gray-300 pb-4 md:pb-6 relative dark:border-gray-700">
    <!-- Edit/Delete Buttons -->
    <div v-if="editable" class="absolute bottom-2 right-2 flex gap-2">
      <button
        @click="$emit('edit')"
        class="px-2 py-1 text-xs md:text-sm rounded-sm font-semibold bg-[#1A535C] text-white hover:bg-[#15444a] dark:bg-[#1A535C] dark:text-gray-100 dark:hover:bg-[#2A7A8F] transition"
      >
        {{ $t("reviewCard.edit") }}
      </button>
      <button
        @click="$emit('delete')"
        class="px-2 py-1 text-xs md:text-sm rounded-sm font-semibold border border-[#1A535C] text-[#1A535C] hover:bg-[#1A535C] hover:text-white dark:border-[#1A535C] dark:text-[#1A535C] dark:hover:bg-[#2A7A8F] dark:hover:text-gray-100 transition"
      >
        {{ $t("reviewCard.delete") }}
      </button>
    </div>

    <!-- Top Row: Profile + Name + Stars + Verified -->
    <div class="flex flex-col md:flex-row justify-between items-start gap-3">
      <!-- Left Profile + Name + Stars -->
      <div class="flex gap-2 md:gap-3 w-full">
        <img
          :src="avatarSrc"
          alt="User Profile"
          class="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
        />

        <div class="space-y-1 flex-1 min-w-0">
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <h3 class="font-semibold text-sm md:text-base lg:text-lg dark:text-white">{{ review.name }}</h3>

            <!-- Stars -->
            <div class="flex items-center text-[#FF6B6B] text-sm md:text-base">
              <span v-for="n in 5" :key="n">
                {{ n <= Math.floor(review.rating) ? '★' : '☆' }}
              </span>
              <span class="text-gray-700 text-xs md:text-sm ml-2 dark:text-gray-400">({{ review.rating.toFixed(1) }})</span>
            </div>
          </div>

          <div class="text-gray-500 text-xs md:text-sm dark:text-gray-400">{{ formatDate(review.date) }}</div>

          <h4 class="mt-2 md:mt-3 font-semibold text-sm md:text-base lg:text-lg dark:text-white break-words">{{ review.title }}</h4>
          <p class="text-gray-700 text-xs md:text-sm leading-relaxed break-words dark:text-gray-300">{{ review.body }}</p>

          <p class="text-xs md:text-sm mt-2 font-medium dark:text-gray-300 break-words">
            {{ $t("reviewCard.recommend_prompt") }}
            <span :class="review.recommend ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              {{ review.recommend ? $t("reviewCard.recommend_yes") : $t("reviewCard.recommend_no") }}
            </span>
          </p>
        </div>
      </div>

      <!-- Verified -->
      <div v-if="review.verified" class="flex items-center gap-1 text-green-600 text-xs md:text-sm whitespace-nowrap dark:text-green-400 ml-12 md:ml-0">
        {{ $t("reviewCard.verified_purchase") }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BlankProfile from '@/assets/images/pfp_blank.jpeg'

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

export default defineComponent({
  name: "review-card-component",
  props: {
    review: { type: Object, required: true },
    editable: { type: Boolean, default: false }
  },
  computed: {
    avatarSrc(): string {
      const raw = (this as any)?.review?.profile
      if (typeof raw !== 'string') return BlankProfile
      const s = raw.trim()
      if (!s) return BlankProfile
      if (s.startsWith('/')) return `${String(API_BASE_URL).replace(/\/$/, '')}${s}`
      if (/^(https?:\/\/|data:image\/|blob:|\.{1,2}\/)/.test(s)) return s
      return BlankProfile
    },
  },
  methods: {
      formatDate(dateString: string) {
        if (!dateString) return ''
        // Split at 'T' and take the first part
        return dateString.split('T')[0]
      }
    }
});
</script>
