import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@/assets/tailwind.css'

import 'default-passive-events'

import App from '@/views/menu.vue'
import router from './router'
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
