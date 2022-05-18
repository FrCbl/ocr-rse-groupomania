import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UsersView from '../views/UsersView.vue'
import ProfileView from '../views/ProfileView.vue'
import SignupView from '../views/SignupView.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Accueil',
    component: HomeView
  },
  {
    path: '/signup',
    name: 'Inscription',
    component: SignupView
  },
  {
    path: '/users',
    name: 'Users',
    component: UsersView
  },
  {
    path: '/profile/:userId',
    name: 'Profil',
    component: ProfileView
  },
  // 404
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
