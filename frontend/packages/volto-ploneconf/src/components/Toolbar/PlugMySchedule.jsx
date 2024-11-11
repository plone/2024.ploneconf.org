import { Plug } from '@plone/volto/components/manage/Pluggable';
import { Icon, UniversalLink } from '@plone/volto/components';
import { useSelector } from 'react-redux';
import calendarSVG from '@plone/volto/icons/calendar.svg';
import { defineMessages, useIntl } from 'react-intl';
import { getBaseUrl } from '@plone/volto/helpers';

const messages = defineMessages({
  mySchedule: {
    id: 'My Schedule',
    defaultMessage: 'My Schedule',
  },
});

const ToolbarButton = () => {
  const intl = useIntl();
  const navRoot = useSelector((state) => state.navroot?.data?.navroot?.['@id']);
  return (
    <UniversalLink
      aria-label={intl.formatMessage(messages.mySchedule)}
      className="mySchedule"
      href={`${getBaseUrl(navRoot)}/mySchedule`}
    >
      <Icon
        name={calendarSVG}
        size="30px"
        className="circled"
        title={intl.formatMessage(messages.mySchedule)}
      />
    </UniversalLink>
  );
};

const PlugMySchedule = () => {
  return (
    <Plug pluggable="main.toolbar.top" id="mySchedule">
      <ToolbarButton />
    </Plug>
  );
};

export default PlugMySchedule;
