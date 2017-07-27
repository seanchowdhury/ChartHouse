# KUNKKA


[Kunkka](https://www.kunkka.herokuapp.com/)


Kunkka is full-stack web application clone of Strava, created using Ruby on Rails on the backend with a PostgreSQL database and React.js with a Redux architectural framework on the frontend. Users are able to plan out their courses and keep track of the trips they have taken.

## Features and implementation

### Course creation

The object of this application is to use the tools available through the Google Maps, Wunderground and NOAA APIs to build a service that allows peoples to ditch the clunky ways they have been planning out their trips.


The mapping tool provides real time updates on the total distance of the course with information relevant to a trip. The map has been customized to better accentuate the waterways and front-end checks have been added to keep the user's course off land. While this method works it is not perfect and definitely not scientific, the project may be moved onto Google Earth Engine or ArcGIS API which provide more robust map layers.

---
```javascript
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
```
---

Because Google's Map API does not provide information on whether a particular position is land or sea, before a marker is placed a request is sent to Google's Static Map's API for a five by five pixel map centered at that position. That picture is then placed on a canvas and it's color is checked against the color of default water. If the colors match the marker is placed.


Google Maps API does not have the ability to undo and clear markers so I made custom ones.

It turned out to be fairly simple, just store the markers in an array and set the last one to false if undo is pressed. Trickier was undoing polylines as at first it seemed as though only the first undo was working. But as it turned out every polyline is new and simply placed on top of the old one, so to undo polylines you first have to clear the previous polyline before placing the next to avoid the overlapping.

---
```javascript
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
```

## Future Directions for the Project

My plan is to create more robust features on the map creation page, bringing in NOAA current information and weather alerts.

#### Using polylineSegmenter

---
```javascript
polylineSegmentor() {
  const polyIndex = this.pathMarkers.length - 1;
  const poly1 = this.pathMarkers[polyIndex-1].getPosition()
  const poly2 = this.pathMarkers[polyIndex].getPosition()
  const heading = google.maps.geometry.spherical.computeHeading(poly1, poly2)
  let remainingDist = google.maps.geometry.spherical.computeDistanceBetween(poly1, poly2)
  let startPos = poly1;
  this.isLand = false;
  const promises = [];
  while (remainingDist > 321 && this.isLand === false) {
    let step = google.maps.geometry.spherical.computeOffset(startPos, 322, heading)
    remainingDist -= 322;
    promises.push( this.checkStep(startPos) );
  };
  Promise.all(promises);
}
```
The polylineSegmentor is a function that I've written but have not yet been able to put to use. It takes the path between two markers and breaks it into 0.2 mile segments. Each piece of the segment will be fun through two functions. One similar to checkTerrain which will check to see if the points within a line lie on land.

The other will break the line into vectors parallel and perpendicular with the current and use NOAA's current predictor to give a much more accurate presentation of your actual speed on the water.

#### Friending/Following

Rowing is primarily a social activity so it only makes sense to be able to share courses and information with people in your community.
