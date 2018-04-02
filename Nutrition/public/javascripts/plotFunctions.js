/* Required Smart on Fhir On Ready Function */
function plotHeight() {
	/* First thing to do is the clean up what is already there if anything */
	d3.select("#chartRegion").select("svg").remove();
	FHIR.oauth2.ready(genHeightChart, onError);
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
		
		plotD3Data(retStruct);
    }
  )
}

function plotD3Data(retStruct) {
	/* Get the size of the LHS of the card div so I know how big to make this */
	var lhs_data = document.getElementById('vitals')
	var lhs_header = document.getElementById('vitalTitle')
	var positionInfo_data = lhs_data.getBoundingClientRect();
	var positionInfo_header = lhs_header.getBoundingClientRect();
	
	// Make margins/Get weidth height
	var margin = {top: 2, right: 2, bottom: 2, left: 2},
    width = (positionInfo_data.width)*0.42 - margin.left - margin.right,
    height = (positionInfo_data.height + positionInfo_header.height) - margin.top - margin.bottom;
	
	// Define axes
	var x = d3.scale.linear().range([0, 3]);
	var y = d3.scale.linear().range([220, 100]);
	
	// Define the axes
	var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);
	
	var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);
	
	// Define the line
	var valueline = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });
				  
	// Adds the svg canvas
	var svg = d3.select("#chartRegion")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");
			  
    
	
} 

function extractDateVal(obv) {
	var retVals = []
	var units = undefined 
	
	for(i = 0; i < obv.length; i++) {
		var encounter = obv[i];
		var temp = [encounter['valueQuantity']['value'], 
					i,
					encounter['referenceRange'][0]['high'],
					encounter['referenceRange'][0]['low']
					]
		retVals.push(temp)
		units = encounter['valueQuantity']['unit']
	}
	
	var retStruct = {data:retVals, unit: units};
	return retStruct
}