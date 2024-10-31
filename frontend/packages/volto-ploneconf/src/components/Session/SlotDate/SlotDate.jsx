import { Icon, UniversalLink } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import { formatHour } from '../../../helpers/date';
import calendarSVG from '@plone/volto/icons/calendar.svg';
import { formatDate } from '@plone/volto/helpers/Utils/Date';

const ShortFormat = ({ item }) => {
  const start = new Date(`${item.start}`);
  const end = new Date(`${item.end}`);
  return (
    <>
      <time className={'start'} dateTime={item.start}>
        {formatHour(start)}
      </time>{' '}
      {'-'}
      <time className={'end'} dateTime={item.end}>
        {formatHour(end)}
      </time>
    </>
  );
};

const LongFormat = ({ item }) => {
  const start = new Date(`${item.start}`);
  const end = new Date(`${item.end}`);
  const date = formatDate({ date: start, locale: 'fr', includeTime: false });
  return (
    <>
      <span className={'date'}>{date}</span> {'-'}
      <time className={'start'} dateTime={item.start}>
        {formatHour(start)}
      </time>{' '}
      {'-'}
      <time className={'end'} dateTime={item.end}>
        {formatHour(end)}
      </time>
    </>
  );
};

const SlotDate = ({ item, shortFormat, ical }) => {
  const icalHref =
    ical && `/++api++${flattenToAppURL(item['@id'])}/@@ical_view`;
  return (
    <div className={'slotDate'}>
      {shortFormat ? <ShortFormat item={item} /> : <LongFormat item={item} />}

      {icalHref && (
        <UniversalLink href={icalHref} className={'ical'}>
          <Icon name={calendarSVG} size={'20px'} />
        </UniversalLink>
      )}
    </div>
  );
};

export default SlotDate;
