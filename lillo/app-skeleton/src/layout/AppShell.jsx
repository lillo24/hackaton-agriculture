import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import IntroTerminal from '../components/IntroTerminal';
import PhoneFrame from '../components/PhoneFrame';
import RoadmapPresentation from './RoadmapPresentation';
import './AppShell.css';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/alerts', label: 'Alerts', icon: 'alerts', end: true },
  { to: '/alert', label: 'Alert', icon: 'alert', end: true },
  { to: '/profile', label: 'Profile', icon: 'profile', end: true },
];

const previewModes = [
  { id: 'phone', label: 'Phone' },
  { id: 'desktop', label: 'Desktop' },
  { id: 'roadmap', label: 'Roadmap' },
];

function NavIcon({ icon }) {
  if (icon === 'dashboard') {
    return (
      <svg aria-hidden="true" className="mobile-app__nav-icon" viewBox="0 0 24 24">
        <rect height="7" rx="2" width="7" x="3" y="3" />
        <rect height="7" rx="2" width="11" x="10" y="3" />
        <rect height="11" rx="2" width="7" x="3" y="10" />
        <rect height="11" rx="2" width="11" x="10" y="10" />
      </svg>
    );
  }

  if (icon === 'alerts') {
    return (
      <svg aria-hidden="true" className="mobile-app__nav-icon" viewBox="0 0 24 24">
        <path d="M4 7.5h16" />
        <path d="M4 12h11" />
        <path d="M4 16.5h14" />
      </svg>
    );
  }

  if (icon === 'alert') {
    return (
      <svg aria-hidden="true" className="mobile-app__nav-icon" viewBox="0 0 24 24">
        <path d="M12 4a4.5 4.5 0 0 0-4.5 4.5V11c0 .8-.3 1.6-.8 2.2L5.3 15c-.4.5 0 1.2.6 1.2h12.2c.6 0 1-.7.6-1.2l-1.4-1.8a3.6 3.6 0 0 1-.8-2.2V8.5A4.5 4.5 0 0 0 12 4Z" />
        <path d="M10.4 18.2a1.8 1.8 0 0 0 3.2 0" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="mobile-app__nav-icon" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M6.8 18a5.2 5.2 0 0 1 10.4 0" />
    </svg>
  );
}

function PreviewApp({ previewMode }) {
  const location = useLocation();
  const contentClassName = `mobile-app__content${location.pathname === '/alerts' ? ' mobile-app__content--alerts' : ''}`;

  return (
    <div className={`mobile-app mobile-app--${previewMode}`}>
      <main className={contentClassName}>
        <Outlet />
      </main>

      <nav className="mobile-app__nav" aria-label="Primary">
        {navItems.map((item) => (
          <NavLink
            className={({ isActive }) => `mobile-app__nav-link${isActive ? ' is-active' : ''}`}
            end={item.end}
            key={item.to}
            to={item.to}
          >
            <NavIcon icon={item.icon} />
            <span className="mobile-app__nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function AppShell({ alerts = [] }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [previewMode, setPreviewMode] = useState('phone');
  const [startupSequencePending, setStartupSequencePending] = useState(
    location.pathname === '/' || location.pathname === '/dashboard',
  );
  const [startupSequenceKey, setStartupSequenceKey] = useState(0);
  const [terminalPhase, setTerminalPhase] = useState('hidden');
  const previewApp = <PreviewApp previewMode={previewMode} />;
  const isRoadmap = previewMode === 'roadmap';
  const isPhonePreview = previewMode === 'phone';
  const isDashboardRoute = location.pathname === '/dashboard';
  const startupAlert = alerts[0] ?? null;
  const shouldQueueTerminalIntro = isPhonePreview && isDashboardRoute && startupSequencePending;
  const isTerminalBubbleActive = isPhonePreview && isDashboardRoute && terminalPhase === 'bubble';
  const shouldHoldIntroStage = shouldQueueTerminalIntro || isTerminalBubbleActive;
  const isTerminalIntroActive = isPhonePreview && isDashboardRoute && terminalPhase !== 'hidden';
  const canStartTerminalSequence = shouldQueueTerminalIntro && terminalPhase === 'visible';

  useEffect(() => {
    if (shouldQueueTerminalIntro) {
      setTerminalPhase('visible');
    }
  }, [shouldQueueTerminalIntro, startupSequenceKey]);

  useEffect(() => {
    if (!canStartTerminalSequence) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.code !== 'Space' && event.key !== ' ') {
        return;
      }

      const target = event.target;
      const interactiveTarget =
        target instanceof Element ? target.closest('button, a, input, textarea, select, [role="button"]') : null;
      const isEditableTarget = target instanceof HTMLElement && target.isContentEditable;

      if (interactiveTarget || isEditableTarget) {
        return;
      }

      event.preventDefault();
      setTerminalPhase((currentPhase) => (currentPhase === 'visible' ? 'running' : currentPhase));
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canStartTerminalSequence]);

  function handleReplayIntro() {
    setPreviewMode('phone');
    setStartupSequencePending(true);
    setTerminalPhase('hidden');
    setStartupSequenceKey((currentKey) => currentKey + 1);

    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  }

  function handleSkipIntro() {
    setStartupSequencePending(false);
    setTerminalPhase('hidden');
  }

  function handleStartTerminalSequence() {
    setTerminalPhase((currentPhase) => (currentPhase === 'visible' ? 'running' : currentPhase));
  }

  function handleTerminalPhaseComplete(completedPhase) {
    if (completedPhase === 'running') {
      setTerminalPhase((currentPhase) => (currentPhase === 'running' ? 'collapsing' : currentPhase));
      return;
    }

    if (completedPhase === 'collapsing') {
      setTerminalPhase((currentPhase) => (currentPhase === 'collapsing' ? 'bubble' : currentPhase));
      setStartupSequencePending(false);
    }
  }

  return (
    <div className={`app-shell app-shell--${previewMode}`}>
      <div className={`app-shell__top-toggle${isRoadmap ? ' app-shell__top-toggle--roadmap' : ''}`}>
        <div
          aria-label="Preview mode selector"
          className={`app-shell__mode-toggle${isRoadmap ? ' app-shell__mode-toggle--roadmap' : ''}`}
          role="tablist"
        >
          {previewModes.map((mode) => {
            const isActive = previewMode === mode.id;

            return (
              <button
                aria-selected={isActive}
                className={`app-shell__mode-toggle-button${isActive ? ' is-active' : ''}`}
                key={mode.id}
                onClick={() => setPreviewMode(mode.id)}
                role="tab"
                type="button"
              >
                {mode.label}
              </button>
            );
          })}
        </div>

        {isPhonePreview ? (
          <button
            className={`app-shell__intro-button${
              shouldHoldIntroStage ? ' app-shell__intro-button--skip' : ' app-shell__intro-button--replay'
            }`}
            onClick={shouldHoldIntroStage ? handleSkipIntro : handleReplayIntro}
            type="button"
          >
            {shouldHoldIntroStage ? 'Skip intro' : 'Replay intro'}
          </button>
        ) : null}
      </div>

      <section className={`app-shell__preview-stage app-shell__preview-stage--${previewMode}`}>
        {isRoadmap ? (
          <RoadmapPresentation />
        ) : previewMode === 'phone' ? (
          <div
            className={`app-shell__phone-pitch-stage${
              isTerminalIntroActive ? ' app-shell__phone-pitch-stage--intro-active' : ''
            }${canStartTerminalSequence ? ' app-shell__phone-pitch-stage--waiting' : ''}`}
            onClick={canStartTerminalSequence ? handleStartTerminalSequence : undefined}
          >
            <IntroTerminal
              onPhaseComplete={handleTerminalPhaseComplete}
              phase={isTerminalIntroActive ? terminalPhase : 'hidden'}
            />
            <PhoneFrame
              enableStartupSequence={shouldHoldIntroStage}
              startupAlert={startupAlert}
              startupSequenceKey={startupSequenceKey}
              startupShouldBegin={false}
            >
              {previewApp}
            </PhoneFrame>
            {isTerminalIntroActive ? <div aria-hidden="true" className="app-shell__phone-pitch-spacer" /> : null}
          </div>
        ) : (
          <div className="desktop-preview-frame">{previewApp}</div>
        )}
      </section>
    </div>
  );
}

export default AppShell;
