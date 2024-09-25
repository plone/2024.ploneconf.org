/**
 * SessionInfo component.
 * @module components/SessionInfo/SessionInfo
 */

import React from 'react';
import { Container } from '@plone/components';
import { Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const SessionInfo = (props) => {
  const audience = props.audience;
  const level = props.level;
  const description = props.description;
  return (
    <Container className={'session-info'}>
      {audience?.length > 0 && (
        <Label.Group>
          <strong>Audience:</strong>{' '}
          {audience.map((audience) => (
            <Label
              key={audience.token}
              className={`audience-${audience.token}`}
            >
              {audience.title}
            </Label>
          ))}
        </Label.Group>
      )}
      {level?.length > 0 && (
        <Label.Group>
          <strong>Level:</strong>{' '}
          {level.map((level) => (
            <Label key={level.token} className={`level-${level.token}`}>
              {level.title}
            </Label>
          ))}
        </Label.Group>
      )}
      {description && <p className="session-description">{description}</p>}
    </Container>
  );
};

SessionInfo.propTypes = {
  audience: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      token: PropTypes.string,
    }),
  ),
  level: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      token: PropTypes.string,
    }),
  ),
};

export default SessionInfo;
