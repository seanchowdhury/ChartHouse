import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import values from 'lodash/values';
import DashboardNav from '../dashboard/dashboard_header';
import { requestCourses } from '../../actions/courses_actions';
import Map from '../map/map';
import { timeConverter } from '../../util/misc_util';

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
      const startMarker = waypoints[0];
      const endMarker = waypoints[waypoints.length-1];
      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=278x158&style=feature:poi|visibility:off&style=feature:road|visibility:simplified&style=feature:transit|visibility:off&style=feature:water|color:0x00a9ff&markers=color:green|${startMarker}&markers=color:black|${endMarker}&path=color:0xe20000FF|weight:3|${pathUrl}&key=AIzaSyDKom8LAWsj3_dtLzM5JmvIxbtXr9epP_c`
      const distance = google.maps.geometry.spherical.computeLength(decodedPath) / 1609.34;
      const estimatedTime = distance / 2.65 * 3600
      return <li className='course-index-cards' key={course.id}>
        <Link className='index-link' to={`/courses/${course.id}`}>
          <img className='course-index-map' src={mapUrl} />
        </Link>
          <div className='course-index-details'>
            <Link className='index-link' to={`/courses/${course.id}`}>{course.title}</Link>
            <ul className='index-stats'>
              <li className='index-distance'>
                <div className='index-num'>{distance.toFixed(1)}<abbr className='index-unit'>mi</abbr><br /></div>
                <div className='index-label'>Distance</div>
              </li>
              <li>
                <div className='index-num'>{estimatedTime.toString().toHHMMSS()}<br /></div>
                <div className='index-label'>Est. Time</div>
              </li>
            </ul>
          </div>
          <div className='course-index-created'>
            Created on {timeConverter(course.created_at)}
          </div>
      </li>;
    });
    return (
      <div>
        <DashboardNav />
        <div className='page-container'>
          <div className='index-header'>
            <div>
              <h1 className='index-title'>My Courses</h1>
              <Link className='new-course-button' to='/newcourse'>Create New Course</Link>
            </div>
            <section className='index-blurb'>
              <div className='index-blurb-text'>
                <p className='never-lose'>Never Miss Another Torrent<br /></p>
                <p>Consider skilling X Marks the Spot before getting another level <br />of TideBringer.</p>
              </div>
              <img className='x-marks' src={window.images.xMarks} />
            </section>
          </div>
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
