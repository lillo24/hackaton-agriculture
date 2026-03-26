import { useEffect, useRef, useState } from 'react';
import './RoadmapPresentation.css';

const TOTAL_STEPS = 6;

const CONSORZIO_CENTER = { x: 50, y: 50 };
const BRANCH_HUB = { x: 62, y: 50 };
const FARMER_ARC_ANGLES = [-72, -46, -20, 20, 46, 72];
const FARMER_ARC_RADIUS = { x: 30, y: 27 };
const COMPANY_BRIDGE_PATH = 'M 31.2 53.2 C 35.8 54.1, 40.8 51.4, 45.4 50.2';
const DISTRIBUTION_TRUNK_PATH = 'M 50 50 C 53.8 50.4, 57.1 49.8, 62 50';

const farmerNodes = FARMER_ARC_ANGLES.map((angle, index, angles) => {
  const radians = (angle * Math.PI) / 180;
  const x = CONSORZIO_CENTER.x + FARMER_ARC_RADIUS.x * Math.cos(radians);
  const y = CONSORZIO_CENTER.y + FARMER_ARC_RADIUS.y * Math.sin(radians);
  const centerOffset = index - (angles.length - 1) / 2;
  const controlX = (BRANCH_HUB.x + x) / 2 + 2.8;
  const controlY = (BRANCH_HUB.y + y) / 2 + centerOffset * 1.6;

  return {
    id: `farmer-${String(index + 1).padStart(2, '0')}`,
    x: `${x.toFixed(2)}%`,
    y: `${y.toFixed(2)}%`,
    delay: `${(0.08 + index * 0.07).toFixed(2)}s`,
    branchDelay: `${(0.42 + index * 0.11).toFixed(2)}s`,
    branchPath: `M ${BRANCH_HUB.x} ${BRANCH_HUB.y} Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)}`,
  };
});

const costSlices = [
  { id: 'ui', label: 'UI + Prodotto', time: '2w', cost: '€6k', weight: 34 },
  { id: 'integration', label: 'Integrazioni dati', time: '5w', cost: '€18k', weight: 100, primary: true },
  { id: 'rollout', label: 'Rollout', time: '3w', cost: '€9k', weight: 50 },
  { id: 'ops', label: 'Ops mensile', time: 'continuo', cost: '€2k', weight: 20 },
];

function CompanyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect height="13" rx="2.8" width="18" x="3" y="6" />
      <path d="M8 4h8" />
      <path d="M8 10h8" />
      <circle cx="8" cy="16" r="1.2" />
      <circle cx="12" cy="16" r="1.2" />
      <circle cx="16" cy="16" r="1.2" />
    </svg>
  );
}

function ConsorzioIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="7.4" r="2.2" />
      <circle cx="6.6" cy="11.2" r="2" />
      <circle cx="17.4" cy="11.2" r="2" />
      <path d="M5 17a3.6 3.6 0 0 1 3.6-3.6h6.8A3.6 3.6 0 0 1 19 17" />
    </svg>
  );
}

function FarmerIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4.8 9.1h14.4" />
      <path d="M8.3 9.1c0-2 1.7-3.7 3.7-3.7s3.7 1.7 3.7 3.7" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M7.4 18.1a4.6 4.6 0 0 1 9.2 0" />
      <path d="M10.1 15.1 12 16.4l1.9-1.3" />
    </svg>
  );
}

function ArrowIcon({ direction }) {
  const transform = direction === 'back' ? 'rotate(180 12 12)' : undefined;

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <g transform={transform}>
        <path d="M6 12h12" />
        <path d="M13 7l5 5-5 5" />
      </g>
    </svg>
  );
}

