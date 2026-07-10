import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarRating } from './StarRating.jsx';
import { submitReview } from '../services/reviewService.js';

const IS_DEV = import.meta.env.DEV;

export function ReviewForm() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1) {
      setStatus('Please select a star rating.');
      return;
    }
    setStatus('Submitting...');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      if (IS_DEV) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        navigate('/');
        return;
      }

      await submitReview(payload);
      navigate('/');
    } catch (err) {
      console.error(err);
      setStatus('We could not submit your review. Please try again later.');
    }
  };

  return (
    <div className="card review-form">
      <span className="review-form-quote" aria-hidden="true">“</span>
      <div className="review-form-header">
        <p className="eyebrow">Leave a review</p>
        <h3>Share your experience</h3>
      </div>
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
        <button type="submit" className="btn solid review-form-submit">Submit Review</button>
        <p className="form-note" role="status">{status}</p>
      </form>
    </div>
  );
}
