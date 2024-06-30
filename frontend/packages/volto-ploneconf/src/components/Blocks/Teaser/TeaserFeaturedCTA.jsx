import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Message } from 'semantic-ui-react';

import imageBlockSVG from '@plone/volto/components/manage/Blocks/Image/block-image.svg';
import { flattenToAppURL } from '@plone/volto/helpers';
import Picture from 'volto-ploneconf/components/Picture/Picture';

import PropTypes from 'prop-types';

const messages = defineMessages({
  PleaseChooseContent: {
    id: 'Please choose an existing content as source for this element',
    defaultMessage:
      'Please choose an existing content as source for this element',
  },
});

const ImageContainer = (props) => {
  const { image, alt } = props;
  return (
    <Picture
      source="mainimage"
      lazy={false}
      content={image}
      imageBase={flattenToAppURL(
        `${image['@id']}/@@images/${image.image_field}`,
      )}
      alt={alt}
    ></Picture>
  );
};

const TeaserFeaturedCTA = (props) => {
  const { data, isEditMode } = props;
  const intl = useIntl();
  const href = data.href?.[0];
  const image = data.preview_image?.[0];

  return (
    <>
      {!href && isEditMode && (
        <Message>
          <div className="main-teaser-cta-item">
            <img src={imageBlockSVG} alt="" />
            <p>{intl.formatMessage(messages.PleaseChooseContent)}</p>
          </div>
        </Message>
      )}
      {href && (
        <div className="main-teaser-cta-item featured">
          {(href.hasPreviewImage || image) && (
            <ImageContainer image={image} alt={data?.title} />
          )}
          <div className="main-teaser-cta-item-content">
            {data?.title && (
              <h1 className="main-teaser-cta-item-title">{data?.title}</h1>
            )}

            {data?.description && (
              <div className="main-teaser-cta-item-description">
                {data?.description}
              </div>
            )}
            <div className="actions">
              <button>Get your ticket</button>
              <button>Call for papers</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

TeaserFeaturedCTA.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  isEditMode: PropTypes.bool,
};

export default TeaserFeaturedCTA;
