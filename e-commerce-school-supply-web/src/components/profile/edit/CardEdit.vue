<template>
  <div class="border border-default border-dashed rounded-base p-5 mt-5 bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors">
    <h1 class="text-accent dark:text-[#1A535C]">Edit your Card</h1>

    <form class="w-full max-w-4xl mx-auto mt-5">
      <div class="relative z-0 w-full mb-10 group">
        <input
          type="text"
          name="floating_card_name"
          id="floating_card_name"
          class="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer dark:text-gray-100 dark:border-gray-600"
          placeholder=" "
          required
        />
        <label
          for="floating_card_name"
          class="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto dark:text-gray-300"
          >Card name</label
        >
      </div>
      <div class="relative z-0 w-full mb-10 group">
        <input
          type="text"
          name="floating_card_number"
          id="floating_card_number"
          class="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer dark:text-gray-100 dark:border-gray-600"
          placeholder=" "
          required
        />
        <label
          for="floating_card_number"
          class="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto dark:text-gray-300"
          >Card Number</label
        >
      </div>

      <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-10 group">
          <input
            type="text"
            name="floating_date"
            id="floating_date"
            class="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer dark:text-gray-100 dark:border-gray-600"
            placeholder=" "
            required
          />
          <label
            for="floating_date"
            class="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto dark:text-gray-300"
            >Expire Date
          </label>
        </div>
        <div class="relative z-0 w-full mb-10 group">
          <input
            type="text"
            name="floating_cvv"
            id="floating_cvv"
            class="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-secondary peer dark:text-gray-100 dark:border-gray-600"
            placeholder=" "
            required
          />
          <label
            for="floating_cvv"
            class="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-left peer-focus:start-0 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto dark:text-gray-300"
            >CVV</label
          >
        </div>
      </div>

      <div class="mt-3 w-full flex flex-row gap-2 items-center justify-end">
        <button
          type="button"
          class="text-body bg-neutral-primary border border-default hover:bg-neutral-secondary-soft hover:text-heading focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="text-white bg-secondary box-border border border-transparent hover:bg-secondary/80 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none dark:bg-[#1A535C] dark:hover:bg-[#2A7A8F]"
        >
          Save Change
        </button>
      </div>
    </form>
  </div>
</template>
