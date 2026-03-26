import { useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import AlertListItem from '../components/AlertListItem';
import SectionCard from '../components/SectionCard';
import StatusBadge from '../components/StatusBadge';
import { alertSeverityScale, alertStatusScale, farmRelevanceScale } from '../data/mockData';

const severityPriority = { critical: 4, high: 3, medium: 2, low: 1 };
const statusPriority = { new: 5, active: 4, monitoring: 3, acknowledged: 2, resolved: 1 };
const relevancePriority = { primary: 3, supporting: 2, background: 1 };

function formatOptionLabel(value) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function readFilter(searchParams, filterName, allowedValues) {
  const rawValue = searchParams.get(filterName);

  if (!rawValue) {
    return 'all';
  }

  return allowedValues.includes(rawValue) ? rawValue : 'all';
}

function recencyPriority(minutesAgo) {
  if (minutesAgo <= 10) {
    return 4;
  }

  if (minutesAgo <= 30) {
    return 3;
  }

  if (minutesAgo <= 90) {
    return 2;
  }

  return 1;
}

function scoreAlertPriority(alert) {
  const severityScore = severityPriority[alert.severity] ?? 0;
  const statusScore = statusPriority[alert.status] ?? 0;
  const relevanceScore = relevancePriority[alert.farmRelevance] ?? 0;
  const recencyScore = recencyPriority(alert.timestampMinutesAgo);

  // Weighted so critical/high and farm-relevant alerts lead, while recency and status still influence ties.
  return severityScore * 50 + relevanceScore * 30 + statusScore * 15 + recencyScore * 5;
}

function rankAlerts(alerts) {
  return alerts
    .slice()
    .sort((left, right) => {
      const scoreDelta = scoreAlertPriority(right) - scoreAlertPriority(left);

      if (scoreDelta !== 0) {
        return scoreDelta;
      }

      if (left.timestampMinutesAgo !== right.timestampMinutesAgo) {
        return left.timestampMinutesAgo - right.timestampMinutesAgo;
      }

      return left.title.localeCompare(right.title);
    });
}

function classifyAlert(alert) {
  if (alert.status === 'resolved') {
    return 'resolved';
  }

  if (alert.severity === 'critical' || alert.severity === 'high' || alert.status === 'new' || alert.status === 'active') {
    return 'actionNow';
  }

  return 'monitor';
}

function AlertsLoadingState() {
  return (
    <div className="alert-list">
      {Array.from({ length: 4 }, (_, index) => (
        <div className="skeleton-card" key={`alert-loading-${index}`} />
      ))}
    </div>
  );
}

function AlertsPage({
  alerts,
  isLoading = false,
  selectedAlertId = null,
  onSelectAlert,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const focusedAlertId = location.state?.focusAlertId ?? selectedAlertId;
  const rankedAlerts = useMemo(() => rankAlerts(alerts), [alerts]);
  const sourceOptions = useMemo(() => {
    const sourceMap = new Map();

    rankedAlerts.forEach((alert) => {
      alert.sources.forEach((source) => {
        sourceMap.set(source.id, source.label);
      });
    });

    return Array.from(sourceMap.entries())
      .map(([id, label]) => ({ id, label }))
      .sort((left, right) => left.label.localeCompare(right.label));
  }, [rankedAlerts]);

  const severityFilter = readFilter(searchParams, 'severity', alertSeverityScale);
  const statusFilter = readFilter(searchParams, 'status', alertStatusScale);
  const sourceFilter = readFilter(searchParams, 'source', sourceOptions.map((source) => source.id));
  const relevanceFilter = readFilter(searchParams, 'relevance', farmRelevanceScale);
  const hasActiveFilters = [severityFilter, statusFilter, sourceFilter, relevanceFilter].some((value) => value !== 'all');
  const filteredAlerts = useMemo(
    () =>
      rankedAlerts.filter((alert) => {
        if (severityFilter !== 'all' && alert.severity !== severityFilter) {
          return false;
        }

        if (statusFilter !== 'all' && alert.status !== statusFilter) {
          return false;
        }

        if (sourceFilter !== 'all' && !alert.sourceIds.includes(sourceFilter)) {
          return false;
        }

        if (relevanceFilter !== 'all' && alert.farmRelevance !== relevanceFilter) {
          return false;
        }

        return true;
      }),
    [rankedAlerts, relevanceFilter, severityFilter, sourceFilter, statusFilter],
  );
  const groupedAlerts = useMemo(() => {
    const nextGroups = {
      actionNow: [],
      monitor: [],
      resolved: [],
    };

    filteredAlerts.forEach((alert) => {
      nextGroups[classifyAlert(alert)].push(alert);
    });

    return nextGroups;
  }, [filteredAlerts]);

  const hasActionNow = groupedAlerts.actionNow.length > 0;
  const returnTo = `${location.pathname}${location.search}`;
  const criticalCount = filteredAlerts.filter((alert) => alert.severity === 'critical').length;
  const activeCount = filteredAlerts.filter((alert) => alert.status === 'new' || alert.status === 'active').length;
  const monitoringCount = filteredAlerts.filter((alert) => alert.status === 'monitoring' || alert.status === 'acknowledged').length;

  function updateFilter(filterName, nextValue) {
    const nextSearch = new URLSearchParams(searchParams);

    if (nextValue === 'all') {
      nextSearch.delete(filterName);
    } else {
      nextSearch.set(filterName, nextValue);
    }

    setSearchParams(nextSearch, { replace: true });
  }

  function clearFilters() {
    setSearchParams({}, { replace: true });
  }

  function handleOpenAlert(alertId) {
    onSelectAlert?.(alertId);
  }

  function renderAlertGroup({ title, subtitle, alertsInGroup, startIndex }) {
    if (alertsInGroup.length === 0) {
      return null;
    }

    return (
      <section className="alert-group" key={title}>
        <header className="alert-group__header">
          <div>
            <h2 className="alert-group__title">{title}</h2>
            <p className="alert-group__subtitle">{subtitle}</p>
          </div>
          <StatusBadge tone="neutral">{alertsInGroup.length}</StatusBadge>
        </header>
        <div className="alert-list">
          {alertsInGroup.map((alert, index) => (
            <AlertListItem
              alert={alert}
              groupLabel={title}
              index={startIndex + index}
              isFocused={focusedAlertId === alert.id}
              key={alert.id}
              returnTo={returnTo}
              onOpenAlert={handleOpenAlert}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="page">
      <SectionCard title="Filters">
        <div className="badge-row">
          <StatusBadge tone="critical">{criticalCount} critical</StatusBadge>
          <StatusBadge tone="active">{activeCount} active</StatusBadge>
          <StatusBadge tone="monitoring">{monitoringCount} monitoring</StatusBadge>
        </div>
        <div className="filter-grid filter-grid--alerts">
          <label className="filter-field" htmlFor="severity-filter">
            Severity
            <select
              className="filter-control"
              id="severity-filter"
              onChange={(event) => updateFilter('severity', event.target.value)}
              value={severityFilter}
            >
              <option value="all">All</option>
              {alertSeverityScale.map((severity) => (
                <option key={severity} value={severity}>
                  {formatOptionLabel(severity)}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field" htmlFor="status-filter">
            Status
            <select
              className="filter-control"
              id="status-filter"
              onChange={(event) => updateFilter('status', event.target.value)}
              value={statusFilter}
            >
              <option value="all">All</option>
              {alertStatusScale.map((status) => (
                <option key={status} value={status}>
                  {formatOptionLabel(status)}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field" htmlFor="source-filter">
            Source
            <select
              className="filter-control"
              id="source-filter"
              onChange={(event) => updateFilter('source', event.target.value)}
              value={sourceFilter}
            >
              <option value="all">All</option>
              {sourceOptions.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.label}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field" htmlFor="relevance-filter">
            Farm relevance
            <select
              className="filter-control"
              id="relevance-filter"
              onChange={(event) => updateFilter('relevance', event.target.value)}
              value={relevanceFilter}
            >
              <option value="all">All</option>
              {farmRelevanceScale.map((relevance) => (
                <option key={relevance} value={relevance}>
                  {formatOptionLabel(relevance)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="filter-footer">
          <p className="filter-footer__summary">{filteredAlerts.length} alerts in current view</p>
          {hasActiveFilters ? (
            <button className="inline-action" onClick={clearFilters} type="button">
              Clear filters
            </button>
          ) : null}
        </div>
      </SectionCard>

      {isLoading ? <AlertsLoadingState /> : null}

      {!isLoading && alerts.length === 0 ? (
        <SectionCard subtitle="This profile currently has no mock signals wired into the shared model." title="No alerts configured">
          <p className="detail-text">No alerts are available for the current profile context.</p>
        </SectionCard>
      ) : null}

      {!isLoading && alerts.length > 0 && filteredAlerts.length === 0 ? (
        <SectionCard subtitle="No alerts match the current filter selection." title="No results for filters">
          <p className="detail-text">Try widening severity, source, or relevance to recover the full operational feed.</p>
          {hasActiveFilters ? (
            <button className="inline-action" onClick={clearFilters} type="button">
              Clear filters
            </button>
          ) : null}
        </SectionCard>
      ) : null}

      {!isLoading && filteredAlerts.length > 0 && !hasActionNow ? (
        <SectionCard subtitle="Current alerts are mostly low intensity or monitoring states." title="No high-priority alerts">
          <p className="detail-text">The feed remains healthy; keep monitoring active and follow the scheduled checks.</p>
        </SectionCard>
      ) : null}

      {!isLoading && filteredAlerts.length > 0 ? (
        <div className="alert-groups">
          {renderAlertGroup({
            title: 'Needs action now',
            subtitle: 'Critical and active signals that should drive the immediate response queue.',
            alertsInGroup: groupedAlerts.actionNow,
            startIndex: 0,
          })}
          {renderAlertGroup({
            title: 'Monitor',
            subtitle: 'Signals that are stable enough for watch-mode and scheduled checks.',
            alertsInGroup: groupedAlerts.monitor,
            startIndex: groupedAlerts.actionNow.length,
          })}
          {renderAlertGroup({
            title: 'Recently resolved',
            subtitle: 'Closed signals kept visible for context and post-action confirmation.',
            alertsInGroup: groupedAlerts.resolved,
            startIndex: groupedAlerts.actionNow.length + groupedAlerts.monitor.length,
          })}
        </div>
      ) : null}
    </div>
  );
}

export default AlertsPage;
