import React from 'react';
import { Container } from '@plone/components';
import { Embed } from 'semantic-ui-react';
import PresentersInfo from '../Session/PresentersInfo/PresentersInfo';
import SlotInfo from '../Schedule/SlotInfo';
import SessionInfo from '../Session/SessionInfo/SessionInfo';
import SessionTrack from '../Session/SessionTrack/SessionTrack';
import SlotActions from '../Session/SlotActions/SlotActions';
import cx from 'classnames';

const SessionView = ({ content }) => {
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
            <div
              dangerouslySetInnerHTML={{
                __html: content.text.data,
              }}
            />
          )}
        </Container>
        <PresentersInfo content={content} />
      </Container>
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
      {content.video_url && (
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
      )}
    </Container>
  );
};

export default SessionView;
