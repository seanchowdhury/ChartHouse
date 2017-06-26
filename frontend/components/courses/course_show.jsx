import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { requestCourse } from '../../actions/courses_actions';
import { timeConverter } from '../../util/misc_util';


class CourseShow extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    const decodedPath = google.maps.geometry.encoding.decodePath(this.props.course.waypoints)
    const waypoints = decodedPath.map( (coord) => {
      let lat = coord.lat();
      let lng = coord.lng();
      return [lat, lng];
    })
    const pathUrl = waypoints.join('|');
    const startMarker = waypoints[0];
    const endMarker = waypoints[waypoints.length-1];
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=820x360&style=feature:poi|visibility:off&style=feature:road|visibility:off&style=feature:transit|visibility:off&style=feature:water|color:0x00a9ff&markers=color:green|${startMarker}&markers=color:black|${endMarker}&path=color:0xe20000FF|weight:3|${pathUrl}&key=AIzaSyDKom8LAWsj3_dtLzM5JmvIxbtXr9epP_c`
    return (
      <div className='show-page-container'>
        <div className='show-header'>
          <p><Link to='/courses/'>My Courses</Link> / {this.props.course.title}</p>
          <h1>{this.props.course.title}</h1>
        </div>
        <div className='show-body'>
          <img src={mapUrl} id='show-map'></img>
          <div className='show-stats'>
            <h2 className='author'>By {this.props.course.author_fname} {this.props.course.author_lname}</h2>
            <p>Created on {timeConverter(this.props.course.created_at)}</p>
            <h3>Description: {this.props.course.description}</h3>
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = ({courses}, {match}) => {
  const courseId = parseInt(match.params.courseId);
  const course = courses[courseId];
  return {
    courseId,
    course
};
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CourseShow));
