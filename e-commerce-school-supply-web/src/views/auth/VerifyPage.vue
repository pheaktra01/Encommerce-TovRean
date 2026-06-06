<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

// Function to move focus to the NEXT input
const handleInput = (event: Event, nextId: string | null) => {
  const input = event.target as HTMLInputElement
  // If the user typed a number, move to next
  if (input.value.length === 1 && nextId) {
    document.getElementById(nextId)?.focus()
  }
}

// Function to move focus to the PREVIOUS input on Backspace
const handleBackspace = (event: KeyboardEvent, prevId: string | null) => {
  const input = event.target as HTMLInputElement
  // If input is empty and user hits Backspace, move back
  if (event.key === 'Backspace' && input.value === '' && prevId) {
    document.getElementById(prevId)?.focus()
  }
}

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
      <p class="font-bold text-3xl w-full text-center my-5">Verify Your Account</p>
      <p class="font-extralight text-sm w-full text-center my-5">
        We emailed you a 6 digit code. Enter the code below to confirm your email address.
      </p>

      <div class="flex items-center justify-center mb-5 space-x-2 rtl:space-x-reverse">
        <div>
          <label for="code-1" class="sr-only">First code</label>
          <input
            id="code-1"
            type="text"
            maxlength="1"
            class="block bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand h-10 w-10 shadow-xs placeholder:text-body text-center"
            required
            @input="handleInput($event, 'code-2')"
            @keydown="handleBackspace($event, null)"
          />
        </div>

        <div>
          <label for="code-2" class="sr-only">Second code</label>
          <input
            id="code-2"
            type="text"
            maxlength="1"
            class="block bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand h-10 w-10 shadow-xs placeholder:text-body text-center"
            required
            @input="handleInput($event, 'code-3')"
            @keydown="handleBackspace($event, 'code-1')"
          />
        </div>

        <div>
          <label for="code-3" class="sr-only">Third code</label>
          <input
            id="code-3"
            type="text"
            maxlength="1"
            class="block bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand h-10 w-10 shadow-xs placeholder:text-body text-center"
            required
            @input="handleInput($event, 'code-4')"
            @keydown="handleBackspace($event, 'code-2')"
          />
        </div>

        <div>
          <label for="code-4" class="sr-only">Fourth code</label>
          <input
            id="code-4"
            type="text"
            maxlength="1"
            class="block bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand h-10 w-10 shadow-xs placeholder:text-body text-center"
            required
            @input="handleInput($event, 'code-5')"
            @keydown="handleBackspace($event, 'code-3')"
          />
        </div>

        <div>
          <label for="code-5" class="sr-only">Fifth code</label>
          <input
            id="code-5"
            type="text"
            maxlength="1"
            class="block bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand h-10 w-10 shadow-xs placeholder:text-body text-center"
            required
            @input="handleInput($event, 'code-6')"
            @keydown="handleBackspace($event, 'code-4')"
          />
        </div>

        <div>
          <label for="code-6" class="sr-only">Sixth code</label>
          <input
            id="code-6"
            type="text"
            maxlength="1"
            class="block bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand h-10 w-10 shadow-xs placeholder:text-body text-center"
            required
            @input="handleInput($event, null)"
            @keydown="handleBackspace($event, 'code-5')"
          />
        </div>
      </div>

      <div class="w-full mb-10">
        <button
          type="submit"
          class="w-full text-white bg-secondary box-border border border-transparent hover:bg-secondary/80 focus:ring-4 focus:ring-secondary/25 shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
        >
          Verify
        </button>
        <p class="mt-2 text-sm text-body">
          Didn’t receive any code?
          <button type="button" class="text-accent hover:text-accent/80 transition">Resend</button>
        </p>
      </div>
    </form>
  </div>
</template>
