// src/stores/authStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Перевіряємо, чи є токен при завантаженні сайту
    token: localStorage.getItem('token') || null, 
    user: null // Тут будемо зберігати ім'я та прізвище
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async fetchUser() {
      // Якщо токена немає, немає сенсу робити запит
    try {
    const response = await axios.get('http://localhost:8000/api/auth/me', {
      headers: { Authorization: `Bearer ${this.token}` }
    })
    console.log("Дані користувача отримано:", response.data) 
    this.user = response.data
  } catch (error) {
    console.error("Сервер не віддав профіль:", error.response?.data)
  }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    }
  }
})