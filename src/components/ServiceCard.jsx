export function ServiceCard({ service }) {
  return (
    <article className="card">
      <p className="eyebrow">{service.tags.join(' · ')}</p>
      <h3>{service.title}</h3>
      <p>{service.summary}</p>
      <div style={{ marginTop: 12 }}>
        <a className="btn ghost" href="/contact">{service.cta}</a>
      </div>
    </article>
  );
}
