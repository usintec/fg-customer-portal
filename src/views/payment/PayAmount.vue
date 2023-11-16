<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import ButtonInput from '@/components/inputs/button/ButtonInput.vue'
import TextInput from '@/components/inputs/text/TextInput.vue'
import { useBillStore } from '@/stores/billStore'
import { currencyCode, formatMoney } from '@/utils/utils'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()

const billStore = useBillStore()
const route = useRoute()

const invoiceId = route.params.invoiceId

const invoice = billStore.billInvoice?.invoices.find((invoice) => invoice.id === invoiceId)

const pop = () => {
  router.back()
}

const amount = ref<number>()

const onChange = (v: string) => {
  const max = invoice?.total ?? 0
  const num = Number(v)
  if (num < 0) amount.value = 0
  else if (num > max) amount.value = max
  else amount.value = num
}
</script>
<template>
  <div class="flex items-center justify-center w-full">
    <div class="rounded-2xl bg-[#F1FAFF] px-7 lg:px-14 py-10">
      <div @click="pop" class="flex items-center gap-2">
        <div
          class="flex rounded-full w-7 h-7 justify-center items-center bg-custom_mint text-dark_green text-sm cursor-pointer hover:scale-105"
        >
          <MaterialIcon icon="chevron_left" class="text-sm" />
        </div>
      </div>

      <div class="text-sm text-[##2B5276] font-normal my-3 mx-auto">
        Partial payment is enabled on this Invoice. You can enter a preferred amount
      </div>

      <div
        class="rounded-lg bg-[#D9F8E1] px-4 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between"
      >
        <div class="text-dark_green flex flex-col gap-2">
          <span class="text-sm font-normal">Total amount due for invoice</span>
          <span class="text-sm hidden sm:flex font-semibold"
            >No: {{ invoice?.invoiceNumber }}
          </span>
        </div>
        <div class="text-dark_green">
          <span class="text-2xl font-bold">{{
            `${String.fromCharCode(currencyCode(invoice?.currency ?? ''))}${formatMoney(
              invoice?.total ?? 0
            )}`
          }}</span>
        </div>
      </div>

      <div class="items-center py-5 w-full">
        <TextInput
          label="Enter a preferred amount"
          :onChange="onChange"
          :placeholder="`${invoice?.currency}`"
          :value="amount?.toString()"
          :max="invoice?.total?.toString()"
          type="number"
        />
      </div>

      <div class="flex flex-row-reverse">
        <div class="w-28">
          <ButtonInput
            bg="bg-[#27536B]"
            class="!text-[#EEF6FA] !text-xs"
            :onClick="() => router.push(`/invoice/${invoice?.id}/payment-providers`)"
          >
            Continue
          </ButtonInput>
        </div>
      </div>
    </div>
  </div>
</template>
