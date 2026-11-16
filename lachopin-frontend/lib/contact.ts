/**
 * Datos de contacto públicos de LaChopin.
 * Mantener aquí el número y los correos para evitar enlaces inconsistentes.
 */
export const LACHOPIN_WHATSAPP_NUMBER = "34666953174";
export const LACHOPIN_WHATSAPP_DISPLAY = "+34 666 95 31 74";
export const LACHOPIN_CONTACT_EMAIL = "contacto@lachopin.com";

export function getLaChopinWhatsAppUrl(message?: string) {
  const baseUrl = `https://wa.me/${LACHOPIN_WHATSAPP_NUMBER}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
}
