/**
 * PostView view component.
 * @module components/View/Sponsor
 */

import React from 'react';
import PropTypes from 'prop-types';
import Image from '@plone/volto/components/theme/Image/Image';
import Container from '@kitconcept/volto-light-theme/components/Atoms/Container/Container';
import Links from '../Links/Links';

/**
 * PostView view component class.
 * @function SponsorView
 * @params {object} content Content object.
 * @returns {string} Markup of the component.
 */
const SponsorView = ({ content }) => {
  const hasImage = content?.image ? true : false;
  const caption = content?.image_caption;
  const { title, description, links } = content;
  const descriptionLines = description ? description.split('\n') : [];
  return (
    <Container id="page-document" className="view-wrapper sponsor-view">
      {hasImage ? (
        <div id={'sponsorLogo'} className="block image align center">
          <Image
            item={content}
            imageField={'image'}
            alt={caption}
            title={caption}
            responsive={true}
          />
        </div>
      ) : (
        <h1 className="documentFirstHeading">{title}</h1>
      )}
      {descriptionLines && (
        <p className="documentDescription">
          {descriptionLines.map((line) => (
            <>
              <span>{line}</span>
              <br />
            </>
          ))}
        </p>
      )}
      {links && <Links links={links} />}
    </Container>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
SponsorView.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default SponsorView;
