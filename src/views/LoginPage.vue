<template>
  <div class="container d-flex justify-content-center align-items-center" style="min-height: 80vh;">
    <div class="card shadow-lg border-0" style="width: 100%; max-width: 450px; border-radius: 15px;">
      <div class="card-body p-5">
        <div class="text-center mb-4">
          <i class="fas fa-home fa-3x text-success mb-3"></i>
          <h3 class="font-weight-bold">З поверненням!</h3>
          <p class="text-muted">Увійдіть у свій акаунт ТвійДім</p>
        </div>

        <form @submit.prevent="handleLogin">
          
          <div v-if="serverError" class="alert alert-danger py-2 small text-center">
            <i class="fas fa-exclamation-circle"></i> {{ serverError }}
          </div>

          <div class="form-group mb-3">
            <label class="form-label font-weight-bold small">Email адреса</label>
            <div class="input-group">
              <span class="input-group-text bg-white"><i class="fas fa-envelope text-muted"></i></span>
              <input v-model="email" type="email" class="form-control border-start-0 pl-0" placeholder="name@example.com" required>
            </div>
          </div>

          <div class="form-group mb-4">
            <div class="d-flex justify-content-between">
              <label class="form-label font-weight-bold small">Пароль</label>
              <a href="#" class="small text-success text-decoration-none">Забули пароль?</a>
            </div>
            <div class="input-group">
              <span class="input-group-text bg-white"><i class="fas fa-lock text-muted"></i></span>
              <input v-model="password" type="password" class="form-control border-start-0 pl-0" placeholder="Введіть ваш пароль" required>
            </div>
          </div>

          <button type="submit" class="btn btn-success w-100 btn-lg mb-3" :disabled="isLoading">
            <span v-if="isLoading"><i class="fas fa-spinner fa-spin"></i> Перевірка даних...</span>
            <span v-else>Увійти</span>
          </button>
        </form>

        <div class="text-center mt-4">
          <span class="text-muted small">Ще немає акаунту? 
            <router-link to="/register" class="text-success text-decoration-none font-weight-bold">Зареєструватися</router-link>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore' 
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const serverError = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  serverError.value = ''

  try {
    // 1. Для OAuth2 у FastAPI ми зобов'язані використовувати URLSearchParams
    const formData = new URLSearchParams()
    
    // 2. Зверніть увагу: сервер чекає ключ "username", навіть якщо ми передаємо туди email
    formData.append('username', email.value) 
    formData.append('password', password.value)

    // 3. Відправляємо запит зі спеціальним заголовком
    const response = await axios.post('http://localhost:8000/api/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    // Якщо успішно - зберігаємо токен
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token)
    authStore.token = response.data.access_token // Оновлюємо токен у сторі
  
  // ВАЖЛИВО: Відразу викликаємо завантаження профілю!
  await authStore.fetchUser() 
  alert("ви успішно увійшли")
  router.push('/')
    }

  } catch (error) {
    console.error("Помилка входу:", error)
    if (error.response && error.response.status === 401) {
      serverError.value = 'Невірний email або пароль'
    } else if (error.response && error.response.data && error.response.data.detail) {
      serverError.value = error.response.data.detail
    } else {
      serverError.value = 'Помилка з\'єднання з сервером'
    }
  } finally {
    isLoading.value = false
  }
}
</script>