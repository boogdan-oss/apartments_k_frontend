<template>
  <div class="card property-card h-100 shadow-sm border-0" style="transition: transform 0.2s, box-shadow 0.2s;">
    <img :src="property.img" class="card-img-top img-fluid rounded-top" :alt="property.title"
      style="height: 200px; object-fit: cover;">

    <div class="card-body d-flex flex-column flex-grow-1 position-relative">

      <div class="card h-100 shadow-sm border-0 position-relative">

        <!-- Кнопка Вподобайки -->
       <button @click="$emit('toggleFavorite', property.id)"
          class="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 shadow-sm"
          style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; z-index: 10; transition: 0.2s;">
         
          <i class="far-heart far-lg" :class="isFav ? 'fas text-danger' : 'far text-secondary'"></i>
        </button> 

        <img :src="property.img" class="card-img-top..." alt="...">
        <div class="card-body p-0 pt-2">
          <h5 class="card-title">{{ property.title }}</h5>

          <p class="text-muted small mb-1">
            <i class="fas fa-expand"></i> {{ property.area }} м² |
            <i class="fas fa-door-open"></i> {{ property.room_count }} кімн.
          </p>

          <p class="small text-primary mb-2">
            <i class="fas fa-map-marker-alt"></i> {{ property.city }}
          </p>

          <h6 class="text-success font-weight-bold">{{ property.price }} грн</h6>
        </div>

        <div class="mt-auto d-flex justify-content-between pt-3 border-top">
          <router-link :to="`/property/${property.id}`" class="btn btn-outline-secondary">Деталі</router-link>
          <button class="btn btn-success btn-sm" @click="$emit('open-booking', property)">Забронювати</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { useAuthStore } from '../../stores/authStore'

const authStore = useAuthStore()

// 2. ОГОЛОШУЄМО PROPS (Те, що картка отримує від головної сторінки)
// defineProps({
//   property: {
//     type: Object,
//     required: true,
//     isFav: Boolean
//   },
//   favoriteIds: {
//     type: Array,
//     default: () => [] // За замовчуванням порожній масив
//   }
// })

// // 3. ОГОЛОШУЄМО EMITS (Те, що картка "кричить" головній сторінці зробити)
// defineEmits(['open-booking', 'toggle-favorite'])
defineProps({
    property: Object,
    isFav: Boolean // <--- ОСЬ ЦЕ ОБОВ'ЯЗКОВО ТРЕБА ДОДАТИ!
})

// 2. Додаємо toggleFavorite, щоб картка мала дозвіл "кричати" наверх про клік
defineEmits(['openBooking', 'toggleFavorite'])
</script>

<style scoped>
.property-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}
</style>