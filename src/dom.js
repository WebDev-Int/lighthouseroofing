export function getDomRefs() {
  return {
    serviceListEl: document.querySelector('#service-list'),
    serviceSelectEl: document.querySelector('select[name="service"]'),
    contactForm: document.querySelector('#contact-form'),
    statusEl: document.querySelector('#form-status'),
  };
}
