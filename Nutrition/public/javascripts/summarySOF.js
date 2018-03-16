/* Required Smart on Fhir On Ready Function */
function onReady(smart) {
  var patient = smart.patient;
  var pt = patient.read();
  var obv = smart.patient.api.fetchAll({
    type: 'Observation',
    query: {
      code: {
        $or: ['http://loinc.org|3141-9'] // Body weight measured
      }
    }
  });

  $.when(pt, obv).fail(onError);
  $.when(pt, obv).done(
    function(patient, obv) {
      console.log(patient);
      console.log(obv);
      /* Get Name */
      var fname = '';
      var lname = '';
      if(typeof patient.name[0] !== 'undefined') {
        fname = patient.name[0].given.join(' ').toLowerCase();
        lname = patient.name[0].family.join(' ').toLowerCase();
      }
      console.log(titleCase(fname));
      console.log(titleCase(lname));

      $("#name-text").text(
        titleCase(lname) + ', ' + titleCase(fname)
      );

      /* Get Patient Gender */
      console.log(patient.gender);
      $("#gender-text").text(
        titleCase(patient.gender)
      );

      /* Get Patient Birth Date */
      var dob = new Date(patient.birthDate);
      var day = dob.getDate();
      var monthIndex = dob.getMonth() + 1;
      var year = dob.getFullYear();
      var dobStr = monthIndex + "/" + day + '/' + year;
      console.log(dobStr);
      $("#birth-text").text(dobStr);

      /* Get Age */
      var age = parseInt(calculateAge(dob));
      console.log(age);
      $("#age-text").text(age + " yrs");

      /* Get Weight */

    }
  )
}

/* Required On Error function */
function onError() {
  console.log('Loading error', arguments);
}

/* Helper Function To Convert Lower-case words to Upper Case First letter */
function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for(var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}

/* Helper Function to Check If Leap Year - Needed To Get Age */
function isLeapYear(year) {
    return new Date(year, 1, 29).getMonth() === 1;
}

/* Helper Function to Calculate Age */
function calculateAge(date) {
  if (Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime())) {
    var d = new Date(date), now = new Date();
    var years = now.getFullYear() - d.getFullYear();
    d.setFullYear(d.getFullYear() + years);
    if (d > now) {
      years--;
      d.setFullYear(d.getFullYear() - 1);
    }
    var days = (now.getTime() - d.getTime()) / (3600 * 24 * 1000);
    return years + days / (isLeapYear(now.getFullYear()) ? 366 : 365);
  }
  else {
    return undefined;
  }
}
