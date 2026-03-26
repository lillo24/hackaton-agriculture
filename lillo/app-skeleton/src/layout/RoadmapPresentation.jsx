import { useEffect, useRef, useState } from 'react';
import './RoadmapPresentation.css';

const slideshowSteps = [
  {
    id: 'intro',
    title: 'Canvas',
    caption: 'Distribuzione uno-a-molti. Tocca il palco per avviare la sequenza.',
  },
  {
    id: 'company',
    title: 'Platform',
    caption: 'Il nodo Company / Platform entra in scena come hub segnali.',
  },
  {
    id: 'consorzio',
    title: 'Consorzio',
    caption: 'Il Consorzio appare come centro operativo per territorio e filiera.',
  },
  {
    id: 'bridge',
    title: 'Connessione',
    caption: 'Si genera il collegamento tra piattaforma e Consorzio.',
  },
  {
    id: 'farmers',
    title: 'Distribuzione',
    caption: 'Il Consorzio abilita molte aziende agricole collegate.',
  },
  {
    id: 'costi',
    title: 'Costi',
    caption: 'Non un altro pannello dati, ma un hub di segnali e alert.',
  },
];

const farmerNodes = [
  { id: 'farmer-01', label: 'Agricoltore 01', x: '72%', y: '22%', length: '37%', angle: '-58deg', delay: '0.04s' },
  { id: 'farmer-02', label: 'Agricoltore 02', x: '84%', y: '30%', length: '39%', angle: '-30deg', delay: '0.11s' },
  { id: 'farmer-03', label: 'Agricoltore 03', x: '79%', y: '46%', length: '29%', angle: '-8deg', delay: '0.2s' },
  { id: 'farmer-04', label: 'Agricoltore 04', x: '86%', y: '62%', length: '38%', angle: '18deg', delay: '0.29s' },
  { id: 'farmer-05', label: 'Agricoltore 05', x: '74%', y: '78%', length: '37%', angle: '49deg', delay: '0.37s' },
  { id: 'farmer-06', label: 'Agricoltore 06', x: '64%', y: '60%', length: '17%', angle: '35deg', delay: '0.44s' },
];

const costPillars = [
  {
    id: 'ui',
    title: 'Prodotto / UI',
    focus: 'Costo in discesa',
    points: ['Strumenti AI accelerano prototipazione e iterazione.', 'Piu energia sulla logica del prodotto, meno sul pixel pushing.'],
  },
  {
    id: 'integration',
    title: 'Ingegneria di integrazione',
    focus: 'Costo principale',
    points: [
      'Connessione fonti eterogenee, normalizzazione e qualita dati.',
      'Traduzione in alert chiari, con priorita e azioni consigliate.',
    ],
  },
  {
    id: 'sources',
    title: 'Costo fonti',
    focus: 'Ottimizzazione continua',
    points: [
      'Mix sostenibile tra open, low-cost e provider premium.',
      'Scelta dinamica della combinazione migliore per scenario.',
    ],
  },
];

const rolloutSteps = [
  { id: 'verticale', title: 'Verticale iniziale', text: 'Partenza da vigneto: segnali, soglie e flussi essenziali.' },
  { id: 'affinamento', title: 'Affinamento', text: 'Feedback di campo per migliorare logiche, alert e onboarding.' },
  { id: 'espansione', title: 'Espansione', text: 'Profilo azienda + dati disponibili + sensori specifici quando utili.' },
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
      <circle cx="12" cy="8.2" r="2.4" />
      <path d="M7.8 18a4.2 4.2 0 0 1 8.4 0" />
      <path d="M5.2 12.2h13.6" />
    </svg>
  );
}

