<template>
  <div class="relative inline-block">
    <select :value="modelValue" @change="onChange" class="appearance-none px-3 py-2 bg-white border border-gray-300 rounded-sm text-sm min-w-[140px] focus:outline-none focus:ring-1 focus:ring-[#1A535C] dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-cyan-300">
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
    <span class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400"></span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

type OptionItem = { label: string; value: string }

export default defineComponent({
  name: 'DropDownComponent',
  props: {
    modelValue: { type: String, required: true },
    options: { type: Array as () => OptionItem[], required: true }
  },
  emits: ['update:modelValue'],
  setup(_, { emit }) {
    const onChange = (e: Event) => {
      const target = e.target as HTMLSelectElement
      emit('update:modelValue', target.value)
    }
    return { onChange }
  },
})
</script>
