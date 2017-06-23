import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


class CourseShow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <h1>godking calvin</h1>
    )
  }
}

const mapStateToProps = (state, {match}) => {
  const courseId = parseInt(match.params.courseId);
  debugger
  const course = selectCourse(state, match.params.courseId);
  return {
    courseId,
    course
};
};

const mapDispatchToProps = (dispatch) => {
  return {
    createCourse: (course) => dispatch(createCourse(course))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CourseShow));
