const resolve = (arg) => {
  debugger
  const img = arg;
  img.id = 'terrain'
  img.crossOrigin = "Anonymous";
  $('.create-tools').append(img);
  const renderedImg = document.getElementById('terrain');
  debugger
  const canvas = document.createElement('canvas');
  canvas.width = renderedImg.width;
  canvas.height = renderedImg.height;
  canvas.getContext('2d').drawImage(renderedImg, 0, 0, renderedImg.width, renderedImg.height);
  debugger
  const HELLYEA = canvas.getContext('2d').getImageData(0, 0).data;
  debugger
  return HELLYEA;
}
  const center = `${position.lat()},${position.lng()}`
  debugger
  image({
    type: 'staticmap',
    center,
    zoom: '20',
    size: '1x1',
  }).then(arg => resolve(arg));


  // `http://maps.googleapis.com/maps/api/staticmap?center=${position.lat()},${position.lng()}&zoom=20&size=20x20&maptype=roadmap&sensor=false&key=AIzaSyBiE2efHKeAptVfVRtj9-ZDeHWPKgNjdNk`
  // img.id = 'terrain';
  // $('.create-tools').append(img);
  // const renderedImg = document.getElementById('terrain');
