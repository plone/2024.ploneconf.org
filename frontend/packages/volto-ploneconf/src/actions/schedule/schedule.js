/**
 * Talks actions
 * @module actions/schedule/schedule
 */

import { LIST_SCHEDULE } from '../../constants/ActionTypes.js';
import { LIST_MYSCHEDULE } from '../../constants/ActionTypes.js';

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

/**
 * List MySchedule function.
 * @function listMySchedule
 * @returns {Object} List Schedule action.
 */
export function listMySchedule() {
  return {
    type: LIST_MYSCHEDULE,
    request: {
      op: 'get',
      path: '/@my-schedule',
    },
  };
}
