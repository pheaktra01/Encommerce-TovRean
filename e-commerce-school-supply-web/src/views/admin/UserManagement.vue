<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { IconBan, IconCheck, IconDotsVertical } from '@tabler/icons-vue'
import adminService, { type User } from '@/services/adminService'
import defaultPf from '@/assets/images/pfp_blank.jpeg'

const API_BASE_URL = import.meta.env.VITE_API_URL as string
const { t } = useI18n()
const users = ref<User[]>([])
const selectedUsers = ref<string[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const activeDropdown = ref<string | null>(null)

// Toggle function
const toggleDropdown = (userId: string) => {
  if (activeDropdown.value === userId) {
    activeDropdown.value = null
  } else {
    activeDropdown.value = userId
  }
}

// Close dropdown when clicking outside
const closeDropdown = (e: MouseEvent) => {
  // If the click is NOT inside a relative container (our dropdown wrapper), close it
  const target = e.target as HTMLElement
  if (!target.closest('.dropdown-container')) {
    activeDropdown.value = null
  }
}

const handleDeactivate = async (user: User) => {
  // Simple confirmation
  if (!confirm(`Are you sure you want to deactivate ${user.username}?`)) {
    return
  }

  try {
    loading.value = true
    await adminService.deactivateUser(user.email)
    // Refresh the list to show updates
    await fetchUsers()
  } catch (err) {
    console.error('Failed to deactivate user:', err)
    alert('Failed to deactivate user. Please try again.')
  } finally {
    loading.value = false
  }
}

const handleActivate = async (user: User) => {
  if (!confirm(`Are you sure you want to activate ${user.username}?`)) {
    return
  }

  try {
    loading.value = true
    await adminService.activateUser(user.email)
    await fetchUsers() // Refresh list to see status change
  } catch (err) {
    console.error('Failed to activate user:', err)
    alert('Failed to activate user. Please try again.')
  } finally {
    loading.value = false
  }
}

// Fetch users from backend
const fetchUsers = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await adminService.getAllUsers()
    users.value = data.map((user) => ({
      ...user,
      // Provide fallback avatar using API base URL or default image
      avatarUrl: user.avatarUrl && user.avatarUrl.trim() !== '' ? `${API_BASE_URL}${user.avatarUrl}` : defaultPf,
    }))
  } catch (err) {
    console.error('Failed to fetch users:', err)
    error.value = t('admin.user_management.error_loading')
  } finally {
    loading.value = false
  }
}

// Refresh users every 30 seconds for real-time updates
onMounted(() => {
  window.addEventListener('click', closeDropdown)
  fetchUsers()
  const interval = setInterval(fetchUsers, 30000)
  return () => clearInterval(interval)
})

onUnmounted(() => {
  window.removeEventListener('click', closeDropdown)
})

const toggleSelectAll = () => {
  if (selectedUsers.value.length === users.value.length) {
    selectedUsers.value = []
  } else {
    selectedUsers.value = users.value.map((u) => u.id)
  }
}

const toggleSelectUser = (userId: string) => {
  const index = selectedUsers.value.indexOf(userId)
  if (index > -1) {
    selectedUsers.value.splice(index, 1)
  } else {
    selectedUsers.value.push(userId)
  }
}

const isSelected = (userId: string) => {
  return selectedUsers.value.includes(userId)
}

