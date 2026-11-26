/**
 * Traductions malgaches — BASE de démarrage.
 *
 * Les clés absentes retombent automatiquement sur le français
 * (`fallbackLocale: 'fr'`). Les libellés métier définitifs seront validés
 * avec l'équipe de la boutique avant la mise en production.
 */
export default {
  app: {
    tagline: 'Fitantanana ny varotra',
  },
  common: {
    loading: 'Eo am-pakàna…',
    save: 'Tehirizo',
    cancel: 'Ajanona',
  },
  auth: {
    loginTitle: 'Hiditra',
    loginSubtitle: 'Midira amin’ny sehatra fitantanana.',
    email: 'Adiresy imailaka',
    password: 'Tenimiafina',
    deviceName: 'Anaran’ny fitaovana',
    webBrowser: 'Tranokeliboky',
    submit: 'Hiditra',
    submitting: 'Miditra…',
    logout: 'Hiala',
    changePassword: 'Hanova ny tenimiafina',
    currentPassword: 'Tenimiafina ankehitriny',
    newPassword: 'Tenimiafina vaovao',
    confirmPassword: 'Hamafiso ny tenimiafina vaovao',
    passwordChanged: 'Voaova ny tenimiafina. Tapaka ny fifandraisana amin’ny fitaovana hafa.',
    passwordsMismatch: 'Tsy mitovy ny tenimiafina.',
  },
  home: {
    welcome: 'Tongasoa',
    account: 'Ny kaontiko',
    email: 'Imailaka',
    role: 'Andraikitra',
  },
  roles: {
    ADMIN: 'Mpitantana',
    SELLER: 'Mpivarotra',
  },
  language: {
    label: 'Fiteny',
  },
  errors: {
    network: 'Tsy afaka mifandray amin’ny mpizara. Hamarino ny fifandraisana.',
    unknown: 'Nisy olana. Andramo indray afaka kelikely.',
    sessionExpired: 'Lany ny fotoana. Midira indray.',
    tooManyAttempts: 'Be loatra ny fikasana. Andraso kely vao manandrana indray.',
  },
};
