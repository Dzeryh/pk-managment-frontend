import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' },
    },
  ],
});

/**
 * Garde globale : la session est restaurée UNE fois (status « idle »), puis le
 * routeur décide. Aucun écran protégé n'est affiché avant la réponse de
 * `/auth/refresh`, ce qui évite un flash de contenu puis une redirection.
 */
router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (auth.status === 'idle') {
    await auth.restore();
  }

  if (to.meta.requiresAuth === true && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'home' };
  }

  return true;
});

export default router;
