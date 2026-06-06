<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { IconPlus } from '@tabler/icons-vue'
import AddressEdit from '@/components/profile/edit/AddressEdit.vue'
import authService from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

type Address = {
  id: number
  setName: string
  country: string
  province: string
  houseNumber: string
  street: string
  addressLine1: string
  addressLine2?: string
  zipCode: string
  isDefault?: boolean
  createdAt?: string
}

const auth = useAuthStore()

const savedAddresses = ref<Address[]>([])

function createEmptyAddress(): Address {
  return {
    id: Date.now(),
    setName: '',
    country: '',
    province: '',
    houseNumber: '',
    street: '',
    addressLine1: '',
    addressLine2: '',
    zipCode: '',
    isDefault: false,
    createdAt: new Date().toDateString(),
  }
}

async function loadProfileAddresses() {
  try {
    const res = await authService.getProfile()
    const profile = res.data
    if (profile && Array.isArray(profile.addresses) && profile.addresses.length) {
      // map server address shape to local Address type
      savedAddresses.value = profile.addresses.map((a: any, idx: number) => ({
        id: a.id || Date.now() + idx,
        setName: a.label || a.setName || `Address ${idx + 1}`,
        country: a.country || '',
        province: a.city || a.province || '',
        houseNumber: a.houseNumber || '',
        street: a.street || '',
        addressLine1: a.addressLine || a.addressLine1 || '',
        addressLine2: a.addressLine2 || '',
        zipCode: a.zipCode || a.postal || '',
        isDefault: !!a.isDefault,
        createdAt: a.createdAt || new Date().toDateString(),
      }))
      return
    }
  } catch (err) {
    // ignore — return empty list when profile can't be loaded or has no addresses
    console.debug('No profile addresses or failed to load:', err)
    savedAddresses.value = []
    return
  }
  // if profile exists but no addresses, ensure empty list (no mock data)
  savedAddresses.value = []
}

onMounted(() => {
  // try to load addresses from profile immediately
  loadProfileAddresses()
})

// Watch for when user navigates back to this component
import { useRoute } from 'vue-router'
const route = useRoute()
watch(() => route.path, (newPath) => {
  if (newPath.includes('profile')) {
    loadProfileAddresses()
  }
})

// keep local list in sync when auth store user changes
watch(() => auth.user, (u) => {
  if (u && Array.isArray(u.addresses) && u.addresses.length) {
    savedAddresses.value = u.addresses.map((a: any, idx: number) => ({
      id: a.id || Date.now() + idx,
      setName: a.label || a.setName || `Address ${idx + 1}`,
      country: a.country || '',
      province: a.city || a.province || '',
      houseNumber: a.houseNumber || '',
      street: a.street || '',
      addressLine1: a.addressLine || a.addressLine1 || '',
      addressLine2: a.addressLine2 || '',
      zipCode: a.zipCode || a.postal || '',
      isDefault: !!a.isDefault,
      createdAt: a.createdAt || new Date().toDateString(),
    }))
  }
})

const showEdit = ref(false)
const editing = reactive<Address>(createEmptyAddress())

function openAdd() {
  Object.assign(editing, createEmptyAddress())
  // ensure unique id
  editing.id = Date.now()
  showEdit.value = true
}

function openEdit(addr: Address) {
  Object.assign(editing, { ...addr })
  showEdit.value = true
}

