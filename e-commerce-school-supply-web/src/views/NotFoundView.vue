<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
    <div class="text-center">
        <!-- Illustration or Icon -->
        <div class="mb-4">
            <IconMoodSadFilled class="w-32 h-32 text-gray-400 dark:text-gray-600 mx-auto" />
        </div>
        <!-- 404 Text -->
        <h1 class="text-9xl font-bold text-[#1A535C] dark:text-cyan-300 mb-4">404</h1>
        
        <!-- Error Message -->
        <h2 class="text-4xl font-bold text-gray-800 dark:text-white mb-2">{{ $t('notFound.title') }}</h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">{{ $t('notFound.message') }}</p>
        
        
        <!-- Action Buttons -->
        <div class="flex flex-col md:flex-row gap-4 justify-center">
            <button
            @click="goHome"
            class="px-8 py-3 bg-[#1A535C] text-white rounded-lg font-semibold hover:bg-[#15444a] dark:bg-[#1A535C] dark:hover:bg-[#2A7A8F] transition"
            >
            {{ $t('notFound.go_home') }}
            </button>
            <button
            @click="goBack"
            class="px-8 py-3 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
            >
            {{ $t('notFound.go_back') }}
            </button>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { IconMoodSadFilled } from '@tabler/icons-vue';
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'NotFoundView',
  components: {
    IconMoodSadFilled
  },
  setup() {
    const router = useRouter()

    const goHome = () => {
      router.push({ name: 'home' })
    }

    const goBack = () => {
      window.history.back()
    }

    return {
      goHome,
      goBack
    }
  }
})
</script>

<style scoped>
/* Additional styling if needed */
</style>
