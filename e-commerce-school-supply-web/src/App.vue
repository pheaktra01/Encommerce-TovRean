<script setup lang="ts">
import { initFlowbite } from 'flowbite'
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Toast from './components/ui/Toast.vue'
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
import { useAuthStore } from './stores/authStore'
import AdminHeader from './components/admin/AdminHeader.vue'
import AdminFooter from './components/admin/AdminFooter.vue'

const route = useRoute()
const authStore = useAuthStore()

const hideHeaderFooter = computed(() => {
  return route.meta.guest === true || route.meta.hideLayout === true
})

onMounted(() => {
  initFlowbite()
  authStore.fetchUser()
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors">
    <!-- Admin Layout -->
    <template v-if="authStore.user?.role === 'ADMIN'">
      <AdminHeader/>
      <main class="grow">
        <router-view v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </router-view>
      </main>
      <AdminFooter/>
    </template>

    <!-- Public Layout -->
    <template v-else>
      <Header v-if="!hideHeaderFooter" />
      <main class="grow">
        <router-view v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </router-view>
      </main>
      <Footer v-if="!hideHeaderFooter" />
    </template>

    <Toast />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-form,
.fade-leave-to {
  opacity: 0;
}
</style>
