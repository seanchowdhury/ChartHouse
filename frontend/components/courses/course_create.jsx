import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { createCourse } from '../../actions/courses_actions';
import Modal from '../modal/modal';
import merge from 'lodash/merge';
import { clearErrors } from '../../actions/error_actions';
const image = require('google-maps-image-api');

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
    this.checkTerrain = this.checkTerrain.bind(this);
    this.undoMarker = this.undoMarker.bind(this);
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();
     if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }

    this.today = yyyy+'-'+mm+'-'+dd;
    this.state = {
      lat: 40.728420,
      lng: -74.013389,
      isModalOpen: false,
      time: '08:00',
      date: this.today,
      course: {
        distance: 0,
        esttime: 0,
        title: "",
        description: "",
        waypoints: "",
        start_time: ""
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

  updateDateTime(field) {
    return (e) => {
      this.setState({
        [field]: e.currentTarget.value
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const course = this.course;
    this.props.createCourse(course);
  }

  saveMap() {
    const saveDate = new Date(`${this.state.date} ${this.state.time}`)
    const course = merge({}, this.state.course, {start_time: saveDate} )
    this.props.createCourse(course)
      .then( ({course}) => {
        this.props.history.push(`/courses/${Object.keys(course)[0]}`)
      }
    )
  }

  checkTerrain(position) {
    const xhr = new XMLHttpRequest();
    const address = `http://maps.googleapis.com/maps/api/staticmap?center=${position.lat()},${position.lng()}&zoom=20&size=5x5&maptype=roadmap&sensor=false&key=AIzaSyBiE2efHKeAptVfVRtj9-ZDeHWPKgNjdNk`;
    xhr.open('GET', address);
    xhr.responseType = "blob";
    xhr.onload = () => onImageReceived(xhr.response);
    xhr.send();

    const onImageReceived = (image) => {
       var urlCreator = window.URL || window.webkitURL;
       var imageUrl = URL.createObjectURL(image);
       const img = new Image;
       const canvas = document.createElement('canvas');
       img.onload = () => {
         canvas.width = img.width;
         canvas.height = img.height;
         canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
         const HELLYEA = canvas.getContext('2d').getImageData(0, 0, 1, 1).data;
         if (HELLYEA[0] === 163 && HELLYEA[1] === 204 && HELLYEA[2] === 255) {
           this.addMarker(position)
         } else {
           () => {};
         }
       };

       img.id = 'terrain'
       img.src = imageUrl

    }
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
    if (this.pathMarkers.length > 1) {
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
    this.pathMarkers.forEach((marker) => marker.setMap(null));
    this.pathMarkers = [];
    this.polyline.setMap(null);
    this.setState( {course: merge({}, this.state.course, {distance: 0, esttime: 0} )});
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
    const esttime = (distance / 2.65 * 3600);
    const encryptedWaypoints = google.maps.geometry.encoding.encodePath(this.polyline.getPath());
    this.setState({
      course: merge({}, this.state.course, {distance, esttime, waypoints: encryptedWaypoints})
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
      this.map = new google.maps.Map(this.mapNode, mapOptions );
      this.map.addListener('click', (e) => {
        this.checkTerrain(e.latLng);
      });
      this.map.setCenter({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    },
     () => {
       this.map = new google.maps.Map(this.mapNode, mapOptions );
       this.map.addListener('click', (e) => {
         this.checkTerrain(e.latLng);
       });
     }
    )

  }

  openModal() {
    this.setState({ isModalOpen: true });
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }

  renderDateTime() {
    const timeSelect = [];
    for(let i = 0; i < 24; i++){
      for(let n = 0; n < 2; n++ ) {
        let hr;
        let min;
        let AMPM;
        if (i === 0) {
          hr = 12;
        } else if ( i > 12) {
          hr = i - 12;
        } else {
          hr = i
        }
        if (n === 0) {
          min = '00';
        } else {
          min = '30';
        }
        if (i > 11) {
          AMPM = 'PM';
        } else {
          AMPM = 'AM';
        }
        let vali = i;
        if (i < 10) {
          vali = `0${i}`
        }
        timeSelect.push(
          <option key={`${i}:${n*30}`} value={`${vali}:${min}`}>{hr}:{min} {AMPM}</option>
            )
          }
        }

    return (
      <div>
        <input value={this.state.date} min={this.today} type="date" onChange={this.updateDateTime('date')} className='create-course-time' />
        <select value={this.state.time} onChange={this.updateDateTime('time')} className='create-course-time'>
          {timeSelect}
        </select>
      </div>
    )
  }

  render() {
    if (this.state.course.title.length > 0 && this.props.errors.title) {
      this.props.clearErrors();
    }
    let renderTime;
    if (this.state.course.esttime === 0){
      renderTime = '--:--';} else {
      renderTime = this.state.course.esttime.toString().toHHMMSS();
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
                {this.props.errors}
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
          <button onClick={this.undoMarker} className='undo-buttons'><i id='the-undo-button' className="fa fa-undo fa-fw fa-lg" aria-hidden="true"></i>
            <br /><abbr>Undo</abbr></button>
          <button onClick={this.clearAll} className='undo-buttons'><i className="fa fa-times fa-fw fa-lg" aria-hidden="true"></i>
            <br /><abbr>Clear</abbr></button>
          {saveButton}
        </div>


        <div>
          <ul className='create-stats'>
            <li className='create-stat-item'>
              {this.renderDateTime()}
              <p className='create-stat-text'>Date & Time</p>
            </li>
            <li className='create-stat-item'>
              {this.state.course.distance.toFixed(1)}<abbr className='create-unit'>mi.</abbr><br />
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
