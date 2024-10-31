const defaultTrack = { token: 'other', title: 'Other' };
const SessionTrack = ({ item }) => {
  const track = item.track ? item.track[0] : defaultTrack;
  const sessionType = item['@type'];
  const isKeynote = sessionType === 'Keynote';
  const trackToken = isKeynote ? 'keynote' : track.token;
  const trackTitle = isKeynote ? 'Keynote' : track.title;
  return (
    track && (
      <div className="session-track">
        <div className={`track ${trackToken}`}>{trackTitle}</div>
      </div>
    )
  );
};

export default SessionTrack;
