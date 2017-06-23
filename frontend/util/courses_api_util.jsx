export const createCourse = (course) => {
  return $.ajax({
    method: 'POST',
    url: '/api/courses',
    data: {course}
  });
};

export const receiveCourses = (course) => {
  debugger
  return $.ajax({
    method: 'GET',
    url: '/api/courses',
    data: `api/courses/${course}`
  });
};
