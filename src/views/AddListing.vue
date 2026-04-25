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
                <input v-model="form.title" type="text" class="form-control" placeholder="Напр. Світла квартира біля метро" required>
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

              <div class="mb-4">
                <label class="form-label font-weight-bold small">Ціна (₴ за 2 ночі)</label>
                <div class="input-group">
                  <span class="input-group-text bg-light">₴</span>
                  <input v-model="form.priceNumber" type="number" class="form-control" placeholder="2500" required>
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label font-weight-bold small">Опис об'єкта</label>
                <textarea v-model="form.text" class="form-control" rows="4" placeholder="Опишіть зручності, розташування, правила проживання..." required></textarea>
              </div>

              <h5 class="font-weight-bold mb-4 border-bottom pb-2">Фотографії</h5>
              
              <div class="mb-4">
                <label class="form-label small text-muted">Виберіть головне фото для вашого об'єкта</label>
                <input type="file" class="form-control" accept="image/*" @change="handleImageUpload" required>
                
                <div v-if="imagePreview" class="mt-3 text-center bg-light p-3 rounded">
                  <p class="small text-muted mb-2">Попередній перегляд:</p>
                  <img :src="imagePreview" alt="Прев'ю" class="img-fluid rounded shadow-sm" style="max-height: 250px; object-fit: cover;">
                </div>
              </div>

              <h5 class="font-weight-bold mb-4 border-bottom pb-2">Ваші контактні дані</h5>
              <div class="bg-light p-3 rounded mb-4">
                <p class="mb-1"><strong>Ім'я:</strong> {{ currentUser.name }}</p>
                <p class="mb-1"><strong>Телефон:</strong> {{ currentUser.phone }}</p>
                <p class="mb-0 small text-muted"><i class="fas fa-info-circle"></i> Ці дані будуть показуватися орендарям для зв'язку з вами.</p>
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

const router = useRouter()
const store = usePropertyStore()

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
  text: ''
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

  const payload = {
    title: form.value.title,
    description: form.value.description, // Ваше поле text
    city: form.value.city,
    type: form.value.type,
    img: form.value.imgUrl,
    area: 50.0,            // Якщо у формі немає площі, поки поставте заглушку або додайте поле
    price: cleanPrice,     // Тепер це чисте число!
    room_count: 1,         // Заглушка або додайте поле у форму
    owner_id: 1            // ТИМЧАСОВО: ID вашого користувача (потім будете брати з токена)
  }

  // Відправляємо на бекенд...
  await axios.post('http://localhost:8000/api/listings', payload)
}

  // Імітуємо затримку сервера
  setTimeout(() => {
    store.addProperty(newListing) // Додаємо в Pinia
    alert('Ваше оголошення успішно опубліковано!')
    router.push('/') // Повертаємо на головну сторінку, щоб побачити його
  }, 1000)
}
</script>