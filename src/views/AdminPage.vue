<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-danger"><i class="fas fa-tools"></i> Адмін-панель: Модерація оголошень</h2>
    
    <div class="row">
      <div class="col-md-4 mb-4" v-for="property in listings" :key="property.id">
        <div class="card h-100 shadow-sm border-danger"> <img :src="property.img || 'https://via.placeholder.com/300x200?text=Немає+фото'" class="card-img-top" alt="Фото">
          
          <div class="card-body">
            <h5 class="card-title">{{ property.title }}</h5>
            <p class="text-muted small mb-1">{{ property.city }}, {{ property.street || 'Вулиця не вказана' }}</p>
            <h6 class="text-success font-weight-bold">{{ property.price }} грн</h6>
            <p class="small text-secondary mt-2">ID оголошення: {{ property.id }}</p>
          </div>

          <div class="card-footer bg-light d-flex justify-content-between">
            <button @click="editListing(property.id)" class="btn btn-sm btn-primary">
              <i class="fas fa-edit"></i> Редагувати
            </button>
            <button @click="deleteListing(property.id)" class="btn btn-sm btn-danger">
              <i class="fas fa-trash-alt"></i> Видалити
            </button>
          </div>

        </div>
      </div>
      
      <div v-if="listings.length === 0" class="col-12 text-center text-muted">
        <h4>Оголошень поки немає.</h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const listings = ref([])

// 1. Завантажуємо всі квартири при відкритті сторінки
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/apartments/')
    listings.value = response.data
  } catch (error) {
    console.error("Помилка завантаження квартир:", error)
  }
})

// 2. Функція ВИДАЛЕННЯ
const deleteListing = async (id) => {
  // Запитуємо підтвердження, щоб не видалити випадково
  if (!confirm('Ви впевнені, що хочете назавжди видалити це оголошення?')) return

  try {
    // Відправляємо запит на бекенд (з токеном адміна)
    await axios.delete(`http://localhost:8000/api/apartments/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    
    // Миттєво прибираємо картку з екрану без перезавантаження сторінки
    listings.value = listings.value.filter(item => item.id !== id)
    alert('Оголошення успішно видалено!')
    
  } catch (error) {
    console.error("Помилка видалення:", error)
    alert('Не вдалося видалити. Перевірте, чи працює видалення на бекенді.')
  }
}

// 3. Функція РЕДАГУВАННЯ
const editListing = (id) => {
  // Поки що просто показуємо повідомлення, 
  // потім тут буде перехід на сторінку форми редагування
  alert(`Тут буде відкриватися форма редагування для оголошення ID: ${id}`)
  // router.push(`/edit-listing/${id}`) 
}
</script>