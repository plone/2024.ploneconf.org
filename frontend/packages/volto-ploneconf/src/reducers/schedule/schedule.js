/**
 * Sponsors reducer.
 * @module reducers/sponsors/sponsors
 */

import { LIST_SCHEDULE } from '../../constants/ActionTypes';

const initialState = {
  data: [],
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
export default function schedule(state = initialState, action = {}) {
  switch (action.type) {
    case `${LIST_SCHEDULE}_PENDING`:
      return {
        ...state,
        loading: true,
        data: [],
        error: null,
      };
    case `${LIST_SCHEDULE}_SUCCESS`:
      return {
        ...state,
        loading: false,
        data: action.result,
        error: null,
      };
    case `${LIST_SCHEDULE}_FAIL`:
      return {
        ...state,
        loading: false,
        data: [],
        error: action.error.response.error,
      };
    default:
      return state;
  }
}
