<script setup lang="ts">
import Login from '@/components/auth/Login.vue'
import { ref } from 'vue'

const showCustomerModal = ref(false)
const close = () => {
  showCustomerModal.value = false
}
</script>
<template>
  <div class="flex-col mt-8 sm:flex justify-between gap-16 items-center">
    <div class="text-center mx-10 mb-10">
      <h3 class="text-lg font-medium leading-normal text-dark_green pb-4">
        Customer Self-Service Portal
      </h3>
      <p class="text-base font-normal text-[#2B5276]">
        Welcome back. Please follow the instructions below to pay for your invoices
      </p>
    </div>

    <RouterView />

    <div class="text-center text-dark_green pt-15 my-10">
      <p class="text-sm">
        Already registered?
        <span
          class="cursor-pointer font-bold hover:underline"
          @click="() => (showCustomerModal = true)"
          >Login to make Payment</span
        >
      </p>
    </div>
  </div>
  <Login width="w-1/2 xl:w-1/3" :show="showCustomerModal" @closeModal="close" />
</template>
