<script setup lang="ts">
import AddressInfo from './Info/AddressInfo.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="dark:text-white transition-colors">
    <h1 class="dark:text-white">{{ t('profile.my_address') }}</h1>
    <AddressInfo />
  </div>
</template>
