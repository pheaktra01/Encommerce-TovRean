<script setup lang="ts">
import QuantityInput from '@/components/QuantityInput.vue'
import StarRating from '@/components/ui/StarRating.vue'
import type { Item } from '@/types/cart';


const props = defineProps<{
  item: Item
}>()

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

const resolveItemImage = (item: Item) => {
  const raw = (Array.isArray(item.images) && item.images[0]) || item.image || ''
  const cleaned = typeof raw === 'string' ? raw.trim() : ''
  if (!cleaned) return '/Photo/ourproduct.png'
  if (cleaned.startsWith('/')) return `${String(API_BASE_URL).replace(/\/$/, '')}${cleaned}`
  return cleaned
}

// Define emits for parent communication
const emit = defineEmits<{
  (e: 'update-quantity', productId: string, newQuantity: number): void
  (e: 'remove', productId: string): void
}>()
</script>

<template>
  <div class="border-b border-neutral-black-100 pb-4 md:pb-6 last:border-b-0 dark:border-gray-700">
    <div class="relative grid grid-cols-1 lg:grid-cols-5 gap-3 md:gap-4">
      <!-- Product Image and Details -->
      <div class="lg:col-span-2">
        <div class="flex gap-3 md:gap-6 lg:gap-10 pr-8 lg:pr-0">
          <img :src="resolveItemImage(item)" :alt="item.name" class="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded flex-shrink-0" />

          <div class="flex-1 min-w-0">
            <h3 class="text-sm sm:text-base md:text-lg lg:text-xl font-medium mb-1 md:mb-2 dark:text-white truncate">
              {{ item.name }}
            </h3>

            <div class="space-y-0.5 md:space-y-1 text-2xs sm:text-xs dark:text-gray-400">
              <p>Item No: {{ item.itemNo }}</p>
              <p>Brand: {{ item.brand }}</p>
              <StarRating :rating="item.rating" :showNumber="true" class="mb-2 md:mb-3" />
            </div>
          </div>
        </div>
      </div>

      <!-- Price, Quantity, Total -->
      <div class="lg:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 lg:ml-20 dark:text-white ml-0 sm:ml-20">
        <div class="flex items-center gap-2 text-xs sm:text-sm">
          <span class="text-gray-600 dark:text-gray-400 sm:hidden">Price:</span>
          <span class="font-medium">${{ item.price.toFixed(2) }}</span>
        </div>
        
        <div class="flex items-center gap-2">
          <span class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm sm:hidden">Qty:</span>
          <QuantityInput
            :value="item.quantity"
            @update:value="(val) => emit('update-quantity', item.productId, val)"
          />
        </div>

        <div class="flex items-center gap-2 text-xs sm:text-sm">
          <span class="text-gray-600 dark:text-gray-400 sm:hidden">Total:</span>
          <span class="font-semibold">${{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
      </div>

      <!-- Remove Button -->
      <button 
        @click="emit('remove', item.productId)" 
        class="absolute right-0 top-0 lg:static lg:justify-self-end dark:text-white hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
        aria-label="Remove item"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-neutral-black-500" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>