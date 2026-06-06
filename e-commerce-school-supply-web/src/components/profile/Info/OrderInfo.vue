<script setup lang="ts">
import { ref, onMounted } from 'vue'
import orderService from '@/services/orderService'
import { useAuthStore } from '@/stores/authStore'

const orders = ref<any[]>([])
const loading = ref(false)
const authStore = useAuthStore()

onMounted(async () => {
  loading.value = true
  try {
    const res = await orderService.getOrders()
    // expecting backend to return orders for authenticated user
    orders.value = Array.isArray(res) ? res : []
  } catch (err) {
    console.error('Error loading orders', err)
    orders.value = []
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="border border-default border-dashed rounded-base p-5 bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors">
    <h1 class="mb-5 dark:text-white">My Orders <span class="text-gray-400 dark:text-gray-300">{{ orders.length }}</span></h1>

    <div v-if="loading" class="text-sm text-gray-500 dark:text-gray-400">Loading orders...</div>
    <div v-else>
      <div v-if="orders.length === 0" class="text-sm text-gray-500 dark:text-gray-400">No orders found.</div>
      <div v-else class="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default dark:bg-gray-900 dark:border-gray-700 transition-colors">
        <table class="w-full text-sm text-left rtl:text-right text-body dark:text-gray-200">
          <thead class="text-sm text-body bg-neutral-secondary-medium border-b border-default-medium dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
            <tr>
              <th scope="col" class="p-4">Order ID</th>
              <th scope="col" class="px-3 py-3 font-medium">Method</th>
              <th scope="col" class="px-3 py-3 font-medium">Total</th>
              <th scope="col" class="px-3 py-3 font-medium">Date</th>
              <th scope="col" class="px-3 py-3 font-medium">Status</th>
              <th scope="col" class="px-3 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in orders" :key="o.id" class="bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800">
              <th class="px-3 py-4 font-medium text-heading whitespace-nowrap dark:text-gray-100">{{ o.id || o.orderId }}</th>
              <td class="px-3 py-4 dark:text-gray-200">{{ o.paymentMethod || o.method || '—' }}</td>
              <td class="px-3 py-4 dark:text-gray-200">${{ (o.total || o.amount || 0).toFixed(2) }}</td>
              <td class="px-3 py-4 dark:text-gray-200">{{ new Date(o.createdAt || o.date || Date.now()).toLocaleDateString() }}</td>
              <td class="px-3 py-4 dark:text-gray-200">{{ o.status || o.orderStatus || '—' }}</td>
              <td class="px-3 py-4">
                <router-link
                  :to="{ name: 'order-detail', params: { id: o.id || o.orderId } }"
                  class="font-medium text-accent hover:underline dark:text-[#1A535C]"
                >
                  View
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
