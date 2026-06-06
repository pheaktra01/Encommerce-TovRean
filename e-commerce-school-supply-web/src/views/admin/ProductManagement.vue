<script setup lang="ts">
import { ref, reactive, onMounted, computed, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { IconDotsVertical, IconSearch } from '@tabler/icons-vue'
import { productService } from '@/services/productService'
import type { Product } from '@/types/product'
import BlankProfile from '@/assets/images/pfp_blank.jpeg'

const API_BASE_URL = import.meta.env.VITE_API_URL as string
const { t } = useI18n()

const products = ref<Product[]>([])
const selectedProducts = ref<string[]>([])
const searchQuery = ref('')
const loading = ref(false)
const showAddForm = ref(false)
const isEditMode = ref(false)
const editingProductId = ref<string | null>(null)
const openDropdown = ref<string | null>(null)
const selectedFile = ref<File | null>(null);

interface ProductImage {
  id: string;        // Unique ID for v-for key
  preview: string;   // The URL to show in <img> (Base64 or Server URL)
  file?: File;       // The raw file to upload (only for new images)
}


const productImages = ref<ProductImage[]>([])

const productForm = reactive({
  name: '',
  description: '',
  mainCategory: '',
  subCategory: '',
  type: '',
  size: '',
  color: '',
  material: '',
  brandName: '',
  stockQuantity: 0,
  salePrice: 0,
  discount: 0,
  images: [] as string[],
})

const categories = {
  'Writing Instruments': ['Pens', 'Pencils', 'Markers', 'Highlighters', 'Crayons', 'Chalk'],
  'Paper Products': ['Notebooks', 'Loose Leaf Paper', 'Sticky Notes', 'Index Cards', 'Construction Paper', 'Drawing Paper'],
  'Art & Craft Supplies': ['Paint', 'Brushes', 'Colored Pencils', 'Scissors', 'Glue', 'Tape', 'Clay', 'Craft Kits'],
  'Organization & Storage': ['Binders', 'Folders', 'Dividers', 'Pencil Cases', 'Organizers', 'Backpack Accessories'],
  'School Bags & Carriers': ['Backpacks', 'Messenger Bags', 'Lunch Bags', 'Pencil Pouches', 'Laptop Bags'],
  'Classroom & Teaching Supplies': ['Whiteboards', 'Bulletin Boards', 'Educational Posters', 'Classroom Decor', 'Teaching Aids'],
  'Books & Learning Materials': ['Textbooks', 'Workbooks', 'Reference Books', 'Educational Games', 'Flashcards', 'Study Guides'],
  'Technology & Electronics': ['Calculators', 'USB Drives', 'Headphones', 'Laptop Accessories', 'Batteries'],
  'Health & Safety': ['Hand Sanitizers', 'Masks', 'First Aid Supplies', 'Tissues', 'Wet Wipes'],
}

const availableSubCategories = computed(() => {
  if (!productForm.mainCategory || !categories[productForm.mainCategory as keyof typeof categories]) {
    return []
  }
  return categories[productForm.mainCategory as keyof typeof categories]
})

const loadProducts = async () => {
  try {
    loading.value = true
    products.value = await productService.getAllProducts()
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    loading.value = false
  }
}

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  const query = searchQuery.value.toLowerCase()
  return products.value.filter(p =>
    p.name?.toLowerCase().includes(query) ||
    p.mainCategory?.toLowerCase().includes(query)
  )
})

const resetForm = () => {
  productForm.name = ''
  productForm.description = ''
  productForm.mainCategory = ''
  productForm.subCategory = ''
  productForm.type = ''
  productForm.size = ''
  productForm.color = ''
  productForm.material = ''
  productForm.brandName = ''
  productForm.stockQuantity = 0
  productForm.salePrice = 0
  productForm.discount = 0
  productImages.value = [] // Clear previews
  isEditMode.value = false
  editingProductId.value = null
}

const openAddForm = () => {
  resetForm()
  showAddForm.value = true
}

const openEditForm = (product: Product) => {
  resetForm() // Reset previews first
  isEditMode.value = true
  editingProductId.value = product.id || null
  productForm.name = product.name || ''
  productForm.description = product.description || ''
  productForm.mainCategory = product.mainCategory || ''
  productForm.subCategory = product.subCategory || ''
  productForm.type = product.type || ''
  productForm.size = product.size || ''
  productForm.color = product.color || ''
  productForm.material = product.material || ''
  productForm.brandName = product.brandName || ''
  productForm.stockQuantity = product.stockQuantity || 0
  productForm.salePrice = product.price || 0
  productForm.discount = product.discount || 0
  
  // Populate previews from existing product images
  const existingImages = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images
    : (product.imageUrl ? [product.imageUrl] : [])

  productImages.value = existingImages.map(url => ({
    id: url, // Use URL as a temporary unique ID
    preview: resolveProductImage({ ...product, imageUrl: url, images: [] }), // Use resolver for full URL
    file: undefined // No raw file for existing images
  }))

  showAddForm.value = true
}

