<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top main-nav">
      <div class="container">
        <!-- Логотип -->
        <router-link to="/" class="navbar-brand d-flex align-items-center">
          <i class="fas fa-home text-success me-2 fs-3"></i>
          <span class="fw-bold tracking-tight">Твій<span class="text-success">Дім</span></span>
        </router-link>

        <!-- Кнопка мобільного меню -->
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <!-- Ліва частина (Основні посилання) -->
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to="/" class="nav-link" active-class="active">Головна</router-link>
            </li>
            <li v-if="authStore.isAuthenticated" class="nav-item">
              <router-link to="/add-listing" class="nav-link text-warning fw-medium">
                <i class="fas fa-plus-circle me-1"></i>Розмістити оголошення
              </router-link>
            </li>
          </ul>

          <!-- Права частина (Авторизація / Профіль) -->
          <div class="d-flex align-items-center gap-2">
            
            <!-- Якщо НЕ авторизований -->
            <template v-if="!authStore.isAuthenticated">
              <router-link to="/login" class="btn btn-link text-light text-decoration-none">Увійти</router-link>
              <router-link to="/register" class="btn btn-success px-4 rounded-pill shadow-sm">Реєстрація</router-link>
            </template>

            <!-- Якщо авторизований -->
            <template v-else>
              <!-- Адмін панель окремою кнопкою -->
              <a v-if="authStore.user?.role === 'admin'" 
                 href="http://localhost:8000/admin" 
                 target="_blank"
                 class="btn btn-outline-danger btn-sm me-2">
                <i class="fas fa-lock me-1"></i> Адмін
              </a>

              <!-- Випадаюче меню профілю -->
              <div class="dropdown">
                <button class="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2 rounded-pill px-3" 
                        type="button" 
                        id="userMenu" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false">
                  <i class="fas fa-user-circle fs-5"></i>
                  <span>{{ authStore.user?.name || 'Профіль' }}</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow-lg mt-2 border-0" aria-labelledby="userMenu">
                  <li>
                    <router-link class="dropdown-item py-2" to="/profile">
                      <i class="fas fa-id-card me-2 text-muted"></i>Мій профіль
                    </router-link>
                  </li>
                 
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <button @click="authStore.logout()" class="dropdown-item py-2 text-danger">
                      <i class="fas fa-sign-out-alt me-2"></i>Вийти
                    </button>
                  </li>
                </ul>
              </div>
            </template>

          </div>
        </div>
      </div>
    </nav>

    <router-view />

    <footer class="bg-dark text-white py-3 mt-2">
      <div class="container">
        <div class="row text-center">
 
          <div class="col-md-4 mb-3 mb-0">
            <h6 class="fw-bold"><i class="fas fa-home text-success"></i> ТвійДім</h6>
            <p class="text small mt-2">Ваш надійний партнер у пошуку ідеального житла для оренди по всій Україні.</p>
            <router-link to="/terms" class="text small text-decoration-none">
              <i class="fas fa-file-alt me-1"></i> Правила сервісу
            </router-link>
          </div>
 
          <div class="col-md-4 mb-3 mb-md-0">
            <h6 class="fw-bold mb-2">Навігація</h6>
            <ul class="list-unstyled text-muted small">
              <li class="mb-1">
                <router-link to="/" class="text text-decoration-none">Головна сторінка</router-link>
              </li>
            </ul>
          </div>
 
          <div class="col-md-4">
            <h6 class="fw-bold mb-2">Контакти</h6>
            <ul class="list-unstyled text small">
              <li class="mb-1"><i class="fas fa-phone-alt me-1"></i> +38 (099) 123-45-67</li>
              
              <!-- ✅ Додано контакт -->
              <li class="mb-1">
                <i class="fab fa-telegram me-1 text-info"></i>
                Ткачук Богдан —
                <a href="https://t.me/Bbogdanchickk" target="_blank" class="text-info text-decoration-none">@Bbogdanchickk</a>
              </li>
              <li class="mb-1"><i class="fas fa-phone-alt me-1"></i> Група ПІ-232</li>
            </ul>
          </div>
 
        </div>
 
        <div class="row mt-3 pt-2 border-top border-secondary text-center">
          <div class="col-12">
            <p class="small text mb-0">&copy; 2026 ТвійДім. Всі права захищені.</p>
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
  text-decoration-color:aliceblue;
  
}
</style>