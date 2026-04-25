import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/MainPage.vue'
import Login from '../views/LoginPage.vue'
import Register from '../views/RegisterPage.vue'
import AddListing from '../views/AddListing.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/add-listing',
      name: 'add-listing',
      component: AddListing
    }
  ]
})

export default router