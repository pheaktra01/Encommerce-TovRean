<script setup lang="ts">
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
}

const props = defineProps<{
  addresses: Address[]
  modelValue: Address | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Address | null): void
}>()

function handleChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  if (value === '') {
    emit('update:modelValue', null)
  }
  else {
    const id = Number(value)
    const selected = props.addresses.find(a => a.id === id) ?? null
    emit('update:modelValue', selected)
  }
}

</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Select your address</label>
    <select
      class="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
      @change="handleChange"
    >
      <option disabled selected value="">Select Address</option>
      <option
        v-for="address in addresses"
        :key="address.id"
        :value="address.id"
      >
        {{ address.setName }}
      </option>
    </select>

  </div>
</template>
