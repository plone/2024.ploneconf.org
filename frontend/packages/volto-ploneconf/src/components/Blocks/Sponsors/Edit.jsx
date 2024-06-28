/**
 * Sponsors block.
 * @module components/Blocks/Sponsors/Edit
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withBlockExtensions } from '@plone/volto/helpers';
import Sponsors from './View';

/**
 * Edit document block class.
 * @class Edit
 * @extends Component
 */
const Edit = React.memo((props) => {
  const { data, block } = props;
  return <Sponsors key={block} {...props} data={data} block={block} />;
});

Edit.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  index: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  block: PropTypes.string.isRequired,
  onSelectBlock: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.any),
  properties: PropTypes.objectOf(PropTypes.any).isRequired,
  pathname: PropTypes.string.isRequired,
};

export default withBlockExtensions(Edit);
