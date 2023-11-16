<script setup lang="ts">
import Login from '@/components/auth/Login.vue'
import { useUserStore } from '@/stores/userInfo';
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const showCustomerModal = ref(false)
const close = () => {
  showCustomerModal.value = false
}

const userStore = useUserStore()

const router = useRouter()

const details = userStore.userDetails;
</script>
<template>
  <div class="m-auto hidden flex-col sm:flex justify-between gap-16 items-center">
    <div class="text-center">
      <h3 class="text-2xl font-medium leading-normal text-dark_green pb-4">
        Customer Self-Service Portal
      </h3>
      <p class="text-base font-normal text-[#2B5276]">
        Welcome back. Please follow the instructions below to pay for your invoices
      </p>
    </div>

    <RouterView />

    <div v-if="!userStore.userLoggedIn()" class="text-center text-dark_green pt-15">
      <p class="text-sm">
        Already registered?
        <span
          class="cursor-pointer font-bold hover:underline"
          @click="() => (showCustomerModal = true)"
          >Login to make Payment</span
        >
      </p>
    </div>
    <div v-else >Goto  <span
          class="cursor-pointer font-bold hover:underline"
          @click="() => router.push('/dashboard')"
          >Dashboard</span
        ></div>
  </div>
  <Login width="w-1/2 xl:w-1/3" :show="showCustomerModal" @closeModal="close" />
</template>
