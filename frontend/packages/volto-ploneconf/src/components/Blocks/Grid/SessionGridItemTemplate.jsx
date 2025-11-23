import SessionCard from '../../Schedule/SessionCard';

const SessionGridItemTemplate = ({ item }) => {
  return (
    <div className="card-container session">
      <div className="item">
        <SessionCard
          item={item}
          showDate={true}
          showDescription={true}
          showLevel={true}
          showAudience={true}
        />
      </div>
    </div>
  );
};

export default SessionGridItemTemplate;
