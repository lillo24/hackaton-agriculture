import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import PhoneFrame from '../components/PhoneFrame';
import './AppShell.css';

const navItems = [
  { to: '/farm-type', label: 'Profile', end: true },
  { to: '/alerts', label: 'Alerts' },
];

const previewModes = [
  { id: 'phone', label: 'Phone' },
  { id: 'desktop', label: 'Desktop' },
];

function PreviewApp({ alerts, previewMode, selectedFarm }) {
  return (
    <div className={`mobile-app mobile-app--${previewMode}`}>
      <header className="mobile-app__topbar">
        <div>
          <p className="mobile-app__brand">AgriSentinel</p>
          <p className="mobile-app__context">{selectedFarm.label} alert workflow</p>
        </div>
        <div className="mobile-app__status-ring">
          <strong>{alerts.length}</strong>
          <span>alerts</span>
        </div>
      </header>

      <main className="mobile-app__content">
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
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function AppShell({ selectedFarm, alerts }) {
  const [previewMode, setPreviewMode] = useState('phone');
  const previewApp = <PreviewApp alerts={alerts} previewMode={previewMode} selectedFarm={selectedFarm} />;

  return (
    <div className={`app-shell app-shell--${previewMode}`}>
      <div className="app-shell__top-toggle">
        <div aria-label="Preview mode selector" className="app-shell__mode-toggle" role="tablist">
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
      </div>

      <section className={`app-shell__preview-stage app-shell__preview-stage--${previewMode}`}>
        {previewMode === 'phone' ? (
          <PhoneFrame>{previewApp}</PhoneFrame>
        ) : (
          <div className="desktop-preview-frame">{previewApp}</div>
        )}
      </section>
    </div>
  );
}

export default AppShell;
