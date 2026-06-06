<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900 transition-colors min-h-screen">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-heading dark:text-white">{{ $t('orders.title') }}</h1>
      <p class="text-body mt-2 dark:text-gray-400">{{ $t('orders.subtitle') }}</p>
    </div>

    <div v-if="loading" class="text-center py-8">
      <spinner/>
    </div>

    <div v-else>
      <div v-if="orders.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center transition-colors">
        <div class="text-gray-500 dark:text-gray-400 mb-4">{{ $t('orders.empty_title') }}</div>
        <router-link
          to="/products"
          class="inline-block px-6 py-3 bg-accent dark:bg-[#1A535C] text-white rounded-base hover:bg-accent/90 dark:hover:bg-[#2A7A8F] transition"
        >
          {{ $t('orders.start_shopping') }}
        </router-link>
      </div>

      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-colors">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-body dark:text-gray-300">
            <thead class="text-sm text-body bg-neutral-secondary-medium border-b border-default-medium dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
              <tr>
                <th scope="col" class="px-6 py-4 font-medium">{{ $t('orders.order_id') }}</th>
                <th scope="col" class="px-6 py-4 font-medium">{{ $t('orders.method') }}</th>
                <th scope="col" class="px-6 py-4 font-medium">{{ $t('orders.total') }}</th>
                <th scope="col" class="px-6 py-4 font-medium">{{ $t('orders.date') }}</th>
                <th scope="col" class="px-6 py-4 font-medium">{{ $t('orders.status') }}</th>
                <th scope="col" class="px-6 py-4 font-medium">{{ $t('orders.action') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in orders"
                :key="order.id"
                class="bg-white border-b border-default hover:bg-neutral-secondary-medium dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
              >
                <td class="px-6 py-4 font-medium text-heading dark:text-gray-100">
                  {{ order.id || order.orderId }}
                </td>
                <td class="px-6 py-4 dark:text-gray-200">
                  {{ order.paymentMethod || order.method || '—' }}
                </td>
                <td class="px-6 py-4 dark:text-gray-200">
                  ${{ (order.total || order.amount || 0).toFixed(2) }}
                </td>
                <td class="px-6 py-4 dark:text-gray-200">
                  {{ formatDate(order.createdAt || order.date) }}
                </td>
                <td class="px-6 py-4 dark:text-gray-200">
                  <span
                    class="px-2 py-1 text-xs rounded-full"
                    :class="getStatusClass(order.status || order.orderStatus)"
                  >
                    {{ order.status || order.orderStatus || '—' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <router-link
                    :to="{ name: 'order-detail', params: { id: order.id || order.orderId } }"
                    class="font-medium text-accent hover:underline "
                  >
                    {{ $t('orders.view_details') }}
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import orderService from '@/services/orderService'
import Spinner from '@/components/ui/Spinner.vue'

const orders = ref<any[]>([])
const loading = ref(false)

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString || Date.now())
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClass = (status: string) => {
  const statusLower = (status || '').toLowerCase()
  if (statusLower.includes('delivered') || statusLower.includes('completed')) {
    return 'bg-green-100 text-green-800'
  }
  if (statusLower.includes('processing') || statusLower.includes('pending')) {
    return 'bg-yellow-100 text-yellow-800'
  }
  if (statusLower.includes('cancelled') || statusLower.includes('failed')) {
    return 'bg-red-100 text-red-800'
  }
  return 'bg-gray-100 text-gray-800'
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await orderService.getOrders()
    orders.value = Array.isArray(res) ? res : []
  } catch (err) {
    console.error('Error loading orders', err)
    orders.value = []
  } finally {
    loading.value = false
  }
})
</script>
