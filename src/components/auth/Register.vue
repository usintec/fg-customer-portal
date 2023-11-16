<script setup lang="ts">
import ButtonInput from '../inputs/button/ButtonInput.vue'
import Modal from '../modal/Modal.vue'
import Login from './Login.vue'
import { ref } from 'vue'
import CustomerService from '@/services/CustomerService'
import type { ICustomer } from '@/services/types'
import { useToast } from 'vue-toastification'
import FlagInput from '../inputs/text/FlagInput.vue'

const loading = ref(false)
const showCustomerModal = ref(false)
const toast = useToast()
const showLoginComponent = ref(false)

defineProps<{
  shows: boolean
}>()

const emit = defineEmits<{
  (e: 'closeModal'): void
}>()

const close = () => {
  showCustomerModal.value = false
}

const state = ref<Partial<ICustomer>>({})
const errorMessage = ref<Partial<ICustomer>>()

const setState = (key: keyof ICustomer, value: string) => {
  state.value = { ...state.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}

const setErrorMessage = (key: keyof ICustomer, message: string) => {
  errorMessage.value = { ...errorMessage.value, [key]: message }
}

const phone: (keyof ICustomer)[] = ['phoneNumber']

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

const toggleLoginComponent = () => {
  showLoginComponent.value = true
  showCustomerModal.value = true
}

const next = () => {
  if (errorMessages(phone)) {
    return
  } else {
    return submit()
  }
}

const submit = async () => {
  loading.value = true
  try {
    await CustomerService.create(state.value)
    toast.success('Created successfully')
    loading.value = false

    state.value = {}
    toggleLoginComponent()
  } catch (error) {
    loading.value = false
  }
}
</script>
<template>
  <div>
    <Modal
      width="w-11/12 lg:w-1/2 xl:w-1/3 2xl:w-1/4"
      :shows="shows"
      @closeModal="() => emit('closeModal')"
      title="Register as a customer"
    >
      <template v-slot:content>
        <div class="">
          <div class="mt-5">
            <p>
              Enter your phone number below and an OTP will be sent to you. Use the OTP sent to you
              to complete your login process
            </p>
          </div>
          <div class="mt-7 w-full">
            <div class="flex flex-col items-center sm:flex-row gap-3">
              <div class="w-full">
                <FlagInput
                  label="Your phone number"
                  :onChange="(v) => setState('phoneNumber', v)"
                  :selectItem="(v) => setState('countryCode', v)"
                  placeholder="Ex. 08132515487"
                  type="text"
                  :errorMessage="errorMessage?.phoneNumber"
                  :value="state?.phoneNumber"
                />
              </div>
              <div class="w-11/12 sm:w-36">
                <ButtonInput
                  :loading="loading"
                  class="h-[56px] text-[13px] bg-[#27536B] mt-6"
                  :onClick="next"
                  :bg="'bg-[#204458]'"
                >
                  Submit
                </ButtonInput>
              </div>
            </div>
          </div>

          <div class="mt-7">
            <p class="text-[15px] font-medium text-[#1A3848]">
              Already have an account?
              <span class="text-[#179C24] cursor-pointer" @click="toggleLoginComponent">Login</span>
            </p>
          </div>
        </div>
      </template>
    </Modal>

    <div v-if="showLoginComponent">
      <Login :show="showCustomerModal" @closeModal="close" />
    </div>
  </div>
</template>
