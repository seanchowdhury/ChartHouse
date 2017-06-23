import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import values from 'lodash/values';
import DashboardNav from '../dashboard/dashboard_header';
import { requestCourses } from '../../actions/courses_actions';
import Map from '../map/map';

class CoursesIndex extends React.Component {
  constructor(props) {
    super(props);
    this.deleteCourse = this.deleteCourse.bind(this);
  }

  deleteCourse() {
    this.props.requestCourses();
  }

  render() {
    const courseList = values(this.props.courses).map((course) => {
      return <li key={course.id}>
        <Link to={`/courses/${course.id}`}>{course.title}</Link>
      </li>;
    });
    return (
      <div>
        <DashboardNav />
        <div>
          <h3><Link to='/newcourse'>MAURICE THE VAST MAJORITY OF MY WORK IS BEHIND THIS CREATE COURSE LINK</Link></h3>
          <ul className='map-cards'>{courseList}</ul>
        </div>
      </div>
     );
  }
}

const mapStateToProps = ({courses}) => {
  return {
  courses
};
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestCourses: () => dispatch(requestCourses())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CoursesIndex));
