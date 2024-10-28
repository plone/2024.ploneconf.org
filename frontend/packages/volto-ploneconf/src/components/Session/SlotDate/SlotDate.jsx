import { Icon, UniversalLink } from '@plone/volto/components';
import { When } from '@plone/volto/components/theme/View/EventDatesInfo';
import { flattenToAppURL } from '@plone/volto/helpers';
import { formatHour } from '../../../helpers/date';
import calendarSVG from '@plone/volto/icons/calendar.svg';

const ShortFormat = ({ item }) => {
  const start = new Date(`${item.start}`);
  const end = new Date(`${item.end}`);
  return (
    <>
      <span className={'start'}>{formatHour(start)}</span> {'-'}
      <span className={'end'}>{formatHour(end)}</span>
    </>
  );
};

const SlotDate = ({ item, shortFormat, ical }) => {
  const icalHref =
    ical && `/++api++${flattenToAppURL(item['@id'])}/@@ical_view`;
  return (
    <>
      {shortFormat ? (
        <ShortFormat item={item} />
      ) : (
        <When
          start={item.start}
          end={item.end}
          whole_day={false}
          open_end={false}
        />
      )}

      {icalHref && (
        <UniversalLink href={icalHref}>
          <Icon name={calendarSVG} size={'20px'} />
        </UniversalLink>
      )}
    </>
  );
};

export default SlotDate;
