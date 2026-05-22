import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import SeriesPage from './pages/SeriesPage.vue'
import CreateMoviePage from './pages/CreateMoviePage.vue'
import CreateActorPage from './pages/CreateActorPage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/series', name: 'series', component: SeriesPage },
  { path: '/criar-serie', name: 'create-movie', component: CreateMoviePage },
  { path: '/criar-ator', name: 'create-actor', component: CreateActorPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
