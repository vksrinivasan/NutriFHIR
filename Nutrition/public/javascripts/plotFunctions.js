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
	var lhs = document.getElementById('vitals')
	var positionInfo = lhs.getBoundingClientRect();
	var svg = d3.select("#chartRegion").append("svg").attr("width",positionInfo.width).attr("height",positionInfo.height)
	var circle = svg.append("circle").attr("cx",30).attr("cy",30).attr("r",20)
} 

function extractDateVal(obv) {
	var values = []
	var dates = []
	var ref_hi = []
	var ref_lo = []
	var units = undefined 
	
	for(i = 0; i < obv.length; i++) {
		var encounter = obv[i];
		values.push(encounter['valueQuantity']['value'])
		dates.push(i)
		ref_hi.push(encounter['referenceRange'][0]['high'])
		ref_lo.push(encounter['referenceRange'][0]['low'])
		units = encounter['valueQuantity']['unit']
	}
	
	var retStruct = {x: values, y: dates, y_hi: ref_hi, y_lo: ref_lo, unit: units};
	return retStruct
}