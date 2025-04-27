import { defineStore } from 'pinia'
import axios from 'axios'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: Cookies.get('auth_token') || null
  }),
  actions: {
    async login(email, password) {
      const response = await axios.post('/login', {
        email,
        password
      })
      this.token = response.data.access_token
      Cookies.set('auth_token', this.token, { expires: 7 })
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      this.user = await this.fetchUser()
    },
    async fetchUser() {
      if (!this.token) {
        return null
      }
      try {
        const response = await axios.post('/user')
        this.user = response.data
        return response.data
      } catch (error) {
        console.error('Failed to fetch user:', error)
      }
    },
    async logout() {
      try {
        await axios.post('/logout')
        this.user = null
        this.token = null
        Cookies.remove('auth_token')
        delete axios.defaults.headers.common['Authorization']
      } catch (error) {
        console.error('Failed to logout:', error)
      }
    },
    async register(name, email, password) {
      // eslint-disable-next-line no-useless-catch
      try {
        const response = await axios.post('/register', {
          name,
          email,
          password
        })
        this.token = response.data.access_token
        Cookies.set('auth_token', this.token, { expires: 7 })
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        this.user = response.data.data
      } catch (error) {
        throw error
      }
    },
    async initialize() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        await this.fetchUser()
      }
    }
  }
})
