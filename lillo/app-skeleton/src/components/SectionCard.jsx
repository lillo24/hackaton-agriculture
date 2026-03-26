function SectionCard({ title, subtitle, children }) {
  return (
    <section className="section-card">
      {(title || subtitle) && (
        <div className="section-card__header">
          {title ? <h3 className="section-card__title">{title}</h3> : null}
          {subtitle ? <p className="section-card__subtitle">{subtitle}</p> : null}
        </div>
      )}
      {children}
    </section>
  );
}

export default SectionCard;
