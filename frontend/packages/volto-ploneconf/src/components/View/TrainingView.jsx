import React from 'react';
import { Container } from '@plone/components';
import { FormattedMessage } from 'react-intl';
import PresentersInfo from '../Session/PresentersInfo/PresentersInfo';
import SessionInfo from '../Session/SessionInfo/SessionInfo';
import SessionTrack from '../Session/SessionTrack/SessionTrack';
import SlotDate from '../Session/SlotDate/SlotDate';
import SessionLanguage from '../Session/SessionLanguage/SessionLanguage';
import SessionRoom from '../Session/SessionRoom/SessionRoom';
import cx from 'classnames';
import Bookmark from '../Bookmark/Bookmark';
import Register from '../Registrations/Register';

const TrainingView = ({ location, content }) => {
  const { pathname } = location;
  return (
    <Container
      narrow
      className={cx('session-view', {
        'too-many-speakers': content.presenters?.length > 2,
      })}
    >
      <Container className="session-wrapper">
        <Container className="session-header">
          <div className="session-info">
            <div className="timing">
              <SlotDate item={content} shortFormat={false} ical={true} />
            </div>
            <SessionRoom item={content} />
            <SessionLanguage item={content} />
            <Bookmark item={content} />
          </div>
          <SessionTrack item={content} />
          <h1 className={'documentFirstHeading'}>{content.title}</h1>
        </Container>
        <Container className="session-content">
          <SessionInfo
            audience={content.session_audience}
            level={content.session_level}
            description={content.description}
          />
          {content.text && (
            <>
              <h2>
                <FormattedMessage
                  id={'Description'}
                  defaultMessage={'Description'}
                />
              </h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: content.text.data,
                }}
              />
            </>
          )}
          {content.requirements && (
            <>
              <h2>
                <FormattedMessage
                  id={'Requirements'}
                  defaultMessage={'Requirements'}
                />
              </h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: content.requirements.data,
                }}
              />
            </>
          )}
          <Register pathname={pathname} content={content} />
        </Container>
        <PresentersInfo content={content} />
      </Container>
    </Container>
  );
};

export default TrainingView;
