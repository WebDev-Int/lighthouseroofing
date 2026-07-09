import { Hero } from '../components/Hero.jsx';
import { SectionHeading } from '../components/SectionHeading.jsx';
import { ReviewList } from '../components/ReviewList.jsx';
import { ReviewForm } from '../components/ReviewForm.jsx';
import { Seo } from '../components/Seo.jsx';
import { useReviews } from '../hooks/useReviews.js';

export function ReviewsPage() {
  const { reviews } = useReviews();
  const approvedReviews = reviews.filter((r) => r.approved);

  return (
    <>
      <Seo
        title="Customer Reviews"
        description="Read verified customer reviews for LightHouse Roofing & Remodeling. Share your experience with our roofing, gutter, and drainage services."
        path="/reviews"
      />
      <Hero
        eyebrow="What our customers say"
        title="Customer Reviews"
        description="Read honest feedback from homeowners who trusted LightHouse Roofing & Remodeling."
      />

      <section id="reviews" className="section review-section">
        {approvedReviews.length > 0 && (
          <>
            <SectionHeading
              eyebrow="Service feedback"
              title="What clients say about our services"
              description="See reviews from customers who have used our roofing services."
            />
            <ReviewList reviews={approvedReviews} />
          </>
        )}
        <div className="review-form-container">
          <ReviewForm />
        </div>
      </section>
    </>
  );
}
