<script setup lang="ts">
import MTopBar from '@/components/mobile/MTopBar.vue'
import MFooter from '@/components/mobile/MFooter.vue'
</script>
<template>
  <MTopBar />
  <div class="flex flex-col">
    <slot />
    <MFooter />
  </div>
</template>
