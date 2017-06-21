export const createCourse = (course) => {
  return $.ajax({
    method: 'POST',
    url: '/api/courses',
    data: courses
  });
};

export const requestCourse = (course) => {
  return $.ajax({
    method: 'GET',
    data: `api/courses/${course}`
  });
};
