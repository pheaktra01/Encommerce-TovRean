<script setup lang="ts">
import LangagueSwitcher from '@/components/ui/LangagueSwitcher.vue'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import type { LoginCredentials } from '@/types/auth'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const toast = useToastStore()
const router = useRouter()
const { t } = useI18n();

const form = ref<LoginCredentials>({
  email: '',
  password: '',
})

const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  try {
    await authStore.login({ email: form.value.email, password: form.value.password })

    // Show success toast and redirect
    toast.showToast(t('auth.toast_welcome'), 'success')

    // Check if user is admin
    if (authStore.user?.role === 'ADMIN') {
      setTimeout(() => {
        router.push({ name: 'Admin Dashboard' })
      }, 1500)
    } else {
      // Check if user was browsing as guest (likely has items in cart)
      const wasGuest = sessionStorage.getItem('guestMode') === 'true'

      setTimeout(() => {
        if (wasGuest) {
          router.push({ name: 'cart' })
        } else {
          router.push({ name: 'home' })
        }
      }, 1500)
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : t('auth.toast_error')
    toast.showToast(msg, 'error')
  } finally {
    isLoading.value = false
  }
}

const continueAsGuest = () => {
  // Set guest mode in sessionStorage
  sessionStorage.setItem('guestMode', 'true')
  router.push({ name: 'home' })
}

// Force light mode for auth pages
let wasDarkMode = false

onMounted(() => {
  wasDarkMode = document.documentElement.classList.contains('dark')
  document.documentElement.classList.remove('dark')
})

onBeforeUnmount(() => {
  if (wasDarkMode) {
    document.documentElement.classList.add('dark')
  }
})
</script>

<template>
  <div
    class="bg-cover bg-no-repeat bg-[url('../assets/images/auth_background.jpg')] min-h-screen object-fit bg-black/25 bg-blend-darken flex justify-center items-center"
  >
    <form
      @submit.prevent="handleLogin"
      class="relative w-full h-auto max-w-xl mx-auto bg-white/50 border-white/30 backdrop-blur-lg shadow-lg px-10 py-10 rounded-3 rounded lg:px-20"
    >
      <div class="absolute top-10 right-10">
        <langague-switcher/>
      </div>
      <h1 class="font-bold text-2xl"><span class="text-accent">Tov</span>Rean</h1>
      <p class="font-extralight text-lg">{{ $t('auth.slogan') }}</p>
      <p class="font-bold text-3xl w-full text-center my-5">{{ $t('auth.welcome_back') }}</p>
      <div class="flex flex-col justify-center items-center gap-3 w-full">
        <div class="mb-5 w-full">
          <label for="email" class="block mb-2 text-sm font-medium text-heading">{{ $t('auth.email_label') }}</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            class="bg-primary border border-default-medium text-heading text-sm rounded-base focus:ring-secondary focus:border-secondary block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="name@flowbite.com"
            required
          />
        </div>
        <div class="mb-5 w-full">
          <label for="password" class="block mb-2 text-sm font-medium text-heading">{{ $t('auth.password_label') }}</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            class="bg-primary border border-default-medium text-heading text-sm rounded-base focus:ring-secondary focus:border-secondary block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="••••••••"
            required
          />
        </div>
        <div class="flex justify-between items-start mb-5 w-full">
          <label for="remember" class="flex items-center w-1/2">
            <input id="remember" type="checkbox" class="w-4 h-4 border accent-accent rounded-xs" />
            <p class="ms-2 text-sm font-medium text-heading select-none">{{ $t('auth.remember_me') }}</p>
          </label>

          <router-link to="/forget" class="text-sm w-1/2 text-end hover:underline"
            >{{ $t('auth.forget_password') }}</router-link
          >
        </div>
        <div class="w-full mb-10">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full text-white bg-secondary box-border border border-transparent hover:bg-secondary/80 focus:ring-4 focus:ring-secondary/25 shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none mb-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg v-if="isLoading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? $t('common.loading') : $t('common.signin') }}</span>
          </button>
          <button
            @click="continueAsGuest"
            type="button"
            class="w-full text-secondary bg-white box-border border border-secondary hover:bg-gray-50 focus:ring-4 focus:ring-secondary/25 shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none mb-3"
          >
            {{ $t('auth.continue_guest') }}
          </button>
          <span class="text-extralight text-sm"
            >{{ $t('auth.no_account') }}
            <router-link to="/signup" class="text-accent hover:underline"
              >{{ $t('common.signup') }}</router-link
            ></span
          >
        </div>
      </div>
    </form>
  </div>
</template>
