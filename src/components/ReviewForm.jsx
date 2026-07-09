import { useState } from 'react';
import { StarRating } from './StarRating.jsx';
import { submitReview } from '../services/reviewService.js';

const IS_DEV = import.meta.env.DEV;

export function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1) {
      setStatus('Please select a star rating.');
      return;
    }
    setStatus('Submitting...');

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      if (IS_DEV) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setStatus('Thank you for your review! (Dev mode - not saved)');
        e.currentTarget.reset();
        setRating(0);
        return;
      }

      await submitReview(payload);
      setStatus('Thank you for your review!');
      e.currentTarget.reset();
      setRating(0);
    } catch (err) {
      console.error(err);
      setStatus('We could not submit your review. Please try again later.');
    }
  };

  return (
    <div className="card review-form">
      <p className="eyebrow">Leave a review</p>
      <h3>Share your experience</h3>
      <form id="review-form" onSubmit={handleSubmit}>
        <label>
          Your name
          <input name="reviewer_name" required placeholder="Your name" autoComplete="name" />
        </label>
        <label>
          Rating
          <StarRating value={rating} onChange={setRating} />
          <input type="hidden" name="rating" value={rating} required />
        </label>
        <label>
          Your review
          <textarea
            name="review_text"
            required
            rows="4"
            placeholder="Tell us about your experience with our roofing services..."
            autoComplete="off"
          />
        </label>
        <button type="submit" className="btn solid">Submit Review</button>
        <p className="form-note" role="status">{status}</p>
      </form>
    </div>
  );
}
