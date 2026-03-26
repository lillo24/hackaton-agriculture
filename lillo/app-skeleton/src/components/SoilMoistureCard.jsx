import SectionCard from './SectionCard';

const fallbackColumns = [
  { id: 'north', label: 'North plot', value: 64 },
  { id: 'lower', label: 'Lower plot', value: 58 },
  { id: 'target', label: 'Target', value: 67 },
];

function clampPercentage(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(numericValue)));
}

function SoilMoistureCard({ columns = fallbackColumns }) {
  const safeColumns = (columns.length ? columns : fallbackColumns).slice(0, 3).map((column, index) => ({
    id: column.id ?? `column-${index + 1}`,
    label: column.label ?? `Plot ${index + 1}`,
    value: clampPercentage(column.value),
  }));

  return (
    <SectionCard subtitle="Three reference pillars for quick moisture balance checks." title="Soil moisture">
      <div className="soil-moisture-card">
        <div className="soil-moisture-card__pillars">
          {safeColumns.map((column) => (
            <article className="soil-pillar" key={column.id}>
              <div className="soil-pillar__well" role="img" aria-label={`${column.label} moisture ${column.value}%`}>
                <div className="soil-pillar__fill" style={{ height: `${column.value}%` }} />
              </div>
              <p className="soil-pillar__label">{column.label}</p>
              <p className="soil-pillar__value">{column.value}%</p>
            </article>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

export default SoilMoistureCard;
