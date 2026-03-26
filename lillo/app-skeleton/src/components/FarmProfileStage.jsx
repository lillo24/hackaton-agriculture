import { useMemo } from 'react';
import FarmVisualCard from './FarmVisualCard';
import PageHeader from './PageHeader';
import SourceIcon from './SourceIcon';

function readIntegrationStatus(integrations, integrationId) {
  return integrations.find((integration) => integration.id === integrationId)?.status ?? 'neutral';
}

function isSourceConnected(status) {
  return status === 'live' || status === 'syncing';
}

function FarmProfileStage({
  alertSummaryItems = [],
  alerts = [],
  integrations = [],
  selectedFarm,
  title = null,
  className = '',
}) {
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
  const signalBadges = useMemo(
    () =>
      profileSources.map((source) => ({
        id: source.id,
        label: source.label,
        connected: source.demoInactive ? false : isSourceConnected(source.status),
        statusLabel: source.demoInactive ? 'Inactive' : isSourceConnected(source.status) ? 'Active' : 'Inactive',
        icon: <SourceIcon type={source.type} />,
      })),
    [profileSources],
  );
  const stageClassName = ['farm-profile-stage', title ? 'farm-profile-stage--with-header' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={stageClassName}>
      {title ? <PageHeader title={title} /> : null}
      <FarmVisualCard
        floatingSummaryItems={alertSummaryItems}
        farmName={`${selectedFarm?.label ?? 'Farm'} Cooperative Unit`}
        markers={fieldContext.map((field) => field.plotCode)}
        sectionClassName="farm-profile-stage__card"
        signalBadges={signalBadges}
        showLegend={false}
        subtitle={null}
        title={null}
      />
    </div>
  );
}

export default FarmProfileStage;
