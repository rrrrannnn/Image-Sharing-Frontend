import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import Home from './views/Home.vue'
import MyImages from './views/MyImages.vue'
import Login from './views/Login.vue'
import PictureDetail from './views/PictureDetail.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/my-images', component: MyImages },
  { path: '/login', component: Login },
  { path: '/picture/:id', component: PictureDetail }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')

