import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/MainPage.vue";
import Login from "../views/LoginPage.vue";
import Register from "../views/RegisterPage.vue";
import AddListing from "../views/AddListing.vue";
import AdminPage from "../views/AdminPage.vue";
import profilePage from "../views/profilePage.vue";
import editListing from "../views/editListing.vue";
import contractPage from "../views/contractPage.vue";
import TermsPage from "../views/TermsPage.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/add-listing",
      name: "add-listing",
      component: AddListing,
    },
    {
      path: "/admin",
      name: "AdminPage",
      component: AdminPage,
    },
    {
      path: "/profile",
      name: "Profile",
      component: profilePage,
    },
    {
      path: "/edit-listing/:id",
      name: "EditListing",
      component: () => import("../views/editListing.vue"),
    },
    // Додайте це до масиву routes:
    {
      path: "/property/:id", // :id означає, що тут буде динамічна цифра
      name: "Details",
      component: () => import("../views/Details.vue"),
    },
    { path: "/create-contract/:id", component: contractPage },
    {
    path: '/terms',
    name: 'Terms',
    component: TermsPage
  }
  ],
});

export default router;
