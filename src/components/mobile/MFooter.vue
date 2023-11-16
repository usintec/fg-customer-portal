<script setup lang="ts">
import logo from '@/assets/logo.svg'
</script>
<template>
  <div class="flex bg-[#1C3C4E] sm:hidden flex-col w-full p-7">
    <div class="w-full flex">
      <div class="logo">
        <img :src="logo" alt="logo" class="w-[84px]" />
      </div>
    </div>
    <div class="w-full mt-9 flex text-[#C6E6F9] text-sm font-normal">
      <div class="flex flex-col gap-4">
        <span>About</span>
        <span>Contact</span>
        <span>FAQs</span>
      </div>
      <div class="flex flex-col gap-4 ml-24">
        <span>Bills</span>
        <span>Payments</span>
        <span>hello@fg-ras.com.ng</span>
      </div>
    </div>
    <div class="flex text-[#7399AE] text-xs font-normal justify-center items-center mt-10 mb-1">
      <span>Copyright@{{ new Date().getFullYear() }} Federal Government, NG.</span>
    </div>
  </div>
</template>
