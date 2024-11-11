import {
  ADD_REGISTRATION,
  GET_REGISTRATION,
  DELETE_REGISTRATION,
  UPDATE_REGISTRATION,
  GET_REGISTRATIONS,
  UPDATE_REGISTRATIONS,
} from '../../constants/ActionTypes.js';

const initialState = {
  subrequests: {},
  loading: false,
  error: null,
};

const trainingInitialState = {
  items: [],
  registration: {},
};

export default function registrations(state = initialState, action = {}) {
  switch (action.type) {
    case `${ADD_REGISTRATION}_PENDING`:
    case `${GET_REGISTRATION}_PENDING`:
    case `${DELETE_REGISTRATION}_PENDING`:
    case `${UPDATE_REGISTRATION}_PENDING`:
      return {
        ...state,
        subrequests: {
          ...state.subrequests,
          [action.subrequest]: {
            ...(state.subrequests[action.subrequest] || trainingInitialState),
          },
        },
        loading: true,
        error: null,
      };
    case `${GET_REGISTRATIONS}_PENDING`:
    case `${UPDATE_REGISTRATIONS}_PENDING`:
      return {
        ...state,
        subrequests: {
          ...state.subrequests,
          [action.subrequest]: {
            ...(state.subrequests[action.subrequest] || trainingInitialState),
          },
        },
        loading: true,
        error: null,
      };
    case `${ADD_REGISTRATION}_SUCCESS`:
    case `${GET_REGISTRATION}_SUCCESS`:
    case `${DELETE_REGISTRATION}_SUCCESS`:
    case `${UPDATE_REGISTRATION}_SUCCESS`:
      return {
        ...state,
        loading: false,
        subrequests: {
          ...state.subrequests,
          [action.subrequest]: { registration: action.result, items: [] },
        },
        error: null,
      };
    case `${GET_REGISTRATIONS}_SUCCESS`:
    case `${UPDATE_REGISTRATIONS}_SUCCESS`:
      return {
        ...state,
        loading: false,
        subrequests: {
          ...state.subrequests,
          [action.subrequest]: {
            registration: {},
            items: action.result.registrations,
          },
        },
        error: null,
      };
    case `${ADD_REGISTRATION}_FAIL`:
    case `${GET_REGISTRATION}_FAIL`:
    case `${DELETE_REGISTRATION}_FAIL`:
    case `${UPDATE_REGISTRATION}_FAIL`:
    case `${GET_REGISTRATIONS}_FAIL`:
    case `${UPDATE_REGISTRATIONS}_FAIL`:
      return {
        ...state,
        loading: false,
        subrequests: {
          ...state.subrequests,
          [action.subrequest]: trainingInitialState,
        },
        error: action.error.response.error,
      };
    default:
      return state;
  }
}
