import './style.css';
import { initServices, warmServices } from './services.js';
import { initForm } from './form.js';
import { initReviews, warmReviews } from './reviews.js';
import { getDomRefs } from './dom.js';

const { serviceListEl, serviceSelectEl, contactForm, statusEl, reviewsListEl, reviewForm, reviewStatusEl } = getDomRefs();

if (serviceListEl) initServices({ listEl: serviceListEl, selectEl: serviceSelectEl });
if (contactForm) initForm({ formEl: contactForm, statusEl });
if (reviewsListEl || reviewForm) initReviews({ listEl: reviewsListEl, formEl: reviewForm, statusEl: reviewStatusEl });

warmServices();
warmReviews();
