<script setup lang="ts">
import Banner from '@/assets/images/banner.jpg'
import { computed, ref, type Component, reactive } from 'vue'
import InfoCard from './InfoCard.vue'
import BlankProfile from '@/assets/images/pfp_blank.jpeg'
import {
  IconMailFilled,
  IconPhoneFilled,
  IconUserCog,
  IconUserFilled,
} from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const API_BASE_URL = import.meta.env.VITE_API_URL as string

interface Props {
  name: string
  role: string
  email: string
  phoneNumber: string
  avatar?: string // Optional image
}

interface InfoItem {
  label: string
  value: string
  icon: Component
}

import { useAuthStore } from '@/stores/authStore'
const props = defineProps<Props>()
const authStore = useAuthStore()

const DEFAULT_AVATAR = BlankProfile

function isLikelyAvatarUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const s = value.trim()
  if (!s) return false
  // Support common safe sources: absolute urls, data/blob urls, and app-relative paths.
  return /^(https?:\/\/|data:image\/|blob:|\/|\.{1,2}\/)/.test(s)
}

const avatarSrc = computed(() => {
  return isLikelyAvatarUrl(form.avatar) ? form.avatar : DEFAULT_AVATAR
})

const isEditing = ref(false)
const showPasswordForm = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const form = reactive({
  name: props.name || '',
  email: props.email || '',
  phoneNumber: props.phoneNumber || '',
  avatar: props.avatar || '',
})

const selectedFile = ref<File | null>(null)

function onFileChange(e: Event) {
  const el = e.target as HTMLInputElement
  if (!el.files || el.files.length === 0) {
    selectedFile.value = null
    return
  }
  selectedFile.value = el.files[0] || null;
}

async function uploadSelectedFile() {
  if (!selectedFile.value) {
    alert(t('profile.alerts.choose_file_first'))
    return
  }
  try {
    const url = await authStore.uploadAvatar(selectedFile.value)
    form.avatar = url
    alert(t('profile.alerts.avatar_uploaded'))
  } catch (err) {
    console.error('Upload failed', err)
    alert(t('profile.alerts.upload_failed'))
  }
}

const userDetail = ref<InfoItem[]>([
  { label: t('profile.name'), value: form.name, icon: IconUserFilled },
  { label: t('profile.role'), value: props.role, icon: IconUserCog },
  { label: t('profile.email'), value: form.email, icon: IconMailFilled },
  { label: t('profile.phone_number'), value: form.phoneNumber, icon: IconPhoneFilled },
])

function startEdit() {
  isEditing.value = true
  showPasswordForm.value = false;
}

function cancelEdit() {
  isEditing.value = false
  // reset form to props
  form.name = props.name || ''
  form.email = props.email || ''
  form.phoneNumber = props.phoneNumber || ''
  form.avatar = props.avatar || ''
}

function startEditPassword() {
  showPasswordForm.value = true;
  isEditing.value = false;
}

async function saveEdit() {
  try {
    await authStore.updateProfile({
      username: form.name,
      email: form.email,
      phoneNumber: form.phoneNumber,
      avatarUrl: isLikelyAvatarUrl(form.avatar) ? form.avatar.trim() : '',
    })
    // update displayed details
    userDetail.value = [
      { label: t('profile.name'), value: form.name, icon: IconUserFilled },
      { label: t('profile.role'), value: props.role, icon: IconUserCog },
      { label: t('profile.email'), value: form.email, icon: IconMailFilled },
      { label: t('profile.phone_number'), value: form.phoneNumber, icon: IconPhoneFilled },
    ]
    isEditing.value = false
    alert(t('profile.alerts.profile_updated'))
  } catch (err) {
    console.error('Failed to save profile', err)
    alert(t('profile.alerts.save_profile_failed'))
  }
}

async function submitPasswordChange() {
  if (newPassword.value !== confirmPassword.value) {
    alert(t('profile.alerts.passwords_no_match'))
    return
  }
  try {
    await authStore.changePassword(oldPassword.value, newPassword.value)
    alert(t('profile.alerts.password_change_success'))
    showPasswordForm.value = false
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err) {
    console.error('Password change failed', err)
    alert(t('profile.alerts.password_change_failed'))
  }
}
</script>

