<!-- <template>
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
</script> -->







<template>
  <div class="container my-5" v-if="property">
    <div class="row">

      <!-- Ліва колонка: фото + опис + відгуки -->
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

        <!-- =========== БЛОК ВІДГУКІВ =========== -->
        <div class="card shadow-sm border-0 mt-4">
          <div class="card-body p-4">
            <h5 class="font-weight-bold mb-4">
              <i class="fas fa-comments text-success me-2"></i>
              Відгуки ({{ reviews.length }})
            </h5>

            <!-- Форма додавання відгуку (тільки для авторизованих) -->
            <div v-if="authStore.isAuthenticated && authStore.user?.id !== property.owner_id"
              class="mb-4">
              <textarea
                v-model="newReviewText"
                class="form-control mb-2"
                rows="3"
                placeholder="Напишіть свій відгук про це оголошення..."
                maxlength="1000"
              ></textarea>
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">{{ newReviewText.length }} / 1000</small>
                <button
                  class="btn btn-success btn-sm px-4"
                  @click="submitReview"
                  :disabled="!newReviewText.trim() || submitting">
                  <span v-if="submitting">
                    <i class="fas fa-spinner fa-spin me-1"></i> Відправка...
                  </span>
                  <span v-else>Залишити відгук</span>
                </button>
              </div>
            </div>

            <div v-else-if="!authStore.isAuthenticated" class="alert alert-light border mb-4">
              <i class="fas fa-info-circle me-2 text-muted"></i>
              <router-link to="/login" class="text-success">Увійдіть</router-link>, щоб залишити відгук.
            </div>

            <!-- Список відгуків -->
            <div v-if="reviews.length > 0">
              <div
                v-for="review in reviews"
                :key="review.id"
                class="border-bottom pb-3 mb-3">

                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <!-- а) Ім'я і прізвище автора -->
                    <span class="fw-bold">{{ review.author_name }} {{ review.author_surname }}</span>
                    <!-- б) Дата: якщо поточний рік — не показуємо рік -->
                    <span class="text-muted small ms-2">{{ formatDate(review.created_at) }}</span>
                  </div>

                  <!-- Кнопка видалення (тільки для автора або адміна) -->
                  <button
                    v-if="canDelete(review)"
                    class="btn btn-sm btn-outline-danger py-0 px-2"
                    @click="deleteReview(review.id)"
                    title="Видалити відгук">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>

                <!-- в) Текст відгуку -->
                <p class="mb-0 mt-2 text-muted" style="white-space: pre-wrap;">{{ review.text }}</p>
              </div>
            </div>

            <div v-else class="text-center text-muted py-3">
              <i class="fas fa-comment-slash fa-2x mb-2"></i>
              <p>Відгуків ще немає. Будьте першим!</p>
            </div>

          </div>
        </div>
        <!-- =========== КІНЕЦЬ БЛОКУ ВІДГУКІВ =========== -->

      </div>

      <!-- Права колонка: власник + кнопки -->
      <div class="col-lg-4">
        <div class="card shadow-sm border-0 sticky-top" style="top: 20px;">
          <div class="card-body text-center p-4">
            <h5 class="mb-3 font-weight-bold">Інформація про власника</h5>
            <div class="mb-3">
              <i class="fas fa-user-circle text-secondary" style="font-size: 60px;"></i>
            </div>
            <h5 class="font-weight-bold">{{ property.owner?.name }} {{ property.owner?.surname }}</h5>
            <hr>
            <p class="mb-1 text-muted small">Email для зв'язку:</p>
            <p class="font-weight-bold">
              <a :href="'mailto:' + property.owner?.email" class="text-success text-decoration-none">
                <i class="fas fa-envelope me-2"></i>{{ property.owner?.email }}
              </a>
            </p>
            <button class="btn btn-success w-100 mt-3">Зв'язатися з власником</button>
          </div>
          <router-link
            v-if="authStore.isAuthenticated && authStore.user?.id !== property.owner_id"
            :to="`/create-contract/${property.id}`"
            class="btn btn-primary btn-lg w-100 mt-3">
            <i class="fas fa-file-signature"></i> Оформити договір
          </router-link>
        </div>
      </div>

    </div>
  </div>

  <!-- Завантаження -->
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

const property    = ref(null)
const reviews     = ref([])
const newReviewText = ref('')
const submitting  = ref(false)


onMounted(async () => {
  try {
    const propertyId = route.params.id

    // Завантажуємо квартиру
    const res = await axios.get(`http://localhost:8000/api/apartments/listing/${propertyId}`)
    property.value = res.data

    // Завантажуємо відгуки
    await loadReviews(propertyId)

  } catch (error) {
    console.error("Помилка завантаження:", error)
    alert("Не вдалося знайти це оголошення")
  }
})

const loadReviews = async (apartmentId) => {
  try {
    const res = await axios.get(`http://localhost:8000/api/reviews/${apartmentId}`)
    reviews.value = res.data
  } catch (e) {
    console.error("Помилка завантаження відгуків:", e)
  }
}

const submitReview = async () => {
  if (!newReviewText.value.trim()) return
  submitting.value = true
  try {
    const res = await axios.post(
      `${API}/api/reviews/${property.value.id}`,
      { text: newReviewText.value },
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    )
    // Додаємо новий відгук на початок списку
    reviews.value.unshift(res.data)
    newReviewText.value = ''
  } catch (e) {
    const msg = e.response?.data?.detail || 'Помилка при відправці відгуку'
    alert(msg)
  } finally {
    submitting.value = false
  }
}

const deleteReview = async (reviewId) => {
  if (!confirm('Видалити цей відгук?')) return
  try {
    await axios.delete(`http://localhost:8000/api/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    reviews.value = reviews.value.filter(r => r.id !== reviewId)
  } catch (e) {
    alert('Не вдалося видалити відгук')
  }
}

const canDelete = (review) => {
  if (!authStore.user) return false
  return (
    authStore.user.id === review.author_id ||
    authStore.user.role === 'admin'
  )
}

// б) Форматування дати: якщо поточний рік — не показуємо рік
const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  const now = new Date()
  const day = d.getDate()
  const month = d.toLocaleString('uk-UA', { month: 'long' })

  if (d.getFullYear() === now.getFullYear()) {
    return `${day} ${month}`         // напр. "5 травня"
  }
  return `${day} ${month} ${d.getFullYear()}` // напр. "5 травня 2023"
}
</script>