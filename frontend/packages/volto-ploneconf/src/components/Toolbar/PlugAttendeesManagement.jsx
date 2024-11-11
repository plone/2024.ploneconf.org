import { Plug } from '@plone/volto/components/manage/Pluggable';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon } from '@plone/volto/components';
import { userHasRoles } from '@plone/volto/helpers';
import { FormattedMessage } from 'react-intl';
import rightArrowSVG from '@plone/volto/icons/right-key.svg';

const ToolbarLink = () => {
  const user = useSelector((state) => state.users.user);
  return (
    userHasRoles(user, ['Site Administrator', 'Manager', 'Reviewer']) && (
      <li>
        <Link to="/attendees">
          <FormattedMessage
            id="Attendees Management"
            defaultMessage="Attendees Management"
          />
          <Icon name={rightArrowSVG} size="24px" />
        </Link>
      </li>
    )
  );
};

const PlugAttendeesManagement = () => {
  return (
    <Plug pluggable="toolbar-user-menu" id="attendees-management">
      <ToolbarLink />
    </Plug>
  );
};

export default PlugAttendeesManagement;
