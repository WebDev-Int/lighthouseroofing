import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="topbar">
      <div className="logo-block">
        <img src="/assets/logo.png" alt="LightHouse Roofing & Remodeling" className="logo" />
        <div>
          <p className="eyebrow">Trusted. Local. Storm-tested.</p>
          <h1>LightHouse Roofing & Remodeling</h1>
        </div>
      </div>
      <div className="cta-group">
        <Link className="btn ghost" to="/">Home</Link>
        <Link className="btn ghost" to="/services">Our Services</Link>
        <Link className="btn solid" to="/contact">Get a Quote</Link>
      </div>
    </header>
  );
}
