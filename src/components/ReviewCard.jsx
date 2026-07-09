import { Stars } from './Stars.jsx';

export function ReviewCard({ review }) {
  return (
    <article className="card review-card">
      <div className="review-header">
        <p className="eyebrow">{review.name}</p>
        <Stars rating={review.rating} />
      </div>
      <p className="review-text">{review.text}</p>
      <p className="review-date"><small>{review.date}</small></p>
    </article>
  );
}
