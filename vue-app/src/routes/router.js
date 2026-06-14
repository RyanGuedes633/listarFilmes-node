import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import SeriesPage from '../pages/SeriesPage.vue'
import CreateMoviePage from '../pages/CreateMoviePage.vue'
import CreateActorPage from '../pages/CreateActorPage.vue'
import SeriesDetailPage from '../pages/SeriesDetailPage.vue'
import ActorDetailsPage from '../pages/ActorDetailsPage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/series', name: 'series', component: SeriesPage },
  { path: '/serie/:id', name: 'series-detail', component: SeriesDetailPage },
  { path: '/ator/:id', name: 'actor-detail', component: ActorDetailsPage },
  { path: '/criar-serie', name: 'create-movie', component: CreateMoviePage },
  { path: '/criar-ator', name: 'create-actor', component: CreateActorPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
