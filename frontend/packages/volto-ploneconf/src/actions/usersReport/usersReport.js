import { GET_USERSREPORTS } from '../../constants/ActionTypes.js';

export function getUserReports(userId) {
  return {
    type: GET_USERSREPORTS,
    request: {
      op: 'get',
      path: `/@users-report/${userId}`,
    },
  };
}
