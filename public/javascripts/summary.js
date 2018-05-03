// JS for specifically the summary page, primarily the plotting functions

// Get the patient ID from the query parameter in the URL
var patientId = getParameterByName("patientId");

// Data for dummy chart

// Gets weight readings
var heightsRetrieved = false;
var weightsRetrieved = false;

var this_time;
var today_time = new Date();

weights = [];
weights_fake = [];
heights = [];
heights_fake = []; 
hdls = []
hdls_fake = []
ldls = []
ldls_fake = []
hbs = []
hbs_fake = []
bmis = []
bmi_calc = []
bmis_fake = []

dates = []
dates[0] = new Date("Tue Jan 10 2017 16:45:00 GMT-0500").getTime()
dates[1] = new Date("Sun July 10 2016 16:45:00 GMT-0500").getTime()
dates[2] = new Date("Sun Jan 10 2016 16:45:00 GMT-0500").getTime()
dates[3] = new Date("Fri Jul 10 2015 16:45:00 GMT-0500").getTime()

var fakeScores = [
  [dates[3], 55],
  [dates[2], 68],
  [dates[1], 66],
  [dates[0], 84]
];


// Do only once the window is done loading...
window.onload=function() {
  document.getElementById("nutrient-score").innerHTML = fakeScores[fakeScores.length-1][1];
  showProgressChart("progress-chart", fakeScores, "Nutrition Score", "#2196F3");
}

$(".measurement-right a").click(function(){
    $(this).find("img").toggleClass("toggled");
});



// JSON for patient info
$.getJSON("/fhir/patient", {patientId: patientId}, function(res){
  console.log("patient");
  console.log(res);

  var name = getPatientName(res[0]);

  $("#name-text").text(name);
  $("#gender-text").text(res[0].gender);

  if(res[0].birthDate){
    var currentDate = new Date();
    var age = currentDate.getFullYear() - res[0].birthDate.split("-")[0];
    $("#birth-text").text(res[0].birthDate);
    $("#age-text").text(age + " yrs");
  }
});


//JSON for weights
$.getJSON("/fhir/weight", {patientId: patientId}, function(res){
    jsonObject = res;
    count = 0;

    for(var i in jsonObject)
    {
        this_time = new Date(jsonObject[i].time) //new Date().getTime()

        //if(today_time.getFullYear() - this_time.getFullYear() <= 4)     //there are many values for weight thus taking only within 4 years
        if(true)
        {
            weights.push([dates[count],jsonObject[i].weight]);
            //weights_fake.push([dates[count], jsonObject[i].weight+0, jsonObject[i].weight-0]);
            count = count + 1;
            //weights.push([new Date(jsonObject[i].time).getTime(),jsonObject[i].weight])
            //weights_fake.push([new Date(jsonObject[i].time).getTime(),jsonObject[i].weight+0, jsonObject[i].weight-0])
        }
        if(count == 4)
            break;
    }
    weightsRetrieved = true;

    var currentWeight = jsonObject[jsonObject.length-1].weight;
    var currentUnit = jsonObject[jsonObject.length-1].unit

    $("#weight-text").text(currentWeight + " " + currentUnit);
    drawBMIGraph(jsonObject);
});


//JSON for heights
$.getJSON("/fhir/height", {patientId: patientId}, function(res){
    jsonObject = res;
    count = 0

    for(var i in jsonObject)
    {
        this_time = new Date(jsonObject[i].time) //new Date().getTime()
        //if(today_time.getFullYear() - this_time.getFullYear() <= 4)     //there are many values for height thus taking only within 4 years
        if(true)
        {
            heights.push([dates[count],jsonObject[i].height]);
            //heights_fake.push([dates[count], jsonObject[i].height+0, jsonObject[i].height-0]);
            count = count + 1;
            //heights.push([new Date(jsonObject[i].time).getTime(),jsonObject[i].height])
            //heights_fake.push([new Date(jsonObject[i].time).getTime(),jsonObject[i].height+0, jsonObject[i].height-0])
        }
        if(count == 4)
            break;
    }

    heightsRetrieved = true;

    var currentHeight = jsonObject[jsonObject.length-1].height;
    var currentUnit = jsonObject[jsonObject.length-1].unit

    $("#height-text").text(currentHeight + " " + currentUnit);

    drawBMIGraph(jsonObject);
});


