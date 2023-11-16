// userStore.ts
import { defineStore } from 'pinia'
import type { IUserInfo, ICustomer } from '@/services/types'
import LoginService from '@/services/LoginService'

interface State {
  user: IUserInfo | undefined
  users: IUserInfo[]
  userDetails: ICustomer | undefined
}
export const useUserStore = defineStore('user', {
  state: () =>
    ({
      user: undefined as IUserInfo | undefined,
      users: [],
      userDetails: JSON.parse(localStorage.getItem('userDetails') || '{}') as ICustomer | undefined
    }) as State,
  actions: {
    async fetchUserInfo() {
      const user = this.user ?? (await LoginService.userInfo())
      this.setUser(user)
    },
    init() {
      if (localStorage.getItem('refreshToken')) {
        this.fetchUserInfo()
      }
    },
    setUser(user: IUserInfo) {
      this.user = user
      if (!this.user.userId) this.user.userId = user.id ?? this.user.userId
    },
    setUsers(user: IUserInfo[]) {
      this.users = user
    },
    saveUsers(users: IUserInfo[]) {
      console.log(users)
      this.users = users
      console.log(this.users)
    },
    clearUser() {
      this.user = undefined
    },
    setUserDetails(userDetails: ICustomer) {
      this.userDetails = userDetails
      localStorage.setItem('userDetails', JSON.stringify(userDetails))
    },
    clearUserDetails() {
      this.userDetails = undefined
      localStorage.removeItem('userDetails')
    },
    userLoggedIn() {
      return !!this.user
    }
  }
})
