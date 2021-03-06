import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { createCourse } from '../../actions/courses_actions';
import Modal from '../modal/modal';
import merge from 'lodash/merge';
import { clearErrors } from '../../actions/error_actions';
const image = require('google-maps-image-api');
const convexHull = require('monotone-convex-hull-2d');
import regression from 'regression';

class CourseCreate extends React.Component {

  constructor(props) {
    super(props);
    this.pathMarkers = []
    this.distance = 0
    this.polyline = 0
    this.toggleHeading = false
    this.saveMap = this.saveMap.bind(this)
    this.clearAll = this.clearAll.bind(this)
    this.renderPolyline = this.renderPolyline.bind(this)
    this.addMarker = this.addMarker.bind(this)
    this.checkTerrain = this.checkTerrain.bind(this)
    this.undoMarker = this.undoMarker.bind(this)
    this._toggleHeading = this._toggleHeading.bind(this)
    this.findCurrent = this.findCurrent.bind(this)
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
       const urlCreator = window.URL || window.webkitURL;
       const imageUrl = URL.createObjectURL(image);
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
    const numPathMarkers = this.pathMarkers.length;

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

  checkStep(position) {

    const xhr = new XMLHttpRequest();
    const address = `http://maps.googleapis.com/maps/api/staticmap?center=${position.lat()},${position.lng()}&zoom=20&size=5x5&maptype=roadmap&sensor=false&key=AIzaSyBiE2efHKeAptVfVRtj9-ZDeHWPKgNjdNk`;
    xhr.open('GET', address);
    xhr.responseType = "blob";
    xhr.onload = () => onImageReceived(xhr.response);
    xhr.send();

    const onImageReceived = (image) => {

       const urlCreator = window.URL || window.webkitURL;
       const imageUrl = URL.createObjectURL(image);
       const img = new Image;
       const canvas = document.createElement('canvas');
       img.onload = () => {
         canvas.width = img.width;
         canvas.height = img.height;
         canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
         const HELLYEA = canvas.getContext('2d').getImageData(0, 0, 1, 1).data;
         if (HELLYEA[0] === 163 && HELLYEA[1] === 204 && HELLYEA[2] === 255) {
           () => {};
         } else {
          this.isLand = true
         }
       }
       img.id = 'terrain'
       img.src = imageUrl

    }
  }

  findStation(pos) {

  }

  findCurrent(pos) {
    const startLat = pos.lat()
    const startLng = pos.lng()
    const date = this.state.date.slice(0,4) + this.state.date.slice(5,7) + this.state.date.slice(8,10)
    const noaaRequest = new XMLHttpRequest()
    debugger
    const address = `https://tidesandcurrents.noaa.gov/api/datagetter?begin_date=${date}&range=24&station=n03020&product=water_temperature&units=english&time_zone=gmt&application=ports_screen&format=json`
    noaaRequest.open('GET', address)
    noaaRequest.onload = () => onJSONReceived(noaaRequest.response)
    noaaRequest.send();

    const onJSONReceived = (response) => {
      console.log(response)
      //debugger
    }
  }

  polylineSegmentor() {
    const polyIndex = this.pathMarkers.length - 1;
    const poly1 = this.pathMarkers[polyIndex-1].getPosition()
    const poly2 = this.pathMarkers[polyIndex].getPosition()
    const heading = google.maps.geometry.spherical.computeHeading(poly1, poly2)
    let remainingDist = google.maps.geometry.spherical.computeDistanceBetween(poly1, poly2)
    let startPos = poly1;
    this.isLand = false;
    while (remainingDist > 321 && this.isLand === false) {
      let step = google.maps.geometry.spherical.computeOffset(startPos, 322, heading)
      remainingDist -= 322;
    };
  }

  calculateRiverHeading(startPos, endPos) {
    this.startPos = startPos;
    const headingBranch = this.buildBranchDirs(startPos);
    this.buildTerrainChecker(startPos, headingBranch);
  }

  buildBranchDirs(startPos, distMultiplier = 1) {
    let startLat;
    if (startPos.lat) {
      startLat = startPos.lat();
    } else {
      startLat = startPos[0]
    }
    const center = [640, 640];
    const zoomLevel = 13;
    const kilometersPerPixel = (100000 * Math.cos(startLat * Math.PI / 180) / Math.pow(2, zoomLevel)) / 1000
    // kilometers per pixel = (156543.03392 * Math.cos(latLng.lat() * Math.PI / 180) / Math.pow(2, zoom)) / 1000
    const checkDistancePx = (.250 / kilometersPerPixel) * distMultiplier
    const branchDirs = [
      [-checkDistancePx, -checkDistancePx],
      [0, -checkDistancePx],
      [checkDistancePx, -checkDistancePx],
      [checkDistancePx, 0],
      [checkDistancePx, checkDistancePx],
      [0, checkDistancePx],
      [-checkDistancePx, checkDistancePx],
      [-checkDistancePx, 0]
    ];
    const returnBranch = [];

    branchDirs.forEach((el) => {
      const newLat = center[0] + el[0]
      const newLng = center[1] + el[1]
      returnBranch.push([newLat, newLng])
    });
    return returnBranch;
  }

  buildTerrainChecker(startPos, headingBranch) {
    let waterCanvas = document.createElement('canvas');
    waterCanvas.width = 1280;
    waterCanvas.height = 1280;
    let waterContext = waterCanvas.getContext('2d');

    const latLng = `${startPos.lat()},${startPos.lng()}`
    const xhr = new XMLHttpRequest();
    const address = 'http://maps.googleapis.com/maps/api/staticmap?center=' + latLng + '&zoom=13&size=640x640&scale=2&visual_refresh=true&style=element:labels|visibility:off&style=feature:water|color:0x00FF00&style=feature:transit|visibility:off&style=feature:poi|visibility:off&style=feature:road|visibility:off&style=feature:administrative|visibility:off&sensor=false&key=AIzaSyBiE2efHKeAptVfVRtj9-ZDeHWPKgNjdNk';
    xhr.open('GET', address);
    xhr.responseType = "blob";
    xhr.onload = () => onImageReceived(xhr.response);
    xhr.send();
    const onImageReceived = (imageBlob) => {
      const urlCreator = window.URL || window.webkitURL;
      const imageUrl = URL.createObjectURL(imageBlob);
      let img = new Image;
      img.src = imageUrl;
      img.onload = () => {
        waterContext.drawImage(img, 0, 0, img.width, img.height);
        let distMultiplier = 1;
        this.checkBranchTerrain(startPos, headingBranch, waterContext, distMultiplier)
        }
      }
  }

  pixelsToLatLng(startPos, pixelPos ) {
    const startLat = this.startPos.lat();
    const startLng = this.startPos.lng();

    const latDiffPx = 640 - pixelPos[1];
    const lngDiffPx = pixelPos[0] - 640;

    const center = [640, 640];
    const zoomLevel = 13;
    const kmPerPx = (90000 * Math.cos(startLat * Math.PI / 180) / Math.pow(2, zoomLevel)) / 1000

    const latDiffKm = latDiffPx * kmPerPx;
    const lngDiffKm = lngDiffPx * kmPerPx;
    const rEarth = 6371;
    const newLat = startLat + (latDiffKm / rEarth) * (180 / Math.PI);
    const newLng = startLng + (lngDiffKm / rEarth) * (180 / Math.PI) / Math.cos(startLat * Math.PI/180);
    const latLng = {lat: newLat, lng: newLng};
    return latLng;
  }

  checkBranchTerrain(startPos, headingBranch, waterContext, distMultiplier) {
    const nextBranchNodes = this.nodeColorCheck(startPos, headingBranch, waterContext)

    if (nextBranchNodes.length > 6) {
      this.isWaterArray = [];
      distMultiplier += 2;
      const nodeBranch = this.buildBranchDirs(startPos, distMultiplier);
      this.checkBranchTerrain(startPos, nodeBranch, waterContext, distMultiplier);
    } else {
      this.isWaterArray = [];
      distMultiplier = 1;
      nextBranchNodes.forEach((node) => {
        const nodeBranch = this.buildBranchDirs(node);
        this.nodeColorCheck(node, nodeBranch, waterContext);
      });

    const isWaterLatLng = []
    this.isWaterArray.forEach((pos) => {
      const position = this.pixelsToLatLng(startPos, pos);
      isWaterLatLng.push(position)
    });

      const someDumbNewArray = isWaterLatLng.map((pos) => {
        return [pos.lat, pos.lng]
      })
      const convexHullArray = convexHull(someDumbNewArray)
      const anEvenDumberArray = [];
      convexHullArray.forEach((index) => {
        anEvenDumberArray.push(isWaterLatLng[index])
      })
      isWaterLatLng.forEach((pos) => {
        new google.maps.Marker({
          position: pos,
          map: this.map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5,
            strokeColor: '#0000ff'
          },
        });
      });

      const yosephArray = [];
      const latHash = {}
      const lngHash = {};
      isWaterLatLng.forEach((pos) => {
        latHash[pos.lat] = []
        lngHash[pos.lng] = []
      })
      isWaterLatLng.forEach((pos) => {
        latHash[pos.lat].push(pos.lng)
        lngHash[pos.lng].push(pos.lat)
      })
      let maxLatDist = 0;
      let maxLngDist = 0;
      Object.values(latHash).forEach((array) => {
        const curr_diff = Math.max(...array) - Math.min(...array);
        if ( curr_diff > maxLatDist){
          maxLatDist = curr_diff;
        }
      })
      Object.values(lngHash).forEach((array) => {
        const curr_diff = Math.max(...array) - Math.min(...array);
        if ( curr_diff > maxLatDist){
          maxLngDist = curr_diff;
        }
      })
      let flipped = false;
      isWaterLatLng.forEach((pos) => {
        if (maxLatDist > maxLngDist) {
          yosephArray.push([pos.lat, pos.lng])
        } else {
          flipped = true;
          yosephArray.push([pos.lng, pos.lat])
        }
      })
      const result = regression.linear(yosephArray);
      let riverAngle = (Math.atan(result.equation[0]) * 180) / Math.PI;
      if (flipped) {
        if (riverAngle == 0) {
          riverAngle == 90
        } else {
          riverAngle += 45;
        }
      }
      console.log(riverAngle);
    //   const furthestMarkers = this.longestDist(anEvenDumberArray)
    //   const marker1 = new google.maps.Marker({
    //     position: {lat: furthestMarkers[0].lat, lng: furthestMarkers[0].lng}
    //   })
    //   const marker2 = new google.maps.Marker({
    //     position: {lat: furthestMarkers[1].lat, lng: furthestMarkers[1].lng}
    //   })
      // const heading = google.maps.geometry.spherical.computeHeading(marker1.getPosition(), marker2.getPosition());
      // console.log(heading)
      // return heading;

    }
  }

