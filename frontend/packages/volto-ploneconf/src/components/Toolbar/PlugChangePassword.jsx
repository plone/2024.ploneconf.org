import { Plug } from '@plone/volto/components/manage/Pluggable';
import { useSelector, shallowEqual } from 'react-redux';
import { Icon, UniversalLink } from '@plone/volto/components';
import { useClient } from '@plone/volto/hooks';
import jwtDecode from 'jwt-decode';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { getBaseUrl } from '@plone/volto/helpers';
import rightArrowSVG from '@plone/volto/icons/right-key.svg';

const messages = defineMessages({
  changePassword: {
    id: 'Change Password',
    defaultMessage: 'Change Password',
  },
});

const ToolbarLink = () => {
  const isClient = useClient();
  const intl = useIntl();

  const userId = useSelector(
    (state) =>
      state.userSession.token ? jwtDecode(state.userSession.token).sub : '',
    shallowEqual,
  );
  const navRoot = useSelector((state) => state.navroot?.data?.navroot?.['@id']);
  const href = `${getBaseUrl(navRoot)}/change-password`;
  return (
    isClient &&
    userId && (
      <li>
        <UniversalLink
          aria-label={intl.formatMessage(messages.changePassword)}
          className="changePassword"
          href={href}
        >
          <FormattedMessage
            id="Change Password"
            defaultMessage="Change Password"
          />
          <Icon name={rightArrowSVG} size="24px" />
        </UniversalLink>
      </li>
    )
  );
};

const PlugChangePassword = () => {
  return (
    <Plug pluggable="toolbar-user-menu" id="changepassword">
      <ToolbarLink />
    </Plug>
  );
};

export default PlugChangePassword;
