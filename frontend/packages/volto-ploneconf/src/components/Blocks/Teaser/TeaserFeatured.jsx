import React from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { Message, Icon } from 'semantic-ui-react';

import { MaybeWrap } from '@plone/volto/components';
import { UniversalLink } from '@plone/volto/components';
import imageBlockSVG from '@plone/volto/components/manage/Blocks/Image/block-image.svg';
import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
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

const TeaserFeatured = (props) => {
  const { data, isEditMode } = props;
  const intl = useIntl();
  const href = data.href?.[0];
  const image = data.preview_image?.[0];

  const { openExternalLinkInNewTab } = config.settings;

  return (
    <>
      {!href && isEditMode && (
        <Message>
          <div className="main-teaser-item">
            <img src={imageBlockSVG} alt="" />
            <p>{intl.formatMessage(messages.PleaseChooseContent)}</p>
          </div>
        </Message>
      )}
      {href && (
        <div className="main-teaser-item featured">
          {(href.hasPreviewImage || image) && (
            <ImageContainer image={image} alt={data?.title} />
          )}
          <div className="main-teaser-item-content">
            {data?.title && (
              <h1 className="main-teaser-item-title">{data?.title}</h1>
            )}

            {data?.description && (
              <div className="main-teaser-item-description">
                {data?.description}
              </div>
            )}
            <div className="read-more">
              <MaybeWrap
                condition={!isEditMode}
                as={UniversalLink}
                href={href['@id']}
                target={
                  data.openLinkInNewTab ||
                  (openExternalLinkInNewTab && !isInternalURL(href['@id']))
                    ? '_blank'
                    : null
                }
              >
                <FormattedMessage id="Read more" defaultMessage="Read more" />
                <Icon name="add" />
              </MaybeWrap>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

TeaserFeatured.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  isEditMode: PropTypes.bool,
};

export default TeaserFeatured;
