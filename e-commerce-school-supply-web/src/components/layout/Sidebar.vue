<template>

<aside class="col-span-1">
    <div class="bg-white dark:bg-gray-800 rounded shadow p-4 mb-6 transition-colors">
        <h4 class="font-semibold mb-3 dark:text-white">{{ $t('profile.manage') }}</h4>
        <ul v-if="isAdmin" class="text-sm space-y-2">
            <li
            @click="activeTab = 'dashboard'"
            :class="isActive('dashboard')  ? 'text-accent font-medium dark:text-cyan-300' : 'text-gray-600 hover:text-accent dark:text-gray-400 dark:hover:text-cyan-300 cursor-pointer'"
            >
            Dashboard
            </li>
            <li
            @click="activeTab = 'profile'"
            :class="isActive('profile')  ? 'text-accent font-medium dark:text-cyan-300' : 'text-gray-600 hover:text-accent dark:text-gray-400 dark:hover:text-cyan-300 cursor-pointer'"
            >
            My Profile
            </li>
        </ul>
        <ul v-else class="text-sm space-y-2">
            <li
            @click="activeTab = 'profile'"
            :class="isActive('profile') ? 'text-accent font-medium dark:text-cyan-300' : 'text-gray-600 hover:text-accent dark:text-gray-400 dark:hover:text-cyan-300 cursor-pointer'"
            >
            {{ $t('profile.my_profile') }}
            </li>
            <li
            @click="activeTab = 'address'"
            :class="isActive('address') ? 'text-accent font-medium dark:text-cyan-300' : 'text-gray-600 hover:text-accent dark:text-gray-400 dark:hover:text-cyan-300 cursor-pointer'"
            >
            {{ $t('profile.my_address') }}
            </li>
            <li
            @click="activeTab = 'payment'"
            :class="isActive('payment') ? 'text-accent font-medium dark:text-cyan-300' : 'text-gray-600 hover:text-accent dark:text-gray-400 dark:hover:text-cyan-300 cursor-pointer'"
            >
            {{ $t('profile.payment_options') }}
            </li>
        </ul>
    </div>

    <div v-if="isAdmin" class="bg-white dark:bg-gray-800 rounded shadow p-4 transition-colors">
        <h4 class="font-semibold mb-3 dark:text-white">Management</h4>
        <ul class="text-sm space-y-2">
            <li
            @click="activeTab = 'userManagement'"
            :class="isActive('userManagement') ? 'text-accent font-medium dark:text-cyan-300' : 'cursor-pointer text-gray-600 hover:text-accent dark:text-gray-400 dark:hover:text-cyan-300'">
            User Management
            </li>
            <li
            @click="activeTab = 'productManagement'"
            :class="isActive('productManagement') ? 'text-accent font-medium cursor-pointer' : 'text-gray-600 hover:text-accent cursor-pointer'"
            >
            Product Management
            </li>
            <li
            @click="activeTab = 'orderManagement'"
            :class="isActive('orderManagement') ? 'text-accent font-medium cursor-pointer' : 'text-gray-600 hover:text-accent cursor-pointer'"
            >
            Order Management
            </li>
        </ul>
    </div>


</aside>

</template>


<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';

import { computed, ref } from 'vue';


const activeTab = defineModel<string>({ required: true });
const authStore = useAuthStore();


const isAdmin = computed(() => authStore.user?.role === 'admin');
console.log(isAdmin.value);
const isActive = (tabName: string) => activeTab.value === tabName;
</script>