function RoadmapPresentation({ alertsCount, selectedFarm }) {
  const [step, setStep] = useState(0);
  const slideshowRef = useRef(null);
  const lastStep = slideshowSteps.length - 1;
  const canGoBack = step > 0;
  const canAdvance = step < lastStep;
  const showCompany = step >= 1;
  const showConsorzio = step >= 2;
  const showBridge = step >= 3;
  const showFarmers = step >= 4;
  const showCosts = step >= 5;
  const currentStep = slideshowSteps[step];

  const advanceStep = () => {
    setStep((current) => Math.min(lastStep, current + 1));
  };

  const retreatStep = () => {
    setStep((current) => Math.max(0, current - 1));
  };

  const restartStory = () => {
    setStep(0);
  };

  useEffect(() => {
    slideshowRef.current?.focus();
  }, []);

  const handleStageClick = (event) => {
    if (event.target.closest('[data-roadmap-control]')) {
      return;
    }

    if (canAdvance) {
      advanceStep();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (canAdvance) {
        advanceStep();
      }
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
      ref={slideshowRef}
      tabIndex={0}
    >
      <header className="roadmap-presentation__toolbar" data-roadmap-control>
        <div className="roadmap-presentation__context">
          <p className="roadmap-presentation__eyebrow">Roadmap narrativo</p>
          <p className="roadmap-presentation__meta">
            <span>{selectedFarm.label}</span>
            <span>{alertsCount} alert nel demo</span>
          </p>
        </div>

        <div aria-live="polite" className="roadmap-progress">
          <p className="roadmap-progress__label">
            Step {step + 1}/{slideshowSteps.length}: {currentStep.title}
          </p>
          <ol className="roadmap-progress__dots">
            {slideshowSteps.map((progressStep, index) => {
              const statusClass = index === step ? ' is-active' : index < step ? ' is-complete' : '';
              return <li className={statusClass} key={progressStep.id} />;
            })}
          </ol>
        </div>

        <div className="roadmap-presentation__actions">
          <button
            data-roadmap-control
            disabled={!canGoBack}
            onClick={retreatStep}
            type="button"
          >
            Indietro
          </button>
          {canAdvance ? (
            <button data-roadmap-control onClick={advanceStep} type="button">
              Avanti
            </button>
          ) : (
            <button data-roadmap-control onClick={restartStory} type="button">
              Ricomincia
            </button>
          )}
        </div>
      </header>

      <section aria-labelledby="roadmap-story-title" className="roadmap-story">
        <header className="roadmap-story__headline">
          <p className="roadmap-story__kicker">Marketing</p>
          <h1 id="roadmap-story-title">Company -&gt; Consorzio -&gt; molti agricoltori</h1>
          <p>{currentStep.caption}</p>
        </header>

        <div className="roadmap-story__canvas" role="presentation">
          <p className={`roadmap-story__hint${canAdvance ? ' is-visible' : ''}`}>Tocca il canvas per il prossimo step</p>

          {showBridge ? <span aria-hidden="true" className="roadmap-line roadmap-line--bridge" /> : null}

          {showFarmers ? (
            <div aria-hidden="true" className="roadmap-story__fan-lines">
              {farmerNodes.map((node) => (
                <span
                  className="roadmap-line roadmap-line--fan"
                  key={`${node.id}-line`}
                  style={{
                    '--line-angle': node.angle,
                    '--line-delay': node.delay,
                    '--line-length': node.length,
                  }}
                />
              ))}
            </div>
          ) : null}

          {showCompany ? (
            <article className="roadmap-node roadmap-node--company">
              <span className="roadmap-node__icon">
                <CompanyIcon />
              </span>
              <span className="roadmap-node__label">Company / Platform</span>
              <strong>Signal Hub</strong>
            </article>
          ) : null}

          {showConsorzio ? (
            <article className="roadmap-node roadmap-node--consorzio">
              <span className="roadmap-node__icon">
                <ConsorzioIcon />
              </span>
              <span className="roadmap-node__label">Consorzio</span>
              <strong>Nodo abilitante</strong>
            </article>
          ) : null}

          <ul className={`roadmap-farmers${showFarmers ? ' is-visible' : ''}`}>
            {farmerNodes.map((node) => (
              <li
                className="roadmap-node roadmap-node--farmer"
                key={node.id}
                style={{
                  '--node-delay': node.delay,
                  '--node-x': node.x,
                  '--node-y': node.y,
                }}
              >
                <FarmerIcon />
                <span>{node.label}</span>
              </li>
            ))}
          </ul>

          {showFarmers ? <p className="roadmap-farmers__label">Agricoltori</p> : null}
        </div>
      </section>

      <section aria-hidden={!showCosts} className={`roadmap-costs${showCosts ? ' is-visible' : ''}`}>
        <header className="roadmap-costs__heading">
          <p className="roadmap-story__kicker">Costi</p>
          <h2>Dove si concentra il valore economico</h2>
        </header>

        <div className="roadmap-costs__grid">
          {costPillars.map((pillar, index) => (
            <article className={`roadmap-cost-card${pillar.id === 'integration' ? ' roadmap-cost-card--primary' : ''}`} key={pillar.id}>
              <p className="roadmap-cost-card__index">{String(index + 1).padStart(2, '0')}</p>
              <h3>{pillar.title}</h3>
              <p className="roadmap-cost-card__focus">{pillar.focus}</p>
              <ul>
                {pillar.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="roadmap-rollout">
          <p className="roadmap-rollout__label">Evoluzione prodotto</p>
          <div className="roadmap-rollout__steps">
            {rolloutSteps.map((rolloutStep) => (
              <article className="roadmap-rollout__step" key={rolloutStep.id}>
                <h4>{rolloutStep.title}</h4>
                <p>{rolloutStep.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

export default RoadmapPresentation;
