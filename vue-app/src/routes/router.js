import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import SeriesPage from '../pages/SeriesPage.vue'
import CreateMoviePage from '../pages/CreateMoviePage.vue'
import CreateActorPage from '../pages/CreateActorPage.vue'
import SeriesDetailPage from '../pages/SeriesDetailPage.vue'
import ActorDetailsPage from '../pages/ActorDetailsPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/series', name: 'series', component: SeriesPage },
  { path: '/serie/:id', name: 'series-detail', component: SeriesDetailPage },
  { path: '/ator/:id', name: 'actor-detail', component: ActorDetailsPage },
  { path: '/criar-serie', name: 'create-movie', component: CreateMoviePage },
  { path: '/criar-ator', name: 'create-actor', component: CreateActorPage },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/cadastro', name: 'register', component: RegisterPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Protege rotas: exige login para todas, exceto /login e /cadastro
router.beforeEach((to) => {
  const publicPaths = ['/login', '/cadastro']
  const user = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_user') : null
  const isLogged = !!user
  if (!isLogged && !publicPaths.includes(to.path)) {
    return { name: 'login' }
  }
  if (isLogged && publicPaths.includes(to.path)) {
    return { name: 'home' }
  }
})
