<template>
  <div class="container mt-4">
    <div class="card shadow border-0 p-4">
      <h3><i class="fas fa-edit text-primary"></i> Редагування оголошення</h3>
      <hr>
      <form @submit.prevent="updateListing" v-if="form">
        <div class="mb-3">
          <label class="form-label">Статус оголошення</label>
          <select v-model="form.status" class="form-select border-primary fw-bold">
            <option value="active"> Активне (відображається на сайті)</option>
            <option value="rented"> Здано (знято з публікації)</option>
          </select>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Назва</label>
            <input v-model="form.title" type="text" class="form-control" required>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Ціна (грн)</label>
            <input v-model="form.price" type="number" class="form-control" required>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Опис</label>
          <textarea v-model="form.description" class="form-control" rows="4"></textarea>
        </div>

        <div class="d-flex justify-content-between">
          <button type="button" @click="$router.back()" class="btn btn-secondary">Скасувати</button>
          <button type="submit" class="btn btn-success px-4" :disabled="isLoading">
            {{ isLoading ? 'Зберігання...' : 'Зберегти зміни' }}
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
const isLoading = ref(false)
const form = ref(null)

onMounted(async () => {
  try {
    // Завантажуємо поточні дані квартири
    const response = await axios.get(`http://localhost:8000/api/apartments/${route.params.id}`)
    form.value = response.data
  } catch (error) {
    alert("Помилка завантаження даних");
    router.push('/profile');
  }
})

const updateListing = async () => {
  isLoading.value = true
  try {
    await axios.patch(`http://localhost:8000/api/apartments/${route.params.id}`, form.value, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    alert("Дані успішно оновлено!");
    router.push('/profile');
  } catch (error) {
    console.error(error);
    alert("Не вдалося оновити оголошення");
  } finally {
    isLoading.value = false
  }
}
</script>