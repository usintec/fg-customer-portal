<script setup lang="ts">
import { ref } from 'vue'
import Login from '../auth/Login.vue'

defineEmits<{
  (e: 'onClick'): void
}>()

const showCustomerModal = ref(false)
const close = () => {
  showCustomerModal.value = false
}
</script>
<template>
  <div class="pt-8 w-full sm:hidden px-5 pb-5 flex flex-col justify-center bg-dark_green">
    <button
      @click="$emit('onClick')"
      class="flex h-14 w-full rounded-lg justify-center items-center bg-white text-dark_green font-bold text-base"
    >
      Get Started
    </button>
    <div class="text-center text-white pt-15 my-10">
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
