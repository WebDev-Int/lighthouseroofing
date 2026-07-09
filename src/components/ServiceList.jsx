import { useServices } from '../hooks/useServices.js';
import { ServiceCard } from './ServiceCard.jsx';

export function ServiceList() {
  const { services, loading, error } = useServices();

  if (loading) return <p className="lede">Loading services...</p>;
  if (error) return <p className="lede">Service catalog currently unavailable. Please call us directly.</p>;

  return (
    <div className="cards" aria-live="polite">
      {services.map((svc, i) => (
        <ServiceCard key={`${svc.title}-${i}`} service={svc} />
      ))}
    </div>
  );
}
