export function AdminReviewCard({ review, type, onAction }) {
  const label = type === 'pending' ? 'PENDING' : 'APPROVED';

  return (
    <article className="card">
      <span className={`status-badge status-${type}`}>{label}</span>
      <div className="review-header">
        <p className="eyebrow">{review.name}</p>
        <p className="stars">
          {'★'.repeat(review.rating)}
          {'☆'.repeat(5 - review.rating)}
        </p>
      </div>
      <p className="review-text">{review.text}</p>
      <p className="review-date"><small>{review.date}</small></p>
      <div className="review-actions">
        {type === 'pending' ? (
          <>
            <button className="btn approve" onClick={() => onAction('approve', review)}>
              Approve
            </button>
            <button className="btn reject" onClick={() => onAction('reject', review)}>
              Reject
            </button>
          </>
        ) : (
          <button className="btn delete" onClick={() => onAction('delete', review)}>
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
