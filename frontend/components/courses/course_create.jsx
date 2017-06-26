import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { createCourse } from '../../actions/courses_actions';
import Modal from '../modal/modal';
import merge from 'lodash/merge';
import { clearErrors } from '../../actions/error_actions';

class CourseCreate extends React.Component {

  constructor(props) {
    super(props);
    this.pathMarkers = [];
    this.distance = 0;
    this.polyline = 0;
    this.saveMap = this.saveMap.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.renderPolyline = this.renderPolyline.bind(this);
    this.addMarker = this.addMarker.bind(this);
    this.undoMarker = this.undoMarker.bind(this);
    this.state = {
      lat: 40.728420,
      lng: -74.013389,
      distance: 0,
      esttime: 0,
      isModalOpen: false,
      course: {
        user_id: this.props.user_id,
        title: "",
        description: "",
        waypoints: ""
      }
    };
  }

  update(field) {
    return (e) => {
      if (field === 'title' && this.props.errors.title) {
        this.props.clearErrors();
      }
      this.setState({
        course: merge({}, this.state.course, {[field]: e.currentTarget.value})
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const course = this.course;
    this.props.createCourse(course);
  }

  saveMap() {
    this.props.createCourse(this.state.course)
      .then( ({course}) => {
        this.props.history.push(`/courses/${Object.keys(course)[0]}`)
      }
    )
  }

  addMarker(position) {
    let strokeColor = '#000000';
    if (this.pathMarkers.length < 1) {
      strokeColor = '#01B60D';
    }
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        strokeColor,
        fillColor: '#FFFFFF'
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
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    this.polyline = coursePoly;
    coursePoly.setMap(this.map);
    const distance = google.maps.geometry.spherical.computeLength(coursePoly.getPath().getArray()) / 1609.34;


    const encryptedWaypoints = google.maps.geometry.encoding.encodePath(this.polyline.getPath());
    this.setState({
      distance,
      esttime: distance / 2.65 * 3600,
      course: merge({}, this.state.course, {waypoints: encryptedWaypoints})
    });
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
      clickableIcons: false,
      styles: mapStyle,
      mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.LEFT_TOP
            },
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },
            streetViewControl: false,
    };

    navigator.geolocation.getCurrentPosition( (pos)=> {
      this.map.setCenter({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    });

    this.map = new google.maps.Map(this.mapNode, mapOptions );
    this.map.addListener('click', (e) => {
      this.addMarker(e.latLng);
    });
  }

  openModal() {
    this.setState({ isModalOpen: true });
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }


  render() {
    if (this.state.course.title.length > 0 && this.props.errors.title) {
      this.props.clearErrors();
    }
    let renderTime;
    if (this.state.esttime === 0){
      renderTime = '--:--';} else {
      renderTime = this.state.esttime.toString().toHHMMSS();
      }
    const descriptionText = "Enter a name and description for your route below. On the next page, you'll be able to see, edit, and share your route.";
    let saveButton;
    if (this.pathMarkers.length < 2) {
      saveButton = <button onClick={() => {}} className='faux-save-button'>Save</button>;
    } else {
      saveButton = <button onClick={() => this.openModal()} className='save-button'>Save</button>;
    }
    let titleInput;
    if (this.props.errors.title) {
      titleInput = <input onChange={this.update('title')} className='input-with-errors' value={this.state.course.title} />
      } else {
      titleInput = <input onChange={this.update('title')} value={this.state.course.title} />
    }

    return (
      <div id='create-page-container'>
        <div>
          <Modal className='save-modal' isOpen={this.state.isModalOpen} onClose={() => this.closeModal()}>
            <h1 className='save-title'>Save</h1>
            <section className='save-body'>
              <form className='save-form'>
                <p className='save-description'>{descriptionText}</p><br />
                <label>Course Name (required)<br />{titleInput}
                <div className='modal-errors'>{this.props.errors.title}</div></label>
                <br />
                <label>Description <br /><textarea onChange={this.update('description')} value={this.state.course.description} /></label>
              </form>
              <ul className='save-modal-buttons'>
                <li><button onClick={() => this.closeModal()} className='modal-cancel'>Cancel</button></li>
                <li><button onClick={() => this.saveMap()} className='modal-save'>Save</button></li>
              </ul>
            </section>
          </Modal>
        </div>

        <div className='cc-header'>
          <ul className='cc-header-left'>
            <li><Link to='/' className='dash-logo'>KUNKKA</Link></li>
            <li className='builder-beta'>COURSE CONSTRUCTOR GAMMA <abbr className='the-word-beta'>BETA</abbr></li>
          </ul>
          <Link to='/courses' className='cc-header-right'>Exit Builder</Link>
        </div>

        <div className='create-tools'>
          <div className='create-search'>
            <input placeholder="futureSearchBar"></input><button><i className="fa fa-search fa-fw fa-2x" aria-hidden="true"></i>
              </button>
          </div>
          <button onClick={this.undoMarker} className='undo-buttons'><i className="fa fa-undo fa-fw fa-lg" aria-hidden="true"></i>
            <br /><abbr>Undo</abbr></button>
          <button onClick={this.clearAll} className='undo-buttons'><i className="fa fa-times fa-fw fa-lg" aria-hidden="true"></i>
            <br /><abbr>Clear</abbr></button>
          {saveButton}
        </div>


        <div>
          <ul className='create-stats'>
            <li className='create-stat-item'>
              Row
              <p className='create-stat-text'>Cruise Type</p>
            </li>
            <li className='create-stat-item'>
              {this.state.distance.toFixed(1)}<abbr className='create-unit'>mi.</abbr><br />
            <p className='create-stat-text'>Distance</p>
            </li>
            <li className='create-stat-item'>
              {renderTime} <br />
            <p className='create-stat-text'>Estimated Time</p>
            </li>
          </ul>
        </div>
        <div id='course-create-container' ref={ map => this.mapNode = map }>
          map
        </div>
      </div>
    );
  }

}


const mapStateToProps = (state) => {
  return {
    user_id: state.session.currentUser.id,
    errors: state.errors
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createCourse: (course) => dispatch(createCourse(course)),
    clearErrors: () => dispatch(clearErrors())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CourseCreate));
