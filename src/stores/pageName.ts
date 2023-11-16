import { PAGE } from '@/services/types'
import { defineStore } from 'pinia'

export const useHomeStore = defineStore('homeStore', {
  state: () => ({
    home: false,
    selectedPage: PAGE.INVOICES
  }),
  actions: {
    setPage(page: PAGE) {
      this.selectedPage = page
    },
    setHome() {
      this.home = true
    }
  }
})
