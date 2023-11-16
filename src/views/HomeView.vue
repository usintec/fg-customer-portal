<script setup lang="ts">
import Sidebar from '@/components/sidebar/Sidebar.vue'
import MTopBar from '@/components/mobile/MTopBar.vue'
import MFooter from '@/components/mobile/MFooter.vue'
import MGetStarted from '@/components/mobile/MGetStarted.vue'
import Content from '@/views/Content.vue'
import MContent from '@/components/mobile/MContent.vue'
import { useHomeStore } from '@/stores/pageName'

const homeStore = useHomeStore()

const onShowMContent = () => {
  homeStore.setHome()
  window.scrollTo(0, 0)
}
</script>
<template>
  <div class="bg-white-50 h-screen w-full flex flex-col sm:flex-row">
    <MTopBar />
    <Sidebar v-if="!homeStore.home" />
    <MGetStarted v-if="!homeStore.home" @onClick="onShowMContent" />
    <MContent v-if="homeStore.home" />
    <MFooter />
    <Content />
  </div>
</template>
