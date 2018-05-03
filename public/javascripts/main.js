// Functions shared across client pages

var patientId = getParameterByName("patientId");
var practitionerId = getParameterByName("practitionerId");

$(document).ready(function() {
  highlightActiveNav();
  $("#patients-link").attr("href", "/patients?practitionerId=" + practitionerId + "&patientId=" + patientId);
  $("#summary-link").attr("href", "/summary?practitionerId=" + practitionerId + "&patientId=" + patientId);
  $("#notes-link").attr("href", "/notes?practitionerId=" + practitionerId + "&patientId=" + patientId);

});


// Highlight icon for current page in navbar
function highlightActiveNav(){
  $('li.active').removeClass('active');
  $('a[href="' + location.pathname + '"]').closest('li').addClass('active');
}


// Get query parameter from URL
function getParameterByName(name, url){
    if (!url){
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getPatientName(patient){

  var name = patient.name[0] ? patient.name[0] : patient.name;

  var firstName = name.given[0] ? name.given[0] : "";
  var middleName = name.given[1] ? name.given[1] : "";
  var lastName = name.family ? name.family : "";

  return lastName + ", " + firstName + " " + middleName;
}

// Format a date object in a common way: yyyy-mm-dd hh:mm am/pm
function formatDate(date) {
  var year = date.getFullYear(),
      month = date.getMonth() + 1, // months are zero indexed
      day = date.getDate(),
      hour = date.getHours(),
      minute = date.getMinutes(),
      second = date.getSeconds(),
      hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
      minuteFormatted = minute < 10 ? "0" + minute : minute,
      morning = hour < 12 ? "am" : "pm";

  return year + "-" + month + "-" + day + " " + hourFormatted + ":" +
          minuteFormatted + morning;
}
