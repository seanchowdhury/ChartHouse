import { RECEIVE_CURRENT_USER } from '../actions/session_actions';
import { RECEIVE_COURSES } from '../actions/courses_actions';
import merge from 'lodash/merge';

const CoursesReducer = (state = {}, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return merge({}, state, action.courses);
    case RECEIVE_COURSES:
      return action.user.courses;
    default:
      return state;
  }
};

export default CoursesReducer;
