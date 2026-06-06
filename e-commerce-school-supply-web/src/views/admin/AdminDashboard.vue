<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100 transition-colors">
 

    <!-- Breadcrumb + content -->
    <div class="max-w-7xl mx-auto px-6 py-6">
      <div class="text-xs text-gray-500 dark:text-gray-300 mb-4">{{ $t('admin.breadcrumb') }}</div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Admin Sidebar -->
        <aside class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors lg:col-span-1">
          <nav class="space-y-1">
            <button
              @click="currentTab = 'dashboard'"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg transition',
                currentTab === 'dashboard'
                  ? 'bg-blue-50 dark:bg-[#1A535C]/20 text-blue-600 dark:text-[#38b8cc] font-medium'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              {{ $t('admin.sidebar.dashboard') }}
            </button>
            <button
              @click="currentTab = 'profile'"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg transition',
                currentTab === 'profile'
                  ? 'bg-blue-50 dark:bg-[#1A535C]/20 text-blue-600 dark:text-[#38b8cc] font-medium'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              {{ $t('admin.sidebar.my_profile') }}
            </button>
            <button
              @click="currentTab = 'userManagement'"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg transition',
                currentTab === 'userManagement'
                  ? 'bg-blue-50 dark:bg-[#1A535C]/20 text-blue-600 dark:text-[#38b8cc] font-medium'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              {{ $t('admin.sidebar.user_management') }}
            </button>
            <button
              @click="currentTab = 'productManagement'"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg transition',
                currentTab === 'productManagement'
                  ? 'bg-blue-50 dark:bg-[#1A535C]/20 text-blue-600 dark:text-[#38b8cc] font-medium'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              {{ $t('admin.sidebar.product_management') }}
            </button>
            <button
              @click="currentTab = 'orderManagement'"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg transition',
                currentTab === 'orderManagement'
                  ? 'bg-blue-50 dark:bg-[#1A535C]/20 text-blue-600 dark:text-[#38b8cc] font-medium'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              {{ $t('admin.sidebar.order_management') }}
            </button>
            <button
              @click="currentTab = 'reviewManagement'"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg transition',
                currentTab === 'reviewManagement'
                  ? 'bg-blue-50 dark:bg-[#1A535C]/20 text-blue-600 dark:text-[#38b8cc] font-medium'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              {{ $t('admin.sidebar.review_management') }}
            </button>
          </nav>
        </aside>

        <!-- Main content -->
        <main class="lg:col-span-3 space-y-6">
          <!-- Show Admin Profile when profile tab is active -->
          <AdminProfile v-if="currentTab === 'profile'" />

          <!-- Show User Management when userManagement tab is active -->
          <UserManagement v-else-if="currentTab === 'userManagement'" />

          <!-- Show Product Management when productManagement tab is active -->
          <ProductManagement v-else-if="currentTab === 'productManagement'" />

          <!-- Show Order Management when orderManagement tab is active -->
          <OrderManagement v-else-if="currentTab === 'orderManagement'" />

          <!-- Show Review Management when reviewManagement tab is active -->
          <ReviewManagement v-else-if="currentTab === 'reviewManagement'" />

          <!-- Show Dashboard content when dashboard tab is active -->
          <template v-else>
            <!-- Profile Card -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
              <div class="flex items-center space-x-4">
                <img :src="userAvatarSrc" alt="Profile" class="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-gray-700">
                <div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ adminName }}</h2>
                  <p class="text-sm text-gray-500 dark:text-gray-300">{{ adminRole }}</p>
                </div>
              </div>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Total Sales -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-300">{{ $t('admin.stats.total_sales') }}</h3>
                  <div class="w-10 h-10 bg-red-50 dark:bg-[#1A535C]/20 rounded-full flex items-center justify-center">
                    <i class="pi pi-dollar text-red-500 dark:text-[#38b8cc]"></i>
                  </div>
                </div>
                <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">${{ totalSales.toFixed(2) }}</p>
              </div>

              <!-- Total Orders -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-300">{{ $t('admin.stats.total_orders') }}</h3>
                  <div class="w-10 h-10 bg-red-50 dark:bg-[#1A535C]/20 rounded-full flex items-center justify-center">
                    <i class="pi pi-shopping-cart text-red-500 dark:text-[#38b8cc]"></i>
                  </div>
                </div>
                <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ totalOrders.toLocaleString() }}</p>
              </div>

              <!-- Total Products -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-300">{{ $t('admin.stats.total_products') }}</h3>
                  <div class="w-10 h-10 bg-red-50 dark:bg-[#1A535C]/20 rounded-full flex items-center justify-center">
                    <i class="pi pi-box text-red-500 dark:text-[#38b8cc]"></i>
                  </div>
                </div>
                <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ totalProducts.toLocaleString() }}</p>
              </div>
            </div>

            <!-- Charts Row -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Daily Sales Trend -->
              <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ $t('admin.charts.daily_sales') }}</h3>
                <div style="height: 300px;">
                  <canvas ref="salesChartCanvas"></canvas>
                </div>
              </div>

              <!-- Total Product by Category -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors ">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ $t('admin.charts.product_by_category') }}</h3>
                <div style="height: 300px;">
                  <canvas ref="categoryChartCanvas"></canvas>
                </div>
              </div>
            </div>

            <!-- Tables Row -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Top Sale Products -->
              <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('admin.tables.top_sale_products') }}</h3>
                  <button class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <i class="pi pi-filter mr-1"></i> <span class="text-gray-700 dark:text-gray-200">{{ $t('admin.tables.filter') }}</span>
                  </button>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b border-gray-200 dark:border-gray-700">
                        <th class="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">{{ $t('admin.tables.product') }}</th>
                        <th class="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">{{ $t('admin.tables.category') }}</th>
                        <th class="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">{{ $t('admin.tables.price') }}</th>
                        <th class="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">{{ $t('admin.tables.total_sales') }}</th>
                        <th class="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">{{ $t('admin.tables.units_sold') }}</th>
                        <th class="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">{{ $t('admin.tables.stock') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="product in topProducts" :key="product.id" class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex flex-col sm:table-row">
                        <td class="py-3 px-4">
                          <div class="flex items-center space-x-3">
                            <img :src="product.image" :alt="product.name" class="w-12 h-12 object-cover rounded border border-gray-200 dark:border-gray-700">
                            <div class="w-44 mr-5">
                              <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ product.name }}</div>
                              <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ product.description }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{{ product.category }}</td>
                        <td class="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">${{ product.price }}</td>
                        <td class="py-3 px-4 text-sm font-bold text-green-600">${{ product.sales.toFixed(2) }}</td>
                        <td class="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">{{ product.orderCount }}</td>
                        <td class="py-3 px-4">
                          <span :class="[
                            'px-2 py-1 text-xs rounded-full font-medium',
                            product.stockQuantity > 50 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200' :
                            product.stockQuantity > 20 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200' :
                            'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200'
                          ]">
                            {{ product.stockQuantity }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Low Stock Alert -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ $t('admin.alerts.low_stock') }}</h3>
                <div class="space-y-4">
                  <div v-for="item in lowStockItems" :key="item.id" class="space-y-2">
                    <div class="flex items-center space-x-3">
                      <img :src="item.image" :alt="item.name" class="w-10 h-10 object-cover rounded border border-gray-200 dark:border-gray-700">
                      <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.quantity }} {{ $t('admin.alerts.left_in_stock') }}</p>
                      </div>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        :class="[
                          'h-2 rounded-full',
                          item.alertLevel === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                        ]"
                        :style="{ width: `${item.percentage}%` }"
                      ></div>
                    </div>
                    <div class="flex items-center text-xs">
                      <span :class="[
                        'font-medium',
                        item.alertLevel === 'critical' ? 'text-red-600 dark:text-red-300' : 'text-yellow-600 dark:text-yellow-200'
                      ]">
                        <i class="pi pi-exclamation-circle mr-1"></i>
                        {{ item.alertLevel === 'critical' ? $t('admin.alerts.critical') : $t('admin.alerts.low_stock_label') }}
                      </span>
                      <span class="ml-auto text-gray-500 dark:text-gray-300">{{ item.percentage }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminHeader from '@/components/admin/AdminHeader.vue'
import AdminFooter from '@/components/admin/AdminFooter.vue'
import AdminProfile from './AdminProfile.vue'
import UserManagement from './UserManagement.vue'
import ProductManagement from './ProductManagement.vue'
import OrderManagement from './OrderManagement.vue'
import ReviewManagement from './ReviewManagement.vue'
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { useI18n } from 'vue-i18n'
import Chart from 'chart.js/auto'
import adminService from '@/services/adminService'
import { productService } from '@/services/productService'
import orderService from '@/services/orderService'
import BlankProfile from '@/assets/images/pfp_blank.jpeg'

const API_BASE_URL = import.meta.env.VITE_API_URL as string

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const currentTab = ref('dashboard')

// Admin Info
const adminName = computed(() => authStore.user?.username || 'Admin')
const adminRole = computed(() => authStore.user?.role || 'Administrator')

// Avatar cache-busting timestamp - updates only when avatar URL changes
const avatarTimestamp = ref(new Date().getTime())
watch(() => authStore.user?.avatarUrl, () => {
  avatarTimestamp.value = new Date().getTime()
})

const userAvatarSrc = computed(() => {
  const avatarUrl = authStore.user?.avatarUrl
  if (avatarUrl && avatarUrl.trim() !== '') {
    return `${API_BASE_URL}${avatarUrl}?t=${avatarTimestamp.value}`
  }
  return BlankProfile
})

// Dashboard Stats
const totalSales = ref(0)
const totalOrders = ref(0)
const totalProducts = ref(0)
const isLoadingStats = ref(false)

// Chart references
const salesChartCanvas = ref<HTMLCanvasElement | null>(null)
const categoryChartCanvas = ref<HTMLCanvasElement | null>(null)
let salesChart: any = null
let categoryChart: any = null

// Data arrays for charts and tables
const topProducts = ref<any[]>([])
const lowStockItems = ref<any[]>([])
const categoryData = ref<any>({})

const resolveProductImage = (p: any) => {
  const raw = (Array.isArray(p?.images) && p.images[0]) || p?.imageUrl || p?.imageURL || ''
  const cleaned = typeof raw === 'string' ? raw.trim() : ''
  if (!cleaned) return BlankProfile
  if (cleaned.startsWith('/')) return `${String(API_BASE_URL).replace(/\/$/, '')}${cleaned}`
  return cleaned
}
const monthlySalesData = ref<any[]>([])

const handleSignOut = async () => {
  // Use the store's logout which also handles navigation
  await authStore.logout()
}

// Fetch dashboard statistics
const fetchDashboardStats = async () => {
  isLoadingStats.value = true
  try {
    // Fetch products to calculate total and analyze data
    const products = await productService.getAllProducts()
    totalProducts.value = products.length

    // Fetch ALL orders using admin endpoint for proper total calculations
    let orders = []
    try {
      orders = await adminService.getAllOrders()
      console.log('Orders fetched from admin endpoint:', orders.length)
    } catch (error) {
      console.error('Failed to fetch orders from admin endpoint:', error)
    }
    
    // If no orders, try alternative endpoint
    if (orders.length === 0) {
      try {
        orders = await adminService.getAllOrdersAlternative()
        console.log('Orders fetched from alternative endpoint:', orders.length)
      } catch (error) {
        console.error('Failed to fetch orders from alternative endpoint:', error)
      }
    }
    
    // If still no orders, try fallback to regular order service
    if (orders.length === 0) {
      try {
        orders = await orderService.getOrders()
        console.log('Orders fetched from regular endpoint:', orders.length)
      } catch (error) {
        console.error('Failed to fetch orders from regular endpoint:', error)
        orders = []
      }
    }
    
    totalOrders.value = orders.length
    console.log('Total orders set to:', totalOrders.value)

    // Calculate total sales from all orders (sum of order totals)
    const sales = orders.reduce((sum: number, order: any) => {
      const orderTotal = Number(order.total || order.totalAmount || order.finalTotal || 0)
      return sum + orderTotal
    }, 0)
    totalSales.value = sales
    console.log('Total sales set to:', totalSales.value)

    // Calculate product sales from orders
    const productSales: any = {}
    const productOrderCount: any = {}
    orders.forEach((order: any) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const pid = item.productId
          const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 0)
          productSales[pid] = (productSales[pid] || 0) + itemTotal
          productOrderCount[pid] = (productOrderCount[pid] || 0) + (Number(item.quantity) || 0)
        })
      }
    })

    // Process products for top products based on actual sales
    topProducts.value = products
      .map((p: any) => ({
        id: p.id,
        name: p.name || 'Unknown',
        description: p.description || '',
        category: p.mainCategory || 'N/A',
        price: (p.price || 0).toFixed(2),
        sales: productSales[p.id] || 0,
        orderCount: productOrderCount[p.id] || 0,
        rating: p.rating || '0.0',
        stockQuantity: p.stockQuantity || 0,
        status: (p.stockQuantity || 0) > 0 ? 'In stock' : 'Out of stock',
        image: resolveProductImage(p)
      }))
      .sort((a: any, b: any) => b.sales - a.sales)
      .slice(0, 5)

    // Process products for low stock alert (stock < 50 is low, < 20 is critical)
    lowStockItems.value = products
      .filter((p: any) => (p.stockQuantity || 0) < 50 && (p.stockQuantity || 0) > 0)
      .sort((a: any, b: any) => (a.stockQuantity || 0) - (b.stockQuantity || 0))
      .slice(0, 5)
      .map((p: any) => {
        const qty = p.stockQuantity || 0
        const percentage = Math.min((qty / 50) * 100, 100)
        return {
          id: p.id,
          name: p.name || 'Unknown',
          quantity: qty,
          percentage: Math.round(percentage),
          alertLevel: qty < 20 ? 'critical' : 'low',
          image: resolveProductImage(p)
        }
      })

    // Calculate category distribution
    const categoryCounts: any = {}
    products.forEach((p: any) => {
      const cat = p.mainCategory || 'Uncategorized'
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
    })
    categoryData.value = categoryCounts

    // Process daily sales data (group orders by day for last 30 days)
    const dailyData: any = {}
    console.log('Processing orders for daily sales:', orders.length)

    // Get today's date and 30 days ago
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29) // Last 30 days including today

    orders.forEach((order: any) => {
      const orderTotal = Number(order.total || order.totalAmount || 0)
      const dateStr = order.createdAt || order.orderDate || order.date

      if (dateStr && orderTotal > 0) {
        try {
          const date = new Date(dateStr)
          date.setHours(0, 0, 0, 0)

          if (!isNaN(date.getTime()) && date >= thirtyDaysAgo && date <= today) {
            const dayKey = date.toISOString().split('T')[0] // YYYY-MM-DD format
            if (dayKey) {
              dailyData[dayKey] = (dailyData[dayKey] ?? 0) + orderTotal
              console.log(`Added $${orderTotal} to day ${dayKey}`)
            }
          }
        } catch (e) {
          console.warn('Invalid date:', dateStr)
        }
      }
    })
    console.log('Daily sales data:', dailyData)
    monthlySalesData.value = dailyData

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
  } finally {
    isLoadingStats.value = false
  }
}

