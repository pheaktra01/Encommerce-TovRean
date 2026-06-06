<script setup lang="ts">
import { IconArrowBack } from '@tabler/icons-vue'
import { onMounted, onBeforeUnmount } from 'vue'

// Force light mode for auth pages
let wasDarkMode = false

onMounted(() => {
  wasDarkMode = document.documentElement.classList.contains('dark')
  document.documentElement.classList.remove('dark')
})

onBeforeUnmount(() => {
  if (wasDarkMode) {
    document.documentElement.classList.add('dark')
  }
})
</script>

<template>
  <div
    class="bg-cover bg-no-repeat bg-[url('../assets/images/auth_background.jpg')] min-h-screen object-fit bg-black/25 bg-blend-darken flex justify-center items-center"
  >
    <form
      class="w-full h-auto max-w-xl mx-auto bg-white/50 border-white/30 backdrop-blur-lg shadow-lg px-10 py-10 rounded-3 rounded lg:px-20"
    >
      <h1 class="font-bold text-2xl"><span class="text-accent">Tov</span>Rean</h1>
      <p class="font-extralight text-lg">Prepare smarter. Study better. Start here.</p>
      <p class="font-bold text-3xl w-full text-center my-5">Forget password?</p>
      <div class="flex flex-col justify-center items-center gap-3 w-full">
        <div class="mb-5 w-full">
          <label for="email" class="block mb-2 text-sm font-medium text-heading">Email</label>
          <input
            type="email"
            id="email"
            class="bg-primary border border-default-medium text-heading text-sm rounded-base focus:ring-secondary focus:border-secondary block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="name@flowbite.com"
            required
          />
        </div>
        <div class="w-full mb-10">
          <button
            type="submit"
            class="w-full text-white bg-secondary box-border border border-transparent hover:bg-secondary/80 focus:ring-4 focus:ring-secondary/25 shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
          >
            Submit
          </button>
          <router-link to="/" class="text-extralight text-sm hover:underline flex items-center gap-1">
            <IconArrowBack class="w-4 h-4" />
            Back to Sign in
          </router-link>
        </div>
      </div>
    </form>
  </div>
</template>
