import { useEffect, useState } from 'react';
import { Container } from '@plone/components';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Button,
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableCell,
  Segment,
} from 'semantic-ui-react';
import { createPortal } from 'react-dom';
import { Helmet } from '@plone/volto/helpers';
import backSVG from '@plone/volto/icons/back.svg';
import {
  FormattedDate,
  Icon,
  Toolbar,
  UniversalLink,
} from '@plone/volto/components';

import {
  getRegistrations,
  updateRegistrations,
} from '../../actions/registrations/registrations';

const messages = defineMessages({
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
  registrationManagement: {
    id: 'Registrations management for',
    defaultMessage: 'Registrations management for',
  },
});

const RegistrationsList = ({ registrations, pathname, uuid }) => {
  const dispatch = useDispatch();
  const userCheckin = (user_id) => {
    dispatch(
      updateRegistrations(pathname, uuid, {
        user_ids: [user_id],
        state: 'checked',
      }),
    );
  };
  const cancelUserCheckin = (user_id) => {
    dispatch(
      updateRegistrations(pathname, uuid, {
        user_ids: [user_id],
        state: 'registered',
      }),
    );
  };
  return (
    registrations.items &&
    registrations.items.map((registration) => (
      <TableRow
        key={registration.uid}
        className={`registration ${registration.state}`}
      >
        <TableCell>
          {registration.user ? (
            <UniversalLink item={registration.user}>
              {registration.user.title}
            </UniversalLink>
          ) : (
            <span>{registration.user_id}</span>
          )}
        </TableCell>
        <TableCell>
          <FormattedDate date={registration.created} includeTime />
        </TableCell>
        <TableCell>
          <span className={'state'}>{registration.state}</span>
        </TableCell>
        <TableCell>
          {registration.state === 'checked' ? (
            <Button
              className={'action revert'}
              onClick={() => cancelUserCheckin(registration.user_id)}
            >
              <FormattedMessage id={'Revert'} defaultMessage={'Revert'} />
            </Button>
          ) : (
            <Button
              className={'action checkin'}
              onClick={() => userCheckin(registration.user_id)}
            >
              <FormattedMessage id={'Check-in'} defaultMessage={'Check-in'} />
            </Button>
          )}
        </TableCell>
      </TableRow>
    ))
  );
};

const RegistrationsManagement = () => {
  const intl = useIntl();
  const pathname = useLocation().pathname.replace('/registrations', '');
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const content = useSelector((state) => state.content?.data);
  const uuid = useSelector((state) => state.content?.data?.UID);
  const registrations = useSelector(
    (state) => state.registrations?.subrequests?.[uuid]?.items || [],
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    dispatch(getRegistrations(pathname, uuid));
  }, [dispatch, uuid, pathname]);

  return (
    <>
      <Helmet title={intl.formatMessage(messages.registrationManagement)} />
      <Container
        narrow
        id={'page-document'}
        className={'registrations-management'}
      >
        <Segment.Group raised>
          <Segment className="primary">
            <FormattedMessage
              id="Registrations management for {title}"
              defaultMessage="Registrations management for {title}"
              values={{
                title: <q>{content.title}</q>,
              }}
            />
          </Segment>
          <Segment secondary>
            <FormattedMessage
              id="Manage registrations for this training."
              defaultMessage="Manage registrations for this training."
            />
          </Segment>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>
                  <FormattedMessage id={'Name'} defaultMessage={'Name'} />
                </TableHeaderCell>
                <TableHeaderCell>
                  <FormattedMessage id={'Date'} defaultMessage={'Date'} />
                </TableHeaderCell>
                <TableHeaderCell>
                  <FormattedMessage id={'State'} defaultMessage={'State'} />
                </TableHeaderCell>
                <TableHeaderCell>
                  <FormattedMessage id={'Action'} defaultMessage={'Action'} />
                </TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isClient && (
                <RegistrationsList
                  registrations={registrations}
                  pathname={pathname}
                  uuid={uuid}
                />
              )}
            </TableBody>
          </Table>
        </Segment.Group>
        {isClient &&
          createPortal(
            <Toolbar
              pathname={pathname}
              hideDefaultViewButtons
              inner={
                <UniversalLink item={content} className="item">
                  <Icon
                    name={backSVG}
                    className="contents circled"
                    size="30px"
                    title={intl.formatMessage(messages.back)}
                  />
                </UniversalLink>
              }
            />,
            document.getElementById('toolbar'),
          )}
      </Container>
    </>
  );
};

export default RegistrationsManagement;