function onSave(addr: any) {
  console.log('[AddressInfo] onSave called with:', addr)
  console.log('[AddressInfo] Current savedAddresses before:', savedAddresses.value)
  const idx = savedAddresses.value.findIndex(a => a.id === addr.id)
  console.log('[AddressInfo] Found index:', idx)
  if (idx >= 0) savedAddresses.value[idx] = { ...addr }
  else savedAddresses.value.push({ ...addr })
  console.log('[AddressInfo] savedAddresses after push:', savedAddresses.value)
  // if marked default, unset others
  if (addr.isDefault) {
    savedAddresses.value.forEach(a => { if (a.id !== addr.id) a.isDefault = false })
  }
  showEdit.value = false
  // persist to backend (map local shape to server shape)
  const toServer = savedAddresses.value.map(a => ({
    id: a.id,
    label: a.setName,
    country: a.country,
    city: a.province,
    houseNumber: a.houseNumber,
    street: a.street,
    addressLine: a.addressLine1,
    addressLine2: a.addressLine2,
    zipCode: a.zipCode,
    isDefault: a.isDefault,
  }))
  console.log('[AddressInfo] Sending to backend:', toServer)
  // await persistence and then reload authoritative data from server
  if (auth.updateProfile) {
    auth.updateProfile({ addresses: toServer })
      .then(() => {
        console.log('[AddressInfo] Backend save successful, reloading...')
        return loadProfileAddresses()
      })
      .then(() => {
        console.log('[AddressInfo] Reloaded addresses:', savedAddresses.value)
      })
      .catch((err: any) => {
        console.error('[AddressInfo] Failed to persist addresses', err)
        // give user immediate feedback
        const status = err?.response?.status
        if (status === 401) {
          window.alert(t('profile.alerts.sign_in_to_save_address'))
        } else {
          window.alert(t('profile.alerts.save_address_failed'))
        }
      })
  } else {
    console.warn('[AddressInfo] auth.updateProfile is not available')
  }
}

function onCancel() {
  showEdit.value = false
}
</script>

<template>
  <div class="border border-default border-dashed rounded-base p-5 bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors">
    <div class="w-full flex flex-row justify-between items-center">
      <h1 class="dark:text-white">{{ t('profile.all_address') }}</h1>
      <button
        type="button"
        @click="openAdd"
        class="flex flex-row gap-2 items-center justify-center text-white bg-secondary box-border border border-transparent hover:bg-secondary/80 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-md text-sm px-2 py-2 mb-4 focus:outline-none dark:bg-[#1A535C] dark:hover:bg-[#2A7A8F]"
      >
        <IconPlus size="16" /> {{ t('profile.add_new_address') }}
      </button>
    </div>
    <div class="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default dark:bg-gray-900 dark:border-gray-700 transition-colors">
      <table class="w-full text-sm text-left rtl:text-right text-body dark:text-gray-200">
        <thead class="text-sm text-body bg-neutral-secondary-medium border-b border-default-medium dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
          <tr>
            <th scope="col" class="p-4">
              <div class="flex items-center">
                <input id="table-checkbox-38" type="checkbox" value="" class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft" />
                <label for="table-checkbox-38" class="sr-only">Table checkbox</label>
              </div>
            </th>
            <th scope="col" class="px-3 py-3 font-medium">{{ t('profile.address_name') }}</th>
            <th scope="col" class="px-3 py-3 font-medium">{{ t('profile.address') }}</th>
            <th scope="col" class="px-3 py-3 font-medium">{{ t('profile.status') }}</th>
            <th scope="col" class="px-3 py-3 font-medium">{{ t('profile.created_date') }}</th>
            <th scope="col" class="px-3 py-3 font-medium">{{ t('profile.action') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="address in savedAddresses" :key="address.id" class="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800">
            <td class="w-4 p-4">
              <div class="flex items-center">
                <input id="table-checkbox-39" type="checkbox" value="" class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft" />
                <label for="table-checkbox-39" class="sr-only">Table checkbox</label>
              </div>
            </td>
            <th scope="row" class="px-3 py-4 font-medium text-heading whitespace-nowrap dark:text-gray-100">{{ address.setName }}</th>
            <td class="px-3 py-4 dark:text-gray-200">{{ address.addressLine1 }} {{ address.street ? ', ' + address.street : '' }} {{ address.houseNumber ? ', ' + address.houseNumber : '' }}, {{ address.province }}, {{ address.country }}</td>
            <td class="px-3 py-4" :class="address.isDefault ? 'text-success' : 'font-medium text-accent hover:underline dark:text-[#1A535C]'">{{ address.isDefault ? t('profile.default') : t('profile.set_default') }}</td>
            <td class="px-3 py-4 dark:text-gray-200">{{ address.createdAt }}</td>
            <td class="px-3 py-4">
              <a href="#" class="font-medium text-accent hover:underline dark:text-[#1A535C]" @click.prevent="openEdit(address)">{{ t('profile.edit') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showEdit" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border dark:border-gray-700 w-full max-w-3xl p-6 rounded-lg transition-colors">
        <AddressEdit :address="editing" @save="onSave" @cancel="onCancel" />
      </div>
    </div>
  </div>
</template>


