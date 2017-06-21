import { RECEIVE_CURRENT_USER } from '../actions/session_actions';

const CoursesReducer = (state = {}, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return action.currentUser.courses;
    default:
      return state;
  }
};

export default CoursesReducer;
