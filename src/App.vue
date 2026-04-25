<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
      <router-link to="/" class="navbar-brand"><i class="fas fa-home text-success"></i> ТвійДім</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Головна</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link text-success font-weight-bold">Увійти</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/register" class="btn btn-success btn-sm mt-1 ms-2">Реєстрація</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/" class="nav-link">Головна</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/add-listing" class="nav-link text-warning font-weight-bold">
              <i class="fas fa-plus"></i> Розмістити оголошення
            </router-link>
          </li>
        </ul>
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
              <li class="mb-2"><a href="#" class="text-success text-decoration-none">Розмістити оголошення</a></li>
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

<style>
/* Компенсуємо висоту меню (navbar fixed-top) */
body {
  padding-top: 56px;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Якщо ви хочете, щоб футер завжди був притиснутий до низу сторінки */
#app {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>