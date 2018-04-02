/* Handlers */
function heightHandler() {
	plotVitals("Height");
}

function sbpHandler() {
	plotVitals("SBP");
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
		var retStruct = extractDateVal(sbp);
		
		plotD3Data(retStruct, "SBP");
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