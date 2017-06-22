import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createCourse } from '../../actions/courses_actions';
import CourseCreateHeader from './course_create_header';

class CourseCreate extends React.Component {

  constructor(props) {
    super(props);
    this.pathMarkers = [];
    this.distance = 0;
    this.polyline;
    this.saveMap = this.saveMap.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.renderPolyline = this.renderPolyline.bind(this);
    this.addMarker = this.addMarker.bind(this);
    this.undoMarker = this.undoMarker.bind(this);
    this.state = {
      lat: 40.728420,
      lng: -74.013389,
      distance: 0,
      esttime: 0
    }
  }

  saveMap() {
    const waypoints = google.maps.geometry.encoding.encodePath(this.polyline.getPath());

  }

  addMarker(position) {
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        strokeColor: '#968899',
      },
      draggable: true
    });

    marker.addListener('dragend', () => {
      return this.renderPolyline(this.pathMarkers);
   });

    this.pathMarkers.push(marker);
    const markers = this.pathMarkers;
    if (markers.length > 1) {
      this.renderPolyline(this.pathMarkers);

    }
  }

  undoMarker() {
    if (this.pathMarkers.length > 0){
      const lastMarker = this.pathMarkers.pop();
      lastMarker.setMap(null);
      this.polyline.setMap(null);
      this.renderPolyline(this.pathMarkers);
    }
  }

  clearAll() {
    if (this.pathMarkers.length > 0){
      this.pathMarkers.forEach((marker) => marker.setMap(null));
      this.pathMarkers = [];
      this.polyline.setMap(null);
      this.setState( {distance: 0, esttime: 0} );
    }
  }

  renderPolyline(pathMarkers) {
    if (this.polyline) {
      this.polyline.setMap(null);
    }
    const path = [];
    for (let i = 0; i < pathMarkers.length; i++){
      path.push({ lat: pathMarkers[i].position.lat(), lng: pathMarkers[i].position.lng() });
    }


    const coursePoly = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 0.9,
      strokeWeight: 2
    });
    this.polyline = coursePoly;
    coursePoly.setMap(this.map);
    const distance = google.maps.geometry.spherical.computeLength(coursePoly.getPath().getArray()) / 1609.34
    this.setState({
      distance,
      esttime: distance / 2.65 * 3600
    })
  }

  componentDidMount() {
    const mapStyle = ([
  {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.local",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#5ea6ff"
        },
        {
          "saturation": 60
        },
        {
          "weight": 5
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text",
      "stylers": [
        {
          "color": "#f2fff1"
        },
        {
          "lightness": 30
        }
      ]
    },
    {
    }
  ]);
    const mapOptions = {
      center: this.state,
      zoom: 15,
      styles: mapStyle,
      clickableIcons: false
    };

    navigator.geolocation.getCurrentPosition( (pos)=> {
      this.map.setCenter({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      })
    })

    this.map = new google.maps.Map(this.mapNode, mapOptions );
    this.map.addListener('click', (e) => {
      this.addMarker(e.latLng);
    });
  }

  render() {
    let renderTime;
    if (this.state.esttime === 0){
      renderTime = '0';} else {
      renderTime = this.state.esttime.toString().toHHMMSS();
      }
    return (
      <div>
        <CourseCreateHeader />
        <div>
          <ul>
            <li><button onClick={this.undoMarker}>Undo</button></li>
            <li><button onClick={this.clearAll}>Clear</button></li>

        </ul>
        </div>

        <div>
          <ul className='create-stats'>
            <li>
              {this.state.distance} mi. <br />
              Distance
            </li>
            <li>
              {renderTime} <br />
              Estimated Time
            </li>
          </ul>
        </div>
        <div id='course-create-container' ref={ map => this.mapNode = map }>
          Map
        </div>
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
    createCourse: (course) => dispatch(createCourse(course))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CourseCreate));

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}
