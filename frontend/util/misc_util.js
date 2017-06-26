export const timeConverter = (UNIX_timestamp) => {
  const a = new Date(UNIX_timestamp);
  const months = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const time = month + ' ' + date + ', ' + year;
  return time;
}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    if (hours === '00') {
      return minutes+':'+seconds;
    }
    return hours+':'+minutes+':'+seconds;
};
