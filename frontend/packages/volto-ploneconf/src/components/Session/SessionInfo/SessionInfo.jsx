/**
 * SessionInfo component.
 * @module components/SessionInfo/SessionInfo
 */

import React from 'react';
import { Container } from '@plone/components';
import SessionAudience from '../SessionAudience/SessionAudience';
import SessionLevel from '../SessionLevel/SessionLevel';

const SessionInfo = ({ audience, level, description }) => {
  return (
    <Container className={'session-info'}>
      {audience && <SessionAudience item={{ audience: audience }} />}
      {level && <SessionLevel item={{ level: level }} />}
      {description && <p className="session-description">{description}</p>}
    </Container>
  );
};

export default SessionInfo;
