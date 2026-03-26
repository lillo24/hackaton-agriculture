import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';

function DashboardPage({ selectedFarm }) {
  return (
    <div className="page dashboard-page">
      <PageHeader
        eyebrow="Dashboard"
        title="Future farmer dashboard"
        description={`This home page is intentionally reserved for the upcoming daily summary in ${selectedFarm.label} operations.`}
      />

      <SectionCard
        subtitle="Future daily summary for the farmer."
        title="Placeholder"
      >
        <p className="detail-text">
          This area will host daily priorities, weather risk, and field follow-ups.
        </p>
      </SectionCard>
    </div>
  );
}

export default DashboardPage;
