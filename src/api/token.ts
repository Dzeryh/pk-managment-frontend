/**
 * Access token gardé EN MÉMOIRE uniquement.
 *
 * Décision de sécurité : jamais de localStorage/sessionStorage pour un jeton.
 * Au rechargement de la page, la session est restaurée par un appel
 * `POST /api/auth/refresh` qui s'appuie sur le cookie httpOnly — un XSS ne
 * peut donc ni lire le refresh token, ni récupérer l'access token après coup.
 */
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}
