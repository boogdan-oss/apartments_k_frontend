<template>
  <div class="container mt-5" v-if="apartment">
    <div class="card shadow-lg border-0 p-4">
      <h2 class="text-primary mb-4"><i class="fas fa-file-contract"></i> Оформлення договору оренди</h2>
      <div class="row mb-4 bg-light p-3 rounded">
        <div class="col-md-6">
          <p><strong>Квартира:</strong> {{ apartment.title }}</p>
          <p><strong>Адреса:</strong> {{ apartment.city }}</p>
        </div>
        <div class="col-md-6 text-end">
          <p><strong>Власник:</strong> {{ ownerName }}</p>
          <h4 class="text-success">{{ apartment.price }} грн/міс</h4>
        </div>
      </div>

      <form @submit.prevent="sendContract">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Дата початку оренди</label>
            <input type="date" v-model="form.start_date" class="form-control" required>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Дата завершення оренди</label>
            <input type="date" v-model="form.end_date" class="form-control" required>
          </div>
        </div>

        <div class="alert alert-info">
          <strong>Орендар:</strong> {{ authStore.user?.name }} {{ authStore.user?.surname }}
        </div>

        <div class="d-flex justify-content-between mt-4">
          <button type="button" @click="$router.back()" class="btn btn-secondary">Назад</button>
          <button type="submit" class="btn btn-primary px-5" :disabled="loading">
            {{ loading ? 'Відправка...' : 'Відправити договір власнику' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const apartment = ref(null)
const ownerName = ref('')
const loading = ref(false)

const form = ref({
  start_date: '',
  end_date: '',
})

onMounted(async () => {
  const res = await axios.get(`http://localhost:8000/api/apartments/${route.params.id}`)
  apartment.value = res.data
  const ownerRes = await axios.get(`http://localhost:8000/api/users/${apartment.value.owner_id}`)
  ownerName.value = ownerRes.data.name
})

const sendContract = async () => {
  loading.value = true
  try {
    const start = new Date(form.value.start_date)
    const end = new Date(form.value.end_date)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    let calculatedSum = diffDays * parseFloat(apartment.value.price)

  const payload = {
  apartment_id: apartment.value.id,
  owner_id: apartment.value.owner_id,   // Беремо ID власника з даних квартири
  client_id: authStore.user.id,         // Беремо ID того, хто зараз онлайн (навіть якщо він теж власник)
  start_date: form.value.start_date,
  end_date: form.value.end_date,
  price: parseFloat(apartment.value.price),
  total_sum: calculatedSum
}

    // ВАЖЛИВО: додаємо { responseType: 'blob' }
    const response = await axios.post('http://localhost:8000/api/contracts/', payload, {
      headers: { Authorization: `Bearer ${authStore.token}` },
      responseType: 'blob' 
    })

    // ЛОГІКА ЗАВАНТАЖЕННЯ ФАЙЛУ В БРАУЗЕРІ
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    
    // Назва файлу, під якою він збережеться у користувача
    link.setAttribute('download', `Договір_Оренди_${apartment.value.title}.docx`)
    
    document.body.appendChild(link)
    link.click()
    
    // Очищення
    link.remove()
    window.URL.revokeObjectURL(url)

    alert("Договір сформовано та завантажено!")
    router.push('/profile')
    
  } catch (e) {
    console.error("Помилка:", e)
    alert("Помилка при генерації договору")
  } finally {
    loading.value = false
  }
}
</script>