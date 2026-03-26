import SectionCard from './SectionCard';

const markerPalette = ['#3f6e4e', '#77985f', '#5c7f64'];
const defaultMarkers = ['North canopy', 'Lower terrace', 'Irrigation hub'];

function FarmVisualCard({
  farmName = 'Farm context',
  markers = defaultMarkers,
  contextPills = [],
  showLegend = true,
  subtitle = 'Stylized parcel view for orientation only.',
  title = 'Farm visual context',
}) {
  const visibleMarkers = (markers.length ? markers : defaultMarkers).slice(0, 3);
  const visiblePills = contextPills.slice(0, 4);

  return (
    <SectionCard subtitle={subtitle} title={title}>
      <div className="farm-visual-card">
        <div className="farm-visual-card__stage">
          <svg
            aria-label={`${farmName} static parcel illustration`}
            className="farm-visual-card__scene"
            role="img"
            viewBox="0 0 320 190"
          >
            <defs>
              <linearGradient id="farm-plateau-top" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#dbe7d2" />
                <stop offset="100%" stopColor="#95ad84" />
              </linearGradient>
              <linearGradient id="farm-plateau-side" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#84a070" />
                <stop offset="100%" stopColor="#5f7d55" />
              </linearGradient>
            </defs>

            <rect fill="#f2ebdb" height="190" rx="22" width="320" />

            <polygon fill="url(#farm-plateau-top)" points="52,72 181,30 283,83 156,127" />
            <polygon fill="url(#farm-plateau-side)" points="52,72 52,116 156,168 156,127" />
            <polygon fill="#6d8b60" points="156,127 156,168 283,122 283,83" />

            <polyline fill="none" points="94,58 221,112 221,153" stroke="#c7d7bc" strokeDasharray="4 6" strokeWidth="1.8" />
            <polyline fill="none" points="133,45 133,145" stroke="#c7d7bc" strokeDasharray="4 6" strokeWidth="1.8" />
            <polyline fill="none" points="93,95 234,52" stroke="#d7e3d0" strokeWidth="1.6" />

            <g fill="#3a5d45">
              <circle cx="91" cy="74" r="8" />
              <circle cx="118" cy="65" r="8" />
              <circle cx="147" cy="56" r="8" />
              <circle cx="177" cy="63" r="8" />
              <circle cx="206" cy="73" r="8" />
              <circle cx="233" cy="83" r="8" />
            </g>

            <g stroke="#f8fbf7" strokeWidth="2.2">
              <circle cx="104" cy="100" fill="#3f6e4e" r="7" />
              <circle cx="168" cy="80" fill="#77985f" r="7" />
              <circle cx="214" cy="110" fill="#5c7f64" r="7" />
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
