import { Icon } from '@plone/volto/components';
import clockSVG from '@plone/volto/icons/clock.svg';
import { formatHour } from '../../helpers/date';
import SlotActions from '../Session/SlotActions/SlotActions';

const SlotCard = ({ item, streamAction }) => {
  const start = new Date(`${item.start}`);
  const end = new Date(`${item.end}`);
  const type = item['@type'];
  const displayActions = ['Meeting', 'LightningTalks'].includes(type);
  return (
    <div className={`slot-card ${type}`}>
      {displayActions && (
        <SlotActions item={item} streamAction={streamAction} />
      )}
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
