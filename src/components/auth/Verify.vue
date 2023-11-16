<script setup lang="ts">
import TextInput from '../inputs/text/TextInput.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import Modal from '../modal/Modal.vue'
import { ref } from 'vue'
import LoginService from '@/services/LoginService'
import CustomerService from '@/services/CustomerService'
import type { ICustomer } from '@/services/types'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userInfo'

const loading = ref(false)
const toast = useToast()
const router = useRouter()

const props = defineProps<{
  showV: boolean
  name?: string
  dialCodes: string
}>()

const emit = defineEmits<{
  (e: 'closeModal'): void
}>()

const state = ref<Partial<ICustomer>>({})
const errorMessage = ref<Partial<ICustomer>>()

const setState = (key: keyof ICustomer, value: string) => {
  state.value = { ...state.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}

const setErrorMessage = (key: keyof ICustomer, message: string) => {
  errorMessage.value = { ...errorMessage.value, [key]: message }
}

const code: (keyof ICustomer)[] = ['token']

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
  if (errorMessages(code)) {
    return
  } else {
    return submit()
  }
}

const userStore = useUserStore()

const submit = async () => {
  loading.value = true
  try {
    await LoginService.verify(props.dialCodes, state.value.token!)
    toast.success('Login successful')
    loading.value = false

    const res = await LoginService.userInfo()

    const userDetails = await CustomerService.getCustomerDetails(res.userId ?? '')
    userStore.setUserDetails(userDetails)

    state.value = {}
    router.push('/dashboard')
  } catch (error) {
    loading.value = false
  }
}
</script>
<template>
  <div>
    <Modal
      width="w-11/12 lg:w-1/2 xl:w-1/3 2xl:w-1/4"
      :shows="showV"
      @closeModal="() => emit('closeModal')"
      title="Verify your phone number"
      :back="true"
    >
      <template v-slot:content>
        <div class="">
          <div class="mt-5">
            <p>
              A 6-digit OTP code was sent to your phone number, enter the code below to login
              successfully.
            </p>
          </div>
          <div class="mt-7 w-full">
            <div class="flex flex-col items-center sm:flex-row gap-3">
              <div class="w-full">
                <TextInput
                  label="Enter OTP code"
                  :onChange="(v) => setState('token', v)"
                  placeholder="Ex. 08132515487"
                  type="text"
                  :errorMessage="errorMessage?.token"
                  :value="state?.token"
                />
              </div>
              <div class="w-11/12 sm:w-36">
                <ButtonInput
                  :loading="loading"
                  class="text-[13px] bg-[#27536B] mt-6 h-[56px] px-5"
                  @click="next"
                  :bg="'bg-[#204458]'"
                >
                  {{ name }}
                </ButtonInput>
              </div>
            </div>
          </div>

          <div class="mt-7">
            <p class="text-[15px] font-medium text-[#1A3848]">
              Didn’t get code? <span class="text-[#179C24]">Resend in 4m</span>
            </p>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>
