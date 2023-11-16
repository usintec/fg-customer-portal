<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from './stores/userInfo'

const userStore = useUserStore()

onMounted(() => {
  userStore.init()
})
</script>

<template>
  <div>
    <RouterView />
  </div>
</template>
