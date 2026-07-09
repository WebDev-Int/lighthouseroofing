import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>LightHouse Roofing & Remodeling</strong>
        <p>Licensed. Insured. Proudly serving homes and businesses.</p>
      </div>
      <div className="footer-links">
        <Link to="/reviews" className="btn-3d">Post a Review</Link>
        <Link to="/admin" className="admin-logo" title="Admin">
          <img src="/assets/logo.png" alt="Admin" className="admin-logo-img" />
        </Link>
      </div>
    </footer>
  );
}
