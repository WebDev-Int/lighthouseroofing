import { Hero } from '../components/Hero.jsx';
import { SectionHeading } from '../components/SectionHeading.jsx';
import { ServiceList } from '../components/ServiceList.jsx';
import { ReviewList } from '../components/ReviewList.jsx';
import { Seo } from '../components/Seo.jsx';
import { useReviews } from '../hooks/useReviews.js';

export function ServicesPage() {
  const { reviews } = useReviews();
  const approvedReviews = reviews.filter((r) => r.approved);

  return (
    <>
      <Seo
        title="Roofing, Gutters & Drainage Services"
        description="Expert roof replacement, repair, and seamless gutter installation. Licensed crews, clean job sites, and storm-hardened solutions for coastal homes."
        path="/services"
      />
      <Hero
        eyebrow="What we do"
        title="Professional roofing and drainage services."
        description="Expert roof replacement, repair, and gutter systems to protect your home from water damage."
        card={
          <>
            <p className="eyebrow gold-gradient">Highlights</p>
            <h3>Certified crews & clean sites</h3>
            <ul className="checklist">
              <li>Manufacturer-approved installs</li>
              <li>Daily safety briefs & protection</li>
              <li>Magnetic sweep + debris haul-off</li>
            </ul>
            <a className="btn solid" href="/contact">
              Schedule an Inspection
            </a>
          </>
        }
      />

      <section id="services" className="section">
        <SectionHeading
          eyebrow="Services"
          title="Quality roofing services."
          description="Browse our roofing and drainage services below."
        />
        <ServiceList />
      </section>

      {approvedReviews.length > 0 && (
        <section id="reviews" className="section review-section">
          <SectionHeading
            eyebrow="Service feedback"
            title="What clients say about our services"
            description="See reviews from customers who have used our roofing services."
          />
          <ReviewList reviews={approvedReviews} />
        </section>
      )}
    </>
  );
}
