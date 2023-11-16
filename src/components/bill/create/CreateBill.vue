<script setup lang="ts">
import ButtonInput from '@/components/inputs/button/ButtonInput.vue'
import TextInput from '@/components/inputs/text/TextInput.vue'
import { onMounted, ref } from 'vue'
import SearchPayableItem from '@/components/payableitems/SearchPayableItem.vue'
import BillItems from './BillItems.vue'
import BillSummery from './BillSummery.vue'
import BillExtraNote from './BillExtraNote.vue'
import { useCreateBillStore } from '@/stores/createBillStore'
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import SearchMda from '@/components/mda/SearchMda.vue'
import type { IBill, IOption } from '@/services/types'
import CustomerService from '@/services/CustomerService'
import BillService from '@/services/BillService'
import { usePayableItems } from '@/stores/payableItemStore'
import { useBillStore } from '@/stores/billStore'
import { useOrganizationStore } from '@/stores/organizationStore'
import router from '@/router'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useUserStore } from '@/stores/userInfo'
import dateFormat from 'dateformat'

const toast = useToast()
const route = useRoute()
const id = route.params.billId
const createBillStore = useCreateBillStore()
const billStore = useBillStore()
const store = usePayableItems()
const organisationStore = useOrganizationStore()
const loading = ref(false)
const loadingPreview = ref(false)
const setState = createBillStore.setState
const setErrorMessage = createBillStore.setErrorMessage
const props = defineProps<{
  editMode?: boolean
  noAuth?: boolean
}>()
const userStore = useUserStore()
onMounted(async () => {
  if (!props.editMode) {
    const billId = await BillService.generateBillId()
    setState('billNumber', billId)
  }
  try {
    if (!props.noAuth) await userStore.fetchUserInfo()
    const customer = userStore.user
    var date = new Date()
    // add a day
    date.setDate(date.getDate() + 1)
    createBillStore.setState('dueDate', dateFormat(date, 'dd/mm/yy'))
    createBillStore.customerClick({
      id: customer?.userId ?? '',
      name: customer?.name ?? '',
      phoneNumber: customer?.phoneNumber ?? '',
      email: customer?.email ?? ''
    })
  } catch (err) {
    createBillStore.customer = null
  }
})
const onRowClick = async (value: IOption) => {
  createBillStore.clearPayableItems()
  createBillStore.selectedOrganisation = value
  const res = await CustomerService.searchPayableItem(createBillStore.selectedOrganisation.value)
  organisationStore.setOrganisationPayableItems(res)
}
const pushPayableItem = createBillStore.pushPayableItem

const removeItem = createBillStore.removeItem

