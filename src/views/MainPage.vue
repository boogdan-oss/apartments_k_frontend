<template>
  <div>
    <div class="jumbotron jumbotron-fluid text-white text-center mb-0"
      style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=80') no-repeat center center/cover; padding: 100px 0;">
      <div class="container">
        <h1 class="display-4 font-weight-bold">Знайдіть ідеальне житло</h1>
        <p class="lead">Більше 10 000 перевірених квартир та будинків по всій Україні.</p>
        <button class="btn btn-success btn-lg mt-3" @click="scrollToCatalog">Почати пошук</button>
      </div>
    </div>

    <div class="bg-white py-5 shadow-sm">
      <div class="container">
        <div class="row text-center">
          <div class="col-md-4 mb-4 mb-md-0">
            <i class="fas fa-shield-alt fa-3x text-primary mb-3"></i>
            <h5>Безпечні угоди</h5>
            <p class="text-muted small">Всі орендодавці проходять перевірку документів перед публікацією.</p>
          </div>
          <div class="col-md-4 mb-4 mb-md-0">
            <i class="fas fa-bolt fa-3x text-warning mb-3"></i>
            <h5>Швидкий пошук</h5>
            <p class="text-muted small">Зручні фільтри дозволяють знайти житло за лічені хвилини.</p>
          </div>
          <div class="col-md-4">
            <i class="fas fa-comments fa-3x text-success mb-3"></i>
            <h5>Прямий зв'язок</h5>
            <p class="text-muted small">Жодних прихованих комісій — спілкуйтеся напряму з власником.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid py-5 bg-light" id="catalogSection">
      <div class="row px-md-3">

        <div class="col-lg-3 mb-4">
          <div class="card shadow-sm border-0 sticky-top" style="top: 80px; z-index: 10;">
            <div class="card-body">
              <h5 class="card-title mb-4"><i class="fas fa-filter"></i> Фільтри</h5>

              <div class="form-group">
                <label class="font-weight-bold small">Місто або район</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text bg-white"><i class="fas fa-search text-muted"></i></span>
                  </div>
                  <input v-model="searchCity" type="text" class="form-control border-left-0 pl-0"
                    placeholder="Напр. Київ">
                </div>
              </div>

              <div class="form-group mt-3">
                <label class="font-weight-bold small">Тип житла</label>
                <select v-model="searchType" class="form-control">
                  <option value="">Будь-який тип</option>
                  <option value="Квартира">Квартира</option>
                  <option value="Будинок">Будинок</option>
                  <option value="Студія">Студія</option>
                  <option value="Лофт">Лофт</option>
                </select>
              </div>

              <div class="form-group">
                 <label class="font-weight-bold small pb-2">ціна житла</label>
               <br>
                <label class="font-weight-bold small">від</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text bg-white"><i class="fas fa-search text-muted"></i></span>
                  </div>
                  <input v-model="priceFrom" type="number" class="form-control border-left-0 pl-0"
                    placeholder="1000">
                </div>
              </div>

              <div class="form-group">
                <label class="font-weight-bold small">до</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text bg-white"><i class="fas fa-search text-muted"></i></span>
                  </div>
                  <input v-model="priceTo" type="number" class="form-control border-left-0 pl-0"
                    placeholder="100000">
                </div>
              </div>

              <button class="btn btn-outline-danger btn-block mt-4" @click="resetFilters">Скинути фільтри</button>

<div class="form-group mt-3">
  <label class="font-weight-bold small">
    <i class="fas fa-search me-1"></i> Пошук по опису
  </label>
  <input 
    v-model="searchDescription" 
    type="text" 
    class="form-control" 
    placeholder="Напр. газова плита, укриття, паркінг...">
  <small class="text-muted">Шукає слова в описі оголошення</small>
