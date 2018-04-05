/* Global variables necessary for scatter/spider charts */
var hei;
var ahei;
var dash;
var x; 
var y;
var margin;

// Keep track of whether user has clicked particular metric
var score_click = false;
// Keep track of which score was clicked
var score_click_type = undefined;

/* HEI listeners */
function heiHandler_mouseover() {
	if(!score_click) {
		if(d3.select("#AHEI").style('opacity') === "1") {
			d3.select("#AHEI").style('opacity', 0.3);
		}
		
		if(d3.select("#DASH").style('opacity') === "1") {
			d3.select("#DASH").style('opacity', 0.3);
		}
	}
}

function heiHandler_click() {
	if(!score_click) {
		d3.select("#AHEI").style('opacity', 0.3);
		d3.select("#DASH").style('opacity', 0.3);
		plotScatter(hei);
		score_click = !score_click;
		score_click_type = "HEI";
	} else {
		if(score_click_type === "HEI") {
			clearScatter();
			score_click = !score_click;
			score_click_type = undefined;
		}
	}
}

/* AHEI Listeners */
function aheiHandler_mouseover() {
	if(!score_click) {
		if(d3.select("#HEI").style('opacity') === "1") {
			d3.select("#HEI").style('opacity', 0.3);
		}
		
		if(d3.select("#DASH").style('opacity') === "1") {
			d3.select("#DASH").style('opacity', 0.3);
		}
	}
}

function aheiHandler_click() {
	if(!score_click) {
		d3.select("#HEI").style('opacity', 0.3);
		d3.select("#DASH").style('opacity', 0.3);
		plotScatter(ahei);
		score_click = !score_click;
		score_click_type = "AHEI";
	} else {
		if(score_click_type === "AHEI") {
			clearScatter();
			score_click = !score_click;
			score_click_type = undefined;
		}
	}
}

/* DASH Listeners */
function dashHandler_mouseover() {
	if(!score_click) {
		if(d3.select("#HEI").style('opacity') === "1") {
			d3.select("#HEI").style('opacity', 0.3);
		}
		
		if(d3.select("#AHEI").style('opacity') === "1") {
			d3.select("#AHEI").style('opacity', 0.3);
		}
	} 
}

function dashHandler_click() {
	if(!score_click) {
		d3.select("#HEI").style('opacity', 0.3);
		d3.select("#AHEI").style('opacity', 0.3);
		plotScatter(dash);
		score_click = !score_click;
		score_click_type = "DASH";
	} else {
		if(score_click_type === "DASH") {
			clearScatter();
			score_click = !score_click;
			score_click_type = undefined;
		}
	}
}

/* Handle generic mouseout for all score types */
function handle_mouseout() {
	if(!score_click) {
		d3.select("#HEI").style('opacity', 1.0);
		d3.select("#AHEI").style('opacity', 1.0);
		d3.select("#DASH").style('opacity', 1.0);
	}
}


function populateDietaryData() {
	 
	/*  When we get access to some nutrition server/scoring method, we can 
	 *  change these first 3 calls to get real data 
	 */
	      
	/* Get HEI-2015 Data */ 
	hei = getHEIData_randomized();
	
	/* Get AHEI Data */ 
	ahei = getAHEIData_randomized();
	 
	/* Get DASH Data */
	dash = getDashData_randomized(); 
	
	/* Fill out current scores */
	hei_color =	fillOutScores(hei['score'][hei['score'].length-1], // Score For Most Recent Month
							  hei['ref_hi'], 					   // Reference Ideal Score
							  hei['date'][hei['date'].length-1],   // Date on Nearest Most Recent Period
							  "#mrpp_text",						   // ID of element for Most Recent Purchase Period
							  "#hei_value");					   // ID of element for Most Recent HEI %
				  
	ahei_color = fillOutScores(ahei['score'][ahei['score'].length-1], // Score For Most Recent Month
							   ahei['ref_hi'], 					      // Reference Ideal Score
							   ahei['date'][ahei['date'].length-1],   // Date on Nearest Most Recent Period
							   "#mrpp_text",						  // ID of element for Most Recent Purchase Period
							   "#ahei_value");					      // ID of element for Most Recent AHEI %
				  
	dash_color = fillOutScores(dash['score'][dash['score'].length-1],    // Score For Most Recent Month
							   dash['ref_hi'], 					         // Reference Ideal Score
							   dash['date'][dash['date'].length-1],      // Date on Nearest Most Recent Period
				               "#mrpp_text",						     // ID of element for Most Recent Purchase Period
							   "#dash_value");					         // ID of element for Most Recent DASH %
	
	/* Calculate KL-Divergence Between Each Period's Scores and Ideal */
	hei_divergence = getTimeSeriesDivergence(hei['score'], hei['ref_hi']);
	ahei_divergence = getTimeSeriesDivergence(ahei['score'], ahei['ref_hi']);
	dash_divergence = getTimeSeriesDivergence(dash['score'], dash['ref_hi']);
	
	/* Add Divergences/Names/Colors to the structs */
	hei['divergence'] = hei_divergence;
	hei['name'] = 'HEI';
	hei['color'] = hei_color;
	ahei['divergence'] = ahei_divergence;
	ahei['name'] = 'AHEI';
	ahei['color'] = ahei_color;
	dash['divergence'] = dash_divergence;
	dash['name'] = 'DASH';
	dash['color'] = dash_color;
	
	/* Plot KL Divergence */
	plotDistributionDivergence([hei,ahei,dash]);
	
}