function RoadmapPresentation() {
  const [step, setStep] = useState(0);
  const roadmapRef = useRef(null);
  const lastStep = TOTAL_STEPS - 1;
  const canGoBack = step > 0;
  const canAdvance = step < lastStep;
  const showCompany = step >= 1;
  const showConsorzio = step >= 2;
  const showBridge = step >= 3;
  const showFarmers = step >= 4;
  const showCosts = step >= 5;

  useEffect(() => {
    roadmapRef.current?.focus();
  }, []);

  const advanceStep = () => {
    if (canAdvance) {
      setStep((current) => Math.min(lastStep, current + 1));
    }
  };

  const retreatStep = () => {
    if (canGoBack) {
      setStep((current) => Math.max(0, current - 1));
    }
  };

  const handleStageClick = (event) => {
    if (event.target.closest('[data-roadmap-control]')) {
      return;
    }

    advanceStep();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      advanceStep();
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      retreatStep();
    }
  };

  return (
    <article
      className={`roadmap-presentation roadmap-presentation--step-${step}`}
      onClick={handleStageClick}
      onKeyDown={handleKeyDown}
      ref={roadmapRef}
      tabIndex={0}
    >
      <section aria-label="Roadmap canvas" className="roadmap-stage" role="presentation">
        {showBridge ? (
          <svg aria-hidden="true" className="roadmap-connection-layer roadmap-connection-layer--bridge" viewBox="0 0 100 100">
            <path className="roadmap-path roadmap-path--bridge" d={COMPANY_BRIDGE_PATH} pathLength="1" />
          </svg>
        ) : null}

        {showFarmers ? (
          <svg
            aria-hidden="true"
            className="roadmap-connection-layer roadmap-connection-layer--distribution"
            viewBox="0 0 100 100"
          >
            <path className="roadmap-path roadmap-path--trunk" d={DISTRIBUTION_TRUNK_PATH} pathLength="1" />
            {farmerNodes.map((node) => (
              <path
                className="roadmap-path roadmap-path--branch"
                d={node.branchPath}
                key={`${node.id}-line`}
                pathLength="1"
                style={{ '--path-delay': node.branchDelay }}
              />
            ))}
          </svg>
        ) : null}

        {showCompany ? (
          <article className="roadmap-node roadmap-node--company">
            <span className="roadmap-node__icon">
              <CompanyIcon />
            </span>
            <span className="roadmap-node__label">Company / Platform</span>
          </article>
        ) : null}

        {showConsorzio ? (
          <article className={`roadmap-node roadmap-node--consorzio${showFarmers ? ' is-distributing' : ''}`}>
            <span className="roadmap-node__icon">
              <ConsorzioIcon />
            </span>
            <span className="roadmap-node__label">Consorzio</span>
          </article>
        ) : null}

        <ul className={`roadmap-farmers${showFarmers ? ' is-visible' : ''}`}>
          {farmerNodes.map((node, index) => (
            <li
              aria-label={`Agricoltore ${index + 1}`}
              className="roadmap-node roadmap-node--farmer"
              key={node.id}
              style={{
                '--node-delay': node.delay,
                '--node-x': node.x,
                '--node-y': node.y,
              }}
            >
              <FarmerIcon />
            </li>
          ))}
        </ul>

        {showCosts ? (
          <aside aria-label="Stima costi e tempi" className="roadmap-costs">
            <header className="roadmap-costs__header">
              <p className="roadmap-costs__title">Costi e tempi</p>
              <p className="roadmap-costs__totals">
                <span>~10 settimane</span>
                <span>~€33k</span>
              </p>
            </header>

            <ul className="roadmap-costs__list">
              {costSlices.map((slice) => (
                <li
                  className={`roadmap-costs__item${slice.primary ? ' is-primary' : ''}`}
                  key={slice.id}
                  style={{ '--cost-width': `${slice.weight}%` }}
                >
                  <p className="roadmap-costs__row">
                    <span className="roadmap-costs__name">{slice.label}</span>
                    <span className="roadmap-costs__time">{slice.time}</span>
                    <span className="roadmap-costs__value">{slice.cost}</span>
                  </p>
                  <span aria-hidden="true" className="roadmap-costs__bar">
                    <span />
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}

        <div className="roadmap-controls" data-roadmap-control>
          <button
            aria-label="Step precedente"
            data-roadmap-control
            disabled={!canGoBack}
            onClick={retreatStep}
            type="button"
          >
            <ArrowIcon direction="back" />
          </button>
          <button
            aria-label="Step successivo"
            data-roadmap-control
            disabled={!canAdvance}
            onClick={advanceStep}
            type="button"
          >
            <ArrowIcon direction="next" />
          </button>
        </div>
      </section>
    </article>
  );
}

export default RoadmapPresentation;
