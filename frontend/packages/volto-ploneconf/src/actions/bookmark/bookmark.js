/**
 * Talks actions
 * @module actions/schedule/schedule
 */

import { ADD_BOOKMARK } from '../../constants/ActionTypes.js';
import { GET_BOOKMARK } from '../../constants/ActionTypes.js';
import { DELETE_BOOKMARK } from '../../constants/ActionTypes.js';

export function getBookmark(path, subrequest) {
  return {
    type: GET_BOOKMARK,
    subrequest,
    request: {
      op: 'get',
      path: `${path}/@bookmark`,
    },
  };
}

export function addBookmark(path, subrequest) {
  return {
    type: ADD_BOOKMARK,
    subrequest,
    request: {
      op: 'post',
      path: `${path}/@bookmark`,
      data: {},
    },
  };
}

export function deleteBookmark(path, subrequest) {
  return {
    type: DELETE_BOOKMARK,
    subrequest,
    request: {
      op: 'del',
      path: `${path}/@bookmark`,
      data: {},
    },
  };
}
