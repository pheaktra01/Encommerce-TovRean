import { defineStore } from 'pinia'
import { ref } from 'vue'

type ToastType = 'success' | 'error'

export const useToastStore = defineStore('toast', () => {
  const isVisible = ref(false)
  const message = ref('')
  const type = ref<ToastType>('success')
  let timeoutId: number | undefined

  // The Action to call from anywhere
  function showToast(msg: string, toastType: ToastType = 'success') {
    // 1. Set State
    message.value = msg
    type.value = toastType
    isVisible.value = true

    // 2. Clear previous timer if exists (prevents early closing if user clicks fast)
    if (timeoutId) clearTimeout(timeoutId)

    // 3. Auto-hide after 5 seconds
    timeoutId = window.setTimeout(() => {
      isVisible.value = false
    }, 5000)
  }

  function hideToast() {
    isVisible.value = false
  }

  return { isVisible, message, type, showToast, hideToast }
})
