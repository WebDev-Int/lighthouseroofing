const REVIEWS_URL = '/data/reviews.json';
const REVIEW_ENDPOINT = '/api/review.php';
const IS_DEV = import.meta.env.DEV;
let cachedReviews = null;

export async function initReviews({ listEl, formEl, statusEl, config = {} }) {
  console.log('initReviews called', { listEl, formEl, statusEl, config });
  if (!listEl && !formEl) return [];

  const {
    title = 'Customer Reviews',
    description = 'Read what our customers have to say about our services.',
    showForm = true,
    maxReviews = null,
    dataUrl = REVIEWS_URL,
    submitEndpoint = REVIEW_ENDPOINT
  } = config;

  // Load and display reviews
  if (listEl) {
    try {
      const reviews = await fetchReviews(dataUrl);
      console.log('Reviews loaded:', reviews);
      // Only show approved reviews on public pages
      const approvedReviews = reviews.filter(r => r.approved);
      const displayReviews = maxReviews ? approvedReviews.slice(0, maxReviews) : approvedReviews;
      renderReviews(listEl, displayReviews, config);
    } catch (err) {
      console.error('Error loading reviews:', err);
      listEl.innerHTML = '<p class="lede">Reviews currently unavailable.</p>';
    }
  }

  // Initialize review form
  if (formEl && showForm) {
    initReviewForm({ formEl, statusEl, submitEndpoint });
  }
}

export async function warmReviews() {
  try {
    await fetchReviews();
  } catch (err) {
    console.error(err);
  }
}

async function fetchReviews(url = REVIEWS_URL) {
  // Always fetch fresh data to prevent caching issues
  const res = await fetch(url + '?t=' + Date.now(), { cache: 'no-cache' });
  if (!res.ok) throw new Error('Unable to load reviews');
  const reviews = await res.json();
  return reviews;
}

function renderReviews(listEl, reviews, config = {}) {
  if (!listEl) return;
  console.log('renderReviews called with:', reviews);
  console.log('listEl element:', listEl);
  if (!reviews || reviews.length === 0) {
    listEl.innerHTML = '<p class="lede">No reviews yet. Be the first to share your experience!</p>';
    return;
  }

  const { showDate = true } = config;

  const html = reviews
    .map(
      (review) => `
        <article class="card review-card">
          <div class="review-header">
            <p class="eyebrow">${review.name}</p>
            <p class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p>
          </div>
          <p class="review-text">${review.text}</p>
          ${showDate ? `<p class="review-date"><small>${review.date}</small></p>` : ''}
        </article>
      `
    )
    .join('');

  console.log('Generated HTML length:', html.length);
  listEl.innerHTML = html;
  console.log('Reviews rendered to DOM, innerHTML length:', listEl.innerHTML.length);
}

function initReviewForm({ formEl, statusEl, submitEndpoint = REVIEW_ENDPOINT }) {
  if (!formEl) return;
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (statusEl) statusEl.textContent = 'Submitting...';

    const formData = new FormData(formEl);
    const payload = Object.fromEntries(formData.entries());

    try {
      // In dev mode, simulate success without PHP server
      if (IS_DEV) {
        console.log('Dev mode: Simulating review submission', payload);
        await new Promise(resolve => setTimeout(resolve, 500));
        if (statusEl) statusEl.textContent = 'Thank you for your review! (Dev mode - not saved)';
        formEl.reset();
        return;
      }

      const res = await fetch(submitEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();

      if (data.success) {
        if (statusEl) statusEl.textContent = 'Thank you for your review!';
        formEl.reset();
        // Refresh reviews list
        cachedReviews = null;
        const listEl = document.getElementById('reviews-list');
        if (listEl) {
          const reviews = await fetchReviews();
          renderReviews(listEl, reviews);
        }
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      if (statusEl) statusEl.textContent = 'We could not submit your review. Please try again later.';
    }
  });
}
