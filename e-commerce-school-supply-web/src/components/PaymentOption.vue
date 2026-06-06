<template>
  <div
    class="flex w-full h-[102px] items-center justify-between p-4 rounded-lg cursor-pointer transition-colors"
    :class="selected
      ? 'bg-[#1A535C] border-[#1A535C] text-white dark:!bg-[#1A535C] dark:!border-[#1A535C]'
      : 'border dark:bg-gray-800 dark:border-gray-700 text-black dark:text-gray-100'"
    @click="emitPay('select')"
  >
    <!-- Radio Button -->
    <div class="flex items-center gap-4">
      <div
        class="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center dark:border-gray-500"
        :class="{ 'border-white': selected }"
      >
        <div
          v-if="selected"
          class="w-3 h-3 bg-white rounded-full"
        ></div>
      </div>

      <!-- Label and Description -->
      <div>
        <p :class="selected ? 'text-white font-semibold' : 'text-black dark:text-gray-100 font-semibold'">
          {{ label }}
        </p>
        <p :class="selected ? 'text-white text-sm' : 'text-gray-500 dark:text-gray-300 text-sm'">
          {{ description }}
        </p>
      </div>
    </div>

    <!-- image -->
    <div>
      <img
        v-if="image"
        :src="image"
        :alt="label"
        class="w-12 h-8 object-contain"
        object-contain
      />
    </div>

  </div>
</template>

<script setup lang="ts">

defineProps<{
  label: string
  description: string
  image?: string | null
  selected: boolean
}>()

const emitPay = defineEmits<{
  (e: 'select'): void
}>()

</script>
