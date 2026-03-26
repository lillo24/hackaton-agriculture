import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';

function formatUrgency(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function AlertDetailPage({ alert }) {
  if (!alert) {
    return (
      <div className="page">
        <PageHeader
          eyebrow="Alert"
          title="No alert selected yet"
          description="Open an alert from the Alerts page to inspect source signals and recommended action."
        />
        <SectionCard subtitle="This page is reserved for one selected alert detail view." title="Quiet placeholder">
          <Link className="inline-link" to="/alerts">
            Open alerts list
          </Link>
        </SectionCard>
      </div>
    );
  }

  const isNewNotification = alert.status === 'new';

  return (
    <div className="page alert-detail-page">
      <SectionCard title={alert.title}>
        <div className="alert-detail-priority-row">
          <p className="alert-detail-priority">
            <strong>Urgency</strong>
            {' '}
            {formatUrgency(alert.severity)}
          </p>
          {isNewNotification ? (
            <p className="alert-detail-notification">
              <span aria-hidden="true" className="alert-detail-notification__dot" />
              <span>New notification</span>
            </p>
          ) : null}
        </div>

        <div className="alert-detail-meta">
          <p>
            <strong>Triggered</strong>
            {' '}
            {alert.timestampLabel}
          </p>
          <p>
            <strong>Field</strong>
            {' '}
            {alert.field.name}
            {' '}
            ({alert.field.plotCode})
          </p>
        </div>
      </SectionCard>

      <div className="alert-roadmap" role="group" aria-label="Alert roadmap">
        <section className="roadmap-step roadmap-step--problems" style={{ '--step-delay': '0ms' }}>
          <header className="roadmap-step__header">
            <h3>Problems</h3>
            <p>Signals emerging from field sensors and connected feeds.</p>
          </header>
          <ul className="roadmap-problem-list">
            {alert.sources.map((source) => (
              <li className="roadmap-problem" key={source.id}>
                <p className="roadmap-problem__source">{source.label}</p>
                <p className="roadmap-problem__signal">{source.signal}</p>
              </li>
            ))}
          </ul>
        </section>

        <div aria-hidden="true" className="roadmap-link">
          <span>Integrated</span>
        </div>

        <section className="roadmap-step roadmap-step--integrated" style={{ '--step-delay': '140ms' }}>
          <header className="roadmap-step__header">
            <h3>Integrated</h3>
            <p>Merged interpretation from the active alert signals.</p>
          </header>
          <p className="detail-text">{alert.whyTriggered}</p>
          <p className="detail-text detail-text--compact">{alert.relevanceReason}</p>
        </section>

        <div aria-hidden="true" className="roadmap-link roadmap-link--action">
          <span>Action to do</span>
        </div>

        <section className="roadmap-step roadmap-step--action" style={{ '--step-delay': '280ms' }}>
          <header className="roadmap-step__header">
            <h3>Action to do</h3>
            <p>Next field operation to run now.</p>
          </header>
          <p className="detail-text">{alert.suggestedAction}</p>
        </section>
      </div>
    </div>
  );
}

export default AlertDetailPage;
