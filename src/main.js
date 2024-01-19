// main.js

import { createApp } from 'vue';
import App from './App.vue';
import './styles.css'; // Import Tailwind CSS
import axios from 'axios';

// Set the base URL for your API
axios.defaults.baseURL = 'http://127.0.0.1:8000';

const app = createApp(App);
app.config.globalProperties.$axios = axios;

app.mount('#app');
