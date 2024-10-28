import { Label } from 'semantic-ui-react';
import { UniversalLink } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import SessionTrack from '../Session/SessionTrack/SessionTrack';
import SlotDate from '../Session/SlotDate/SlotDate';
import SessionLanguage from '../Session/SessionLanguage/SessionLanguage';

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

const SessionCard = ({ item, showDescription }) => {
  return (
    <div className="slot-card">
      <div className="session-info">
        <div className="timing">
          <SlotDate item={item} shortFormat={true} ical={true} />
        </div>
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
      </div>
      <div className="session-body">
        {item.presenters && <PresentedBy item={item} />}
        {item.level?.length > 0 && (
          <div className="session level">
            <span>Level:</span>{' '}
            {item.level.map((levelItem, index) => {
              return <Label key={index}>{levelItem.title}</Label>;
            })}
          </div>
        )}
        {item.audience?.length > 0 && (
          <div className="session audience">
            <span>Audience :</span>{' '}
            {item.audience.map((audienceItem, index) => {
              return <Label key={index}>{audienceItem.title}</Label>;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
