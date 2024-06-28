/**
 * Root reducer.
 * @module reducers/root
 */

import sponsors from './sponsors/sponsors';
import talks from './talks/talks';
import defaultReducers from '@plone/volto/reducers';

/**
 * Root reducer.
 * @function
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
const reducers = {
  ...defaultReducers,
  // Add your reducers here
  sponsors,
  talks,
};

export default reducers;
