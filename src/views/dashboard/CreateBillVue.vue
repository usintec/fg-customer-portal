<script setup lang="ts">
import CreateBill from '@/components/bill/create/CreateBill.vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import { useUserStore } from '@/stores/userInfo'
import { computed } from 'vue'

const userStore = useUserStore()
const userDetail = computed(() => userStore.userDetails)
</script>
<template>
  <div>
    <div class="w-4/5 mx-auto my-3">
      <Breadcrumb
        :title="`Hello, ${userDetail?.lastName ?? ''} ${userDetail?.firstName ?? ''}`"
        :name="`${userDetail?.email ?? ''}`"
      />
    </div>

    <div class="w-4/5 mx-auto my-5">
      <CreateBill></CreateBill>
    </div>
  </div>
</template>
