import { createRouter, createWebHistory } from 'vue-router'
import electronic from '@/views/electronic.vue'
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
      component:() => import('@/views/electronic.vue'),
    },
    {
      path: '/notepad',
      name: 'notepad',
      component: () => import('@/views/notepad.vue'),
      props:{default:true,sidebar:false}
    }
  ]
})

export default router
