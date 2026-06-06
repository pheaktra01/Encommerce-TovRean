<template>
  <div class="bg-white dark:bg-gray-900 rounded shadow p-6 transition-colors">
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-xl font-bold dark:text-gray-100">{{ $t('admin.review_management.title') }}</h1>
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-300">{{ $t('admin.sidebar.review_management') }} / <span class="text-teal-700 dark:text-[#1A535C]">{{ $t('admin.review_management.title') }}</span></div>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-blue-50 dark:bg-blue-900/40 p-4 rounded-lg">
        <div class="text-sm text-gray-600 dark:text-gray-200">{{ $t('admin.review_management.total_reviews') }}</div>
        <div class="text-2xl font-bold text-blue-600 dark:text-blue-300">{{ reviews.length }}</div>
      </div>
      <div class="bg-green-50 dark:bg-green-900/40 p-4 rounded-lg">
        <div class="text-sm text-gray-600 dark:text-gray-200">{{ $t('admin.review_management.average_rating') }}</div>
        <div class="text-2xl font-bold text-green-600 dark:text-green-300">{{ averageRating.toFixed(1) }} ★</div>
      </div>
      <div class="bg-yellow-50 dark:bg-yellow-900/40 p-4 rounded-lg">
        <div class="text-sm text-gray-600 dark:text-gray-200">{{ $t('admin.review_management.five_star_reviews') }}</div>
        <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-300">{{ fiveStarCount }}</div>
      </div>
      <div class="bg-purple-50 dark:bg-purple-900/40 p-4 rounded-lg">
        <div class="text-sm text-gray-600 dark:text-gray-200">{{ $t('admin.review_management.verified_purchases') }}</div>
        <div class="text-2xl font-bold text-purple-600 dark:text-purple-300">{{ verifiedCount }}</div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="border rounded-lg overflow-hidden dark:border-gray-700">
      <div class="bg-gray-50 dark:bg-gray-800 border-b px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 border-default dark:border-gray-700 transition-colors">
        <div class="flex items-center gap-3">
          <span class="text-sm font-medium">{{ $t('admin.review_management.all_reviews') }}</span>
          <span class="text-sm text-gray-500 dark:text-gray-300">{{ filtered.length }}</span>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div class="relative w-full sm:w-auto">
            <input
              v-model="search"
              type="text"
              :placeholder="$t('admin.review_management.search_placeholder')"
              class="border rounded px-3 py-1.5 pr-8 text-sm w-full sm:w-64 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
            <span class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"><IconSearch size="16"/></span>
          </div>
          <select v-model="filterRating" class="border rounded px-3 py-1.5 text-sm w-full sm:w-40 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
            <option value="">{{ $t('admin.review_management.all_ratings') }}</option>
            <option value="5">{{ $t('admin.review_management.stars_5') }}</option>
            <option value="4">{{ $t('admin.review_management.stars_4') }}</option>
            <option value="3">{{ $t('admin.review_management.stars_3') }}</option>
            <option value="2">{{ $t('admin.review_management.stars_2') }}</option>
            <option value="1">{{ $t('admin.review_management.stars_1') }}</option>
          </select>
          <button @click="loadReviews" class="px-3 py-1.5 bg-teal-700 text-white rounded text-sm hover:bg-teal-800 dark:bg-[#1A535C] dark:hover:bg-[#2A7A8F] w-full sm:w-auto">
            {{ $t('admin.review_management.refresh') }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="p-8 text-center text-gray-500 dark:text-gray-300">
        {{ $t('admin.review_management.loading') }}
      </div>

      <div v-else-if="paginatedReviews.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-300">
        {{ $t('admin.review_management.no_reviews') }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800 border-b text-xs text-gray-600 dark:text-gray-300 border-default dark:border-gray-700 hidden md:table-header-group">
            <tr>
              <th class="py-3 px-4 text-left w-12">
                <input type="checkbox" class="rounded" />
              </th>
              <th class="py-3 px-4 text-left">{{ $t('admin.review_management.product') }}</th>
              <th class="py-3 px-4 text-left">{{ $t('admin.review_management.user') }}</th>
              <th class="py-3 px-4 text-left">{{ $t('admin.review_management.rating') }}</th>
              <th class="py-3 px-4 text-left">{{ $t('admin.review_management.review') }}</th>
              <th class="py-3 px-4 text-left">{{ $t('admin.review_management.date') }}</th>
              <th class="py-3 px-4 text-left">{{ $t('admin.review_management.action') }}</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-for="review in paginatedReviews" :key="review.id" class="border-b hover:bg-gray-50 dark:hover:bg-gray-800 border-default dark:border-gray-700 transition-colors flex flex-col md:table-row">
              <td class="py-3 px-4 flex justify-between items-center md:table-cell"><span class="font-bold md:hidden">Select</span><input type="checkbox" class="rounded" /></td>
              <td class="py-3 px-4 flex justify-between items-center md:table-cell">
                <span class="font-bold md:hidden">{{ $t('admin.review_management.product') }}</span>
                <div class="md:w-full md:max-w-sm">
                  <div class="font-medium text-gray-900 dark:text-gray-100 truncate">{{ getProductName(review.productId) }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 truncate">ID: {{ review.productId }}</div>
                </div>
              </td>
              <td class="py-3 px-4 flex justify-between items-center md:table-cell">
                <span class="font-bold md:hidden">{{ $t('admin.review_management.user') }}</span>
                <div>
                  <div class="font-medium text-gray-900 dark:text-gray-100">{{ review.userName || review.userId }}</div>
                  <div v-if="review.verified" class="text-xs text-green-500">✓ {{ $t('admin.review_management.verified') }}</div>
                </div>
              </td>
              <td class="py-3 px-4 flex justify-between items-center md:table-cell">
                <span class="font-bold md:hidden">{{ $t('admin.review_management.rating') }}</span>
                <div>
                  <div class="flex items-center gap-1">
                    <span v-for="i in 5" :key="i" :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'">★</span>
                    <span class="ml-1 text-gray-600 dark:text-gray-300">({{ review.rating }})</span>
                  </div>
                  <div v-if="review.recommend" class="text-xs text-green-600 mt-1">{{ $t('admin.review_management.recommends') }}</div>
                </div>
              </td>
              <td class="py-3 px-4 flex justify-between items-center md:table-cell">
                <span class="font-bold md:hidden">{{ $t('admin.review_management.review') }}</span>
                <div class="md:w-full md:max-w-sm">
                  <div v-if="review.title" class="font-medium text-gray-900 dark:text-gray-100 mb-1 truncate">{{ review.title }}</div>
                  <div class="text-gray-600 dark:text-gray-300 line-clamp-2 truncate">{{ review.body || $t('admin.review_management.no_comment') }}</div>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600 dark:text-gray-300 flex justify-between items-center md:table-cell"><span class="font-bold md:hidden">{{ $t('admin.review_management.date') }}</span>{{ formatDate(review.createdAt) }}</td>
              <td class="py-3 px-4 flex justify-between items-center md:table-cell">
                <span class="font-bold md:hidden">{{ $t('admin.review_management.action') }}</span>
                <div>
                  <button
                    @click="openDetail(review)"
                    class="text-teal-700 dark:text-[#1A535C] hover:underline mr-3">
                    {{ $t('admin.review_management.view') }}
                  </button>
                  <button
                    @click="deleteReview(review.id)"
                    class="text-red-600 hover:underline">
                    {{ $t('admin.review_management.delete') }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="p-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-300 gap-4">
        <div>{{ $t('admin.review_management.showing') }} {{ startIndex + 1 }} {{ $t('admin.review_management.to') }} {{ endIndex }} {{ $t('admin.review_management.of') }} {{ filtered.length }} {{ $t('admin.review_management.entries') }}</div>
        <div class="flex items-center gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'"
            class="px-3 py-1 border rounded dark:border-gray-700 dark:text-gray-200">{{ $t('admin.review_management.previous') }}</button>
          <button
            v-for="page in displayPages"
            :key="page"
            @click="goToPage(page)"
            :class="page === currentPage ? 'bg-gray-800 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'"
            class="px-3 py-1 border rounded dark:border-gray-700 dark:text-gray-200">{{ page }}</button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'"
            class="px-3 py-1 border rounded dark:border-gray-700 dark:text-gray-200">{{ $t('admin.review_management.next') }}</button>
        </div>
      </div>
    </div>

    <!-- Review Detail Modal -->
    <div v-if="showDetail" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">{{ $t('admin.review_management.detail_title') }}</h2>
          <button @click="closeDetail" class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 text-2xl">&times;</button>
        </div>
        <div v-if="selectedReview" class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-600">{{ $t('admin.review_management.product') }}</label>
            <div class="text-gray-900 dark:text-gray-100">{{ getProductName(selectedReview.productId) }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">ID: {{ selectedReview.productId }}</div>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600">{{ $t('admin.review_management.user') }}</label>
            <div class="text-gray-900 dark:text-gray-100">{{ selectedReview.userName || selectedReview.userId }}</div>
            <div v-if="selectedReview.verified" class="text-xs text-green-600">✓ {{ $t('admin.review_management.verified_purchase') }}</div>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600">{{ $t('admin.review_management.rating') }}</label>
            <div class="flex items-center gap-1 mt-1">
              <span v-for="i in 5" :key="i" :class="i <= selectedReview.rating ? 'text-yellow-400' : 'text-gray-300'" class="text-xl">★</span>
              <span class="ml-2 text-gray-600">({{ selectedReview.rating }}/5)</span>
            </div>
            <div v-if="selectedReview.recommend" class="text-sm text-green-600 mt-1">✓ {{ $t('admin.review_management.recommends_product') }}</div>
          </div>
          <div v-if="selectedReview.title">
            <label class="text-sm font-medium text-gray-600">{{ $t('admin.review_management.review_title') }}</label>
            <div class="text-gray-900 font-medium">{{ selectedReview.title }}</div>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600">{{ $t('admin.review_management.review') }}</label>
            <div class="text-gray-900 whitespace-pre-wrap mt-1">{{ selectedReview.body || $t('admin.review_management.no_comment_provided') }}</div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-600">{{ $t('admin.review_management.posted') }}</label>
              <div class="text-gray-900">{{ formatDate(selectedReview.createdAt) }}</div>
            </div>
            <div v-if="selectedReview.updatedAt !== selectedReview.createdAt">
              <label class="text-sm font-medium text-gray-600">{{ $t('admin.review_management.updated') }}</label>
              <div class="text-gray-900">{{ formatDate(selectedReview.updatedAt) }}</div>
            </div>
          </div>
        </div>
        <div class="mt-6 flex flex-col sm:flex-row justify-end gap-3">
          <button
            @click="deleteReview(selectedReview?.id)"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full sm:w-auto">
            {{ $t('admin.review_management.delete_review') }}
          </button>
          <button @click="closeDetail" class="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 w-full sm:w-auto">
            {{ $t('admin.review_management.close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { IconSearch } from '@tabler/icons-vue'

const { t } = useI18n()

interface Review {
  id: string
  productId: string
  userId: string
  userName?: string
  rating: number
  title?: string
  body?: string
  recommend: boolean
  verified: boolean
  createdAt: string
  updatedAt: string
}

interface Product {
  id: string
  name: string
}

const reviews = ref<Review[]>([])
const products = ref<Product[]>([])
const loading = ref(false)
const search = ref('')
const filterRating = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const showDetail = ref(false)
const selectedReview = ref<Review | null>(null)

const loadReviews = async () => {
  loading.value = true
  try {
    const token = sessionStorage.getItem('accessToken')
    const response = await axios.get('http://localhost:8080/api/reviews/admin/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    reviews.value = response.data || []
  } catch (error) {
    console.error('Failed to load reviews:', error)
  } finally {
    loading.value = false
  }
}

const loadProducts = async () => {
  try {
    const token = sessionStorage.getItem('accessToken')
    const response = await axios.get('http://localhost:8080/api/products', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    products.value = response.data || []
  } catch (error) {
    console.error('Failed to load products:', error)
  }
}

const getProductName = (productId: string): string => {
  const product = products.value.find(p => p.id === productId)
  return product?.name || t('admin.review_management.unknown_product')
}

const deleteReview = async (reviewId?: string) => {
  if (!reviewId) return

  if (!confirm(t('admin.review_management.confirm_delete'))) {
    return
  }

  try {
    const token = sessionStorage.getItem('accessToken')
    await axios.delete(`http://localhost:8080/api/reviews/admin/${reviewId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    // Reload reviews
    await loadReviews()

    // Close modal if open
    if (showDetail.value && selectedReview.value?.id === reviewId) {
      closeDetail()
    }

    alert(t('admin.review_management.delete_success'))
  } catch (error) {
    console.error('Failed to delete review:', error)
    alert(t('admin.review_management.delete_failed'))
  }
}

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return t('admin.review_management.invalid_date')
  }
}

const filtered = computed(() => {
  let result = reviews.value

  // Search filter
  if (search.value) {
    const query = search.value.toLowerCase()
    result = result.filter(r =>
      getProductName(r.productId).toLowerCase().includes(query) ||
      (r.userName || r.userId).toLowerCase().includes(query) ||
      (r.title || '').toLowerCase().includes(query) ||
      (r.body || '').toLowerCase().includes(query)
    )
  }

  // Rating filter
  if (filterRating.value) {
    const rating = Number(filterRating.value)
    result = result.filter(r => r.rating === rating)
  }

  return result
})

const totalPages = computed(() => Math.ceil(filtered.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filtered.value.length))

const paginatedReviews = computed(() => {
  return filtered.value.slice(startIndex.value, endIndex.value)
})

const displayPages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = currentPage.value

  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)

  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0)
  return sum / reviews.value.length
})

const fiveStarCount = computed(() => reviews.value.filter(r => r.rating === 5).length)
const verifiedCount = computed(() => reviews.value.filter(r => r.verified).length)

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const openDetail = (review: Review) => {
  selectedReview.value = review
  showDetail.value = true
}

const closeDetail = () => {
  showDetail.value = false
  selectedReview.value = null
}

onMounted(() => {
  loadReviews()
  loadProducts()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
