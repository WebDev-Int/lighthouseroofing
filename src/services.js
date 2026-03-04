const SERVICES_URL = '/data/services.json';
let cachedServices = null;

export async function initServices({ listEl, selectEl }) {
  if (!listEl && !selectEl) return [];
  try {
    const services = await fetchServices();
    renderServices(listEl, services);
    fillServiceSelect(selectEl, services);
    return services;
  } catch (err) {
    console.error(err);
    if (listEl) {
      listEl.innerHTML = '<p class="lede">Service catalog currently unavailable. Please call us directly.</p>';
    }
    return [];
  }
}

export async function warmServices() {
  try {
    await fetchServices();
  } catch (err) {
    console.error(err);
  }
}

async function fetchServices() {
  if (cachedServices) return cachedServices;
  const res = await fetch(SERVICES_URL, { cache: 'no-cache' });
  if (!res.ok) throw new Error('Unable to load services');
  cachedServices = await res.json();
  return cachedServices;
}

function renderServices(listEl, services) {
  if (!listEl) return;
  listEl.innerHTML = services
    .map(
      (svc) => `
        <article class="card">
          <p class="eyebrow">${svc.tags.join(' · ')}</p>
          <h3>${svc.title}</h3>
          <p>${svc.summary}</p>
          <div style="margin-top:12px;"><a class="btn ghost" href="#contact">${svc.cta}</a></div>
        </article>
      `
    )
    .join('');
}

function fillServiceSelect(selectEl, services) {
  if (!selectEl) return;
  selectEl.innerHTML = '<option value="" disabled selected>Select a service</option>' +
    services.map((svc) => `<option value="${svc.title}">${svc.title}</option>`).join('');
}
