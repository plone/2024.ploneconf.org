/**
 * Root reducer.
 * @module reducers/root
 */

import bookmark from './bookmark/bookmark';
import registrations from './registrations/registrations';
import sponsors from './sponsors/sponsors';
import schedule from './schedule/schedule';
import myschedule from './myschedule/myschedule';
import usersReport from './usersReport/usersReport';
import defaultReducers from '@plone/volto/reducers';

/**
 * Root reducer.
 * @function
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
const reducers = {
  ...defaultReducers,
  // Add your reducers here
  bookmark,
  registrations,
  sponsors,
  schedule,
  myschedule,
  usersReport,
};

export default reducers;
