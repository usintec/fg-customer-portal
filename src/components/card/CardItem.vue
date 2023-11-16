<script setup lang="ts">
import type { ICard } from './types'
import MaterialIcon from '../icon/MaterialIcon.vue'

defineProps<{
  card: ICard
}>()
</script>
<template>
  <div class="bg-[#DAF2E2] rounded-xl shadow w-80 h-48">
    <div class="flex justify-between p-4">
      <div class="relative inline-flex items-center">
        <MaterialIcon class="mr-1" outline :icon="card.icon" />
        <p class="text-[#204458] text-left text-sm font-satoshi pl-1">{{ card.title }}</p>
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" class="sr-only peer" />
        <div
          class="w-10 h-5 bg-green-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-green-100 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"
        ></div>
        <span class="text-[#204458] text-left font-bold text-sm font-satoshi ml-3">{{
          card.currency
        }}</span>
      </label>
    </div>
    <p class="text-[#204458] text-left text-5xl font-bold font-satoshi pl-4 mt-3 -tracking-extra">
      <span v-if="card.currency == 'NGN'">&#8358;</span>
      <span v-if="card.currency == 'USD'">&#36;</span>{{ card.amount }}
    </p>
    <div class="flex justify-between p-4">
      <p class="text-[#4E8385] text-left text-sm font-satoshi">
        Collected for {{ card.itemCount }} Items
      </p>
      <div class="flex bg-green-400 rounded-md w-20 h-6">
        <p class="text-white text-left text-sm pl-2">{{ card.itemPercentage }}</p>
        <MaterialIcon class="text-white" outline icon="trending_up" />
      </div>
    </div>
  </div>
</template>
