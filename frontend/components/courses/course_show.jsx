import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';


class CourseShow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const decodedPath = google.maps.geometry.encoding.decodePath(this.props.course.waypoints)
    const waypoints = decodedPath.map( (coord) => {
      let lat = coord.lat();
      let lng = coord.lng();
      return [lat, lng];
    })
    const pathUrl = waypoints.join('|');
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x300&path=color:red|${pathUrl}&key=AIzaSyDKom8LAWsj3_dtLzM5JmvIxbtXr9epP_c`
    return (
      <div>
        <h1>Title: {this.props.course.title}</h1>
        <h3>Description: {this.props.course.description}</h3>
        <h2><Link to='/courses'>Back to Index</Link></h2>
        <img src={mapUrl}></img>
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
