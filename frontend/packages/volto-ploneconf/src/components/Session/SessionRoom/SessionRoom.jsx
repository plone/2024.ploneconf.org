import { Icon } from '@plone/volto/components';
import locationSVG from '@plone/volto/icons/map.svg';

const SessionRoom = ({ item }) => {
  const roomInfo = item.room?.length > 0 ? item.room[0] : null;
  const roomToken = roomInfo && roomInfo.token;
  const roomTitle = roomInfo && roomInfo.title;
  return (
    roomInfo && (
      <div className="session-room">
        <Icon name={locationSVG} className={'categoryIcon'} />
        <div className={`room ${roomToken}`}>{roomTitle}</div>
      </div>
    )
  );
};

export default SessionRoom;
