import { REVIEW_ENDPOINT, APPROVE_ENDPOINT, REVIEWS_URL } from './api.js';

export async function fetchReviews() {
  const res = await fetch(`${REVIEWS_URL}?t=${Date.now()}`, { cache: 'no-cache' });
  if (!res.ok) throw new Error('Unable to load reviews');
  return res.json();
}

export async function submitReview(payload) {
  const res = await fetch(REVIEW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Network response was not ok');

  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Something went wrong');
  return data;
}

export async function saveReviews(reviews) {
  const res = await fetch(APPROVE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviews }),
  });

  if (!res.ok) throw new Error('Server error: ' + res.status);

  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to save reviews');
  return data;
}
