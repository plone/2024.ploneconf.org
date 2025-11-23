import React from 'react';
import { Container } from '@plone/components';
import { FormattedMessage } from 'react-intl';
import PresentersInfo from '../Session/PresentersInfo/PresentersInfo';
import SessionInfo from '../Session/SessionInfo/SessionInfo';
import SlotInfo from '../Schedule/SlotInfo';
import SessionTrack from '../Session/SessionTrack/SessionTrack';
import SlotActions from '../Session/SlotActions/SlotActions';
import cx from 'classnames';
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
          <SlotActions item={content} />
          <SessionTrack item={content} />
          <SlotInfo item={content} shortDate={false} />
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
