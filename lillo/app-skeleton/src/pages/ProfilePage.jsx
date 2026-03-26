import { useMemo } from 'react';
import FarmVisualCard from '../components/FarmVisualCard';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import SoilMoistureCard from '../components/SoilMoistureCard';
import WaterLevelCard from '../components/WaterLevelCard';

function readIntegrationStatus(integrations, integrationId) {
  return integrations.find((integration) => integration.id === integrationId)?.status ?? 'neutral';
}

function isSourceConnected(status) {
  return status === 'live' || status === 'syncing';
}

function SourceIcon({ type }) {
  switch (type) {
    case 'weather':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M7.5 16.5h8a3.5 3.5 0 0 0 0-7 4.5 4.5 0 0 0-8.6-1.5A3.6 3.6 0 0 0 3.5 11.6 3.9 3.9 0 0 0 7.5 16.5Z" />
          <path d="M9 19.2h6" />
          <path d="M10.5 21h3" />
        </svg>
      );
    case 'satellite':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <rect height="4.5" rx="1" width="4.5" x="3.5" y="3.5" />
          <rect height="4.5" rx="1" width="4.5" x="16" y="16" />
          <path d="m7.4 7.4 9.2 9.2" />
          <path d="m13.4 5.8 4.8 4.8" />
          <path d="M5.8 13.4 10.6 18.2" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M12 5v14" />
          <path d="M8.5 8.5 12 5l3.5 3.5" />
          <path d="M5.5 12a6.5 6.5 0 0 1 13 0" />
          <circle cx="12" cy="18.2" r="1.8" />
        </svg>
      );
  }
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
  const profileSources = useMemo(
    () => [
      {
        id: 'unite-iot',
        label: 'Unite IoT',
        type: 'sensor',
        status: readIntegrationStatus(integrations, 'iot-sensors'),
        caption: 'Air, soil, and moisture telemetry',
      },
      {
        id: 'weather',
        label: 'Weather',
        type: 'weather',
        status: readIntegrationStatus(integrations, 'weather-api'),
        caption: 'Rain, wind, and overnight windows',
      },
      {
        id: 'satellite',
        label: 'Satellite',
        type: 'satellite',
        status: readIntegrationStatus(integrations, 'satellite-data'),
        caption: 'Thermal and vegetation scan context',
      },
    ],
    [integrations],
  );
  const centerPills = useMemo(
    () => [
      { label: 'Farm type', value: selectedFarm.label },
      { label: 'Role', value: 'Operations' },
      { label: 'Live alerts', value: String(alerts.length) },
      { label: 'Primary', value: String(primaryAlerts) },
    ],
    [alerts.length, primaryAlerts, selectedFarm.label],
  );

  const waterTrend = useMemo(() => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const baseline = [49, 47, 50, 56, 61, 58, 60];
    const adjustment = Math.min(6, primaryAlerts);

    return labels.map((label, index) => ({
      label,
      value: baseline[index] + adjustment,
    }));
  }, [primaryAlerts]);

  const moistureColumns = useMemo(
    () => [
      { id: 'north-block', label: fieldContext[0]?.plotCode ?? 'Plot A', value: 64 },
      { id: 'lower-block', label: fieldContext[1]?.plotCode ?? 'Plot B', value: 57 },
      { id: 'target', label: 'Target', value: 68 },
    ],
    [fieldContext],
  );

  return (
    <div className="page profile-page">
      <PageHeader
        eyebrow="Profile"
        title={`${selectedFarm.label} farm context`}
        description="Read-only farm context currently used by alert prioritization and action suggestions."
        trailing={<span className="profile-readonly-pill">Read-only</span>}
      />

      <div className="profile-stage-grid">
        <div className="profile-stage-panel profile-stage-panel--sources">
          <SectionCard subtitle="Green means connected. Red means broken." title="Connected sources">
            <div className="profile-source-visual-list">
              {profileSources.map((source) => {
                const connected = isSourceConnected(source.status);

                return (
                  <article className="profile-source-visual-item" key={source.id}>
                    <div className={`profile-source-visual-icon ${connected ? 'is-connected' : 'is-broken'}`}>
                      <SourceIcon type={source.type} />
                    </div>

                    <div className="profile-source-visual-copy">
                      <p>{source.label}</p>
                      <span>{source.caption}</span>
                    </div>

                    <span
                      aria-label={connected ? `${source.label} connected` : `${source.label} broken`}
                      className={`profile-connection-dot ${connected ? 'is-connected' : 'is-broken'}`}
                      title={connected ? 'Connected' : 'Broken'}
                    />
                  </article>
                );
              })}
            </div>
          </SectionCard>
        </div>

        <div className="profile-stage-panel profile-stage-panel--center">
          <FarmVisualCard
            contextPills={centerPills}
            farmName={`${selectedFarm.label} Cooperative Unit`}
            markers={fieldContext.map((field) => field.name)}
            showLegend={false}
            subtitle="Minimal static scene of the active profile."
            title="Farm context map"
          />
        </div>

        <div className="profile-stage-panel profile-stage-panel--context">
          <SectionCard subtitle="Read-only context dimensions currently in active use." title="Basic farm context">
            <div className="profile-context-strip">
              <article className="profile-context-pill">
                <span>Plots in scope</span>
                <strong>{fieldContext.length}</strong>
              </article>
              <article className="profile-context-pill">
                <span>Crop profile</span>
                <strong>{selectedFarm.label}</strong>
              </article>
              <article className="profile-context-pill">
                <span>Feeds active</span>
                <strong>{connectedFeeds}</strong>
              </article>
            </div>

            <ul className="profile-field-list">
              {fieldContext.map((field) => (
                <li key={field.id}>
                  <strong>{field.name}</strong>
                  <span>{field.plotCode}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>

      <div className="profile-support-grid">
        <WaterLevelCard points={waterTrend} />
        <SoilMoistureCard columns={moistureColumns} />
      </div>
    </div>
  );
}

export default ProfilePage;
