<template>
  <button 
    @click="toggleLanguage" 
    class="flex items-center gap-2 cursor-pointer hover:text-[#114B5F] transition-colors dark:text-gray-300"
    :disabled="isLoading"
    type="button"
  >
    <i class="pi pi-globe text-xl"></i>
    
    <span v-if="isLoading" class="text-xs">...</span>
    <span v-else class="uppercase font-medium">
      {{ currentLocale === 'en' ? 'EN' : 'KH' }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { switchLanguage } from '@/i18n' 

const { locale } = useI18n()
const isLoading = ref(false)

// Computed property to track current language
const currentLocale = computed(() => locale.value)

const toggleLanguage = async () => {

  const newLocale = currentLocale.value === 'en' ? 'kh' : 'en'
  
  // 2. Switch language
  isLoading.value = true
  await switchLanguage(newLocale)
  isLoading.value = false
}
</script>