/**
 * PresentersInfo component.
 * @module components/PresentersInfo/PresentersInfo
 */

import React from 'react';
import { Container } from '@plone/components';
import PresenterInfo from '../../PresenterInfo/PresenterInfo';
import PropTypes from 'prop-types';

const PresentersInfo = (props) => {
  const content = props.content;
  const presenters = content.presenters;
  return (
    <Container narrow className="listing-presenters">
      {presenters?.map((item) => {
        return (
          <Container className="listing-presenter" key={item['@id']}>
            <PresenterInfo item={item} isEditMode={false} />
          </Container>
        );
      })}
    </Container>
  );
};

PresentersInfo.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    text: PropTypes.shape({
      data: PropTypes.string,
    }),
    presenters: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        image: PropTypes.object,
      }),
    ),
    session_audience: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        token: PropTypes.string,
      }),
    ),
    session_level: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        token: PropTypes.string,
      }),
    ),
    track: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        token: PropTypes.string,
      }),
    ),
    end: PropTypes.string,
    start: PropTypes.string,
  }).isRequired,
};

export default PresentersInfo;
