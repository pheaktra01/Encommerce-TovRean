import authService from '@/services/authService'
import type { LoginCredentials, RegisterUserData } from '@/types/auth'
import type { UserProfile } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  // STATE
  const user = ref<UserProfile | null>(JSON.parse(sessionStorage.getItem('user') || 'null'))
  const token = ref<string | null>(sessionStorage.getItem('accessToken'))

  const error = ref<string | null>(null)
  const isLoading = ref<boolean | null>(null)
  // GETTER

  // ACTION
  async function login(credentials: LoginCredentials) {
    error.value = null
    isLoading.value = true

    try {
      const response = await authService.login(credentials)
      user.value = {
        username: response.data.username,
        email: response.data.email,
        role: response.data.role,
        phoneNumber: response.data.phoneNumber || '',
        avatarUrl: response.data.avatarUrl || '', // Ensure avatarUrl is always a string
      }
      token.value = response.data.token

      // Clear guest browsing flag when a real session starts
      sessionStorage.removeItem('guestMode')

      sessionStorage.setItem('user', JSON.stringify(user.value))
      sessionStorage.setItem('accessToken', token.value)
    } catch (err: unknown) {
      let error_message = 'Login Failed'
      if (err instanceof Error) {
        error_message = err.message
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = (err as any).response
        if (response?.data?.message) {
          error_message = response.data.message
        }
      }
      error.value = error_message
      console.log(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function register(userData: RegisterUserData) {
    error.value = null
    isLoading.value = true
    try {
      console.log('🔵 authStore: Calling authService.register...')
      const response = await authService.register(userData)
      console.log('🟢 authStore: Registration successful, response:', response)
      // If response is successful, return normally
      return response
    } catch (err: unknown) {
      console.log('🔴 authStore: Caught error in register function:', err)
      let error_message = 'An unknown error occurred. Please try again.'
      
      if (err instanceof Error) {
        console.log('🔴 authStore: Error is instance of Error, message:', err.message)
        error_message = err.message
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = (err as any).response
        console.log('🔴 authStore: Error has response property:', response)
        if (response?.data?.message) {
          error_message = response.data.message
          console.log('🔴 authStore: Extracted message from response:', error_message)
        }
      }
      
      error.value = error_message
      console.error('🔴 authStore: About to throw error with message:', error_message)
      throw new Error(error_message)
    } finally {
      isLoading.value = false
      console.log('🔵 authStore: Finally block executed, isLoading set to false')
    }
  }

  function logout() {
    user.value = null
    token.value = null
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('guestMode')
    router.push({ name: 'signin' })
  }

  async function updateProfile(partial: Partial<UserProfile>) {
    if (!user.value) return
    try {
      await authService.updateProfile(partial)
      // Refetch profile from server to get the updated data in correct format
      const res = await authService.getProfile()
      if (res.data) {
        user.value = {
          ...res.data,
          avatarUrl: res.data.avatarUrl || user.value.avatarUrl || '' // Ensure avatarUrl has a fallback
        }
        sessionStorage.setItem('user', JSON.stringify(user.value))
      } else {
        user.value = { ...user.value, ...partial, avatarUrl: partial.avatarUrl || user.value.avatarUrl || '' }
        sessionStorage.setItem('user', JSON.stringify(user.value))
      }
    } catch (err) {
      console.error('Failed to update profile on server', err)
      throw err
    }
  }

  async function uploadAvatar(file: File) {
    if (!user.value) throw new Error('Not authenticated')
    try {
      const res = await authService.uploadAvatar(file)
      const avatarUrl = res.data.avatarUrl
      user.value = { ...user.value, avatarUrl }
      sessionStorage.setItem('user', JSON.stringify(user.value))
      return avatarUrl
    } catch (err) {
      console.error('Failed to upload avatar', err)
      throw err
    }
  }

  async function changePassword(oldPassword: string, newPassword: string) {
    try {
      const res = await authService.changePassword(oldPassword, newPassword)
      return res.data
    } catch (err) {
      console.error('Failed to change password', err)
      throw err
    }
  }

  async function fetchUser() {
    if (token.value) {
      try {
        const res = await authService.getProfile()
        user.value = {
          ...res.data,
          avatarUrl: res.data.avatarUrl || ''
        }
        sessionStorage.setItem('user', JSON.stringify(user.value))
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        // Token might be invalid, so log out
        logout()
      }
    }
  }

  return {
    user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    uploadAvatar,
    fetchUser
  }
})
