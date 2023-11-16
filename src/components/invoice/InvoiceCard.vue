<script setup lang="ts">
import type { Invoice } from '@/services/types'
import { currencyCode, formatMoney } from '@/utils/utils'
import ButtonInput from '../inputs/button/ButtonInput.vue'

defineProps<{
  customer: string
  invoice: Invoice
}>()

defineEmits<{
  (event: 'view'): void
  (event: 'pay'): void
}>()
</script>
<template>
  <div class="flex flex-col px-6 py-4 bg-[#E3EEFF] hover:bg-[#D9F8E1] rounded-xl">
    <div class="text-dark_green flex flex-col">
      <span class="text-xs font-normal">Amount due:</span>
      <span class="text-2xl font-bold">{{
        `${String.fromCharCode(currencyCode(invoice.currency))}${formatMoney(invoice.total)}`
      }}</span>
    </div>
    <div class="flex justify-between items-center">
      <span class="hidden sm:flex text-lg text-dark_green font-medium">{{ customer }} </span>
      <div class="flex gap-3 ml-auto">
        <div class="w-28">
          <ButtonInput
            bg="bg-[#27536B]"
            class="!text-[#EEF6FA] !text-xs"
            :onClick="() => $emit('pay')"
            v-if="invoice.status?.toLocaleLowerCase() != 'paid'"
          >
            Pay Now
          </ButtonInput>
        </div>
        <div class="w-28">
          <ButtonInput
            bg="bg-[#CBDBF4]"
            class="!text-dark_green !text-xs"
            :onClick="() => $emit('view')"
          >
            View Invoice
          </ButtonInput>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
