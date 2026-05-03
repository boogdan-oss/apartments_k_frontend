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

    <!-- БЛОК 1: МОЇ ОГОЛОШЕННЯ (БАЧИТЬ ТІЛЬКИ ВЛАСНИК) -->
    <div v-if="authStore.user.role === 'owner'" class="mb-5">
        <h3 class="mb-3"><i class="fas fa-home"></i> Мої виставлені оголошення</h3>

        <div class="row">
            <!-- Зверніть увагу: тепер тут масив myListings -->
            <div class="col-md-4 mb-4" v-for="apartment in myListings" :key="apartment.id">
                <div class="card h-100 shadow-sm border-0">
                    <img :src="apartment.img || 'https://via.placeholder.com/300'" class="card-img-top" alt="Фото">
                    <div class="card-body">
                        <h5 class="card-title">{{ apartment.title }}</h5>
                        <p class="text-muted small">{{ apartment.city }}, {{ apartment.street }}</p>
                        <h6 class="text-success">{{ apartment.price }} грн</h6>
                    </div>
                    <div class="card-footer bg-white d-flex gap-2">
                        <router-link :to="`/edit-listing/${apartment.id}`" class="btn btn-primary btn-sm flex-grow-1">
                            <i class="fas fa-edit"></i> Редагувати
                        </router-link>
                        <button @click="deleteListing(apartment.id)" class="btn btn-danger btn-sm">
                            Видалити
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="myListings.length === 0" class="col-12 text-center text-muted">
                <p>У вас ще немає виставлених оголошень.</p>
            </div>
        </div>
    </div>

    <!-- БЛОК 2: МОЇ ВПОДОБАННЯ (БАЧАТЬ ВСІ: І ОРЕНДАРІ, І ВЛАСНИКИ) -->
    <div>
        <h3 class="mb-3"><i class="fas fa-heart text-danger"></i> Мої уподобані квартири</h3>

        <div class="row">
            <!-- Зверніть увагу: тепер тут масив myFavorites -->
            <div class="col-md-4 mb-4" v-for="apartment in myFavorites" :key="apartment.id">
                <div class="card h-100 shadow-sm border-danger">
                    <img :src="apartment.img || 'https://via.placeholder.com/300'" class="card-img-top" alt="Фото">
                    <div class="card-body">
                        <h5 class="card-title">{{ apartment.title }}</h5>
                        <h6 class="text-success">{{ apartment.price }} грн</h6>
                    </div>
                    <div class="card-footer bg-white text-center">
                        <router-link :to="`/listing/${apartment.id}`"
                            class="btn btn-primary btn-sm">Переглянути</router-link>
                        <!-- Кнопка видалення з улюблених -->
                        <button @click="removeFromFavorites(apartment.id)" class="btn btn-outline-danger btn-sm ms-2">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="myFavorites.length === 0 && !isLoading" class="col-12 text-center text-muted">
                <p>Ви ще не додали жодної квартири до улюблених.</p>
                <router-link to="/" class="btn btn-outline-primary mt-2">Перейти до пошуку</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()

// Тепер у нас два окремі масиви!
const myListings = ref([]) 
const myFavorites = ref([]) 
const isLoading = ref(true)

// ==========================================
// Функція видалення СВОГО оголошення (Тільки для власника)
// ==========================================
const deleteListing = async (id) => {
  const isConfirmed = confirm("Ви впевнені, що хочете назавжди видалити це оголошення?");
  if (!isConfirmed) return; 

  try {
    await axios.delete(`http://localhost:8000/api/apartments/listing/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    myListings.value = myListings.value.filter(apt => apt.id !== id);
    alert("Оголошення успішно видалено!");
  } catch (error) {
    console.error("Помилка видалення оголошення:", error);
  }
}

// ==========================================
// Функція видалення з УЛЮБЛЕНИХ (Для всіх)
// ==========================================
const removeFromFavorites = async (id) => {
    try {
        // Замініть цей URL на той, який у вас на бекенді для видалення з улюблених
        await axios.delete(`http://localhost:8000/api/apartments/favorites/${id}`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        
        // Миттєво прибираємо картку з екрану
        myFavorites.value = myFavorites.value.filter(apt => apt.id !== id);
    } catch (error) {
        console.error("Помилка видалення з улюблених:", error);
    }
}

// ==========================================
// Завантаження даних при відкритті профілю
// ==========================================
onMounted(async () => {
    if (!authStore.user) return

    try {
        isLoading.value = true

        // 1. ВАНТАЖИМО ВПОДОБАННЯ ДЛЯ ВСІХ КОРИСТУВАЧІВ
        const favResponse = await axios.get('http://localhost:8000/api/apartments/favorites', {
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        myFavorites.value = favResponse.data

        // 2. ЯКЩО ЦЕ ВЛАСНИК — ДОДАТКОВО ВАНТАЖИМО ЙОГО ОГОЛОШЕННЯ
        if (authStore.user.role === 'owner') {
            const listResponse = await axios.get('http://localhost:8000/api/apartments/my-listings', {
                headers: { Authorization: `Bearer ${authStore.token}` }
            })
            myListings.value = listResponse.data
        }

    } catch (error) {
        console.error("Помилка завантаження даних профілю:", error)
    } finally {
        isLoading.value = false
    }
})
</script>