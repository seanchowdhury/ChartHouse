export const createCourse = (course) => {
  debugger
  return $.ajax({
    method: 'POST',
    url: '/api/courses',
    data: course
  });
};

export const recieveCourse = (course) => {
  debugger
  return $.ajax({
    method: 'GET',
    url: '/api/courses',
    data: `api/courses/${course}`
  });
};
