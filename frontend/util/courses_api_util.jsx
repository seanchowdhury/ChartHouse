export const createCourse = (course) => {
  return $.ajax({
    method: 'POST',
    url: '/api/courses',
    data: courses
  });
};

export const recieveCourse = (course) => {
  return $.ajax({
    method: 'GET',
    url: '/api/courses',
    data: `api/courses/${course}`
  });
};
