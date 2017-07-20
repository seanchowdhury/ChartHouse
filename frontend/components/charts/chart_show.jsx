import React from 'react';
import ReactDOM from 'react-dom';
import DashboardNav from '../dashboard/dashboard_header';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { requestChart, editChart } from '../../actions/charts_actions';
import { timeConverter } from '../../util/misc_util';
import Modal from '../modal/modal';
import {merge} from 'lodash'
import Footer from '../footer/footer';
import * as ApiUtil from '../../util/charts_api_util';

class ChartShow extends React.Component {
  constructor(props) {
    super(props);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderWeather = this.renderWeather.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.state = {
      editChart: {
        id: this.props.chart.id,
        title: this.props.chart.title,
        description: this.props.chart.description,
      },
      isModalOpen: false,
      weather: "",
      chart: {
        boat: this.props.boat,
        description: this.props.description,
        title: this.props.title
      }
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
    if (diff > 0) {
      this.timeDiff = `+${diff.toString().toHHMMSS()}`;
    } else {
      this.timeDiff = `-${Math.abs(diff).toString().toHHMMSS()}`;
    }
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
    const queryLocation = `${waypoints[0].lat},${waypoints[0].lng}`
    $.ajax({
      type: 'GET',
      url: `https://api.wunderground.com/api/0f6b676260939449/history_${queryDate}/q/${queryLocation}.json`
    }).then( (weatherData) => this.renderWeather(weatherData))
  }

  renderWeather(weatherData) {
    const hour = parseInt(this.props.chart.start_time.slice(11,13));
    const weather = weatherData.history.observations[hour];
    this.setState({ weather });
  }

  openModal() {
    this.setState({ isModalOpen: true });
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }

  handleEdit(chart) {
    this.props.editChart(chart)
      .then(() => this.closeModal());
  }

  update(field) {
    return (e) => {
      this.setState({
        editChart: merge({}, this.state.editChart, {[field]: e.currentTarget.value})
      });
    }
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
    let weatherInfo = ""
    if (this.state.weather) {
      const icon = `wu wu-black wu-64 wu-${this.state.weather.icon}`
      weatherInfo = (
        <div id='show-weather'>
          <div>
            Conditions: {this.state.weather.conds} <i className={icon}></i>
          </div>
          <div>
            Tempurate: {this.state.weather.tempi}
          </div>
          <div>
            Visibility: {this.state.weather.visi} mi.
          </div>
          <div>
            Wind: {this.state.weather.wspdi} mph.
          </div>
        </div>
      );
    }
    let titleInput;
    if (this.props.errors.title) {
      titleInput = <input onChange={this.update('title')} className='input-with-errors' value={this.state.title} />
      } else {
      titleInput = <input onChange={this.update('title')} value={this.state.editChart.title} />
    }
    return (
      <div>
        <Modal className='edit-modal' isOpen={this.state.isModalOpen} onClose={() => this.closeModal()}>
          <div className='edit-header'>
            <h1 className='edit-title'>Edit Chart</h1>
            <button onClick={() => {this.handleEdit(this.state.editChart)}} className='edit-post'>Save & View Chart</button>
          </div>
          <section className='edit-body'>
            <form className='edit-form'>
              <label>Title <br />
              {titleInput}
              <div className='modal-errors'>{this.props.errors.title}</div></label>
              <br />
              <label>Description <br /><textarea placeholder='say something' onChange={this.update('description')} value={this.state.editChart.description} /></label>
            </form>
            <div>
              <ul>Details
                <li>{this.date}</li>
                <li>{this.props.course.distance.toFixed(1)} mi</li>
                <li>{this.props.chart.duration.toString().toHHMMSS()}</li>
              </ul>
            </div>
          </section>
        </Modal>
        <DashboardNav />
        <div id='chart-show-container'>
          <div id='chart-show-options'>
            <button onClick={this.openModal} className='chart-show-buttons'>
              <i className="fa fa-pencil" aria-hidden="true"></i>
            </button>
            <button className='chart-show-buttons'>
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
                {weatherInfo}
                <div id='boat-name'>
                  <h2>Crew: none</h2>

                </div>
              </div>
            </div>
            <div>
              <div id='chart-show-map' ref={ map => this.mapNode = map }>
                map
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }


}

const mapStateToProps = ({charts, courses, errors}, {match}) => {
  const chartId = parseInt(match.params.chartId);
  const chart = charts[chartId];
  const course = courses[chart.course_id];
  return {
    chart,
    course,
    errors
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    editChart: (chart) => dispatch(editChart(chart))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ChartShow));
