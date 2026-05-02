<!-- <template>
  <div class="container mt-4 mb-5">
    <h2 class="mb-4 text-primary"><i class="fas fa-user-shield"></i> Панель Адміністратора</h2>

    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'apartments' }" @click="activeTab = 'apartments'">
          <i class="fas fa-building"></i> Оголошення
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">
          <i class="fas fa-users"></i> Користувачі
        </button>
      </li>
    </ul>

    <div v-if="activeTab === 'apartments'">

      <div v-if="editingApartment" class="card border-warning mb-4 shadow-sm">
        <div class="card-header bg-warning text-dark fw-bold">
          Редагування оголошення #{{ editingApartment.id }}
        </div>
        <div class="card-body">
          <form @submit.prevent="saveApartment">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Заголовок</label>
                <input type="text" v-model="editingApartment.title" class="form-control" required>
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label">Ціна (грн)</label>
                <input type="number" v-model="editingApartment.price" class="form-control" required>
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label">Статус</label>
                <select v-model="editingApartment.status" class="form-select">
                  <option value="active">Активно</option>
                  <option value="hidden">Приховано</option>
                  <option value="blocked">Заблоковано</option>
                </select>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-success"><i class="fas fa-save"></i> Зберегти</button>
              <button type="button" class="btn btn-secondary" @click="editingApartment = null">Скасувати</button>
            </div>
          </form>
        </div>
      </div>

      <div class="table-responsive shadow-sm rounded">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Заголовок</th>
              <th>Власник (ID)</th>
              <th>Ціна</th>
              <th>Статус</th>
              <th class="text-end">Дії</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="apt in apartments" :key="apt.id">
              <td>{{ apt.id }}</td>
              <td>{{ apt.title }}</td>
              <td>{{ apt.owner_id }}</td>
              <td>{{ apt.price }} грн</td>
              <td>
                <span class="badge" :class="apt.status === 'active' ? 'bg-success' : 'bg-danger'">
                  {{ apt.status }}
                </span>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-2" @click="openEditApartment(apt)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteApartment(apt.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeTab === 'users'">

      <div v-if="editingUser" class="card border-warning mb-4 shadow-sm">
        <div class="card-header bg-warning text-dark fw-bold">
          Редагування користувача #{{ editingUser.id }}
        </div>
        <div class="card-body">
          <form @submit.prevent="saveUser">
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Ім'я</label>
                <input type="text" v-model="editingUser.name" class="form-control" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Прізвище</label>
                <input type="text" v-model="editingUser.surname" class="form-control" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Роль</label>
                <select v-model="editingUser.role" class="form-select">
                  <option value="tenant">Орендар</option>
                  <option value="owner">Власник</option>
                  <option value="admin">Адміністратор</option>
                </select>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-success"><i class="fas fa-save"></i> Зберегти</button>
              <button type="button" class="btn btn-secondary" @click="editingUser = null">Скасувати</button>
            </div>
          </form>
        </div>
      </div>

      <div class="table-responsive shadow-sm rounded">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>ПІБ</th>
              <th>Телефон / Email</th>
              <th>Роль</th>
              <th class="text-end">Дії</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }} {{ user.surname }}</td>
              <td>{{ user.phone_number }} <br> <small class="text-muted">{{ user.email }}</small></td>
              <td>
                <span class="badge bg-secondary">{{ user.role }}</span>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-2" @click="openEditUser(user)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteUser(user.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <td v-if="apt.status === 'pending'">
          <button class="btn btn-sm btn-success me-1" @click="approveApartment(apt.id)">Схвалити</button>
          <button class="btn btn-sm btn-danger" @click="rejectApartment(apt.id)">Відхилити</button>
        </td>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()

// --- СТАН ДОДАТКУ ---
const activeTab = ref('apartments')
const apartments = ref([])
const users = ref([])

const editingApartment = ref(null)
const editingUser = ref(null)

// --- ФУНКЦІЇ ЗАВАНТАЖЕННЯ ДАНИХ ---
const loadApartments = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/apartments/')
    apartments.value = res.data
  } catch (e) {
    console.error("Помилка завантаження оголошень:", e)
  }
}

