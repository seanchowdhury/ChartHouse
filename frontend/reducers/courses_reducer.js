import { RECEIVE_CURRENT_USER } from '../actions/session_actions';
import { RECEIVE_COURSE, RECEIVE_COURSES } from '../actions/courses_actions';
import merge from 'lodash/merge';

const CoursesReducer = (state = {}, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      if (action.courses) {
        return action.courses;
      } else {
        return {};
      }
    case RECEIVE_COURSES:
      return action.courses;
    case RECEIVE_COURSE:
      return merge({}, state, action.course)
    default:
      return state;
  }
};

export default CoursesReducer;
