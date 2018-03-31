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
              'http://loinc.org|39156-5', // BMI
              'http://loinc.org|14647-2',//Cholesterol in serum(moles/volume)
              'http://loinc.org|2093-3',//Cholesterol in serum(mass/volume)
              'http://loinc.org|4548-4',//Hba1c
              'http://loinc.org|2085-9',//HDL
              'http://loinc.org|13457-7',//LDL
			  'http://loinc.org|2345-7', // Glucose in Serum/Plasma
			  'http://loinc.org|8480-6', // Systolic Blood Pressure
			  'http://loinc.org|8462-4', // Diastolic Blood Pressure 
            ]
      }
    }                       
               
  });
  var isDiabetic = 0;
  var hasHypertension = false;

  var cond = smart.patient.api.search({type: 'Condition'});
  var meds = smart.patient.api.search({type: 'MedicationOrder'});
   
  var allergies = smart.patient.api.search({type: 'AllergyIntolerance'});
  
  $.when(pt, obv, cond, meds, allergies).fail(onError);
  $.when(pt, obv, cond, meds, allergies).done(
    function(patient, obv, conditions, prescriptions, allergies) {

      /* Get Name */
      var fname = '';
      var lname = '';
      if(typeof patient.name[0] !== 'undefined') {
        fname = patient.name[0].given.join(' ').toLowerCase();
        lname = patient.name[0].family.join(' ').toLowerCase();
      }
      //console.log(titleCase(fname));
      //console.log(titleCase(lname));

      $("#name-text").text(
        titleCase(lname) + ', ' + titleCase(fname)
      );

      /* Get Patient Gender */
      //console.log(patient.gender);
      $("#gender-text").text(
        titleCase(patient.gender)
      );

      /* Get Patient Birth Date */
      var dob = new Date(patient.birthDate);
      var day = dob.getDate();
      var monthIndex = dob.getMonth() + 1;
      var year = dob.getFullYear();
      var dobStr = monthIndex + "/" + day + '/' + year;
      //console.log(dobStr);
      $("#birth-text").text(dobStr);

      /* Get Age */
      var age = parseInt(calculateAge(dob));
      //console.log(age);
      $("#age-text").text(age + " yrs");

      /* Print statuses for diabetes and hypertension */
      console.log("Diabetes: " + isDiabetic);
      if (isDiabetic > 0) {
	$("#has-diabetes").text("Yes");
      }
      else {
	$("#has-diabetes").text("No");
      }

      if (hasHypertension) {
	$("#has-hypertension").text("Yes");
      }
      else {
	$("#has-hypertension").text("No");
      }

      /* Get Weight */
      var byCodes = smart.byCodes(obv, 'code');
      var weight = byCodes('3141-9');
      //console.log(getQuantityValueAndUnit(weight[0]));
      $("#weight-text").text(getQuantityValueAndUnit(weight[0]));

      /* Get Height */
      var height = byCodes('8302-2');
      //console.log(getQuantityValueAndUnit(height[0]));
      $("#height-text").text(getQuantityValueAndUnit(height[0]));

      /* Get BMI */
      var BMI = byCodes('39156-5');
      //console.log(getQuantityValueAndUnit(BMI[0]));
      $("#bmi-score").text(getQuantityValueAndUnit(BMI[0]));

      /*Get Cholesterol(moles/volume) in Serum*/
      var cholesterol = byCodes('14647-2')

      /*obv.forEach(function(Observation){
        if(Observation.valueQuantity){
        console.log(Observation.valueQuantity)
      }
    })*/
  
      /*Get total HBA1C*/
      var hba1c = byCodes('4548-4')
      //console.log(getQuantityValueAndUnit(hba1c[0]))
      $("#hba1c-score").text(getQuantityValueAndUnit(hba1c[0]));
  
      /*Get total cholesterol*/
      var chol = byCodes('2093-3')
      //console.log(getQuantityValueAndUnit(chol[0]))
      $("#chol").text(getQuantityValueAndUnit(chol[0]))
      console.log(obv)
       
      /*Get HDL*/
      var hdl = byCodes('2085-9')
      //console.log(getQuantityValueAndUnit(ldl[0]))
      $("#hdl-score").text(getQuantityValueAndUnit(hdl[0]))
 
      /*Get HDL*/
      var ldl = byCodes('13457-7')
      //console.log(getQuantityValueAndUnit(hdl[0]))
      $("#ldl-score").text(getQuantityValueAndUnit(ldl[0]))
	  
	  /*Get Glucose [Mass/volume] in serum or plasma*/
	  var gluc = byCodes('2345-7')
	  //console.log(getQuantityValueAndUnit(gluc[0]))
	  $("#gluc-score").text(getQuantityValueAndUnit(gluc[0]))
	  
	  /*Get Systolic Blood Pressure*/
	  var sbp = byCodes('8480-6')
	  $("#sbp-text").text(getQuantityValueAndUnit(sbp[0]))
	  
	  /*Get Diastolic Blood Pressure*/
	  var dbp = byCodes('8462-4')
	  $("#dbp-text").text(getQuantityValueAndUnit(dbp[0]))
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

/* Helper Functions to Generate Medication List From Search Results for MedicationOrders */
function getMedicationName (medCodings) {
  var coding = medCodings.find(function(c){
    return c.system == "http://www.nlm.nih.gov/research/umls/rxnorm";
  });

  return coding && coding.display || "Unnamed Medication(TM)"
}

function displayMedication (medCodings) {
  $("#med-list").append("<p>" + getMedicationName(medCodings) + "</p>");
}

/*Define toggler function for the dropdown*/
function toggler(divId) {
    $("#" + divId).toggle();
}

/*Draw Spider Chart for a given set of scores in the target div*/
function drawSpider(target,scores){

  Highcharts.chart(target, {

    chart: {
        polar: true,
        type: 'line'
    },

    title: {
        text: 'Nutrition Score Comoponents',
        x: -80
    },

    xAxis: {
        categories: ['Fruits', 'Vegetables', 'Grains', 'Dairy',
                'Protein Foods', 'Fats', 'Refined Grains', 'Sodium', 'Empty Calories'],
        tickmarkPlacement: 'on',
        lineWidth: 0
    },

    yAxis: {
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: 0,
        max: 20
    },

    tooltip: {
        shared: true,
    },

    legend: {
        align: 'right',
        verticalAlign: 'top',
        y: 70,
        layout: 'vertical'
    },
    series : scores
})};

/*Fake data for spider chart*/
test= [
  {
    name: 'Purchase period 1',
    data: [1,5, 10, 3, 1, 4, 6,8,19],
    pointPlacement: 'on'
},
{
    name: 'Purchase period 2',
    data: [1,6, 3, 10, 5, 8, 3,2,12],
    pointPlacement: 'on'
},
{
    name: 'Purchase period 3',
    data: [9,9, 8, 10, 6, 9, 7,8,7],
    pointPlacement: 'on'
},
];
 
/*Draw charts that are independant of FHIR calls*/
window.onload=function() {
  //document.getElementById("nutrient-score").innerHTML = 42;//Cuz, answer to everything
  drawSpider("progress-chart",test)
}

/*Draw line graph*/
function drawGraph(target,title,measurement,rangehigh,rangelow,xtitle,ytitle,min,max){

  series = [{name : xtitle,data:[]}]
  measurement.forEach(function(measurement){
    date = new Date(measurement.meta.lastUpdated)
    formattedDate = Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())
    series[0].data.push([formattedDate,measurement.valueQuantity.value])
  })
  console.log(series)

  Highcharts.chart(target,{

    title : {text : title, x: -80},
    xAxis: {
        type: 'datetime',
        tickInterval : 6 * 30 * 24 * 365
    },
      yAxis :{
      min : min,
      max : max,
      plotBands : [{
          from: rangelow, // Start of the plot band
          to: rangehigh, // End of the plot band
          color: 'rgba(68, 170, 213, 0.1)', // Color value
          label : {text : 'Reference region', style : { color : '#606060'}}
        }],
      title:{ text : ytitle}

        },
    series : series

    })
}
