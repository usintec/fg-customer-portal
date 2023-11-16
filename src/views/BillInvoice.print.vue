<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import { ref, onMounted } from 'vue'
import type { IBillInvoiceModel, LineItem } from '@/services/types'
import ItemDetail from '@/components/itemdetail/ItemDetail.print.vue'
import SpinnerComponent from '@/components/loader/SpinnerComponent.vue'
import { useRouter, useRoute } from 'vue-router'
import dateFormat from 'dateformat'
import logo from '@/assets/logo.svg'
import { currencyCode } from '@/utils/utils'
import { useBillStore } from '@/stores/billStore'
import InvoiceTopBar from '@/components/invoice/InvoiceTopBar.vue'
import CheckBox from '@/components/inputs/check/CheckBox.vue'

defineProps<{
  singleInvoice?: boolean
  previewBill?: boolean
  noAuth?: boolean
}>()

const billStore = useBillStore()
const route = useRoute()
const invoiceId = route.params.invoiceId
const isCheckedEmail = ref(true)
const i = billStore.billInvoice?.invoices.findIndex((invoice) => invoice.id === invoiceId) ?? 0
const selectedInvoice = ref(i)

const paymentDone =
  route.query.payment === 'true' ||
  billStore?.billInvoice?.invoices[i].status?.toLowerCase() === 'paid'

const preview = ref(paymentDone)
const isCheckedSMS = ref(false)
const loading = ref(false)
const billInvoice = ref<IBillInvoiceModel>()

const router = useRouter()

const selectInvoice = (invoiceIndex: number) => {
  selectedInvoice.value = invoiceIndex
}
const smsCharges = ref(25)
const formatMoney = (value: number | string | undefined) => {
  const num = Number(value)
  return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}
const onCheck = (option: string) => {
  option == 'email'
    ? (isCheckedEmail.value = !isCheckedEmail.value)
    : (isCheckedSMS.value = !isCheckedSMS.value)
}

onMounted(async () => {
  if (!billStore.billInvoice) router.back()
  await billStore.refreshBill()
  try {
    billInvoice.value = billStore.billInvoice!
    billInvoice.value?.invoices[selectedInvoice.value].priceAdjustments.forEach((adjustment) => {
      const lineItem: LineItem = {
        id: radomStr(),
        description: adjustment.description ?? '',
        name: adjustment.type ?? '',
        quantity: 1,
        price: Number(adjustment.amount),
        tax: { type: '', value: 0 },
        gifmisCode: '',
        total: Number(adjustment.amount)
      }
      billInvoice.value?.invoices[selectedInvoice.value].lineItems.push(lineItem)
    })
    loading.value = false
  } catch (err) {
    loading.value = false
  }
})

