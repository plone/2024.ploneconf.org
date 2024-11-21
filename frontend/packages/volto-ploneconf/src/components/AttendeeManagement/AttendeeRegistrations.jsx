import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRegistrations } from '../../actions/registrations/registrations';
import { useLocation } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableRow,
  TableHeader,
  TableHeaderCell,
  TableCell,
} from 'semantic-ui-react';
import { FormattedDate, UniversalLink } from '@plone/volto/components';

const Registration = ({ item }) => {
  return (
    <TableRow className="registration">
      <TableCell>
        <UniversalLink item={item.training}>
          {item.training.title}
        </UniversalLink>
      </TableCell>
      <TableCell>
        <FormattedDate date={item.created} includeTime locale={'pt'} />
      </TableCell>
      <TableCell>
        <span className={'state'}>{item.state}</span>
      </TableCell>
    </TableRow>
  );
};

const AttendeeRegistrations = ({ content }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const userId = content.UID;
  const registrations = useSelector(
    (state) => state.registrations?.subrequests?.[userId]?.items || [],
  );
  const pathname = location.pathname;

  useEffect(() => {
    dispatch(getRegistrations(pathname, userId));
  }, [dispatch, pathname, userId]);
  return (
    <div key={'registrations_container'} className={'attendee-registrations'}>
      {registrations && registrations.length > 0 && (
        <Table>
          <TableHeader>
            <TableHeaderCell>Training</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>State</TableHeaderCell>
          </TableHeader>
          <TableBody>
            {registrations.map((registration, idx) => (
              <Registration item={registration} key={idx} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AttendeeRegistrations;
