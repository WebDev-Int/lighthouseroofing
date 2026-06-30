export function getDomRefs() {
  return {
    serviceListEl: document.querySelector('#service-list'),
    serviceSelectEl: document.querySelector('select[name="service"]'),
    contactForm: document.querySelector('#contact-form'),
    statusEl: document.querySelector('#form-status'),
    reviewsListEl: document.getElementById('reviews-list'),
    reviewForm: document.getElementById('review-form'),
    reviewStatusEl: document.getElementById('review-status'),
  };
}
