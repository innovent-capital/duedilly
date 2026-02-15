/**
 * DueDilly Data Submission Layer
 * Sends form data to Google Apps Script web app.
 */

const DUEDILLY_SUBMIT_URL = ''; // Set after deploying Apps Script

async function submitData(type, data) {
  // Always submit to existing Apps Script (FormData endpoint)
  const existingUrl = 'https://script.google.com/macros/s/AKfycbw2m55FQZT70Vo25FCrXa8TbLnx3OCJrGA7s7T5my6hT6AqV1xziBiTfhUeg4Afc3UE/exec';

  try {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));
    fetch(existingUrl, { method: 'POST', mode: 'no-cors', body: formData });
  } catch(e) {
    console.error('Submit error:', e);
  }

  // Also submit to new endpoint if configured
  if (DUEDILLY_SUBMIT_URL) {
    try {
      fetch(DUEDILLY_SUBMIT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...data, timestamp: new Date().toISOString() }),
      });
    } catch(e) {}
  }

  // localStorage backup
  let entries = [];
  try { entries = JSON.parse(localStorage.getItem('duedilly_emails') || '[]'); } catch(_) {}
  entries.push({ ...data, timestamp: new Date().toISOString() });
  localStorage.setItem('duedilly_emails', JSON.stringify(entries));
}

function getUTM() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    referrer: document.referrer || '',
  };
}