const closeAddForm = () => {
  showAddForm.value = false
}

const onFilesSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
    if (target.files) {
      processFiles(target.files);
    }
}

const processFiles = (files: FileList) => {
  Array.from(files).forEach((file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload only image files')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB')
      return
    }

    // Create a local preview and store the file
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        productImages.value.push({
          id: Date.now() + Math.random().toString(), // Temp ID
          preview: reader.result,
          file: file // <--- Store the file here!
        })
      }
    }
    reader.readAsDataURL(file)
  })
}

const onDragOver = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
}

const onDrop = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  if (e.dataTransfer?.files) {
    processFiles(e.dataTransfer.files)
  }
}

const removeImage = (index: number) => {
  productImages.value.splice(index, 1)
}

const saveProduct = async () => {
  try {
    loading.value = true

    const token = sessionStorage.getItem('accessToken')
    if (!token) {
      alert('Please login first to ' + (isEditMode.value ? 'update' : 'add') + ' products')
      return
    }

    // Separate new files from existing image URLs
    const newFiles = productImages.value.map(img => img.file).filter((file): file is File => !!file)
    const existingImageUrls = productImages.value
      .filter(img => !img.file) // Keep all non-file-based images
      .map(img => {
        // The goal is to store the relative path, e.g., /products/image.jpg
        // If the preview URL is a full URL, strip the origin.
        try {
          const url = new URL(img.preview)
          if (url.origin === API_BASE_URL || window.location.origin) {
            return url.pathname // This gives /products/....
          }
        } catch (e) {
          // Not a full URL, assume it's already a relative path
        }
        return img.preview
      })

    // Upload new files and get their URLs
    const uploadedImageUrls = []
    for (const file of newFiles) {
      try {
        // productService.uploadImage is expected to return the relative path, e.g., /products/new-image.jpg
        const imageUrl = await productService.uploadImage(file)
        uploadedImageUrls.push(imageUrl)
      } catch (uploadError) {
        console.error('Failed to upload an image:', uploadError)
        alert('An error occurred while uploading an image. Please try again.')
        loading.value = false
        return
      }
    }

    // Combine existing and newly uploaded image URLs
    const allImageUrls = [...existingImageUrls, ...uploadedImageUrls]

    if (!productForm.name || !productForm.salePrice) {
      alert('Please fill in product name and price')
      loading.value = false
      return
    }

    const productData = {
      name: productForm.name || 'Untitled Product',
      description: productForm.description,
      mainCategory: productForm.mainCategory,
      subCategory: productForm.subCategory,
      type: productForm.type,
      size: productForm.size,
      color: productForm.color,
      material: productForm.material,
      brandName: productForm.brandName,
      stockQuantity: productForm.stockQuantity,
      price: productForm.salePrice,
      discount: productForm.discount,
      images: allImageUrls, // Send the final combined list of image URLs
      imageUrl: allImageUrls[0] || '' // For legacy support
    }

    if (isEditMode.value && editingProductId.value) {
      await productService.updateProduct(editingProductId.value, productData)
      alert('Product updated successfully!')
    } else {
      await productService.createProduct(productData)
      alert('Product added successfully!')
    }

    await loadProducts()
    closeAddForm()
  } catch (error: any) {
    console.error('Failed to save product:', error)
    if (error.response?.status === 403) {
      alert('Authentication failed. Please login again.')
    } else {
      alert('Failed to save product: ' + (error.response?.data?.message || error.message))
    }
  } finally {
    loading.value = false
  }
}

const deleteProduct = async (productId: string) => {
  if (!confirm(t('admin.product_management.confirm_delete'))) return

  try {
    loading.value = true

    const token = sessionStorage.getItem('accessToken')
    if (!token) {
      alert('Please login first to delete products')
      return
    }

    await productService.deleteProduct(productId)
    await loadProducts()
  } catch (error: any) {
    console.error('Failed to delete product:', error)
    if (error.response?.status === 403) {
      alert('Authentication failed. Please login again.')
    } else {
      alert('Failed to delete product: ' + (error.response?.data?.message || error.message))
    }
  } finally {
    loading.value = false
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    openDropdown.value = null
  }
}

