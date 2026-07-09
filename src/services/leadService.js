import { LEAD_ENDPOINT } from './api.js';

export async function submitLead(payload) {
  const res = await fetch(LEAD_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Network response was not ok');

  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Something went wrong');
  return data;
}