</div>


            </div>
          </div>
        </div>

        <div class="col-lg-9">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="mb-0">Знайдено об'єктів: {{ filteredListings.length }}</h3>
          </div>

          <div v-if="paginatedListings.length > 0" class="row">
            <div class="col-md-6 col-xl-4 mb-4" v-for="item in paginatedListings" :key="item.id">
              <PropertyCard :property="item" :isFav="isFavorite(item.id)" @toggleFavorite="toggleFavorite"
                @openBooking="openModal" />
            </div>
          </div>

          <div v-else class="text-center py-5 bg-white rounded shadow-sm">
            <i class="fas fa-search-minus fa-3x text-muted mb-3"></i>
            <h4 class="text-muted">За вашим запитом нічого не знайдено</h4>
            <p>Спробуйте змінити параметри пошуку або скинути фільтри.</p>
          </div>

          <nav v-if="totalPages > 1" class="mt-4">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="currentPage--">Попередня</button>
              </li>
              <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                <button class="page-link" @click="currentPage = page">{{ page }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="currentPage++">Наступна</button>
              </li>
            </ul>
          </nav>
        </div>

      </div>
    </div>

    <div v-if="isModalOpen" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">Відправити запит власникові</h5>
            <button type="button" class="close text-white" @click="isModalOpen = false">&times;</button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="submitBooking">
              <div class="form-group">
                <label class="font-weight-bold">Об'єкт:</label>
                <input type="text" class="form-control bg-light" :value="selectedProperty?.title" readonly>
              </div>
              <div class="form-group">
                <label class="font-weight-bold">Ваше ім'я:</label>
                <input v-model="userName" type="text" class="form-control" required placeholder="Як до вас звертатися?">
              </div>
              <div class="form-group">
                <label class="font-weight-bold">Ваш телефон:</label>
                <input v-model="userPhone" type="text" class="form-control" required placeholder="+38 (000) 000-00-00">
              </div>
              <button type="submit" class="btn btn-success btn-block btn-lg mt-4">Надіслати заявку</button>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
// 1. Обов'язково додайте onMounted та watch
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios' // 2. Не забудьте імпортувати axios
import { usePropertyStore } from '../stores/propertyStores'
import PropertyCard from '../components/property/propertyCard.vue'
import { useAuthStore } from '../stores/authStore'


const authStore = useAuthStore()
const store = usePropertyStore()

const searchCity = ref('')
const searchType = ref('')
const searchDescription = ref('')
const currentPage = ref(1)
const itemsPerPage = 6

const isModalOpen = ref(false)
const selectedProperty = ref(null)
const priceFrom = ref(null)
const priceTo = ref(null)

// 3. ЗАВАНТАЖУЄМО ДАНІ ПРИ СТАРТІ СТОРІНКИ
onMounted(async () => {
  try {
    // Робимо запит до вашого FastAPI (перевірте, чи правильний шлях /api/listings)
    const response = await axios.get('http://localhost:8000/api/apartments')

    // Записуємо отримані дані в Сховище (переконайтеся, що масив називається listings)
    store.listings = response.data
  } catch (error) {
    console.error("Помилка завантаження квартир з бекенду:", error)
  }
})

// 4. Скидаємо сторінку на 1-шу, якщо користувач почав щось шукати (замість того, щоб робити це в computed)
watch([searchCity, searchType,priceTo,priceFrom,searchDescription], () => {
  currentPage.value = 1
})

const filteredListings = computed(() => {

  const data = store.listings || []

  return data.filter(item => {
    // Додаємо перевірку, чи взагалі існує item.city, щоб уникнути помилок TypeError
    const matchCity = searchCity.value === '' ||
      (item.city && item.city.toLowerCase().includes(searchCity.value.toLowerCase()))

    // Додаємо перевірку на 'Будь-який тип', бо він є у вас в HTML
    const matchType = searchType.value === '' ||
      searchType.value === 'Будь-який тип' ||
      item.type === searchType.value


      const matchDescription = searchDescription.value === '' ||
  (item.description && 
   item.description.toLowerCase().includes(searchDescription.value.toLowerCase()))




    const matchPriceFrom = !priceFrom.value || item.price >= priceFrom.value

    // Фільтр по ціні "ДО"
    const matchPriceTo = !priceTo.value || item.price <= priceTo.value

    return matchCity && matchType && matchPriceFrom && matchPriceTo&&matchDescription
    
  })
})

const paginatedListings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredListings.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredListings.value.length / itemsPerPage)
})

const resetFilters = () => {
  searchCity.value = ''
  searchType.value = ''
  priceTo.value=''
  priceFrom.value=''
  searchDescription=''
}

const scrollToCatalog = () => {
  document.getElementById('catalogSection').scrollIntoView({ behavior: 'smooth' })
}

const openModal = (property) => {
  selectedProperty.value = property
  isModalOpen.value = true
}
const priceFilter =computed(()=>{



}
)
//-----------------------------------------------------------------
const favoriteIds = ref([])

// 2. ФУНКЦІЯ ПЕРЕВІРКИ (Саме її зараз шукає і не може знайти Vue!)
const isFavorite = (id) => favoriteIds.value.includes(id)
// Завантажуємо список улюблених при відкритті сторінки
const loadFavorites = async () => {
  // Завантажуємо тільки якщо це авторизований орендар
  if (!authStore.user?.role === 'admin') {
    try {
      const response = await axios.get('http://localhost:8000/api/apartments/favorites', {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      // Зберігаємо тільки ID цих квартир
      favoriteIds.value = response.data.map(apt => apt.id)
    } catch (error) {
      console.error("Не вдалося завантажити вподобайки:", error)
    }
  }
}

// Функція при натисканні на сердечко
const toggleFavorite = async (apartmentId) => {
  // Якщо не авторизований або не орендар - нічого не робимо (або можна показати alert)
 

  // Перевіряємо, чи ця квартира ВЖЕ в улюблених
  const isFavorite = favoriteIds.value.includes(apartmentId)

  try {
    if (isFavorite) {
      // Якщо вже є - ВИДАЛЯЄМО
      await axios.delete(`http://localhost:8000/api/apartments/favorites/${apartmentId}`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      // Прибираємо ID з масиву, щоб сердечко відразу стало порожнім
      favoriteIds.value = favoriteIds.value.filter(id => id !== apartmentId)
    } else {
      // Якщо немає - ДОДАЄМО
      await axios.post(`http://localhost:8000/api/apartments/favorites/${apartmentId}`, {}, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      // Додаємо ID в масив, щоб сердечко відразу стало червоним
      favoriteIds.value.push(apartmentId)
    }
  } catch (error) {
    console.error("Помилка зміни статусу вподобайки:", error)
    alert("Щось пішло не так!")
  }
}

// Викликаємо функцію завантаження при старті сторінки (разом з вашим завантаженням квартир)
onMounted(() => {
  loadFavorites()

  const submitBooking = () => {
    alert(`Дякуємо, ${userName.value}! Заявка на об'єкт "${selectedProperty.value.title}" відправлена. Власник зателефонує вам на номер ${userPhone.value}.`)
    isModalOpen.value = false
    userName.value = ''
    userPhone.value = ''
  }
})
</script>