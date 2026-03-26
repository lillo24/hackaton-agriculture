import { useMemo } from 'react';
import FarmVisualCard from '../components/FarmVisualCard';
import PageHeader from '../components/PageHeader';

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
  const profileSources = useMemo(
    () => [
      {
        id: 'unite-iot',
        label: 'Sensors',
        type: 'sensor',
        status: readIntegrationStatus(integrations, 'iot-sensors'),
      },
      {
        id: 'weather',
        label: 'Weather',
        type: 'weather',
        status: readIntegrationStatus(integrations, 'weather-api'),
      },
      {
        id: 'satellite',
        label: 'Satellite',
        type: 'satellite',
        status: readIntegrationStatus(integrations, 'satellite-data'),
        demoInactive: true,
      },
    ],
    [integrations],
  );
  const signalBadges = profileSources.map((source) => ({
    id: source.id,
    label: source.label,
    connected: source.demoInactive ? false : isSourceConnected(source.status),
    statusLabel: source.demoInactive ? 'Inactive' : isSourceConnected(source.status) ? 'Active' : 'Inactive',
    icon: <SourceIcon type={source.type} />,
  }));

  return (
    <div className="page profile-page">
      <PageHeader title="Giorgio's farm" />

      <div className="profile-stage">
        <FarmVisualCard
          farmName={`${selectedFarm.label} Cooperative Unit`}
          markers={fieldContext.map((field) => field.plotCode)}
          sectionClassName="profile-farm-stage-card"
          signalBadges={signalBadges}
          showLegend={false}
          subtitle={null}
          title={null}
        />
      </div>
    </div>
  );
}

export default ProfilePage;
