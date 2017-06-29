import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { requestCourse } from '../../actions/courses_actions';
import { timeConverter } from '../../util/misc_util';
import DashboardNav from '../dashboard/dashboard_header';


class CourseShow extends React.Component {
  constructor(props) {
    super(props);
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
  let bounds = new google.maps.LatLngBounds();

  const decodedPath = google.maps.geometry.encoding.decodePath(this.props.course.waypoints)
  const waypoints = decodedPath.map( (coord) => {
    let lat = coord.lat();
    let lng = coord.lng();
    bounds.extend({lat, lng})
    return {lat, lng};
  });


  const mapOptions = {
    center: {lat: 40.728420,
          lng: -74.013389
        },
    zoom: 15,
    clickableIcons: false,
    styles: mapStyle,
    mapTypeControl: true,
          mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.RIGHT_TOP
          },
          zoomControl: true,
          zoomControlOptions: {
              position: google.maps.ControlPosition.LEFT_TOP
          },
          streetViewControl: false,
    };

    this.map = new google.maps.Map(this.mapNode, mapOptions );


    const polyline = new google.maps.Polyline({
      path: waypoints,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    polyline.setMap(this.map);

    const endMarker = new google.maps.Marker({
      position: waypoints[waypoints.length-1],
      map: this.map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        strokeColor: '000000'
      },
    });
    const startMarker = new google.maps.Marker({
      position: waypoints[0],
      map: this.map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        strokeColor: '#01B60D',
        fillColor: '#FFFFFF'
      },
    });

    this.map.fitBounds(bounds);
  }

  render() {
    let bottomBorder;
    if (this.props.course.description) {
      bottomBorder = 'show-stats-description';
    } else {
      bottomBorder= "";
    }
    return (
      <div>
        <DashboardNav />
        <div className='show-page-container'>
          <div className='show-header'>
            <p><Link to='/courses/'>My Courses</Link> / {this.props.course.title}</p>
            <h1>{this.props.course.title}</h1>
            <ul>
              <li><button>Print</button></li>
              <li><button>Wait</button></li>
              <li><button>Like</button></li>
              <li><button>With</button></li>
              <li><button>Paper?</button></li>
            </ul>
          </div>
          <div className='show-body'>
            <div id='course-show-container' ref={ map => this.mapNode = map }>
              map
            </div>
            <div className='show-stats'>
              <div className='show-stats-header'>
                <img className='profile-pic' src={window.images.profilePic} />
                <div className='show-stats-author'>
                  <p className='author'>By {this.props.course.author_fname} {this.props.course.author_lname}</p>
                  <p>Created on {timeConverter(this.props.course.created_at)}</p>
                </div>
              </div>
              <div className='show-stats-stats'>
                <ul>
                  <li>{this.props.course.distance.toFixed(1)}<abbr className='create-unit'>mi</abbr><br /><abbr className='show-stats-label'>Distance</abbr></li>
                  <li>{this.props.course.esttime.toString().toHHMMSS()}<br /><abbr className='show-stats-label'>Estimated Time</abbr></li>
                  <li>Water<br /><abbr className='show-stats-label'>Road Type</abbr></li>
                </ul>
              </div>
              <div className={bottomBorder}>{this.props.course.description}</div>
              <div className='show-stats-social'>Share this Course with Friends
                <ul>
                  <li><button>Friends?</button></li>
                  <li><button>Did</button></li>
                  <li><button>I</button></li>
                  <li><button>Not</button></li>
                  <li><button>Import</button></li>
                  <li><button>That?</button></li>
                </ul>
              </div>
            </div>
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