const goBack = () => {
  router.back()
}
const clearOrganisation = () => {
  createBillStore.selectedOrganisation = null
  organisationStore.clearOrganisationPayableItems()
  createBillStore.clearPayableItems()
}
const save = async (preview: boolean) => {
  const s = createBillStore
  const state = s.state
  const error = []
  console.log(s.customer)
  if (!s.customer) {
    console.log('customerId', 'Please select a customer')
    setErrorMessage('customerId', 'Please select a customer')
    error.push('error')
  }
  if (!state.billNumber) {
    setErrorMessage('billNumber', 'Please enter a bill number')
    error.push('error')
  }

  if (!state.dueDate) {
    setErrorMessage('dueDate', 'Please enter a due date')
    error.push('error')
  }

  if (store.readyForCheckout().length === 0) {
    setErrorMessage('lineItems', 'please addItems')
    error.push('error')
  }
  console.error(error)
  if (error.length > 0) return

  const _bill: Partial<IBill> = {
    id: '',
    ...state,
    customerId: s.customer?.id,
    lineItems: store.readyForCheckout() as any,
    organisationId: createBillStore.selectedOrganisation?.value
  }
  billStore.storePreviewBill(_bill)
  if (preview) {
    try {
      loadingPreview.value = true
      const res = await CustomerService.createBill(_bill, true)
      billStore.setBillInvoice(res)
      loadingPreview.value = false
      if (!props.noAuth) router.push(`/dashboard/preview-invoice/${res.invoices[0].id}`)
      else router.push(`/preview-invoice/${res.invoices[0].id}`)
    } catch (error) {
      loadingPreview.value = false
    }
  } else {
    if (props.editMode) {
      await BillService.update(id as string, _bill)
      toast.success('Bill updated successfully')
    } else {
      try {
        const res = await CustomerService.createBill(_bill)
        billStore.setBillInvoice(res)
        toast.success('Bill created successfully')
        loading.value = false
        if (!props.noAuth) router.push(`/dashboard/invoice/${res.invoices[0].id}`)
        else {
          router.push(`/invoice/${res.invoices[0].id}`)
        }
      } catch (err) {
        loading.value = false
      }
    }
  }
}
</script>
<template>
  <div class="bg-white rounded-3xl px-6 py-5">
    <div class="flex justify-between items-center mb-14">
      <div class="flex gap-2">
        <div
          @click="goBack"
          class="w-7 h-7 rounded-full bg-custom_mint flex items-center justify-center cursor-pointer"
        >
          <MaterialIcon icon="chevron_left" class="text-dark_green text-xl" />
        </div>
        <span class="text-dark_green font-bold text-base">{{
          editMode ? `Edit ${createBillStore.state.billNumber}` : 'Generate a new Bill'
        }}</span>
      </div>
      <div class="flex xl:w-1/3 sm:w-1/2 md:5/12 w-full lg gap-5">
        <div class="flex gap-5 w-full">
          <div class="w-44" v-if="!editMode">
            <ButtonInput
              bg="bg-[#D8E8F2]"
              class="!w-3/4 !text-dark_green"
              :onClick="() => save(true)"
              :loading="loadingPreview"
            >
              Preview
            </ButtonInput>
          </div>
          <div class="w-2/4" v-if="editMode">
            <ButtonInput bg="bg-[#D8E8F2]" class="!w-3/4 !text-dark_green" :onClick="goBack">
              Go Back
            </ButtonInput>
          </div>
          <div class="w-1/2">
            <ButtonInput
              :loading="loading"
              bg="bg-[#27536B]"
              class="font-bold text-base"
              :onClick="() => save(false)"
            >
              Save and Continue
            </ButtonInput>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between items-center">
      <div class="flex flex-col w-[40%] gap-2 2xl:w-5/12 xl:w-5/12 lg:w-4/6 md:w-full">
        <SearchMda @onRowClick="onRowClick"></SearchMda>
        <div
          class="w-full flex justify-between bg-[#F3FEFD] p-4"
          v-if="createBillStore.selectedOrganisation"
        >
          <div>
            <p class="font-bold text-[#204458] text-lg">
              {{ createBillStore.selectedOrganisation.label }}
            </p>
            <p class="pt-1 text-[#4A7B77]">
              ID: {{ createBillStore.selectedOrganisation.organisationCode }}
            </p>
          </div>
          <div class="bg-[#D4F4F1] w-10 px-2 py-2">
            <MaterialIcon
              @click="clearOrganisation"
              icon="delete"
              class="text-[#959DB8] text-2xl mr-3 hover:text-dark_green cursor-pointer"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full lg:w-1/3 gap-2">
        <TextInput
          label="Bill Number"
          placeholder="Bill Number"
          :value="createBillStore.state?.billNumber"
          disabled
          important="*"
          @change="(v) => setState('billNumber', v)"
          :errorMessage="createBillStore.errorMessage?.billNumber"
        />
        <div class="flex w-full gap-3">
          <TextInput
            class="w-1/2"
            label="Payment Due by:"
            placeholder="Due Date"
            :value="createBillStore.state?.dueDate"
            important="*"
            :errorMessage="createBillStore.errorMessage?.dueDate"
            @change="console.log"
            :disabled="true"
          />
        </div>
      </div>
    </div>
    <div class="w-full h-[1px] pt-10 border-b" />
    <div class="py-10">
      <SearchPayableItem
        :payableItems="organisationStore.organisationPayableItems"
        :class="createBillStore.errorMessage?.lineItems && 'border border-red-400'"
        class="2xl:w-5/12 xl:w-5/12 lg:w-4/6 md:w-full"
        @onRowClick="pushPayableItem"
      />
    </div>
    <div class="w-full gap-5">
      <BillItems :items="createBillStore.payableItems" @remove="removeItem" />
    </div>
    <BillSummery />
    <div class="my-4">
      <BillExtraNote :notes="createBillStore.state.note" @onChange="(v) => setState('note', v)" />
    </div>
    <div class="flex xl:w-1/3 sm:w-1/2 md:5/12 w-full gap-5 ml-auto">
      <div class="flex gap-5 w-full">
        <div class="w-2/4" v-if="!editMode">
          <ButtonInput
            bg="bg-[#D8E8F2]"
            class="!w-3/4 !text-dark_green"
            :onClick="() => save(true)"
            :loading="loadingPreview"
          >
            Preview
          </ButtonInput>
        </div>

        <div class="w-2/4" v-if="editMode">
          <ButtonInput bg="bg-[#D8E8F2]" class="!w-3/4 !text-dark_green" :onClick="goBack">
            Go Back
          </ButtonInput>
        </div>
        <div class="w-2/4">
          <ButtonInput
            :loading="loading"
            bg="bg-[#27536B]"
            class="font-bold text-base"
            :onClick="() => save(false)"
          >
            Save and Continue
          </ButtonInput>
        </div>
      </div>
    </div>
  </div>
</template>
