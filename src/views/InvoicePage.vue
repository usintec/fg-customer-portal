<script setup lang="ts">
import MHolder from '@/components/mobile/MHolder.vue'
import BillInvoiceVue from '@/views/BillInvoice.print.vue'

defineProps<{
  singleInvoice: boolean
  preview?: boolean
  noAuth?: boolean
}>()
</script>
<template>
  <MHolder>
    <BillInvoiceVue :noAuth="noAuth" :previewBill="preview" :singleInvoice="singleInvoice" />
  </MHolder>
</template>
