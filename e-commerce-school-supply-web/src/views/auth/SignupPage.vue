<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const toast = useToastStore()
const { t } = useI18n();

const authStore = useAuthStore()
// 1. Create reactive variables for the form data
const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false,
})

// 2. Helper to check if password is valid (for styling the hint text)
const isPasswordShort = computed(() => {
  return form.value.password.length > 0 && form.value.password.length < 8
})

const isPasswordValid = computed(() => {
  return form.value.password.length >= 8
})

// 3. Helper to check if passwords match
const passwordsMismatch = computed(() => {
  return form.value.confirmPassword.length > 0 && form.value.password !== form.value.confirmPassword
})

const isLoading = ref(false)

// Email validation regex
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Username validation - must be between 3 and 20 characters
const isValidUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 20
}

// 4. Handle Form Submission
const handleRegister = async () => {
  isLoading.value = true
  // Validate username
  if (!form.value.username.trim()) {
    toast.showToast(t('auth.username_required'), 'error')
    isLoading.value = false
    return
  }
  if (!isValidUsername(form.value.username)) {
    toast.showToast(t('auth.username_length'), 'error')
    return
  }

  // Validate email
  if (!form.value.email.trim()) {
    toast.showToast(t('auth.email_required'), 'error')
    isLoading.value = false
    return
  }
  if (!isValidEmail(form.value.email)) {
    toast.showToast(t('auth.email_invalid'), 'error')
    isLoading.value = false
    return
  }

  // Validate password
  if (!form.value.password.trim()) {
    toast.showToast(t('auth.password_required'), 'error')
    isLoading.value = false
    return
  }
  if (form.value.password.length < 8) {
    toast.showToast(t('auth.alert_password_short'), 'error')
    isLoading.value = false
    return
  }

  // Validate confirm password
  if (!form.value.confirmPassword.trim()) {
    toast.showToast(t('auth.confirm_password_required'), 'error')
    isLoading.value = false
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    toast.showToast(t('auth.password_mismatch'), 'error')
    isLoading.value = false
    return
  }

  const userData = {
    username: form.value.username,
    email: form.value.email,
    password: form.value.password,
    confirmPassword: form.value.confirmPassword,
  }

  try {
    console.log('Attempting registration with:', { username: userData.username, email: userData.email })
    await authStore.register(userData)
    // Only show success message if registration was successful (no error thrown)
    console.log('Registration successful')
    toast.showToast(t('auth.register_success'), 'success')

    setTimeout(() => {
      router.push('/signin')
    }, 1500)
  } catch (error: any) {
    // Error is already handled and displayed, no need to show success
    console.error('Registration failed with error:', error)
    const msg = error.message || t('auth.register_error')
    toast.showToast(msg, 'error')
  } finally {
    isLoading.value = false
  }
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
      @submit.prevent="handleRegister"
      class="w-full h-auto max-w-xl mx-auto bg-white/50 border-white/30 backdrop-blur-lg shadow-lg px-10 py-10 rounded-3 rounded lg:px-20"
    >
      <h1 class="font-bold text-2xl"><span class="text-accent">Tov</span>Rean</h1>
      <p class="font-extralight text-lg">{{ $t('auth.slogan') }}</p>
      <p class="font-bold text-3xl w-full text-center my-5">{{ $t('auth.create_account') }}</p>

      <div class="flex flex-col justify-center items-center gap-3 w-full">
        <div class="mb-2 w-full">
          <label for="name" class="block mb-2 text-sm font-medium text-heading">{{ $t('auth.username_label') }}</label>
          <input
            v-model="form.username"
            type="text"
            id="name"
            class="bg-primary border border-default-medium text-heading text-sm rounded-base focus:ring-secondary focus:border-secondary block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="UserName001"
            required
          />
        </div>

        <div class="mb-2 w-full">
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

        <div class="mb-2 w-full">
          <label for="password" class="block mb-2 text-sm font-medium text-heading">{{ $t('auth.password_label') }}</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            :class="{
              'border-red-500 focus:ring-red-500 focus:border-red-500': isPasswordShort,
              'border-green-500 focus:border-green-500 focus:ring-green-500': isPasswordValid,
            }"
            class="bg-primary border border-default-medium text-heading text-sm rounded-base focus:ring-secondary focus:border-secondary block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="••••••••"
            required
          />
          <p
            class="text-xs mt-1"
            :class="
              isPasswordShort
                ? 'text-red-500 font-medium'
                : isPasswordValid
                  ? 'text-green-600'
                  : 'text-body'
            "
          >
            {{ $t('auth.password_min_length') }}
          </p>
        </div>

        <div class="mb-2 w-full">
          <label for="confirmpassword" class="block mb-2 text-sm font-medium text-heading"
            >{{ $t('auth.confirm_password_label') }}</label
          >
          <input
            v-model="form.confirmPassword"
            type="password"
            id="confirmpassword"
            :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': passwordsMismatch }"
            class="bg-primary border border-default-medium text-heading text-sm rounded-base focus:ring-secondary focus:border-secondary block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="••••••••"
            required
          />
          <p v-if="passwordsMismatch" class="text-xs text-red-500 mt-1 font-medium">
            {{ $t('auth.password_min_length') }}
          </p>
        </div>

        <div class="flex justify-between items-start mb-5 w-full">
          <label for="remember" class="flex items-center w-full cursor-pointer">
            <input
              v-model="form.agree"
              id="remember"
              type="checkbox"
              class="w-4 h-4 border accent-accent rounded-xs"
              required
            />
            <p class="ms-2 text-sm font-medium text-heading select-none">
            {{ $t('auth.agree') }}
              <a href="#" class="text-accent hover:underline">{{ $t('auth.terms_conditions') }}</a>.
            </p>
          </label>
        </div>

        <div class="w-full mb-10">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full text-white bg-secondary box-border border border-transparent hover:bg-secondary/80 focus:ring-4 focus:ring-secondary/25 shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg v-if="isLoading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? $t('common.loading') : $t('common.signup') }}</span>
          </button>
          <span class="text-extralight text-sm">
            {{ $t('auth.already_have_account') }}
            <router-link to="/" class="text-accent hover:underline">{{ $t('common.signin') }}</router-link>
          </span>
        </div>
      </div>
    </form>
  </div>
</template>
