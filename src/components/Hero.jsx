export function Hero({ eyebrow, title, description, children, card }) {
  return (
    <section className="hero">
      <div className="hero-content">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {title && <h2>{title}</h2>}
        {description && <p className="lede">{description}</p>}
        {children}
      </div>
      {card && <div className="hero-card">{card}</div>}
    </section>
  );
}
