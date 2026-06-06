<template>
  <section class="bg-white dark:bg-gray-900 py-16">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex flex-col md:flex-row items-center gap-12">
        <!-- Left Image -->
        <div class="flex-1 flex justify-center">
          <img
            src="@/assets/images/image 36.png"
            alt="Customer Support"
            class="w-full max-w-sm"
          />
        </div>

        <!-- Right Form -->
        <div class="flex-1 border border-gray-200 dark:border-gray-700 p-8 rounded-lg">
          <h2 class="text-red-500 dark:text-red-400 text-xl font-semibold mb-6">
            {{ t('contact.title') }}
          </h2>

          <form @submit.prevent="submitForm" class="space-y-4">
            <!-- Name -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm mb-1 text-gray-700 dark:text-gray-300">{{ t('contact.firstName') }}</label>
                <input
                  v-model="form.firstName"
                  type="text"
                  placeholder="Sok"
                  class="w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-200 px-3 py-2 outline-none rounded-md"
                />
              </div>

              <div>
                <label class="block text-sm mb-1 text-gray-700 dark:text-gray-300">{{ t('contact.lastName') }}</label>
                <input
                  v-model="form.lastName"
                  type="text"
                  placeholder="Lisa"
                  class="w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-200 px-3 py-2 outline-none rounded-md"
                />
              </div>
            </div>

            <!-- Contact -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm mb-1 text-gray-700 dark:text-gray-300">{{ t('contact.email') }}</label>
                <input
                  v-model="form.email"
                  type="email"
                  :placeholder="t('contact.emailPlaceholder')"
                  class="w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-200 px-3 py-2 outline-none rounded-md"
                />
              </div>

              <div>
                <label class="block text-sm mb-1 text-gray-700 dark:text-gray-300">{{ t('contact.phone') }}</label>
                <input
                  v-model="form.phone"
                  type="text"
                  :placeholder="t('contact.phonePlaceholder')"
                  class="w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-200 px-3 py-2 outline-none rounded-md"
                />
              </div>
            </div>

            <!-- Message -->
            <div>
              <label class="block text-sm mb-1 text-gray-700 dark:text-gray-300">{{ t('contact.message') }}</label>
              <textarea
                v-model="form.message"
                rows="4"
                :placeholder="t('contact.messagePlaceholder')"
                class="w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-200 px-3 py-2 outline-none resize-none rounded-md"
              ></textarea>
            </div>

            <!-- Button -->
            <div class="pt-2">
              <button
                type="submit"
                class="bg-teal-900 dark:bg-teal-700 text-white px-6 py-2 hover:opacity-90 dark:hover:bg-teal-600 rounded-md"
              >
                {{ t('contact.send') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: ''
})

const submitForm = () => {
  // Handle form submission
  console.log('Form submitted:', form)
  alert(t('contact.form_submitted'))
}
</script>
