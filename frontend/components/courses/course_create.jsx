import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


class CourseCreate extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      lat: 40.728420,
      lng: -74.013389
    }
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
        "color": "#2b97ff"
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
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  }
])
    const mapOptions = {
      center: this.state,
      zoom: 15,
      styles: mapStyle
    };

    navigator.geolocation.getCurrentPosition( (pos)=> {
      this.map.setCenter({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      })
    })

    this.map = new google.maps.Map(this.mapNode, mapOptions );

    const input = document.getElementById('searchTextField');
    const searchBox = new google.maps.places.SearchBox(input);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds());
    });
    searchBox.addListener('places_changed', () => {
      let places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }
    });
  }

  render() {
    return (
      <div>
      <input id='searchTextField'></input>

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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CourseCreate));
