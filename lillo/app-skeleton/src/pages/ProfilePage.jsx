import FarmProfileStage from '../components/FarmProfileStage';

function ProfilePage({ selectedFarm, alerts, integrations }) {
  return (
    <div className="page profile-page">
      <FarmProfileStage alerts={alerts} integrations={integrations} selectedFarm={selectedFarm} title="Giorgio's farm" />
    </div>
  );
}

export default ProfilePage;
