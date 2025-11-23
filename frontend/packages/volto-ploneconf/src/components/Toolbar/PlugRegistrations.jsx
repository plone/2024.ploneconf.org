import { Plug } from '@plone/volto/components/manage/Pluggable';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import registrationSVG from '@plone/volto/icons/content-listing.svg';
import { defineMessages, useIntl } from 'react-intl';
import { Icon } from '@plone/volto/components';

const messages = defineMessages({
  manageRegistrations: {
    id: 'Manage Registrations',
    defaultMessage: 'Manage Registrations',
  },
});

const ToolbarButton = () => {
  const intl = useIntl();
  const pathname = useLocation().pathname;
  const registrations = useSelector(
    (state) => state.content?.data?.registrations,
  );
  return registrations !== undefined ? (
    <Link to={`${pathname}/registrations`}>
      <Icon
        name={registrationSVG}
        size="30px"
        className="circled"
        title={intl.formatMessage(messages.manageRegistrations)}
      />
    </Link>
  ) : (
    <>{''}</>
  );
};

const PlugRegistrations = () => {
  return (
    <Plug pluggable="main.toolbar.top" id="registrations">
      <ToolbarButton />
    </Plug>
  );
};

export default PlugRegistrations;
