import React, { useState } from 'react';
import { Container, Button, VideoIcon } from '@plone/components';
import { Embed } from 'semantic-ui-react';
import PresentersInfo from '../Session/PresentersInfo/PresentersInfo';
import SlotInfo from '../Schedule/SlotInfo';
import SessionInfo from '../Session/SessionInfo/SessionInfo';
import SessionTrack from '../Session/SessionTrack/SessionTrack';
import SlotActions from '../Session/SlotActions/SlotActions';
import cx from 'classnames';
import { defineMessages, useIntl } from 'react-intl';
import LiveStreamModal from '../LiveStream/LiveStreamModal';

const messages = defineMessages({
  watchStream: {
    id: 'Watch Stream',
    defaultMessage: 'Watch Stream',
  },
});

const SessionView = ({ content }) => {
  const [streamModal, setStreamModal] = useState(false);
  const intl = useIntl();
  return (
    <Container
      className={cx('session-view', {
        'too-many-speakers': content.presenters?.length > 2,
      })}
    >
      <Container className="session-wrapper" narrow>
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
            <div
              dangerouslySetInnerHTML={{
                __html: content.text.data,
              }}
            />
          )}
        </Container>
        <PresentersInfo content={content} />
      </Container>
      <Container className="session-materials" layout>
        {content.video_url ? (
          <>
            <h3 className="underlined-header">Recorded talk</h3>
            <div className="video-inner">
              <Embed
                id={
                  content.video_url.match(/.be\//)
                    ? content.video_url.match(/^.*\.be\/(.*)/)[1]
                    : content.video_url.match(/^.*\?v=(.*)$/)[1]
                }
                source="youtube"
                icon="play"
                defaultActive
                autoplay={false}
              />
            </div>
          </>
        ) : (
          content.stream_url && (
            <Container narrow className="liveStreamContainer">
              <Button
                className="liveStreamButton"
                aria-label={intl.formatMessage(messages.watchStream)}
                onPress={() => setStreamModal(true)}
              >
                <VideoIcon />
                <span>{intl.formatMessage(messages.watchStream)}</span>
              </Button>
              <LiveStreamModal
                streamInfo={{
                  stream_url: content.stream_url,
                  stream_domain: content.stream_domain,
                }}
                streamModal={streamModal}
                setStreamModal={setStreamModal}
              />
            </Container>
          )
        )}
        {(content.slides_url || content.slides_embed) && (
          <h3 className="underlined-header">Slides</h3>
        )}
        {content.slides_url && (
          <div className="slide-link-wrapper">
            <a className="ui button primary" href={content.slides_url}>
              Slides URL
            </a>
          </div>
        )}
        {content.slides_embed && (
          <div
            dangerouslySetInnerHTML={{
              __html: content.slides_embed,
            }}
          />
        )}
      </Container>
    </Container>
  );
};

export default SessionView;