const formatDateTime = (value?: string) => {
  if (!value) return 'N/A'

  try {
    // Try parsing as ISO date or timestamp
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }
  } catch (e) {
    console.error('Date parsing error:', e)
  }

  // Return original value if parsing fails
  return value
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
    <!-- Main Content -->
    <div class="flex-1 bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded shadow p-6 transition-colors">
      <h1 class="text-xl font-bold mb-6 dark:text-gray-100">{{ $t('admin.user_management.title') }}</h1>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded">
        {{ $t('admin.user_management.error_loading') }}
        <button @click="fetchUsers" class="ml-2 underline font-semibold">{{ $t('common.apply') }}</button>
      </div>

      <!-- Users Table -->
      <div class="border rounded-lg overflow-hidden dark:border-gray-700">
        <!-- Table Header -->
        <div class="bg-gray-50 dark:bg-gray-800 border-b px-4 py-3 flex items-center justify-between border-default dark:border-gray-700 transition-colors">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium">{{ $t('admin.user_management.all_users') }}</span>
            <span class="text-sm text-gray-500 dark:text-gray-300">{{ users.length }}</span>
          </div>
          <button
            @click="fetchUsers"
            class="px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2 dark:text-gray-100"
          >
            <svg
              :class="['w-4 h-4', loading ? 'animate-spin' : '']"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {{ loading ? $t('admin.user_management.refreshing') : $t('admin.user_management.refresh') }}
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading && users.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-300">
          <div class="inline-block">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
            {{ $t('admin.user_management.loading') }}
          </div>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-800 border-b text-sm text-gray-600 dark:text-gray-300 border-default dark:border-gray-700 md:table-header-group hidden">
              <tr>
                <th class="px-4 py-3 text-left font-medium">
                  <input
                    type="checkbox"
                    :checked="selectedUsers.length === users.length && users.length > 0"
                    @change="toggleSelectAll"
                    class="rounded border-gray-300 cursor-pointer"
                    :disabled="users.length === 0"
                  />
                </th>
                <th class="px-4 py-3 text-left font-medium">{{ $t('admin.user_management.username') }}</th>
                <th class="px-4 py-3 text-left font-medium">{{ $t('admin.user_management.email') }}</th>
                <th class="px-4 py-3 text-left font-medium">{{ $t('admin.user_management.last_login') }}</th>
                <th class="px-4 py-3 text-left font-medium">{{ $t('admin.user_management.actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex flex-col md:table-row">
                <td class="px-4 py-3 flex justify-between items-center md:table-cell">
                  <span class="font-bold md:hidden">Select</span>
                  <input
                    type="checkbox"
                    :checked="isSelected(user.id)"
                    @change="toggleSelectUser(user.id)"
                    class="rounded border-gray-300 cursor-pointer"
                  />
                </td>
                <td class="px-4 py-3 flex justify-between items-center md:table-cell">
                  <span class="font-bold md:hidden">{{ $t('admin.user_management.username') }}</span>
                  <div class="flex items-center gap-3">
                    <img
                      :src="user.avatarUrl"
                      :alt="user.username"
                      class="w-10 h-10 rounded-full object-cover"
                    />
                    <span class="text-sm font-medium dark:text-gray-100">{{ user.username }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 flex justify-between items-center md:table-cell"><span class="font-bold md:hidden">{{ $t('admin.user_management.email') }}</span><span class="text-sm text-gray-600 dark:text-gray-300">{{ user.email }}</span></td>
                <td class="px-4 py-3 flex justify-between items-center md:table-cell"><span class="font-bold md:hidden">{{ $t('admin.user_management.last_login') }}</span><span class="text-sm text-gray-600 dark:text-gray-300">{{ formatDateTime(user.lastLoginDate) }}</span></td>
                <td class="px-4 py-3 flex justify-between items-center md:table-cell">
                  <span class="font-bold md:hidden">{{ $t('admin.user_management.actions') }}</span>
                  <div class="relative dropdown-container">
                    
                    <button 
                      @click.stop="toggleDropdown(user.id)"
                      class="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
                    >
                      <IconDotsVertical class="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>

                    <div 
                      v-if="activeDropdown === user.id"
                      class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                    >
                      <div class="py-1">
                        
                        <button 
                          v-if="user.status === 'Active'"
                          @click="handleDeactivate(user); activeDropdown = null"
                          class="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition-colors"
                        >
                          <IconBan class="w-4 h-4" />
                          {{ $t('admin.user_management.deactivate') || 'Deactivate' }}
                        </button>

                        <button 
                          v-else
                          @click="handleActivate(user); activeDropdown = null"
                          class="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-green-600 dark:text-green-400 transition-colors"
                        >
                          <IconCheck class="w-4 h-4" />
                          {{ $t('admin.user_management.activate') || 'Activate' }}
                        </button>

                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <!-- Empty State -->
              <tr v-if="users.length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-gray-500 dark:text-gray-300">
                  {{ $t('admin.user_management.no_users') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Footer is provided by AdminDashboard; removed duplicate Footer here -->
  </div>
</template>

<style scoped>
input[type='checkbox'] {
  cursor: pointer;
}
</style>
