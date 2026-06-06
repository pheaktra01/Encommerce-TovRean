<script setup lang="ts">
import MyAddress from '@/components/profile/MyAddress.vue'
import MyCard from '@/components/profile/MyCard.vue'
import MyFavorite from '@/components/profile/MyFavorite.vue'
import MyOrders from '@/components/profile/MyOrders.vue'
import MyProfile from '@/components/profile/MyProfile.vue'
import MyReviews from '@/components/profile/MyReviews.vue'
import type { UserProfile } from '@/types/user'
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import Sidebar from '@/components/layout/Sidebar.vue'
import Spinner from '@/components/ui/Spinner.vue'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useRoute } from 'vue-router'
const authStore = useAuthStore()
const favStore = useFavoriteStore();
const route = useRoute()

// 2. The fake user data
// const userData = ref<UserProfile>({
//   username: 'Sok Dara',
//   role: 'User',
//   email: 'sok.dara@example.com',
//   phoneNumber: '+855 12 345 678',
//   avatarUrl: 'https://i.pravatar.cc/150?img=11', // Free fake profile image service
// })

const allowedTabs = new Set(['profile', 'address', 'payment', 'orders', 'favorites', 'reviews'])

const defaultTab = computed(() => {
  // For regular users, show orders by default (instead of a dashboard-like profile tab)
  if (authStore.user?.role === 'admin') return 'profile'
  return 'orders'
})

const currentTab = ref<string>(defaultTab.value)

watch(
  () => route.query.tab,
  (tab) => {
    if (typeof tab === 'string' && allowedTabs.has(tab)) {
      currentTab.value = tab
    } else if (tab == null) {
      currentTab.value = defaultTab.value
    }
  },
  { immediate: true },
)

watch(defaultTab, (nextDefault) => {
  if (route.query.tab == null) currentTab.value = nextDefault
})
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 bg-white dark:bg-gray-900 transition-colors min-h-screen">
    <Sidebar v-model="currentTab"/>
    
    <div class="col-span-3">
      <div v-if="currentTab  === 'profile' && authStore.user">
        <MyProfile :user-detail="authStore.user" />
      </div>
      <div v-else-if="currentTab === 'address'">
        <MyAddress />
      </div>
      <div v-else-if="currentTab === 'payment'">
        <MyCard />
      </div>
      <div v-else-if="currentTab === 'orders'">
        <MyOrders />
      </div>
      <div v-else-if="currentTab === 'favorites'">
        <MyFavorite :fav-product="favStore.favProduct"/>
      </div>
      <div v-else-if="currentTab === 'reviews'">
        <MyReviews />
      </div>
    </div>
  </div>
</template>
