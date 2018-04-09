/* Generic create the card */
function createCard(id) {
	/* Create card itself */
	var drawdownCard = d3.select('#summary')
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
function createTitleBurger(cardBody, title) {
	var row = cardBody.append('div')
					  .attr('class', 'row');
						
	row.append('h2') 
	       .attr('class', 'card-title col-sm-11')
	       .attr('id', title)
		   .attr('style', 'cursor: pointer')
	       .text(title);

	row.append('div') 
	       .attr('class', 'glyphicon glyphicon-menu-hamburger pull-right card-hamburger')
	       .attr('aria-hidden', 'true');
}
 
/* Generic create card sides/divisions */
function createSide(cardBody, perc, side) {
	var side = cardBody.append('div')
							.attr('style', 'float:' + side + '; width: ' + perc);
	return side;
}

/* Generic create table */
function createTable(side, data) {
	var tableBody = side.append('table')
							.attr('class', 'deepDiveTable')
						.append('tbody');
	
	createTableHeader(tableBody, data['tableData']['headers']);
	populateTable(tableBody, data['tableData']);
}

/* Generic create table header */
function createTableHeader(tableBody, headers) {
	var tableRow = tableBody.append('tr');
	for(i = 0; i < headers.length; i++) {
		tableRow.append('th')
					.attr('class', 'deepDiveTableLabel')
					.text(headers[i]);
	}
}

/* Generic populate table */
function populateTable(tableBody, data) {
	for(i = 0; i < data['Date'].length; i++) {
		var tempTableRow = tableBody.append('tr');
		
		for(j = 0; j < data['headers'].length; j++) {
			if(data['headers'][j] === 'Value') {
				tempTableRow.append('th')
							.attr('class', 'deepDiveTableLabel')
							.attr('nowrap', 'nowrap')
							.style('color', data['colors'][i])
							.text(data[data['headers'][j]][i]);
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

/* Generic plot data */
function createPlot(side, data, cardName) {
	var pData = data['graphData'];
	var cardData = document.getElementById(cardName.replace('#', ''));
	var cardDim = cardData.getBoundingClientRect();
	
	var width = cardDim.width;
	var height = math.max(cardDim.height, 200);
	
	// Get margin and new height/width
	margin = {top: 30, right: 50, bottom: 30, left: 50};
	width = width - margin.left - margin.right;
	height = height - margin.top - margin.bottom;
	
	// Set y axis scales
	var y_minmax_act = math.min(pData['values']);
	var y_min_ref = math.min(pData['refLo']);
	var y_max_ref = math.max(pData['refHi']);
	var y_min = math.min(y_minmax_act, y_min_ref);
	var y_max = math.max(y_minmax_act, y_max_ref);
	
	y = d3.scale.linear()
				.domain([y_min, y_max])
				.range([height, 0]);
				
	// Set x axis scales
	var x_min = new Date(Math.min.apply(null, pData['dates']));
	var x_max = new Date(Math.max.apply(null, pData['dates']));
	
	x = d3.time.scale()
			   .domain([x_min, x_max])
			   .range([0, width]);
			   
	// Define axes
	var xAxis = d3.svg.axis().scale(x)
					  .orient("bottom")
					  .ticks(4);
					  
	var yAxis = d3.svg.axis().scale(y)
					  .orient("left")
					  .ticks(4);
					  
	// Define line plotting function
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
	var plotLo = [];
	var plotHi = [];
	for(i = 0; i < pData['dates'].length; i++) {
		if(pData['dates'][i] != 'undefined' && 
		   pData['values'][i] != 'undefined' && 
		   pData['refLo'][i] != 'undefined' && 
		   pData['refHi'][i] != 'undefined') {
		
			  plotVals.push([pData['dates'][i], pData['values'][i]]);
			  plotLo.push([pData['dates'][i], pData['refLo'][i]]);
			  plotHi.push([pData['dates'][i], pData['refHi'][i]]);
		   }
	}
	
	svg.append("path")
	   .attr('d', lineFunc(plotVals))
	   .attr('class', 'pathActual');
	   
	svg.append("path")
	   .attr('d', lineFunc(plotLo))
	   .attr('class', 'pathRef');
	   
	svg.append("path")
	   .attr('d', lineFunc(plotHi))
	   .attr('class', 'pathRef');
	   
}

function heightHandler() {
	
	var cardId = 'heightDrawdown';
	var cardTitle = 'Height';
	
	/* Create the card */
	cardBody = createCard(cardId);
	
	/* Add title to the card */
	createTitleBurger(cardBody, cardTitle);
	
	/* Add sides */
	var lhs = createSide(cardBody, '100%', 'left');
	var rhs = createSide(cardBody, '0%', 'right');
	
	/* Add LHS Table */
	createTable(lhs, height_plot_data);
	
	/* Add RHS Plot */
	createPlot(rhs, height_plot_data, '#'+cardId);
	
	/* Potential DeepDive Card Listener */
	document.getElementById("Height").addEventListener("click", function() {
		document.getElementById(cardId).remove();
	});
}

function weightHandler() {
	
	var cardId = 'weightDrawdown';
	var cardTitle = 'Weight';
	
	/* Create the card */
	cardBody = createCard(cardId);
	
	/* Add title to the card */
	createTitleBurger(cardBody, cardTitle);
	
	/* Add sides */
	var lhs = createSide(cardBody, '100%', 'left');
	var rhs = createSide(cardBody, '0%', 'right');
	
	/* Add LHS Table */
	createTable(lhs, weight_plot_data);
	
	/* Add RHS Plot */
	createPlot(rhs, weight_plot_data, '#'+cardId);
	
	/* Potential DeepDive Card Listener */
	document.getElementById("Weight").addEventListener("click", function() {
		document.getElementById(cardId).remove();
	});
}

function bmiHandler() {
	
	var cardId = 'bmiDrawdown';
	var cardTitle = 'BMI';
	
	/* Create the card */
	cardBody = createCard(cardId);
	
	/* Add title to the card */
	createTitleBurger(cardBody, cardTitle);
	
	/* Add sides */
	var lhs = createSide(cardBody, '100%', 'left');
	var rhs = createSide(cardBody, '0%', 'right');
	
	/* Add LHS Table */
	createTable(lhs, bmi_plot_data);
	
	/* Add RHS Plot */
	createPlot(rhs, bmi_plot_data, '#'+cardId);
	
	/* Potential DeepDive Card Listener */
	document.getElementById("BMI").addEventListener("click", function() {
		document.getElementById(cardId).remove();
	});
}

function glucoseHandler() {
	
	var cardId = 'glucoseDrawdown';
	var cardTitle = 'Glucose';
	
	/* Create the card */
	cardBody = createCard(cardId);
	
	/* Add title to the card */
	createTitleBurger(cardBody, cardTitle);
	
	/* Add sides */
	var lhs = createSide(cardBody, '100%', 'left');
	var rhs = createSide(cardBody, '0%', 'right');
	
	/* Add LHS Table */
	createTable(lhs, glucose_plot_data);
	
	/* Add RHS Plot */
	createPlot(rhs, glucose_plot_data, '#'+cardId);
	
	/* Potential DeepDive Card Listener */
	document.getElementById("Glucose").addEventListener("click", function() {
		document.getElementById(cardId).remove();
	});
}

function hba1cHandler() {
	
	var cardId = 'hba1cDrawdown';
	var cardTitle = 'HbA1c';
	
	/* Create the card */
	cardBody = createCard(cardId);
	
	/* Add title to the card */
	createTitleBurger(cardBody, cardTitle);
	
	/* Add sides */
	var lhs = createSide(cardBody, '100%', 'left');
	var rhs = createSide(cardBody, '0%', 'right');
	
	/* Add LHS Table */
	createTable(lhs, hba1c_plot_data);
	
	/* Add RHS Plot */
	createPlot(rhs, hba1c_plot_data, '#'+cardId);
	
	/* Potential DeepDive Card Listener */
	document.getElementById("HbA1c").addEventListener("click", function() {
		document.getElementById(cardId).remove();
	});
}

function bpHandler() {
	
	var cardId = 'bpDrawdown';
	var cardTitle = 'Blood Pressure';
	
	/* Create the card */
	cardBody = createCard(cardId);
	
	/* Add title to the card */
	createTitleBurger(cardBody, cardTitle);
	
	/* Add sides */
	var lhs = createSide(cardBody, '100%', 'left');
	var rhs = createSide(cardBody, '0%', 'right');
	
	/* Add LHS Table */
	createTable(lhs, bp_plot_data);
	
	/* Add RHS Plot */
	createPlot(rhs, bp_plot_data, '#'+cardId);
	
	/* Potential DeepDive Card Listener */
	document.getElementById("Blood Pressure").addEventListener("click", function() {
		document.getElementById(cardId).remove();
	});
}

function cholHandler() {
	
	var cardId = 'cholDrawdown';
	var cardTitle = 'Total Cholesterol';
	
	/* Create the card */
	cardBody = createCard(cardId);
	
	/* Add title to the card */
	createTitleBurger(cardBody, cardTitle);
	
	/* Add sides */
	var lhs = createSide(cardBody, '100%', 'left');
	var rhs = createSide(cardBody, '0%', 'right');
	
	/* Add LHS Table */
	createTable(lhs, totChol_plot_data);
	
	/* Add RHS Plot */
	createPlot(rhs, totChol_plot_data, '#'+cardId);
	
	/* Potential DeepDive Card Listener */
	document.getElementById("Total Cholesterol").addEventListener("click", function() {
		document.getElementById(cardId).remove();
	});
}

function hdlHandler() {
	
	var cardId = 'hdlDrawdown';
	var cardTitle = 'HDL';
	
	/* Create the card */
	cardBody = createCard(cardId);
	
	/* Add title to the card */
	createTitleBurger(cardBody, cardTitle);
	
	/* Add sides */
	var lhs = createSide(cardBody, '100%', 'left');
	var rhs = createSide(cardBody, '0%', 'right');
	
	/* Add LHS Table */
	createTable(lhs, hdl_plot_data);
	
	/* Add RHS Plot */
	createPlot(rhs, hdl_plot_data, '#'+cardId);
	
	/* Potential DeepDive Card Listener */
	document.getElementById("HDL").addEventListener("click", function() {
		document.getElementById(cardId).remove();
	});
} 

function ldlHandler() {
	
	var cardId = 'ldlDrawdown';
	var cardTitle = 'LDL';
	
	/* Create the card */
	cardBody = createCard(cardId);
	
	/* Add title to the card */
	createTitleBurger(cardBody, cardTitle);
	
	/* Add sides */
	var lhs = createSide(cardBody, '100%', 'left');
	var rhs = createSide(cardBody, '0%', 'right');
	
	/* Add LHS Table */
	createTable(lhs, ldl_plot_data);
	
	/* Add RHS Plot */
	createPlot(rhs, ldl_plot_data, '#'+cardId);
	
	/* Potential DeepDive Card Listener */
	document.getElementById("LDL").addEventListener("click", function() {
		document.getElementById(cardId).remove();
	});
} 