function clearScatter() {
	var svg = d3.select('#DietChart').select("svg");
	svg.selectAll("circle").remove();
}

function plotScatter(scoreObj) {
	var svg = d3.select('#DietChart').select("svg");
	
	// Put the data for this sore in an easy to use object
	var plotVals = []
	for(i = 0; i < scoreObj['date'].length; i++) {
		plotVals.push([i, scoreObj['date'][i], scoreObj['divergence'][i], scoreObj]);
	}
	
	var tool_tip = d3.tip()
	  .attr("class", "d3-tip")
	  .offset([-400, -150])
	  .html("<div id='tipDiv'></div>");
	
	svg.call(tool_tip);
	
	// Now create the circles
	svg.selectAll("circle")
	   .data(plotVals)
	   .enter()
	   .append("circle")
	   .attr("cx", function(d) {
			return x(d[1]);
	   })
	   .attr("cy", function(d) {
			return y(d[2]);
	   })
	   .attr("r", 3)
	   .attr("myIndex", function(d) {
			return d[0];
	   }) 
	   .attr("transform", 
				  "translate(" + margin.left + "," + margin.top + ")")
	   .style("fill", scoreObj['color'])
	   .on('mouseover', function(d) {
		    tool_tip.show();
		    var tipSVG = d3.select("#tipDiv")
						  .append("svg")
						  .attr("width", 300)
						  .attr("height", 300)
						  .attr("class", "tipBody")
						  .style("background-color", "blue");
				
			createSpider(tipSVG, d[0], d[3]);
						  
			
						  
	    })
		.on('mouseout', tool_tip.hide);
}

/* Create the spider chart on mouseover */
function createSpider(toolTip, index, data) {
	var w = 300,
		h = 250;

	console.log(data);
			
	var colorscale = d3.scale.category10();
	var LegendOptions = ['Smartphone'];

	// Get data in format
	var d = []
	for(iterator = 0; iterator < data['score'][index].length; iterator++) {
		temp = {axis: data['comp'][iterator], 
			    value: (data['score'][index][iterator]/data['ref_hi'][iterator])};
		d.push(temp);
	}
	
	d = [d];

 	//Options for the Radar chart, other than default
	var mycfg = {
	  w: w,
	  h: h,
	  maxValue: 1.0,
	  levels: 4,
	  ExtraWidthX: 300
	}

	//Call function to draw the Radar chart
	//Will expect that data is in %'s
	RadarChart.draw("#tipDiv", d, mycfg); 
}

