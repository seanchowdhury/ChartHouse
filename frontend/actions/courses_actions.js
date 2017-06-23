import * as ApiUtil from '../util/courses_api_util';
import { receiveErrors } from './error_actions';

export const RECEIVE_COURSES = 'RECEIVE_COURSES';

export const receiveCourses = courses => ({
  type: RECEIVE_COURSES,
  courses
});

export const createCourse = (course) => dispatch => {
  return ApiUtil.createCourse(course)
    .then(course => (
      dispatch(receiveCourses(course))),
          err => {
      return dispatch(receiveErrors(err.responseJSON));
  });
};
