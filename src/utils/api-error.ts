import axios from 'axios';
import { i18n } from '../i18n';
import type { ApiErrorBody } from '../types/auth';

/**
 * Traduit une erreur technique en message utilisateur français.
 *
 * Priorité au message du serveur (déjà en français dans le contrat), puis aux
 * cas réseau, puis à un message générique. Aucun texte technique ne remonte.
 */
export function describeError(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const corps = error.response?.data;
    if (corps !== undefined) {
      if (Array.isArray(corps.message) && corps.message.length > 0) {
        return corps.message[0] ?? i18n.global.t('errors.unknown');
      }
      if (typeof corps.message === 'string' && corps.message.length > 0) {
        return corps.message;
      }
    }

    if (error.response === undefined) {
      return i18n.global.t('errors.network');
    }

    if (error.response.status === 429) {
      return i18n.global.t('errors.tooManyAttempts');
    }
  }

  return i18n.global.t('errors.unknown');
}
