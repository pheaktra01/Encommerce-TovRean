<script setup lang="ts">
import ProfileInfo from '@/components/profile/Info/ProfileInfo.vue'
import type { UserProfile } from '@/types/user'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  userDetail: UserProfile
}>()
</script>

<template>
  <div class="dark:text-white transition-colors">
    <h1 class="font-bold mb-5 dark:text-white">{{ t('profile.my_profile') }}</h1>
    <ProfileInfo
      :name="props.userDetail.username ?? props.userDetail.username ?? ''"
      :role="props.userDetail.role"
      :email="props.userDetail.email"
      :phone-number="props.userDetail.phoneNumber ?? props.userDetail.phoneNumber"
      :avatar="props.userDetail.avatarUrl ?? props.userDetail.avatarUrl ?? ''"
    />
  </div>
</template>
