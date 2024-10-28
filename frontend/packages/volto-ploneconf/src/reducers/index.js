/**
 * Root reducer.
 * @module reducers/root
 */

import sponsors from './sponsors/sponsors';
import schedule from './schedule/schedule';
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
  schedule,
};

export default reducers;
