export function Stars({ rating }) {
  const full = '★'.repeat(rating);
  const empty = '☆'.repeat(5 - rating);
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {full}{empty}
    </span>
  );
}
