import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './RoadmapPresentation.css';

const TOTAL_STEPS = 8;

const CONSORZIO_CENTER = { x: 50, y: 50 };
const FARMER_ARC_ANGLES = [-72, -46, -20, 20, 46, 72];
const FARMER_ARC_RADIUS = { x: 30, y: 27 };

function formatPoint(value) {
  return Number(value.toFixed(2));
}

function getElementCenter(element, stageRect) {
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();

  return {
    x: formatPoint(rect.left - stageRect.left + rect.width / 2),
    y: formatPoint(rect.top - stageRect.top + rect.height / 2),
  };
}

const farmerNodes = FARMER_ARC_ANGLES.map((angle, index, angles) => {
  const radians = (angle * Math.PI) / 180;
  const x = CONSORZIO_CENTER.x + FARMER_ARC_RADIUS.x * Math.cos(radians);
  const y = CONSORZIO_CENTER.y + FARMER_ARC_RADIUS.y * Math.sin(radians);

  return {
    id: `farmer-${String(index + 1).padStart(2, '0')}`,
    x: `${x.toFixed(2)}%`,
    y: `${y.toFixed(2)}%`,
    delay: `${(0.08 + index * 0.07).toFixed(2)}s`,
    branchDelay: `${(0.42 + index * 0.11).toFixed(2)}s`,
    order: index - (angles.length - 1) / 2,
  };
});

const TOP_FARMER = farmerNodes.reduce((currentTop, node) => {
  if (parseFloat(node.y) < parseFloat(currentTop.y)) {
    return node;
  }

  return currentTop;
}, farmerNodes[0]);

const identikitTokens = [
  { id: 'sensor', label: 'Sensori', icon: 'sensor', offsetX: -78, offsetY: -88, delay: '0.02s' },
  { id: 'crop', label: 'Coltura', icon: 'crop', offsetX: 88, offsetY: -30, delay: '0.12s' },
];

const costSlices = [
  { id: 'ui', label: 'UI + Prodotto', time: '2w', cost: '€6k', weight: 34 },
  { id: 'integration', label: 'Integrazioni dati', time: '5w', cost: '€18k', weight: 100, primary: true },
  { id: 'rollout', label: 'Rollout', time: '3w', cost: '€9k', weight: 50 },
  { id: 'ops', label: 'Ops mensile', time: 'continuo', cost: '€2k', weight: 20 },
];

function CompanyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M3.8 19.5h16.4" />
      <path d="M6.2 19.5V8.4a1.2 1.2 0 0 1 1.2-1.2h4.2a1.2 1.2 0 0 1 1.2 1.2v11.1" />
      <path d="M12.8 19.5V11.2a1.2 1.2 0 0 1 1.2-1.2h2.6a1.2 1.2 0 0 1 1.2 1.2v8.3" />
      <path d="M8.6 10.4h1.8" />
      <path d="M8.6 13.3h1.8" />
      <path d="M15.1 13.2h1.1" />
      <path d="M15.1 15.9h1.1" />
      <path d="M9.5 19.5v-3.2" />
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

function SensorSetupIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 5v14" />
      <path d="M8.5 8.5 12 5l3.5 3.5" />
      <path d="M5.5 12a6.5 6.5 0 0 1 13 0" />
      <circle cx="12" cy="18.2" r="1.8" />
    </svg>
  );
}

function CropTypeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 4.8v14.4" />
      <path d="M12 8c1.8 0 3.2-1.5 3.2-3.3C13.4 4.7 12 6.2 12 8Z" />
      <path d="M12 10.9c1.7 0 3.1-1.4 3.1-3.1-1.7 0-3.1 1.4-3.1 3.1Z" />
      <path d="M12 13.8c1.6 0 2.9-1.3 2.9-2.9-1.6 0-2.9 1.3-2.9 2.9Z" />
      <path d="M12 9.3c-1.8 0-3.2-1.5-3.2-3.3 1.8 0 3.2 1.5 3.2 3.3Z" />
      <path d="M12 12.2c-1.7 0-3.1-1.4-3.1-3.1 1.7 0 3.1 1.4 3.1 3.1Z" />
      <path d="M12 15c-1.5 0-2.8-1.2-2.8-2.8 1.5 0 2.8 1.2 2.8 2.8Z" />
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
  const [connectionLayout, setConnectionLayout] = useState({
    width: 0,
    height: 0,
    bridgePath: '',
    trunkPath: '',
    branchPaths: {},
    farmerCenters: {},
  });
  const roadmapRef = useRef(null);
  const stageRef = useRef(null);
  const companyRef = useRef(null);
  const consorzioRef = useRef(null);
  const farmerRefs = useRef({});
  const lastStep = TOTAL_STEPS - 1;
  const canGoBack = step > 0;
  const canAdvance = step < lastStep;
  const showCompany = step >= 1;
  const showConsorzio = step >= 2;
  const showBridge = step >= 3;
  const showFarmers = step >= 4;
  const showProfileFocus = step >= 5 && step < 7;
  const showIdentikit = step >= 6 && step < 7;
  const showCosts = step >= 7;
  const focusFarmerCenter = connectionLayout.farmerCenters[TOP_FARMER.id];

  useEffect(() => {
    roadmapRef.current?.focus();
  }, []);

  useLayoutEffect(() => {
    const stageElement = stageRef.current;

    if (!stageElement) {
      return undefined;
    }

    let frameId = 0;

    const measureConnections = () => {
      const stageRect = stageElement.getBoundingClientRect();

      if (!stageRect.width || !stageRect.height) {
        return;
      }

      const width = formatPoint(stageRect.width);
      const height = formatPoint(stageRect.height);
      const nextLayout = {
        width,
        height,
        bridgePath: '',
        trunkPath: '',
        branchPaths: {},
        farmerCenters: {},
      };

      const companyCenter = getElementCenter(companyRef.current, stageRect);
      const consorzioCenter = getElementCenter(consorzioRef.current, stageRect);

      if (showBridge && companyCenter && consorzioCenter) {
        const bridgeDistance = consorzioCenter.x - companyCenter.x;
        const bridgeLift = Math.min(Math.max(height * 0.022, 10), 18);

        nextLayout.bridgePath = [
          `M ${companyCenter.x} ${companyCenter.y}`,
          `C ${formatPoint(companyCenter.x + bridgeDistance * 0.34)} ${formatPoint(companyCenter.y + bridgeLift * 0.42)},`,
          `${formatPoint(companyCenter.x + bridgeDistance * 0.74)} ${formatPoint(consorzioCenter.y - bridgeLift * 0.28)},`,
          `${consorzioCenter.x} ${consorzioCenter.y}`,
        ].join(' ');
      }

      if (showFarmers && consorzioCenter) {
        const farmerCenters = farmerNodes
          .map((node) => {
            const element = farmerRefs.current[node.id];
            const center = getElementCenter(element, stageRect);
            return center ? { id: node.id, center, order: node.order } : null;
          })
          .filter(Boolean);

        if (farmerCenters.length > 0) {
          farmerCenters.forEach((node) => {
            nextLayout.farmerCenters[node.id] = node.center;
          });

          const averageFarmerX =
            farmerCenters.reduce((sum, node) => sum + node.center.x, 0) / farmerCenters.length;
          const branchHub = {
            x: formatPoint(consorzioCenter.x + (averageFarmerX - consorzioCenter.x) * 0.34),
            y: consorzioCenter.y,
          };
          const trunkDistance = branchHub.x - consorzioCenter.x;
          const trunkLift = Math.min(Math.max(height * 0.012, 4), 10);
          const branchSpread = Math.min(Math.max(height * 0.012, 6), 12);

          nextLayout.trunkPath = [
            `M ${consorzioCenter.x} ${consorzioCenter.y}`,
            `C ${formatPoint(consorzioCenter.x + trunkDistance * 0.42)} ${formatPoint(consorzioCenter.y + trunkLift * 0.36)},`,
            `${formatPoint(consorzioCenter.x + trunkDistance * 0.78)} ${formatPoint(branchHub.y - trunkLift * 0.22)},`,
            `${branchHub.x} ${branchHub.y}`,
          ].join(' ');

          farmerCenters.forEach((node) => {
            const controlX = formatPoint(branchHub.x + (node.center.x - branchHub.x) * 0.56);
            const controlY = formatPoint(
              branchHub.y + (node.center.y - branchHub.y) * 0.48 + node.order * branchSpread,
            );

            nextLayout.branchPaths[node.id] = `M ${branchHub.x} ${branchHub.y} Q ${controlX} ${controlY} ${node.center.x} ${node.center.y}`;
          });
        }
      }

      setConnectionLayout((current) => {
        const sameLayout =
          current.width === nextLayout.width &&
          current.height === nextLayout.height &&
          current.bridgePath === nextLayout.bridgePath &&
          current.trunkPath === nextLayout.trunkPath &&
          JSON.stringify(current.branchPaths) === JSON.stringify(nextLayout.branchPaths) &&
          JSON.stringify(current.farmerCenters) === JSON.stringify(nextLayout.farmerCenters);

        return sameLayout ? current : nextLayout;
      });
    };

    const scheduleMeasure = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(measureConnections);
    };

    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(stageElement);

    if (companyRef.current) {
      resizeObserver.observe(companyRef.current);
    }

    if (consorzioRef.current) {
      resizeObserver.observe(consorzioRef.current);
    }

    Object.values(farmerRefs.current).forEach((element) => {
      if (element) {
        resizeObserver.observe(element);
      }
    });

    scheduleMeasure();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, [showBridge, showFarmers, showCompany, showConsorzio, step]);

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
      className={`roadmap-presentation roadmap-presentation--step-${step}${showProfileFocus ? ' roadmap-presentation--profile-focus' : ''}${showIdentikit ? ' roadmap-presentation--identikit' : ''}`}
      onClick={handleStageClick}
      onKeyDown={handleKeyDown}
      ref={roadmapRef}
      tabIndex={0}
    >
      <section aria-label="Roadmap canvas" className="roadmap-stage" ref={stageRef} role="presentation">
        {showBridge && connectionLayout.bridgePath ? (
          <svg
            aria-hidden="true"
            className="roadmap-connection-layer roadmap-connection-layer--bridge"
            preserveAspectRatio="none"
            viewBox={`0 0 ${connectionLayout.width} ${connectionLayout.height}`}
          >
            <path className="roadmap-path roadmap-path--bridge" d={connectionLayout.bridgePath} pathLength="1" />
          </svg>
        ) : null}

        {showFarmers && connectionLayout.trunkPath ? (
          <svg
            aria-hidden="true"
            className="roadmap-connection-layer roadmap-connection-layer--distribution"
            preserveAspectRatio="none"
            viewBox={`0 0 ${connectionLayout.width} ${connectionLayout.height}`}
          >
            <path className="roadmap-path roadmap-path--trunk" d={connectionLayout.trunkPath} pathLength="1" />
            {farmerNodes.map((node) => (
              <path
                className={`roadmap-path roadmap-path--branch${node.id === TOP_FARMER.id ? ' roadmap-path--focus-branch' : ''}`}
                d={connectionLayout.branchPaths[node.id]}
                key={`${node.id}-line`}
                pathLength="1"
                style={{ '--path-delay': node.branchDelay }}
              />
            ))}
          </svg>
        ) : null}

        {showCompany ? (
          <article className="roadmap-node roadmap-node--company" ref={companyRef}>
            <span className="roadmap-node__icon">
              <CompanyIcon />
            </span>
            <span className="roadmap-node__label">Start-Up</span>
          </article>
        ) : null}

        {showConsorzio ? (
          <article className={`roadmap-node roadmap-node--consorzio${showFarmers ? ' is-distributing' : ''}`} ref={consorzioRef}>
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
              className={`roadmap-node roadmap-node--farmer${node.id === TOP_FARMER.id && showProfileFocus ? ' is-selected' : ''}`}
              key={node.id}
              ref={(element) => {
                if (element) {
                  farmerRefs.current[node.id] = element;
                  return;
                }

                delete farmerRefs.current[node.id];
              }}
              style={{
                '--node-delay': node.delay,
                '--node-x': node.x,
                '--node-y': node.y,
              }}
            >
              <span className="roadmap-node__farmer-core">
                <FarmerIcon />
              </span>
            </li>
          ))}
        </ul>

        {showIdentikit && focusFarmerCenter ? (
          <div
            aria-hidden="true"
            className="roadmap-identikit"
            style={{
              '--identikit-origin-x': `${focusFarmerCenter.x}px`,
              '--identikit-origin-y': `${focusFarmerCenter.y}px`,
            }}
          >
            {identikitTokens.map((token) => (
              <article
                className={`roadmap-identikit__token roadmap-identikit__token--${token.id}`}
                key={token.id}
                style={{
                  '--burst-x': `${token.offsetX}px`,
                  '--burst-y': `${token.offsetY}px`,
                  '--burst-delay': token.delay,
                }}
              >
                <span className="roadmap-identikit__icon">
                  {token.icon === 'sensor' ? <SensorSetupIcon /> : <CropTypeIcon />}
                </span>
                <span className="roadmap-identikit__copy">{token.label}</span>
              </article>
            ))}

            <span
              className="roadmap-identikit__caption"
              style={{
                '--burst-x': '62px',
                '--burst-y': '54px',
                '--burst-delay': '0.22s',
              }}
            >
              Alert mirati
            </span>
          </div>
        ) : null}

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
