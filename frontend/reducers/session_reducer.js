import { RECEIVE_CURRENT_USER, RECEIVE_ERRORS, CLEAR_ERRORS } from '../actions/session_actions';

const defaultState = {
  currentUser: null,
  errors: [],
  currentPos: window.currentPos};

const SessionReducer = (state= defaultState, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return { currentUser: action.currentUser, errors: [], currentPos: window.currentPos };
    case RECEIVE_ERRORS:
      return { currentUser: null, errors: action.errors, currentPos: window.currentPos};
    case CLEAR_ERRORS:
      return defaultState;
    default:
      return state;
  }
};

export default SessionReducer;
