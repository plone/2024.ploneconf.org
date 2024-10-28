import SessionCard from '../../Schedule/SessionCard';

const SessionGridItemTemplate = ({ item }) => {
  return (
    <div className="card-container session">
      <div className="item">
        <SessionCard item={item} showDescription={true} />
      </div>
    </div>
  );
};

export default SessionGridItemTemplate;