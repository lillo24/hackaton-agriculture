import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import SoilMoistureCard from '../components/SoilMoistureCard';
import WaterLevelCard from '../components/WaterLevelCard';

const defaultAssistantPrompt = 'What should I check first this morning?';

function formatAlertSummary(totalAlerts, mediumAlerts, highAlerts) {
  return `${totalAlerts} ${totalAlerts === 1 ? 'alert' : 'alerts'}, ${mediumAlerts} medium and ${highAlerts} high`;
}

function buildMockAssistantReply({
  prompt,
  farmLabel,
  totalAlerts,
  mediumAlerts,
  highAlerts,
  primaryAlerts,
}) {
  const primaryFocusCopy = primaryAlerts === 1 ? '1 primary alert' : `${primaryAlerts} primary alerts`;
  const highFocusCopy =
    highAlerts > 0
      ? `Start with the ${highAlerts === 1 ? 'high-severity alert' : `${highAlerts} high-severity alerts`}.`
      : 'No high-severity alerts are active right now.';

  return `I read: "${prompt}". For ${farmLabel}, I see ${formatAlertSummary(totalAlerts, mediumAlerts, highAlerts)}. ${highFocusCopy} Then review ${primaryFocusCopy} before closing the morning round.`;
}

function DashboardPage({ selectedFarm, alerts = [] }) {
  const [assistantDraft, setAssistantDraft] = useState(defaultAssistantPrompt);
  const [assistantPrompt, setAssistantPrompt] = useState(defaultAssistantPrompt);
  const [assistantRunId, setAssistantRunId] = useState(0);
  const [assistantReply, setAssistantReply] = useState('');
  const [isAssistantTyping, setIsAssistantTyping] = useState(true);
  const scopedFields = useMemo(() => {
    const uniqueFields = new Map();

    alerts.forEach((alert) => {
      uniqueFields.set(alert.field.id, alert.field);
    });

    return Array.from(uniqueFields.values()).sort((left, right) => left.name.localeCompare(right.name));
  }, [alerts]);
  const primaryAlerts = useMemo(() => alerts.filter((alert) => alert.farmRelevance === 'primary').length, [alerts]);
  const severityCounts = useMemo(
    () =>
      alerts.reduce(
        (counts, alert) => {
          if (alert.severity in counts) {
            counts[alert.severity] += 1;
          }

          return counts;
        },
        { critical: 0, high: 0, medium: 0, low: 0 },
      ),
    [alerts],
  );
  const totalAlerts = alerts.length;
  const alertVisualSummary = useMemo(
    () => formatAlertSummary(totalAlerts, severityCounts.medium, severityCounts.high),
    [severityCounts.high, severityCounts.medium, totalAlerts],
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
      { id: 'north-block', label: scopedFields[0]?.plotCode ?? 'Plot A', value: 64 },
      { id: 'lower-block', label: scopedFields[1]?.plotCode ?? 'Plot B', value: 57 },
      { id: 'target', label: 'Target', value: 68 },
    ],
    [scopedFields],
  );
  const mockAssistantReply = useMemo(
    () =>
      buildMockAssistantReply({
        prompt: assistantPrompt,
        farmLabel: selectedFarm.label,
        totalAlerts,
        mediumAlerts: severityCounts.medium,
        highAlerts: severityCounts.high,
        primaryAlerts,
      }),
    [assistantPrompt, primaryAlerts, selectedFarm.label, severityCounts.high, severityCounts.medium, totalAlerts],
  );

  useEffect(() => {
    let characterIndex = 0;

    setAssistantReply('');
    setIsAssistantTyping(true);

    const typingTimer = setInterval(() => {
      characterIndex += 1;
      setAssistantReply(mockAssistantReply.slice(0, characterIndex));

      if (characterIndex >= mockAssistantReply.length) {
        clearInterval(typingTimer);
        setIsAssistantTyping(false);
      }
    }, 20);

    return () => clearInterval(typingTimer);
  }, [assistantRunId, mockAssistantReply]);

  function handleAssistantSubmit(event) {
    event.preventDefault();
    const nextPrompt = assistantDraft.trim();

    if (!nextPrompt) {
      return;
    }

    setAssistantPrompt(nextPrompt);
    setAssistantRunId((runId) => runId + 1);
  }

  return (
    <div className="page dashboard-page">
      <PageHeader title="Field pulse" />

      <div className="dashboard-priority-grid">
        <SectionCard
          subtitle="Placeholder for a future assistant integration."
          title="AI assistant seed"
        >
          <div className="dashboard-assistant">
            <div aria-live="polite" className="dashboard-assistant__thread">
              <article className="dashboard-assistant__message dashboard-assistant__message--user">
                <p>{assistantPrompt}</p>
              </article>
              <article className="dashboard-assistant__message dashboard-assistant__message--assistant">
                <p>
                  {assistantReply}
                  {isAssistantTyping ? <span aria-hidden="true" className="dashboard-assistant__cursor">|</span> : null}
                </p>
              </article>
            </div>

            <form className="dashboard-assistant__composer" onSubmit={handleAssistantSubmit}>
              <label className="dashboard-assistant__label" htmlFor="dashboard-assistant-input">
                Ask something
              </label>
              <div className="dashboard-assistant__row">
                <input
                  id="dashboard-assistant-input"
                  onChange={(event) => setAssistantDraft(event.target.value)}
                  placeholder="Type a farm question..."
                  type="text"
                  value={assistantDraft}
                />
                <button type="submit">Mock reply</button>
              </div>
            </form>
          </div>
        </SectionCard>

        <SectionCard
          subtitle="Primary signal to watch."
          title="Alerts"
        >
          <div className="dashboard-alert-focus">
            <strong className="dashboard-alert-focus__total">{totalAlerts}</strong>
            <p className="dashboard-alert-focus__summary">{alertVisualSummary}</p>
            <div className="dashboard-severity-row">
              <p className="dashboard-severity-pill dashboard-severity-pill--medium">
                <span className="dashboard-severity-dot" />
                {severityCounts.medium} medium
              </p>
              <p className="dashboard-severity-pill dashboard-severity-pill--high">
                <span className="dashboard-severity-dot" />
                {severityCounts.high} high
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="dashboard-summary-grid">
        <WaterLevelCard points={waterTrend} />
        <SoilMoistureCard columns={moistureColumns} />
      </div>
    </div>
  );
}

export default DashboardPage;
