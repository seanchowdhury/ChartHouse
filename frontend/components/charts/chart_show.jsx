const weather = $.ajax({
  type: 'GET',
  url: `http://api.wunderground.com/api/0f6b676260939449/history_${start}/q/${lat},${lng}.json`,
}).then( (weather) => {
