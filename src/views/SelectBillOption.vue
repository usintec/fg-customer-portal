<script setup lang="ts">
import { useRouter } from 'vue-router'
import img from '@/assets/image.svg'
import img1 from '@/assets/image1.svg'

const router = useRouter()

const pushBillNumber = () => {
  router.push('/payment-with-bill-number')
}

const pushCustomer = () => {
  router.push('/payment-with-out-bill')
}
</script>

<template>
  <div class="flex items-center justify-center w-full xl:w-2/3 2xl:w-3/4">
    <div class="rounded-2xl bg-[#F1FAFF] px-7 lg:px-14 py-10">
      <p class="text-base text-dark_green font-medium">Select an option below to proceed</p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-5 xl:gap-10 py-5">
        <div
          @click="pushBillNumber"
          class="w-full sm:w-3/4 h-3/4 flex flex-row sm:flex-col justify-center items-center rounded-3xl bg-[#DEF3FF] py-10 shadow-[0_5px_0px_0px_#D9ECF6] cursor-pointer"
        >
          <div class="flex items-center justify-center pr-5 sm:pr-0 sm:pb-5">
            <img :src="img" alt="" />
          </div>
          <div class="text-center">
            <p class="text-sm font-medium text-dark_green">I have an Invoice number</p>
            <span class="text-sm font-normal cursor-pointer text-[#2B5276]"
              >Proceed to payment</span
            >
          </div>
        </div>

        <div class="w-[1px] h-[239px] hidden sm:flex bg-[#D9ECF6]"></div>

        <div
          @click="pushCustomer"
          class="w-full sm:w-3/4 h-3/4 flex flex-row sm:flex-col rounded-3xl justify-center items-center bg-[#DEF3FF] py-10 shadow-[0_5px_0px_0px_#D9ECF6] cursor-pointer"
        >
          <div class="flex items-center justify-center pr-5 sm:pr-0 sm:pb-5">
            <img :src="img1" alt="" />
          </div>
          <div class="text-center">
            <p class="text-sm font-medium text-dark_green">I don’t have Invoice number</p>
            <span class="text-sm font-normal cursor-pointer text-[#2B5276]"
              >Generate Bill/Invoice</span
            >
          </div>
        </div>
      </div>

      <div class="">
        <p class="text-base text-dark_green font-normal">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>
  </div>
</template>
