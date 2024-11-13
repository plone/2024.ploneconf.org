import { defineMessages, useIntl } from 'react-intl';

export const messages = defineMessages({
  organizers: {
    id: 'Organizers',
    defaultMessage: 'Organizers',
  },
  'organizers-core': {
    id: 'Organizers (Core)',
    defaultMessage: 'Organizers (Core)',
  },
  'organizers-frontdesk': {
    id: 'Organizers (Frontdesk)',
    defaultMessage: 'Organizers (Frontdesk)',
  },
  attendees: {
    id: 'Attendees',
    defaultMessage: 'Attendees',
  },
  onlineattendees: {
    id: 'Online Attendees',
    defaultMessage: 'OnlineAttendees',
  },
  presenters: {
    id: 'Presenters',
    defaultMessage: 'Presenters',
  },
  sponsors: {
    id: 'Sponsors',
    defaultMessage: 'Sponsors',
  },
});

const AttendeeCategory = ({ category }) => {
  const intl = useIntl();
  const token = category;
  const title = messages?.[category]
    ? intl.formatMessage(messages[category])
    : category;
  return (
    <span className={'attendeeCategory'} key={token}>
      {title}
    </span>
  );
};

export default AttendeeCategory;
