import sortBy from 'lodash/sortBy';
import cloneDeep from 'lodash/cloneDeep';
import React, { useEffect, useState } from 'react';
import { Container } from '@plone/components';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Table as SemanticTable,
  TableBody as SemanticTableBody,
  TableHeader as SemanticTableHeader,
  TableRow,
  TableHeaderCell,
  Segment,
} from 'semantic-ui-react';
import { createPortal } from 'react-dom';
import { Helmet } from '@plone/volto/helpers';
import backSVG from '@plone/volto/icons/back.svg';
import { Icon, Toolbar, UniversalLink } from '@plone/volto/components';

import {
  Cell,
  Column,
  ColumnResizer,
  ResizableTableContainer,
  Row,
  Table,
  TableBody,
  TableHeader,
} from 'react-aria-components';

import {
  getAllRegistrations,
  getRegistrations,
} from '../../actions/registrations/registrations';

import RegistrationItem from './RegistrationItem';
import { useListData, useAsyncList } from 'react-stately';

import '@plone/components/src/styles/basic/Table.css';

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
        data: sortBy(state.data, [action.column]),
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

  let list = useAsyncList({
    async load({ signal }) {
      // let res = await fetch(`https://swapi.py4e.com/api/people/?search`, {
      //   signal,
      // });
      // let json = await res.json();
      const func =
        portal_type === 'Training' ? getRegistrations : getAllRegistrations;

      let registrations = await dispatch(func(pathname, uuid));
      const result = cloneDeep(registrations.registrations.items);
      result.forEach((registration) => {
        registration.training = registration.training.title;
      });
      return {
        items: result,
      };
    },
    // async getKey(item) {
    //   debugger;
    //   return item.uid;
    // },
    async sort({ items, sortDescriptor }) {
      console.log(items);
      console.log(sortDescriptor.column);
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column];
          let second = b[sortDescriptor.column];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;
          if (sortDescriptor.direction === 'descending') {
            cmp *= -1;
          }
          return cmp;
        }),
      };
    },
  });

  return (
    <>
      <Helmet title={pageTitle} />
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
          <Segment secondary>{pageTitle}</Segment>
          <Table
            aria-label="Example table with client side sorting"
            sortDescriptor={list.sortDescriptor}
            onSortChange={list.sort}
          >
            <TableHeader>
              <Column id="training" isRowHeader allowsSorting>
                Training
              </Column>
              <Column id="user_id" allowsSorting>
                Name
              </Column>
              <Column id="created" allowsSorting>
                Date
              </Column>
              <Column id="state" allowsSorting>
                State
              </Column>
            </TableHeader>
            <TableBody items={list.items}>
              {(item) => (
                <Row id={item.uid}>
                  <Cell>{item.training}</Cell>
                  <Cell>{item.user_id}</Cell>
                  <Cell>{item.created}</Cell>
                  <Cell>{item.state}</Cell>
                </Row>
              )}
            </TableBody>
          </Table>
          <SemanticTable className={'sortable'}>
            <SemanticTableHeader>
              <TableRow>
                {allTrainings && (
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
                {!allTrainings && (
                  <TableHeaderCell>
                    <FormattedMessage id={'Action'} defaultMessage={'Action'} />
                  </TableHeaderCell>
                )}
              </TableRow>
            </SemanticTableHeader>
            <SemanticTableBody>
              {isClient && (
                <RegistrationsList
                  intl={intl}
                  registrations={data}
                  pathname={pathname}
                  uuid={uuid}
                  allTrainings={allTrainings}
                />
              )}
            </SemanticTableBody>
          </SemanticTable>
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
