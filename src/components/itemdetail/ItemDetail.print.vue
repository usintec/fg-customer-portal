<script setup lang="ts">
import type { LineItem } from '@/services/types'

defineProps<{
  itemList: LineItem[]
  currency: string
}>()
const formatMoney = (value: number | string | undefined) => {
  const num = Number(value)
  return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}
const _currencyCode = (code: string): number => {
  switch (code) {
    case 'NGN':
      return 8358
    case 'USD':
      return 36
    case 'EUR':
      return 8364
    case 'GBP':
      return 163
    default:
      return 1
  }
}
</script>
<template>
  <div class="flex w-full">
    <table class="w-full bg-white">
      <thead class="bg-[#204458] text-white text-sm font-medium w-full">
        <tr>
          <th class="w-3/4 sm:w-1/4 text-start sm:text-center px-5 sm:px-0 py-4">Item Details</th>
          <th class="hidden revert">Quantity</th>
          <th class="hidden revert">Tax</th>
          <th class="hidden revert">Price</th>
          <th class="w-1/4">Total</th>
        </tr>
      </thead>
      <tbody class="bg-white text-sm">
        <tr
          v-for="row in itemList"
          :key="row.gifmisCode"
          class="text-sm font-medium border-t border-b"
        >
          <td class="pl-2 my-4 text-[#204458] text-base">
            <span class="font-bold">{{ row.name }}</span>
            <br />
            <span v-if="row.gifmisCode" class="text-sm pt-2">GIFMIS: {{ row.gifmisCode }}</span>
            <span v-if="!row.gifmisCode" class="text-sm pt-2">{{ row.description }}</span>
          </td>
          <td class="text-center hidden revert py-5 text-[#2F3A61] text-sm">
            {{ row.quantity }}
          </td>
          <td class="text-center hidden revert text-[#303031] text-sm">
            {{ String.fromCharCode(_currencyCode(currency)) }}
            {{ formatMoney(row.tax.value) }}
          </td>
          <td class="text-center hidden revert text-[#2F3A61] text-sm">
            {{ String.fromCharCode(_currencyCode(currency)) }}
            {{ formatMoney(row.price) }}
          </td>
          <td class="text-center text-[#2F3A61] text-sm">
            {{ String.fromCharCode(_currencyCode(currency)) }}
            {{ formatMoney(row.price * row.quantity) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
