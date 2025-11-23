import { LIST_STREAM } from '../../constants/ActionTypes';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export default function stream(state = initialState, action = {}) {
  switch (action.type) {
    case `${LIST_STREAM}_PENDING`:
      return {
        ...state,
        loading: true,
        data: [],
        error: null,
      };
    case `${LIST_STREAM}_SUCCESS`:
      return {
        ...state,
        loading: false,
        data: action.result,
        error: null,
      };
    case `${LIST_STREAM}_FAIL`:
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
