import { Link } from 'react-router-dom';
import AlertDetailBlock from '../components/AlertDetailBlock';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';

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

  const detailSeverityClass = `alert-detail-page--${alert.severity}`;

  return (
    <div className={`page alert-detail-page ${detailSeverityClass}`}>
      <AlertDetailBlock alert={alert} integratedPanelId="alert-detail-integrated-content" />
    </div>
  );
}

export default AlertDetailPage;
