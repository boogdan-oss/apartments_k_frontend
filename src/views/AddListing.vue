<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">

        <div class="card shadow-lg border-0" style="border-radius: 15px;">
          <div class="card-header bg-success text-white p-4" style="border-radius: 15px 15px 0 0;">
            <h3 class="mb-0"><i class="fas fa-plus-circle me-2"></i> Додати нове оголошення</h3>
            <p class="mb-0 small text-light mt-1">Заповніть форму нижче, щоб додати ваш об'єкт у каталог.</p>
          </div>

          <div class="card-body p-4 p-md-5">
            <form @submit.prevent="submitListing">

              <h5 class="font-weight-bold mb-4 border-bottom pb-2">Основна інформація</h5>

              <div class="mb-3">
                <label class="form-label font-weight-bold small">Заголовок оголошення</label>
                <input v-model="form.title" type="text" class="form-control"
                  placeholder="Напр. Світла квартира біля метро" required>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label font-weight-bold small">Місто</label>
                  <input v-model="form.city" type="text" class="form-control" placeholder="Напр. Київ" required>
                </div>
                <div class="col-md-6 mt-3 mt-md-0">
                  <label class="form-label font-weight-bold small">Тип житла</label>
                  <select v-model="form.type" class="form-select form-control" required>
                    <option value="" disabled>Оберіть тип</option>
                    <option value="Квартира">Квартира</option>
                    <option value="Будинок">Будинок</option>
                    <option value="Студія">Студія</option>
                    <option value="Лофт">Лофт</option>
                  </select>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Площа (м²)</label>
                  <input v-model="form.area" type="number" step="0.1" class="form-control" placeholder="Напр. 45.5"
                    required>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Кількість кімнат</label>
                  <input v-model="form.room_count" type="number" class="form-control" placeholder="Напр. 2" required>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Вулиця та номер будинку</label>
                <input v-model="form.street" type="text" class="form-control" placeholder="вул. Соборна, 15" required>
              </div>

              <div class="mb-4">
                <label class="form-label font-weight-bold small">Ціна (₴ за 2 ночі)</label>
                <div class="input-group">
                  <span class="input-group-text bg-light">₴</span>
                  <input v-model="form.priceNumber" type="number" class="form-control" placeholder="2500" required>
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label font-weight-bold small">Опис об'єкта</label>
                <textarea v-model="form.text" class="form-control" rows="4"
                  placeholder="Опишіть зручності, розташування, правила проживання..." required></textarea>
              </div>

              <h5 class="font-weight-bold mb-4 border-bottom pb-2">Фотографії</h5>

              <div class="mb-4">
                <label class="form-label small text-muted">Виберіть головне фото для вашого об'єкта</label>
                <input type="file" class="form-control" accept="image/*" @change="handleImageUpload" required>

                <div v-if="imagePreview" class="mt-3 text-center bg-light p-3 rounded">
                  <p class="small text-muted mb-2">Попередній перегляд:</p>
                  <img :src="imagePreview" alt="Прев'ю" class="img-fluid rounded shadow-sm"
                    style="max-height: 250px; object-fit: cover;">
                </div>
              </div>



              <button type="submit" class="btn btn-success btn-lg w-100" :disabled="isLoading">
                <span v-if="isLoading"><i class="fas fa-spinner fa-spin"></i> Збереження...</span>
                <span v-else>Опублікувати оголошення</span>
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePropertyStore } from '../stores/propertyStores'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const store = usePropertyStore()
const authStore = useAuthStore()

// Імітація даних авторизованого користувача (орендодавця)
const currentUser = ref({
  name: 'Олександр Власник',
  phone: '+38 (067) 999-88-77'
})

// Дані форми
const form = ref({
  title: '',
  city: '',
  type: '',
  priceNumber: '',
  text: '',
  area: '',
  room_count: '',
  street: ''
})

const imagePreview = ref(null)
const isLoading = ref(false)

// Функція обробки завантаження фото
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Створюємо тимчасове локальне посилання на файл, щоб показати прев'ю
    imagePreview.value = URL.createObjectURL(file)
  }
}

// Функція відправки форми
const submitListing = () => {
  isLoading.value = true

  // Формуємо фінальний об'єкт так, як очікує наше сховище
  const newListing = {
    title: form.value.title,
    city: form.value.city,
    type: form.value.type,
    text: form.value.text,
    price: `₴${form.value.priceNumber} за 2 ночі`,
    img: imagePreview.value || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80', // Якщо фото немає, ставимо заглушку
    ownerName: currentUser.value.name,
    ownerPhone: currentUser.value.phone
  }
  const handleAdd = async () => {
    // Очищаємо ціну від пробілів та знаку гривні, залишаємо тільки цифри
    const cleanPrice = parseFloat(form.value.price.replace(/\D/g, ''))
    try {
      const payload = {
        title: form.value.title,
        description: form.value.description, // Ваше поле text
        city: form.value.city,
        type: form.value.type,
        img: form.value.imgUrl,
        area: parseFloat(form.value.area),         // Якщо у формі немає площі, поки поставте заглушку або додайте поле
        price: cleanPrice,
        room_count: parseInt(form.value.room_count),
        street: form.value.street,
        owner_id: authStore.user.id,         // Заглушка або додайте поле у форму
        address_id: null      // ТИМЧАСОВО: ID вашого користувача (потім будете брати з токена)
      }

      // Відправляємо на бекенд...
      const response = await axios.post('http://localhost:8000/api/apartments/', payload, {
        headers: {
          Authorization: `Bearer ${authStore.token}` // Передаємо токен, щоб бекенд пустив нас
        }
      })
      alert('Ваше оголошення успішно опубліковано і збережено в базу!')
      router.push('/') // Перекидаємо на головну

    } catch (error) {
      console.error("Помилка створення оголошення:", error)

      // Показуємо користувачу, що саме пішло не так
      if (error.response) {
        alert("Помилка: " + JSON.stringify(error.response.data.detail))
      } else {
        alert("Помилка з'єднання з сервером")
      }
    } finally {
      isLoading.value = false // Вимикаємо індикатор завантаження в будь-якому випадку
    }
  }

  // Імітуємо затримку сервера
  setTimeout(() => {
    store.addProperty(newListing) // Додаємо в Pinia
    alert('Ваше оголошення успішно опубліковано!')
    router.push('/') // Повертаємо на головну сторінку, щоб побачити його
  }, 1000)
}
</script>