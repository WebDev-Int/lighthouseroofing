import { Hero } from '../components/Hero.jsx';
import { SectionHeading } from '../components/SectionHeading.jsx';
import { ServiceList } from '../components/ServiceList.jsx';
import { ReviewList } from '../components/ReviewList.jsx';
import { ReviewForm } from '../components/ReviewForm.jsx';
import { ProcessSteps } from '../components/ProcessSteps.jsx';
import { Seo } from '../components/Seo.jsx';
import { useReviews } from '../hooks/useReviews.js';

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RoofingContractor',
  name: 'LightHouse Roofing & Remodeling',
  url: 'https://www.lighthouseroofing.com/',
  logo: 'https://www.lighthouseroofing.com/assets/logo.png',
  image: 'https://www.lighthouseroofing.com/assets/logo.png',
  telephone: '+1-832-902-1620',
  areaServed: 'Coastal region',
  priceRange: '$$',
  description: 'Coastal-strong roofing, gutters, and drainage services.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Local service area',
    addressRegion: '',
    addressCountry: 'US',
  },
  sameAs: ['https://www.facebook.com/', 'https://www.instagram.com/'],
  makesOffer: [
    { '@type': 'Offer', itemOffered: 'Roof Replacement' },
    { '@type': 'Offer', itemOffered: 'Roof Repair & Leak Stop' },
    { '@type': 'Offer', itemOffered: 'Gutters & Drainage' },
  ],
};

export function HomePage() {
  const { reviews } = useReviews();
  const approvedReviews = reviews.filter((r) => r.approved);

  return (
    <>
      <Seo
        title="Coastal Roofing & Remodeling Services"
        description="LightHouse Roofing & Remodeling delivers coastal-strong roofing, gutters, and drainage services. 24/7 emergency response, clean job sites, and insurance guidance."
        path="/"
        jsonLd={homeJsonLd}
      />
      <Hero
        eyebrow="Coastal strong. Contractor smart."
        title="Roofing craftsmanship with a safety-first mindset."
        description="From shingle repair to full exterior makeovers, we protect your home with precision, clean job sites, and clear communication."
        card={
          <>
            <p className="eyebrow">Featured Exterior</p>
            <h3>Atlantic ridge roof refresh</h3>
            <p>
              High-wind shingle system, ice & water shield, gutter upgrades, and soffit
              ventilation.
            </p>
            <ul className="checklist">
              <li>On-site project lead, daily updates</li>
              <li>Magnetic nail sweep & spotless cleanup</li>
              <li>Licensed & insured for all roofing services</li>
            </ul>
            <a className="btn solid" href="/contact">
              Book a site visit
            </a>
          </>
        }
      >
        <div className="hero-actions">
          <a className="btn solid" href="/contact">
            Schedule an Inspection
          </a>
          <a className="btn ghost" href="#services">
            View Services
          </a>
        </div>
        <div className="hero-meta">
          <div>
            <strong>24/7</strong>
            <span>Emergency tarping & storm response</span>
          </div>
          <div>
            <strong>Financing</strong>
            <span>Flexible options & insurance guidance</span>
          </div>
          <div>
            <strong>Warranty</strong>
            <span>Workmanship & material coverage</span>
          </div>
        </div>
      </Hero>

      <section id="services" className="section">
        <SectionHeading
          eyebrow="What we do"
          title="Professional roofing and drainage services."
          description="We specialize in roof replacement, repair, and gutter systems to protect your home from water damage."
        />
        <ServiceList />
      </section>

      <section className="section split" id="portfolio">
        <div>
          <SectionHeading
            eyebrow="Project rhythm"
            title="Transparent process from inspection to sign-off."
          />
          <ProcessSteps />
        </div>
        <div className="panel">
          <p className="eyebrow">Safety + quality</p>
          <ul className="bullets">
            <li>OSHA-minded crews with fall protection plans</li>
            <li>Manufacturer-approved installation practices</li>
            <li>Storm-hardening for coastal wind uplift</li>
            <li>Meticulous cleanup: nails, debris, driveway</li>
          </ul>
        </div>
      </section>

      {approvedReviews.length > 0 && (
        <section id="reviews" className="section review-section">
          <SectionHeading
            eyebrow="What our customers say"
            title="Customer Reviews"
            description="Read what our customers have to say about our roofing services."
          />
          <ReviewList reviews={approvedReviews} />
        </section>
      )}

    </>
  );
}
