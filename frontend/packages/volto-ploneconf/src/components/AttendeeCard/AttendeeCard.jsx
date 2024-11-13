import { UniversalLink } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import { useIntl } from 'react-intl';
import { messages } from '../AttendeeLabel/labels';
import AttendeeCategory from './AttendeeCategory';

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
              <div className={'row'}>
                <span class={'rowIcon'}>📧</span>{' '}
                <span class={'rowValue'}>{eventbrite.email}</span>
              </div>
              <div className={'row'}>
                <span class={'rowIcon'}>🎫</span>{' '}
                <span class={'rowValue'}>{eventbrite.ticket_class_name}</span>
              </div>
              <div className={'row'}>
                {item.Subject?.length > 0 &&
                  item.Subject.map((category, idx) => (
                    <AttendeeCategory category={category} key={idx} />
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AttendeeCard;
