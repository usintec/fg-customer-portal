<script setup lang="ts">
import type { IPaymentProvider } from '@/services/types'
import MaterialIcon from '../icon/MaterialIcon.vue'

defineProps<{
  provider: IPaymentProvider
  selected: boolean
}>()

defineEmits<{
  (e: 'onSelect'): void
}>()
</script>
<template>
  <div
    class="flex rounded-lg p-3 items-center cursor-pointer"
    :class="{
      'bg-dark_green ': selected,
      'bg-[#DEF3FF]': !selected
    }"
    @click="() => $emit('onSelect')"
  >
    <div
      class="w-8 h-8 rounded-full flex justify-center items-center text-white"
      :class="{
        'bg-[#56D07F] ': selected,
        'bg-[#C2E0F0]': !selected
      }"
    >
      <MaterialIcon v-if="selected" icon="check" />
    </div>
    <div
      class="ml-4 rounded-md h-10 py-4 flex justify-center items-center px-4"
      :style="{
        'background-color': `${provider.name === 'Mocca' ? 'black' : 'white'}`
      }"
    >
      <img :src="provider.logo" class="h-4" />
    </div>
    <div
      class="font-medium ml-5 uppercase text-base"
      :class="{
        'text-dark_green ': !selected,
        'text-[#DEF3FF]': selected
      }"
    >
      {{ provider.name }}
    </div>
  </div>
</template>