//JSON for HDL
$.getJSON("/fhir/hdl", {patientId: patientId}, function(res){
    jsonObject = res;
    count = 0;

    for(var i in jsonObject)
    {
        this_time = new Date(jsonObject[i].time) //new Date().getTime()
        if(true)//today_time.getFullYear() - this_time.getFullYear() <= 4)      //there are no values within 4 years so im using all
        {
            hdls.push([dates[count],jsonObject[i].HDL])
            //hdls_fake.push([dates[count],jsonObject[i].HDL+0, jsonObject[i].HDL-0])
            count = count + 1;
            //hdls.push([new Date(jsonObject[i].time).getTime(),jsonObject[i].HDL])
            //hdls_fake.push([new Date(jsonObject[i].time).getTime(),jsonObject[i].HDL+0, jsonObject[i].HDL-0])
        }
        if(count == 4)
            break;
    }
    if(count == 0)
    {
        while(count<4)
        {
            //(Math.random() * (0.120 - 0.0200) + 0.0200).toFixed(4)
            num = (Math.random() * (60-40) + 40);
            //console.log("num: ",num)
            hdls.push([dates[count],num]);
            //hdls_fake.push([dates[count],num+0,num-0]);
            count = count + 1;
        }
    }
    else if (count<4)
    {
        val = count;
        while(count<4)
        {
            //(Math.random() * (0.120 - 0.0200) + 0.0200).toFixed(4)
            num = (Math.random() * (hdls[count-1][1]+0.3 - hdls[count-1][1]-0.3)) + hdls[count-1][1]-0.3;
            //console.log("num: ",num)
            hdls.push([dates[count],num]);
            //hdls_fake.push([dates[count],num+0,num-0]);
            count = count + 1;
        }
    }
    document.getElementById("hdl-score").innerHTML = hdls[0][1].toFixed(2);
    showProgressChart('Chart3', hdls, "HDL", "#FF5722");
});


//JSON for LDL
$.getJSON("/fhir/ldl", {patientId: patientId}, function(res){
    jsonObject = res;
    count = 0;

    for(var i in jsonObject)
    {
        this_time = new Date(jsonObject[i].time) //new Date().getTime()
        if(true)//today_time.getFullYear() - this_time.getFullYear() <= 4)      //there are no values within 4 years so im using all
        {
            ldls.push([dates[count],jsonObject[i].LDL])
            //ldls_fake.push([dates[count],jsonObject[i].LDL+0, jsonObject[i].LDL-0])
            count = count + 1;
            //ldls.push([new Date(jsonObject[i].time).getTime(),jsonObject[i].LDL])
            //ldls_fake.push([new Date(jsonObject[i].time).getTime(),jsonObject[i].LDL+0, jsonObject[i].LDL-0])
        }
        if(count == 4)
            break;
    }
    if(count == 0)
    {
        while(count<4)
        {
            //(Math.random() * (0.120 - 0.0200) + 0.0200).toFixed(4)
            num = (Math.random() * (170-130) + 130);
            //console.log("num: ",num)
            ldls.push([dates[count],num]);
            //ldls_fake.push([dates[count],num+0,num-0]);
            count = count + 1;
        }
    }
    else if(count < 4)
        {
            val = count;
            while(count<4)
            {
                //(Math.random() * (0.120 - 0.0200) + 0.0200).toFixed(4)
                num = (Math.random() * (ldls[count-1][1]+0.3 - ldls[count-1][1]-0.3)) + ldls[count-1][1]-0.3;
                //console.log("num: ",num)
                ldls.push([dates[count],num]);
                //ldls_fake.push([dates[count],num+0,num-0]);
                count = count + 1;
            }
        }
    document.getElementById("ldl-score").innerHTML = ldls[0][1].toFixed(2);
    showProgressChart('Chart4', ldls, "LDL", "#8A65CE");
});


