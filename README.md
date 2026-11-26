# pk-managment-frontend

Application **web / PWA** de P&K Business Manager (gestion commerciale mono-boutique
P&K Fashion and Tech) — **Vue 3** + TypeScript strict, Vite, Pinia, vue-router, vue-i18n.

Sprint 1 : connexion, restauration de session, déconnexion, changement de mot de passe.

## Prérequis

- Node.js 22+
- L'API démarrée : dépôt `pk-managment-backend`, `npm run db:setup` puis `npm run start:dev`

## Installation

```bash
cp .env.example .env.local      # VITE_API_URL=http://localhost:3000/api
npm install
npm run dev                     # http://127.0.0.1:5173
```

L'API autorise par défaut l'origine `http://localhost:5173` (`CORS_ORIGINS` côté
backend) et doit accepter les **credentials** pour que le cookie de refresh circule :
c'est le cas dans la configuration livrée, ne la durcissez pas sans garder
`credentials: true`.

## Variable d'environnement

| Variable | Défaut | Rôle |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3000/api` | Base de l'API, **préfixe `/api` compris** |

Seules les variables préfixées `VITE_` sont exposées au navigateur : n'y mettez jamais
de secret.

## Scripts

| Script | Effet |
| --- | --- |
| `npm run dev` | Serveur Vite sur `127.0.0.1:5173` |
| `npm run build` | `vue-tsc` + `tsc` (config Vite) puis build de production |
| `npm run preview` | Sert le build sur `127.0.0.1:4173` |
| `npm run typecheck` | Vérification de types (application + configuration Vite) |
| `npm run lint` | ESLint (Vue + TypeScript), `--max-warnings=0` |
| `npm run format` | Prettier |

## Authentification

1. **Connexion** — `POST /api/auth/login` avec `X-Client-Type: web`. Le backend pose le
   refresh token dans un cookie `httpOnly` ; la réponse ne contient que l'access token,
   la durée et l'utilisateur.
2. **Access token en mémoire** (`src/api/token.ts`) — jamais de `localStorage`, jamais de
   cookie lisible par JavaScript.
3. **Restauration** au rechargement — `POST /api/auth/refresh` via le cookie ; le refresh
   renvoie déjà l'utilisateur, aucun appel supplémentaire n'est nécessaire.
4. **401 en cours d'usage** — une seule rotation (« single flight ») est tentée, la
   requête est rejouée, sinon l'événement `pk:session-expired` ramène à la connexion.
   Sans ce verrou, deux rotations simultanées seraient vues comme un rejeu et le backend
   révoquerait la session.
5. **Déconnexion** — `POST /api/auth/logout`, cookie effacé côté serveur et côté client.

Le `deviceId` est un UUID v4 stable par navigateur, conservé dans `localStorage`
(`src/utils/device.ts`). Ce n'est pas un secret : il sert au backend à rattacher la
session à un appareil.

### Routes appelées

| Méthode | Route | Rôle côté client |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Connexion |
| `POST` | `/api/auth/refresh` | Restauration et rotation |
| `POST` | `/api/auth/logout` | Déconnexion |
| `POST` | `/api/auth/change-password` | Changement de mot de passe |
| `GET` | `/api/health` | Vérification de disponibilité |

Le format d'erreur du backend est `{ statusCode, error, message, timestamp, path }` :
`src/utils/errors.ts` transforme `message` (chaîne ou tableau) en texte affichable en
français, avec un repli générique pour les `5xx` et les erreurs réseau.

## Structure

```
src/
  api/        instance axios, jeton en mémoire, appels d'authentification
  stores/     store Pinia d'authentification
  router/     routes et garde de session
  views/      LoginView, HomeView
  i18n/       français (complet) et malgache (base, repli automatique)
  utils/      erreurs lisibles, identifiant d'appareil, formatage MGA
  styles/     feuille de style globale
```

## PWA

`vite-plugin-pwa` précache la **coquille** (HTML, JS, CSS, icône) : l'application se
charge hors ligne, mais **les appels API ne sont jamais servis depuis un cache** et le
fallback de navigation exclut `/api`. Hors ligne, l'utilisateur voit une erreur franche
plutôt que des données périmées. Le cache de données et la file de synchronisation sont
prévus aux sprints 6 à 8.

## Langue et devise

- i18n `fr` complet ; `mg` de démarrage, les clés manquantes retombent sur le français.
  La langue choisie est mémorisée dans `localStorage`.
- `formatMGA()` affiche les montants en ariary **sans décimales**
  (`Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' })`).

## Vérifications

```bash
npm run typecheck
npm run lint
npm run build
```

Aucun test unitaire au sprint 1 : la logique sensible (rotation, rejeu, quotas, RBAC)
est testée côté backend. Ces trois commandes passent sur l'état livré.

## Limites connues

- Pas de tests unitaires front (voir ci-dessus).
- Pas de rafraîchissement proactif : la rotation se déclenche au premier `401`.
- Le backend doit être joignable en HTTPS en production, sinon le cookie `Secure` n'est
  pas envoyé.
