/**
 * Talks actions
 * @module actions/sponsors/sponsors
 */

import { LIST_TALKS } from '../../constants/ActionTypes.js';

/**
 * List Talks function.
 * @function listTalks
 * @returns {Object} List Talks action.
 */
export function listTalks() {
  return {
    type: LIST_TALKS,
    request: {
      op: 'get',
      path: '@talks',
    },
  };
}
