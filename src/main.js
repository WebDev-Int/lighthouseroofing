import './style.css';
import { initServices, warmServices } from './services.js';
import { initForm } from './form.js';
import { getDomRefs } from './dom.js';

const { serviceListEl, serviceSelectEl, contactForm, statusEl } = getDomRefs();

initServices({ listEl: serviceListEl, selectEl: serviceSelectEl });
initForm({ formEl: contactForm, statusEl });

// Warm caches to speed navigation between pages
warmServices();
prefetchPages(['/services.html', '/contact.html']);
registerServiceWorker();

function prefetchPages(paths) {
  paths.forEach((path) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = path;
    document.head.appendChild(link);
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => console.error('SW registration failed', err));
    });
  }
}
