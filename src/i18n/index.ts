import { createI18n } from 'vue-i18n';
import fr from './fr';
import mg from './mg';

export type Locale = 'fr' | 'mg';

const CLE_LANGUE = 'pk.locale';

function langueInitiale(): Locale {
  return window.localStorage.getItem(CLE_LANGUE) === 'mg' ? 'mg' : 'fr';
}

export const i18n = createI18n({
  legacy: false,
  locale: langueInitiale(),
  fallbackLocale: 'fr',
  messages: { fr, mg },
});

/** Change la langue et la mémorise (prêt pour d'autres locales). */
export function setLocale(locale: Locale): void {
  i18n.global.locale.value = locale;
  window.localStorage.setItem(CLE_LANGUE, locale);
  document.documentElement.lang = locale;
}

document.documentElement.lang = i18n.global.locale.value;
