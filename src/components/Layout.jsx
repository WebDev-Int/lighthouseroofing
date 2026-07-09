import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';

export function Layout() {
  return (
    <>
      <Helmet
        titleTemplate="%s | LightHouse Roofing & Remodeling"
        defaultTitle="LightHouse Roofing & Remodeling"
      >
        <meta name="description" content="LightHouse Roofing & Remodeling delivers coastal-strong roofing, gutters, and drainage services." />
      </Helmet>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
