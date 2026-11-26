export type UserRole = 'ADMIN' | 'SELLER';

/** Objet utilisateur du contrat d'API. */
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

/** Réponse de login et de refresh (le refreshToken n'est jamais renvoyé au web). */
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  user: User;
}

export interface LoginPayload {
  identifier: string;
  password: string;
  deviceId: string;
  deviceName?: string;
}

/** Corps d'erreur uniforme de l'API. */
export interface ApiErrorBody {
  statusCode: number;
  error: string;
  message: string | string[];
  timestamp: string;
  path: string;
}
