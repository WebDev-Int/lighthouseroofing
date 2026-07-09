import { useReviews } from '../hooks/useReviews.js';
import { saveReviews } from '../services/reviewService.js';
import { AdminReviewCard } from './AdminReviewCard.jsx';

const IS_DEV = import.meta.env.DEV;

export function AdminPanel({ onLogout }) {
  const { reviews, loading, error, refresh, setReviews } = useReviews();
  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);

  const handleAction = async (action, target) => {
    const actionLabel = action === 'approve' ? 'Approve' : action === 'reject' ? 'Reject' : 'Delete';
    const confirmMessage =
      action === 'reject' ? `${actionLabel} this review? It will be deleted.` : `${actionLabel} this review?`;
    if (!confirm(confirmMessage)) return;

    let next = [...reviews];
    if (action === 'approve') {
      next = next.map((r) => (r === target ? { ...r, approved: true } : r));
    } else {
      next = next.filter((r) => r !== target);
    }

    try {
      if (IS_DEV) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      } else {
        await saveReviews(next);
      }
      setReviews(next);
    } catch (err) {
      console.error(err);
      alert('Failed to update review');
      refresh();
    }
  };

  if (loading) return <p className="lede">Loading reviews...</p>;
  if (error) return <p className="lede">Could not load reviews.</p>;

  return (
    <div id="admin-panel">
      <div className="section-heading">
        <p className="eyebrow">Review Management</p>
        <h2>Pending Reviews</h2>
        <p className="lede">Approve or reject reviews before they appear on the site.</p>
      </div>
      <div className="cards" aria-live="polite">
        {pending.length === 0 ? (
          <p className="lede">No pending reviews.</p>
        ) : (
          pending.map((r, i) => (
            <AdminReviewCard key={i} review={r} type="pending" onAction={handleAction} />
          ))
        )}
      </div>

      <div className="section-heading" style={{ marginTop: 48 }}>
        <p className="eyebrow">Approved Reviews</p>
        <h2>Live Reviews</h2>
        <p className="lede">Reviews currently displayed on the website.</p>
      </div>
      <div className="cards" aria-live="polite">
        {approved.length === 0 ? (
          <p className="lede">No approved reviews.</p>
        ) : (
          approved.map((r, i) => (
            <AdminReviewCard key={i} review={r} type="approved" onAction={handleAction} />
          ))
        )}
      </div>

      <div style={{ marginTop: 32 }}>
        <button id="logout-btn" className="btn ghost" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
