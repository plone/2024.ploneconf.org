import AttendeeCard from '../../AttendeeCard/AttendeeCard';

const AttendeeGridItemTemplate = ({ item }) => {
  return (
    <div className="card-container attendee">
      <div className="item">
        <AttendeeCard item={item} />
      </div>
    </div>
  );
};

export default AttendeeGridItemTemplate;
