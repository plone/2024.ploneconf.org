import { UniversalLink } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import SessionTrack from '../Session/SessionTrack/SessionTrack';
import SessionLevel from '../Session/SessionLevel/SessionLevel';
import SessionAudience from '../Session/SessionAudience/SessionAudience';
import SlotActions from '../Session/SlotActions/SlotActions';
import SlotInfo from './SlotInfo';

const PresentedBy = ({ item }) => {
  let presenters = [];
  if (item.presenters?.length === 1) {
    presenters = [...item.presenters];
  }
  if (item.presenters?.length > 1) {
    presenters = item.presenters.slice(0, -1);
  }
  return (
    <div className="presenters">
      {presenters.map((presenter, index) => {
        return (
          <span key={presenter.path}>
            <UniversalLink href={presenter.path} className={'presenter'}>
              {presenter.title}
            </UniversalLink>
            {presenters.length !== index + 1 && ', '}
          </span>
        );
      })}
      {item.presenters.length > 1 && (
        <span key={item.presenters[item.presenters.length - 1].path}>
          {' & '}
          <UniversalLink
            href={item.presenters[item.presenters.length - 1].path}
            className={'presenter'}
          >
            {item.presenters[item.presenters.length - 1].title}
          </UniversalLink>
        </span>
      )}
    </div>
  );
};

const SessionCard = ({
  item,
  showDate,
  showDescription,
  showLevel,
  showAudience,
  streamAction,
}) => {
  const shortDate = !showDate;
  return (
    <div className="slot-card">
      <SlotActions item={item} streamAction={streamAction} />
      <SessionTrack item={item} />
      <SlotInfo item={item} shortDate={shortDate} />
      <div className="session-title-wrapper">
        <div className="session-title">
          <UniversalLink href={flattenToAppURL(item['@id'])}>
            {item.title}
          </UniversalLink>
        </div>
        {showDescription && (
          <div className="session-description">{item.description}</div>
        )}
        {showAudience && <SessionAudience item={item} />}
        {showLevel && <SessionLevel item={item} />}
      </div>
      <div className="session-body">
        {item.presenters && <PresentedBy item={item} />}
      </div>
    </div>
  );
};

export default SessionCard;