onMounted(() => {
  loadProducts()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleSelectAll = () => {
  if (selectedProducts.value.length === paginatedProducts.value.length) {
    selectedProducts.value = []
  } else {
    selectedProducts.value = paginatedProducts.value.map((p) => p.id!)
  }
}

const toggleSelectProduct = (productId: string) => {
  const index = selectedProducts.value.indexOf(productId)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  } else {
    selectedProducts.value.push(productId)
  }
}

const isSelected = (productId: string) => {
  return selectedProducts.value.includes(productId)
}

const toggleDropdown = (productId: string) => {
  if (openDropdown.value === productId) {
    openDropdown.value = null
  } else {
    openDropdown.value = productId
  }
}

const closeDropdown = () => {
  openDropdown.value = null
}

const isDropdownOpen = (productId: string) => {
  return openDropdown.value === productId
}

const resolveProductImage = (product: Product) => {
  const raw = (product.images && product.images[0]) || product.imageUrl || (product as any).imageURL || ''
  const cleaned = typeof raw === 'string' ? raw.trim() : ''
  if (!cleaned) return BlankProfile
  if (cleaned.startsWith('/')) return `${API_BASE_URL}${cleaned}`
  return cleaned
}

// Pagination refs and computed properties
const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredProducts.value.length))

const paginatedProducts = computed(() => {
  return filteredProducts.value.slice(startIndex.value, endIndex.value)
})