const loadUsers = async () => {
  try {
    // Вкажіть правильний маршрут бекенда для отримання всіх користувачів!
    const res = await axios.get('http://localhost:8000/api/auth/users', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    users.value = res.data
  } catch (e) {
    console.error("Помилка завантаження користувачів:", e)
  }
}

// Завантажуємо все при відкритті сторінки
onMounted(() => {
  loadApartments()
  loadUsers()
})

// --- ЛОГІКА ОГОЛОШЕНЬ ---
const openEditApartment = (apt) => {
  editingApartment.value = { ...apt }
}

const saveApartment = async () => {
  try {
    const res = await axios.put(`http://localhost:8000/api/apartments/${editingApartment.value.id}`, editingApartment.value, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    const index = apartments.value.findIndex(a => a.id === editingApartment.value.id)
    if (index !== -1) apartments.value[index] = res.data
    editingApartment.value = null
    alert("Оголошення оновлено!")
  } catch (e) {
    alert("Помилка оновлення оголошення.")
  }
}

const deleteApartment = async (id) => {
  if (!confirm("Ви впевнені, що хочете видалити це оголошення?")) return
  try {
    await axios.delete(`http://localhost:8000/api/apartments/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    apartments.value = apartments.value.filter(a => a.id !== id)
  } catch (e) {
    alert("Помилка видалення.")
  }
}

// --- ЛОГІКА КОРИСТУВАЧІВ ---
const openEditUser = (user) => {
  editingUser.value = { ...user }
}

const saveUser = async () => {
  try {
    // Вкажіть правильний PUT маршрут для оновлення користувача
    const res = await axios.put(`http://localhost:8000/api/auth/users/${editingUser.value.id}`, editingUser.value, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    const index = users.value.findIndex(u => u.id === editingUser.value.id)
    if (index !== -1) users.value[index] = res.data
    editingUser.value = null
    alert("Користувача оновлено!")
  } catch (e) {
    alert("Помилка оновлення користувача.")
  }
}

const deleteUser = async (id) => {
  if (!confirm("Ви впевнені, що хочете видалити цього користувача?")) return
  try {
    await axios.delete(`http://localhost:8000/api/auth/users/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    users.value = users.value.filter(u => u.id !== id)
  } catch (e) {
    alert("Помилка видалення.")
  }
}
</script>

<style scoped>
.nav-tabs .nav-link {
  cursor: pointer;
  color: #495057;
}

.nav-tabs .nav-link.active {
  font-weight: bold;
  color: #0d6efd;
}
</style> -->


<template>
  <div class="container mt-4 mb-5">
    <h2 class="mb-4 text-primary"><i class="fas fa-user-shield"></i> Панель Адміністратора</h2>

    <!-- Навігація по вкладках -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'apartments' }" @click="activeTab = 'apartments'">
          <i class="fas fa-building"></i> Оголошення
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">
          <i class="fas fa-users"></i> Користувачі
        </button>
      </li>
    </ul>

    <!-- ========================================== -->
    <!-- ВКЛАДКА 1: ОГОЛОШЕННЯ (КВАРТИРИ)           -->
    <!-- ========================================== -->
    <div v-if="activeTab === 'apartments'">
      
      <!-- Форма редагування квартири -->
      <div v-if="editingApartment" class="card border-warning mb-4 shadow-sm">
        <div class="card-header bg-warning text-dark fw-bold">
          Редагування оголошення #{{ editingApartment.id }}
        </div>
        <div class="card-body">
          <form @submit.prevent="saveApartment">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Заголовок</label>
                <input type="text" v-model="editingApartment.title" class="form-control" required>
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label">Ціна (грн)</label>
                <input type="number" v-model="editingApartment.price" class="form-control" required>
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label">Статус</label>
                <select v-model="editingApartment.status" class="form-select">
                  <option value="active">Активно</option>
                  <option value="pending">На перевірці</option>
                  <option value="banned">Заблоковано</option>
                </select>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-success"><i class="fas fa-save"></i> Зберегти</button>
              <button type="button" class="btn btn-secondary" @click="editingApartment = null">Скасувати</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Таблиця оголошень -->
      <div class="table-responsive shadow-sm rounded">
        <table class="table table-hover align-middle mb-0 bg-white">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Заголовок</th>
              <th>Власник (ID)</th>
              <th>Ціна</th>
              <th>Статус</th>
              <th class="text-end">Дії</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="apt in apartments" :key="apt.id">
              <td>{{ apt.id }}</td>
              <td>{{ apt.title }}</td>
              <td>{{ apt.owner_id }}</td>
              <td>{{ apt.price }} грн</td>
              
              <!-- Кольорові статуси -->
              <td>
                <span class="badge" :class="{
                  'bg-success': apt.status === 'active',
                  'bg-warning text-dark': apt.status === 'pending',
                  'bg-danger': apt.status === 'banned'
                }">
                  {{ apt.status === 'active' ? 'Активно' : apt.status === 'pending' ? 'На перевірці' : 'Заблоковано' }}
                </span>
              </td>
              
              <!-- Кнопки дій -->
              <td class="text-end" style="min-width: 150px;">
                <!-- Швидкі кнопки модерації (показуються тільки для pending) -->
                <button v-if="apt.status === 'pending'" class="btn btn-sm btn-success me-1" @click="changeApartmentStatus(apt, 'active')" title="Схвалити">
                  <i class="fas fa-check"></i>
                </button>
                <button v-if="apt.status === 'pending'" class="btn btn-sm btn-dark me-3" @click="changeApartmentStatus(apt, 'banned')" title="Відхилити/Заблокувати">
                  <i class="fas fa-ban"></i>
                </button>

                <!-- Стандартні кнопки редагування та видалення -->
                <button class="btn btn-sm btn-outline-primary me-1" @click="openEditApartment(apt)" title="Редагувати">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteApartment(apt.id)" title="Видалити">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="apartments.length === 0">
              <td colspan="6" class="text-center py-4 text-muted">Оголошень поки немає</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- ВКЛАДКА 2: КОРИСТУВАЧІ                     -->
    <!-- ========================================== -->
    <div v-if="activeTab === 'users'">
      
      <!-- Форма редагування користувача -->
      <div v-if="editingUser" class="card border-warning mb-4 shadow-sm">
        <div class="card-header bg-warning text-dark fw-bold">
          Редагування користувача #{{ editingUser.id }}
        </div>
        <div class="card-body">
          <form @submit.prevent="saveUser">
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Ім'я</label>
                <input type="text" v-model="editingUser.name" class="form-control" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Прізвище</label>
                <input type="text" v-model="editingUser.surname" class="form-control" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Роль</label>
                <select v-model="editingUser.role" class="form-select">
                  <option value="tenant">Орендар</option>
                  <option value="owner">Власник</option>
                  <option value="admin">Адміністратор</option>
                </select>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-success"><i class="fas fa-save"></i> Зберегти</button>
              <button type="button" class="btn btn-secondary" @click="editingUser = null">Скасувати</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Таблиця користувачів -->
      <div class="table-responsive shadow-sm rounded">
        <table class="table table-hover align-middle mb-0 bg-white">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>ПІБ</th>
              <th>Телефон / Email</th>
              <th>Роль</th>
              <th class="text-end">Дії</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }} {{ user.surname }}</td>
              <td>{{ user.phone_number }} <br> <small class="text-muted">{{ user.email }}</small></td>
              <td>
                <span class="badge bg-secondary">{{ user.role }}</span>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-2" @click="openEditUser(user)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteUser(user.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/authStore' // Перевірте свій шлях!

const authStore = useAuthStore()

// --- СТАН ДОДАТКУ ---
const activeTab = ref('apartments')
const apartments = ref([])
const users = ref([])

const editingApartment = ref(null)
const editingUser = ref(null)

// --- ФУНКЦІЇ ЗАВАНТАЖЕННЯ ДАНИХ ---
const loadApartments = async () => {
  try {
    // Зверніть увагу: Щоб адмін бачив УСІ квартири (включаючи pending), 
    // можливо вам треба буде створити окремий роут на бекенді, наприклад /api/apartments/all
    // Якщо у вас поки працює стандартний роут - залишайте його.
    const res = await axios.get('http://localhost:8000/api/apartments/', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    apartments.value = res.data
  } catch (e) {
    console.error("Помилка завантаження оголошень:", e)
  }
}

const loadUsers = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/auth/users', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    users.value = res.data
  } catch (e) {
    console.error("Помилка завантаження користувачів:", e)
  }
}

// Завантажуємо все при відкритті сторінки
onMounted(() => {
  if (authStore.user?.role === 'admin') {
    loadApartments()
    loadUsers()
  } else {
    alert("Доступ заборонено!")
  }
})

// --- ЛОГІКА ОГОЛОШЕНЬ ---
const openEditApartment = (apt) => {
  editingApartment.value = { ...apt }
}

const saveApartment = async () => {
  try {
    const res = await axios.put(`http://localhost:8000/api/apartments/${editingApartment.value.id}`, editingApartment.value, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    const index = apartments.value.findIndex(a => a.id === editingApartment.value.id)
    if (index !== -1) apartments.value[index] = res.data
    editingApartment.value = null
  } catch (e) {
    alert("Помилка оновлення оголошення.")
    console.error(e)
  }
}

// Функція швидкої зміни статусу
const changeApartmentStatus = async (apt, newStatus) => {
  const actionText = newStatus === 'active' ? 'схвалити' : 'заблокувати';
  if (!confirm(`Ви впевнені, що хочете ${actionText} це оголошення?`)) return;

  try {
    const updatedApt = { ...apt, status: newStatus };
    const res = await axios.put(`http://localhost:8000/api/apartments/${apt.id}`, updatedApt, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    
    const index = apartments.value.findIndex(a => a.id === apt.id);
    if (index !== -1) {
      apartments.value[index] = res.data;
    }
  } catch (error) {
    console.error("Помилка зміни статусу:", error);
    alert("Не вдалося змінити статус. Перевірте консоль.");
  }
}

const deleteApartment = async (id) => {
  if (!confirm("Ви впевнені, що хочете видалити це оголошення?")) return
  try {
    await axios.delete(`http://localhost:8000/api/apartments/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    apartments.value = apartments.value.filter(a => a.id !== id)
  } catch (e) {
    alert("Помилка видалення оголошення.")
    console.error(e)
  }
}

// --- ЛОГІКА КОРИСТУВАЧІВ ---
const openEditUser = (user) => {
  editingUser.value = { ...user }
}

const saveUser = async () => {
  try {
    const res = await axios.put(`http://localhost:8000/api/auth/users/${editingUser.value.id}`, editingUser.value, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    const index = users.value.findIndex(u => u.id === editingUser.value.id)
    if (index !== -1) users.value[index] = res.data
    editingUser.value = null
  } catch (e) {
    alert("Помилка оновлення користувача.")
    console.error(e)
  }
}

const deleteUser = async (id) => {
  if (!confirm("Ви впевнені, що хочете видалити цього користувача?")) return
  try {
    await axios.delete(`http://localhost:8000/api/auth/users/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    users.value = users.value.filter(u => u.id !== id)
  } catch (e) {
    alert("Помилка видалення користувача.")
    console.error(e)
  }
}
</script>

<style scoped>
.nav-tabs .nav-link {
  cursor: pointer;
  color: #495057;
  border-radius: 0;
}
.nav-tabs .nav-link.active {
  font-weight: bold;
  color: #0d6efd;
  border-bottom: 2px solid #0d6efd;
}
</style>