import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import values from 'lodash/values';

class CoursesIndex extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //request courses

  }

  render() {
    const courseList = this.props.courses.map((course) => {
      return <li key={course.id}>{course.title}</li>;
    });
    return ( <ul>{this.props.courses.title}</ul> );
  }
}

const mapStateToProps = (state) => {
  const coursesArray = values(state.courses);
  return {
  courses
};
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CoursesIndex));
