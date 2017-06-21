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
    url: '/api/courses',
    data: `api/courses/${course}`
  });
};

export const requestCourses = (user) => {
  return $.ajax({
    method: 'GET',
    url: `/api/users/${user}`
  });
};
