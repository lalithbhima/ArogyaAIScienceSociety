import { APPS_SCRIPT_WEB_APP_URL } from '../config/appsScript.url.js';

/** @deprecated Use APPS_SCRIPT_WEB_APP_URL from appsScript.url.js */
export const GOOGLE_FORM_SCRIPT_URL = APPS_SCRIPT_WEB_APP_URL;

/**
 * POST submission to Google Sheets + triggers email via Apps Script.
 * Uses text/plain (not application/json) so browser requests reach GAS reliably.
 */
export async function submitWebsiteForm(payload) {
  const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });

  try {
    return await response.json();
  } catch {
    return { success: true, emailSent: null };
  }
}
