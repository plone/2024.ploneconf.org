import {
  ADD_REGISTRATION,
  GET_REGISTRATION,
  DELETE_REGISTRATION,
  UPDATE_REGISTRATION,
  GET_REGISTRATIONS,
  UPDATE_REGISTRATIONS,
} from '../../constants/ActionTypes.js';

export function getRegistration(path, subrequest) {
  return {
    type: GET_REGISTRATION,
    subrequest,
    request: {
      op: 'get',
      path: `${path}/@registration`,
    },
  };
}

export function addRegistration(path, subrequest, payload) {
  return {
    type: ADD_REGISTRATION,
    subrequest,
    request: {
      op: 'post',
      path: `${path}/@registration`,
      data: payload,
    },
  };
}
export function updateRegistration(path, subrequest, payload) {
  return {
    type: UPDATE_REGISTRATION,
    subrequest,
    request: {
      op: 'patch',
      path: `${path}/@registration`,
      data: payload,
    },
  };
}

export function deleteRegistration(path, subrequest) {
  return {
    type: DELETE_REGISTRATION,
    subrequest,
    request: {
      op: 'del',
      path: `${path}/@registration`,
      data: {},
    },
  };
}

export function getRegistrations(path, subrequest) {
  return {
    type: GET_REGISTRATIONS,
    subrequest,
    request: {
      op: 'get',
      path: `${path}/@registrations`,
    },
  };
}

export function updateRegistrations(path, subrequest, payload) {
  return {
    type: UPDATE_REGISTRATIONS,
    subrequest,
    request: {
      op: 'patch',
      path: `${path}/@registrations`,
      data: payload,
    },
  };
}
