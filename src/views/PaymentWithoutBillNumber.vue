<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import FlagInput from '@/components/inputs/text/FlagInput.vue';
import { useUserStore } from '@/stores/userInfo';
import { ref } from 'vue';
import CustomerService from '@/services/CustomerService';
import type { IOption, ISearch } from '@/services/types';
import ButtonInput from '@/components/inputs/button/ButtonInput.vue';
import SearchMda from '@/components/mda/SearchMda.vue';
import { useCreateBillStore } from '@/stores/createBillStore'
import { useOrganizationStore } from '@/stores/organizationStore'
import router from '@/router'
import { fetchCountryCodeMapping, formatPhoneNumber } from '@/components/auth/phoneUtils';

enum ACTIVITY {
  SEARCH_CUSTOMER = "search customer",
  SEARCH_MDA = "search mda"
}
const userStore = useUserStore()
const state = ref<Partial<ISearch>>({})
const errorMessage = ref<Partial<ISearch>>()
const loading = ref(false)
const activity = ref(ACTIVITY.SEARCH_CUSTOMER)
const createBillStore = useCreateBillStore()
const organisationStore = useOrganizationStore()
const selectedMda = ref<IOption>()
const formattedPhoneNumber = ref('')

const errorMessages = (keys: (keyof ISearch)[]) => {
  let error = false
  for (const key of keys) {
    if (!state.value[key]) {
      setErrorMessage(key, `${key} is required`)
      error = true
    }
  }
  return error
}
const setErrorMessage = (key: keyof ISearch, message: string) => {
  errorMessage.value = { ...errorMessage.value, [key]: message }
}
const setState = (key: keyof ISearch, value: string) => {
  state.value = { ...state.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}
const keys: (keyof ISearch)[] = [
  'searchString'
]
const searchCustomer = async () => {
  if (errorMessages(keys)) return
  loading.value = true
  try {

    const code = state.value.countryCode
    const phoneNumber = state.value.searchString
    const countryCodeMapping = await fetchCountryCodeMapping()

    if (code !== undefined && phoneNumber !== undefined) {
      const formattedData = formatPhoneNumber(code, phoneNumber, countryCodeMapping)
      formattedPhoneNumber.value = formattedData
    }

    const res = await CustomerService.searchCustomer({
    searchString: formattedPhoneNumber.value
    })

    userStore.setUsers(res)
    loading.value = false
    
  } catch (error) {
    loading.value = false
  }
}
const selectMda = async (value: IOption) => {
  selectedMda.value = value
}
const gotoBIll = async () => {
  if(selectedMda.value){
  createBillStore.clearPayableItems()
  createBillStore.selectedOrganisation = selectedMda.value
  const res = await CustomerService.searchPayableItem(
    createBillStore.selectedOrganisation.value
  )
  organisationStore.setOrganisationPayableItems(res)
  createBillStore.customerClick({
      id: userStore.user?.id ?? '',
      name: userStore.user?.name ?? '',
      phoneNumber: userStore.user?.phoneNumber ?? '',
      email: userStore.user?.email ?? ''
    })
  router.push(`/create-bill`)
  }
}
const pop = () => {
  router.back()
}
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
      <div v-if="activity == ACTIVITY.SEARCH_CUSTOMER">
        <div class="items-center py-5 w-full">
          <FlagInput
            label="Enter your phone number"
            :onChange="(v) => setState('searchString', v)"
            :selectItem="(v) => setState('countryCode', v)"
            placeholder="Ex. 08132515487"
            type="text"
            :button="{ label: 'Continue', onClick: searchCustomer }"
            :loading="loading"
          />
        </div>

        <div 
          v-for="(user, i) in userStore.users" :key="i" 
          class="flex justify-between p-3 items-center w-full rounded-xl bg-[#E6F3FB] h-36 mb-5">
          <div>
              <p class="text-dark_green text-lg font-bold">{{ user?.name }}</p>
              <p><span class="text-dark_green txt-sm">Phone No: </span><span class="text-dark_green text-sm font-bold pt-1">{{ user?.phoneNumber }}</span></p>
              <p class="text-dark_green text-sm pt-1"><span>Email: </span>{{ user?.email }}</p>
          </div>
          <div>
            <ButtonInput
              class="h-[56px] text-[13px] bg-[#27536B] mt-6"
              icon="keyboard_double_arrow_right"
              :onClick="() => {
                userStore.setUser(user)
                activity = ACTIVITY.SEARCH_MDA}"
              :bg="'bg-[#204458]'"
            >
              Continue
            </ButtonInput>
          </div>
        </div>

        <div class="">
          <p class="text-base text-dark_green font-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
      <div v-if="activity == ACTIVITY.SEARCH_MDA">
        <div class="items-center py-5 w-full">
          <SearchMda @onRowClick="selectMda"></SearchMda>
        </div>
        <div 
          class="flex justify-between p-3 items-center w-full rounded-xl bg-[#E6F3FB] h-36 mb-5">
          <div>
              <p class="text-dark_green text-lg font-bold">{{ selectedMda?.label }}</p>
              <p><span v-if="selectedMda?.organisationCode" class="text-dark_green txt-sm">Organization ID: </span><span class="text-dark_green text-sm font-bold pt-1">{{ selectedMda?.organisationCode }}</span></p>
          </div>
          <div>
            <ButtonInput
                    v-if="selectedMda?.organisationCode"
                    class="h-[56px] text-[13px] bg-[#27536B] mt-6"
                    icon="keyboard_double_arrow_right"
                    :onClick="() => gotoBIll()"
                    :bg="'bg-[#204458]'"
                  >
                    Continue
                  </ButtonInput>
          </div>
        </div>
        <div class="">
          <p class="text-base text-dark_green font-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
