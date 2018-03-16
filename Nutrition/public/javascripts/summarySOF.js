/* Required Smart on Fhir On Ready Function */
function onReady(smart) {
  var patient = smart.patient;
  var pt = patient.read();
  var obv = smart.patient.api.fetchAll({

    // Note - I don't know how to sort results by time or anything. Someone
    // should figure that out
    type: 'Observation',
    query: {
      code: {
        $or: ['http://loinc.org|3141-9', // Body weight measured
              'http://loinc.org|8302-2', // Body height
              'http://loinc.org|39156-5'] // BMI
      }
    }

  });

  var cond = smart.patient.api.search({type: 'Condition'});
  var meds = smart.patient.api.search({type: 'MedicationOrder'});

  $.when(pt, obv, cond, meds).fail(onError);
  $.when(pt, obv, cond, meds).done(
    function(patient, obv, conditions, prescriptions) {
      console.log(patient);
      console.log(obv);
      console.log(conditions);
      console.log(prescriptions);
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
      var byCodes = smart.byCodes(obv, 'code');
      var weight = byCodes('3141-9');
      console.log(getQuantityValueAndUnit(weight[0]));
      $("#weight-text").text(getQuantityValueAndUnit(weight[0]));

      /* Get Height */
      var height = byCodes('8302-2');
      console.log(getQuantityValueAndUnit(height[0]));
      $("#height-text").text(getQuantityValueAndUnit(height[0]));

      /* Get BMI */
      var BMI = byCodes('39156-5');
      console.log(getQuantityValueAndUnit(BMI[0]));
      $("#bmi-score").text(getQuantityValueAndUnit(BMI[0]));
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

/* Helper Function to Get Quantity Value/Units for a Given Observation */
function getQuantityValueAndUnit(ob) {
  if (typeof ob != 'undefined' &&
      typeof ob.valueQuantity != 'undefined' &&
      typeof ob.valueQuantity.value != 'undefined' &&
      typeof ob.valueQuantity.unit != 'undefined') {
        return ob.valueQuantity.value + ' ' + ob.valueQuantity.unit;
  } else {
    return undefined;
  }
}
