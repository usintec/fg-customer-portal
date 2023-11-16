<script setup lang="ts">
import type { IListColumn } from '../list/types'
import List from '../list/List.vue'
import { PAGE, type Invoice } from '@/services/types'
import Badge from '../badge/Badge.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import TextInput from '../inputs/text/TextInput.vue'
import SelectInput from '../inputs/select/SelectInput.vue'
import { ref, onMounted } from 'vue'
import dateFormat from 'dateformat'
import { useBillStore } from '@/stores/billStore'
import { useRouter } from 'vue-router'
import CustomerService from '@/services/CustomerService'
import { useUserStore } from '@/stores/userInfo'
import { useHomeStore } from '@/stores/pageName'

const invoices = ref<Invoice[]>([])
const filteredInvoices = ref<Invoice[]>([])
const loading = ref(true)
const selectedValue = ref('')
const filterData = ref([
  { id: '1', status: 'Paid' },
  { id: '2', status: 'Unpaid' },
  { id: '3', status: 'Draft' }
])
const billStore = useBillStore()
const router = useRouter()
const userStore = useUserStore()
const pageStore = useHomeStore()

const createBill = () => {
  pageStore.setPage(PAGE.CREATE_BILL)
  router.push('/dashboard/create-bill')
}
const column: IListColumn<Invoice>[] = [
  {
    id: 'invoiceNumber',
    name: 'Invoice Number',
    isSortable: true,
    width: 200,
    dataFiled: 'invoiceNumber'
  },
  {
    id: 'dueDate',
    name: 'Due Date',
    isSortable: true,
    width: 200,
    dataFiled: 'dueDate',
    cell: true
  },
  {
    id: 'currency',
    name: 'Currency',
    isSortable: true,
    width: 200,
    dataFiled: 'currency'
  },
  {
    id: 'total',
    name: 'Total Amt',
    isSortable: true,
    width: 200,
    dataFiled: 'total'
  },
  {
    id: 'amountDue',
    name: 'Amt Due',
    isSortable: true,
    width: 200,
    dataFiled: 'amountDue'
  },
  {
    id: 'amountPaid',
    name: 'Amt Paid',
    isSortable: true,
    width: 200,
    dataFiled: 'amountPaid'
  },
  {
    id: 'status',
    name: 'Status',
    isSortable: true,
    width: 200,
    dataFiled: 'status',
    cell: true
  },
  {
    id: 'action',
    name: 'Action',
    isSortable: true,
    width: 200,
    dataFiled: 'id',
    cell: true
  }
]
onMounted(async () => {
  await userStore.fetchUserInfo()
  const userInfo = userStore.user
  const res = await CustomerService.getCustomerInvoices(userInfo?.userId ?? '')
  invoices.value = res
  filteredInvoices.value = res
  loading.value = false
})
const goToInvoices = (id: string, paid?: boolean) => {
  const invoice = invoices.value.find((value) => value.id == id)
  billStore.convertInvoiceToBill(invoice)
  router.push(`/dashboard/invoice/${invoice?.id}?payment=${paid}`)
}

const onFilter = (v: string) => {
  const _invoice = invoices.value.filter((invoice) => {
    return invoice.bill.billNumber.toLowerCase().includes(v.toLowerCase())
  })
  filteredInvoices.value = _invoice
}

const onFilters = (v: string) => {
  const matchingStatuses = filterData.value.filter((statusData) => {
    return statusData.status?.toLowerCase().includes(v.toLowerCase())
  })

  if (matchingStatuses.length === 0) {
    filteredInvoices.value = []
    return
  }

  const matchingStatus = matchingStatuses[0].status

  const _invoice = invoices.value.filter((invoice) => {
    return invoice.status?.toLowerCase() === matchingStatus.toLowerCase()
  })

  filteredInvoices.value = _invoice
}
</script>

<template>
  <div class="bg-white rounded-3xl py-5 px-8">
    <div class="flex justify-between">
      <div>
        <p class="text-[#8E95AF] text-sm font-medium">All Invoices</p>
      </div>
      <div>
        <span class="pe-3">
          <MaterialIconVue icon="menu" class="text-lg" />
        </span>
        <span class="">
          <MaterialIconVue icon="grid_view" class="text-lg" />
        </span>
      </div>
    </div>

    <div class="flex justify-between mt-3">
      <div class="flex">
        <TextInput
          label=""
          placeholder="Search by name"
          type="text"
          :onChange="onFilter"
          class="w-[345px] h-[46px] me-3"
        />

        <SelectInput
          label=""
          :onChange="onFilters"
          :selected="selectedValue"
          value="status"
          :name="['status']"
          :items="filterData"
          :no-padding="true"
          class="w-[120px] h-[44px]"
        />
      </div>

      <div class="flex">
        <ButtonInput
          class="h-[46px] w-[133px] text-[13px] me-3"
          bg="bg-[#204458]"
          :onClick="createBill"
        >
          Create Bill
        </ButtonInput>

        <ButtonInput
          class="text-xs font-bold h-[46px] w-[133px] text-[13px] bg-color me-3"
          :onClick="console.log"
        >
          Export
        </ButtonInput>
      </div>
    </div>

    <div>
      <List :data="filteredInvoices" :columns="column" :pagination="true" :loading="loading">
        <template #status="{ status }">
          <Badge :class="status === 'Unpaid' ? 'warning' : 'success'">
            <template v-slot:content> {{ status }}</template>
          </Badge>
        </template>
        <template #dueDate="{ dueDate }">
          {{ dateFormat(dueDate, 'dd/mm/yy') }}
        </template>
        <template #createdOn="{ createdDate }">
          {{ dateFormat(createdDate, 'dd/mm/yy') }}
        </template>
        <template #action="{ id, status }">
          <div
            @click="() => goToInvoices(id, status?.toLowerCase() === 'paid')"
            class="w-16 h-7 border pointer-cursor hover:scale-105 rounded border-[#6A8BAA] flex justify-center items-center font-satoshi text-xs font-bold text-[#6A8BAA]"
          >
            View
          </div>
        </template>
      </List>
    </div>
  </div>
</template>
