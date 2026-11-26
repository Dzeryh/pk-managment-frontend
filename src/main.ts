import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { SESSION_EXPIRED_EVENT } from './api/http';
import { i18n } from './i18n';
import router from './router';
import { useAuthStore } from './stores/auth';
import './assets/styles.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(i18n);
app.use(router);

// Le client HTTP prévient quand la rotation a échoué : on nettoie l'état local
// et on renvoie vers la connexion, sans laisser un écran vide.
window.addEventListener(SESSION_EXPIRED_EVENT, () => {
  const auth = useAuthStore(pinia);
  auth.forceLogout();
  void router.replace({ name: 'login' });
});

app.mount('#app');
