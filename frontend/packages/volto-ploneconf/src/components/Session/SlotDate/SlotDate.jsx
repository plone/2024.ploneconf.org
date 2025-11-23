import { formatHour } from '../../../helpers/date';
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

const SlotDate = ({ item, shortFormat, className }) => {
  const additionalClassNames = className ? className : '';
  const { start, end } = item;
  const display = start && end;
  return (
    <div className={`slotDate ${additionalClassNames}`}>
      {display && (
        <div className={'wrapper'}>
          {shortFormat ? (
            <ShortFormat item={item} />
          ) : (
            <LongFormat item={item} />
          )}
        </div>
      )}
    </div>
  );
};

export default SlotDate;