<template>
  <div class="border border-default border-dashed rounded-base bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors">
    <div
      class="relative w-full h-48 bg-cover bg-center rounded-base"
      :style="{ backgroundImage: `url(${Banner})` }"
    >
      <img
        :src="`${API_BASE_URL}${avatarSrc}`"
        alt="profile"
        class="absolute -bottom-14 left-10 w-36 h-36 rounded-circle rounded-full border-5 border-white object-cover"
      />
      <div class="absolute top-4 right-4 flex gap-2">
        <button @click="startEdit" class="text-heading px-4 py-2 bg-neutral-primary box-border border border-transparent focus:ring-4 focus:ring-neutral-tertiary font-medium rounded-base text-sm focus:outline-none hover:bg-accent/70 hover:text-white transition dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-[#1A535C] dark:hover:text-white">
          {{ t('profile.edit') }}
        </button>
        <button @click="startEditPassword" class="text-heading px-4 py-2 bg-neutral-primary box-border border border-transparent focus:ring-4 focus:ring-neutral-tertiary font-medium rounded-base text-sm focus:outline-none hover:bg-accent/70 hover:text-white  transition dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-[#1A535C] dark:hover:text-white">
          {{ t('profile.change_password') }}
        </button>
      </div>
    </div>
    <div class="w-full mt-20 px-16 pb-10 text-gray-900 dark:text-gray-100">
      <h1 class="font-bold mt-5 text-xl">{{ t('profile.account_information') }}</h1>


      <div v-if="isEditing" class="mt-5 max-w-3xl">
        <form @submit.prevent="saveEdit" class="space-y-4">
          <div>
            <label class="block text-sm text-body mb-1 dark:text-gray-300">{{ t('profile.name') }}</label>
            <input v-model="form.name" class="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
          </div>
          <div>
            <label class="block text-sm text-body mb-1 dark:text-gray-300">{{ t('profile.email') }}</label>
            <input v-model="form.email" class="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
          </div>
          <div>
            <label class="block text-sm text-body mb-1 dark:text-gray-300">{{ t('profile.phone_number') }}</label>
            <input v-model="form.phoneNumber" class="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
          </div>
          <div>
            <label class="block text-sm text-body mb-1 dark:text-gray-300">{{ t('profile.avatar_url') }}</label>
            <input v-model="form.avatar" class="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            <p class="text-xs text-gray-500 mt-1 dark:text-gray-400">{{ t('profile.default_profile_picture_note') }}</p>
          </div>
          <div>
            <label class="block text-sm text-body mb-1 dark:text-gray-300">{{ t('profile.upload_avatar') }}</label>
            <input type="file" accept="image/*" @change="onFileChange" class="w-full p-2 text-gray-900 dark:text-gray-100" />
            <div class="flex gap-2 mt-2">
              <button type="button" @click="uploadSelectedFile" class="px-4 py-2 bg-[#1A535C] text-white rounded hover:bg-[#2A7A8F] transition-colors">{{ t('profile.upload') }}</button>
              <p class="text-xs text-gray-500 flex items-center dark:text-gray-400">{{ t('profile.avatar_url_note') }}</p>
            </div>
          </div>
          <div class="flex gap-2 justify-end">
            <button type="button" @click="cancelEdit" class="px-4 py-2 border rounded dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">{{ t('profile.cancel') }}</button>
            <button type="submit" class="px-4 py-2 bg-[#1A535C] text-white rounded hover:bg-[#2A7A8F] transition-colors">{{ t('profile.save') }}</button>
          </div>
        </form>
      </div>

      <div v-else-if="showPasswordForm" class="mt-6 max-w-md">
        <h3 class="font-semibold mb-3">{{ t('profile.change_password') }}</h3>
        <form @submit.prevent="submitPasswordChange" class="space-y-3">
          <div>
            <label class="block text-sm text-body mb-1 dark:text-gray-300">{{ t('profile.old_password') }}</label>
            <input v-model="oldPassword" type="password" class="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
          </div>
          <div>
            <label class="block text-sm text-body mb-1 dark:text-gray-300">{{ t('profile.new_password') }}</label>
            <input v-model="newPassword" type="password" class="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
          </div>
          <div>
            <label class="block text-sm text-body mb-1 dark:text-gray-300">{{ t('profile.confirm_new_password') }}</label>
            <input v-model="confirmPassword" type="password" class="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
          </div>
          <div class="flex gap-2 justify-end">
            <button type="button" @click="showPasswordForm = false" class="px-4 py-2 border rounded dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">{{ t('profile.cancel') }}</button>
            <button type="submit" class="px-4 py-2 bg-[#1A535C] text-white rounded hover:bg-[#2A7A8F] transition-colors">{{ t('profile.change') }}</button>
          </div>
        </form>
      </div>

      <div v-else class="flex flex-wrap gap-5 w-full justify-between items-center mt-5">
        <InfoCard
          v-for="detail in userDetail"
          :key="detail.label"
          :label="detail.label"
          :value="detail.value"
          :icon="detail.icon"
        />
      </div>
    </div>
  </div>
</template>
