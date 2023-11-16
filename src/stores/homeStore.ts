import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('homeStore', () => {
  const clicked = ref(false)
  const click = () => {
    clicked.value = true
  }

  return { clicked, click }
})
