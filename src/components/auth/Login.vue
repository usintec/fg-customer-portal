<script setup lang="ts">
import ButtonInput from '../inputs/button/ButtonInput.vue'
import Modal from '../modal/Modal.vue'
import Register from './Register.vue'
import Verify from './Verify.vue'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import FlagInput from '../inputs/text/FlagInput.vue'
import CustomerService from '@/services/CustomerService'
import type { ICustomer } from '@/services/types'
import { fetchCountryCodeMapping, formatPhoneNumber } from './phoneUtils'

const loading = ref(false)
const showRegisterModal = ref(false)
const showVerifyModal = ref(false)
const toast = useToast()
const formattedPhoneNumber = ref('')

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'closeModal'): void
}>()

const regclose = () => {
  showRegisterModal.value = false
}

const close = () => {
  showVerifyModal.value = false
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
    const res = await CustomerService.login(state.value)
    toast.success('Successful, verify token')
    toast.success('Your token is: ' + res.value.token)
    loading.value = false

    const code = state.value.countryCode
    const phones = state.value.phoneNumber
    const countryCodeMapping = await fetchCountryCodeMapping()

    if (code !== undefined && phones !== undefined) {
      formattedPhoneNumber.value = formatPhoneNumber(code, phones, countryCodeMapping)
    }

    showVerifyModal.value = true
  } catch (error) {
    loading.value = false
  }
}
</script>
<template>
  <div>
    <Modal
      width="w-11/12 lg:w-1/2 xl:w-1/3 2xl:w-1/4"
      :shows="show"
      @closeModal="() => emit('closeModal')"
      title="Login to your account"
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
                  icon="keyboard_double_arrow_right"
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
              Don’t have an account?
              <span class="text-[#179C24] cursor-pointer" @click="() => (showRegisterModal = true)"
                >Register</span
              >
            </p>
          </div>
        </div>
      </template>
    </Modal>

    <Verify
      :showV="showVerifyModal"
      @closeModal="close"
      name="Login"
      :dialCodes="formattedPhoneNumber"
    />

    <Register :shows="showRegisterModal" @closeModal="regclose" />
  </div>
</template>
