<script setup lang="ts">
import { useToastStore } from '@/stores/toastStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const store = useToastStore()
// Use storeToRefs to keep reactivity for state, but destructure actions directly
const { isVisible, message, type } = storeToRefs(store)

// Dynamic Styles based on type
const alertClasses = computed(() => {
  return type.value === 'success'
    ? 'text-green-800 bg-green-50 border-green-200'
    : 'text-red-800 bg-red-50 border-red-200'
})
</script>

<template>
  <Transition name="slide-right">
    <div
      v-if="isVisible"
      class="fixed bottom-5 right-5 z-9999 w-full max-w-sm cursor-pointer"
      @click="store.hideToast()"
    >
      <div
        :class="[
          'flex items-center sm:items-center p-4 mb-4 text-sm rounded-lg border shadow-lg',
          alertClasses,
        ]"
        role="alert"
      >

        <div>
          {{ message }}
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
