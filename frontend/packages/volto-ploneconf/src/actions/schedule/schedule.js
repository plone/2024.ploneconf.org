/**
 * Talks actions
 * @module actions/schedule/schedule
 */

import { LIST_SCHEDULE } from '../../constants/ActionTypes.js';

/**
 * List Schedule function.
 * @function listSchedule
 * @returns {Object} List Schedule action.
 */
export function listSchedule() {
  return {
    type: LIST_SCHEDULE,
    request: {
      op: 'get',
      path: '@schedule',
    },
  };
}
