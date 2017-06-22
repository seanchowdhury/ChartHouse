import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import values from 'lodash/values';
import DashboardNav from '../dashboard/dashboard_header';
import Map from '../map/map';

class CoursesIndex extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const courseList = this.props.courses.map((course) => {
      return <li key={course.id}>
        <CourseMap polyline='course.polyline' />
        <br />
        {course.title}
      </li>;
    });
    return (
      <div>
        <DashboardNav />
        <div>
          <ul className='map-cards'>{courseList}</ul>
        </div>
      </div>
     );
  }
}

const mapStateToProps = ({courses}) => {
  const coursesArray = values(courses);
  return {
  courses: coursesArray
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
