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
  TableCell,
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
  registrationManagementAll: {
    id: 'Registrations management for all trainings',
    defaultMessage: 'Registrations management for all trainings',
  },
});

const RegistrationsList = ({
  intl,
  registrations,
  pathname,
  uuid,
  allTrainings,
}) => {
  return (
    registrations &&
    registrations.map((registration, idx) => (
      <RegistrationItem
        registration={registration}
        uuid={uuid}
        pathname={pathname}
        intl={intl}
        allTrainings={allTrainings}
        key={idx}
      />
    ))
  );
};

const TrainingsList = ({ isClient, trainings }) => {
  return (
    isClient &&
    trainings &&
    trainings.length > 0 && (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>
              <FormattedMessage id={'Training'} defaultMessage={'Training'} />
            </TableHeaderCell>
            <TableHeaderCell>
              <FormattedMessage id={'Total'} defaultMessage={'Total'} />
            </TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trainings.map((training) => (
            <TableRow key={training.id} className={`training`}>
              <TableCell>
                <UniversalLink href={training['@id']}>
                  {training.title}
                </UniversalLink>
              </TableCell>
              <TableCell>{training.registrations}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );
};

const sortReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_DATA':
      return {
        ...state,
        data: action.data,
      };
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
  const portal_type = useSelector((state) => state.content?.data?.['@type']);
  const uuid = useSelector((state) => state.content?.data?.UID);
  const registrations = useSelector(
    (state) => state.registrations?.subrequests?.[uuid]?.items || [],
  );
  const trainings = useSelector(
    (state) => state.registrations?.subrequests?.[uuid]?.trainings || [],
  );
  const [state, sortDispatch] = React.useReducer(sortReducer, {
    column: null,
    data: registrations,
    direction: null,
  });

  const { column, data, direction } = state;
  const total = data.length;
  const allTrainings = portal_type === 'Training' ? false : true;
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (registrations.length > 0 && total === 0) {
      sortDispatch({ type: 'UPDATE_DATA', data: registrations });
    }
    sortDispatch({ type: 'CHANGE_SORT', column: 'name' });
  }, [registrations, total]);

  useEffect(() => {
    const func =
      portal_type === 'Training' ? getRegistrations : getAllRegistrations;
    dispatch(func(pathname, uuid));
  }, [dispatch, uuid, pathname, portal_type]);

  const pageTitle = allTrainings
    ? intl.formatMessage(messages.registrationManagementAll)
    : intl.formatMessage(messages.registrationManagement);
  return (
    <>
      <Helmet title={pageTitle} />
      <Container
        layout
        id={'page-document'}
        className="registrations-management"
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
          <Segment secondary>{pageTitle}</Segment>
          {trainings && (
            <Container className={'trainingsList'}>
              <TrainingsList trainings={trainings} isClient={isClient} />
            </Container>
          )}
          {registrations && (
            <Container className={'registrationsList'}>
              <Table className={'sortable'}>
                <TableHeader>
                  <TableRow>
                    {allTrainings && (
                      <TableHeaderCell
                        sorted={column === 'training' ? direction : null}
                        onClick={() =>
                          sortDispatch({
                            type: 'CHANGE_SORT',
                            column: 'training',
                          })
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
                    {!allTrainings && (
                      <TableHeaderCell>
                        <FormattedMessage
                          id={'Action'}
                          defaultMessage={'Action'}
                        />
                      </TableHeaderCell>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isClient && (
                    <RegistrationsList
                      intl={intl}
                      registrations={data}
                      pathname={pathname}
                      uuid={uuid}
                      allTrainings={allTrainings}
                    />
                  )}
                </TableBody>
              </Table>
            </Container>
          )}
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
