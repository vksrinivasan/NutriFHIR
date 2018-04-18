/* Global variables necessary for scatter/spider charts */
var hei; 
var ahei;
var dash; 
var nutrisavings;
var x;
var y;
var margin;   
 
// Keep track of whether user has clicked particular metric
var score_click = false;
// Keep track of which score was clicked
var score_click_type = undefined;
var hei_i = false; 
var ahei_i = false;
var dash_i = false; 
var nutrisavings_i = false; 

var showingSpider = false;

/* Generic create the card */
function dietCreateCard(id) {
	/* Create card itself */
	var drawdownCard = d3.select('#DietChart')
						 .append('div')
							.attr('class', 'card')
							.attr('id', id);
						 
	/* Create the card container */
	var drawdownContainer = drawdownCard.append('div')
											.attr('id', 'container');
											
	/* Create the card body */
	var cardBody = drawdownContainer.append('div')
										.attr('id', 'drawDownInformation')
										.attr('class', 'card-body');
	
	return cardBody; 
}

/* Generic create title row with burger */
function dietCreateTitleBurger(cardBody, title) {
	var row = cardBody.append('div')
					  .attr('class', 'row');
						
	row.append('h2') 
	       .attr('class', 'card-title col-sm-11')
	       .attr('id', title)
		   .attr('style', 'cursor: pointer')
	       .text(title);
}

/* Generic create card sides/divisions */
function dietCreateSide(cardBody, perc, side) {
	var side = cardBody.append('div')
							.attr('style', 'float:' + side + '; width: ' + perc);
	return side;
}

