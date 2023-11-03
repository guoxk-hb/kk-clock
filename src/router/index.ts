import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect:"/electron",
    },
    {
      path: '/electron',
      name: 'electron',
      component:() => import('@/views/clock/electronic.vue'),
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