//JSON for HBA1C
$.getJSON("/fhir/HBA1C", {patientId: patientId}, function(res){
    jsonObject = res;
    count = 0;

    for(var i in jsonObject)
    {
        this_time = new Date(jsonObject[i].time) //new Date().getTime()
        if(true)//today_time.getFullYear() - this_time.getFullYear() <= 4)      //there are no values within 4 years so im using all
        {
            hbs.push([dates[count],jsonObject[i].HBA1C])
            //hbs_fake.push([dates[count],jsonObject[i].HBA1C+0, jsonObject[i].HBA1C-0])
            count = count + 1;
            //hbs.push([new Date(jsonObject[i].time).getTime(),jsonObject[i].HBA1C])
            //hbs_fake.push([new Date(jsonObject[i].time).getTime(),jsonObject[i].HBA1C+0, jsonObject[i].HBA1C-0])
        }
        if ( count == 4)
            break;
    }
    if(count == 0)
    {
        while(count<4)
        {
            //(Math.random() * (0.120 - 0.0200) + 0.0200).toFixed(4)
            num = (Math.random() * (7-5.5) + 5.5);
            //console.log("num: ",num)
            hbs.push([dates[count],num]);
            //hbs_fake.push([dates[count],num+0,num-0]);
            count = count + 1;
        }
    }
    if(count < 4)
    {
        val = count;
        while(count<4)
        {
            //(Math.random() * (0.120 - 0.0200) + 0.0200).toFixed(4)
            num = (Math.random() * (hbs[count-1][1]+0.3 - hbs[count-1][1]-0.3)) + hbs[count-1][1]-0.3;
            //console.log("num: ",num)
            hbs.push([dates[count],num]);
            //hbs_fake.push([dates[count],num+0,num-0]);
            count = count + 1;
        }
    }

    document.getElementById("hba1c-score").innerHTML = hbs[0][1].toFixed(2);
    showProgressChart('Chart2', hbs,"HBA1C", "#ff9800");
});


//to calculate bmi
function drawBMIGraph(js){
    if(weightsRetrieved && heightsRetrieved)
    {
        for(i=0;i<heights.length;i++)
        {
            //bmi_calc[i] = weights[i][1] / (heights[i][1] * heights[i][1])
            bmi_calc[i] = weights[i][1] * 0.45 /(heights[i][1]*heights[i][1] * 0.025 * 0.025);
            bmis.push([weights[i][0],bmi_calc[i]])
            //bmis_fake.push([weights[i][0], bmi_calc[i]+0, bmi_calc[i]-0])
        }
        document.getElementById("bmi-score").innerHTML = bmis[0][1].toFixed(2);
        showProgressChart('Chart1', bmis, "BMI", "#8bc34a");
    }
}

//toggle to set hide/show the graphs
function toggler(divId) {
    $("#" + divId).toggle();
}


/*
  Show the progress chart in a target div,
  with certain scores and ranges for those scores
*/
function showProgressChart (target, scores, title, color)
{
    Highcharts.chart(target, {

    title: {
        text: ''
    },

    xAxis: {
        type: 'datetime',
        //tickInterval: 6 * 30 * 24 * 3600 * 1000,
        labels: {
          style: {
            fontSize: '14px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
    },

    yAxis: {
        title: {
            text: null
        },
        labels: {
          style: {
            fontSize: '14px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
    },

    tooltip: {
        crosshairs: true,
        shared: true,
        valueDecimals: 3
    },

    legend: {
    },

    series: [{
        name: title,
        color: color,
        data: scores,

        zIndex: 1,
        marker: {
            fillColor: color,
            lineWidth: 4,
            lineColor: color//Highcharts.getOptions().colors[0]
        }
    }/*, {
        name: 'Range',
        data: ranges,
        type: 'arearange',
        lineWidth: 0,
        linkedTo: ':previous',
        color: Highcharts.getOptions().colors[0],
        fillOpacity: 0.3,
        zIndex: 0
    }*/],

    exporting: {
      enabled: false
    }
  });
}
