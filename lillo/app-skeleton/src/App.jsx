import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './components/components.css';
import './pages/pages.css';
import { alertSources, alertTemplates, farmTypes, fields, integrations } from './data/mockData';
import { buildAlertsForFarm } from './data/selectors';
import AppShell from './layout/AppShell';
import AlertDetailPage from './pages/AlertDetailPage';
import AlertsPage from './pages/AlertsPage';
import FarmTypePage from './pages/FarmTypePage';

const PROFILE_SWITCH_LOADING_MS = 300;

function App() {
  const [selectedFarmId, setSelectedFarmId] = useState(farmTypes[0].id);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const selectedFarm = farmTypes.find((farm) => farm.id === selectedFarmId);

  if (!selectedFarm) {
    throw new Error(`Farm selection "${selectedFarmId}" is not supported by the mock data set.`);
  }

  useEffect(() => {
    // Small delay keeps state transitions demo-friendly and enables lightweight loading placeholders.
    setIsProfileLoading(true);
    const timeoutId = window.setTimeout(() => setIsProfileLoading(false), PROFILE_SWITCH_LOADING_MS);

    return () => window.clearTimeout(timeoutId);
  }, [selectedFarmId]);

  const alerts = useMemo(
    () => buildAlertsForFarm({ farmId: selectedFarmId, templates: alertTemplates, availableFields: fields, availableSources: alertSources, availableIntegrations: integrations }),
    [selectedFarmId],
  );

  return (
    <Routes>
      <Route element={<AppShell selectedFarm={selectedFarm} alerts={alerts} />}>
        <Route path="/" element={<Navigate to="/farm-type" replace />} />
        <Route
          path="/farm-type"
          element={
            <FarmTypePage
              farmTypes={farmTypes}
              selectedFarmId={selectedFarmId}
              onSelectFarm={setSelectedFarmId}
              alerts={alerts}
            />
          }
        />
        <Route path="/alerts" element={<AlertsPage selectedFarm={selectedFarm} alerts={alerts} isLoading={isProfileLoading} />} />
        <Route
          path="/alerts/:alertId"
          element={<AlertDetailPage selectedFarm={selectedFarm} alerts={alerts} isLoading={isProfileLoading} />}
        />
        <Route path="*" element={<Navigate to="/farm-type" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
