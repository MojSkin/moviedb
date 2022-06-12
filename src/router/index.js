import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '../components/Homepage.vue'
import MovieDetail from '../components/MovieDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Homepage
    },
    {
      path: '/movie/:id/:slug',
      name: 'movie',
      component: MovieDetail
    }
  ]
})

export default router
