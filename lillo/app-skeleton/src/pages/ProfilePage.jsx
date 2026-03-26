import { useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import StatusBadge from '../components/StatusBadge';

function readIntegrationStatus(integrations, integrationId) {
  return integrations.find((integration) => integration.id === integrationId)?.status ?? 'neutral';
}

function ProfilePage({ selectedFarm, alerts, integrations }) {
  const fieldContext = useMemo(() => {
    const uniqueFields = new Map();

    alerts.forEach((alert) => {
      uniqueFields.set(alert.field.id, alert.field);
    });

    return Array.from(uniqueFields.values()).sort((left, right) => left.name.localeCompare(right.name));
  }, [alerts]);
  const connectedFeeds = useMemo(
    () => new Set(alerts.flatMap((alert) => alert.relatedIntegrationIds)).size,
    [alerts],
  );
  const primaryAlerts = alerts.filter((alert) => alert.farmRelevance === 'primary').length;
  const profileSources = [
    {
      id: 'unite-iot',
      label: 'Unite IoT',
      status: readIntegrationStatus(integrations, 'iot-sensors'),
      detail: 'Temperatura Aria, Temperatura Suolo, Umidita Suolo',
    },
    {
      id: 'meteo',
      label: 'Meteo',
      status: readIntegrationStatus(integrations, 'weather-api'),
      detail: 'Forecast windows, rain probability, wind and overnight low trends',
    },
    {
      id: 'satellite',
      label: 'Satellite',
      status: readIntegrationStatus(integrations, 'satellite-data'),
      detail: 'Thermal and vegetation scans for parcel-level stress context',
    },
  ];

  return (
    <div className="page profile-page">
      <PageHeader
        eyebrow="Profile"
        title={`${selectedFarm.label} farm context`}
        description="Read-only account context loaded from external profile data."
      />

      <SectionCard
        subtitle="The app uses this profile context to prioritize alerts and suggested actions."
        title="Current profile summary"
      >
        <div className="snapshot-grid">
          <article className="snapshot-card">
            <span className="snapshot-label">Role</span>
            <strong>Farm Operations Manager</strong>
          </article>
          <article className="snapshot-card">
            <span className="snapshot-label">Farm/Company</span>
            <strong>{selectedFarm.label} Cooperative Unit</strong>
          </article>
          <article className="snapshot-card">
            <span className="snapshot-label">Farm type</span>
            <strong>{selectedFarm.label}</strong>
          </article>
          <article className="snapshot-card">
            <span className="snapshot-label">Active alert feed</span>
            <strong>{alerts.length} live alerts ({primaryAlerts} primary)</strong>
          </article>
        </div>
      </SectionCard>

      <SectionCard
        subtitle="Connected context feeds currently used by the alert engine."
        title="Connected data sources"
      >
        <div className="profile-source-list">
          {profileSources.map((source) => (
            <article className="profile-source-item" key={source.id}>
              <div className="profile-source-item__top">
                <p className="profile-source-item__title">{source.label}</p>
                <StatusBadge tone={source.status}>{source.status}</StatusBadge>
              </div>
              <p className="profile-source-item__text">{source.detail}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <div className="detail-grid">
        <SectionCard subtitle="Field and plot context currently visible in the live alert feed." title="Field context">
          <ul className="profile-field-list">
            {fieldContext.map((field) => (
              <li key={field.id}>
                <strong>{field.name}</strong>
                <span>{field.plotCode}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard subtitle="Short operational focus for this profile." title="Operating focus">
          <p className="detail-text">{selectedFarm.operatingFocus}</p>
          <p className="detail-text detail-text--compact">
            Connected feeds in scope:
            {' '}
            {connectedFeeds}
            .
          </p>
        </SectionCard>
      </div>
    </div>
  );
}

export default ProfilePage;
