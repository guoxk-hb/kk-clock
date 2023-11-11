import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect:"/electronic",
    },
    {
      path: '/electronic',
      name: 'electronic',
      component:() => import('@/views/clock/electronic.vue'),
    },
    {
      path: '/particle',
      name: 'particle',
      component:() => import('@/views/clock/particle.vue'),
    },
    {
      path: '/notepad',
      name: 'notepad',
      component: () => import('@/views/notepad.vue'),
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('@/views/setting.vue'),
    }
  ]
})

export default router
