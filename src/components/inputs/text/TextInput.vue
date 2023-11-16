<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import ButtonInput from '../button/ButtonInput.vue'
import { ref } from 'vue'
import useKeyPressed from '@/hooks/useKeyPressedClick'

interface IInputProps {
  label: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  important?: string
  errorMessage?: string
  value?: string
  whiteBackground?: boolean
  border?: boolean
  description?: string
  disabled?: boolean
  min?: string
  button?: {
    label: string
    onClick: () => void
  },
  loading?: boolean
}

const props = defineProps<IInputProps>()
const showPassword = ref(false)

const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  props.onChange(target.value)
}
const toggleShowPassword = () => (showPassword.value = !showPassword.value)

useKeyPressed('Enter', () => {
  props.button?.onClick()
})
</script>
<template>
  <div class="flex flex-col gap-1">
    <label class="text-dark_green text-sm font-medium"
      >{{ label }} <span class="text-red-600">{{ important }}</span></label
    >
    <div class="w-full h-14">
      <div class="w-full h-full flex items-center flex-row-reverse relative">
        <input
          :disabled="disabled"
          class="w-full h-full rounded-lg px-4 focus:outline-green_regular bg-[#DEF3FF]"
          :class="{
            'border border-red-600 focus:outline-red-500': errorMessage,
            'focus:outline-green_regular': !errorMessage,
            'bg-white': whiteBackground,
            'bg-[#DEF3FF]': !whiteBackground,
            border: border
          }"
          :placeholder="props.placeholder"
          @input="onChange"
          :value="value"
          :type="showPassword ? 'text' : type"
          :min="type === 'date' ? min : undefined"
        />
        <MaterialIcon
          class="absolute m-4 cursor-pointer hover:scale-105 text-green_regular"
          v-if="props.type === 'password'"
          :onClick="toggleShowPassword"
          :icon="!showPassword ? 'visibility' : 'visibility_off'"
          outline
        />

        <div v-if="button" class="absolute right-7 w-20">
          <ButtonInput
            class="text-[13px] bg-[#204458] m-4 cursor-pointer w-[90px] h-[42px]"
            :onClick="button?.onClick"
            :loading="loading"
          >
            {{ button?.label }}
          </ButtonInput>
        </div>
      </div>
      <span v-if="description" class="text-[#747EA1] text-sm font-thin">{{ description }}</span>
    </div>
  </div>
</template>

<style scoped>
::placeholder {
  color: #a6bac5;
  font-family: 'Satoshi';
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
</style>
