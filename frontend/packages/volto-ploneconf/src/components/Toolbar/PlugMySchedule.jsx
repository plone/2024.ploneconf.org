import { Plug } from '@plone/volto/components/manage/Pluggable';
import { Icon } from '@plone/volto/components';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import calendarSVG from '@plone/volto/icons/calendar.svg';
import { defineMessages, useIntl } from 'react-intl';
import { Button, Tooltip } from '@plone/components';
import { TooltipTrigger } from 'react-aria-components';
import { flattenToAppURL } from '@plone/volto/helpers';
import '@plone/components/src/styles/basic/Tooltip.css';

const messages = defineMessages({
  mySchedule: {
    id: 'My Schedule',
    defaultMessage: 'My Schedule',
  },
});

const ToolbarButton = () => {
  const intl = useIntl();
  const navRoot = useSelector((state) => state.navroot?.data?.navroot?.['@id']);
  const loading = useSelector((state) => state.registrations?.loading || false);
  const history = useHistory();
  const message = intl.formatMessage(messages.mySchedule);
  const navigate = () => {
    history.push(`${flattenToAppURL(navRoot)}/mySchedule`);
  };
  return (
    <TooltipTrigger delay={0}>
      <Button
        className={cx('myScheduleButton', {
          loading: loading,
        })}
        aria-label={message}
        onPress={() => navigate()}
      >
        <Icon
          name={calendarSVG}
          size="30px"
          className="circled"
          title={message}
        />
      </Button>
      <Tooltip layout={'left'}>
        {intl.formatMessage(messages.mySchedule)}
      </Tooltip>
    </TooltipTrigger>
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
