import * as ApiUtil from '../util/courses_api_util';

export const RECEIVE_COURSE = 'RECEIVE_COURSE';

export const receiveCourse = course => ({
  type: RECEIVE_COURSE,
  course
});

export const createCourse = (course) => dispatch => {
  return ApiUtil.createCourse(course)
    .then(course => dispatch(recieveCourse(course)));
};
