/* Handlers */
function heightHandler() {
	plotVitals("Height");
}

function sbpHandler() {
	plotVitals("SBP");
}

function weightHandler() {
	plotVitals("Weight");
}

function dbpHandler() {
	plotVitals("DBP");
}

function bmiHandler() {
	plotVitals("BMI");
}

function cholHandler() {
	plotVitals("Cholestrol");
}

function glucoseHandler() {
	plotVitals("Glucose");
}

function hdlHandler() {
	plotVitals("HDL");
}

function hba1cHandler() {
	plotVitals("HBA1c");
}

function ldlHandler() {
	plotVitals("LDL");
}
/* Required Smart on Fhir On Ready Function */
function plotVitals(vital) {
	/* First thing to do is the clean up what is already there if anything */
	d3.select("#chartRegion").select("svg").remove();
	
	console.log(vital);
	
	/* Then pick which plot function (i.e. data gather function) we need */
	switch(vital) {
		case "Height":
			FHIR.oauth2.ready(genHeightChart, onError);
		break;
		case "SBP":
			FHIR.oauth2.ready(genSBPChart, onError);
		break;
		case "Weight":
			FHIR.oauth2.ready(genWeightChart, onError);
		break;
		case "DBP":
			FHIR.oauth2.ready(genDBPChart, onError);
		break;
		case "BMI":
			FHIR.oauth2.ready(genBMIChart, onError);
		break;
		case "Cholestrol":
			FHIR.oauth2.ready(genCholChart, onError);
		break;
		case "Glucose":
			FHIR.oauth2.ready(genGlucoseChart, onError);
		break;
		case "HDL":
			FHIR.oauth2.ready(genHDLChart, onError);
		break;
		case "HBA1c":
			FHIR.oauth2.ready(genHBA1cChart, onError);
		break;
		case "LDL":
			FHIR.oauth2.ready(genLDLChart, onError);
		break;
	}
}  
 
/* Create the chart for height */
function genHeightChart(smart) {
  var patient = smart.patient;
  var pt = patient.read();
  var obv = smart.patient.api.fetchAll({
    
    // Note - I don't know how to sort results by time or anything. Someone
    // should figure that out
    type: 'Observation',
    query: {
      code: {
        $or: [
              'http://loinc.org|8302-2', // Body height
            ]
      }
    }                       
               
  });       
   
  $.when(pt, obv).fail(onError);
  $.when(pt, obv).done(
    function(patient, obv) {
		
		var byCodes = smart.byCodes(obv, 'code');
		
		var height = byCodes('8302-2');
		console.log(height);
		var retStruct = extractDateVal(height);
		
		plotD3Data(retStruct, "Height");
    }
  )
}

