import { useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { defineMessages, useIntl } from 'react-intl';
import { Container } from '@plone/components';
import { BodyClass, Helmet } from '@plone/volto/helpers';
import { Redirect } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Toolbar } from '@plone/volto/components';
import { listMySchedule } from '../../actions/schedule/schedule';
import SessionCard from '../Schedule/SessionCard';

const messages = defineMessages({
  myschedule: {
    id: 'My Schedule',
    defaultMessage: 'My Schedule',
  },
  warning: {
    id: 'Warning',
    defaultMessage: 'Warning',
  },
  scheduleWarning: {
    id: "the time here is shown in YOUR COMPUTER'S time zone. Activities start at 9:00, Brasília time (UTC-0300)",
    defaultMessage:
      "the time here is shown in YOUR COMPUTER'S time zone. Activities start at 9:00, Brasília time (UTC-0300)",
  },
});

const MySchedule = (props) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { location } = props;
  const [isClient, setIsClient] = useState(false);
  const { pathname } = location;
  const token = useSelector((state) => state.userSession.token, shallowEqual);
  const items = useSelector((state) => state.myschedule?.data?.items || []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(listMySchedule());
    }
  }, [dispatch, token]);

  if (__SERVER__ && !token) {
    return <Redirect to={'/login'} />;
  }

  return (
    token && (
      <Container narrow id="myschedule">
        <Helmet title={intl.formatMessage(messages.myschedule)} />
        <BodyClass className={'section-myschedule'} />
        <h1 className={'documentFirstHeading'}>
          {intl.formatMessage(messages.myschedule)}
        </h1>
        <p>
          <strong>{intl.formatMessage(messages.warning)}</strong>:{' '}
          {intl.formatMessage(messages.scheduleWarning)}
        </p>
        <div
          className={
            'block search grid next--is--slate is--first--of--block-type is--last--of--block-type previous--has--same--backgroundColor next--has--same--backgroundColor'
          }
        >
          <div className={'ui stackable grid'}>
            <div className={'row'}>
              <div className={'column'}>
                <div className={'items'}>
                  {items &&
                    items.map((item, idx) => (
                      <div className={'listing-item'} key={idx}>
                        <div className={'card-container session'}>
                          <div className={'item'}>
                            <SessionCard
                              item={item}
                              showDate
                              showAudience
                              showDescription
                              showLevel
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {isClient &&
          createPortal(
            <Toolbar pathname={pathname} hideDefaultViewButtons />,
            document.getElementById('toolbar'),
          )}
      </Container>
    )
  );
};

export default MySchedule;
