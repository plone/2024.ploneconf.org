import { useEffect, useState } from 'react';
import { Button, RedoIcon, CheckboxIcon } from '@plone/components';
import { defineMessages } from 'react-intl';
import { useDispatch } from 'react-redux';
import { TableRow, TableCell } from 'semantic-ui-react';
import cx from 'classnames';
import { FormattedDate, UniversalLink } from '@plone/volto/components';

import { updateRegistrations } from '../../actions/registrations/registrations';

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

const RegistrationItem = ({
  intl,
  pathname,
  uuid,
  registration,
  showTrainingInfo,
}) => {
  const dispatch = useDispatch();
  const [state, setState] = useState(registration.state);
  const [toggle, setToggle] = useState(false);
  const user_id = registration.user_id;
  useEffect(() => {
    if (toggle) {
      const action = updateRegistrations;
      const newState = state === 'registered' ? 'checked' : 'registered';
      dispatch(
        action(pathname, uuid, {
          user_ids: [user_id],
          state: state,
        }),
      );
      setToggle(false);
      setState(newState);
    }
  }, [pathname, uuid, user_id, dispatch, toggle, state]);

  const doToggle = () => {
    setToggle(true);
  };
  const checked = state === 'checked';
  const message = checked
    ? intl.formatMessage(messages.registrationRevert)
    : intl.formatMessage(messages.registrationCheckin);
  return (
    <TableRow key={registration.uid} className={`registration ${state}`}>
      {showTrainingInfo && (
        <TableCell>
          {registration.training ? (
            <UniversalLink item={registration.training}>
              {registration.training.title}
            </UniversalLink>
          ) : (
            <span>{registration.training_id}</span>
          )}
        </TableCell>
      )}
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
        <FormattedDate date={registration.created} includeTime locale={'fr'} />
      </TableCell>
      <TableCell>
        <span className={'state'}>{registration.state}</span>
      </TableCell>
      <TableCell className="actions">
        <Button
          className={cx('action', {
            revert: checked,
            checkin: !checked,
          })}
          aria-label={message}
          onPress={() => doToggle()}
        >
          <span className={'circle'}>
            {checked ? <RedoIcon /> : <CheckboxIcon />}
          </span>
          <span className={'text'}>{message}</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default RegistrationItem;
