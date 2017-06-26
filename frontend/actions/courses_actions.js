import * as ApiUtil from '../util/courses_api_util';
import { receiveErrors } from './error_actions';

export const RECEIVE_COURSES = 'RECEIVE_COURSES';
export const RECEIVE_COURSE = 'RECEIVE_COURSE';

export const receiveCourses = courses => ({
  type: RECEIVE_COURSES,
  courses
});

export const receiveCourse = course => ({
  type: RECEIVE_COURSE,
  course
});

export const createCourse = (course) => dispatch => {
  return ApiUtil.createCourse(course)
    .then(course => (
      dispatch(receiveCourse(course))),
          err => {
      return dispatch(receiveErrors(err.responseJSON));
  });
};

export const requestCourses = () => dispatch => {
  return ApiUtil.requestCourses()
    .then(courses => (
      dispatch(receiveCourses(courses))
    ));
};

export const requestCourse = () => dispatch => {
  return ApiUtil.requestCourse()
    .then(course => (
      dispatch(receiveCourse(course))
    ));
};
