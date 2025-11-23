import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { useIntl, defineMessages } from 'react-intl';
import { getUser } from '@plone/volto/actions';
import PersonalImage from './PersonalImage';

const messages = defineMessages({
  personalTools: {
    id: 'Personal tools',
    defaultMessage: 'Personal tools',
  },
});

const PersonalInfo = (props) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const token = useSelector((state) => state.userSession.token, shallowEqual);
  const user = useSelector((state) => state.users.user);
  const username = user?.username;
  const userId = token ? jwtDecode(token).sub : '';

  useEffect(() => {
    if (!username) {
      dispatch(getUser(userId));
    }
  }, [dispatch, username, userId]);
  return (
    user && (
      <button
        className="user"
        aria-label={intl.formatMessage(messages.personalTools)}
        onClick={(e) => props.toggleMenu(e, 'personalTools')}
        tabIndex={0}
        id="toolbar-personal"
      >
        <PersonalImage
          user={user}
          size={'small'}
          title={intl.formatMessage(messages.personalTools)}
        />
      </button>
    )
  );
};

export default PersonalInfo;
