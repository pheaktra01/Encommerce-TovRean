<script setup lang="ts">
import MyProfile from '@/components/profile/MyProfile.vue'
import { useAuthStore } from '@/stores/authStore';
import type { UserProfile } from '@/types/user'

import { onMounted, ref } from 'vue'

// Admin user data
const adminData = ref<UserProfile>();

const authStore = useAuthStore();

</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
    <!-- Main Content -->
    <div v-if="authStore.user" class="flex-1 bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded shadow p-6 transition-colors">
      <MyProfile :user-detail="authStore.user" />
    </div>

    <!-- Footer is provided by AdminDashboard; removed duplicate Footer here -->
  </div>
</template>