/* Generic plot data */
function dietCreatePlot(side, data, cardName) {
	var pData = data['percentage'];
	var cardData = document.getElementById(cardName.replace('#', ''));
	var cardDim = cardData.getBoundingClientRect();
	
	var width = cardDim.width;
	var height = math.max(cardDim.height, 200);
	
	//Get margin and weidth height
	margin = {top: 30, right: 50, bottom: 30, left: 50};
	var width = width - margin.left - margin.right;
	var height = height - margin.top - margin.bottom;

	y_min = 0; //math.min(math.min(arr_metrics[i]['percentage']), y_min);
	y_max = 100; //math.max(math.max(arr_metrics[i]['percentage']), y_max);

	var x_min = new Date(Math.min.apply(null, data['date']));

	var x_max = new Date(Math.max.apply(null, data['date']));

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
						 
	// Add svg canvas
	var svg = d3.select(cardName)
				.append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
				.append("g")
					.attr("transform",
								"translate(" + margin.left + "," + margin.top + ")");
								
	// Add x axis
	svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis);
	
	// Add y axis
	svg.append("g")
	.attr("class", "y axis")
	.call(yAxis);
	
	// Plot Actual Data
 	var plotVals = [];
	for(j = 0; j < data['date'].length; j++) {
		plotVals.push([data['date'][j], data['percentage'][j]]);
	}
	svg.append("path")
		.attr('d', lineFunc(plotVals))
		.attr('stroke', data['color'])
		.attr('stroke-width', 2)
		.attr('fill', 'none')
		.attr('id', data['name']);
	
	svg.append("path")
	   .attr('d', lineFunc(plotVals))
	   .attr('class', 'pathActual');

	// Give title
	svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 4))
        .attr("text-anchor", "middle")
		.attr("font-family", "sans-serif")
        .style("font-size", "15px")
        .text("Eating Index (percentage of ideal) v. Time");

	// Add y-axis
    	svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left)
		.attr("x",0 - (height / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-family", "sans-serif")
		.style("font-size", 12)
		.text("Eating Index (percentage of ideal)");
	   
	
	// Plot scatter plot circles
	
	/*svg.selectAll("circle")
	   .data(plotVals)
	   .enter()
	   .append("circle")
	   .attr("cx", function(d) {
		   return x(d[0]);
	   })
	   .attr("cy", function(d) {
		   return y(d[1]);
	   })
	   .attr("r", 3)
	   .attr('class', 'pointActual');*/
	   
}

/* HEI listeners */
function heiHandler_click() {
	
	if(!hei_i) {
	
		var cardId = 'heiDrawdown';
		var cardTitle = 'HEI';
		
		/* Create the card */
		cardBody = dietCreateCard(cardId);
		hei_i = !hei_i;
		
		/* Add title to the card */
		dietCreateTitleBurger(cardBody, cardTitle);
		
		/* Add sides */
		var lhs = dietCreateSide(cardBody, '100%', 'left');
		var rhs = dietCreateSide(cardBody, '0%', 'right');
		
		/* Add RHS Plot */
		dietCreatePlot(rhs, hei, '#'+cardId);
		plotScatter(hei, '#'+cardId);
		
		/* Potential DeepDive Card Listener */
		document.getElementById("HEI").addEventListener("click", function() {
			document.getElementById(cardId).remove();
			clearScatter('#'+cardId);
			hei_i = !hei_i;
			if (showingSpider) {
				d3.select("#tipDiv").remove();
				showingSpider = false;
			}
		});
	}
}

/* AHEI Listeners */
function aheiHandler_click() {
	if(!ahei_i) {
	
		var cardId = 'aheiDrawdown';
		var cardTitle = 'AHEI';
		
		/* Create the card */
		cardBody = dietCreateCard(cardId);
		ahei_i = !ahei_i;
		
		/* Add title to the card */
		dietCreateTitleBurger(cardBody, cardTitle);
		
		/* Add sides */
		var lhs = dietCreateSide(cardBody, '100%', 'left');
		var rhs = dietCreateSide(cardBody, '0%', 'right');
		
		/* Add RHS Plot */
		dietCreatePlot(rhs, ahei, '#'+cardId);
		plotScatter(ahei, '#'+cardId);
		
		/* Potential DeepDive Card Listener */
		document.getElementById("AHEI").addEventListener("click", function() {
			document.getElementById(cardId).remove();
			clearScatter('#'+cardId);
			ahei_i = !ahei_i;
			if (showingSpider) {
				d3.select("#tipDiv").remove();
				showingSpider = false;
			}
		});
	}
}

function dashHandler_click() {
	if(!dash_i) {
	
		var cardId = 'dashDrawdown';
		var cardTitle = 'DASH';
		
		/* Create the card */
		cardBody = dietCreateCard(cardId);
		dash_i = !dash_i;
		
		/* Add title to the card */
		dietCreateTitleBurger(cardBody, cardTitle);
		
		/* Add sides */
		var lhs = dietCreateSide(cardBody, '100%', 'left');
		var rhs = dietCreateSide(cardBody, '0%', 'right');
		
		/* Add RHS Plot */
		dietCreatePlot(rhs, dash, '#'+cardId);
		plotScatter(dash, '#'+cardId);
		
		/* Potential DeepDive Card Listener */
		document.getElementById("DASH").addEventListener("click", function() {
			document.getElementById(cardId).remove();
			clearScatter('#'+cardId);
			dash_i = !dash_i;
			if (showingSpider) {
				d3.select("#tipDiv").remove();
				showingSpider = false;
			}
		});
	}
}

function nutrisavingsHandler_click() {
	if(!nutrisavings_i) {
	
		var cardId = 'nutrisavingsDrawdown';
		var cardTitle = 'NutriSavings';
		
		/* Create the card */
		cardBody = dietCreateCard(cardId);
		nutrisavings_i = !nutrisavings_i;
		
		/* Add title to the card */
		dietCreateTitleBurger(cardBody, cardTitle);
		
		/* Add sides */
		var lhs = dietCreateSide(cardBody, '100%', 'left');
		var rhs = dietCreateSide(cardBody, '0%', 'right');
		
		/* Add RHS Plot */
		dietCreatePlot(rhs, nutrisavings, '#'+cardId);
		
		/* Potential DeepDive Card Listener */
		document.getElementById("NutriSavings").addEventListener("click", function() {
			document.getElementById(cardId).remove();
			nutrisavings_i = !nutrisavings_i;
		});
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

	/* Get DASH Data */
	nutrisavings = getNutriSavingsData_randomized();

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
							   "#dash_value");
	nutrisavings_color = fillOutScores(nutrisavings['score'][nutrisavings['score'].length-1],    // Score For Most Recent Month
							   nutrisavings['ref_hi'], 					         // Reference Ideal Score
							   nutrisavings['date'][nutrisavings['date'].length-1],      // Date on Nearest Most Recent Period
				               		   "#mrpp_text",						     // ID of element for Most Recent Purchase Period
							   "#nutrisavings_value");					         // ID of element for Most Recent DASH %

	/* Get Sum of Scores At Each Period For Each Index */
	hei_sum = getTimeSeriesSum(hei['score']);
	hei_ideal = getTimeSeriesIdeal(hei['ref_hi'], hei['score'].length);
	hei_percentage = [];
	for (i = 0; i < hei['score'].length; i++) {
		hei_percentage.push(hei_sum[i] / hei_ideal[i] * 100);
	}
	ahei_sum = getTimeSeriesSum(ahei['score']);
	ahei_ideal = getTimeSeriesIdeal(ahei['ref_hi'], ahei['score'].length);
	ahei_percentage = [];
	for (i = 0; i < ahei['score'].length; i++) {
		ahei_percentage.push(ahei_sum[i] / ahei_ideal[i] * 100);
	}
	dash_sum = getTimeSeriesSum(dash['score']);
	dash_ideal = getTimeSeriesIdeal(dash['ref_hi'], dash['score'].length);
	dash_percentage = [];
	for (i = 0; i < dash['score'].length; i++) {
		dash_percentage.push(dash_sum[i] / dash_ideal[i] * 100);
	}
	nutrisavings_sum = getTimeSeriesSum(nutrisavings['score']);
	nutrisavings_ideal = getTimeSeriesIdeal(nutrisavings['ref_hi'], nutrisavings['score'].length);
	nutrisavings_percentage = [];
	for (i = 0; i < nutrisavings['score'].length; i++) {
		nutrisavings_percentage.push(nutrisavings_sum[i] / nutrisavings_ideal[i] * 100);
	}
	
	/* Add Sums/Ideal/Names/Colors to the structs */
	hei['sum'] = hei_sum;
	hei['ideal'] = hei_ideal;
	hei['percentage'] = hei_percentage;
	hei['name'] = 'HEI';
	hei['color'] = "#3E74A5";
	ahei['sum'] = ahei_sum;
	ahei['ideal'] = ahei_ideal;
	ahei['percentage'] = ahei_percentage;
	ahei['name'] = 'AHEI';
	ahei['color'] = "#DB7100";
	dash['sum'] = dash_sum;
	dash['ideal'] = dash_ideal;
	dash['percentage'] = dash_percentage;
	dash['name'] = 'DASH';
	dash['color'] = "#45B20E";
	nutrisavings['sum'] = nutrisavings_sum;
	nutrisavings['ideal'] = nutrisavings_ideal;
	nutrisavings['percentage'] = nutrisavings_percentage;
	nutrisavings['name'] = 'NutriSavings';
	nutrisavings['color'] = "#DB2354";

	/* Plot Percentages */
	//plotPercentages([hei,ahei,dash]);

}

function clearScatter(cardId) {
	var svg = d3.select(cardId).select("svg");
	svg.selectAll("circle").remove();
}

function plotScatter(scoreObj, cardId) {
	console.log(cardId);
	var svg = d3.select(cardId).select("svg");

	// Put the data for this sore in an easy to use object
	var plotVals = []
	for(i = 0; i < scoreObj['date'].length; i++) {
		plotVals.push([i, scoreObj['date'][i], scoreObj['percentage'][i], scoreObj]);
	}

	var tool_tip = d3.tip()
	  .attr("class", "d3-tip")
	  .offset([-400, -150])
	  .html("<div id='tipDiv'></div>");

	var tool_tip_percent = d3.tip()
	  .attr("class", "d3-tip")
	  .offset([20, 10])
	  .html("<div id='tipPercentDiv'></div>");

	svg.call(tool_tip);
	svg.call(tool_tip_percent);

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
	   .style("cursor", 'pointer')
	   .on('click', function(d) {
		if (!showingSpider) {
		    	tool_tip.show();
		    	var tipSVG = d3.select("#tipDiv")
						  .append("svg")
						  .attr("width", 300)
						  .attr("height", 300)
						  .attr("class", "tipBody")
						  .style("opacity", 1)
						  .style("border", 2)
						  .style("background-color", "blue");

			createSpider(tipSVG, d[0], d[3]);
			showingSpider = true;
		}
		else {
			d3.select("#tipDiv").remove();
			showingSpider = false;
		}

	    })

		.on('mouseover', function(d, i) {
			tool_tip_percent.show();
		    // Specify where to put label of text
			//console.log(d[3]['name'][i] + ": " + d[3]['sum'][i] + ", " + d[3]['ideal'][i]);
			var percentSVG = d3.select("#tipPercentDiv")
					.append("text")
					.text(function() {
						return (d[3]['sum'][i]/d[3]['ideal'][i] * 100).toFixed(2) + "%";  // Value of the text
					});
		})

		.on('mouseout', function(d, i){
			d3.select("#tipPercentDiv").remove();  // Remove text location
		});
	/*
	var borderPath = svg.append("rect")
       			.attr("x", 0)
       			.attr("y", 0)
       			.attr("height", 250)
       			.attr("width", 300)
       			.style("stroke", 'black')
       			.style("fill", "none")
       			.style("stroke-width", 1);
	*/
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

function plotPercentages(arr_metrics) {
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
	var y_min = arr_metrics[0]['percentage'][0];
	var y_max = arr_metrics[0]['percentage'][0];
	var x_min = arr_metrics[0]['date'][0];
	var x_max = arr_metrics[0]['date'][0];

	// Fixed y-ais since now plotting percentage which is always between 0 and 100%
	for(i = 0; i < arr_metrics.length; i++) {
		y_min = 0; //math.min(math.min(arr_metrics[i]['percentage']), y_min);
		y_max = 100; //math.max(math.max(arr_metrics[i]['percentage']), y_max);

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
			plotVals.push([arr_metrics[i]['date'][j], arr_metrics[i]['percentage'][j]]);
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
        .text("Eating Index (percentage of ideal) v. Time");

	// Add y-axis
    svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left)
		.attr("x",0 - (height / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-family", "sans-serif")
		.style("font-size", 12)
		.text("Eating Index (percentage of ideal)");
}

function add(a, b) {
    return a + b;
}

function getTimeSeriesSum(actual) {
	ret_timeSeries = [];
	for(i = 0; i < actual.length; i++) {
		ret_timeSeries.push(actual[i].reduce(add));
	}
	return ret_timeSeries;
}

function getTimeSeriesIdeal(ideal, nTimesteps) {
	ret_timeSeries = [];
	for(i = 0; i < nTimesteps; i++) {
		ret_timeSeries.push(ideal.reduce(add));
	}
	return ret_timeSeries;
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
	$(loc_val).text(String("" + actTotal.toFixed(2) + "/" + idealTotal));
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

function getNutriSavingsData_randomized() {

	//var possValues = [0.0, 0.5, 1.0];

	var reference_lo = [0];
	var reference_hi = [100];
	var dates = [new Date(2018,0,1), new Date(2018,1,1),new Date(2018,2,1),new Date(2018,3,1)];
	var scores = [[], [], [], []];

	for(i = 0; i < dates.length; i++) {
		scores[i][0] = getRandomInt(reference_lo[0], reference_hi[0]);
	}

	var retStruct = {comp: [], ref_lo: reference_lo, ref_hi: reference_hi, date: dates, score: scores};
	return retStruct;
}

function plotMap(address, queryType) {
 

  var map = null;
  var gmarkers = [];
  var destMarkers = [];
  var service = null; 
  var noAutoComplete = true;
  var noQuery = true;
  var initialService = null;
  var geocoder = new google.maps.Geocoder();
  var infowindow = new google.maps.InfoWindow({
    size: new google.maps.Size(100, 30)
  });
  var startLoc = new google.maps.LatLng(40.7902778, -73.9597222); // Manhattan, NY
  var circle = new google.maps.Circle({
    center: startLoc,
    radius: 5 * 1609.34, // 10 miles
    strokeWeight: 2,
    strokeColor: "black",
    strokeOpacity: 0.9,
    fillColor: "red",
    fillOpacity: 0.15,
    clickable: false,
    map: map
  });
 
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var places = [];
      for (var i = 0; i < gmarkers.length; i++) {
        gmarkers[i].setMap(null);
      }
      gmarkers = [];

      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        places.push(place);
        createMarker(results[i]);
      }

      var marker = new google.maps.Marker({
          position: startLoc,
          map: map,
          
        });

      map.fitBounds(circle.getBounds());
      google.maps.event.trigger(map, 'resize');
      map.panTo(startLoc);
      //map.setZoom(map.getZoom() + 1);
      // if (markers.length == 1) map.setZoom(17);
      var destArray = [];
      destMarkers = [];

      var minDist = Number.MAX_VALUE;

      var htmlString = "Nearby " + queryType + " : " + "\n" ; 

      for (var i = 0; i < gmarkers.length; i++) {
        var currDist = google.maps.geometry.spherical.computeDistanceBetween(startLoc, gmarkers[i].getPosition());
        if (currDist < 5 * 1609.34) { // 1609.34 meters/mile

        	//htmlString = htmlString + "\n" + "\n" +results[i].name + "\n" + results[i].formatted_address +  "(" + Number(Math.round( currDist / 1609.34 +'e2')+'e-2') + " miles away)";

			createTableRows(results[i].name, results[i].formatted_address.split(',')[0]);
			
          destArray.push(gmarkers[i].getPosition());
          destMarkers.push(gmarkers[i]); 
        }
      }

      $("#groceryInfo").text(htmlString);

    }   
  }

  function initialize() {
		
    map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(40.65, -73.95), // Brooklyn, NY
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: false
    }); 
    //circle.setMap(map);
    service = new google.maps.places.PlacesService(map);
    initialService = new google.maps.places.PlacesService(map);


    geocoder.geocode({
      'address': address
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        startLoc = results[0].geometry.location;
        circle.setCenter(startLoc);
        var request = {
          bounds: circle.getBounds(),
          query: queryType
        };
        initialService.textSearch(request, callback);
      } else {
        alert("geocode failed:" + status); 
      }
    });
 
    var groceryCard = document.getElementById('GroceryCardMap');
    var groceryCardDim = groceryCard.getBoundingClientRect();
    var height = groceryCardDim.height*3.0;
    var width = groceryCardDim.width*1.4;

	var svg2 = d3.select("#mapChart")
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	var svg3 = d3.select("#groceryInfo")
		.append("svg")
		.attr("width", 0.2*width)
		.attr("height", 0.7*height);



  }

 
  var mapDiv = document.getElementById('mapChart');

  initialize();
  //google.maps.event.addDomListener(window, 'load', initialize);

  function createMarker(place) {
    var placeLoc = place.geometry.location;
    if (place.icon) {  
      var image = {
        url: place.icon,
        // size:new google.maps.Size(71, 71),
        // origin: new google.maps.Point(0, 0), 
        // anchor:new google.maps.Point(35, 0),
        scaledSize: new google.maps.Size(13, 13)
      };
    } else var image = null;

    var marker = new google.maps.Marker({
      map: map,
      icon: image,
      position: place.geometry.location
    });
    var request = {
      reference: place.reference
    };   

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.marker = marker;
      service.getDetails(request, function(place, status) { 
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          var contentStr = '<h5>' + place.name + '</h5><p>' + place.formatted_address;
          if (!!place.formatted_phone_number) contentStr += '<br>' + place.formatted_phone_number;
          if (!!place.website) contentStr += '<br><a target="_blank" href="' + place.website + '">' + place.website + '</a>';
          contentStr += '<br>' + place.types + '</p>';
          infowindow.setContent(contentStr + '<input type="button" value="zoom in" onclick="map.setCenter(infowindow.marker.getPosition());map.setZoom(map.getZoom()+1);"/><input type="button" value="zoom out" onclick="map.fitBounds(circle.getBounds());"/>');
          infowindow.open(map, marker);
        } else { 
          var contentStr = "<h5>No Result, status=" + status + "</h5>";
          infowindow.setContent(contentStr);
          infowindow.open(map, marker); 
        }
      }); 
    
    });     
    
    gmarkers.push(marker);
  }       
 
}

function plotMarkers() {

	var option = this.options[this.selectedIndex].text;
	plotMap(pat_addr, option);

}

/* Generic create table rows for Grocery */
function createTableRows(businessName, streetAddr) {
	var tableBody = document.getElementById("groceryTableData").getElementsByTagName('tbody')[0];
	var newRow = tableBody.insertRow(tableBody.rows.length);
	newRow.className = "groceryTableRow";
	
	/* Create space for star */
	var starCell = newRow.insertCell(0);
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute('height','20px');
	svg.setAttribute('width','20px');
	svg.setAttribute('style', 'background-color:none');
	starCell.append(svg);
	
	/* Create space for data */
	var newCell = newRow.insertCell(1);
	var bName = document.createTextNode(businessName);
	var nLine = document.createElement("br");
	var sAddr = document.createTextNode(streetAddr);
	newCell.appendChild(bName);
	newCell.append(nLine);
	newCell.appendChild(sAddr);
}