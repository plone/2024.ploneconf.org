import { defineMessages, useIntl } from 'react-intl';
import { Container } from '@plone/components';
import SessionCard from '../Schedule/SessionCard';

const messages = defineMessages({
  past: {
    id: 'Past Sessions',
    defaultMessage: 'Past Sessions',
  },
  current: {
    id: 'Current Sessions',
    defaultMessage: 'Current Sessions',
  },
  upcoming: {
    id: 'Upcoming Sessions',
    defaultMessage: 'Upcoming Sessions',
  },
});

const ScheduleBlock = ({ id, title, items, streamAction }) => {
  return (
    items &&
    items.length > 0 && (
      <Container className={`${id} scheduleBlock`}>
        <h3>{title}</h3>
        <div
          className={
            'block search grid next--is--slate is--first--of--block-type is--last--of--block-type previous--has--same--backgroundColor next--has--same--backgroundColor'
          }
        >
          <div className={'ui stackable grid'}>
            <div className={'row'}>
              <div className={'column'}>
                <div className={'items'}>
                  {items &&
                    items.map((item, idx) => (
                      <div className={'listing-item'} key={idx}>
                        <div className={'card-container session'}>
                          <div className={'item'}>
                            <SessionCard
                              item={item}
                              showDate
                              showAudience
                              showDescription
                              showLevel
                              streamAction={streamAction}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    )
  );
};

const groupByPeriod = (items) => {
  const now = Date.now();
  const periods = { past: [], current: [], upcoming: [] };
  
  items.forEach((item) => {
    const start = item.start ? new Date(item.start) : null;
    const end = item.end ? new Date(item.end) : null;
    
    if (end < now) {
      periods.past.push(item);
    } else if (start <= now && now <= end) {
      periods.current.push(item);
    } else {
      periods.upcoming.push(item);
    }
  });
  
  return periods;
};

const MyScheduleComponent = ({ items, loading, streamAction }) => {
  const intl = useIntl();
  const grouped = groupByPeriod(items);
  const periods = [
    {
      id: 'current',
      title: intl.formatMessage(messages.current),
      items: grouped['current'],
    },
    {
      id: 'upcoming',
      title: intl.formatMessage(messages.upcoming),
      items: grouped['upcoming'],
    },
    {
      id: 'past',
      title: intl.formatMessage(messages.past),
      items: grouped['past'],
    },
  ];
  return (
    <Container>
      {periods.map((period) => (
        <ScheduleBlock
          title={period.title}
          items={period.items}
          key={period.id}
          id={period.id}
          streamAction={streamAction}
        />
      ))}
    </Container>
  );
};

export default MyScheduleComponent;
