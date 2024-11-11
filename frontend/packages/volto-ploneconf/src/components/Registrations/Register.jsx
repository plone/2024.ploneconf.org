import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'semantic-ui-react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  addRegistration,
  getRegistration,
  deleteRegistration,
} from '../../actions/registrations/registrations';
import { getContent } from '@plone/volto/actions';
import { Container } from '@plone/components';

const Register = ({ pathname, content }) => {
  const dispatch = useDispatch();
  const uuid = content['UID'];
  const token = useSelector((state) => state.userSession.token, shallowEqual);
  const registration = useSelector(
    (state) => state.registrations?.subrequests?.[uuid],
  );
  useEffect(() => {
    dispatch(getRegistration(pathname, uuid));
  }, [dispatch, pathname, uuid]);

  const doRegistration = () => {
    dispatch(addRegistration(pathname, uuid));
    dispatch(getContent(pathname));
  };

  const cancelRegistration = () => {
    dispatch(deleteRegistration(pathname, uuid));
    dispatch(getContent(pathname));
  };

  return (
    token &&
    (content.allow_registration || registration?.uid) && (
      <Container narrow className={'register'}>
        <h2>
          <FormattedMessage id={'Register'} defaultMessage={'Register'} />
        </h2>
        <div className={'register-actions'}>
          {registration?.uid ? (
            <Button
              basic
              className={'registration cancel'}
              onClick={() => cancelRegistration()}
            >
              <FormattedMessage
                id={'Cancel registration'}
                defaultMessage={'Cancel registration'}
              />
            </Button>
          ) : (
            <Button
              basic
              className={'registration register'}
              onClick={() => doRegistration()}
            >
              <FormattedMessage
                id={'Register now'}
                defaultMessage={'Register now'}
              />
            </Button>
          )}
        </div>
      </Container>
    )
  );
};

export default Register;