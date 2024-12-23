import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Segment, Dimmer, Loader } from 'semantic-ui-react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  addRegistration,
  getRegistration,
  deleteRegistration,
} from '../../actions/registrations/registrations';
import { getContent } from '@plone/volto/actions';
import { Button, Container, CheckboxIcon, CloseIcon } from '@plone/components';

const Register = ({ pathname, content }) => {
  const dispatch = useDispatch();
  const uuid = content['UID'];
  const token = useSelector((state) => state.userSession.token, shallowEqual);
  const loading = useSelector(
    (state) => state.registrations?.subrequests?.[uuid]?.loading || false,
  );
  const registration = useSelector(
    (state) => state.registrations?.subrequests?.[uuid]?.registration,
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
    content.allow_registration && (
      <Container narrow className={'register'}>
        <h2>
          <FormattedMessage id={'Register'} defaultMessage={'Register'} />
        </h2>
        <Container className={'trainingSeats'}>
          <Container className={'stats total'}>
            <Container className={'label'}>
              <FormattedMessage
                id={'Total Seats'}
                defaultMessage={'Total Seats'}
              />
            </Container>
            <Container className={'value'}>{content.total_seats}</Container>
          </Container>
          <Container className={'stats available'}>
            <Container className={'label'}>
              <FormattedMessage
                id={'Available Seats'}
                defaultMessage={'Available Seats'}
              />
            </Container>
            <Container className={'value'}>{content.available_seats}</Container>
          </Container>
        </Container>
        {content.available_seats > 0 || registration?.uid ? (
          <div className={'register-actions'}>
            {loading ? (
              <Dimmer.Dimmable as={Segment} dimmed={true}>
                <Dimmer active inverted>
                  <Loader size={'small'} inline="centered">
                    <FormattedMessage
                      id={'Loading'}
                      defaultMessage={'Loading'}
                    />
                  </Loader>
                </Dimmer>
              </Dimmer.Dimmable>
            ) : registration?.uid ? (
              <Button
                className={'registration cancel'}
                onPress={() => cancelRegistration()}
              >
                <span className={'circle'}>
                  <CloseIcon />
                </span>
                <span className={'text'}>
                  <FormattedMessage
                    id={'Cancel registration'}
                    defaultMessage={'Cancel registration'}
                  />
                </span>
              </Button>
            ) : (
              <Button
                className={'registration register'}
                onPress={() => doRegistration()}
              >
                <span className={'circle'}>
                  <CheckboxIcon />
                </span>
                <span className={'text'}>
                  <FormattedMessage
                    id={'Register now'}
                    defaultMessage={'Register now'}
                  />
                </span>
              </Button>
            )}
          </div>
        ) : (
          <Container className={'warning'}>
            <FormattedMessage
              id={'No seats available'}
              defaultMessage={'No seats available'}
            />
          </Container>
        )}
      </Container>
    )
  );
};

export default Register;