// Initialize charts
const initializeCharts = () => {
  // Destroy existing charts if they exist
  if (salesChart) {
    salesChart.destroy()
  }
  if (categoryChart) {
    categoryChart.destroy()
  }

  // Daily Sales Trend Chart (Last 30 Days)
  if (salesChartCanvas.value) {
    // Generate last 30 days labels and data
    const dayLabels: string[] = []
    const salesByDay: number[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dayKey = date.toISOString().split('T')[0]
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

      dayLabels.push(label)
      if (dayKey && monthlySalesData.value && typeof monthlySalesData.value === 'object') {
        const value = (monthlySalesData.value as any)[dayKey] ?? 0
        salesByDay.push(typeof value === 'number' ? value : 0)
      } else {
        salesByDay.push(0)
      }
    }

    console.log('Sales by day array:', salesByDay)
    const maxSales = Math.max(...salesByDay, 10) // Minimum 10 for scale
    const suggestedMax = maxSales > 0 ? Math.ceil(maxSales * 1.2) : 100

    salesChart = new Chart(salesChartCanvas.value, {
      type: 'line',
      data: {
        labels: dayLabels,
        datasets: [
          {
            label: 'Daily Sales ($)',
            data: salesByDay,
            borderColor: 'rgb(6, 182, 212)',
            backgroundColor: 'rgba(6, 182, 212, 0.2)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: 'rgb(6, 182, 212)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                size: 12,
                weight: 'bold'
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const value = context.parsed?.y
                if (typeof value === 'number') {
                  return 'Sales: $' + value.toFixed(2)
                }
                return 'Sales: $0.00'
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: suggestedMax,
            ticks: {
              callback: function(value) {
                return '$' + value
              },
              font: {
                size: 11
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 11
              }
            }
          }
        }
      }
    })
  }

  // Total Product by Category Pie Chart
  if (categoryChartCanvas.value) {
    const categories = Object.keys(categoryData.value)
    const counts = Object.values(categoryData.value)

    const colors = [
      'rgb(6, 182, 212)',
      'rgb(14, 116, 144)',
      'rgb(34, 197, 94)',
      'rgb(234, 179, 8)',
      'rgb(239, 68, 68)',
      'rgb(168, 85, 247)',
      'rgb(236, 72, 153)',
      'rgb(251, 146, 60)'
    ]

    categoryChart = new Chart(categoryChartCanvas.value, {
      type: 'doughnut',
      data: {
        labels: categories.length > 0 ? categories : ['No Data'],
        datasets: [
          {
            data: counts.length > 0 ? counts : [1],
            backgroundColor: colors.slice(0, categories.length || 1),
            borderWidth: 3,
            borderColor: '#fff',
            hoverOffset: 15
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            align: 'start',
            labels: {
              padding: 12,
              font: {
                size: 12,
                weight: 500 as any
              },
              boxWidth: 15,
              boxHeight: 15,
              usePointStyle: true,
              pointStyle: 'circle',
              generateLabels: function(chart) {
                const data = chart.data
                if (data.labels && data.datasets.length && data.datasets[0]) {
                  const dataset = data.datasets[0]
                  if (dataset.data) {
                    return (data.labels as any[]).map((label: any, i: number) => {
                      const dataArray = dataset.data as (number | null)[]
                      const value = dataArray[i] ?? 0
                      const total = dataArray.reduce((a: number, b: any) => a + (typeof b === 'number' ? b : 0), 0)
                      const percentage = total > 0 ? ((Number(value) / total) * 100).toFixed(1) : '0'
                      const bgColor = (dataset.backgroundColor as any)?.[i] || '#000000'
                      return {
                        text: `${label}: ${value} (${percentage}%)`,
                        fillStyle: bgColor,
                        hidden: false,
                        index: i
                      }
                    })
                  }
                }
                return []
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: function(context) {
                const label = context.label || ''
                const value = context.parsed
                const total = context.dataset.data.reduce((a: any, b: any) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                return `${label}: ${value} products (${percentage}%)`
              }
            }
          }
        }
      }
    })
  }
}

onMounted(async () => {
  // Initialize theme from localStorage or system
  themeStore.initTheme()
  // Fetch dashboard stats
  await fetchDashboardStats()

  // Initialize charts when dashboard is mounted
  if (currentTab.value === 'dashboard') {
    setTimeout(initializeCharts, 100)
  }
})

// Watch for tab changes to re-initialize charts when switching to dashboard
watch(currentTab, (newTab) => {
  if (newTab === 'dashboard') {
    setTimeout(initializeCharts, 100)
  }
})
</script>

<style scoped>
.text-accent { color: #e03b3b; }
.shadow { box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
</style>
