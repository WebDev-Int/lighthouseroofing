import { useState } from 'react';
import { useServices } from '../hooks/useServices.js';
import { submitLead } from '../services/leadService.js';
import { FALLBACK_CONTACT } from '../services/api.js';

export function ContactForm({ showServiceSelect = true }) {
  const { services } = useServices();
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      await submitLead(payload);
      setStatus('Thanks! We received your request and will respond shortly.');
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus(`We could not send your request online. ${FALLBACK_CONTACT}`);
    }
  };

  return (
    <form id="contact-form" className="card" onSubmit={handleSubmit}>
      <label>
        Full name
        <input name="name" required placeholder="Your name" />
      </label>
      <label>
        Email
        <input name="email" type="email" required placeholder="you@example.com" />
      </label>
      <label>
        Phone
        <input name="phone" required placeholder="(832) 902-1620" />
      </label>
      {showServiceSelect && (
        <label>
          Service needed
          <select name="service" required>
            <option value="" disabled selected>Select a service</option>
            {services.map((svc) => (
              <option key={svc.title} value={svc.title}>
                {svc.title}
              </option>
            ))}
          </select>
        </label>
      )}
      <label>
        Project details
        <textarea name="message" rows="4" placeholder="Leak location, timeline, insurance info, deadlines..." />
      </label>
      <button type="submit" className="btn solid">Send request</button>
      <p className="form-note" id="form-status" role="status">
        {status}
      </p>
    </form>
  );
}
