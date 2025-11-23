import { defineMessages, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { flattenToAppURL } from '@plone/volto/helpers';
import ICalDownload from '../ICalDownload/ICalDownload';

const messages = defineMessages({
  addToMyCalendar: {
    id: 'Add to my personal calendar',
    defaultMessage: 'Add to my personal calendar',
  },
});

const MyScheduleIcal = ({ className }) => {
  const additionalClassNames = className ? className : '';
  const navRoot = useSelector((state) => state.navroot?.data?.navroot?.['@id']);
  const intl = useIntl();
  const icalHref = `/++api++${flattenToAppURL(navRoot)}/@@ical_view`;
  const display = navRoot && icalHref;
  return (
    <div className={`myScheduleIcal ${additionalClassNames}`}>
      {display && (
        <ICalDownload
          icalHref={icalHref}
          message={intl.formatMessage(messages.addToMyCalendar)}
        />
      )}
    </div>
  );
};

export default MyScheduleIcal;
