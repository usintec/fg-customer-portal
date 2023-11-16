<script setup lang="ts">
import Header from '@/components/header/Header.vue'
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import ButtonInput from '@/components/inputs/button/ButtonInput.vue'
import CustomerForm from '@/components/customer/CustomerForm.vue'
import { useUserStore } from '@/stores/userInfo'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PAGE } from '@/services/types'
import { useCreateBillStore } from '@/stores/createBillStore'
import { useHomeStore } from '@/stores/pageName'
import { useOrganizationStore } from '@/stores/organizationStore'

const userStore = useUserStore()
const showCustomerModal = ref(false)
const router = useRouter()
const createBillStore = useCreateBillStore()
const organisationStore = useOrganizationStore()
const pageStore = useHomeStore()
const selectPage = (page: string) => {
  switch (page) {
    case PAGE.INVOICES:
      pageStore.setPage(PAGE.INVOICES)
      router.push('/dashboard')
      break
    case PAGE.CREATE_BILL:
      createBillStore.clearPayableItems()
      createBillStore.clearSelectedOrganisation()
      organisationStore.clearOrganisationPayableItems()
      pageStore.setPage(PAGE.CREATE_BILL)
      router.push('/dashboard/create-bill')
      break
    default:
      break
  }
}

const close = () => {
  showCustomerModal.value = false
}

const logout = () => {
  window.localStorage.clear()
  userStore.clearUserDetails()
  window.location.reload()
}
</script>
<template>
  <div class="w-full h-screen flex-row bg-[#EEF6FA] ">
    <Header />

    <div class="hidden sm:flex bg-white py-4 px-14 gap-5 justify-between ">
      <div class="flex">
        <div
          class="flex px-5 justify-center items-center text-[#537595] hover:scale-105 cursor-pointer"
          @click="() => selectPage(PAGE.INVOICES)"
          :class="{
            'bg-[#E3F0F9] text-dark_green font-bold rounded-md':
              pageStore.selectedPage == PAGE.INVOICES
          }"
        >
          <span>
            <MaterialIcon class="mr-1 text-2xl" outline icon="news" />
          </span>
          <span class="text-base text-[#204458]">Invoices</span>
        </div>
        <div
          class="flex px-5 justify-center items-center text-[#537595] hover:scale-105 cursor-pointer"
          @click="() => selectPage(PAGE.CREATE_BILL)"
          :class="{
            'bg-[#E3F0F9] text-dark_green font-bold rounded-md':
              pageStore.selectedPage == PAGE.CREATE_BILL
          }"
        >
          <span>
            <MaterialIcon class="mr-1 text-2xl" outline icon="snippet_folder" />
          </span>
          <span class="text-base text-[#204458]">Create a Bill</span>
        </div>
        <div
          class="flex px-5 justify-center items-center text-[#537595] hover:scale-105 cursor-pointer"
          @click="() => (showCustomerModal = true)"
        >
          <span>
            <MaterialIcon class="mr-1 text-2xl" outline icon="person" />
          </span>
          <span class="text-base text-[#204458]">Update Account</span>
        </div>
      </div>
      <div>
        <ButtonInput bg="bg-[#DCEDF6]" class="!text-dark_green px-5" :onClick="logout">
          Log out
        </ButtonInput>
      </div>
    </div>
    <div class="h-[83vh] overflow-scroll">
      <CustomerForm :show="showCustomerModal" @closeModal="close" />
      <router-view></router-view>
    </div>
  </div>
</template>
