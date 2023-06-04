import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { createRouter, createWebHistory } from 'vue-router'
import HomeViewVue from './views/HomeView.vue'
import LapViewVue from './views/LapView.vue'
import AboutViewVue from './views/AboutView.vue'

loadFonts()

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    { path: '/', component: HomeViewVue },
    { path: '/lap', component: LapViewVue },
    { path: '/about', component: AboutViewVue }
  ]
})

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
