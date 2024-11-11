import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Container } from '@plone/components';
import {
  Button,
  Table,
  TableBody,
  TableRow,
  TableHeader,
  TableHeaderCell,
  TableCell,
  Tab,
  Menu,
} from 'semantic-ui-react';
import { FormattedDate, Toast } from '@plone/volto/components';
import { toast } from 'react-toastify';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import {
  getContent,
  getWorkflow,
  transitionWorkflow,
} from '@plone/volto/actions';
import { flattenToAppURL, getCurrentStateMapping } from '@plone/volto/helpers';
import { getUserReports } from '../../actions/usersReport/usersReport';

const messages = defineMessages({
  messageUpdated: {
    id: 'Workflow updated.',
    defaultMessage: 'Workflow updated.',
  },
  messageNoWorkflow: {
    id: 'No workflow',
    defaultMessage: 'No workflow',
  },
  state: {
    id: 'State',
    defaultMessage: 'State',
  },
});

function useWorkflow() {
  const history = useSelector((state) => state.workflow.history, shallowEqual);
  const transitions = useSelector(
    (state) => state.workflow.transitions,
    shallowEqual,
  );
  const loaded = useSelector((state) => state.workflow.transition.loaded);
  const currentStateValue = useSelector(
    (state) => getCurrentStateMapping(state.workflow.currentState),
    shallowEqual,
  );

  return { loaded, history, transitions, currentStateValue };
}

const StateManagement = ({ pathname, intl }) => {
  const dispatch = useDispatch();
  const { loaded, transitions } = useWorkflow();

  useEffect(() => {
    dispatch(getWorkflow(pathname));
  }, [dispatch, pathname, loaded]);

  const doTransition = (url) => {
    dispatch(transitionWorkflow(flattenToAppURL(url)));
    dispatch(getContent(pathname));
    toast.success(
      <Toast
        success
        title={intl.formatMessage(messages.messageUpdated)}
        content=""
      />,
    );
  };

  useEffect(() => {
    dispatch(getWorkflow(pathname));
  }, [dispatch, pathname, loaded]);

  const safeTransitions = transitions
    .map((transition) => {
      const id = transition['@id'].split(/\//).pop();
      transition['id'] = id;
      return transition;
    })
    .filter((transition) => {
      return ['checkin', 'revert'].includes(transition.id);
    });
  return (
    <div key={'actions_container'} className={'attendee-state'}>
      <div className={'attendee-actions'}>
        {safeTransitions.map((transition) => (
          <Button
            basic
            className={`transitionButton ${transition.id}`}
            onClick={() => doTransition(transition['@id'])}
          >
            {transition.title}
          </Button>
        ))}
      </div>
    </div>
  );
};

const Eventbrite = ({ email, eventbrite }) => {
  return (
    <div className={'attendee-eventbrite'}>
      <Table>
        <TableBody>
          <TableRow>
            <TableHeaderCell>Created</TableHeaderCell>
            <TableCell>{eventbrite.order_date}</TableCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableCell>{email}</TableCell>
          </TableRow>
          <TableRow>
            <TableHeaderCell>Event Id</TableHeaderCell>
            <TableCell>{eventbrite.event_id}</TableCell>
            <TableHeaderCell>Order Id</TableHeaderCell>
            <TableCell>{eventbrite.order_id}</TableCell>
          </TableRow>
          <TableRow>
            <TableHeaderCell>Participant Id</TableHeaderCell>
            <TableCell>
              <a href={eventbrite.ticket_url}>{eventbrite.participant_id}</a>
            </TableCell>
            <TableHeaderCell>Barcode</TableHeaderCell>
            <TableCell>{eventbrite.barcode}</TableCell>
          </TableRow>
          <TableRow>
            <TableHeaderCell>Ticket</TableHeaderCell>
            <TableCell>{eventbrite.ticket_class_name}</TableCell>
            <TableHeaderCell>Ticket ID</TableHeaderCell>
            <TableCell>{eventbrite.ticket_class_id}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

const TrackingReport = ({ content }) => {
  const dispatch = useDispatch();
  const history = useSelector((state) => state.usersReport?.data?.items || []);
  const userId = content.id;
  useEffect(() => {
    dispatch(getUserReports(userId));
  }, [dispatch, userId]);
  return (
    <div key={'tracking_container'} className={'attendee-tracking'}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((record) => (
            <TableRow key={record.uid} className={`tracking ${record.action}`}>
              <TableCell>
                <FormattedDate date={record.created} includeTime />
              </TableCell>
              <TableCell>{record.action}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const AttendeeManagement = ({ pathname, content }) => {
  const intl = useIntl();
  const panes = [
    {
      menuItem: (
        <Menu.Item key={'eventbrite_menu'}>
          <h3>
            <FormattedMessage id="Ticket" defaultMessage="Ticket" />
          </h3>
        </Menu.Item>
      ),
      render: () => {
        return (
          <Tab.Pane className="tab-container" key={'eventbrite_container'}>
            <Eventbrite eventbrite={content.eventbrite} email={content.email} />
          </Tab.Pane>
        );
      },
    },
    {
      menuItem: (
        <Menu.Item key={'actions_menu'}>
          <h3>
            <FormattedMessage id="Actions" defaultMessage="Actions" />
          </h3>
        </Menu.Item>
      ),
      render: () => {
        return (
          <Tab.Pane className="tab-container" key={'actions_container'}>
            <StateManagement pathname={pathname} intl={intl} />
          </Tab.Pane>
        );
      },
    },
    {
      menuItem: (
        <Menu.Item key={'tracking_menu'}>
          <h3>
            <FormattedMessage
              id="Access Report"
              defaultMessage="Access Report"
            />
          </h3>
        </Menu.Item>
      ),
      render: () => {
        return (
          <Tab.Pane className="tab-container" key={'tracking_container'}>
            <TrackingReport content={content} />
          </Tab.Pane>
        );
      },
    },
  ];
  return (
    <Container className="attendee-management">
      <h2>
        <FormattedMessage
          id="Attendee Management"
          defaultMessage="Attendee Management"
        />
      </h2>
      <Tab panes={panes} className="tab" />
    </Container>
  );
};

export default AttendeeManagement;
