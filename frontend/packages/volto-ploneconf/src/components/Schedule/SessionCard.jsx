import { UniversalLink } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import SessionTrack from '../Session/SessionTrack/SessionTrack';
import SlotDate from '../Session/SlotDate/SlotDate';
import SessionLanguage from '../Session/SessionLanguage/SessionLanguage';
import SessionRoom from '../Session/SessionRoom/SessionRoom';
import SessionLevel from '../Session/SessionLevel/SessionLevel';
import SessionAudience from '../Session/SessionAudience/SessionAudience';

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

const SessionCard = ({ item, showDescription, showLevel, showAudience }) => {
  return (
    <div className="slot-card">
      <div className="session-info">
        <div className="timing">
          <SlotDate item={item} shortFormat={true} ical={true} />
        </div>
        <SessionRoom item={item} />
        <SessionLanguage item={item} />
      </div>
      <SessionTrack item={item} />
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
