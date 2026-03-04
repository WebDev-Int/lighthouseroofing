const LEAD_ENDPOINT = '/api/lead.php';
const FALLBACK_CONTACT = 'Please call (832) 902-1620 or email help@lighthouseroofing.com.';

export function initForm({ formEl, statusEl }) {
  if (!formEl) return;
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (statusEl) statusEl.textContent = 'Sending...';

    const formData = new FormData(formEl);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();

      if (data.success) {
        if (statusEl) statusEl.textContent = 'Thanks! We received your request and will respond shortly.';
        formEl.reset();
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      if (statusEl) statusEl.textContent = `We could not send your request online. ${FALLBACK_CONTACT}`;
    }
  });
}
