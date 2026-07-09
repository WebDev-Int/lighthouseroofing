import { SERVICES_URL } from './api.js';

let cachedServices = null;

export async function fetchServices() {
  if (cachedServices) return cachedServices;

  const res = await fetch(SERVICES_URL, { cache: 'no-cache' });
  if (!res.ok) throw new Error('Unable to load services');

  cachedServices = await res.json();
  return cachedServices;
}

export function clearServicesCache() {
  cachedServices = null;
}
