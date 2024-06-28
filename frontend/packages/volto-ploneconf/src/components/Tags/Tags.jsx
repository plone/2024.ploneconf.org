/**
 * Tags component.
 * @module components/theme/Tags/Tags
 */

import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Container from '@kitconcept/volto-light-theme/components/Atoms/Container/Container';
import { Icon } from '@plone/volto/components';
import tagSVG from '@plone/volto/icons/tag.svg';

/**
 * Tags component class.
 * @function Tags
 * @param {array} tags Array of tags.
 * @returns {string} Markup of the component.
 */
const Tags = ({ tags }) =>
  tags && tags.length > 0 ? (
    <Container layout className="tags">
      <Icon name={tagSVG} />
      {tags.map((tag, i) => (
        <>
          <Link className="ui tag" key={tag} to={`/search?Subject=${tag}`}>
            {tag}
          </Link>
          {tags.length > i + 1 && <span className="divider">,</span>}
        </>
      ))}
    </Container>
  ) : (
    <span />
  );

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Tags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
Tags.defaultProps = {
  tags: null,
};

export default Tags;
