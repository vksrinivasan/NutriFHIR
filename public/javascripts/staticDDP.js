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
var monitorSpider = false;

/* Generic create the card */
function dietCreateCard(id) { 
	 
	/* Create the card itself */
	 
	/* Figure out where to put the next card 
	 * (It goes immediately after the parent)
	 */
	var parentEl = d3.select("#summary").node();
	var childEl = parentEl.childNodes;
	var parentIndex = 0;
	for(i = 0; i < childEl.length; i++) {
		if(childEl[i]['id']=='DietCard') {
			parentIndex = i;
			break;
		}
	} 
	var newCard = document.createElement('div');
	newCard.setAttribute('class', 'card');
	newCard.setAttribute('id', id);
	parentEl.insertBefore(newCard, parentEl.childNodes[parentIndex+1]);
	
	var drawdownCard = d3.select('#'+id);
	
				  		 
	/* Create the card container */
	var drawdownContainer = drawdownCard.append('div')
											.attr('id', 'container')
											.attr('class', 'movable');
											
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
			.attr('style', 'float:' + side + '; width: ' + perc)
			.style("overflow", "auto")
			.style("height", "75px"); //75px for 3 lines, can change to 100px for 4 lines
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
	y_max = math.max(data['ideal']);

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
	var idealVals = [];
	for(j = 0; j < data['date'].length; j++) {
		plotVals.push([data['date'][j], data['sum'][j]]);
		idealVals.push([data['date'][j], data['ideal'][j]]);
	}
	svg.append("path")
		.attr('d', lineFunc(plotVals))
		.attr('stroke', 'steelblue')
		.attr('stroke-width', 2)
		.attr('fill', 'none')
		.attr('id', data['name']);
	
	svg.append("path")
	   .attr('d', lineFunc(plotVals))
	   .attr('class', 'pathActual');

	svg.append("path")
		.attr('d', lineFunc(idealVals))
		.attr('stroke', 'red')
		.attr('stroke-width', 2)
		.attr('fill', 'none')
		.attr('id', data['name'] + " ideal");
	
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
        .text(data['name'] + " score v. Time");

	// Add y-axis
    	svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left)
		.attr("x",0 - (height / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-family", "sans-serif")
		.style("font-size", 12)
		.text(data['name'] + " score");
	   
	
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

/* Generic create table */
function dietCreateTable(side, data) {
	var tableBody = side.append('table')
			.attr('class', 'deepDiveTable')
			.append('tbody');
	
	dietCreateTableHeader(tableBody, data['tableData']['headers']);
	dietPopulateTable(tableBody, data['tableData']);
}

/* Generic create table header */
function dietCreateTableHeader(tableBody, headers) {
	var tableRow = tableBody.append('tr');
	for(i = 0; i < headers.length; i++) {
		tableRow.append('th')
					.attr('class', 'deepDiveTableLabel')
					.text(headers[i]);
	}
}

/* Generic populate table */
function dietPopulateTable(tableBody, data) {
	for(i = 0; i < data['Date'].length; i++) {
		var tempTableRow = tableBody.append('tr');
		
		for(j = 0; j < data['headers'].length; j++) {
			if(data['headers'][j] === 'Value') {
				tempTableRow.append('th')
							.attr('class', 'deepDiveTableLabel')
							.attr('nowrap', 'nowrap')
							.style('color', data['colors'][i])
							.text(data[data['headers'][j]][i].toFixed(1));
			} else {
				tempTableRow.append('th')
								.attr('class', 'deepDiveTableLabel')
								.attr('nowrap', 'nowrap')
								.style('color', '#000000')
								.text(data[data['headers'][j]][i]);
			}
		}
	}
}

/* HEI listeners */
function heiHandler_click() {
	var cardId = 'heiDrawdown';
	var cardTitle = 'HEI';
	if(!hei_i) {
		
		/* Create the card */
		cardBody = dietCreateCard(cardId);
		hei_i = !hei_i;
		
		/* Add title to the card */
		dietCreateTitleBurger(cardBody, cardTitle);
		
		/* Add sides */
		var lhs = dietCreateSide(cardBody, '100%', 'left');
		var rhs = dietCreateSide(cardBody, '0%', 'right');
		
		/* Add LHS Table */
		dietCreateTable(lhs, hei);		
		 
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
	} else {
		document.getElementById(cardId).remove();
		hei_i = !hei_i;
	}
}

/* AHEI Listeners */
function aheiHandler_click() {
	var cardId = 'aheiDrawdown';
	var cardTitle = 'AHEI';
	if(!ahei_i) {
		
		/* Create the card */
		cardBody = dietCreateCard(cardId);
		ahei_i = !ahei_i;
		
		/* Add title to the card */
		dietCreateTitleBurger(cardBody, cardTitle);
		
		/* Add sides */
		var lhs = dietCreateSide(cardBody, '100%', 'left');
		var rhs = dietCreateSide(cardBody, '0%', 'right');
		
		/* Add LHS Table */
		dietCreateTable(lhs, ahei);		
		
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
	} else {
		document.getElementById(cardId).remove();
		ahei_i = !ahei_i;
	}
}

function dashHandler_click() {
	var cardId = 'dashDrawdown';
	var cardTitle = 'DASH';
	if(!dash_i) {
		
		/* Create the card */
		cardBody = dietCreateCard(cardId);
		dash_i = !dash_i;
		
		/* Add title to the card */
		dietCreateTitleBurger(cardBody, cardTitle);
		
		/* Add sides */
		var lhs = dietCreateSide(cardBody, '100%', 'left');
		var rhs = dietCreateSide(cardBody, '0%', 'right');
		
		/* Add LHS Table */
		dietCreateTable(lhs, dash);	
		
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
	} else {
		document.getElementById(cardId).remove();
		dash_i = !dash_i;
	}
}

function nutrisavingsHandler_click() {
	var cardId = 'nutrisavingsDrawdown';
	var cardTitle = 'NutriSavings';
	if(!nutrisavings_i) {
		
		/* Create the card */
		cardBody = dietCreateCard(cardId);
		nutrisavings_i = !nutrisavings_i;
		
		/* Add title to the card */
		dietCreateTitleBurger(cardBody, cardTitle);
		
		/* Add sides */
		var lhs = dietCreateSide(cardBody, '100%', 'left');
		var rhs = dietCreateSide(cardBody, '0%', 'right');
		
		/* Add LHS Table */
		dietCreateTable(lhs, nutrisavings);	
		
		/* Add RHS Plot */
		dietCreatePlot(rhs, nutrisavings, '#'+cardId);
		
		/* Potential DeepDive Card Listener */
		document.getElementById("NutriSavings").addEventListener("click", function() {
			document.getElementById(cardId).remove();
			nutrisavings_i = !nutrisavings_i;
		});
	} else {
		document.getElementById(cardId).remove();
		nutrisavings_i = !nutrisavings_i;
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

	/* Get table data */
	hei_table = {}
	hei_table['Value'] = hei['sum'];
	hei_table['Ideal'] = Array(hei['sum'].length).fill(100);
	hei_table['Date'] = genDateStr(hei['date']);
	hei_table['Source'] = Array(hei['sum'].length).fill('Self-Reported');
	hei_table['colors'] = createDietColors(hei_table['Value'], hei_table['Ideal']);
	hei['tableData'] = hei_table;
	hei['tableData']['headers'] = ['Value', 'Date', 'Source'];
	
	ahei_table = {}
	ahei_table['Value'] = ahei['sum'];
	ahei_table['Ideal'] = Array(ahei['sum'].length).fill(87.5);
	ahei_table['Date'] = genDateStr(ahei['date']);
	ahei_table['Source'] = Array(ahei['sum'].length).fill('Self-Reported');
	ahei_table['colors'] = createDietColors(ahei_table['Value'], ahei_table['Ideal']);
	ahei['tableData'] = ahei_table;
	ahei['tableData']['headers'] = ['Value', 'Date', 'Source'];
	
	dash_table = {}
	dash_table['Value'] = dash['sum'];
	dash_table['Ideal'] = Array(dash['sum'].length).fill(9);
	dash_table['Date'] = genDateStr(dash['date']);
	dash_table['Source'] = Array(dash['sum'].length).fill('Self-Reported');
	dash_table['colors'] = createDietColors(dash_table['Value'], dash_table['Ideal']);
	dash['tableData'] = dash_table;
	dash['tableData']['headers'] = ['Value', 'Date', 'Source'];
	
	nutrisavings_table = {}
	nutrisavings_table['Value'] = nutrisavings['sum'];
	nutrisavings_table['Ideal'] = Array(nutrisavings['sum'].length).fill(100);
	nutrisavings_table['Date'] = genDateStr(nutrisavings['date']);
	nutrisavings_table['Source'] = Array(nutrisavings['sum'].length).fill('Kroger');
	nutrisavings_table['colors'] = createDietColors(nutrisavings_table['Value'], nutrisavings_table['Ideal']);
	nutrisavings['tableData'] = nutrisavings_table;
	nutrisavings['tableData']['headers'] = ['Value', 'Date', 'Source'];
	
	/* Plot Percentages */
	//plotPercentages([hei,ahei,dash]);

}

function createDietColors(values, ideal) {
	retColors = [];
	for(i = 0; i < values.length; i++) {
		if(values[i]/ideal[i] < 0.7) {
			retColors.push('#C21807');
		} else {
			retColors.push('');
		}
	}
	return retColors;
}

function genDateStr(dates) {
	retDates = [];
	for(i = 0; i < dates.length; i++) {
		var tempDate = dates[i].toLocaleString();
		retDates.push(tempDate.split(',')[0]);
	}
	return retDates;
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
		plotVals.push([i, scoreObj['date'][i], scoreObj['sum'][i], scoreObj]);
	}

	var tool_tip = d3.tip()
	  .attr("class", "d3-tip")
	  .offset([-380, -250])
	  .html("<div id='tipDiv' class='card'></div>");

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
	   .style("fill", 'steelblue')
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
			monitorSpider = false;
		}
		else {
			d3.select("#tipDiv").remove();
			showingSpider = false;
			monitorSpider = false;
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
			svg.selectAll("circle").attr("r", 6);
		})

		.on('mouseout', function(d, i){
			d3.select("#tipPercentDiv").remove();  // Remove text location
			svg.selectAll("circle").attr("r", 3);
		});

	/* monitor for click when spider chart is shown */
	d3.select("body").on("click",function(){
		if (showingSpider && monitorSpider) {
			//console.log("removing spider chart");
			d3.select("#tipDiv").remove();
			showingSpider = false;
			monitoringSpider = false;
		}
		else if (showingSpider && !monitorSpider) {
			//console.log("watching to remove spider chart");
			monitorSpider = true;
		}
	});
	//monitorSpider = true;
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
	var w = 480,
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

	/* We want to have a color scale for the %'s */
	var color = function(value) {
					if(value < 0.70) {
						return '#C21807';
					} else {
						return '';
					}
				}

	var value_color = color(propOfIdeal);
	$(loc_val).text(String("" + actTotal.toFixed(1) + "/" + idealTotal.toFixed(1)));
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
	
	//get nutrisavings data
	//currently getting random user
	//the function takes in firstname and lastname. if no match then sends random user info
	var nutriSavingsInfo = getPatientNutritionInfo('','');
	var nutriSavingsScore = parseInt(nutriSavingsInfo.activities.find(
		function (obj) { 
			return obj.activityID === "NS012"; 
		}
	).activityValue);
	var nutriSavingsScoreDate = new Date(nutriSavingsInfo.activities.find(
		function (obj) { 
			return obj.activityID === "NS012"; 
		}
	).activityDate);
	
	
	//var dates = [new Date(2018,0,1), new Date(2018,1,1),new Date(2018,2,1),nutriSavingsScoreDate];
	var dates = [new Date(2018,0,1), new Date(2018,1,1),new Date(2018,2,1),new Date(2018,3,1)];
	var scores = [[], [], [], []];

	for(i = 0; i < dates.length; i++) {
		scores[i][0] = getRandomInt(reference_lo[0], reference_hi[0]);
	}
	
	//replace the randomized nutriSavings score
	scores[3][0] = nutriSavingsScore;

	var retStruct = {comp: [], ref_lo: reference_lo, ref_hi: reference_hi, date: dates, score: scores};
	return retStruct;
}
