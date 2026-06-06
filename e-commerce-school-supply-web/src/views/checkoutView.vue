<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors">

    <div class="flex flex-col lg:flex-row justify-around gap-6 p-4 md:p-6 lg:p-10">

    <!-- Left side -->

    <div class="w-full lg:flex-1">
      <div class="w-full p-4 md:p-6 lg:p-8 border border-gray-200 dark:border-gray-700 rounded-2xl mb-5 bg-white dark:bg-gray-800 transition-colors">

        <h2 class="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4">{{ $t('checkout.delivery_address') }}</h2>

        <AddDropdown
          :addresses="savedAddresses"
          v-model="selectedAddress"
          class="mb-5"
        />
        <div class="mt-3 mb-5 flex flex-col sm:flex-row gap-2">
          <button v-if="selectedAddress && selectedAddress.id" @click="openEdit" class="w-full sm:w-auto px-4 py-2 bg-[#1A535C] text-white rounded hover:bg-[#2A7A8F] transition-colors">{{ $t('checkout.edit_selected_address') }}</button>
          <button @click="addNewAddress" class="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">{{ $t('checkout.add_new_address') }}</button>
        </div>

        <!-- Address Detail Section -->
        <h3 class="mb-4 text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">{{ $t('checkout.address_detail') }}</h3>

        <div v-if="selectedAddress" class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('checkout.country') }}</label>
            <input v-model="selectedAddress.country" placeholder="Cambodia" type="text" class="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('checkout.province_city') }}</label>
            <select v-model="selectedAddress.province" class="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
              <option value="">{{ $t('checkout.select_province') }}</option>
              <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('checkout.house_number') }}</label>
            <input v-model="selectedAddress.houseNumber" placeholder="#" type="text" class="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('checkout.street') }}</label>
            <input v-model="selectedAddress.street" placeholder="St." type="text" class="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('checkout.address_line_1') }}</label>
            <input v-model="selectedAddress.addressLine1" placeholder="Address 1"  type="text" class="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('checkout.address_line_2') }}</label>
            <input v-model="selectedAddress.addressLine2" placeholder="Address 2" type="text" class="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('checkout.zip_code') }}</label>
            <input v-model="selectedAddress.zipCode" placeholder="000000" type="text" class="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors" />
          </div>

        </div>
      </div>

        <!-- Shipping option -->
        <div class="w-full border border-gray-200 dark:border-gray-700 rounded-2xl p-4 md:p-6 lg:p-8 mb-5 bg-white dark:bg-gray-800 transition-colors">
          <div class="mb-4 text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ $t('checkout.shipping_options') }}
          </div>

          <div class="flex flex-col sm:flex-row gap-4 md:gap-6">
          <ShippingOption
            :label="$t('checkout.shipping_standard')"
            :description="$t('checkout.shipping_standard_days')"
            :price="computeShippingFor('standard')"
            :selected="selectedShipping === 'standard'"
            @select="selectedShipping = 'standard'"/>

          <ShippingOption
              :label="$t('checkout.shipping_priority')"
              :description="$t('checkout.shipping_priority_days')"
              :price="computeShippingFor('priority')"
              :selected="selectedShipping === 'priority'"
              @select="selectedShipping = 'priority'"/>

          </div>
        </div>

        <!-- Payment option -->
         <div class="w-full border border-gray-200 dark:border-gray-700 rounded-2xl p-4 md:p-6 lg:p-8 bg-white dark:bg-gray-800 transition-colors">
          <div class="mb-4 text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ $t('checkout.payment_method') }}
          </div>

          <div class="flex flex-col gap-3">
              <PaymentOption
                v-for="option in paymentOptions"
                :key="option.key"
                :label="option.label"
                :description="option.description"
                :image="option.image"
                :selected="selectedCardment === option.key"
                @select="selectedCardment = option.key"
              />

            <PayDropdown
              :cards="savedCards"
              v-if="selectedCardment === 'card'"
              v-model="selectedCard"
            />

            <div v-if="selectedCardment === 'card' && selectedCard" class="grid grid-cols-1 gap-4">

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('checkout.name_on_card') }}</label>
                  <input v-model="selectedCard.name" placeholder="Your name" type="text" class="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('checkout.card_number') }}</label>
                  <input v-model="selectedCard.cardNum" placeholder="0000 0000 0000 0000" type="text" class="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors" />
                </div>

                <div class="flex flex-col sm:flex-row gap-4">
                  <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('checkout.expiration_date') }}</label>
                    <input v-model="selectedCard.expire" placeholder="00/00" type="text" class="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors" />
                  </div>

                  <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('checkout.cvv') }}</label>
                    <input v-model="selectedCard.cvv" placeholder="000" type="text" class="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors" />
                  </div>
                </div>
            </div>

          </div>
        </div>


    </div>


    <!-- Right side -->
    <div class="w-full lg:w-auto lg:min-w-[400px] bg-white dark:bg-gray-900 p-4 transition-colors">

      <div class="w-full">
        <div class="flex flex-col-reverse">
          <!-- Main content area -->
          <div class="flex-1"></div>

          <!-- Order Summary Card -->
          <div class="w-full">
              <!-- Title -->
              <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-8 text-gray-900 dark:text-gray-100">{{ $t('cart.summary_title') }}</h2>

              <!-- Order Items -->
              <div class="space-y-4 md:space-y-6 pb-4 md:pb-6">
                <div
                  v-for="item in orderItems"
                  :key="item.productId"
                  class="flex gap-3 md:gap-4"
                >
                  <!-- Product Image -->
                  <div class="shrink-0">
                    <img
                      :src="resolveItemImage(item)"
                      :alt="item.name"
                      class="w-16 h-16 md:w-20 md:h-20 object-cover rounded"
                    />
                  </div>

                  <!-- Product Details -->
                  <div class="grow">
                    <h3 class="text-sm md:text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {{ item.name }}
                    </h3>
                    <p class="text-xs md:text-sm font-light mt-1 text-gray-600 dark:text-gray-300">
                      {{ item.color }}
                    </p>
                  </div>

                  <!-- Price -->
                  <div class="shrink-0 text-right">
                    <p class="text-sm md:text-base font-bold text-gray-900 dark:text-gray-100">
                      ${{ item.price.toFixed(2) }}
                    </p>
                    <p class="text-xs md:text-sm font-light text-gray-500 dark:text-gray-300">
                      x{{ item.quantity }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Divider -->
              <hr class="border-2 border-gray-200 dark:border-gray-700 mb-6" />

              <!-- Price Breakdown -->
              <div class="space-y-3 md:space-y-4 mb-4 md:mb-6">
                <div class="flex justify-between items-center text-base md:text-lg lg:text-xl text-gray-900 dark:text-gray-100">
                  <span>{{ $t('cart.subtotal') }}</span>
                  <span>${{ subtotal.toFixed(2) }}</span>
                </div>

                <div class="flex justify-between items-center text-base md:text-lg lg:text-xl text-gray-900 dark:text-gray-100">
                  <span>{{ $t('checkout.discount') }}</span>
                  <span>-${{ discount.toFixed(2) }}</span>
                </div>

                <div class="flex justify-between items-center text-base md:text-lg lg:text-xl text-gray-900 dark:text-gray-100">
                  <span>{{ $t('cart.tax') }}</span>
                  <span>${{ tax.toFixed(2) }}</span>
                </div>

                <div class="flex justify-between items-center text-base md:text-lg lg:text-xl text-gray-900 dark:text-gray-100">
                  <span>{{ $t('cart.shipping') }}</span>
                  <span>{{ Shipping }}</span>
                </div>
              </div>

              <!-- Divider -->
              <hr class="border-2 border-gray-200 dark:border-gray-700 mb-6" />

              <!-- Total -->
              <div class="flex justify-between items-center mb-4 md:mb-8">
                <span class="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ $t('cart.total') }}</span>
                <span class="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  ${{ total.toFixed(2) }}
                </span>
              </div>

              <!-- Discount Code Input -->
              <div class="flex flex-col sm:flex-row gap-2 mb-4 md:mb-6">
                <input
                  type="text"
                  :placeholder="$t('checkout.discount_code')"
                  v-model="discountCode"
                  class="grow px-3 md:px-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded text-sm md:text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors"
                />
                <button
                  @click="handleApplyDiscount"
                  class="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-[#1A535C] text-white font-medium rounded hover:bg-[#2A7A8F] transition-colors text-sm md:text-base"
                >
                  {{ $t('common.apply') }}
                </button>
              </div>

              <!-- Confirm & Pay Button -->
              <button
                @click="handleConfirmPayment"
                :disabled="isProcessing"
                class="w-full py-3 md:py-4 bg-[#1A535C] text-white font-bold rounded text-sm md:text-base disabled:opacity-60 hover:bg-[#2A7A8F] transition-colors"
              >
                <span v-if="isProcessing">{{ $t('common.processing') }}</span>
                <span v-else>{{ $t('checkout.confirm_pay') }} ${{ total.toFixed(2) }}</span>
              </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Address Edit Modal -->
  <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-colors">
    <div class="bg-white dark:bg-gray-800 w-full max-w-3xl p-6 rounded-lg shadow-xl transition-colors">
      <AddressEdit :address="editingAddress" @save="onAddressSave" @cancel="closeEdit" />
    </div>
  </div>

  <!-- QR overlay shown after clicking Confirm & Pay -->
  <div v-if="showQR" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-colors p-4">
    <div class="bg-white p-6 md:p-10 lg:p-12 rounded-2xl md:rounded-3xl w-full max-w-md md:max-w-2xl text-center shadow-2xl transition-colors">
      <h3 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900">{{ $t('checkout.scan_to_pay') }}</h3>
      <img :src="QRImage" alt="QR" class="mx-auto mb-4 md:mb-6 w-56 h-56 md:w-72 md:h-72 lg:w-96 lg:h-96 object-contain" />
      <div class="mt-4 flex justify-center">
        <button
          @click="handleDone"
          :disabled="isDoneProcessing"
          class="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 bg-[#1A535C] text-white rounded-lg md:rounded-xl text-base md:text-lg shadow hover:bg-[#2A7A8F] transition-colors disabled:opacity-60"
        >
          <span v-if="isDoneProcessing">{{ $t('common.processing') }}</span>
          <span v-else>{{ $t('common.done') }}</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Success overlay shown after order is placed -->
  <div v-if="showSuccess" class="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-colors p-4" >
    <div class="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl w-full max-w-sm md:max-w-md text-center shadow-2xl transition-colors">
      <div class="flex items-center justify-center mb-4">
        <div class="bg-green-100 text-green-700 rounded-full p-3 md:p-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      <h3 class="text-xl md:text-2xl font-bold mb-2 text-gray-900 ">{{ $t('checkout.order_success_title') }}</h3>
      <p class="text-sm md:text-base text-gray-600 mb-3 md:mb-4">{{ $t('checkout.order_success_msg') }}</p>
      <p class="text-sm md:text-base font-semibold mb-4 md:mb-6 text-gray-900">{{ $t('cart.total') }}: ${{ successTotal.toFixed(2) }}</p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button @click="goToOrders" class="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-[#1A535C] text-white rounded-md font-medium hover:bg-[#2A7A8F] transition-colors text-sm md:text-base">{{ $t('checkout.view_orders') }}</button>
        <button @click="continueShopping" class="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm md:text-base">{{ $t('common.continue_shopping') }}</button>
      </div>
    </div>
  </div>

  <!-- Simple inline error banner -->
  <div v-if="errorMessage" class="fixed top-6 right-6 z-70">
    <div class="bg-red-600 text-white px-4 py-2 rounded shadow">{{ errorMessage }}</div>
  </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ShippingOption from '@/components/ShippingOption.vue'
import PaymentOption from '@/components/PaymentOption.vue'
import AddressEdit from '@/components/profile/edit/AddressEdit.vue'
import { useCartStore } from '@/stores/cartStore'
import orderService from '@/services/orderService'
import authService from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

// photo import
import aba from '@/assets/images/aba.png'
import khqr from '@/assets/images/khqr.png'
import QRImage from '@/assets/images/QR.jpg'
import authBackground from '@/assets/images/auth_background.jpg'

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

// Gracefully resolve item image from api path, array, or fallback
const resolveItemImage = (item: any) => {
  const raw = (Array.isArray(item.images) && item.images[0]) || item.image || ''
  const cleaned = typeof raw === 'string' ? raw.trim() : ''
  if (!cleaned) return '/Photo/ourproduct.png'
  if (cleaned.startsWith('/')) return `${String(API_BASE_URL).replace(/\/$/, '')}${cleaned}`
  return cleaned
}


//shipping and Payment option
const selectedShipping = ref('standard')
const selectedCardment = ref('default')

const { t } = useI18n()
const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  // Ensure cart is loaded from backend
  try {
    await cartStore.fetchCart()
  } catch (err) {
    console.error('Failed to load cart for checkout', err)
  }
  // Load addresses from backend
  await loadAddresses()
})

