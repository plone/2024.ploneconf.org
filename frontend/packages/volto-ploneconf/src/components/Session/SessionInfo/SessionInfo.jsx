/**
 * SessionInfo component.
 * @module components/SessionInfo/SessionInfo
 */

import React from 'react';
import { Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const SessionInfo = (props) => {
  const audience = props.audience;
  const level = props.level;
  return (
    <div className={'session-info'}>
      {audience && (
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
      {level && (
        <Label.Group>
          <strong>Level:</strong>{' '}
          {level.map((level) => (
            <Label key={level.token} className={`level-${level.token}`}>
              {level.title}
            </Label>
          ))}
        </Label.Group>
      )}
    </div>
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
