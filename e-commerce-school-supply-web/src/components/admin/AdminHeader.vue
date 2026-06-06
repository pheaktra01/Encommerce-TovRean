<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm transition-colors">
    <div class="max-w-7xl mx-auto px-6 py-4">
      <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ $t('admin.dashboard') }}</h1>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Language Switcher -->
          <LangagueSwitcher />
          
          <!-- Theme Toggle -->
          <button
            @click="themeStore.toggleTheme()"
            class="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            :aria-label="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            title="Toggle theme"
          >
            <IconSun v-if="!themeStore.isDark" :size="20" class="text-gray-700" />
            <IconMoon v-else :size="20" class="text-gray-200" />
          </button>

          <span class="text-gray-700 dark:text-gray-200">{{ $t('admin.welcome_admin') }}</span>
          <button @click="handleSignOut" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            {{ $t('admin.sign_out') }}
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import LangagueSwitcher from '@/components/ui/LangagueSwitcher.vue'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { IconSun, IconMoon } from '@tabler/icons-vue'

const authStore = useAuthStore()
const themeStore = useThemeStore()

const handleSignOut = async () => {
  await authStore.logout()
}
</script>
