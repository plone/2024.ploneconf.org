import { Icon } from '@plone/volto/components';
import clockSVG from '@plone/volto/icons/clock.svg';
import { formatHour } from '../../helpers/date';

const SlotCard = ({ item }) => {
  const start = new Date(`${item.start}`);
  const end = new Date(`${item.end}`);
  return (
    <div className="slot-card">
      <div className="session-info">
        <div className="timing">
          <Icon name={clockSVG} />
          {`${formatHour(start)} - ${formatHour(end)}`}
        </div>
      </div>
      <div className="session-title-wrapper">
        <div className="session-title">{item.title}</div>
      </div>
      <div className="session-body">{item.description}</div>
    </div>
  );
};

export default SlotCard;
