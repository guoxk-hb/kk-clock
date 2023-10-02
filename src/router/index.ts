import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import electronic from '@/views/electronic.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'electron',
      component:electronic,
    },
    {
      path: '/notepad',
      name: 'notepad',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/notepad.vue'),
      props:{default:true,sidebar:false}
    }
  ]
})

export default router
