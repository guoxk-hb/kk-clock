import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect:"/clock",
    },
    {
      path: '/clock',
      name: 'clock',
      component:() => import('@/views/clock.vue'),
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
