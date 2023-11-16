<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import TextInput from '@/components/inputs/text/TextInput.vue'
import InvoiceCard from '@/components/invoice/InvoiceCard.vue'
import SpinnerComponent from '@/components/loader/SpinnerComponent.vue'
import CustomerService from '@/services/CustomerService'
import { useBillStore } from '@/stores/billStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const billStore = useBillStore()

const billNumber = ref(billStore?.billInvoice?.billNumber ?? '')
const loader = ref(false)

const pop = () => {
  router.back()
  billStore.setBillInvoice(null)
}

const onChange = (v: string) => {
  billNumber.value = v
}

const pullBill = async () => {
  if (!billNumber.value) return
  const _id = billNumber.value
  loader.value = true
  const _bill = await CustomerService.getBill(_id)
  loader.value = false
  billStore.setBillInvoice(_bill)
}

const partial = billStore.billInvoice?.isPartial ?? false

</script>
<template>
  <div class="flex items-center justify-center w-full xl:w-2/3 2xl:w-3/4">
    <div class="rounded-2xl bg-[#F1FAFF] px-7 lg:px-14 py-10">
      <div @click="pop" class="flex items-center gap-2">
        <div
          class="flex rounded-full w-7 h-7 justify-center items-center bg-custom_mint text-dark_green text-sm cursor-pointer hover:scale-105"
        >
          <MaterialIcon icon="chevron_left" class="text-sm" />
        </div>
        <p class="text-[13px] text-dark_green font-bold">Go Back</p>
      </div>

      <div class="items-center py-5 w-full">
        <TextInput
          label="Enter your invoice or bill number to proceed"
          :onChange="onChange"
          placeholder="Type here"
          :value="billNumber"
          type="text"
          :button="{ label: 'Search', onClick: pullBill }"
        />
      </div>

      <div
        v-if="!billStore.billInvoice"
        class="flex justify-center items-center w-full rounded-xl bg-[#E6F3FB] h-36 mb-5"
      >
        <span class="text-[13px] font-normal text-[#6F8FA3]">Invoice details will appear here</span>
        <div>
          <SpinnerComponent v-if="loader" />
        </div>
      </div>

      <div class="flex flex-col gap-5 max-h-96 overflow-scroll pb-4">
        <InvoiceCard
          else
          v-for="invoice in billStore.billInvoice?.invoices"
          :key="invoice.id"
          :customer="`${billStore.billInvoice?.customer.name}`"
          :invoice="invoice"
          @view="() => router.push(`/invoice/${invoice.id}/amount?payment=${invoice.status?.toLowerCase() === 'paid'}`)"
          @pay="() => router.push(  `/invoice/${invoice.id}/${!partial ? 'payment-providers' : 'payment'}`)"
        />
      </div>

      <div class="">
        <p class="text-base text-dark_green font-normal">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>
  </div>
</template>
