<template>
    <div class="container mt-4" v-if="authStore.user">
        <div class="card mb-4 shadow-sm border-0 bg-light">
            <div class="card-body d-flex align-items-center">
                <div class="me-4">
                    <i class="fas fa-user-circle fa-4x text-secondary"></i>
                </div>
                <div>
                    <h2 class="mb-1">{{ authStore.user.name }} {{ authStore.user.surname }}</h2>
                    <p class="text-muted mb-0">
                        <i class="fas fa-envelope"></i> {{ authStore.user.email }} |
                        <span class="badge bg-primary ms-2">
                            {{ authStore.user.role === 'owner' ? 'Орендодавець' : 'Орендар' }}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>

        <div v-if="authStore.user.role === 'owner'">
            <h3 class="mb-3"><i class="fas fa-home"></i> Мої виставлені оголошення</h3>

            <div class="row">
                <div class="col-md-4 mb-4" v-for="apartment in myItems" :key="apartment.id">

                    <div class="card h-100 shadow-sm border-0">
                        <img :src="apartment.img || 'https://via.placeholder.com/300'" class="card-img-top" alt="Фото">

                        <div class="card-body">
                            <h5 class="card-title">{{ apartment.title }}</h5>
                            <p class="text-muted small">{{ apartment.city }}, {{ apartment.street }}</p>
                            <h6 class="text-success">{{ apartment.price }} грн</h6>
                        </div>

                        <div class="card-footer bg-white d-flex gap-2">
                            <router-link :to="`/edit-listing/${apartment.id}`"
                                class="btn btn-primary btn-sm flex-grow-1">
                                <i class="fas fa-edit"></i> Редагувати
                            </router-link>

                            <span :class="apartment.status === 'active' ? 'badge bg-success' : 'badge bg-secondary'"
                                class="align-self-center">
                                {{ apartment.status === 'active' ? 'Активне' : 'Здано' }}
                            </span>
                        </div>
                    </div>

                </div>

            </div>

            <div v-if="authStore.user.role === 'tenant'">
                <h3 class="mb-3"><i class="fas fa-heart text-danger"></i> Мої уподобані квартири</h3>

                <div class="row">
                    <div class="col-md-4 mb-4" v-for="apartment in myItems" :key="apartment.id">
                        <div class="card h-100 shadow-sm border-danger">
                            <img :src="apartment.img || 'https://via.placeholder.com/300'" class="card-img-top"
                                alt="Фото">
                            <div class="card-body">
                                <h5 class="card-title">{{ apartment.title }}</h5>
                                <h6 class="text-success">{{ apartment.price }} грн</h6>
                            </div>
                            <div class="card-footer bg-white text-center">
                                <router-link :to="`/listing/${apartment.id}`"
                                    class="btn btn-primary btn-sm">Переглянути</router-link>
                                <button class="btn btn-outline-danger btn-sm ms-2"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    </div>

                    <div v-if="myItems.length === 0 && !isLoading" class="col-12 text-center text-muted">
                        <p>Ви ще не додали жодної квартири до улюблених.</p>
                        <router-link to="/" class="btn btn-outline-primary mt-2">Перейти до пошуку</router-link>
                    </div>
                </div>
            </div>
        </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const myItems = ref([])
const isLoading = ref(true)

onMounted(async () => {
    if (!authStore.user) return // Якщо не авторизований, нічого не робимо

    try {
        // Якщо це власник - вантажимо його квартири
        if (authStore.user.role === 'owner') {
            const response = await axios.get('http://localhost:8000/api/apartments/my-listings', {
                headers: { Authorization: `Bearer ${authStore.token}` }
            })
            myItems.value = response.data
        }
        // Якщо це орендар - вантажимо його улюблені
        else if (authStore.user.role === 'tenant') {
            const response = await axios.get('http://localhost:8000/api/apartments/favorites', {
                headers: { Authorization: `Bearer ${authStore.token}` }
            })
            myItems.value = response.data
        }
    } catch (error) {
        console.error("Помилка завантаження даних профілю:", error)
    } finally {
        isLoading.value = false
    }

    const favoriteApartments = ref([])

const loadMyFavorites = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/apartments/favorites', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    favoriteApartments.value = response.data
  } catch (error) {
    console.error("Помилка завантаження:", error)
  }
}

onMounted(() => {
  if (authStore.user?.role === 'tenant') {
    loadMyFavorites()
  }
})
})
</script>