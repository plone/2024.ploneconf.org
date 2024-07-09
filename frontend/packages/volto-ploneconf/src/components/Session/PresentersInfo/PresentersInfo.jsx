/**
 * PresentersInfo component.
 * @module components/PresentersInfo/PresentersInfo
 */

import React from 'react';
import { flattenToAppURL } from '@plone/volto/helpers';
import DefaultImageSVG from '@plone/volto/components/manage/Blocks/Listing/default-image.svg';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';

const PresentersInfo = (props) => {
  const content = props.content;
  const presenters = content.presenters;
  return (
    <div className="listing-image-wrapper">
      {presenters?.map((item) => (
        <div className="speakers-preview" key={item['@id']}>
          <Link to={flattenToAppURL(item['@id'])}>
            <Popup
              trigger={
                <div className="speakers-preview-image">
                  {!item?.image?.download && (
                    <img src={DefaultImageSVG} alt="" />
                  )}
                  {item?.image?.download && (
                    <img
                      src={flattenToAppURL(item.image.download)}
                      alt={item.title}
                    />
                  )}
                </div>
              }
              position="top center"
            >
              <Popup.Content>{item.title ? item.title : item.id}</Popup.Content>
            </Popup>
          </Link>
        </div>
      ))}
    </div>
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
