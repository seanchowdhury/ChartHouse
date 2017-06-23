export const createCourse = (course) => {
  return $.ajax({
    method: 'POST',
    url: '/api/courses',
    data: {course}
  });
};

export const requestCourse = (course) => {
  return $.ajax({
    method: 'GET',
    url: `/api/courses/${Object.keys(course)[0]}`
  });
}

export const requestCourses = () => {
  return $.ajax({
    method: 'GET',
    url: '/api/courses'
  });
}
