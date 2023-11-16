import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast, { POSITION } from 'vue-toastification'
import type { PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const options: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 4000
}

app.use(createPinia())
app.use(router)
app.use(Toast, options)
app.mount('#app')
