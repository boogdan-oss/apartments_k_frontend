<template>
  <div class="container my-5 py-4">
    <div class="row bg-white shadow-lg" style="border-radius: 15px; overflow: hidden;">
      
      <div class="col-lg-5 d-none d-lg-flex p-5 text-white flex-column justify-content-center" style="background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80') center/cover;">
        <h2 class="mb-4">Знайдіть своє ідеальне місце</h2>
        <p class="lead mb-4">Приєднуйтесь до тисяч користувачів, які вже орендують та здають житло безпечно та зручно.</p>
        <ul class="list-unstyled">
          <li class="mb-3"><i class="fas fa-check-circle text-success me-2"></i> Перевірені власники</li>
          <li class="mb-3"><i class="fas fa-check-circle text-success me-2"></i> Без прихованих комісій</li>
          <li class="mb-3"><i class="fas fa-check-circle text-success me-2"></i> Прямий зв'язок 24/7</li>
        </ul>
      </div>

      <div class="col-lg-7 p-4 p-md-5">
        <h3 class="text-center mb-4 font-weight-bold">Створити акаунт</h3>
        
        <form @submit.prevent="handleRegister">
          
          <div v-if="serverError" class="alert alert-danger py-2 small text-center mb-3">
            <i class="fas fa-exclamation-triangle me-1"></i> {{ serverError }}
          </div>
          
          <div class="mb-4 text-center">
            <label class="d-block mb-2 font-weight-bold small">Хто ви?</label>
            <div class="btn-group w-100" style="max-width: 400px;">
              <input type="radio" class="btn-check" name="role" id="roleTenant" value="tenant" v-model="form.role">
              <label class="btn btn-outline-success" for="roleTenant">Шукаю житло</label>

              <input type="radio" class="btn-check" name="role" id="roleLandlord" value="owner" v-model="form.role">
              <label class="btn btn-outline-success" for="roleLandlord">Здаю житло</label>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label small font-weight-bold">Ім'я</label>
              <input v-model="form.firstName" type="text" class="form-control" placeholder="Іван" required>
            </div>
            <div class="col-md-6 mt-3 mt-md-0">
              <label class="form-label small font-weight-bold">Прізвище</label>
              <input v-model="form.lastName" type="text" class="form-control" placeholder="Франко" required>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label small font-weight-bold">Номер телефону</label>
              <input v-model="form.phone" type="tel" class="form-control" placeholder="+380..." required>
            </div>
            <div class="col-md-6 mt-3 mt-md-0">
              <label class="form-label small font-weight-bold">Дата народження</label>
              <input v-model="form.birthDate" type="date" class="form-control" required>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label small font-weight-bold">Email адреса</label>
            <input v-model="form.email" type="email" class="form-control" placeholder="name@example.com" required>
          </div>

          <div v-if="form.role === 'tenant'" class="mb-3 p-3 bg-light rounded border">
            <label class="form-label small font-weight-bold text-primary">Серія та номер паспорта (або ID-картки)</label>
            <input v-model="form.idCardSeries" type="text" class="form-control" placeholder="Напр. 123456789 або АВ123456" required>
            <div class="form-text small text-muted">Ці дані потрібні для безпеки та перевірки особи.</div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label small font-weight-bold">Пароль</label>
              <input v-model="form.password" type="password" class="form-control" placeholder="Мін. 6 символів" required minlength="6">
            </div>
            <div class="col-md-6 mt-3 mt-md-0">
              <label class="form-label small font-weight-bold">Підтвердження</label>
              <input v-model="form.confirmPassword" type="password" class="form-control" :class="{'is-invalid': passwordsMismatch}" placeholder="Повторіть пароль" required>
              <div class="invalid-feedback">Паролі не збігаються!</div>
            </div>
          </div>

          <div class="form-check mb-4">
            <input v-model="form.terms" class="form-check-input" type="checkbox" id="termsCheck" required>
            <label class="form-check-label small" for="termsCheck">
              Я погоджуюсь з <a href="#" class="text-success">Правилами сервісу</a>.
            </label>
          </div>

          <button type="submit" class="btn btn-success w-100 btn-lg" :disabled="isLoading || passwordsMismatch">
            <span v-if="isLoading"><i class="fas fa-spinner fa-spin"></i> Відправка даних...</span>
            <span v-else>Зареєструватися</span>
          </button>
          
          <div class="text-center mt-4">
            <span class="text-muted small">Вже є акаунт? 
              <router-link to="/login" class="text-success text-decoration-none font-weight-bold">Увійдіть</router-link>
            </span>
          </div>

        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// 1. ДОДАЛИ phone та birthDate у початковий стан форми
const form = ref({
  role: 'tenant',
  firstName: '',
  lastName: '',
  phone: '',       // Нове поле
  birthDate: '', 
  idCardSeries: '',  // Нове поле
  email: '',
  password: '',
  confirmPassword: '',
  terms: false
})

const isLoading = ref(false)
const serverError = ref('')

const passwordsMismatch = computed(() => {
  return form.value.confirmPassword.length > 0 && form.value.password !== form.value.confirmPassword
})

const handleRegister = async () => {
  if (passwordsMismatch.value) return 

  isLoading.value = true
  serverError.value = ''

  try {
    // 2. ДОДАЛИ нові поля у payload (те, що відправляється на бекенд у форматі JSON)
    const payload = {
      role: form.value.role,
      name: form.value.firstName,
      surname: form.value.lastName,
      phone_number: form.value.phone,           // Додано
      birthDate: form.value.birthDate,   // Додано
      email: form.value.email,
      password: form.value.password,
      id_card_series: form.value.role === 'tenant' ? form.value.idCardSeries : null
    }

    // Відправка POST запиту
    const response = await axios.post('http://localhost:8000/api/users', payload)

    alert(`Вітаємо, ${form.value.firstName}! Ваш акаунт успішно створено.`)
    router.push('/login')

  } catch (error) {
    console.error("Помилка реєстрації:", error)
    if (error.response && error.response.data && error.response.data.message) {
      serverError.value = error.response.data.message
    } else {
      serverError.value = "Не вдалося з'єднатися з сервером. Спробуйте пізніше."
    }
  } finally {
    isLoading.value = false
  }
}
</script>