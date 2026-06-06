<script setup lang="ts">
type Card = {
  id: number
  cardType: string
  name: string
  cardNum: string
  expire: string
  cvv: string
}

const props = defineProps<{
  cards: Card[]
  modelValue: Card | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Card | null): void
}>()

function handleChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  if (value === '') {
    emit('update:modelValue', null)
  } else {
    const id = Number(value)
    const selected = props.cards.find(c => c.id === id) ?? null
    emit('update:modelValue', selected)
  }
}
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
      Select your credit card
    </label>
    <select
      class="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
      @change="handleChange"
    >
      <!-- Disabled placeholder -->
      <option disabled selected value="">Select Credit Card</option>

      <!-- Saved cards -->
      <option
        v-for="card in cards"
        :key="card.id"
        :value="card.id"
      >
        {{ card.name }} — {{ card.cardType }}
      </option>
    </select>
  </div>
</template>
