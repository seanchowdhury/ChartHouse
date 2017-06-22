import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';


class Map extends React.Component {
  componentDidMount() {
    const mapOptions = {
      center: { lat: 37.77, lng: -122.435 },
      zoom: 13,
      style: mapStyle
    };
    this.map = new google.maps.Map(this.mapNode, mapOptions );
  }

  render() {
    return (
      <div id='course-map-container' ref={ map => this.mapNode = map }>
        Map
      </div>
    );
  }
}

export default withRouter(Map);
