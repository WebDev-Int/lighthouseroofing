import { Stars } from './Stars.jsx';

export function ReviewCard({ review }) {
  return (
    <article className="card review-card">
      <span className="review-quote" aria-hidden="true">“</span>
      <div className="review-stars-row">
        <Stars rating={review.rating} />
      </div>
      <p className="review-text">{review.text}</p>
      <div className="review-footer">
        <p className="reviewer-name">{review.name}</p>
      </div>
    </article>
  );
}
