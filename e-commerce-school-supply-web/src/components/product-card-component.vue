<template>
  <!-- Product grid -->
  <div class="flex flex-wrap gap-12 font-sans">
    <div
      v-for="(product, index) in products"
      :key="index"
      class="w-[300px] h-[330px] bg-white rounded-[20px] overflow-hidden border-[0.3px] border-[#7B7B7B]"
    >
      <!-- Image Section -->
      <div class="relative flex justify-center items-center h-[160px]">
        <img 
          :src="product.image" 
          :alt="product.name"
          class="max-w-[250px] max-h-[160px] object-contain"
        />

        <!-- Discount -->
        <div 
          v-if="product.discount"
          class="absolute top-4 left-4 w-[50px] h-[30px] bg-[#FF6B6B] rounded-[5px] flex justify-center items-center text-white text-[12px]"
        >
          -{{ product.discount }}%
        </div>

        <!-- Heart Icon -->
        <button
          @click="toggleLike(index)"
          class="absolute top-4 right-4 bg-white rounded-full p-2"
        >
          <img 
            v-if="!isLiked[index]" 
            src="/src/assets/images/Heart.png" 
            class="w-[27px] h-[24px]"
          />
          <img 
            v-else 
            src="/src/assets/images/Heart-fill.png" 
            class="w-[27px] h-[24px]"
          />
        </button>
      </div>

      <!-- Info Section -->
      <div class="p-4 bg-[#F5F5F5] m-2 rounded-[20px]">
        <!-- Product Name -->
        <h1 class="text-[14px] font-bold">{{ product.name }}</h1>
        
        <!-- Rating -->
        <div class="flex items-center mb-3 text-[#FF6B6B]">
          <span class="mr-2 font-semibold text-gray-800">{{ product.rating.toFixed(1) }}</span>
          <span class="text-[20px]">
            <template v-for="n in 5" :key="n">
              <span v-if="n <= Math.floor(product.rating)">★</span>          <!-- full star -->
              <span v-else-if="n - product.rating <= 0.5">⯪</span>           <!-- half star -->
              <span v-else>☆</span>                                         <!-- empty star -->
            </template>
          </span>
        </div>

        <!-- Price and Add to Cart -->
        <div class="flex items-end justify-between">
          <div>
            <h2 class="text-sm text-gray-500">Price</h2>
            <div class="flex items-end">
              <p class="font-bold text-[24px]">${{getDiscountedPrice(product)}}</p> 
              <p v-if="product.discount" class="font-bold text-[12px] ml-2 line-through">${{(product.price).toFixed(2)}}</p>    
            </div>
          </div>
 
          <button @click="btnLink(index)" class="text-white w-[80px] h-[30px] rounded-md text-[12px] font-semibold">
            <div 
              v-if="!linkBtn[index]"
              class="bg-[#1A535C] w-full h-full flex justify-center items-center rounded-sm"
            >
              Add to Cart
            </div>
            <div 
              v-else 
              class="bg-[#C3C3C3] w-full h-full flex justify-center items-center rounded-sm"
            >
              Added
            </div>
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

interface Product {
  image: string;
  name: string;
  discount: number | null;
  rating: number;
  price: number;
}

export default defineComponent({
  name: "product-card-component",

  props: {
    products: {
      type: Array as () => Product[],
      required: true
    }
  },

  setup(props) {
    // Create reactive arrays to track like and add-to-cart states for each product
    const isLiked = ref<boolean[]>([]);
    const linkBtn = ref<boolean[]>([]);

    // Initialize arrays when products prop changes
    watch(
      () => props.products,
      (newProducts) => {
        isLiked.value = newProducts.map(() => false);
        linkBtn.value = newProducts.map(() => false);
      },
      { immediate: true }
    );

    const getDiscountedPrice = (product: Product) => {
      const discount = product.discount ?? 0; // handle null
      const priceAfterDiscount = product.price - (product.price * discount / 100);
      return (Math.floor(priceAfterDiscount * 100) / 100).toFixed(2);
    };

    const toggleLike = (index: number) => {
      isLiked.value[index] = !isLiked.value[index];
    };

    const btnLink = (index: number) => {
      linkBtn.value[index] = !linkBtn.value[index];
    };

    return {
      isLiked,
      linkBtn,
      toggleLike,
      btnLink,
      getDiscountedPrice
    };
  }
});
</script>
