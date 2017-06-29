import React from 'react';
import ReactDOM from 'react-dom';
import DashboardNav from '../dashboard/dashboard_header';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { requestChart } from '../../actions/charts_actions';
import { timeConverter } from '../../util/misc_util';
import Modal from '../modal/modal';
import * as ApiUtil from '../../util/charts_api_util';

class ChartShow extends React.Component {
  constructor(props) {
    super(props);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderWeather = this.renderWeather.bind(this);
    this.weather = "";
    this.state = {
      isModalOpen: false,
      chart: {
        boat: this.props.boat,
        description: this.props.description,
        title: this.props.title
      }
    }
  }

  componentWillMount() {
    const datetime = new Date(this.props.chart.start_time);
    let hours = datetime.getHours();
    let minutes = datetime.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    let AMPM = 'AM';
    if (hours > 12) {
      AMPM = 'PM';
      hours = hours - 12
    }
    if (hours === 0) {
      hours = 12;
    }
    this.time = `${hours}:${minutes} ${AMPM}`
    const day = datetime.getDay();
    const week = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    this.date = `${week[day]} ${timeConverter(datetime)}`;
    this.pace = (this.props.course.distance / (this.props.chart.duration / 3600 ) * 0.868976).toFixed(2);
    const diff = (this.props.chart.duration - this.props.course.esttime)
    if (diff > 1) {
      this.timeDiff = `+${diff.toString().toHHMMSS()}`;
    } else {
      this.timeDiff = diff.toString().toHHMMSS();
    }
    debugger
    const year = datetime.getYear() + 1900;
    let month = datetime.getMonth() + 1
    if (month < 10) {
      month = `0${month}`
    }
    let date = datetime.getDate();
    if (date < 10) {
      date = `0${date}`
    }
    const queryDate = `${year}${month}${date}`
    debugger
    $.ajax({
      type: 'GET',
      url: `http://api.wunderground.com/api/0f6b676260939449/history_YYYYMMDD/q/CA/San_Francisco.json`
    }).then( (weatherData) => renderWeather(weatherData))
  }

  renderWeather(weatherData) {

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

  openModal() {
    this.setState({ isModalOpen: true });
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }

  render() {
    let chartDescription;
    if (this.props.chart.description) {
      chartDescription = this.props.chart.description
    } else {
      chartDescription =
      <button onClick={this.openModal} className='edit-button'>
        Add a description
      </button>
    }
    return (
      <div>
        <Modal className='edit-modal' isOpen={this.state.isModalOpen} onClose={() => this.closeModal()}>
          <h1>ahahaha</h1>
        </Modal>
        <DashboardNav />
        <div id='chart-show-container'>
          <div id='chart-show-options'>
            <button onClick={this.openModal} className='chart-show-buttons'>
              <i className="fa fa-pencil" aria-hidden="true"></i>
            </button>
            <button onClick={this.openModal} className='chart-show-buttons'>
              <i className="fa fa-wrench" aria-hidden="true"></i>
            </button>
          </div>
          <div id='chart-show-body'>
            <h1 id='chart-show-header'>
              {this.props.chart.author_fname} {this.props.chart.author_lname} – Row
            </h1>
            <div id='chart-show-details'>
              <div id='chart-show-description'>
                <img src={window.images.profilePic} />
                <div id='chart-show-words'>
                  <p id='chart-show-date'>{this.time} on {this.date}</p>
                  <h1>{this.props.chart.title}</h1>
                  <div id='chart-story'>{chartDescription}</div>
                </div>
              </div>
              <div id='chart-show-stats'>
                <div id='actual-stats'>
                  <div className='chart-show-comp'>
                    {this.props.course.distance.toFixed(1)}<abbr className='chart-show-unit'>mi</abbr><br />
                    <abbr className='chart-show-label'>Distance</abbr>
                  </div>
                  <div className='chart-show-comp'>
                    {this.props.chart.duration.toString().toHHMMSS()}<br />
                  <abbr className='chart-show-label'>Duration</abbr>
                  </div>
                  <div className='chart-show-comp'>
                    {this.pace}<abbr className='chart-show-unit'>kn/hr</abbr><br />
                    <abbr className='chart-show-label'>Pace</abbr>
                  </div>
                  <div className='chart-show-comp'>
                    {this.timeDiff}<br />
                  <abbr className='chart-show-label'>Est Differential</abbr>
                  </div>
                </div>
                <div id='boat-name'>
                  <h2>Crew: none</h2>
                </div>
              </div>
            </div>
            <div>
              <div>
                {this.weather}
              </div>
              <div id='chart-show-map' ref={ map => this.mapNode = map }>
                map
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }


}

const mapStateToProps = ({charts, courses}, {match}) => {
  const chartId = parseInt(match.params.chartId);
  const chart = charts[chartId];
  const course = courses[chart.course_id];
  return {
    chart,
    course
  }
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ChartShow));