/* Create the chart for SBP */
function genSBPChart(smart) {
  var patient = smart.patient;
  var pt = patient.read();
  var obv = smart.patient.api.fetchAll({
   
    // Note - I don't know how to sort results by time or anything. Someone
    // should figure that out
    type: 'Observation',
    query: {
      code: {
        $or: [
              'http://loinc.org|8480-6', // Systolic Blood Pressure
            ]
      }
    }                       
               
  });       
  
  $.when(pt, obv).fail(onError);         
  $.when(pt, obv).done(
    function(patient, obv) {
		var byCodes = smart.byCodes(obv, 'code');
	
		var sbp = byCodes('8480-6');
		if (sbp.length > 0) {
			console.log("plotting SBP");
			ob = sbp[0];
			//some vitals couldn't be plotted, even though the values were clearly there
			if (typeof ob.referenceRange != 'undefined' &&
			      typeof ob['referenceRange'][0] != 'undefined' &&
			      typeof ob['referenceRange'][0]['high'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['high']['value'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['low'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['low']['value'] != 'undefined') {
				var retStruct = extractDateVal(sbp);
	
				plotD3Data(retStruct, "SBP");
			}
			else {
				console.log("couldn't read values to plot SBP");
			}
		}
		else {
			console.log("No SBP");
		}
    }
  )
}

/* Create the chart for Weight */
function genWeightChart(smart) {
  var patient = smart.patient;
  var pt = patient.read();
  var obv = smart.patient.api.fetchAll({
   
    // Note - I don't know how to sort results by time or anything. Someone
    // should figure that out
    type: 'Observation',
    query: {
      code: {
        $or: [
              'http://loinc.org|3141-9', // Weight
            ]
      }
    }                       
               
  });       
  
  $.when(pt, obv).fail(onError);         
  $.when(pt, obv).done(
    function(patient, obv) {
		var byCodes = smart.byCodes(obv, 'code');
	
		var weight = byCodes('3141-9');
		if (weight.length > 0) {
			console.log("plotting Weight");
			ob = weight[0];
			//some vitals couldn't be plotted, even though the values were clearly there
			if (typeof ob.referenceRange != 'undefined' &&
			      typeof ob['referenceRange'][0] != 'undefined' &&
			      typeof ob['referenceRange'][0]['high'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['high']['value'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['low'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['low']['value'] != 'undefined') {
				var retStruct = extractDateVal(weight);
	
				plotD3Data(retStruct, "Weight");
			}
			else {
				console.log("couldn't read values to plot Weight");
			}
		}
		else {
			console.log("No weight");
		}
    }
  )
}

/* Create the chart for DBP */
function genDBPChart(smart) {
  var patient = smart.patient;
  var pt = patient.read();
  var obv = smart.patient.api.fetchAll({
   
    // Note - I don't know how to sort results by time or anything. Someone
    // should figure that out
    type: 'Observation',
    query: {
      code: {
        $or: [
              'http://loinc.org|8462-4', // Diastolic Blood Pressure
            ]
      }
    }                       
               
  });       
  
  $.when(pt, obv).fail(onError);         
  $.when(pt, obv).done(
    function(patient, obv) {
		var byCodes = smart.byCodes(obv, 'code');
	
		var dbp = byCodes('8462-4');
		if (dbp.length > 0) {
			console.log("plotting DBP");
			ob = dbp[0];
			//some vitals couldn't be plotted, even though the values were clearly there
			if (typeof ob.referenceRange != 'undefined' &&
			      typeof ob['referenceRange'][0] != 'undefined' &&
			      typeof ob['referenceRange'][0]['high'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['high']['value'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['low'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['low']['value'] != 'undefined') {
				var retStruct = extractDateVal(dbp);

				plotD3Data(retStruct, "DBP");
			}
			else {
				console.log("couldn't read values to plot DBP");
			}
		}
		else {
			console.log("No DBP");
		}
    }
  )
}

/* Create the chart for BMI */
function genBMIChart(smart) {
  var patient = smart.patient;
  var pt = patient.read();
  var obv = smart.patient.api.fetchAll({
   
    // Note - I don't know how to sort results by time or anything. Someone
    // should figure that out
    type: 'Observation',
    query: {
      code: {
        $or: [
              'http://loinc.org|39156-5', // BMI
            ]
      }
    }                       
               
  });       
  
  $.when(pt, obv).fail(onError);         
  $.when(pt, obv).done(
    function(patient, obv) {
		var byCodes = smart.byCodes(obv, 'code');
	
		var bmi = byCodes('39156-5');
		if (bmi.length > 0) {
			console.log("plotting BMI");
			ob = bmi[0];
			//some vitals couldn't be plotted, even though the values were clearly there
			if (typeof ob.referenceRange != 'undefined' &&
			      typeof ob['referenceRange'][0] != 'undefined' &&
			      typeof ob['referenceRange'][0]['high'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['high']['value'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['low'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['low']['value'] != 'undefined') {
				var retStruct = extractDateVal(bmi);

				plotD3Data(retStruct, "BMI");
			}
			else {
				console.log("couldn't read values to plot BMI");
			}
		}
		else {
			console.log("No BMI");
		}
    }
  )
}

/* Create the chart for Cholestrol */
function genCholChart(smart) {
  var patient = smart.patient;
  var pt = patient.read();
  var obv = smart.patient.api.fetchAll({
   
    // Note - I don't know how to sort results by time or anything. Someone
    // should figure that out
    type: 'Observation',
    query: {
      code: {
        $or: [
              'http://loinc.org|2093-3', // Cholestrol in Serum (mg/dL)
            ]
      }
    }                       
               
  });       
  
  $.when(pt, obv).fail(onError);         
  $.when(pt, obv).done(
    function(patient, obv) {
		var byCodes = smart.byCodes(obv, 'code');
	
		var chol = byCodes('2093-3');
		if (chol.length > 0) {
			console.log("plotting Cholestrol");
			ob = chol[0];
			//some vitals couldn't be plotted, even though the values were clearly there
			if (typeof ob.referenceRange != 'undefined' &&
			      typeof ob['referenceRange'][0] != 'undefined' &&
			      typeof ob['referenceRange'][0]['high'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['high']['value'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['low'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['low']['value'] != 'undefined') {
				var retStruct = extractDateVal(chol);
	
				plotD3Data(retStruct, "Cholestrol");
			}
			else {
				console.log("couldn't read values to plot Cholestrol");
			}
		}
		else {
			console.log("No Cholestrol");
		}
    }
  )
}

/* Create the chart for Glucose */
function genGlucoseChart(smart) {
  var patient = smart.patient;
  var pt = patient.read();
  var obv = smart.patient.api.fetchAll({
   
    // Note - I don't know how to sort results by time or anything. Someone
    // should figure that out
    type: 'Observation',
    query: {
      code: {
        $or: [
              'http://loinc.org|2345-7', // Glucose
            ]
      }
    }                       
               
  });       
  
  $.when(pt, obv).fail(onError);         
  $.when(pt, obv).done(
    function(patient, obv) {
		var byCodes = smart.byCodes(obv, 'code');
	
		var glucose = byCodes('2345-7');
		if (glucose.length > 0) {
			console.log("plotting Glucose");
			ob = glucose[0];
			//some vitals couldn't be plotted, even though the values were clearly there
			if (typeof ob.referenceRange != 'undefined' &&
			      typeof ob['referenceRange'][0] != 'undefined' &&
			      typeof ob['referenceRange'][0]['high'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['high']['value'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['low'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['low']['value'] != 'undefined') {
				var retStruct = extractDateVal(glucose);
	
				plotD3Data(retStruct, "Glucose");
			}
			else {
				console.log("couldn't read values to plot Glucose");
			}
		}
		else {
			console.log("No Glucose");
		}
    }
  )
}

/* Create the chart for HDL */
function genHDLChart(smart) {
  var patient = smart.patient;
  var pt = patient.read();
  var obv = smart.patient.api.fetchAll({
   
    // Note - I don't know how to sort results by time or anything. Someone
    // should figure that out
    type: 'Observation',
    query: {
      code: {
        $or: [
              'http://loinc.org|2085-9', // HDL
            ]
      }
    }                       
               
  });       
  
  $.when(pt, obv).fail(onError);         
  $.when(pt, obv).done(
    function(patient, obv) {
		var byCodes = smart.byCodes(obv, 'code');
	
		var hdl = byCodes('2085-9');
		if (hdl.length > 0) {
			console.log("plotting HDL");
			console.log(hdl);
			ob = hdl[0];
			//some vitals couldn't be plotted, even though the values were clearly there
			if (typeof ob.referenceRange != 'undefined' &&
			      typeof ob['referenceRange'][0] != 'undefined' &&
			      typeof ob['referenceRange'][0]['high'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['high']['value'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['low'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['low']['value'] != 'undefined') {
				var retStruct = extractDateVal(hdl);
	
				plotD3Data(retStruct, "HDL");
			}
			else {
				console.log("couldn't read values to plot HDL");
			}
		}
		else {
			console.log("No HDL");
		}
    }
  )
}

/* Create the chart for HBA1c */
function genHBA1cChart(smart) {
  var patient = smart.patient;
  var pt = patient.read();
  var obv = smart.patient.api.fetchAll({
   
    // Note - I don't know how to sort results by time or anything. Someone
    // should figure that out
    type: 'Observation',
    query: {
      code: {
        $or: [
              'http://loinc.org|4548-4', // HBA1c
            ]
      }
    }                       
               
  });       
  
  $.when(pt, obv).fail(onError);         
  $.when(pt, obv).done(
    function(patient, obv) {
		var byCodes = smart.byCodes(obv, 'code');
	
		var hba1c = byCodes('4548-4');
		if (hba1c.length > 0) {
			console.log("plotting HBA1c");
			console.log(hba1c);
			ob = hba1c[0];
			//some vitals couldn't be plotted, even though the values were clearly there
			if (typeof ob.referenceRange != 'undefined' &&
			      typeof ob['referenceRange'][0] != 'undefined' &&
			      typeof ob['referenceRange'][0]['high'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['high']['value'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['low'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['low']['value'] != 'undefined') {
				var retStruct = extractDateVal(hba1c);
	
				plotD3Data(retStruct, "HBA1c");
			}
			else {
				console.log("couldn't read values to plot HBA1c");
			}
		}
		else {
			console.log("No HBA1c");
		}
    }
  )
}

/* Create the chart for LDL */
function genLDLChart(smart) {
  var patient = smart.patient;
  var pt = patient.read();
  var obv = smart.patient.api.fetchAll({
   
    // Note - I don't know how to sort results by time or anything. Someone
    // should figure that out
    type: 'Observation',
    query: {
      code: {
        $or: [
              'http://loinc.org|13457-7', // LDL
            ]
      }
    }                       
               
  });       
  
  $.when(pt, obv).fail(onError);         
  $.when(pt, obv).done(
    function(patient, obv) {
		var byCodes = smart.byCodes(obv, 'code');
	
		var ldl = byCodes('13457-7');
		if (ldl.length > 0) {
			console.log("plotting LDL");
			console.log(ldl);
			ob = ldl[0];
			//some vitals couldn't be plotted, even though the values were clearly there
			if (typeof ob.referenceRange != 'undefined' &&
			      typeof ob['referenceRange'][0] != 'undefined' &&
			      typeof ob['referenceRange'][0]['high'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['high']['value'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['low'] != 'undefined' &&
			      typeof ob['referenceRange'][0]['low']['value'] != 'undefined') {
				var retStruct = extractDateVal(ldl);
	
				plotD3Data(retStruct, "LDL");
			}
			else {
				console.log("couldn't read values to plot LDL");
			}
		}
		else {
			console.log("No LDL");
		}
    }
  )
}
 
function plotD3Data(retStruct, title) {
	
	console.log(retStruct['data']);
	var x_min = retStruct['data'][0][1];
	var x_max = retStruct['data'][0][1];
	var y_min = retStruct['data'][0][0];
	var y_max = retStruct['data'][0][0];
	
	var x_values = [];
	
	/* First find min/max index/values */
	for(i = 0; i < retStruct['data'].length; i++) {
		if(retStruct['data'][i][1] <= x_min) {
			x_min = retStruct['data'][i][1];
		}
		if(retStruct['data'][i][1] >= x_max) {
			x_max = retStruct['data'][i][1];
		}
		var temp = [retStruct['data'][i][0], retStruct['data'][i][2], retStruct['data'][i][3]];
		var t_min = d3.min(temp);
		var t_max = d3.max(temp);
		if(t_min <= y_min) {
			y_min = t_min;
		}
		if(t_max >= y_max) {
			y_max = t_max;
		}
		
		x_values.push(retStruct['data'][i][1]);
	}
	//y_max += (y_max-y_min)/2.0;
	//y_min -= (y_max-y_min)/2.0;
	console.log(y_max);
	console.log(y_min);
	
	/* Get the size of the LHS of the card div so I know how big to make this */
	var lhs_data = document.getElementById('vitals')
	var lhs_header = document.getElementById('vitalTitle')
	var positionInfo_data = lhs_data.getBoundingClientRect();
	var positionInfo_header = lhs_header.getBoundingClientRect();
	
	// Make margins/Get weidth height
	var left_padding_2 = 40;
	var right_padding_2 = 40;
	var bottom_padding_2 = 40;
	var top_padding = 40;
	
    var width_2 = (positionInfo_data.width)*0.42;
    var height_2 = (positionInfo_data.height + positionInfo_header.height);
	
	var svg2 = d3.select("#chartRegion")
	.append("svg")
	.attr("width", width_2)
	.attr("height", height_2);
	
	var xScale2 = d3.scale.linear()
						  .domain(d3.extent(x_values))
						  .range([left_padding_2, width_2 - right_padding_2]);
						
	var yScale2 = d3.scale.linear()
						  .domain([y_min, y_max])
						  .range([height_2 - bottom_padding_2, top_padding]);
						  
	var xAxis_2 = d3.svg.axis();
	xAxis_2.scale(xScale2);
	xAxis_2.orient("bottom")
	xAxis_2.ticks(x_values.length)
	xAxis_2.tickFormat(d3.format("d"));
	
	var yAxis_2 = d3.svg.axis()
	yAxis_2.scale(yScale2)
	yAxis_2.orient("left")
	yAxis_2.ticks(5);

	var lineRefHi = d3.svg.line()
						 .x(function(d) {
							return xScale2(d[1]);
							})
						 .y(function(d) {
							return yScale2(d[2]);
							});
							
	var lineRefLo = d3.svg.line()
						 .x(function(d) {
							return xScale2(d[1]);
							})
						 .y(function(d) {
							return yScale2(d[3]);
							});
							
	var lineRefVal = d3.svg.line()
						 .x(function(d) {
							return xScale2(d[1]);
							})
						 .y(function(d) {
							return yScale2(d[0]);
							});
	
	svg2.append("g")
	.attr("class", "axis2")
	.attr("transform", "translate(" + left_padding_2 + ",0)")
	.call(yAxis_2);
	
	svg2.append("g")
	.attr("class", "axis2")
	.attr("transform", "translate(0," + (height_2 - bottom_padding_2) + ")")
	.call(xAxis_2);
	
	svg2.append("path")
		.attr('d', lineRefHi(retStruct['data']))
		.attr('stroke', '#C70039')
		.attr('stroke-width', 2)
		.attr('fill', 'none');
		
	svg2.append("path")
		.attr('d', lineRefLo(retStruct['data']))
		.attr('stroke', '#C70039')
		.attr('stroke-width', 2)
		.attr('fill', 'none');
		
	svg2.append("path")
		.attr('d', lineRefVal(retStruct['data']))
		.attr('stroke', '#41b6c4')
		.attr('stroke-width', 2)
		.attr('fill', 'none');
	
	/* x axis title */
	svg2.append("text")
	   .attr("x", width_2 - right_padding_2)
	   .attr("y", height_2 - (bottom_padding_2)/3.2)
	   .attr("text-anchor", "middle")
	   .style("font-family", "sans-serif")
	   .style("font-size", "11px")
	   .text("Period");
   
    /* y axis title */
	svg2.append("text")
	   .attr("x", left_padding_2*.60)
	   .attr("y", top_padding*.80)
	   .attr("text-anchor", "middle")
	   .style("font-family", "sans-serif")
	   .style("font-size", "11px")
	   .text(retStruct['unit']);
	   
	/* chart title */
	svg2.append("text")
	   .attr("x", width_2/2.0)
	   .attr("y", top_padding*.50)
	   .attr("text-anchor", "middle")
	   .style("font-family", "sans-serif")
	   .style("font-size", "11px")
	   .text(title);
	   
  
} 

function extractDateVal(obv) {
	var retVals = []
	var units = undefined 
	
	for(i = 0; i < obv.length; i++) {
		var encounter = obv[i];
		var temp = [encounter['valueQuantity']['value'], 
					i,
					encounter['referenceRange'][0]['high']['value'],
					encounter['referenceRange'][0]['low']['value']
					]
		retVals.push(temp)
		units = encounter['valueQuantity']['unit']
	}
	
	var retStruct = {data:retVals, unit: units};
	return retStruct
}
