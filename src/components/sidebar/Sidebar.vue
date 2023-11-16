<script setup lang="ts">
import logo from '@/assets/logo.svg'
import image2 from '@/assets/image2.svg'
import ppl_low from '@/assets/ppl_low.svg'
import ppl_high from '@/assets/ppl_high.svg'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const highLoaded = ref(false)


const router = useRouter()

const home = () => router.push({ name: 'choose options' })

</script>

<style scoped>
.bg {
  background-image: url('../../assets/bg.svg');
  background-size: 200%;
  background-repeat: no-repeat;
  background-position-x: 25%;
  background-position-y: bottom;
}
</style>

<template>
  <div class="md:w-1/3 w-full m-0 bg-dark_green bg h-screen py-7 flex flex-col justify-between">
    <div @click="home" class="logo px-14 opacity-0 sm:opacity-100 cursor-pointer">
      <img :src="logo" alt="" />
      <span class="text-[#CFE6F2] text-sm font-medium pt-3">Customer Portal</span>
    </div>

    <div class="px-3 lg:px-7 xl:px-14 flex flex-col gap-12">
      <div class="py-7">
        <div class="bg-cover bg-center relative">
          <img :src="image2" class="w-full" alt="" />
          <img
            :src="ppl_low"
            class="w-3/4 overflow-clip top-[50%] -right-0 absolute"
            alt=""
            :class="[highLoaded ? 'opacity-0' : 'opacity-100']"
          />
          <img
            :src="ppl_high"
            @load="() => (highLoaded = true)"
            class="w-3/4 overflow-clip top-[50%] -right-0 absolute"
            :class="[highLoaded ? 'opacity-100' : 'opacity-0']"
            alt=""
          />
        </div>
      </div>

      <div class="mt-18 flex justify-center pl-4">
        <p class="text-2xl font-bold text-white">
          This <span class="text-[#A3D4EF]">platform</span> provides single point of service for all
          <span class="text-[#A3D4EF]">transactions</span> with the
          <span class="text-[#A3D4EF]">Federal Government</span> of Nigeria
        </p>
      </div>
    </div>
    <div
      class="sm:flex hidden px-11 gap-8 justify-center items-center text-sm font-normal text-[#C6E6F9] pt-6"
    >
      <span>Bills</span>
      <span>Payments</span>
      <span>About</span>
      <span>Contact</span>
      <span>FAQs</span>
    </div>
  </div>
</template>

