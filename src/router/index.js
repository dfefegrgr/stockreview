import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/dapan',
        name: 'dapan',
        component: () => import('../views/Dapan.vue')
    },
    {
        path: '/serch',
        name: 'serch',
        component: () => import('../views/serch.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
