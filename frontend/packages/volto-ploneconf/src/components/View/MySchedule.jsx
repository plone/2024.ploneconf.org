import { useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { defineMessages, injectIntl, useIntl } from 'react-intl';
import { Container } from '@plone/components';
import { BodyClass, Helmet } from '@plone/volto/helpers';
import { Redirect } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Toolbar } from '@plone/volto/components';
import { listMySchedule } from '../../actions/schedule/schedule';
import { getContent } from '@plone/volto/actions';
import SessionCard from '../Schedule/SessionCard';
import MyScheduleIcal from '../Schedule/MyScheduleIcal';

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
  downloadIcal: {
    id: 'Download your schedule and add it to your personal calendar',
    defaultMessage:
      'Download your schedule and add it to your personal calendar',
  },
});

const MySchedule = (props) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { location } = props;
  const [isClient, setIsClient] = useState(false);
  let { pathname } = location;
  pathname = pathname.replace('/mySchedule', '');
  const navRoot = useSelector((state) => state.navroot?.data?.navroot?.['@id']);
  const token = useSelector((state) => state.userSession.token, shallowEqual);
  const items = useSelector((state) => state.myschedule?.data?.items || []);

  useEffect(() => {
    setIsClient(true);
    dispatch(getContent(pathname));
  }, [dispatch, pathname]);

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
        {navRoot && (
          <p>
            <span>{intl.formatMessage(messages.downloadIcal)}</span>{' '}
            <MyScheduleIcal />
          </p>
        )}
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

export default injectIntl(MySchedule);
