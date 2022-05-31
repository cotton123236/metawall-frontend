import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import router from './router/router'

// App
import App from './App.vue'


const app = createApp(App)

app
  .use(VueCookies)
  .use(createPinia())
  .use(VueAxios, axios)
  .use(router)
  .provide('axios', app.config.globalProperties.axios)

app.mount('#app')