function plotDistributionDivergence(arr_metrics) {
	console.log(arr_metrics);
	var cardData = document.getElementById('DietCard');
	var cardDim = cardData.getBoundingClientRect();
	
	var width = cardDim.width*.95;
	var height = cardDim.height;
	
	//Get margin and weidth height
	margin = {top: 30, right: 50, bottom: 30, left: 50};
	var width = width - margin.left - margin.right;
	var height = height - margin.top - margin.bottom;
				
	// Set Axis Scales
	var y_min = arr_metrics[0]['divergence'][0];
	var y_max = arr_metrics[0]['divergence'][0];
	var x_min = arr_metrics[0]['date'][0];
	var x_max = arr_metrics[0]['date'][0];
	
	for(i = 0; i < arr_metrics.length; i++) {
		y_min = math.min(math.min(arr_metrics[i]['divergence']), y_min);
		y_max = math.max(math.max(arr_metrics[i]['divergence']), y_max);
		
		var x_min_t = new Date(Math.min.apply(null, arr_metrics[i]['date']));
		x_min = new Date(Math.min.apply(null, [x_min_t, x_min]));
		
		var x_max_t = new Date(Math.max.apply(null, arr_metrics[i]['date']));
		x_max = new Date(Math.max.apply(null, [x_max_t, x_max]));
	}
	
	console.log(x_min);
	console.log(x_max);
	var adj_factor = (y_max - y_min)/4.0;
	y_min = y_min - adj_factor;
	y_max = y_max + adj_factor;
	
	x = d3.time.scale()
			   .domain([x_min, x_max])
			   .range([0, width]);
				  
	y = d3.scale.linear()
					  .domain([y_min, y_max])
					  .range([height, 0]);
						  
	// Define the axes 
	var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);
	
	var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);
	
	// Define the line
	var lineFunc = d3.svg.line()
		.x(function(d) {
			return x(d[0]);
		})
		.y(function(d) {
			return y(d[1]);
		})
	  .interpolate('linear');
		
	// Adds the svg canvas
	var svg = d3.select("#DietChart")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", 
				  "translate(" + margin.left + "," + margin.top + ")");
				  
	// Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
 
    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
	
	// Plot data
	for(i = 0; i < arr_metrics.length; i++) {
		var plotVals = [];
		for(j = 0; j < arr_metrics[i]['date'].length; j++) {
			plotVals.push([arr_metrics[i]['date'][j], arr_metrics[i]['divergence'][j]]);
		}
		svg.append("path")
			.attr('d', lineFunc(plotVals))
			.attr('stroke', arr_metrics[i]['color'])
			.attr('stroke-width', 2)
			.attr('fill', 'none')
			.attr('id', arr_metrics[i]['name']);
	}
	
	// Give title
	svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 4))
        .attr("text-anchor", "middle")  
		.attr("font-family", "sans-serif")
        .style("font-size", "15px")  
        .text("Ideal Eating Index Divergence v. Time");
		
	// Add y-axis
    svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left)
		.attr("x",0 - (height / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-family", "sans-serif")
		.style("font-size", 12)
		.text("KL-Divergence");
}

function getTimeSeriesDivergence(actual, ideal) {
	ret_timeSeries = [];
	for(i = 0; i < actual.length; i++) {
		ret_timeSeries.push(math.kldivergence(actual[i], ideal));
	}
	return ret_timeSeries;
}

function add(a, b) {
    return a + b;
}

function fillOutScores(actComponentScores, idealComponentScores, date, loc_mrpp, loc_val) { 
	var actTotal = actComponentScores.reduce(add, 0.0);
	var idealTotal = idealComponentScores.reduce(add, 0.0);
	var propOfIdeal = actTotal/idealTotal;
	
	$(loc_mrpp).text("Most Recent Purchase Period (" + date.toDateString() + ")");
	
	/* We want to have a color scale for the %'s */
	var color = d3.scale.linear().domain([0.30,0.70])
								 .interpolate(d3.interpolateHcl)
								 .range([d3.rgb("#C21807"), d3.rgb('#4CBB17')]);
	
	var value_color = color(propOfIdeal);
	$(loc_val).text(String(((propOfIdeal) * 100).toFixed(0) + '%'));
	d3.select(loc_val).style("color",value_color); 
	return value_color;
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/* Randomized Data Generating Functions Below - Whoever gets access to an API 
 * for nutrition data would need to just replace these functions with calls to 
 * that API and transform the data into this format 
 */
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
	var dates = [new Date(2018,0,1), new Date(2018,1,1),new Date(2018,2,1),new Date(2018,3,1)];
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
	var dates = [new Date(2018,0,1), new Date(2018,1,1),new Date(2018,2,1),new Date(2018,3,1)];
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
	
	//var possValues = [0.0, 0.5, 1.0];
		
	var reference_lo = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0];
	var reference_hi = [1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0];
	var dates = [new Date(2018,0,1), new Date(2018,1,1),new Date(2018,2,1),new Date(2018,3,1)];
	var scores = [[], [], [], []];
	
	for(i = 0; i < dates.length; i++) {
		for(j = 0; j < components.length; j++) {
			//var index = getRandomInt(0,2);
			//scores[i][j] = possValues[index];
			scores[i][j] = getRandomFloat(reference_lo[j], reference_hi[j]);
		}
	}
	
	var retStruct = {comp: components, ref_lo: reference_lo, ref_hi: reference_hi, date: dates, score: scores};
	return retStruct;
}