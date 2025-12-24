import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLoginUser } from '../api/user'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = ref(false)

  const checkLogin = async () => {
    try {
      const userData = await getLoginUser()
      user.value = userData
      isLoggedIn.value = true
      return true
    } catch (error) {
      user.value = null
      isLoggedIn.value = false
      return false
    }
  }

  const setUser = (userData) => {
    user.value = userData
    isLoggedIn.value = !!userData
  }

  const clearUser = () => {
    user.value = null
    isLoggedIn.value = false
  }

  return {
    user,
    isLoggedIn,
    checkLogin,
    setUser,
    clearUser
  }
})

