import { ReviewCard } from './ReviewCard.jsx';

export function ReviewList({ reviews, emptyText = 'No reviews yet.' }) {
  if (!reviews || reviews.length === 0) {
    return <p className="lede">{emptyText}</p>;
  }

  return (
    <div className="cards" aria-live="polite">
      {reviews.map((review, i) => (
        <ReviewCard key={`${review.name}-${review.date}-${i}`} review={review} />
      ))}
    </div>
  );
}