// Payment Option
const paymentOptions = [
  {
    key: 'default',
    label: 'ABA Pay',
    description: 'Pay with ABA bank',
    image: aba,
    type: 'ABA'
  },
  {
    key: 'khqr',
    label: 'KHQR',
    description: 'Pay with other member bank',
    image: khqr,
    type: 'KHQR'
  },
  {
    key: 'card',
    label: 'Credit Card',
    description: 'Pay via bank',
    image: null,
    type: 'CARD'
  }
]


// Use cart store items directly for the order summary
const orderItems = computed(() => cartStore.items)

// Provinces list for dropdown
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

const paymentMethod = computed(() => {
  return paymentOptions.find(p => p.key === selectedCardment.value)?.type ?? null
})

// Helper to compute shipping price for a given method based on selected address
function computeShippingFor(method: 'standard' | 'priority') {
  const province = (selectedAddress.value?.province || '').toString().toLowerCase()
  const isPhnomPenh = province.includes('phnom') || province.includes('phnom penh')

  if (isPhnomPenh) {
    return method === 'priority' ? 2.99 : 0
  }

  return method === 'priority' ? 4.99 : 2.99
}

const discountCode = ref('')
const discount = ref(0)
const isProcessing = ref(false)
const showQR = ref(false)
const isDoneProcessing = ref(false)
const showSuccess = ref(false)
const successTotal = ref(0)
const errorMessage = ref('')

