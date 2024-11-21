/**
 * Talks actions
 * @module actions/schedule/schedule
 */

import { LIST_STREAM } from '../../constants/ActionTypes.js';

/**
 * List Schedule function.
 * @function listSchedule
 * @returns {Object} List Schedule action.
 */
export function listStream(pathname) {
  return {
    type: LIST_STREAM,
    request: {
      op: 'get',
      path: `${pathname}/@stream`,
    },
  };
}