  nodeColorCheck(node, nodeBranch, waterContext) {
    let nextNodes = [];
    nodeBranch.forEach((pos) => {
      const pixel = waterContext.getImageData(pos[0], pos[1], 1, 1).data;
      if (pixel[0] == 0 && pixel[1] == 255 && pixel[2] == 0) {
        this.isWaterArray.push(pos)
        //console.log(this.isWaterArray)
        nextNodes.push(pos)
      }
    });
    return nextNodes;
  }

  convexHullDistance(coord1, coord2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((coord2.lat() - coord1.lat()) * p)/2 +
            c(coord1.lat() * p) * c(coord2.lat() * p) *
            (1 - c((coord2.lng() - coord1.lng()) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }

  longestDist(pointsArray) {
    let furthestPoints;
    let longestDistance = 0
    for (let i = 0; i <= pointsArray.length; i++){
      for (let j = i + 1; j < pointsArray.length; j++) {
        const newDist = this.distanceFormula(pointsArray[i], pointsArray[j])
        if ( newDist > longestDistance) {
          longestDistance = newDist;
          furthestPoints = [pointsArray[i], pointsArray[j]]
        }
      }
    }
    return furthestPoints
  }

  distanceFormula(pos1, pos2) {
    function toRad(x) {
      return x * Math.PI / 180;
    }

    const lat1 = pos1.lat;
    const lng1 = pos1.lng;
    const lat2 = pos2.lat;
    const lng2 = pos2.lng;
    var R = 6371e3;
    var φ1 = toRad(lat1);
    var φ2 = toRad(lat2);
    var Δφ = toRad((lat2-lat1));
    var Δλ = toRad((lng2-lng1));

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    return d;
  }

  _toggleHeading(e) {
    if (e.key === 'h') {
      this.toggleHeading = !this.toggleHeading;
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
    this.findCurrent(pathMarkers[0].position)
    //this.polylineSegmentor();
    if (this.toggleHeading) {
      this.isWaterArray = [];
      this.calculateRiverHeading(pathMarkers[0].position, pathMarkers[1].position)
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
      <div id='create-page-container' onKeyPress={this._toggleHeading} >
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
