/**
 * Sponsors reducer.
 * @module reducers/sponsors/sponsors
 */

import { LIST_SPONSORS } from '../../constants/ActionTypes';

const initialState = {
  levels: [],
  loading: false,
  error: null,
};

/**
 * Sponsors reducer.
 * @function sponsors
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default function sponsors(state = initialState, action = {}) {
  switch (action.type) {
    case `${LIST_SPONSORS}_PENDING`:
      return {
        ...state,
        loading: true,
        levels: [],
        error: null,
      };
    case `${LIST_SPONSORS}_SUCCESS`:
      return {
        ...state,
        loading: false,
        levels: action.result.levels,
        error: null,
      };
    case `${LIST_SPONSORS}_FAIL`:
      return {
        ...state,
        loading: false,
        levels: [],
        error: action.error.response.error,
      };
    default:
      return state;
  }
}
