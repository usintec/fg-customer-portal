<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import MaterialIcon from '../icon/MaterialIcon.vue'
import UpdateToken from '@/services/UpdateToken'
import dateFormat from 'dateformat'
import { useUserStore } from '@/stores/userInfo'
import { useRouter } from 'vue-router'

const lastLogin = ref<Date>()

const router = useRouter()

const userStore = useUserStore()
const userDetail = computed(() => userStore.userDetails)

onMounted(async () => {
  lastLogin.value = UpdateToken.getLastLogin()
})

const home = () => router.push({ name: 'choose options' })
</script>

<template>
  <div class="hidden sm:flex bg-dark_green py-5 px-14 items-center justify-between sticky top-0">
    <div class="flex items-center gap-3 justify-center">
      <p @click="home" class="text-white text-base cursor-pointer">Dashboard</p>
      <p class="text-[#B3CAC2] text-sm">
        Signed in as {{ userDetail?.lastName ?? '' }} {{ userDetail?.firstName ?? '' }} | Last
        Login:
        {{ dateFormat(lastLogin, 'd mmmm, yyyy hh:mmTT') }}
      </p>
    </div>

    <div class="flex gap-5">
      <MaterialIcon @click="home" class="text-2xl text-white cursor-pointer" outline icon="home" />
      <div class="relative">
        <MaterialIcon class="text-2xl text-white" outline icon="notifications" />
        <span
          class="absolute bottom-4 left-3 w-5 h-5 bg-[#A8BFCC] rounded-full text-center text-sm text-white font-bold"
          >0</span
        >
      </div>
    </div>
  </div>
</template>
