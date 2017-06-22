import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


class CourseCreate extends React.Component {

  componentDidMount() {
    let initialPosition = { lat: 40.728420, lng: -74.013389 }
    const mapOptions = {
      center: initialPosition,
      zoom: 15
    };
    this.map = new google.maps.Map(this.mapNode, mapOptions );
  }

  render() {
    return (
      <div id='course-create-container' ref={ map => this.mapNode = map }>
        Map
      </div>
    );
  }
}


const mapStateToProps = ({courses}) => {
  return {

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CourseCreate));
