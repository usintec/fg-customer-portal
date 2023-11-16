<script setup lang="ts">
import CustomerService from '@/services/CustomerService'
import type { Address, BillingAddress, ICustomer } from '@/services/types'
import { onMounted, ref, computed } from 'vue'
import TextInput from '../inputs/text/TextInput.vue'
import Modal from '../modal/Modal.vue'
import RoundTabItems from '../tab/RoundTabItems.vue'
import { useToast } from 'vue-toastification'
import SelectInput from '../inputs/select/SelectInput.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import Radio from '../inputs/radio/Radio.vue'
import LookUpService from '@/services/LookUpService'
import { useUserStore } from '@/stores/userInfo'

const lookUp = ref<Record<string, string[]>>({})
const lookUpLoader = ref(false)

const dialCode = ref<Record<string, string[]>>({})
const dialCodeLoader = ref(false)
const cityLoader = ref(false)

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'closeModal'): void
}>()

const options = [
  { label: 'Individual', value: 'individual' },
  { label: 'Business', value: 'business' }
]

const userStore = useUserStore()
const userDetails = computed(() => userStore.userDetails)

const fetchUser = async () => {
  await userStore.fetchUserInfo()
}

const customers = computed(() => userStore.user)

onMounted(async () => {
  const states = await LookUpService.states()
  lookUp.value = {
    states
  }

  lookUpLoader.value = false

  const dailcode = await LookUpService.dailcode()
  dialCode.value = {
    dailcode
  }
  dialCodeLoader.value = false

  fetchUser()

  if (userDetails.value) {
    state.value = {
      firstName: userDetails.value.firstName,
      lastName: userDetails.value.lastName,
      phoneNumber: userDetails.value.phoneNumber,
      email: userDetails.value.email,
      companyName: userDetails.value.companyName,
      bvn: userDetails.value.bvn,
      nin: userDetails.value.nin,
      cacNumber: userDetails.value.cacNumber,
      contactPersonName: userDetails.value.contactPersonName,
      customerType: userDetails.value.customerType,
      countryCode: userDetails.value.countryCode
    }

    addressState.value = {
      city: userDetails.value.address.city,
      state: userDetails.value.address.state,
      street: userDetails.value.address.street,
      country: userDetails.value.address.country,
      postalCode: userDetails.value.address.postalCode
    }

    billAddState.value = {
      city: userDetails.value.billingAddress.city,
      state: userDetails.value.billingAddress.state,
      street: userDetails.value.billingAddress.street,
      country: userDetails.value.billingAddress.country,
      postalCode: userDetails.value.billingAddress.postalCode
    }
  }
})

const selectedOption = ref(options[0].value)
const isDisabled = ref(false)

const onCheck = (newValue: string) => {
  selectedOption.value = newValue
  setState('customerType', newValue)
}

const toast = useToast()

const loading = ref(false)
const state = ref<Partial<ICustomer>>({})
const errorMessage = ref<Partial<ICustomer>>()

const addressState = ref<Address>({} as Address)
const addressErrorMessage = ref<Partial<Address>>()

const billAddState = ref<BillingAddress>({} as BillingAddress)
const billAddErrorMessage = ref<Partial<BillingAddress>>()

