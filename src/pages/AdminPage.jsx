import { AdminLogin } from '../components/AdminLogin.jsx';
import { AdminPanel } from '../components/AdminPanel.jsx';
import { Seo } from '../components/Seo.jsx';
import { useAdminAuth } from '../hooks/useAdminAuth.js';
import '../styles/admin.css';

export function AdminPage() {
  const { isAuthenticated, login, logout } = useAdminAuth();

  return (
    <section className="section">
      <Seo
        title="Admin"
        description="Admin panel for LightHouse Roofing & Remodeling."
        path="/admin"
        noindex
      />
      <div className="section-heading">
        <p className="eyebrow">Authentication Required</p>
        <h2>Admin Access</h2>
      </div>
      {isAuthenticated ? <AdminPanel onLogout={logout} /> : <AdminLogin onLogin={login} />}
    </section>
  );
}
