function populateDietaryData() {
	
	/*  When we get access to some nutrition server/scoring method, we can 
	 *  change these first 3 calls to get real data 
	 */
	      
	/* Get HEI-2015 Data */ 
	var hei = getHEIData_randomized();
	
	/* Get AHEI Data */ 
	var ahei = getAHEIData_randomized();
	 
	/* Get DASH Data */
	var dash = getDashData_randomized(); 
	
	/* Fill out current scores */
	fillOutScores(hei['score'][hei['score'].length-1], // Score For Most Recent Month
				  hei['ref_hi'], 					   // Reference Ideal Score
				  hei['date'][hei['date'].length-1],   // Date on Nearest Most Recent Period
				  "#mrpp_text",						   // ID of element for Most Recent Purchase Period
				  "#hei_value");					   // ID of element for Most Recent HEI %
				  
	fillOutScores(ahei['score'][ahei['score'].length-1], // Score For Most Recent Month
				  ahei['ref_hi'], 					     // Reference Ideal Score
				  ahei['date'][ahei['date'].length-1],   // Date on Nearest Most Recent Period
				  "#mrpp_text",						     // ID of element for Most Recent Purchase Period
				  "#ahei_value");					     // ID of element for Most Recent AHEI %
				  
	fillOutScores(dash['score'][dash['score'].length-1], // Score For Most Recent Month
				  dash['ref_hi'], 					     // Reference Ideal Score
				  dash['date'][dash['date'].length-1],   // Date on Nearest Most Recent Period
				  "#mrpp_text",						     // ID of element for Most Recent Purchase Period
				  "#dash_value");					     // ID of element for Most Recent DASH %
	
	/* Calculate KL-Divergence Between Each Period's Scores and Ideal */
	
	
}

function add(a, b) {
    return a + b;
}

function fillOutScores(actComponentScores, idealComponentScores, date, loc_mrpp, loc_val) { 
	var actTotal = actComponentScores.reduce(add, 0.0);
	var idealTotal = idealComponentScores.reduce(add, 0.0);
	var propOfIdeal = actTotal/idealTotal;
	
	$(loc_mrpp).text("Most Recent Purchase Period (" + date + ")");
	
	/* We want to have a color scale for the %'s */
	var color = d3.scale.linear().domain([0.3,0.7])
								 .interpolate(d3.interpolateHcl)
								 .range([d3.rgb("#C21807"), d3.rgb('#4CBB17')]);
	
	var value_color = color(propOfIdeal);
	$(loc_val).text(String(((propOfIdeal) * 100).toFixed(0) + '%'));
	d3.select(loc_val).style("color",value_color); 
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getHEIData_randomized() {
	var components = [
		'Total Fruits',
		'Whole Fruits',
		'Total Vegetables',
		'Greens and Beans',
		'Whole Grains',
		'Daily',
		'Total Protein Foods',
		'Seafood and Plant Proteins',
		'Fatty Acids',
		'Refined Grains',
		'Sodium',
		'Added Sugars',
		'Saturated Fats'
		];
		
	var reference_lo = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0];
	var reference_hi = [5.0,5.0,5.0,5.0,10.0,10.0,5.0,5.0,10.0,10.0,10.0,10.0,10.0];
	var dates = ['1/1/2018','2/1/2018','3/1/2018','4/1/2018'];
	var scores = [[], [], [], []];
	
	for(i = 0; i < dates.length; i++) {
		for(j = 0; j < components.length; j++) {
			scores[i][j] = getRandomFloat(reference_lo[j], reference_hi[j]);
		}
	}
	
	var retStruct = {comp: components, ref_lo: reference_lo, ref_hi: reference_hi, date: dates, score: scores};
	return retStruct;
}

function getAHEIData_randomized() {
	var components = [
		'Vegatables',
		'Fruit',
		'Nuts & Soy',
		'Ratio of White/Red Meat',
		'Total Fiber',
		'Trans Fat',
		'PUFA/SFA',
		'Duration of Multivitamin Use',
		'Alcohol'
		];
		
	var reference_lo = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,2.5,0.0];
	var reference_hi = [10.0,10.0,10.0,10.0,10.0,10.0,10.0,7.5,10.0];
	var dates = ['1/1/2018','2/1/2018','3/1/2018','4/1/2018'];
	var scores = [[], [], [], []];
	
	for(i = 0; i < dates.length; i++) {
		for(j = 0; j < components.length; j++) {
			scores[i][j] = getRandomFloat(reference_lo[j], reference_hi[j]);
		}
	}
	
	var retStruct = {comp: components, ref_lo: reference_lo, ref_hi: reference_hi, date: dates, score: scores};
	return retStruct;
}

function getDashData_randomized() {
	var components = [
		'Protein',
		'Fiber',
		'Magnesium',
		'Calcium',
		'Potassium',
		'Total Fat',
		'Saturated Fat',
		'Cholesterol',
		'Sodium'
		];
	
	var possValues = [0.0, 0.5, 1.0];
		
	var reference_lo = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0];
	var reference_hi = [1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0];
	var dates = ['1/1/2018','2/1/2018','3/1/2018','4/1/2018'];
	var scores = [[], [], [], []];
	
	for(i = 0; i < dates.length; i++) {
		for(j = 0; j < components.length; j++) {
			var index = getRandomInt(0,2);
			scores[i][j] = possValues[index];
		}
	}
	
	var retStruct = {comp: components, ref_lo: reference_lo, ref_hi: reference_hi, date: dates, score: scores};
	return retStruct;
}
 