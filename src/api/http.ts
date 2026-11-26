import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { AuthResponse } from '../types/auth';
import { getAccessToken, setAccessToken } from './token';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

/** Événement émis quand la session ne peut plus être rafraîchie. */
export const SESSION_EXPIRED_EVENT = 'pk:session-expired';

type RequeteRejouable = InternalAxiosRequestConfig & { _retry?: boolean };

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // indispensable : le cookie httpOnly porte le refresh
  timeout: 15_000,
  headers: {
    'X-Client-Type': 'web',
    Accept: 'application/json',
  },
});

http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token !== null) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Un seul rafraîchissement à la fois (« single flight ») : dix requêtes qui
 * échouent en 401 ne déclenchent pas dix rotations — la deuxième rotation
 * serait vue comme un rejeu et révoquerait la session.
 */
let rafraichissementEnCours: Promise<string | null> | null = null;

function rafraichir(): Promise<string | null> {
  rafraichissementEnCours ??= axios
    .post<AuthResponse>(
      `${API_BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true, headers: { 'X-Client-Type': 'web' }, timeout: 15_000 },
    )
    .then((reponse) => {
      setAccessToken(reponse.data.accessToken);
      return reponse.data.accessToken;
    })
    .catch(() => {
      setAccessToken(null);
      return null;
    })
    .finally(() => {
      rafraichissementEnCours = null;
    });

  return rafraichissementEnCours;
}

http.interceptors.response.use(
  (reponse) => reponse,
  async (error: AxiosError) => {
    const requete = error.config as RequeteRejouable | undefined;
    const statut = error.response?.status;
    const estRouteAuth = requete?.url?.includes('/auth/') === true;

    if (statut === 401 && requete !== undefined && requete._retry !== true && !estRouteAuth) {
      requete._retry = true;
      const nouveauJeton = await rafraichir();

      if (nouveauJeton !== null) {
        requete.headers.Authorization = `Bearer ${nouveauJeton}`;
        return http.request(requete);
      }

      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
    }

    return Promise.reject(error);
  },
);

/** Rafraîchissement explicite (restauration de session au démarrage). */
export function refreshSession(): Promise<string | null> {
  return rafraichir();
}

export { API_BASE_URL };