const displayPages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = currentPage.value

  // Show max 5 page numbers
  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)

  // Adjust start if we're near the end
  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

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
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded shadow p-6 transition-colors">
    <!-- Header Section -->
    <div class="mb-6">
      <div class="flex flex-col md:flex-row items-center justify-between mb-2 gap-4">
        <h1 class="text-xl font-bold dark:text-gray-100">{{ $t('admin.product_management.title') }}</h1>
        <button @click="openAddForm" class="bg-teal-700 text-white px-4 py-2 rounded text-sm hover:bg-teal-800 dark:bg-[#1A535C] dark:hover:bg-[#2A7A8F] flex items-center gap-2 w-full md:w-auto">
          <span class="text-lg">+</span> {{ $t('admin.product_management.add_product') }}
        </button>
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-300">
        {{ $t('admin.sidebar.product_management') }} / <span class="text-teal-700 dark:text-[#1A535C]">{{ $t('admin.product_management.add_product') }}</span>
      </div>
    </div>

    <!-- Table Container -->
    <div class="border rounded-lg overflow-hidden dark:border-gray-700">
      <!-- Table Controls -->
      <div class="bg-gray-50 dark:bg-gray-800 border-b px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 border-default dark:border-gray-700 transition-colors">
        <div class="flex items-center gap-3">
          <span class="text-sm font-medium">{{ $t('admin.product_management.all_products') }}</span>
          <span class="text-sm text-gray-500 dark:text-gray-300">{{ products.length }}</span>
        </div>
        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="relative w-full md:w-auto">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search Product..."
              class="border rounded px-3 py-1.5 pr-8 text-sm w-full md:w-64 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
            <span class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"><IconSearch size="16"/></span>
          </div>
          <!-- <button class="border rounded px-3 py-1.5 text-sm flex items-center gap-1 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
            <span>⚙️</span>
          </button> -->
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8 text-gray-500 dark:text-gray-300">
        {{ $t('admin.product_management.loading') }}
      </div>

      <!-- Empty State -->
      <div v-else-if="paginatedProducts.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-300">
        {{ $t('admin.product_management.no_products') }}
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800 border-b text-xs text-gray-600 dark:text-gray-300 border-default dark:border-gray-700 hidden md:table-header-group">
            <tr>
              <th class="py-3 px-4 text-left w-12">
                <input
                  type="checkbox"
                  :checked="selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0"
                  @change="toggleSelectAll"
                  class="rounded"
                />
              </th>
              <th class="py-3 px-4 text-left">{{ $t('admin.product_management.product_name') }}</th>
              <th class="py-3 px-4 text-left">{{ $t('admin.product_management.category') }}</th>
              <th class="py-3 px-4 text-left">{{ $t('admin.product_management.stock') }}</th>
              <th class="py-3 px-4 text-left">{{ $t('admin.product_management.price') }}</th>
              <th class="py-3 px-4 text-left">{{ $t('admin.product_management.status') }}</th>
              <th class="py-3 px-4 text-left">{{ $t('admin.product_management.actions') }}</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr
              v-for="product in paginatedProducts"
              :key="product.id"
              class="border-b hover:bg-gray-50 dark:hover:bg-gray-800 border-default dark:border-gray-700 transition-colors flex flex-col md:table-row"
            >
              <!-- Select checkbox -->
              <td class="py-3 px-4 flex justify-between items-center md:table-cell">
                <span class="font-bold md:hidden">Select</span>
                <input
                  type="checkbox"
                  :checked="isSelected(product.id!)"
                  @change="toggleSelectProduct(product.id!)"
                  class="rounded"
                />
              </td>

              <!-- Product image + name -->
              <td class="py-3 px-4 flex justify-between items-center md:table-cell">
                <span class="font-bold md:hidden">{{ $t('admin.product_management.product_name') }}</span>
                <div class="flex items-center gap-3">
                  <img
                    :src="resolveProductImage(product)"
                    :alt="product.name"
                    @error="(e) => (e.target as HTMLImageElement).src = BlankProfile"
                    class="w-10 h-10 rounded object-cover bg-gray-100 dark:bg-gray-700"
                  />
                  <span class="font-medium dark:text-gray-100">{{ product.name }}</span>
                </div>
              </td>

              <!-- Category -->
              <td class="py-3 px-4 text-gray-600 dark:text-gray-300 flex justify-between items-center md:table-cell"><span class="font-bold md:hidden">{{ $t('admin.product_management.category') }}</span>{{ product.mainCategory || 'N/A' }}</td>

              <!-- Stock -->
              <td class="py-3 px-4 text-gray-600 dark:text-gray-300 flex justify-between items-center md:table-cell"><span class="font-bold md:hidden">{{ $t('admin.product_management.stock') }}</span>{{ product.stockQuantity || 0 }}</td>

              <!-- Price -->
              <td class="py-3 px-4 font-medium dark:text-gray-100 flex justify-between items-center md:table-cell"><span class="font-bold md:hidden">{{ $t('admin.product_management.price') }}</span>${{ product.price?.toFixed(2) || '0.00' }}</td>

              <!-- Status -->
              <td class="py-3 px-4 flex justify-between items-center md:table-cell">
                <span class="font-bold md:hidden">{{ $t('admin.product_management.status') }}</span>
                <span
                  v-if="(product.stockQuantity ?? 0) > 0"
                  class="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ $t('admin.product_management.in_stock') }}
                </span>
                <span
                  v-else
                  class="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ $t('admin.product_management.out_of_stock') }}
                </span>
              </td>

              <!-- Action dropdown -->
              <td class="py-3 px-4 flex justify-between items-center md:table-cell">
                <span class="font-bold md:hidden">{{ $t('admin.product_management.actions') }}</span>
                <div class="relative">
                  <button @click.stop="toggleDropdown(product.id || '')" class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600">
                    <IconDotsVertical :size="20" />
                  </button>
                  <div v-if="isDropdownOpen(product.id || '')" class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 dark:border-gray-700 border rounded shadow-lg z-10">
                    <button @click="openEditForm(product); closeDropdown()" class="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                      {{ $t('admin.product_management.edit') }}
                    </button>
                    <button @click="deleteProduct(product.id!); closeDropdown()" class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                      {{ $t('admin.product_management.delete') }}
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="p-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-300 gap-4">
        <div>{{ $t('admin.order_management.showing') }} {{ startIndex + 1 }} {{ $t('admin.order_management.to') }} {{ endIndex }} {{ $t('admin.order_management.of') }} {{ filteredProducts.length }} {{ $t('admin.order_management.entries') }}</div>
        <div class="flex items-center gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'"
            class="px-3 py-1 border rounded dark:border-gray-700 dark:text-gray-200">{{ $t('admin.order_management.previous') }}</button>
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
            class="px-3 py-1 border rounded dark:border-gray-700 dark:text-gray-200">{{ $t('admin.order_management.next') }}</button>
        </div>
      </div>
    </div>

    <!-- Add / Edit Drawer -->
    <transition name="fade">
      <div
        v-if="showAddForm"
        class="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-2/5 bg-white dark:bg-gray-800 shadow-xl border-l dark:border-gray-700 z-50 overflow-auto transition-colors p-4 sm:p-6"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ isEditMode ? $t('admin.product_management.form.name') : $t('admin.product_management.add_product') }}</h2>
            <button class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200" @click="closeAddForm">✕</button>
          </div>

          <div class="space-y-5">
            <!-- Basic Information -->
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700 pb-2">{{ $t('admin.product_management.form.basic_info') }}</h3>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.product_management.form.name') }} <span class="text-red-500">*</span></label>
                <input v-model="productForm.name" type="text" class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" :placeholder="$t('admin.product_management.form.name')" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.product_management.form.description') }}</label>
                <textarea v-model="productForm.description" rows="4" class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" :placeholder="$t('admin.product_management.form.description')"></textarea>
              </div>
            </div>

            <!-- Category Information -->
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700 pb-2">{{ $t('admin.product_management.form.category_details') }}</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.product_management.form.main_category') }} <span class="text-red-500">*</span></label>
                  <select
                    v-model="productForm.mainCategory"
                    @change="productForm.subCategory = ''"
                    class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">{{ $t('admin.product_management.form.select_category') }}</option>
                    <option v-for="(subs, category) in categories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.product_management.form.sub_category') }}</label>
                  <select
                    v-model="productForm.subCategory"
                    :disabled="!productForm.mainCategory"
                    class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">{{ $t('admin.product_management.form.select_sub_category') }}</option>
                    <option v-for="sub in availableSubCategories" :key="sub" :value="sub">
                      {{ sub }}
                    </option>
                  </select>
                  <p v-if="!productForm.mainCategory" class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ $t('admin.product_management.form.select_first') }}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.product_management.form.type') }}</label>
                  <input v-model="productForm.type" placeholder="e.g., Ballpoint, Spiral, Canvas" class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.product_management.form.size') }}</label>
                  <input v-model="productForm.size" placeholder="e.g., A4, Small, 15 inch" class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.product_management.form.color') }}</label>
                  <input v-model="productForm.color" placeholder="e.g., Blue, Multicolor, Black" class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.product_management.form.material') }}</label>
                  <input v-model="productForm.material" placeholder="e.g., Paper, Plastic, Canvas" class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.product_management.form.brand') }}</label>
                <input v-model="productForm.brandName" type="text" class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" :placeholder="$t('admin.product_management.form.brand')" />
              </div>
            </div>

            <!-- Pricing & Inventory -->
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700 pb-2">{{ $t('admin.product_management.form.pricing_inventory') }}</h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.product_management.form.stock_quantity') }} <span class="text-red-500">*</span></label>
                  <input v-model.number="productForm.stockQuantity" type="number" min="0" placeholder="0" class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.product_management.form.price') }} <span class="text-red-500">*</span></label>
                  <input v-model.number="productForm.salePrice" type="number" step="0.01" min="0" placeholder="0.00" class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.product_management.form.discount') }}</label>
                  <input v-model.number="productForm.discount" type="number" min="0" max="100" placeholder="0" class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                </div>
              </div>
            </div>

            <!-- Product Images -->
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700 pb-2">{{ $t('admin.product_management.form.images') }}</h3>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('admin.product_management.form.upload_images') }}</label>
                <div
                  @dragover="onDragOver"
                  @drop="onDrop"
                  class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-teal-500 transition-colors"
                >
                  <div class="space-y-2">
                    <div class="text-gray-400 dark:text-gray-500">
                      <svg class="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">
                      <label class="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">
                        <span>{{ $t('admin.product_management.form.click_to_upload') }}</span>
                        <input type="file" multiple accept="image/*" @change="onFilesSelected" @click="($event.target as HTMLInputElement).value = ''" class="sr-only" />
                      </label>
                      <span class="text-gray-500 dark:text-gray-400">{{ $t('admin.product_management.form.or_drag') }}</span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('admin.product_management.form.file_info') }}</p>
                  </div>
                </div>
                <div v-if="productImages.length > 0" class="flex gap-3 mt-4 flex-wrap">
                  <div v-for="(img, idx) in productImages" :key="img.id" class="relative group">
                    <img :src="img.preview" class="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700" />
                    <button @click.prevent="removeImage(idx)" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600">×</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-6 border-t dark:border-gray-700">
              <button @click="closeAddForm" class="px-6 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">{{ $t('admin.product_management.cancel') }}</button>
              <button @click="saveProduct" :disabled="loading" class="px-6 py-2.5 bg-teal-700 dark:bg-[#1A535C] text-white rounded-lg text-sm font-medium hover:bg-teal-800 dark:hover:bg-[#2A7A8F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                <span v-if="loading">{{ isEditMode ? $t('admin.product_management.form.updating') : $t('admin.product_management.form.saving') }}</span>
                <span v-else>{{ isEditMode ? $t('admin.product_management.form.update_product') : $t('admin.product_management.form.save_product') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
input[type='checkbox'] {
  cursor: pointer;
}
</style>
