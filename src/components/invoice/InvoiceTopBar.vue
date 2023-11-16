<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import ButtonInput from '@/components/inputs/button/ButtonInput.vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{ invoiceNo: string; preview?: boolean, noAuth?: boolean }>()
const initiatePayment = () => {
  router.push(`/invoice/${props.invoiceNo}/payment-providers`)
}

const billStore = useBillStore()

const router = useRouter()
const route = useRoute()

const paymentDone = route.query.payment === 'true'

const pop = () => {
  router.back()
}

import { usePaperizer } from 'paperizer'
import { useBillStore } from '@/stores/billStore'
import CustomerService from '@/services/CustomerService';
import { ref } from 'vue';

const { paperize } = usePaperizer('print-invoice-details', {
  styles: [
    '/print.css',
    'https://fonts.cdnfonts.com/css/satoshi',
    'https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined'
  ],
  windowTitle: `Invoice Detail for ${billStore.billInvoice?.billNumber}`,
  autoClose: true
})
const print = () => {
  paperize()
}
const loading = ref(false)
const saveAndContinue = async() => {
  try {
        const res = await CustomerService.createBill(billStore.previewBill)        
        billStore.setBillInvoice(res)
        // toast.success('Bill created successfully')
        loading.value = false
        if (!props.noAuth) router.push(`/dashboard/invoice/${res.invoices[0].id}`)
        else {
          router.push(`/invoice/${res.invoices[0].id}`)
        }
      } catch (err) {
        loading.value = false
      }
}
</script>
<template>
  <div class="flex p-2 justify-between w-full">
    <div class="flex w-1/2 sm:gap-2">
      <div
        @click="pop"
        class="mt-1 w-7 h-7 rounded-full bg-custom_mint flex items-center justify-center cursor-pointer"
      >
        <MaterialIcon icon="chevron_left" class="text-dark_green text-xl" />
      </div>
      <div class="text-dark_green hidden sm:flex flex-col">
        <h3 class="text-2xl font-bold">View Invoice details</h3>
        <p v-if="!paymentDone" class="text-lg">Confirm and pay for invoice assigned to you.</p>
      </div>
    </div>
    <div class="flex gap-4 sm:gap-10 justify-center text-[#4F7497]">
      <div @click="print" class="flex-row cursor-pointer">
        <MaterialIcon outline icon="print" class="text-dark_green text-2xl px-1" />
        <p>Print</p>
      </div>
      <div class="flex-col hidden sm:flex">
        <MaterialIcon outline icon="open_with" class="text-dark_green text-2xl px-1" />
        <p>View</p>
      </div>
      <div v-if="paymentDone" class="w-36">
        <ButtonInput bg="bg-[#56D07F]" class="!text-dark_green" :onClick="print">
          <span class="text-white">Download</span>
        </ButtonInput>
      </div>
      <div v-else class="w-36">
        <ButtonInput
          bg="bg-[#56D07F]"
          class="!text-dark_green"
          :onClick="initiatePayment"
          v-if="!preview"
        >
          <span class="text-white">Pay Now</span>
        </ButtonInput>
        <!-- <ButtonInput
          bg="bg-[#56D07F]"
          class="!text-dark_green"
          :onClick="saveAndContinue"
          v-else-if="preview"
          :loading="loading"
        >
          <span class="text-white">Save And Continue</span>
        </ButtonInput> -->
      </div>
    </div>
  </div>
</template>
