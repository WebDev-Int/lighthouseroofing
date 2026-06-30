import './style.css';
import { initServices, warmServices } from './services.js';
import { initForm } from './form.js';
import { getDomRefs } from './dom.js';

const { serviceListEl, serviceSelectEl, contactForm, statusEl } = getDomRefs();

if (serviceListEl) initServices({ listEl: serviceListEl, selectEl: serviceSelectEl });
if (contactForm) initForm({ formEl: contactForm, statusEl });

warmServices();
