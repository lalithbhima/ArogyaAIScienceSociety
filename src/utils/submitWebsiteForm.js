/** Google Apps Script web app URL for newsletter + contact form submissions. */
export const GOOGLE_FORM_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyb01_UVyyLJk1vJgmMNPScz8Vp9mQ4vYwiOvHG4pTZykrq7j1KGr91b57_fhh16qjl/exec';

/**
 * POST submission to Google Sheets + triggers email via Apps Script.
 * Uses text/plain (not application/json) so browser requests reach GAS reliably.
 * GAS returns CORS headers, so we can read whether the notification email was sent.
 */
export async function submitWebsiteForm(payload) {
  const response = await fetch(GOOGLE_FORM_SCRIPT_URL, {
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });

  try {
    return await response.json();
  } catch {
    // Sheet save may still succeed even if the response body is unreadable.
    return { success: true, emailSent: null };
  }
}
