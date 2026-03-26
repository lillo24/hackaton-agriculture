import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

function AlertListItem({
  alert,
  groupLabel,
  index = 0,
  isFocused = false,
  priorityRank = index + 1,
  returnTo = '/alerts',
}) {
  const sourceSummary = alert.sourceNames.length > 0 ? alert.sourceNames.join(' | ') : 'Source unavailable';
  const className = `alert-list-item alert-list-item--${alert.severity}${isFocused ? ' is-focused' : ''}`;

  return (
    <Link
      className={className}
      state={{ focusAlertId: alert.id, from: returnTo }}
      to={`/alerts/${alert.id}`}
      style={{ '--delay': `${index * 60}ms` }}
    >
      <div className="alert-list-item__row">
        <div className="alert-list-item__chips">
          <StatusBadge tone={alert.severity}>{alert.severity}</StatusBadge>
          <StatusBadge tone={alert.status}>{alert.status}</StatusBadge>
          <StatusBadge tone="neutral">{alert.sourceSignalCount} signals</StatusBadge>
          <span className="alert-list-item__priority">Priority {priorityRank}</span>
        </div>
        <span className="alert-list-item__timestamp">{alert.timestampLabel}</span>
      </div>
      <h3 className="alert-list-item__title">{alert.title}</h3>
      <p className="alert-list-item__description">{alert.summary}</p>
      <div className="alert-list-item__meta">
        <span>
          <strong>Field</strong>
          {' '}
          {alert.field.name}
          {' '}
          ({alert.field.plotCode})
        </span>
        <span>
          <strong>Sources</strong>
          {' '}
          {sourceSummary}
        </span>
      </div>
      <div className="alert-list-item__footer">
        <span>
          {alert.farmRelevance}
          {' '}
          relevance
          {groupLabel ? ` - ${groupLabel}` : ''}
        </span>
        <span className="alert-list-item__open">Open detail</span>
      </div>
    </Link>
  );
}

export default AlertListItem;
