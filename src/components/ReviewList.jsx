import { useState } from 'react';
import { ReviewCard } from './ReviewCard.jsx';

export function ReviewList({ reviews, emptyText = 'No reviews yet.' }) {
  const [active, setActive] = useState(0);

  if (!reviews || reviews.length === 0) {
    return <p className="lede">{emptyText}</p>;
  }

  const goTo = (index) => {
    setActive(index);
  };

  const goNext = () => {
    setActive((prev) => (prev + 1) % reviews.length);
  };

  const goPrev = () => {
    setActive((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="review-carousel" aria-roledescription="carousel" aria-label="Customer reviews">
      <div className="review-window">
        <div
          className="review-track"
          style={{ transform: `translateX(calc(-${active * 85}% - ${active * 20}px))` }}
          aria-live="polite"
        >
          {reviews.map((review, i) => (
            <div key={`${review.name}-${review.date}-${i}`} className="review-slide" aria-hidden={i !== active}>
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>

      <div className="review-carousel-controls">
        <button type="button" className="review-carousel-btn prev" onClick={goPrev} aria-label="Previous review">
          ‹
        </button>
        <div className="review-carousel-dots" role="tablist" aria-label="Review slides">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Go to review ${i + 1}`}
              className={`review-carousel-dot ${i === active ? 'active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button type="button" className="review-carousel-btn next" onClick={goNext} aria-label="Next review">
          ›
        </button>
      </div>
    </div>
  );
}
