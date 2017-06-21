import * as ApiUtil from '../util/courses_api_util';

export const RECEIVE_COURSES = 'RECEIVE_COURSES';

export const receiveCourses = courses => ({
  type: RECEIVE_COURSES,
  courses
});


export const fetchCoursesForUser = (user) => dispatch => {
  return ApiUtil.fetchCourses(user)
    .then(user => dispatch(receiveCurrentUser(user)));
};
