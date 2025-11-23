/**
 * Sponsors reducer.
 * @module reducers/sponsors/sponsors
 */

import {
  ADD_BOOKMARK,
  DELETE_BOOKMARK,
  GET_BOOKMARK,
} from '../../constants/ActionTypes';

const initialState = {
  subrequests: {},
  loading: false,
  error: null,
};

/**
 * Sponsors reducer.
 * @function schedule
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default function myschedule(state = initialState, action = {}) {
  switch (action.type) {
    case `${ADD_BOOKMARK}_PENDING`:
    case `${DELETE_BOOKMARK}_PENDING`:
    case `${GET_BOOKMARK}_PENDING`:
      return {
        ...state,
        subrequests: {
          ...state.subrequests,
          [action.subrequest]: {
            ...(state.subrequests[action.subrequest] || {}),
          },
        },
        loading: true,
        error: null,
      };
    case `${ADD_BOOKMARK}_SUCCESS`:
    case `${DELETE_BOOKMARK}_SUCCESS`:
    case `${GET_BOOKMARK}_SUCCESS`:
      return {
        ...state,
        loading: false,
        subrequests: {
          ...state.subrequests,
          [action.subrequest]: action.result,
        },
        error: null,
      };
    case `${ADD_BOOKMARK}_FAIL`:
    case `${DELETE_BOOKMARK}_FAIL`:
    case `${GET_BOOKMARK}_FAIL`:
      return {
        ...state,
        loading: false,
        subrequests: {
          ...state.subrequests,
          [action.subrequest]: {},
        },
        error: action.error.response.error,
      };
    default:
      return state;
  }
}