const radomStr = () => `${Math.random()}`.slice(2)
</script>
<template>
  <div>
    <div v-if="loading" class="items-center justify-center">
      <SpinnerComponent></SpinnerComponent>
    </div>
    <div v-else-if="!loading">
      <div
        class="bg-white rounded-3xl m-3 justify-center h-full items-center w-full lg:w-11/12 xl:w-3/4 2xl:w-4/6 3xl:w-1/2 mx-auto"
      >
        <div class="flex gap-0 p-2 sm:p-5">
          <div
            class="w-40 hidden lg:flex flex-col"
            v-if="billInvoice && billInvoice.invoices.length > 1 && !singleInvoice"
          >
            <div
              :key="index"
              class="flex mb-3 font-bold justify-around gap-4 hover:cursor-pointer"
              :class="[selectedInvoice == index ? 'text-[#12A320]' : 'text-[#9CBBCD]']"
              @click="selectInvoice(index)"
              v-for="(_, index) in billInvoice?.invoices"
            >
              <p class="text-[15px]">Invoice {{ billInvoice?.invoices[index].currency }}</p>
              <MaterialIcon class="text-[15px] py-1" outline icon="arrow_forward_ios" />
            </div>
          </div>
          <div class="flex-row w-full">
            <div class="hidden sm:flex w-36 mx-auto">
              <img :src="logo" alt="" />
            </div>
            <InvoiceTopBar
              :noAuth="noAuth"
              :preview="previewBill"
              :invoiceNo="billInvoice?.invoices[selectedInvoice].id ?? ''"
              class="my-2 sm:my-14"
            />
            <div
              class="w-40 flex lg:hidden"
              v-if="billInvoice && billInvoice.invoices.length > 1 && !singleInvoice"
            >
              <div
                :key="index"
                class="flex mb-3 font-bold justify-around gap-4 hover:cursor-pointer"
                :class="[selectedInvoice == index ? 'text-[#12A320]' : 'text-[#9CBBCD]']"
                @click="selectInvoice(index)"
                v-for="(_, index) in billInvoice?.invoices"
              >
                <p class="text-[15px]">Invoice {{ billInvoice?.invoices[index].currency }}</p>
              </div>
            </div>
            <div class="" id="print-invoice-details">
              <div
                class="print:w-36 print:m-0 print:flex hidden justify-center items-center mx-auto"
              >
                <img :src="logo" alt="" />
              </div>
              <div class="w-full bg-white sm:rounded-xl border py-5 my-2 sm:my-14">
                <div id="web-org" class="sm:flex hidden justify-between px-3 mx-2">
                  <div class="flex gap-3">
                    <div class="w-24 h-24 rounded-md bg-[#DFE7FB] mb-7 text-center py-9">
                      <MaterialIcon class="mr-1" outline icon="photo_camera_back" />
                    </div>
                  </div>
                  <div class="flex flex-col w-52">
                    <p class="mb-3 text-dark_green font-bold text-lg">
                      {{ billInvoice?.invoices[selectedInvoice].invoiceNumber }}
                    </p>
                    <div class="flex flex-col gap-2">
                      <div
                        class="bg-[#56D07F] w-20 rounded-lg text-white text-center justify-center"
                        :class="{
                          'bg-[#e6bc54] text-white': billInvoice?.status?.toLowerCase() != 'paid'
                        }"
                      >
                      {{ billInvoice?.invoices[selectedInvoice].status }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col sm:hidden my-2 justify-between px-3 mx-2">
                  <div class="flex justify-between">
                    <div>
                      Due Date:
                      <span>
                        {{
                          dateFormat(
                            billInvoice?.invoices[selectedInvoice].createdDate.split('T')[0],
                            'dd/mm/yyyy'
                          )
                        }}
                      </span>
                    </div>
                    <span>{{ billInvoice?.billNumber }}</span>
                  </div>
                  <div class="flex flex-col mb-2">
                    <p class="mb-3 text-dark_green font-bold text-lg">
                      {{ billInvoice?.organisation.name }}
                    </p>
                    <p class="text-dark_green text-sm">
                      {{ billInvoice?.organisation.phoneNumber }}
                    </p>
                  </div>
                </div>
                <hr />
                <div class="hidden sm:flex justify-between pt-3 mb-6 px-3 mx-2">
                  <div class="flex gap-3">
                    <div class="w-48">
                      <p class="text-dark_green text-sm">Bill To:</p>
                      <p class="mb-3 text-dark_green font-bold text-md">
                        {{ billInvoice?.customer.name }}
                      </p>
                      <p class="text-dark_green text-sm">
                        Phone: {{ billInvoice?.customer.phoneNumber }}
                      </p>
                      <p class="text-dark_green text-sm">
                        Mobile: {{ billInvoice?.customer.phoneNumber }}
                      </p>
                    </div>
                  </div>
                  <div class="flex flex-col w-56 text-dark_green">
                    <p>
                      <span class="font-bold text-md">Invoice No:</span> {{ billInvoice?.invoices[selectedInvoice].invoiceNumber }}
                    </p>
                    <p>
                      <span class="font-bold text-md">Issued Date:</span>
                      {{
                        dateFormat(
                          billInvoice?.invoices[selectedInvoice].createdDate.split('T')[0],
                          'dd/mm/yyyy'
                        )
                      }}
                    </p>
                    <p>
                      <span class="font-bold text-md">Due Date:</span>
                      {{ dateFormat(billInvoice?.dueDate, 'dd/mm/yyyy') }}
                    </p>
                    <p>
                      <span class="font-bold text-md">Amount: </span>
                      <span>{{
                        String.fromCharCode(
                          currencyCode(billInvoice?.invoices[selectedInvoice].currency ?? '')
                        )
                      }}</span>
                      {{ formatMoney(billInvoice?.invoices[selectedInvoice].total) }}
                    </p>
                  </div>
                </div>
                <div class="flex flex-col sm:hidden my-4 justify-between px-3 mx-2">
                  <div class="flex flex-col">
                    <p class="mb-3 text-dark_green font-bold text-lg">
                      {{ billInvoice?.customer.name }}
                    </p>
                    <p class="text-dark_green text-sm">
                      {{ billInvoice?.organisation.phoneNumber }} |
                      {{ billInvoice?.organisation.email }}
                    </p>
                  </div>
                </div>
                <div class="w-full">
                  <ItemDetail
                    :currency="billInvoice?.invoices[selectedInvoice].currency ?? ''"
                    :itemList="billInvoice?.invoices[selectedInvoice].lineItems ?? []"
                  >
                  </ItemDetail>
                </div>
                <div class="flex mt-5 print:m-0">
                  <div class="flex flex-col w-full">
                    <div class="sm:flex hidden text-md text-dark_green w-full p-2">
                      <p class="w-1/2 text-[#2F3A61] text-md"></p>
                      <p>Sub Total</p>
                    </div>
                    <div class="flex sm:hidden text-md text-dark_green w-full p-2">
                      <p>Sub Total</p>
                    </div>
                    <div class="flex gap-3 w-full px-3">
                      <div class="pt-2 flex flex-col gap-2 w-full">
                        <div class="print:hidden flex-col gap-2 lg:flex" v-if="!preview">
                          <div
                            :class="{
                              'text-green-500': isCheckedEmail,
                              'text-dark_green': !isCheckedEmail
                            }"
                            class="flex items-center"
                          >
                            <CheckBox
                              :checked="isCheckedEmail"
                              @onChecked="() => onCheck('email')"
                              :activeGreen="isCheckedEmail"
                            />
                            <span class="text-sm font-medium"> Email </span>
                          </div>
                          <div
                            :class="{
                              'text-green-500': isCheckedSMS,
                              'text-dark_green': !isCheckedSMS
                            }"
                            class="flex print:hidden items-center"
                          >
                            <CheckBox
                              v-if="!preview"
                              :checked="isCheckedSMS"
                              @onChecked="() => onCheck('sms')"
                              :activeGreen="isCheckedSMS"
                            />
                            <span class="text-sm font-medium">SMS</span>
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-col gap-3 w-full">
                        <div class="flex justify-between">
                          <p>{{ billInvoice?.invoices[selectedInvoice].lineItems.length }} items</p>
                          <div class="text-center text-[#2F3A61] text-md font-bold">
                            <span>{{
                              String.fromCharCode(
                                currencyCode(billInvoice?.invoices[selectedInvoice].currency ?? '')
                              )
                            }}</span>
                            {{ formatMoney(billInvoice?.invoices[selectedInvoice].subTotal) }}
                          </div>
                        </div>
                        <div class="flex justify-between pb-3" v-if="isCheckedSMS">
                          <p>SMS</p>
                          <div class="text-center text-[#2F3A61] text-md font-bold">
                            <span>{{
                              String.fromCharCode(
                                currencyCode(billInvoice?.invoices[selectedInvoice].currency ?? '')
                              )
                            }}</span>
                            {{ smsCharges }}
                          </div>
                        </div>
                        <hr />
                        <div class="flex justify-between mt-2">
                          <p>TOTAL</p>
                          <div class="text-center text-[#2F3A61] text-md font-bold">
                            <span>{{
                              String.fromCharCode(
                                currencyCode(billInvoice?.invoices[selectedInvoice].currency ?? '')
                              )
                            }}</span>
                            <span v-if="isCheckedSMS">
                              {{
                                formatMoney(
                                  (billInvoice?.invoices[selectedInvoice].subTotal ?? 0) +
                                    smsCharges
                                )
                              }}</span
                            >
                            <span v-if="!isCheckedSMS">{{
                              formatMoney(billInvoice?.invoices[selectedInvoice].subTotal)
                            }}</span>
                          </div>
                        </div>
                        <div class="flex justify-between mt-2">
                          <p>Amount Due</p>
                          <div class="text-center text-[#2F3A61] text-md font-bold">
                            <span>{{
                              String.fromCharCode(
                                currencyCode(billInvoice?.invoices[selectedInvoice].currency ?? '')
                              )
                            }}</span>
                            <span>
                              {{
                                formatMoney(billInvoice?.invoices[selectedInvoice].amountDue)
                              }}</span
                            >
                          </div>
                        </div>
                        <div class="flex justify-between mt-2">
                          <p>Amount Paid</p>
                          <div class="text-center text-[#2F3A61] text-md font-bold">
                            <span>{{
                              String.fromCharCode(
                                currencyCode(billInvoice?.invoices[selectedInvoice].currency ?? '')
                              )
                            }}</span>
                            <span>
                              {{
                                formatMoney(billInvoice?.invoices[selectedInvoice].amountPaid)
                              }}</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div class="flex px-5 py-3 flex-col gap-1">
                      <span class="text-base text-dark_green font-medium">Notes / Terms</span>
                      <p class="text-[#687CA9] italic">{{ billInvoice?.note }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
