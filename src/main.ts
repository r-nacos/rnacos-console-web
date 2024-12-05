import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import i18n from './i18n';
import router from '@/route/router.js';

const app = createApp(App);
const pinia = createPinia();
app.use(i18n);
app.use(router);
app.use(pinia);
app.mount('#app');
