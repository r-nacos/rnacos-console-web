import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/route/router.js'
import MenuNode from '@/components/MenuNode'

const app = createApp(App);
app.use(router)
app.component('MenuNode',MenuNode)
app.mount('#app')
