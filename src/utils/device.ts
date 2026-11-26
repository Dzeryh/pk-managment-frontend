const CLE_STOCKAGE = 'pk.device-id';
const FORMAT_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Identifiant d'appareil stable du navigateur (UUID v4).
 *
 * Il n'identifie PAS la personne : c'est une étiquette de session, utilisée
 * par le backend pour rattacher le refresh token à un appareil et refuser un
 * jeton présenté depuis un autre. Le stocker en localStorage est sans risque :
 * ce n'est pas un secret.
 */
export function getDeviceId(): string {
  const existant = window.localStorage.getItem(CLE_STOCKAGE);
  if (existant !== null && FORMAT_UUID.test(existant)) {
    return existant;
  }

  const identifiant = crypto.randomUUID();
  window.localStorage.setItem(CLE_STOCKAGE, identifiant);
  return identifiant;
}