const setState = (key: keyof ICustomer, value: string) => {
  state.value = { ...state.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}

const setErrorMessage = (key: keyof ICustomer, message: string) => {
  errorMessage.value = { ...errorMessage.value, [key]: message }
}

const setAddressState = (key: keyof Address, value: string) => {
  addressState.value = { ...addressState.value, [key]: value }
  addressErrorMessage.value = { ...addressErrorMessage.value, [key]: undefined }
}

const setBillAddressState = (key: keyof BillingAddress, value: string) => {
  billAddState.value = { ...billAddState.value, [key]: value }
  billAddErrorMessage.value = { ...billAddErrorMessage.value, [key]: undefined }
}

const errorMessages = (keys: (keyof ICustomer)[]) => {
  let error = false
  for (const key of keys) {
    if (!state.value[key]) {
      setErrorMessage(key, `${key} is required`)
      error = true
    }
  }
  return error
}

const setCountryState = async (name: string) => {
  setBillAddressState('state', name)
  billAddState.value = { ...billAddState.value, city: undefined }
  cityLoader.value = true
  const cities = await LookUpService.cites(name)
  lookUp.value = {
    ...lookUp.value,
    cities
  }
  cityLoader.value = false
}

const individual: (keyof ICustomer)[] = ['firstName', 'lastName']

const business: (keyof ICustomer)[] = ['companyName']

const next = () => {
  if (selectedOption.value == 'individual') {
    if (errorMessages(individual)) {
      return
    } else {
      return submit()
    }
  }

  if (selectedOption.value == 'business') {
    if (errorMessages(business)) {
      return
    } else {
      return submit()
    }
  }
}

const submit = async () => {
  loading.value = true
  state.value.address = addressState.value
  state.value.billingAddress = billAddState.value
  try {
    await CustomerService.update(state.value, customers.value?.userId ?? '')

    const userDetails = await CustomerService.getCustomerDetails(customers.value?.userId ?? '')
    userStore.setUserDetails(userDetails)

    toast.success('Updated successfully')
    errorMessage.value = {}
    addressErrorMessage.value = {}
    billAddErrorMessage.value = {}
    loading.value = false
    emit('closeModal')
  } catch (error) {
    loading.value = false
  }
}

const customer = [
  {
    name: 'Details'
  },
  {
    name: 'Address'
  },
  {
    name: 'More'
  }
]

const textValue = (str: string[]) =>
  str.map((s) => ({
    text: s,
    value: s
  }))
</script>
<template>
  <div>
    <Modal
      :shows="show"
      @closeModal="() => emit('closeModal')"
      title="Update Details"
      width="w-11/12 sm:w-3/4 lg:w-1/2 xl:w-3/6 2xl:w-1/3"
    >
      <template v-slot:content>
        <div class="">
          <RoundTabItems class="" :tabs="customer">
            <template v-slot:tab-0>
              <div class="">
                <div class="flex gap-4 w-full">
                  <span class="font-medium text-[#204458]"> Customer Type: </span>
                  <Radio
                    v-for="(option, index) in options"
                    :key="index"
                    v-model="selectedOption"
                    :value="option.value"
                    :label="option.label"
                    @onChecked="onCheck"
                    :name="'radio-group'"
                    :defaultChecked="option.value === 'individual'"
                    :disabled="isDisabled"
                    activeGreen
                  />
                </div>

                <div class="mt-7 w-full">
                  <div class="grid grid-cols-2" v-if="selectedOption === 'individual'">
                    <div class="me-3">
                      <TextInput
                        label="Last Name (Surname)"
                        :onChange="(v) => setState('lastName', v)"
                        important="*"
                        placeholder="Type here"
                        type="text"
                        :errorMessage="errorMessage?.lastName"
                        :value="state?.lastName"
                      />
                    </div>

                    <div class="">
                      <TextInput
                        label="First Name"
                        :onChange="(v) => setState('firstName', v)"
                        important="*"
                        placeholder="Type here"
                        type="text"
                        :errorMessage="errorMessage?.firstName"
                        :value="state?.firstName"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols mt-3" v-if="selectedOption === 'individual'">
                    <div class="me-3">
                      <TextInput
                        label="Email address"
                        :onChange="(v) => setState('email', v)"
                        placeholder="Type here"
                        type="text"
                        :errorMessage="errorMessage?.email"
                        :value="state?.email"
                      />
                    </div>


                  </div>

                  <div class="grid grid-cols-2 mt-3" v-if="selectedOption === 'individual'">
                    <div class="me-3">
                      <div class="">
                        <SelectInput
                          label="State"
                          :onChange="(v) => setAddressState('state', v)"
                          :selected="addressState?.state"
                          value="value"
                          :name="['text']"
                          :items="textValue(lookUp['states'])"
                          :loading="lookUpLoader"
                        />
                      </div>
                    </div>

                    <div class="">
                      <TextInput
                        label="Local Government Area (LGA)"
                        :onChange="(v) => setAddressState('city', v)"
                        placeholder="Type here"
                        type="text"
                        :errorMessage="addressErrorMessage?.city"
                        :value="addressState?.city"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 mt-3" v-if="selectedOption === 'individual'">
                    <div class="me-3">
                      <TextInput
                        label="National Identity Number (NIN)"
                        :onChange="(v) => setState('nin', v)"
                        placeholder="Type here"
                        type="text"
                        :errorMessage="errorMessage?.nin"
                        :value="state?.nin"
                      />
                    </div>

                    <div class="">
                      <TextInput
                        label="Bank Verification Number (BVN)"
                        :onChange="(v) => setState('bvn', v)"
                        placeholder="Type here"
                        type="text"
                        :errorMessage="errorMessage?.bvn"
                        :value="state?.bvn"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols mt-3" v-if="selectedOption === 'individual'">
                    <TextInput
                      label="Customer address"
                      :onChange="(v) => setAddressState('street', v)"
                      placeholder="Type here"
                      type="text"
                      :errorMessage="addressErrorMessage?.street"
                      :value="addressState?.street"
                    />
                  </div>

                  <div class="grid grid-cols-2" v-if="selectedOption === 'business'">
                    <div class="me-3">
                      <TextInput
                        label="Company Name"
                        :onChange="(v) => setState('companyName', v)"
                        important="*"
                        placeholder="Type here"
                        type="text"
                        :errorMessage="errorMessage?.companyName"
                        :value="state?.companyName"
                      />
                    </div>

                    <div class="">
                      <TextInput
                        label="Contact Person Name"
                        :onChange="(v) => setState('contactPersonName', v)"
                        important="*"
                        placeholder="Type here"
                        type="text"
                        :errorMessage="errorMessage?.contactPersonName"
                        :value="state?.contactPersonName"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols mt-3" v-if="selectedOption === 'business'">
                    <div class="me-3">
                      <TextInput
                        label="Email address"
                        :onChange="(v) => setState('email', v)"
                        placeholder="Type here"
                        type="text"
                        :errorMessage="errorMessage?.email"
                        :value="state?.email"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 mt-3" v-if="selectedOption === 'business'">
                    <div class="me-3">
                      <TextInput
                        label="Company Reg. Number (CAC)"
                        :onChange="(v) => setState('cacNumber', v)"
                        placeholder="Type here"
                        type="text"
                        :errorMessage="errorMessage?.cacNumber"
                        :value="state?.cacNumber"
                      />
                    </div>

                    <div class="">
                      <SelectInput
                        label="Country"
                        :onChange="(v) => setAddressState('country', v)"
                        value="name"
                        :selected="addressState.country"
                        :name="['name']"
                        :items="dialCode['dailcode']"
                        :errorMessage="addressErrorMessage?.country"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 mt-3" v-if="selectedOption === 'business'">
                    <div class="me-3">
                      <SelectInput
                        label="State"
                        :onChange="(v) => setAddressState('state', v)"
                        :selected="addressState?.state"
                        value="value"
                        :name="['text']"
                        :items="textValue(lookUp['states'])"
                        :loading="lookUpLoader"
                        :errorMessage="addressErrorMessage?.state"
                      />
                    </div>

                    <div class="">
                      <TextInput
                        label="LGA"
                        :onChange="(v) => setAddressState('city', v)"
                        placeholder="Type here"
                        type="text"
                        :errorMessage="addressErrorMessage?.city"
                        :value="addressState?.city"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols mt-3" v-if="selectedOption === 'business'">
                    <TextInput
                      label="Company address"
                      :onChange="(v) => setState('address', v)"
                      placeholder="Type here"
                      type="text"
                      :errorMessage="addressErrorMessage?.street"
                      :value="addressState?.street"
                    />
                  </div>
                </div>

                <div class="flex justify-end">
                  <div class="flex w-2/5 gap-5">
                    <ButtonInput
                      class="mt-9 text-sm bg-[#D8E8F2]"
                      :onClick="() => emit('closeModal')"
                    >
                      Cancel
                    </ButtonInput>

                    <ButtonInput class="mt-9 text-sm" :onClick="next"> Save Details </ButtonInput>
                  </div>
                </div>
              </div> </template
            >,
            <template v-slot:tab-1>
              <div class="mb-10">
                <div class="w-full">
                  <div class="grid grid-cols-2 mt-3">
                    <div class="">
                      <SelectInput
                        label="Country"
                        :onChange="(v) => setAddressState('country', v)"
                        value="name"
                        :selected="addressState.country"
                        :name="['name']"
                        :items="dialCode['dailcode']"
                        :errorMessage="addressErrorMessage?.country"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols mt-3">
                    <TextInput
                      label="Billing address"
                      :onChange="(v) => setBillAddressState('street', v)"
                      placeholder="Type here"
                      type="text"
                      :errorMessage="billAddErrorMessage?.street"
                      :value="billAddState?.street"
                    />
                  </div>

                  <div class="grid grid-cols-2 mt-3">
                    <div class="me-3">
                      <SelectInput
                        label="State"
                        :onChange="setCountryState"
                        :selected="billAddState.state"
                        value="value"
                        :name="['text']"
                        :items="textValue(lookUp['states'])"
                        :errorMessage="billAddErrorMessage?.state"
                        important
                      />
                    </div>

                    <div>
                      <SelectInput
                        label="City"
                        :onChange="(v) => setBillAddressState('city', v)"
                        :selected="billAddState.city"
                        value="value"
                        :name="['text']"
                        :items="textValue(lookUp['cities'] ?? [])"
                        :errorMessage="billAddErrorMessage?.city"
                        :loading="cityLoader"
                        :noDataMessage="
                          lookUp['cities'] === undefined && !cityLoader
                            ? 'Please select state first'
                            : undefined
                        "
                        important
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 mt-3">
                    <div class="me-3">
                      <TextInput
                        label="Postal/Zip Code"
                        :onChange="(v) => setBillAddressState('postalCode', v)"
                        placeholder="Type here"
                        type="text"
                        :errorMessage="billAddErrorMessage?.postalCode"
                        :value="billAddState?.postalCode"
                      />
                    </div>

                    <div class="">
                      <TextInput
                        label="Phone Number"
                        :onChange="(v) => setState('phoneNumber', v)"
                        placeholder="Ex. 080 0000 0000"
                        type="text"
                        :errorMessage="errorMessage?.phoneNumber"
                        :value="state?.phoneNumber"
                      />
                    </div>
                  </div>
                </div>

                <div class="flex justify-end">
                  <div class="flex w-2/5 gap-5">
                    <ButtonInput
                      class="mt-9 text-sm bg-[#D8E8F2]"
                      :onClick="() => emit('closeModal')"
                    >
                      Cancel
                    </ButtonInput>

                    <ButtonInput class="mt-9 text-sm" :onClick="next"> Save Details </ButtonInput>
                  </div>
                </div>
              </div> </template
            >,
            <template v-slot:tab-2>
              <div class="mb-10">
                <div class="w-full">
                  <div class="grid grid-cols mt-3">
                    <div class="">
                      <TextInput
                        label="Website URL"
                        :onChange="(v) => setState('website', v)"
                        placeholder="Type here"
                        type="text"
                        :errorMessage="errorMessage?.website"
                        :value="state?.website"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols mt-3">
                    <div class="">
                      <TextInput
                        label="Remarks"
                        :onChange="(v) => setState('remarks', v)"
                        placeholder="Type here"
                        type="text"
                        :errorMessage="errorMessage?.remarks"
                        :value="state?.remarks"
                      />
                    </div>
                  </div>
                </div>

                <div class="flex justify-end mt-10">
                  <div class="flex w-2/5 gap-5">
                    <ButtonInput
                      class="mt-9 text-sm bg-[#D8E8F2]"
                      :onClick="() => emit('closeModal')"
                    >
                      Cancel
                    </ButtonInput>

                    <ButtonInput class="mt-9 text-sm" :onClick="next" :loading="loading">
                      Save Details
                    </ButtonInput>
                  </div>
                </div>
              </div> </template
            >,
          </RoundTabItems>
        </div>
      </template>
    </Modal>
  </div>
</template>
