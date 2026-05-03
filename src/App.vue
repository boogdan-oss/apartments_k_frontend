<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
      <router-link to="/" class="navbar-brand"><i class="fas fa-home text-success"></i> ТвійДім</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div v-if="authStore.isAuthenticated && authStore.user" class="d-flex align-items-center me-3 text-light">
        <i class="fas fa-user-circle fa-lg me-2"></i> <span class="font-weight-bold">
          {{ authStore.user.name }} {{ authStore.user.surname }}
        </span>
      </div>
      <div class="d-flex align-items-center gap-3 ms-auto">

        <template v-if="!authStore.isAuthenticated">
          <router-link to="/login" class="nav-link text-success">Увійти</router-link>
          <router-link to="/register" class="btn btn-success auth-btn">Реєстрація</router-link>
        </template>
        <button @click="authStore.logout()" class="btn btn-outline-danger btn-sm">
          Вийти
        </button>

        <router-link v-if="authStore.isAuthenticated " to="/profile"
          class="nav-link text-primary fw-bold me-3 d-flex align-items-center">
          <i class="fas fa-user-circle fs-5 me-1"></i>
          <span>Профіль ({{ authStore.user?.name }})</span>
        </router-link>

        <template>
          <div v-if="authStore.user" class="text-light">
            <i class="fas fa-user-circle me-1"></i>
          </div>
          <button v-if="authStore.isAuthenticated" @click="authStore.logout()" class="btn btn-outline-danger btn-sm">
            Вийти
          </button>
        </template>

        <router-link v-if="authStore.isAuthenticated " to="/add-listing"
          class="nav-link text-warning font-weight-bold">
          Розмістити оголошення
        </router-link>
        <!-- Кнопка "База даних", яку бачить ТІЛЬКИ admin -->
        <a v-if="authStore.user?.role === 'admin'" href="http://localhost:8000/admin" target="_blank"
          class="nav-link text-danger fw-bold me-3">
          <i class="fas fa-database"></i> База даних (SQLAdmin)
        </a>

      </div>
    </nav>

    <router-view />

    <footer class="bg-dark text-white py-5 mt-auto">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-4 mb-md-0">
            <h5 class="font-weight-bold"><i class="fas fa-home text-success"></i> ТвійДім</h5>
            <p class="text-muted small mt-3 pr-md-4">Ваш надійний партнер у пошуку ідеального житла для оренди по всій
              Україні.</p>
          </div>
          <div class="col-md-4 mb-4 mb-md-0">
            <h5 class="font-weight-bold mb-3">Навігація</h5>
            <ul class="list-unstyled text-muted small">
              <li class="mb-2"><router-link to="/" class="text-muted text-decoration-none">Головна
                  сторінка</router-link></li>

            </ul>
          </div>
          <div class="col-md-4">
            <h5 class="font-weight-bold mb-3">Контакти</h5>
            <ul class="list-unstyled text-muted small">
              <li class="mb-2"><i class="fas fa-phone-alt mr-2"></i> +38 (099) 123-45-67</li>
              <li class="mb-2"><i class="fas fa-envelope mr-2"></i> support@tviydim.ua</li>
            </ul>
          </div>
        </div>
        <div class="row mt-4 pt-4 border-top border-secondary text-center">
          <div class="col-12">
            <p class="small text-muted mb-0">&copy; 2026 ТвійДім. Всі права захищені.</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/authStore'

const authStore = useAuthStore()


onMounted(() => {
  authStore.fetchUser()
})
</script>

<style>
body {
  padding-top: 56px;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}


#app {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

footer {
  
  padding: 10px 0; /* Зробіть його меншим */
  background-color: #333; 
  /* ... ваші інші стилі ... */
}
</style>