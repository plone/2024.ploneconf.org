import { useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { defineMessages, injectIntl, useIntl } from 'react-intl';
import { Container } from '@plone/components';
import { BodyClass, Helmet } from '@plone/volto/helpers';
import { Redirect, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { UniversalLink, Toolbar } from '@plone/volto/components';
import { listStream } from '../../actions/stream/stream';
import { getContent } from '@plone/volto/actions';
import { formatDate } from '@plone/volto/helpers/Utils/Date';
import { formatHour } from '../../helpers/date';
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from 'react-aria-components';

const messages = defineMessages({
  streamManagement: {
    id: 'Stream Management',
    defaultMessage: 'Stream Management',
  },
});

const StreamsByDay = ({ data }) => {
  const { id, items } = data;
  const day = new Date(`${id}T12:00:00`);
  const date = formatDate({ date: day, locale: 'pt', includeTime: false });
  return (
    <Container className="streamsbyday">
      <h3>Streams for {date}</h3>
      <Table aria-label="Streams by day" className={'streams'}>
        <TableHeader>
          <Column id="user_id" isRowHeader>
            Time
          </Column>
          <Column id="title" isRowHeader>
            Title
          </Column>
          <Column id="studio" isRowHeader>
            Studio
          </Column>
          <Column id="stream" isRowHeader>
            YouTube
          </Column>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const start = new Date(`${item.start}`);
            return (
              <Row id={item.UID} className={'stream'} key={item.UID}>
                <Cell>
                  <div className="time-indication">{formatHour(start)}</div>
                </Cell>
                <Cell>{item.title}</Cell>
                <Cell>
                  <UniversalLink href={item.studio_url}>Studio</UniversalLink>
                </Cell>
                <Cell>
                  <UniversalLink href={item.stream_url}>YouTube</UniversalLink>
                </Cell>
              </Row>
            );
          })}
        </TableBody>
      </Table>
    </Container>
  );
};

const ManageStream = (props) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isClient, setIsClient] = useState(false);
  const [timer, setTimer] = useState(0);
  let { pathname } = location;
  pathname = pathname.replace('/manageStream', '');
  const token = useSelector((state) => state.userSession.token, shallowEqual);
  const content = useSelector((state) => state.content.data);
  const items = useSelector((state) => state.stream?.data?.items || []);
  useEffect(() => {
    // Run every 3 minutes 60 * 1000 * 3
    const interval = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 180000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsClient(true);
    dispatch(getContent(pathname));
  }, [dispatch, pathname]);

  useEffect(() => {
    if (token) {
      dispatch(listStream(pathname));
    }
  }, [dispatch, token, timer, pathname]);
  if (__SERVER__ && !token) {
    return <Redirect to={'/login'} />;
  }

  return (
    token && (
      <Container narrow id="streamManagement">
        <Helmet title={intl.formatMessage(messages.streamManagement)} />
        <BodyClass className={'section-streamManagement'} />
        <h1 className={'documentFirstHeading'}>{content.title}</h1>
        <Container>
          {items &&
            items.map((day, idx) => <StreamsByDay data={day} key={idx} />)}
        </Container>
        {isClient &&
          createPortal(
            <Toolbar pathname={pathname} hideDefaultViewButtons />,
            document.getElementById('toolbar'),
          )}
      </Container>
    )
  );
};

export default injectIntl(ManageStream);
