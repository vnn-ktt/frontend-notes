import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)

axios.defaults.baseURL = 'https://3e9c5176b02cf678.mokky.dev'
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

app.mount('#app')
