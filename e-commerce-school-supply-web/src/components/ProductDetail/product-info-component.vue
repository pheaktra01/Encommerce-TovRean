

<template>
  <div class="space-y-2 text-[16px] leading-tight">
    <h2 class="text-[32px] dark:text-white">
      {{ $t(title) }}
    </h2>

    <div
      v-for="(item, index) in info"
      :key="index"
      class="flex"
    >
      <span class="font-semibold w-32 dark:text-gray-300">
        {{ item.label }}:
      </span>
      <span class="dark:text-gray-400">{{ item.value }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

interface ProductInfoItem {
  label: string
  value: string
}

export default defineComponent({
  name: 'ProductInfo',

  props: {
    title: {
      type: String,
      required: false,
      default: 'productDetailCard.product_info'
    },
    info: {
      type: Array as PropType<ProductInfoItem[]>,
      required: true
    }
  },

  computed: {
    translatedTitle() {
      // You can access 'this.$t' in Options API
      return this.$t(this.title)
    }
  }
})
</script>