import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Container } from '@plone/components';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHeaderCell,
  Segment,
} from 'semantic-ui-react';
import { createPortal } from 'react-dom';
import { Helmet } from '@plone/volto/helpers';
import backSVG from '@plone/volto/icons/back.svg';
import { Icon, Toolbar, UniversalLink } from '@plone/volto/components';

import {
  getAllRegistrations,
  getRegistrations,
} from '../../actions/registrations/registrations';

import RegistrationItem from './RegistrationItem';

const messages = defineMessages({
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
  registrationManagement: {
    id: 'Registrations management for',
    defaultMessage: 'Registrations management for',
  },
  registrationCheckin: {
    id: 'Check-in',
    defaultMessage: 'Check-in',
  },
  registrationRevert: {
    id: 'Revert',
    defaultMessage: 'Revert',
  },
});

const RegistrationsList = ({
  intl,
  registrations,
  pathname,
  uuid,
  showTrainingInfo,
}) => {
  return (
    registrations &&
    registrations.map((registration, idx) => (
      <RegistrationItem
        registration={registration}
        uuid={uuid}
        pathname={pathname}
        intl={intl}
        showTrainingInfo={showTrainingInfo}
        key={idx}
      />
    ))
  );
};

const sortReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_SORT':
      if (state.column === action.column) {
        return {
          ...state,
          data: state.data.slice().reverse(),
          direction:
            state.direction === 'ascending' ? 'descending' : 'ascending',
        };
      }

      return {
        column: action.column,
        data: _.sortBy(state.data, [action.column]),
        direction: 'ascending',
      };
    default:
      throw new Error();
  }
};

const RegistrationsManagement = () => {
  const intl = useIntl();
  const pathname = useLocation().pathname.replace('/registrations', '');
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const content = useSelector((state) => state.content?.data);
  const portal_type = useSelector((state) => state.content?.data?.portal_type);
  const uuid = useSelector((state) => state.content?.data?.UID);
  const registrations = useSelector(
    (state) => state.registrations?.subrequests?.[uuid]?.items || [],
  );
  const [state, sortDispatch] = React.useReducer(sortReducer, {
    column: null,
    data: registrations?.items || [],
    direction: null,
  });
  const { column, data, direction } = state;
  const showTrainingInfo = portal_type === 'Training' ? false : true;
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    sortDispatch({ type: 'CHANGE_SORT', column: 'name' });
  }, [registrations]);

  useEffect(() => {
    const func =
      portal_type === 'Training' ? getRegistrations : getAllRegistrations;
    dispatch(func(pathname, uuid));
  }, [dispatch, uuid, pathname, portal_type]);

  return (
    <>
      <Helmet title={intl.formatMessage(messages.registrationManagement)} />
      <Container
        layout
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
          <Table className={'sortable'}>
            <TableHeader>
              <TableRow>
                {showTrainingInfo && (
                  <TableHeaderCell
                    sorted={column === 'training' ? direction : null}
                    onClick={() =>
                      sortDispatch({ type: 'CHANGE_SORT', column: 'training' })
                    }
                  >
                    <FormattedMessage
                      id={'Training'}
                      defaultMessage={'Training'}
                    />
                  </TableHeaderCell>
                )}
                <TableHeaderCell
                  sorted={column === 'name' ? direction : null}
                  onClick={() =>
                    sortDispatch({ type: 'CHANGE_SORT', column: 'name' })
                  }
                >
                  <FormattedMessage id={'Name'} defaultMessage={'Name'} />
                </TableHeaderCell>
                <TableHeaderCell
                  sorted={column === 'date' ? direction : null}
                  onClick={() =>
                    sortDispatch({ type: 'CHANGE_SORT', column: 'date' })
                  }
                >
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
                  intl={intl}
                  registrations={data}
                  pathname={pathname}
                  uuid={uuid}
                  showTrainingInfo={showTrainingInfo}
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
