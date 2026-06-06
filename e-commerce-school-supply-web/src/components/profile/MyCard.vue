<script setup lang="ts">
import CardEdit from './edit/CardEdit.vue'
import CardInfo from './Info/CardInfo.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="dark:text-white transition-colors">
    <h1 class="font-bold mb-4 dark:text-white">{{ t('profile.payment_options') }}</h1>
    <div class="border border-default border-dashed rounded-base p-5 bg-white dark:bg-gray-800 dark:border-gray-700">
      <h2 class="font-semibold mb-3 dark:text-gray-200">{{ t('profile.saved_cards') }}</h2>
      <CardInfo />
    </div>
  </div>
</template>
