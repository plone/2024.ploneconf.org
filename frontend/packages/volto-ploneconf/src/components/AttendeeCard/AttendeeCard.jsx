import { UniversalLink } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import { useIntl } from 'react-intl';
import { messages } from '../AttendeeLabel/labels';

const AttendeeCard = ({ item }) => {
  const { eventbrite } = item;
  const intl = useIntl();
  const type = item['@type'];
  const state = item.review_state;
  const token = state;
  const title = intl.formatMessage(messages[state]);
  return (
    <>
      <div className={`status ${type} ${token}`}>{title}</div>
      <div className="attendee-card">
        <div className="attendee-title-wrapper">
          <div className="attendee-title">
            <UniversalLink href={flattenToAppURL(item['@id'])}>
              {item.title}
            </UniversalLink>
          </div>
        </div>
        <div className="attendee-body">
          {eventbrite?.email && (
            <>
              <div className={'row'}>{eventbrite.email}</div>
              <div className={'row'}>{eventbrite.ticket_class_name}</div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AttendeeCard;