// background for full-screen overlays — use `auth_background.jpg` from assets
const overlayBackground = {
  backgroundImage: `url('${authBackground}')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

// Compute shipping cost based on selected address and selectedShipping option
const shippingCost = computed(() => computeShippingFor(selectedShipping.value === 'priority' ? 'priority' : 'standard'))

const Shipping = computed(() => (shippingCost.value === 0 ? t('cart.free') : `$${shippingCost.value.toFixed(2)}`))

const subtotal = computed(() => cartStore.subtotal)
const tax = computed(() => cartStore.tax)
const total = computed(() => subtotal.value + tax.value + shippingCost.value - discount.value)

function handleApplyDiscount() {
  if (discountCode.value === 'SAVE10') {
    discount.value = 0.1
  } else {
    discount.value = 0
  }
}

async function handleConfirmPayment() {
  if (cartStore.items.length === 0) {
    alert(t('cart.alert_empty'))
    return
  }

  if (!selectedAddress.value || !selectedAddress.value.setName) {
    alert(t('checkout.alert_address_required'))
    return
  }

  // Show QR and wait for user to click "Done" to finalize order
  showQR.value = true
}

async function handleDone() {
  if (isDoneProcessing.value) return
  isDoneProcessing.value = true

  try {
    const finalAmount = total.value
    const payload = {
      cartId: cartStore.cartId,
      address: selectedAddress.value,
      payment: selectedCardment.value === 'card' ? selectedCard.value : null,
      paymentMethod: paymentMethod.value,
      status: 'PAID',
      shipping: selectedShipping.value,
    }

    await orderService.createOrder(payload)
    successTotal.value = finalAmount
    // Clear cart locally (server already cleared it)
    try {
      await cartStore.clearCart()
    } catch (e) {
      console.warn('Failed to clear cart after order:', e)
    }

    // show success UI instead of alert

    showQR.value = false
    showSuccess.value = true
  } catch (err) {
    console.error('Failed to create order:', err)
    let message = t('checkout.order_failed')
    if (err && (err as Error).message) {
      message = (err as Error).message || message
    }
    // show a simple inline error notification by toggling QR off and logging
    // we can extend with an error modal if desired
    showQR.value = false
    // reuse isDoneProcessing to show a toast would be better; for now use console and a short local banner
    errorMessage.value = message
  } finally {
    isDoneProcessing.value = false
  }
}

//Address DropDown
import AddDropdown from '@/components/AddDropdown.vue'

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

const selectedAddress = ref<Address>({
  id: 0,
  setName: '',
  country: '',
  province: '',
  houseNumber: '',
  street: '',
  addressLine1: '',
  addressLine2: '',
  zipCode: '',
})

const savedAddresses = ref<Address[]>([])

// Load addresses from backend
async function loadAddresses() {
  try {
    const res = await authService.getProfile()
    const profile = res.data
    if (profile && Array.isArray(profile.addresses) && profile.addresses.length) {
      savedAddresses.value = profile.addresses.map((a: any, idx: number) => ({
        id: a.id || Date.now() + idx,
        setName: a.label || a.setName || `Address ${idx + 1}`,
        country: a.country || '',
        province: a.city || a.province || '',
        houseNumber: a.houseNumber || '',
        street: a.street || '',
        addressLine1: a.addressLine || a.addressLine1 || '',
        addressLine2: a.addressLine2 || '',
        zipCode: a.zipCode || '',
      }))
    }
  } catch (err) {
    console.debug('Failed to load addresses:', err)
  }
}

// Edit modal state and helpers
import { reactive } from 'vue'
const showEditModal = ref(false)
const editingAddress = reactive({ ...(savedAddresses.value[0] ?? {}) })

function openEdit() {
  if (!selectedAddress.value) return
  Object.assign(editingAddress, { ...selectedAddress.value })
  showEditModal.value = true
}

function closeEdit() {
  showEditModal.value = false
}

function addNewAddress() {
  // open empty form for new address
  Object.assign(editingAddress, {
    id: Date.now(),
    setName: '',
    country: '',
    province: '',
    houseNumber: '',
    street: '',
    addressLine1: '',
    addressLine2: '',
    zipCode: '',
  })
  showEditModal.value = true
}

async function onAddressSave(addr: any) {
  // update or insert into savedAddresses
  const idx = savedAddresses.value.findIndex(a => a.id === addr.id)
  if (idx >= 0) {
    savedAddresses.value[idx] = { ...addr }
  } else {
    savedAddresses.value.push({ ...addr })
  }
  // set selectedAddress to updated address
  selectedAddress.value = { ...addr }
  showEditModal.value = false

  // Save to backend
  try {
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
      isDefault: false,
    }))
    await authStore.updateProfile({ addresses: toServer })
    // Refetch profile to update authStore user with latest addresses
    const res = await authService.getProfile()
    if (res.data) {
      authStore.user = { ...authStore.user, ...res.data }
    }
    // Reload addresses from backend to ensure sync
    await loadAddresses()
  } catch (err) {
    console.error('Failed to save address:', err)
    errorMessage.value = t('checkout.address_save_failed')
  }
}

import PayDropdown from '@/components/PayDropdown.vue'

type Card = {
  id: number
  cardType: string
  name: string
  cardNum: string
  expire: string
  cvv: string
}

const selectedCard = ref<Card>({
  id: 0,
  cardType: '',
  name: '',
  cardNum: '',
  expire: '',
  cvv: '',
})

const savedCards: Card[] = [
  {
    id: 1,
    cardType: 'Visa',
    name: 'KITTY LIM',
    cardNum: '4111 1111 1111 1111',
    expire: '12/27',
    cvv: '123',
  },
  {
    id: 2,
    cardType: 'MasterCard',
    name: 'VIREAK',
    cardNum: '5500 0000 0000 0004',
    expire: '08/26',
    cvv: '456',
  },
]

// navigation helpers for success overlay
function goToOrders() {
  showSuccess.value = false
  router.push({ name: 'my-orders' })
}

function continueShopping() {
  showSuccess.value = false
  router.push({ name: 'Product List' })
}

</script>

<!-- <script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ShippingOption from '@/components/ShippingOption.vue'
import PaymentOption from '@/components/PaymentOption.vue'
import AddressEdit from '@/components/profile/edit/AddressEdit.vue'
import { useCartStore } from '@/stores/cartStore'
import orderService from '@/services/orderService'
import authService from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

// photo import
import aba from '@/assets/images/aba.png'
import khqr from '@/assets/images/khqr.png'
import QRImage from '@/assets/images/QR.jpg'
import authBackground from '@/assets/images/auth_background.jpg'


//shipping and Payment option
const selectedShipping = ref('standard')
const selectedCardment = ref('default')

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  // Ensure cart is loaded from backend
  try {
    await cartStore.fetchCart()
  } catch (err) {
    console.error('Failed to load cart for checkout', err)
  }
  // Load addresses from backend
  await loadAddresses()
})

// Payment Option
const paymentOptions = [
  {
    key: 'default',
    label: 'ABA Pay',
    description: 'Pay with ABA bank',
    image: aba,
    type: 'ABA'
  },
  {
    key: 'khqr',
    label: 'KHQR',
    description: 'Pay with other member bank',
    image: khqr,
    type: 'KHQR'
  },
  {
    key: 'card',
    label: 'Credit Card',
    description: 'Pay via bank',
    image: null,
    type: 'CARD'
  }
]


// Use cart store items directly for the order summary
const orderItems = computed(() => cartStore.items)

// Provinces list for dropdown
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

const paymentMethod = computed(() => {
  return paymentOptions.find(p => p.key === selectedCardment.value)?.type ?? null
})

// Helper to compute shipping price for a given method based on selected address
function computeShippingFor(method: 'standard' | 'priority') {
  const province = (selectedAddress.value?.province || '').toString().toLowerCase()
  const isPhnomPenh = province.includes('phnom') || province.includes('phnom penh')

  if (isPhnomPenh) {
    return method === 'priority' ? 2.99 : 0
  }

  return method === 'priority' ? 4.99 : 2.99
}

const discountCode = ref('')
const discount = ref(0)
const isProcessing = ref(false)
const showQR = ref(false)
const isDoneProcessing = ref(false)
const showSuccess = ref(false)
const successTotal = ref(0)
const errorMessage = ref('')

// background for full-screen overlays — use `auth_background.jpg` from assets
const overlayBackground = {
  backgroundImage: `url('${authBackground}')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

// Compute shipping cost based on selected address and selectedShipping option
const shippingCost = computed(() => computeShippingFor(selectedShipping.value === 'priority' ? 'priority' : 'standard'))

const Shipping = computed(() => (shippingCost.value === 0 ? 'Free' : `$${shippingCost.value.toFixed(2)}`))

const subtotal = computed(() => cartStore.subtotal)
const tax = computed(() => cartStore.tax)
const total = computed(() => subtotal.value + tax.value + shippingCost.value - discount.value)

function handleApplyDiscount() {
  if (discountCode.value === 'SAVE10') {
    discount.value = 0.1
  } else {
    discount.value = 0
  }
}

async function handleConfirmPayment() {
  if (cartStore.items.length === 0) {
    alert('Your cart is empty.')
    return
  }

  if (!selectedAddress.value || !selectedAddress.value.setName) {
    alert('Please select or enter a delivery address before confirming.')
    return
  }

  // Show QR and wait for user to click "Done" to finalize order
  showQR.value = true
}

async function handleDone() {
  if (isDoneProcessing.value) return
  isDoneProcessing.value = true

  try {
    const finalAmount = total.value
    const payload = {
      cartId: cartStore.cartId,
      address: selectedAddress.value,
      payment: selectedCardment.value === 'card' ? selectedCard.value : null,
      paymentMethod: paymentMethod.value,
      status: 'PAID',
      shipping: selectedShipping.value,
    }

    await orderService.createOrder(payload)
    successTotal.value = finalAmount
    // Clear cart locally (server already cleared it)
    try {
      await cartStore.clearCart()
    } catch (e) {
      console.warn('Failed to clear cart after order:', e)
    }

    // show success UI instead of alert

    showQR.value = false
    showSuccess.value = true
  } catch (err) {
    console.error('Failed to create order:', err)
    let message = 'Failed to place order. Please try again.'
    if (err && (err as Error).message) {
      message = (err as Error).message || message
    }
    // show a simple inline error notification by toggling QR off and logging
    // we can extend with an error modal if desired
    showQR.value = false
    // reuse isDoneProcessing to show a toast would be better; for now use console and a short local banner
    errorMessage.value = message
  } finally {
    isDoneProcessing.value = false
  }
}

//Address DropDown
import AddDropdown from '@/components/AddDropdown.vue'

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

const selectedAddress = ref<Address>({
  id: 0,
  setName: '',
  country: '',
  province: '',
  houseNumber: '',
  street: '',
  addressLine1: '',
  addressLine2: '',
  zipCode: '',
})

const savedAddresses = ref<Address[]>([])

// Load addresses from backend
async function loadAddresses() {
  try {
    const res = await authService.getProfile()
    const profile = res.data
    if (profile && Array.isArray(profile.addresses) && profile.addresses.length) {
      savedAddresses.value = profile.addresses.map((a: any, idx: number) => ({
        id: a.id || Date.now() + idx,
        setName: a.label || a.setName || `Address ${idx + 1}`,
        country: a.country || '',
        province: a.city || a.province || '',
        houseNumber: a.houseNumber || '',
        street: a.street || '',
        addressLine1: a.addressLine || a.addressLine1 || '',
        addressLine2: a.addressLine2 || '',
        zipCode: a.zipCode || '',
      }))
    }
  } catch (err) {
    console.debug('Failed to load addresses:', err)
  }
}

// Edit modal state and helpers
import { reactive } from 'vue'
const showEditModal = ref(false)
const editingAddress = reactive({ ...(savedAddresses.value[0] ?? {}) })

function openEdit() {
  if (!selectedAddress.value) return
  Object.assign(editingAddress, { ...selectedAddress.value })
  showEditModal.value = true
}

function closeEdit() {
  showEditModal.value = false
}

function addNewAddress() {
  // open empty form for new address
  Object.assign(editingAddress, {
    id: Date.now(),
    setName: '',
    country: '',
    province: '',
    houseNumber: '',
    street: '',
    addressLine1: '',
    addressLine2: '',
    zipCode: '',
  })
  showEditModal.value = true
}

async function onAddressSave(addr: any) {
  // update or insert into savedAddresses
  const idx = savedAddresses.value.findIndex(a => a.id === addr.id)
  if (idx >= 0) {
    savedAddresses.value[idx] = { ...addr }
  } else {
    savedAddresses.value.push({ ...addr })
  }
  // set selectedAddress to updated address
  selectedAddress.value = { ...addr }
  showEditModal.value = false

  // Save to backend
  try {
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
      isDefault: false,
    }))
    await authStore.updateProfile({ addresses: toServer })
    // Refetch profile to update authStore user with latest addresses
    const res = await authService.getProfile()
    if (res.data) {
      authStore.user = { ...authStore.user, ...res.data }
    }
    // Reload addresses from backend to ensure sync
    await loadAddresses()
  } catch (err) {
    console.error('Failed to save address:', err)
    errorMessage.value = 'Failed to save address. Please try again.'
  }
}

import PayDropdown from '@/components/PayDropdown.vue'

type Card = {
  id: number
  cardType: string
  name: string
  cardNum: string
  expire: string
  cvv: string
}

const selectedCard = ref<Card>({
  id: 0,
  cardType: '',
  name: '',
  cardNum: '',
  expire: '',
  cvv: '',
})

const savedCards: Card[] = [
  {
    id: 1,
    cardType: 'Visa',
    name: 'KITTY LIM',
    cardNum: '4111 1111 1111 1111',
    expire: '12/27',
    cvv: '123',
  },
  {
    id: 2,
    cardType: 'MasterCard',
    name: 'VIREAK',
    cardNum: '5500 0000 0000 0004',
    expire: '08/26',
    cvv: '456',
  },
]

// navigation helpers for success overlay
function goToOrders() {
  showSuccess.value = false
  router.push({ name: 'profile' })
}

function continueShopping() {
  showSuccess.value = false
  router.push({ name: 'home' })
}

</script> -->
