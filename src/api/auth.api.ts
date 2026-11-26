import type { AuthResponse, LoginPayload, User } from '../types/auth';
import { http } from './http';

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>('/auth/login', payload);
  return data;
}

/** Rotation du cookie de session ; le nouveau refresh token reste dans le cookie. */
export async function refresh(): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>('/auth/refresh', {});
  return data;
}

export async function logout(): Promise<void> {
  await http.post('/auth/logout', {});
}

export async function me(): Promise<User> {
  const { data } = await http.get<User>('/auth/me');
  return data;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await http.post('/auth/change-password', { currentPassword, newPassword });
}
