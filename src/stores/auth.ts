import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import * as authApi from '../api/auth.api';
import { setAccessToken } from '../api/token';
import type { AuthResponse, User } from '../types/auth';
import { describeError } from '../utils/api-error';
import { getDeviceId } from '../utils/device';

export type AuthStatus = 'idle' | 'restoring' | 'loading' | 'authenticated' | 'anonymous';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const status = ref<AuthStatus>('idle');
  const errorMessage = ref<string | null>(null);

  const isAuthenticated = computed(() => user.value !== null);
  const displayName = computed(() => user.value?.fullName ?? '');

  function apply(response: AuthResponse): void {
    setAccessToken(response.accessToken);
    user.value = response.user;
  }

  function clear(): void {
    setAccessToken(null);
    user.value = null;
  }

  /**
   * Restauration au démarrage : le cookie httpOnly permet d'obtenir un nouvel
   * access token sans redemander le mot de passe. Sans cookie valide, on reste
   * anonyme sans afficher d'erreur (c'est le cas normal d'une première visite).
   */
  async function restore(): Promise<void> {
    if (status.value === 'restoring' || status.value === 'authenticated') {
      return;
    }

    status.value = 'restoring';
    try {
      const response = await authApi.refresh();
      apply(response);
      status.value = 'authenticated';
    } catch {
      clear();
      status.value = 'anonymous';
    }
  }

  async function login(identifier: string, password: string, deviceName?: string): Promise<boolean> {
    errorMessage.value = null;
    status.value = 'loading';

    try {
      const response = await authApi.login({
        identifier,
        password,
        deviceId: getDeviceId(),
        deviceName,
      });
      apply(response);
      status.value = 'authenticated';
      return true;
    } catch (error) {
      errorMessage.value = describeError(error);
      clear();
      status.value = 'anonymous';
      return false;
    }
  }

  async function logout(): Promise<void> {
    try {
      await authApi.logout();
    } catch {
      // Le cookie peut déjà être expiré : la déconnexion LOCALE doit aboutir.
    }
    clear();
    status.value = 'anonymous';
  }

  /** Déconnexion sans appel réseau (session déjà jugée invalide par l'API). */
  function forceLogout(): void {
    clear();
    status.value = 'anonymous';
    errorMessage.value = null;
  }

  async function changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    errorMessage.value = null;
    try {
      await authApi.changePassword(currentPassword, newPassword);
      return true;
    } catch (error) {
      errorMessage.value = describeError(error);
      return false;
    }
  }

  return {
    user,
    status,
    errorMessage,
    isAuthenticated,
    displayName,
    restore,
    login,
    logout,
    forceLogout,
    changePassword,
  };
});
