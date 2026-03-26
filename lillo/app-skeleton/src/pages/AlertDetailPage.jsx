import { Link, useLocation, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import StatusBadge from '../components/StatusBadge';

function compactCopy(text, maxLength = 96) {
  const normalized = text.replace(/\s+/g, ' ').trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const firstSentence = normalized.split('. ')[0];

  if (firstSentence.length <= maxLength) {
    return firstSentence.endsWith('.') ? firstSentence : `${firstSentence}.`;
  }

  return `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
}

function AlertDetailPage({ selectedFarm, alerts, isLoading = false }) {
  const { alertId } = useParams();
  const location = useLocation();
  const backTarget = location.state?.from ?? '/alerts';
  const fallbackFocusAlertId = location.state?.focusAlertId ?? null;
  const alert = alerts.find((currentAlert) => currentAlert.id === alertId);
  const backState = { focusAlertId: alert?.id ?? fallbackFocusAlertId };

  if (isLoading) {
    return (
      <div className="page">
        <PageHeader
          eyebrow="Alert Detail"
          title="Loading alert detail"
          description="Preparing source signals, integrated explanation, and the next-step recommendation."
        />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="page">
        <PageHeader
          eyebrow="Alert Detail"
          title="Alert unavailable"
          description={`No alert named "${alertId}" exists in the ${selectedFarm.label} profile.`}
        />
        <SectionCard subtitle="The route is valid, but this farm profile does not expose that alert id." title="Next step">
          <Link className="inline-link" state={backState} to={backTarget}>
            Return to alerts
          </Link>
        </SectionCard>
      </div>
    );
  }

  const sourceCount = alert.sources.length;
  const sourceCountForLayout = Math.max(sourceCount, 1);

  return (
    <div className="page alert-detail-page">
      <Link className="inline-link alert-detail-page__back" state={backState} to={backTarget}>
        Back to alerts
      </Link>

      <PageHeader
        description={alert.summary}
        eyebrow="Alert Detail"
        title={alert.title}
        trailing={(
          <div className="badge-row">
            <StatusBadge tone={alert.severity}>{alert.severity}</StatusBadge>
            <StatusBadge tone={alert.status}>{alert.status}</StatusBadge>
            <StatusBadge tone="neutral">{alert.confidenceLabel}</StatusBadge>
            <StatusBadge tone="neutral">{alert.sourceSignalCount} signals</StatusBadge>
          </div>
        )}
      />

      <div className="alert-detail-meta">
        <p>
          <strong>Field</strong>
          {' '}
          {alert.field.name}
          {' '}
          ({alert.field.plotCode})
        </p>
        <p>
          <strong>Triggered</strong>
          {' '}
          {alert.timestampLabel}
        </p>
        <p>
          <strong>Farm profile</strong>
          {' '}
          {selectedFarm.label}
        </p>
      </div>

      <SectionCard subtitle="These are the main source signals used for the current alert." title="Source data blocks">
        <div className="source-flow" style={{ '--source-count': sourceCountForLayout }}>
          <div className="source-flow__grid">
            {alert.sources.map((source, index) => (
              <article className="source-flow-card" key={source.id} style={{ '--delay': `${index * 50}ms` }}>
                <p className="source-flow-card__name">{source.label}</p>
                <p className="source-flow-card__metric">{compactCopy(source.signal, 112)}</p>
                <p className="source-flow-card__note">{compactCopy(source.interpretation, 94)}</p>
              </article>
            ))}
          </div>
          <div aria-hidden="true" className="source-flow__merge">
            <div className="source-flow__merge-lines">
              {alert.sources.map((source) => (
                <span key={`${source.id}-connector`} />
              ))}
            </div>
            <span className="source-flow__merge-label">Signals merged</span>
          </div>
        </div>
      </SectionCard>

      <div aria-hidden="true" className="detail-flow-arrow">
        <span />
      </div>

      <SectionCard
        subtitle={`Multiple signals -> one interpreted problem (${sourceCount} signal${sourceCount === 1 ? '' : 's'}).`}
        title="Integrated explanation"
      >
        <p className="detail-text">{alert.whyTriggered}</p>
        <p className="detail-text detail-text--compact">{alert.relevanceReason}</p>
      </SectionCard>

      <div aria-hidden="true" className="detail-flow-arrow detail-flow-arrow--action">
        <span />
      </div>

      <SectionCard subtitle="Concrete next step for the farmer and operator." title="Recommended action">
        <p className="detail-text">{alert.suggestedAction}</p>
        <p className="detail-text detail-text--compact">
          Prioritize
          {' '}
          {alert.field.name}
          {' '}
          checks in the next field round.
        </p>
        <Link className="inline-link" state={backState} to={backTarget}>
          Return to alerts list
        </Link>
      </SectionCard>
    </div>
  );
}

export default AlertDetailPage;
