import './index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from './fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import Vue3SocialSharingPlugin from 'vue3-social-sharing'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import i18n from './i18n'

const app = createApp(App)

axios.defaults.baseURL = 'http://127.0.0.1:8000/api'

library.add(fas, fab)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(Vue3SocialSharingPlugin)
app.component('font-awesome-icon', FontAwesomeIcon)

const authStore = useAuthStore()
authStore.initialize().then(() => {
  app.mount('#app')
})
