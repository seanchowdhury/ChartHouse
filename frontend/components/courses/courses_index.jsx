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
      const decodedPath = google.maps.geometry.encoding.decodePath(course.waypoints)
      const waypoints = decodedPath.map( (coord) => {
        let lat = coord.lat();
        let lng = coord.lng();
        return [lat, lng];
      })
      const pathUrl = waypoints.join('|');
      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=300x150&path=color:red|${pathUrl}&key=AIzaSyDKom8LAWsj3_dtLzM5JmvIxbtXr9epP_c`
      return <li key={course.id}>
        <Link to={`/courses/${course.id}`}>{course.title} <img src={mapUrl} /></Link>

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
