import * as ApiUtil from '../util/courses_api_util';

export const RECEIVE_COURSES = 'RECEIVE_COURSES';

export const receiveCourses = courses => ({
  type: RECEIVE_COURSES,
  courses
});


export const fetchCourses = user => dispatch => {
  return ApiUtil.fetchCourses(user)
    .then( courses => dispatch(receiveCourses(courses)));
};
