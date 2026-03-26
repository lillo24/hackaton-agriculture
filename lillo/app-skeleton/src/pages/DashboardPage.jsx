import { useEffect, useMemo, useRef, useState } from 'react';
import FarmProfileStage from '../components/FarmProfileStage';
import SectionCard from '../components/SectionCard';
import SoilMoistureCard from '../components/SoilMoistureCard';
import WaterLevelCard from '../components/WaterLevelCard';

function withPeriod(text) {
  const clean = (text ?? '').trim();

  if (!clean) {
    return '';
  }

  return /[.!?]$/.test(clean) ? clean : `${clean}.`;
}

function buildDailyAssistantReply({
  farmLabel,
  totalAlerts,
  severityCounts,
  leadAlert,
  secondaryAlert,
}) {
  const alertBreakdown =
    `${severityCounts.critical} critical, ` +
    `${severityCounts.high} high, ` +
    `${severityCounts.medium} medium, and ` +
    `${severityCounts.low} low`;
  const leadSummary = leadAlert ? withPeriod(leadAlert.summary) : 'No active anomalies were detected.';
  const secondarySummary = secondaryAlert
    ? `Secondary signal: ${withPeriod(secondaryAlert.title)}`
    : 'No secondary escalation is active.';

  return `Good morning. ${farmLabel} shows ${totalAlerts} ${totalAlerts === 1 ? 'alert' : 'alerts'} today: ${alertBreakdown}. ${leadSummary} ${secondarySummary}`.trim();
}

function buildFollowupAssistantReply({
  prompt,
  farmLabel,
  totalAlerts,
  severityCounts,
}) {
  return `Received. ${farmLabel} currently has ${totalAlerts} alerts (${severityCounts.critical} critical, ${severityCounts.medium} medium, ${severityCounts.low} low). ${withPeriod(prompt)}`;
}

function DashboardPage({ selectedFarm, alerts = [], integrations = [] }) {
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [typingMessageId, setTypingMessageId] = useState(null);
  const typingIntervalRef = useRef(null);
  const nextMessageIdRef = useRef(1);
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
  const severityPills = useMemo(
    () =>
      [
        {
          key: 'critical',
          tone: 'critical',
          count: severityCounts.critical,
          label: `${severityCounts.critical} critical${severityCounts.critical === 1 ? '' : 's'}`,
        },
        {
          key: 'medium',
          tone: 'medium',
          count: severityCounts.medium,
          label: `${severityCounts.medium} medium`,
        },
      ].filter((pill) => pill.count > 0),
    [severityCounts.critical, severityCounts.medium],
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
  const dailyAssistantReply = useMemo(
    () =>
      buildDailyAssistantReply({
        farmLabel: selectedFarm.label,
        totalAlerts,
        severityCounts,
        leadAlert: alerts[0],
        secondaryAlert: alerts[1],
      }),
    [alerts, selectedFarm.label, severityCounts, totalAlerts],
  );

  function stopTyping() {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  }

  function streamAssistantMessage(fullText, typingDelay = 30) {
    stopTyping();

    const messageId = nextMessageIdRef.current++;
    let characterIndex = 0;

    setTypingMessageId(messageId);
    setChatMessages((previousMessages) => [
      ...previousMessages,
      { id: messageId, role: 'assistant', text: '' },
    ]);

    typingIntervalRef.current = setInterval(() => {
      characterIndex += 1;
      setChatMessages((previousMessages) =>
        previousMessages.map((message) =>
          message.id === messageId ? { ...message, text: fullText.slice(0, characterIndex) } : message,
        ),
      );

      if (characterIndex >= fullText.length) {
        stopTyping();
        setTypingMessageId(null);
      }
    }, typingDelay);
  }

  useEffect(() => {
    setChatMessages([]);
    streamAssistantMessage(dailyAssistantReply, 34);

    return () => stopTyping();
  }, [dailyAssistantReply]);

  function handleSendMessage(event) {
    event.preventDefault();
    const prompt = chatInput.trim();

    if (!prompt) {
      return;
    }

    const userMessageId = nextMessageIdRef.current++;
    const followupReply = buildFollowupAssistantReply({
      prompt,
      farmLabel: selectedFarm.label,
      totalAlerts,
      severityCounts,
    });

    setChatMessages((previousMessages) => [
      ...previousMessages,
      { id: userMessageId, role: 'user', text: prompt },
    ]);
    setChatInput('');
    streamAssistantMessage(followupReply, 26);
  }

  return (
    <div className="page dashboard-page">
      <FarmProfileStage
        alertSummaryItems={severityPills}
        alerts={alerts}
        className="dashboard-profile-stage"
        integrations={integrations}
        selectedFarm={selectedFarm}
        title="Giorgio's farm"
      />

      <div className="dashboard-priority-grid">
        <div className="dashboard-priority-grid__assistant">
          <SectionCard>
            <div className="dashboard-assistant">
              <div aria-live="polite" className="dashboard-assistant-chat">
                <header className="dashboard-assistant-chat__header">
                  <div className="dashboard-assistant-chat__avatar" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="dashboard-assistant-chat__name">Farmer Assistant</p>
                    <p className="dashboard-assistant-chat__status">Daily recap streaming</p>
                  </div>
                </header>

                <div className="dashboard-assistant-chat__messages">
                  {chatMessages.map((message) => (
                    <article
                      className={`dashboard-assistant-chat__bubble dashboard-assistant-chat__bubble--${message.role}`}
                      key={message.id}
                    >
                      <p>
                        {message.text}
                        {typingMessageId === message.id ? <span aria-hidden="true" className="dashboard-assistant__cursor">|</span> : null}
                      </p>
                    </article>
                  ))}
                </div>

                <form className="dashboard-assistant-chat__composer" onSubmit={handleSendMessage}>
                  <input
                    onChange={(event) => setChatInput(event.target.value)}
                    placeholder="Write a question"
                    type="text"
                    value={chatInput}
                  />
                  <button
                    aria-label="Send message"
                    type="submit"
                  >
                    <svg viewBox="0 0 24 24">
                      <line x1="22" x2="11" y1="2" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="dashboard-summary-grid">
        <WaterLevelCard points={waterTrend} />
        <SoilMoistureCard columns={moistureColumns} />
      </div>
    </div>
  );
}

export default DashboardPage;
