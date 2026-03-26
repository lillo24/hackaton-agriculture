import { useEffect, useRef, useState } from 'react';
import './IntroTerminal.css';

const TERMINAL_LINES = [
  { id: 'init-profile', tag: 'init', text: 'loading simulation profile', delay: 140 },
  { id: 'init-config', tag: 'init', text: 'config checksum verified', delay: 150 },
  { id: 'sensor-air', tag: 'sensor', text: 'air_temp stream online', delay: 170 },
  { id: 'sensor-soil-temp', tag: 'sensor', text: 'soil_temp stream online', delay: 170 },
  { id: 'sensor-soil-moisture', tag: 'sensor', text: 'soil_moisture stream online', delay: 185 },
  { id: 'meteo-forecast', tag: 'meteo', text: 'forecast horizon loaded', delay: 220 },
  { id: 'meteo-baseline', tag: 'meteo', text: 'historical baseline synced', delay: 220 },
  { id: 'calc-normalize', tag: 'calc', text: 'normalizing vineyard signals', delay: 260 },
  { id: 'calc-window', tag: 'calc', text: 'anomaly window detected', delay: 290 },
  { id: 'risk-score', tag: 'risk', text: 'frost_risk = 92', delay: 320 },
  { id: 'risk-field', tag: 'risk', text: 'priority = vineyard_north', delay: 250 },
  { id: 'alert-ready', tag: 'alert', text: 'notification payload ready', delay: 340 },
  { id: 'export-handoff', tag: 'export', text: 'pitch handoff locked', delay: 360 },
];

const COMPLETE_PAUSE_MS = 320;
const COLLAPSE_DURATION_MS = 480;

function getStatusCopy(phase) {
  if (phase === 'running') {
    return 'Running';
  }

  if (phase === 'collapsing') {
    return 'Compressing';
  }

  if (phase === 'bubble') {
    return 'Node';
  }

  return 'Idle';
}

function getFooterCopy(phase) {
  if (phase === 'running') {
    return 'Streaming deterministic demo telemetry';
  }

  if (phase === 'collapsing') {
    return 'Condensing the simulation window into a single decision core';
  }

  if (phase === 'bubble') {
    return 'Decision core stable. Branch lines hook in here next.';
  }

  return 'Click the stage or press Space to run the simulation';
}

function IntroTerminal({ phase = 'hidden', onPhaseComplete }) {
  const [visibleLineCount, setVisibleLineCount] = useState(0);
  const outputRef = useRef(null);
  const timeoutIdsRef = useRef([]);
  const onPhaseCompleteRef = useRef(onPhaseComplete);
  const hasReportedRunCompletionRef = useRef(false);
  const hasReportedCollapseCompletionRef = useRef(false);

  useEffect(() => {
    onPhaseCompleteRef.current = onPhaseComplete;
  }, [onPhaseComplete]);

  useEffect(() => {
    timeoutIdsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutIdsRef.current = [];

    if (phase === 'hidden') {
      setVisibleLineCount(0);
      hasReportedRunCompletionRef.current = false;
      hasReportedCollapseCompletionRef.current = false;
      return undefined;
    }

    if (phase === 'visible') {
      setVisibleLineCount(0);
      hasReportedRunCompletionRef.current = false;
      hasReportedCollapseCompletionRef.current = false;
      return undefined;
    }

    if (phase === 'collapsing') {
      setVisibleLineCount(TERMINAL_LINES.length);

      const collapseTimeoutId = window.setTimeout(() => {
        if (hasReportedCollapseCompletionRef.current) {
          return;
        }

        hasReportedCollapseCompletionRef.current = true;
        onPhaseCompleteRef.current?.('collapsing');
      }, COLLAPSE_DURATION_MS);

      timeoutIdsRef.current.push(collapseTimeoutId);
      return () => {
        timeoutIdsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
        timeoutIdsRef.current = [];
      };
    }

    if (phase === 'bubble') {
      setVisibleLineCount(TERMINAL_LINES.length);
      return undefined;
    }

    setVisibleLineCount(0);
    hasReportedRunCompletionRef.current = false;
    hasReportedCollapseCompletionRef.current = false;

    let elapsedDelay = 0;

    TERMINAL_LINES.forEach((line, index) => {
      elapsedDelay += line.delay;

      const timeoutId = window.setTimeout(() => {
        setVisibleLineCount(index + 1);
      }, elapsedDelay);

      timeoutIdsRef.current.push(timeoutId);
    });

    const completionTimeoutId = window.setTimeout(() => {
      if (hasReportedRunCompletionRef.current) {
        return;
      }

      hasReportedRunCompletionRef.current = true;
      onPhaseCompleteRef.current?.('running');
    }, elapsedDelay + COMPLETE_PAUSE_MS);

    timeoutIdsRef.current.push(completionTimeoutId);

    return () => {
      timeoutIdsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutIdsRef.current = [];
    };
  }, [phase]);

  useEffect(() => {
    if (!outputRef.current || visibleLineCount === 0) {
      return;
    }

    outputRef.current.scrollTo({
      top: outputRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [visibleLineCount]);

  if (phase === 'hidden') {
    return null;
  }

  return (
    <aside
      aria-label="Scripted risk simulation terminal"
      className={`intro-terminal intro-terminal--${phase}`}
    >
      <div className="intro-terminal__window">
        <div className="intro-terminal__shell">
          <header className="intro-terminal__topbar">
            <div aria-hidden="true" className="intro-terminal__dots">
              <span className="intro-terminal__dot intro-terminal__dot--red" />
              <span className="intro-terminal__dot intro-terminal__dot--amber" />
              <span className="intro-terminal__dot intro-terminal__dot--green" />
            </div>
            <div className="intro-terminal__title-group">
              <p className="intro-terminal__title">risk-sim.sh</p>
              <p className="intro-terminal__subtitle">Unite pitch replay</p>
            </div>
            <span className={`intro-terminal__status intro-terminal__status--${phase}`}>
              {getStatusCopy(phase)}
            </span>
          </header>

          <div className="intro-terminal__body">
            <div className="intro-terminal__bootline">
              <span className="intro-terminal__prompt-label">unite@edge</span>
              <span className="intro-terminal__prompt-path">~/sim</span>
              <span className="intro-terminal__prompt-command">./risk-sim.sh --field vineyard_north</span>
            </div>

            <div aria-live="polite" className="intro-terminal__output" ref={outputRef}>
              {TERMINAL_LINES.slice(0, visibleLineCount).map((line) => (
                <p className={`intro-terminal__line intro-terminal__line--${line.tag}`} key={line.id}>
                  <span className="intro-terminal__tag">[{line.tag}]</span>
                  <span className="intro-terminal__text">{line.text}</span>
                </p>
              ))}

              {phase === 'visible' || phase === 'running' ? (
                <div className="intro-terminal__cursor-row" aria-hidden="true">
                  <span className="intro-terminal__cursor-label">_</span>
                  <span className="intro-terminal__cursor" />
                </div>
              ) : null}
            </div>
          </div>

          <footer className="intro-terminal__footer">
            <p>{getFooterCopy(phase)}</p>
          </footer>
        </div>

        <div aria-hidden="true" className="intro-terminal__core">
          <span className="intro-terminal__core-ring" />
          <span className="intro-terminal__core-dot" />
        </div>
      </div>
    </aside>
  );
}

export default IntroTerminal;
