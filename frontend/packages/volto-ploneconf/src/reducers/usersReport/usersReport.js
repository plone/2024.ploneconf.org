import { GET_USERSREPORTS } from '../../constants/ActionTypes';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export default function usersReport(state = initialState, action = {}) {
  switch (action.type) {
    case `${GET_USERSREPORTS}_PENDING`:
      return {
        ...state,
        loading: true,
        data: [],
        error: null,
      };
    case `${GET_USERSREPORTS}_SUCCESS`:
      return {
        ...state,
        loading: false,
        data: action.result,
        error: null,
      };
    case `${GET_USERSREPORTS}_FAIL`:
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
