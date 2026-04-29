<template>
  <div class="container my-5" v-if="property">
    <div class="row">
      <div class="col-lg-8 mb-4">
        <div class="card shadow-sm border-0">
          <img :src="property.img" class="card-img-top" alt="Property Image"
            style="max-height: 500px; object-fit: cover;">
          <div class="card-body p-4">
            <h2 class="font-weight-bold">{{ property.title }}</h2>
            <h4 class="text-success mb-4">{{ property.price }} грн / місяць</h4>

            <h5>Опис:</h5>
            <p class="text-muted" style="white-space: pre-wrap;">{{ property.description || 'Опис відсутній.' }}</p>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow-sm border-0 sticky-top" style="top: 20px;">
          <div class="card-body text-center p-4">
            <h5 class="mb-3 font-weight-bold">Інформація про власника</h5>

            <div class="mb-3">
              <i class="fas fa-user-circle text-secondary" style="font-size: 60px;"></i>
            </div>

            <h5 class="font-weight-bold">{{ property.owner.name }} {{ property.owner.surname }}</h5>

            <hr>

            <p class="mb-1 text-muted small">Email для зв'язку:</p>
            <p class="font-weight-bold">
              <a :href="'mailto:' + property.owner.email" class="text-success text-decoration-none">
                <i class="fas fa-envelope me-2"></i>{{ property.owner.email }}
              </a>
            </p>

            <button class="btn btn-success w-100 mt-3">Зв'язатися з власником</button>
          </div>
          <router-link v-if="authStore.user?.role === 'tenant'" :to="`/create-contract/${property.id}`"
            class="btn btn-primary btn-lg w-100 mt-3">
            <i class="fas fa-file-signature"></i> Оформити договір
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <div class="text-center my-5 py-5" v-else>
    <i class="fas fa-spinner fa-spin fa-3x text-success"></i>
    <p class="mt-3 text-muted">Завантаження деталей...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'
const authStore = useAuthStore()
const route = useRoute()
const property = ref(null) // Тут зберігатимуться дані з бекенду

onMounted(async () => {
  try {
    // Беремо ID з URL-адреси (наприклад, з /property/5 беремо цифру 5)
    const propertyId = route.params.id

    // Робимо запит на створений нами бекенд-маршрут
    const response = await axios.get(`http://localhost:8000/api/apartments/listing/${propertyId}`)
    property.value = response.data

  } catch (error) {
    console.error("Помилка завантаження квартири:", error)
    alert("Не вдалося знайти цю квартиру")
  }
})
</script>