function PageHeader({ eyebrow, title, description, trailing }) {
  return (
    <header className="page-header">
      <div>
        <p className="page-header__eyebrow">{eyebrow}</p>
        <h2 className="page-header__title">{title}</h2>
        <p className="page-header__description">{description}</p>
      </div>
      {trailing ? <div className="page-header__trailing">{trailing}</div> : null}
    </header>
  );
}

export default PageHeader;
