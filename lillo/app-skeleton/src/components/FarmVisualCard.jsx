import SectionCard from './SectionCard';

const markerPalette = ['#3f6e4e', '#77985f', '#5c7f64'];
const defaultMarkers = ['North canopy', 'Lower terrace', 'Irrigation hub'];

function FarmVisualCard({
  farmName = 'Farm context',
  markers = defaultMarkers,
  contextPills = [],
  signalBadges = [],
  showLegend = true,
  subtitle = 'Stylized parcel view for orientation only.',
  title = 'Farm visual context',
  sectionClassName = '',
}) {
  const visibleMarkers = (markers.length ? markers : defaultMarkers).slice(0, 3);
  const visiblePills = contextPills.slice(0, 4);

  return (
    <SectionCard className={sectionClassName} subtitle={subtitle} title={title}>
      <div className="farm-visual-card">
        <div className="farm-visual-card__stage">
          {signalBadges.length ? (
            <ul aria-label="Signals" className="farm-visual-card__signals">
              {signalBadges.map((signal) => (
                <li
                  className={`farm-visual-card__signal-item ${signal.connected ? 'is-connected' : 'is-broken'}`}
                  key={signal.id}
                  title={`${signal.label}: ${signal.connected ? 'connected' : 'broken'}`}
                >
                  <span className="farm-visual-card__signal-icon">{signal.icon}</span>
                  <span className="farm-visual-card__signal-copy">
                    <strong>{signal.label}</strong>
                    <small>{signal.statusLabel ?? (signal.connected ? 'Active' : 'Inactive')}</small>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          <svg
            aria-label={`${farmName} static parcel illustration`}
            className="farm-visual-card__scene"
            role="img"
            viewBox="0 0 320 190"
          >
            <defs>
              <linearGradient id="farm-tile-1" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#dce9c9" />
                <stop offset="100%" stopColor="#9dbd84" />
              </linearGradient>
              <linearGradient id="farm-tile-2" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#d4e3be" />
                <stop offset="100%" stopColor="#91b575" />
              </linearGradient>
              <linearGradient id="farm-tile-3" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#c8dcae" />
                <stop offset="100%" stopColor="#7ea466" />
              </linearGradient>
              <linearGradient id="farm-tile-4" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#d0e2ba" />
                <stop offset="100%" stopColor="#8bb271" />
              </linearGradient>
            </defs>

            <polygon fill="#6c5135" points="50,95 160,152 160,184 50,127" />
            <polygon fill="#7a5c3d" points="160,152 270,95 270,127 160,184" />
            <polygon
              fill="none"
              points="160,38 270,95 160,152 50,95"
              stroke="#5f7b4d"
              strokeLinejoin="round"
              strokeWidth="2"
            />

            <g stroke="#6d8f5e" strokeLinejoin="round" strokeWidth="1.6">
              <polygon fill="url(#farm-tile-1)" points="160,38 215,66 160,95 105,66" />
              <polygon fill="url(#farm-tile-2)" points="215,66 270,95 215,124 160,95" />
              <polygon fill="url(#farm-tile-3)" points="160,95 215,124 160,152 105,124" />
              <polygon fill="url(#farm-tile-4)" points="105,66 160,95 105,124 50,95" />
            </g>
          </svg>

          {visiblePills.map((pill, index) => (
            <article className={`farm-visual-card__pill farm-visual-card__pill--${index + 1}`} key={`${pill.label}-${pill.value}`}>
              <span>{pill.label}</span>
              <strong>{pill.value}</strong>
            </article>
          ))}
        </div>

        {showLegend ? (
          <ul className="farm-visual-card__legend">
            {visibleMarkers.map((marker, index) => (
              <li key={`${marker}-${index}`}>
                <span style={{ backgroundColor: markerPalette[index % markerPalette.length] }} />
                {marker}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </SectionCard>
  );
}

export default FarmVisualCard;
