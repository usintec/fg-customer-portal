<template>
  <div class="bg-white-50 h-full w-full flex">
    <Sidebar />
    <div class="w-2/3 overflow-scroll h-screen">
      <div class="mt-5">
        <InvoiceList />
      </div>
      <CreateBill></CreateBill>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/sidebar/Sidebar.vue'

import InvoiceList from '../invoice/InvoiceList.vue'
import CreateBill from '@/components/bill/create/CreateBill.vue'
</script>
