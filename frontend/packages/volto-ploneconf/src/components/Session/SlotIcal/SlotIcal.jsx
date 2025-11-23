import { defineMessages, useIntl } from 'react-intl';
import { flattenToAppURL } from '@plone/volto/helpers';
import ICalDownload from '../../ICalDownload/ICalDownload';

const messages = defineMessages({
  addToMyCalendar: {
    id: 'Download to my personal calendar',
    defaultMessage: 'Download to my personal calendar',
  },
});

const SlotIcal = ({ item, className }) => {
  const additionalClassNames = className ? className : '';
  const intl = useIntl();
  const icalHref = `/++api++${flattenToAppURL(item['@id'])}/@@ical_view`;
  const { start, end } = item;
  const display = start && end;
  return (
    <div className={`slotIcal ${additionalClassNames}`}>
      {display && icalHref && (
        <ICalDownload
          icalHref={icalHref}
          message={intl.formatMessage(messages.addToMyCalendar)}
        />
      )}
    </div>
  );
};

export default SlotIcal;
