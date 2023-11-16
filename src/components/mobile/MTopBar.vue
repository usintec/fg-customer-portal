<script setup lang="ts">
import logo from '@/assets/logo.svg'
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
</script>

<template>
  <div
    class="flex sm:hidden z-10 items-center justify-between bg-[#1E4155] px-8 py-5 w-full h-20 sticky top-0"
  >
    <div class="logo">
      <img :src="logo" alt="logo" class="w-[100px]" />
    </div>
    <MaterialIcon icon="density_large" class="text-4xl text-[#7DB2C2]" />
  </div>
</template>
