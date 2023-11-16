<script setup lang="ts">
import LookUpService from '@/services/LookUpService'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PaymentCard from './PaymentCard.vue'
import MaterialIcon from '../icon/MaterialIcon.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import type { IPayNowRequest, IPaymentProvider } from '@/services/types'
import { useBillStore } from '@/stores/billStore'
import CustomerService from '@/services/CustomerService'
const router = useRouter()

const paymentProviders = ref<IPaymentProvider[]>([])

onMounted(async () => {
  const res = await LookUpService.paymentMethods()
  paymentProviders.value = res
})

const billStore = useBillStore()
const route = useRoute()
const invoiceId = route.params.invoiceId
const invoice = billStore.billInvoice?.invoices.find((invoice) => invoice.id === invoiceId)

const loading = ref(false)

const selected = ref('')

const onSelect = (provider: string) => {
  selected.value = provider
}

const pop = () => {
  router.back()
}

const next = async () => {
  const payload: IPayNowRequest = {
    invoiceNumber: invoice?.invoiceNumber || '',
    paymentProvider: selected.value,
    paymentAmount: invoice?.subTotal || 0,
    isPartialPayment: false,
    paymentPortalRedirectUrl: `${window.location.origin}/bill/${billStore.billInvoice?.billNumber}/invoice/${invoice?.id}/${selected.value}/confirm-payment`,
    paymentPortalUrl: 'https://fg-portal.netlify.app/',
    uniqueRequestId: ''
  }
  loading.value = true
  const paymentUrl = await CustomerService.payBill(payload)
  loading.value = false

  // redirect to payment url
  window.location.href = paymentUrl
}
</script>

<template>
  <div class="flex items-center justify-center w-full">
    <div class="rounded-2xl bg-[#F1FAFF] px-7 lg:px-14 py-10 w-full">
      <div @click="pop" class="flex items-center gap-2">
        <div
          class="flex rounded-full w-7 h-7 justify-center items-center bg-custom_mint text-dark_green text-sm cursor-pointer hover:scale-105"
        >
          <MaterialIcon icon="chevron_left" class="text-sm" />
        </div>
      </div>

      <div class="text-sm text-[##2B5276] font-normal my-3 mx-auto">Select a payment provider</div>

      <div class="flex flex-col gap-4 sm:gap-6">
        <PaymentCard
          v-for="provider in paymentProviders"
          :key="provider.name"
          :provider="provider"
          :selected="selected === provider.name"
          @onSelect="() => onSelect(provider.name)"
        />
      </div>

      <div class="flex flex-row-reverse mt-6">
        <div class="w-28">
          <ButtonInput
            :loading="loading"
            bg="bg-[#27536B]"
            class="!text-[#EEF6FA] !text-xs"
            :onClick="next"
          >
            Continue
          </ButtonInput>
        </div>
      </div>
    </div>
  </div>
</template>
