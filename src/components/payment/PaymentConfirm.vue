<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SpinnerComponent from '../loader/SpinnerComponent.vue'
import { useRoute, useRouter } from 'vue-router'
import { useBillStore } from '@/stores/billStore'
import LookUpService from '@/services/LookUpService'
import type { IPaymentProvider } from '@/services/types'
import PaymentService, { type VerifyRes } from '@/services/PaymentService'
import CustomerService from '@/services/CustomerService'
import MaterialIcon from '../icon/MaterialIcon.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'

const route = useRoute()
const router = useRouter()

const bilStore = useBillStore()

const { billId, invoiceId, provider } = route.params

const paymentProvider = ref<IPaymentProvider>()
const response = ref<VerifyRes>()

const getValue = (key: string) => {
  return route.query[key]?.toString()
}

const getData = () => {
  const provider = paymentProvider.value

  return {
    status: getValue(provider?.keys.transactionStatus ?? '') ?? '',
    reference: getValue(provider?.keys.reference ?? '') ?? '',
    provider: provider?.name?.toLowerCase() ?? ''
  }
}

onMounted(async () => {
  const bill = await CustomerService.getBill(billId.toString())
  bilStore.setBillInvoice(bill)
  const providers = await LookUpService.paymentMethods()
  paymentProvider.value = providers.find((p) => p.name === provider)
  const res = await PaymentService.verifyPayment(getData())
  response.value = res
})

const success = computed(() => {
  return response.value?.paymentStatus?.toLocaleLowerCase() === 'success' ?? false
})
</script>
<template>
  <div class="flex items-center justify-center w-full">
    <SpinnerComponent v-if="!response" />
    <div
      v-else
      class="rounded-2xl bg-[#F1FAFF] px-7 lg:px-14 py-10 flex flex-col gap-6 justify-center items-center w-full"
    >
      <div
        class="items-center py-5 w-28 h-28 rounded-full text-white flex justify-center"
        :class="[success ? 'bg-[#5D9799]' : 'bg-red-400']"
      >
        <MaterialIcon :icon="success ? 'check' : 'close'" class="text-5xl" />
      </div>

      <div class="text-dark_green font-medium text-2xl">
        Payment {{ success ? 'Successful' : 'Failed' }}!
      </div>

      <div class="text-[#2B5276] text-center">
        Your payment on invoice {{ bilStore.getInvoice(invoiceId?.toString())?.invoiceNumber }} ({{ bilStore.getInvoice(invoiceId?.toString())?.currency }}) was 
        {{ success ? 'successful' : 'failed' }}. <br />
        {{ success ? 'Thank you for your payment.' : 'Please try again.' }}
      </div>

      <div v-if="success" class="flex-col w-full flex items-center">
        <div class="w-full px-4">
          <ButtonInput
            bg="bg-[#27536B]"
            
            class="font-bold text-base w-full"
            :onClick="() => router.push(`/invoice/${invoiceId}/amount?payment=${success}`)"
          >
            Download
          </ButtonInput>
        </div>
      </div>
    </div>
  </div>
</template>
