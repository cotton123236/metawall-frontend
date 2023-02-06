import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import router from './router/router'
import AOS from 'aos'
import 'aos/dist/aos.css'
// App
import App from './App.vue'
// FontAwesomeIcon

const app = createApp(App)
const aos = AOS.init({
  duration: 600,
  once: true
})

app
  .use(VueCookies)
  .use(createPinia())
  .use(VueAxios, axios)
  .use(router)
  .provide('axios', app.config.globalProperties.axios)
  .provide('aos', aos)

app.mount('#app')
