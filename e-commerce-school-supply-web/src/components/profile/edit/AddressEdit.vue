<script setup lang="ts">
import { reactive, watch } from 'vue'

type Address = {
  id?: number
  setName?: string
  country?: string
  province?: string
  houseNumber?: string
  street?: string
  addressLine1?: string
  addressLine2?: string
  zipCode?: string
  isDefault?: boolean
  createdAt?: string
}

const props = defineProps<{
  address?: Address
  showDefaultButtons?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', value: Address): void
  (e: 'cancel'): void
}>()

const form = reactive<Address>({
  id: props.address?.id ?? undefined,
  setName: props.address?.setName ?? '',
  country: props.address?.country ?? '',
  province: props.address?.province ?? '',
  houseNumber: props.address?.houseNumber ?? '',
  street: props.address?.street ?? '',
  addressLine1: props.address?.addressLine1 ?? '',
  addressLine2: props.address?.addressLine2 ?? '',
  zipCode: props.address?.zipCode ?? '',
  isDefault: props.address?.isDefault ?? false,
  createdAt: props.address?.createdAt ?? new Date().toDateString(),
})

watch(
  () => props.address,
  (v) => {
    form.id = v?.id
    form.setName = v?.setName ?? ''
    form.country = v?.country ?? ''
    form.province = v?.province ?? ''
    form.houseNumber = v?.houseNumber ?? ''
    form.street = v?.street ?? ''
    form.addressLine1 = v?.addressLine1 ?? ''
    form.addressLine2 = v?.addressLine2 ?? ''
    form.zipCode = v?.zipCode ?? ''
    form.isDefault = v?.isDefault ?? false
    form.createdAt = v?.createdAt ?? new Date().toDateString()
  },
)

function onCancel() {
  emit('cancel')
}

function onSave(e: Event) {
  e.preventDefault()
  console.log('[AddressEdit] Emitting save with form:', form)
  emit('save', { ...form })
}

// Provinces list similar to checkout
const provinces = [
  'Phnom Penh',
  'Kandal',
  'Siem Reap',
  'Battambang',
  'Banteay Meanchey',
  'Kampong Cham',
  'Kampong Chhnang',
  'Kampong Speu',
  'Kampong Thom',
  'Kampot',
  'Kep',
  'Kratie',
  'Mondulkiri',
  'Oddar Meanchey',
  'Pailin',
  'Preah Sihanouk',
  'Preah Vihear',
  'Prey Veng',
  'Pursat',
  'Ratanakiri',
  'Stung Treng',
  'Svay Rieng',
  'Tbong Khmum',
]
</script>

<template>
  <div class="border border-default border-dashed rounded-base p-5 mt-5 bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors">
    <h1 v-if="form.setName" class="text-accent dark:text-[#1A535C]">Edit your address</h1>
    <h1 v-else class="text-accent dark:text-[#1A535C]">Add a new address</h1>

    <form class="w-full max-w-4xl mx-auto mt-5" @submit.prevent="onSave">
      <div class="relative z-0 w-full mb-6 group">
        <input v-model="form.setName" type="text" name="name" id="name" class="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer dark:text-gray-100 dark:border-gray-600" placeholder=" " required />
        <label for="name" class="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left dark:text-gray-300">{{ $t('profile.address_name') }}</label>
      </div>

      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-6 group">
          <input v-model="form.country" type="text" name="country" id="country" class="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer dark:text-gray-100 dark:border-gray-600" placeholder=" " required />
          <label for="country" class="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left dark:text-gray-300">{{ $t('checkout.country') }}</label>
        </div>
        <div class="relative z-0 w-full mb-6 group">
          <select v-model="form.province" name="province" id="province" class="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer dark:text-gray-100 dark:border-gray-600 dark:bg-gray-800" required>
            <option value="">{{ $t('checkout.select_province') }}</option>
            <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
          </select>
          <label for="province" class="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left dark:text-gray-300">{{ $t('checkout.province_city') }}</label>
        </div>
      </div>

      <div class="relative z-0 w-full mb-6 group">
        <input v-model="form.addressLine1" type="text" name="address1" id="address1" class="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer dark:text-gray-100 dark:border-gray-600" placeholder=" " required />
        <label for="address1" class="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left dark:text-gray-300">{{ $t('checkout.address_line_1') }}</label>
      </div>

      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-6 group">
          <input v-model="form.houseNumber" type="text" name="house" id="house" class="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer dark:text-gray-100 dark:border-gray-600" placeholder=" " />
          <label for="house" class="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left dark:text-gray-300">{{ $t('checkout.house_number') }}</label>
        </div>
        <div class="relative z-0 w-full mb-6 group">
          <input v-model="form.street" type="text" name="street" id="street" class="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer dark:text-gray-100 dark:border-gray-600" placeholder=" " />
          <label for="street" class="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left dark:text-gray-300">{{ $t('checkout.street') }}</label>
        </div>
      </div>

      <div class="relative z-0 w-full mb-6 group">
        <input v-model="form.addressLine2" type="text" name="address2" id="address2" class="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer dark:text-gray-100 dark:border-gray-600" placeholder=" " />
        <label for="address2" class="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left dark:text-gray-300">{{ $t('checkout.address_line_2') }}</label>
      </div>

      <div class="relative z-0 w-full mb-6 group">
        <input v-model="form.zipCode" type="text" name="zip" id="zip" class="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer dark:text-gray-100 dark:border-gray-600" placeholder=" " />
        <label for="zip" class="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left dark:text-gray-300">{{ $t('checkout.zip_code') }}</label>
      </div>

      <div class="mt-3 w-full flex flex-row gap-2 items-center justify-end">
        <button type="button" @click="onCancel" class="text-body bg-neutral-primary border border-default hover:bg-neutral-secondary-soft hover:text-heading focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">{{ $t('profile.cancel') }}</button>
        <button type="submit" class="text-white bg-secondary box-border border border-transparent hover:bg-secondary/80 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none dark:bg-[#1A535C] dark:hover:bg-[#2A7A8F]">{{ $t('profile.save') }}</button>
      </div>
    </form>
  </div>
</template>
