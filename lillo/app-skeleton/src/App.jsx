import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import './components/components.css';
import './pages/pages.css';
import { alertSources, alertTemplates, farmTypes, fields, integrations } from './data/mockData';
import { buildAlertsForFarm } from './data/selectors';
import AppShell from './layout/AppShell';
import AlertDetailPage from './pages/AlertDetailPage';
import AlertsPage from './pages/AlertsPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

const DEFAULT_FARM_ID = farmTypes[0].id;

function LegacyAlertRoute({ alerts, onSelectAlert }) {
  const { alertId } = useParams();
  const hasAlert = alerts.some((alert) => alert.id === alertId);

  useEffect(() => {
    onSelectAlert(hasAlert ? alertId : null);
  }, [alertId, hasAlert, onSelectAlert]);

  return <Navigate replace state={hasAlert ? { from: '/alerts', focusAlertId: alertId } : { from: '/alerts' }} to="/alert" />;
}

function App() {
  const [selectedAlertId, setSelectedAlertId] = useState(null);
  const selectedFarm = farmTypes.find((farm) => farm.id === DEFAULT_FARM_ID);

  if (!selectedFarm) {
    throw new Error(`Farm selection "${DEFAULT_FARM_ID}" is not supported by the mock data set.`);
  }

  const alerts = useMemo(
    () =>
      buildAlertsForFarm({
        farmId: DEFAULT_FARM_ID,
        templates: alertTemplates,
        availableFields: fields,
        availableSources: alertSources,
        availableIntegrations: integrations,
      }),
    [],
  );
  const selectedAlert = useMemo(
    () => alerts.find((alert) => alert.id === selectedAlertId) ?? null,
    [alerts, selectedAlertId],
  );

  useEffect(() => {
    if (!selectedAlertId) {
      return;
    }

    const hasSelectedAlert = alerts.some((alert) => alert.id === selectedAlertId);

    if (!hasSelectedAlert) {
      setSelectedAlertId(null);
    }
  }, [alerts, selectedAlertId]);

  return (
    <Routes>
      <Route element={<AppShell selectedFarm={selectedFarm} alerts={alerts} />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={<DashboardPage alerts={alerts} integrations={integrations} selectedFarm={selectedFarm} />}
        />
        <Route
          path="/alerts"
          element={
            <AlertsPage
              selectedFarm={selectedFarm}
              alerts={alerts}
              selectedAlertId={selectedAlertId}
              onSelectAlert={setSelectedAlertId}
            />
          }
        />
        <Route path="/alert" element={<AlertDetailPage selectedFarm={selectedFarm} alert={selectedAlert} />} />
        <Route path="/alerts/:alertId" element={<LegacyAlertRoute alerts={alerts} onSelectAlert={setSelectedAlertId} />} />
        <Route
          path="/profile"
          element={<ProfilePage selectedFarm={selectedFarm} alerts={alerts} integrations={integrations} />}
        />
        <Route
          path="/farm-type"
          element={<Navigate replace to="/profile" />}
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
