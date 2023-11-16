<script setup lang="ts">
import CreateBill from '@/components/bill/create/CreateBill.vue'

</script>
<template>
  <div>
    <div class="w-4/5 mx-auto my-5">
      <CreateBill :noAuth="true"></CreateBill>
    </div>
  </div>
</template>
