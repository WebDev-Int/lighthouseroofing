import { Hero } from '../components/Hero.jsx';
import { SectionHeading } from '../components/SectionHeading.jsx';
import { ContactForm } from '../components/ContactForm.jsx';
import { Seo } from '../components/Seo.jsx';

export function ContactPage() {
  return (
    <>
      <Seo
        title="Schedule a Roofing Inspection"
        description="Request a free roofing inspection or exterior consult. Fast emergency response for leaks, storm damage, and insurance claims."
        path="/contact"
      />
      <Hero
        eyebrow="Ready when you are"
        title="Schedule a roofing inspection or exterior consult."
        description="Fast response for storm damage and leaks. Tell us about your project and timing."
        card={
          <>
            <p className="eyebrow gold-gradient">Direct contact</p>
            <h3>Storm & leak hotline</h3>
            <p>
              <strong>Call / Text:</strong> (832) 902-1620
            </p>
            <p>
              <strong>Email:</strong> help@lighthouseroofing.com
            </p>
            <p className="small">We respond quickly during active weather events.</p>
          </>
        }
      />

      <section id="contact" className="section contact">
        <SectionHeading
          eyebrow="Tell us about your project"
          title="We'll confirm scope, timing, and next steps."
          description="Include leak locations, insurance info, or deadlines if you have them."
        />
        <ContactForm />
        <div className="contact-meta">
          <div className="card">
            <p className="eyebrow">Fast help</p>
            <h3>Emergency response</h3>
            <p>
              <strong>Call / Text:</strong> (832) 902-1620
            </p>
            <p>
              <strong>Email:</strong> help@lighthouseroofing.com
            </p>
          </div>
          <div className="card">
            <p className="eyebrow">Service area</p>
            <p>We serve homes and businesses within about 30 miles of Alvin, TX, including:</p>
            <ul className="service-areas">
              <li>Alvin</li>
              <li>Pearland</li>
              <li>Friendswood</li>
              <li>League City</li>
              <li>Dickinson</li>
              <li>Santa Fe</li>
              <li>Texas City</li>
              <li>La Marque</li>
              <li>Hitchcock</li>
              <li>Manvel</li>
              <li>Iowa Colony</li>
              <li>Rosharon</li>
              <li>Angleton</li>
              <li>Clute</li>
              <li>Missouri City</li>
            </ul>
            <p className="small">Ask about insurance assistance and financing options.</p>
          </div>
        </div>
      </section>
    </>
  );
}
