import { useMemo } from 'react';
import FarmVisualCard from '../components/FarmVisualCard';
import PageHeader from '../components/PageHeader';
import SourceIcon from '../components/SourceIcon';

function readIntegrationStatus(integrations, integrationId) {
  return integrations.find((integration) => integration.id === integrationId)?.status ?? 'neutral';
}

function isSourceConnected(status) {
  return status === 'live' || status === 'syncing';
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
