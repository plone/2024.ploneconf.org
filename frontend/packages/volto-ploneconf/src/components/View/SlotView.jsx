import React from 'react';
import { Container } from '@plone/components';
import SessionInfo from '../Session/SessionInfo/SessionInfo';
import SlotDate from '../Session/SlotDate/SlotDate';

const SlotView = ({ content }) => {
  return (
    <Container narrow className={'slot-view'}>
      <Container className="session-wrapper">
        <Container className="session-header">
          <div className="session-info">
            <div className="timing">
              <SlotDate item={content} shortFormat={true} ical={true} />
            </div>
          </div>
          <h1 className={'documentFirstHeading'}>{content.title}</h1>
        </Container>
        <Container className="session-content">
          <SessionInfo
            audience={content?.session_audience}
            level={content?.session_level}
            description={content.description}
          />
        </Container>
      </Container>
    </Container>
  );
};

export default SlotView;
